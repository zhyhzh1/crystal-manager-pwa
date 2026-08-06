const TOKENHUB_URL = 'https://tokenhub.tencentmaas.com/v1/chat/completions';
const MODEL = 'youtu-vita';
const MAX_IMAGE_LENGTH = 7_500_000;

const clean = (value, fallback = '未确定') => typeof value === 'string' && value.trim()
  ? value.trim().slice(0, 500)
  : fallback;

const list = (value, fallback = []) => {
  const result = Array.isArray(value) ? value.map(item => clean(item, '')).filter(Boolean).slice(0, 8) : [];
  return result.length ? result : fallback;
};

function parseJSON(content) {
  const source = String(content || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = source.indexOf('{');
  const end = source.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('模型未返回有效 JSON');
  return JSON.parse(source.slice(start, end + 1));
}

function prompt(productName, customQuestion, hasImage) {
  return `你是水晶零售门店的商品分类助手。${hasImage ? '请优先根据图片中可见信息判断' : '当前没有图片，只能根据名称判断'}。
已知商品名称：${productName || '未提供'}
用户补充问题：${customQuestion || '无'}
请自动返回：候选名称、矿物类别、可见特征、传统五行属性、功能标签、搭配方向、搭配角色、传统寓意和一句门店简介。
搭配方向仅可从财富、事业、感情、人缘、健康、学业、情绪稳定、综合中选择。五行只可从金、木、水、火、土、综合中选择。
五行、标签、方向和寓意必须明确作为传统文化与门店搭配参考。禁止断言真伪、天然性、产地、价值、治疗作用或保证改变财富、事业、感情结果。不确定时必须说明。
不要输出 Markdown，只输出合法 JSON：
{"primaryCategory":"首选候选名称","alternatives":["其他候选"],"mineralCategory":"矿物类别","confidenceLevel":"high|medium|low","visibleFeatures":{"color":"颜色","transparency":"透明度","shape":"形状","luster":"光泽"},"element":["五行"],"tags":["传统搭配标签"],"directions":["搭配方向"],"role":["主珠或辅助珠"],"traditionalMeaning":"传统寓意","description":"一句门店搭配简介","evidence":["可见依据"],"uncertainties":["不确定信息"],"customAnswer":"${customQuestion ? '补充问题的简短回答' : ''}"}`;
}

export default async request => {
  if (request.method !== 'POST') return Response.json({ success: false, message: '仅支持 POST 请求' }, { status: 405 });
  const apiKey = Netlify.env.get('TOKENHUB_API_KEY');
  if (!apiKey) return Response.json({ success: false, message: '网站尚未配置 TOKENHUB_API_KEY' }, { status: 503 });

  try {
    const body = await request.json();
    const image = typeof body.image === 'string' ? body.image.trim() : '';
    const productName = clean(body.productName, '');
    const customQuestion = clean(body.customQuestion, '');
    if (!image && !productName) return Response.json({ success: false, message: '请上传图片或输入水晶名称' }, { status: 400 });
    if (image && (!image.startsWith('data:image/') && !image.startsWith('https://'))) {
      return Response.json({ success: false, message: '图片格式不支持' }, { status: 400 });
    }
    if (image.length > MAX_IMAGE_LENGTH) return Response.json({ success: false, message: '图片过大，请压缩后重试' }, { status: 413 });

    const content = [];
    if (image) content.push({ type: 'image_url', image_url: { url: image } });
    content.push({ type: 'text', text: prompt(productName, customQuestion, Boolean(image)) });
    const upstream = await fetch(TOKENHUB_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, messages: [{ role: 'user', content }], stream: false, temperature: 0.2, max_tokens: 1000 })
    });
    const response = await upstream.json().catch(() => ({}));
    if (!upstream.ok) throw new Error(response.error?.message || `TokenHub 请求失败（${upstream.status}）`);
    const raw = parseJSON(response.choices?.[0]?.message?.content);
    const level = ['high', 'medium', 'low'].includes(raw.confidenceLevel) ? raw.confidenceLevel : 'low';
    const data = {
      primaryCategory: clean(raw.primaryCategory, '暂无明确候选'),
      alternatives: list(raw.alternatives, ['需人工判断']),
      mineralCategory: clean(raw.mineralCategory, '待确认'),
      confidenceLevel: level,
      visibleFeatures: raw.visibleFeatures || {},
      element: list(raw.element, ['综合']),
      tags: list(raw.tags, ['基础平衡']),
      directions: list(raw.directions, ['综合']),
      role: list(raw.role, ['辅助珠']),
      traditionalMeaning: clean(raw.traditionalMeaning, '传统文化搭配寓意需人工确认。'),
      description: clean(raw.description, '适合作为日常手串搭配参考。'),
      evidence: list(raw.evidence),
      uncertainties: list(raw.uncertainties, ['单凭图片无法确认真伪、天然性和产地']),
      customAnswer: clean(raw.customAnswer, ''),
      requestId: response.id || '',
      totalTokens: Number(response.usage?.total_tokens || 0)
    };
    return Response.json({ success: true, data });
  } catch (error) {
    console.error('analyze-crystal failed', error);
    return Response.json({ success: false, message: error.message || 'AI 分析暂时不可用' }, { status: 502 });
  }
};

export const config = { path: '/.netlify/functions/analyze-crystal' };
