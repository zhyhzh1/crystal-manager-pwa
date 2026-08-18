const $ = selector => document.querySelector(selector);
const view = $('#view');
const tabs = [...document.querySelectorAll('.tab')];
const AI_ACCESS_SESSION_KEY = 'crystal_pwa_ai_access_code';
let mineUnlocked = Boolean(sessionStorage.getItem(AI_ACCESS_SESSION_KEY));

const STORAGE = {
  records: 'crystal_pwa_records',
  crystals: 'crystal_pwa_crystals',
  lastResult: 'crystal_pwa_last_result',
  unlocked: 'crystal_pwa_mine_unlocked',
  aiFeedback: 'crystal_pwa_ai_feedback'
};

const ELEMENT_ORDER = ['木', '火', '土', '金', '水'];
const ELEMENT_COLORS = { 木: '#75bc7d', 火: '#df827a', 土: '#bd9566', 金: '#d0b25e', 水: '#72afc2', 综合: '#9fbea3' };
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const STEM_ELEMENT = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
const BRANCH_ELEMENT = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };
const CHARACTER_ELEMENTS = { ...STEM_ELEMENT, ...BRANCH_ELEMENT };
const GENERATES = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const CONTROLS = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
const FOCUS = ['财富', '事业', '感情', '人缘', '健康', '学业', '情绪稳定'];
const CRYSTAL_ELEMENTS = ['木', '火', '土', '金', '水'];
const CRYSTAL_TAGS = ['财富', '事业', '感情', '人缘', '健康', '学业', '情绪稳定', '稳定', '守护', '专注', '沟通', '表达', '成长', '自信', '平衡'];
const CRYSTAL_DIRECTIONS = ['财富', '事业', '感情', '人际', '人缘', '健康', '学业', '情绪稳定', '综合', '日常', '女性', '商务', '收藏', '个人成长'];
const AI_EXTRA_TAGS = ['家庭', '情绪', '温柔', '安全感', '贵人', '智慧', '学习', '女性魅力', '行动力', '积累', '表达', '沟通', '自信', '魅力'];
const AI_EXTRA_DIRECTIONS = ['家庭', '情绪', '学习'];

const HIDDEN_STEMS = {
  子: [{ stem: '癸', weight: 1 }],
  丑: [{ stem: '己', weight: .6 }, { stem: '癸', weight: .2 }, { stem: '辛', weight: .2 }],
  寅: [{ stem: '甲', weight: .6 }, { stem: '丙', weight: .25 }, { stem: '戊', weight: .15 }],
  卯: [{ stem: '乙', weight: 1 }],
  辰: [{ stem: '戊', weight: .6 }, { stem: '乙', weight: .25 }, { stem: '癸', weight: .15 }],
  巳: [{ stem: '丙', weight: .6 }, { stem: '戊', weight: .25 }, { stem: '庚', weight: .15 }],
  午: [{ stem: '丁', weight: .7 }, { stem: '己', weight: .3 }],
  未: [{ stem: '己', weight: .6 }, { stem: '丁', weight: .25 }, { stem: '乙', weight: .15 }],
  申: [{ stem: '庚', weight: .6 }, { stem: '壬', weight: .25 }, { stem: '戊', weight: .15 }],
  酉: [{ stem: '辛', weight: 1 }],
  戌: [{ stem: '戊', weight: .6 }, { stem: '辛', weight: .25 }, { stem: '丁', weight: .15 }],
  亥: [{ stem: '壬', weight: .7 }, { stem: '甲', weight: .3 }]
};

const SEASON_MULTIPLIERS = {
  寅: { 木: 1.55, 火: 1.12, 土: .95, 金: .78, 水: .85 },
  卯: { 木: 1.6, 火: 1.12, 土: .9, 金: .75, 水: .85 },
  辰: { 木: 1.18, 火: 1.05, 土: 1.35, 金: .92, 水: .92 },
  巳: { 木: .98, 火: 1.55, 土: 1.18, 金: .82, 水: .72 },
  午: { 木: .95, 火: 1.6, 土: 1.2, 金: .78, 水: .7 },
  未: { 木: .9, 火: 1.18, 土: 1.42, 金: .94, 水: .76 },
  申: { 木: .78, 火: .82, 土: 1.05, 金: 1.55, 水: 1.12 },
  酉: { 木: .75, 火: .78, 土: 1, 金: 1.6, 水: 1.12 },
  戌: { 木: .82, 火: .96, 土: 1.42, 金: 1.18, 水: .82 },
  亥: { 木: 1.12, 火: .72, 土: .86, 金: .98, 水: 1.55 },
  子: { 木: 1.1, 火: .7, 土: .82, 金: .98, 水: 1.6 },
  丑: { 木: .86, 火: .76, 土: 1.4, 金: 1.08, 水: 1.18 }
};

const ELEMENT_CRYSTALS = {
  金: ['白水晶', '白幽灵', '金发晶', '月光石', '砗磲'],
  木: ['绿幽灵', '绿发晶', '东陵玉', '孔雀石', '绿松石'],
  水: ['海蓝宝', '黑曜石', '黑碧玺', '青金石', '拉长石'],
  火: ['红玛瑙', '石榴石', '南红', '太阳石', '草莓晶'],
  土: ['黄水晶', '虎眼石', '茶晶', '黄玉', '蜜蜡']
};

const FOCUS_CRYSTALS = {
  财富: ['黄水晶', '绿幽灵', '金发晶', '虎眼石', '白水晶'],
  事业: ['黑曜石', '虎眼石', '白水晶', '绿幽灵', '茶晶'],
  感情: ['粉晶', '草莓晶', '月光石', '红玛瑙', '白水晶'],
  人缘: ['粉晶', '草莓晶', '海蓝宝', '月光石', '白水晶'],
  健康: ['黑曜石', '茶晶', '白水晶', '绿幽灵', '玛瑙'],
  学业: ['白水晶', '青金石', '萤石', '海蓝宝', '虎眼石'],
  情绪稳定: ['海蓝宝', '月光石', '黑曜石', '茶晶', '拉长石']
};

const FOCUS_COPY = {
  财富: { theme: '稳健积累与行动感', suitableFor: '希望减少财富选择焦虑、建立稳健行动节奏的顾客' },
  事业: { theme: '专注、执行与稳定推进', suitableFor: '正处于工作调整、项目推进或需要增强行动感的顾客' },
  感情: { theme: '柔和表达与关系连接', suitableFor: '希望在关系中更柔和表达、关注内在感受的顾客' },
  人缘: { theme: '亲和沟通与轻松连接', suitableFor: '希望改善沟通氛围、增加亲和感的顾客' },
  健康: { theme: '日常守护与稳定节奏', suitableFor: '希望提醒自己规律作息、关注身心状态的顾客' },
  学业: { theme: '清晰思路与持续专注', suitableFor: '处于学习、备考或需要持续集中注意力的顾客' },
  情绪稳定: { theme: '舒缓压力与安定内心', suitableFor: '近期压力较多、希望获得安定感与呼吸空间的顾客' }
};

const CRYSTAL_ELEMENT = {};
Object.keys(ELEMENT_CRYSTALS).forEach(element => {
  ELEMENT_CRYSTALS[element].forEach(name => { CRYSTAL_ELEMENT[name] = element; });
});
Object.assign(CRYSTAL_ELEMENT, { 粉晶: '火', 草莓晶: '火', 红玛瑙: '火', 萤石: '木', 玛瑙: '火' });

const AI_CRYSTAL_KNOWLEDGE = {
  青提奶盖: {
    mineralCategory: '岫玉/蛇纹石类',
    element: ['木', '土'],
    tags: ['稳定', '平衡', '人缘'],
    directions: ['家庭', '感情', '日常'],
    role: ['辅助珠'],
    description: '青提奶盖色调清新柔和，适合做温和、日常、亲和感方向的搭配。可作为辅助珠平衡整体色系，也适合给偏好浅绿色、奶油感风格的顾客试戴。',
    aiConfidence: 86,
    aiStatus: 'success'
  },
  绿幽灵: { mineralCategory: '水晶/幽灵水晶类', element: ['木'], tags: ['事业', '财富', '成长', '积累'], directions: ['事业', '财富'], role: ['核心主珠'], description: '适合作为事业财富主题搭配，强调成长、积累与稳定推进。', aiConfidence: 94, aiStatus: 'success' },
  黄水晶: { mineralCategory: '水晶类', element: ['土'], tags: ['财富', '自信', '行动'], directions: ['财富', '事业'], role: ['核心主珠'], description: '适合财富主题搭配，也可作为暖色系主珠增强行动感。', aiConfidence: 94, aiStatus: 'success' },
  海蓝宝: { mineralCategory: '绿柱石类', element: ['水'], tags: ['沟通', '表达', '智慧', '情绪平衡'], directions: ['事业', '感情', '人际'], role: ['核心主珠'], description: '适合沟通表达、人际关系和温和风格主题搭配。', aiConfidence: 92, aiStatus: 'success' },
  白水晶: { mineralCategory: '水晶类', element: ['金'], tags: ['净化', '平衡', '稳定', '专注'], directions: ['事业', '学业', '综合'], role: ['万能辅助珠'], description: '适合作为基础平衡型晶石，用于各种主题手串搭配。', aiConfidence: 95, aiStatus: 'success' },
  草莓晶: { mineralCategory: '水晶类', element: ['火'], tags: ['魅力', '爱情', '自信', '人缘'], directions: ['感情', '人缘'], role: ['主珠'], description: '适合甜美、人缘、感情主题搭配。', aiConfidence: 92, aiStatus: 'success' },
  紫水晶: { mineralCategory: '水晶类', element: ['火', '水'], tags: ['智慧', '学习', '稳定', '思考'], directions: ['学业', '事业', '情绪稳定'], role: ['主珠'], description: '适合智慧、学习和稳定主题搭配。', aiConfidence: 92, aiStatus: 'success' },
  金发晶: { mineralCategory: '发晶类', element: ['金', '土'], tags: ['财富', '事业', '行动力', '自信'], directions: ['财富', '事业'], role: ['核心主珠'], description: '适合财富事业方向搭配。', aiConfidence: 92, aiStatus: 'success' }
};

const AI_KEYWORD_RULES = [
  { keyword: '月光', mineralCategory: '长石类', element: ['水', '金'], tags: ['温柔', '情绪平衡', '人缘'], directions: ['感情', '人际'], role: ['主珠'], confidence: 78 },
  { keyword: '玛瑙', mineralCategory: '玉髓/玛瑙类', element: ['火'], tags: ['稳定', '守护', '平衡'], directions: ['日常', '情绪稳定'], role: ['辅助珠'], confidence: 74 },
  { keyword: '虎眼', mineralCategory: '石英集合体类', element: ['土', '火'], tags: ['勇气', '执行力', '财富', '行动'], directions: ['事业', '财富'], role: ['主珠'], confidence: 78 },
  { keyword: '萤石', mineralCategory: '萤石类', element: ['木', '水'], tags: ['学习', '清晰', '专注', '平衡'], directions: ['学业', '事业'], role: ['辅助珠'], confidence: 76 },
  { keyword: '发晶', mineralCategory: '发晶类', element: ['木'], tags: ['成长', '事业', '财富'], directions: ['事业', '财富'], role: ['主珠'], confidence: 72 },
  { keyword: '超七', mineralCategory: '复合水晶类', element: ['金', '水', '火'], tags: ['综合提升', '事业', '灵感', '平衡'], directions: ['事业', '综合'], role: ['核心主珠'], confidence: 70 },
  { keyword: '蓝', mineralCategory: '蓝色系晶石', element: ['水'], tags: ['沟通', '表达', '冷静'], directions: ['事业', '人际'], role: ['辅助珠'], confidence: 58 },
  { keyword: '绿', mineralCategory: '绿色系晶石', element: ['木'], tags: ['成长', '平衡', '人缘'], directions: ['事业', '人际', '日常'], role: ['辅助珠'], confidence: 58 },
  { keyword: '黄', mineralCategory: '黄色系晶石', element: ['土'], tags: ['稳定', '财富', '积累'], directions: ['财富', '日常'], role: ['辅助珠'], confidence: 56 },
  { keyword: '粉', mineralCategory: '粉色系晶石', element: ['火'], tags: ['温柔', '魅力', '人缘'], directions: ['感情', '人际'], role: ['辅助珠'], confidence: 56 }
];

const DEFAULT_CRYSTALS = [
  { name: '白水晶', element: ['金'], tags: ['净化', '平衡', '稳定', '专注'], directions: ['事业', '学业', '综合'], role: ['万能辅助珠'], description: '适合作为基础平衡型晶石，用于各种主题手串搭配。', status: '上架' },
  { name: '绿幽灵', element: ['木'], tags: ['事业', '财富', '成长', '积累'], directions: ['事业', '财富'], role: ['核心主珠'], description: '适合作为事业财富主题搭配。', status: '上架' },
  { name: '海蓝宝', element: ['水'], tags: ['沟通', '表达', '智慧', '情绪平衡'], directions: ['事业', '感情', '人际'], role: ['核心主珠'], description: '适合沟通表达、人际关系和温和风格主题搭配。', status: '上架' },
  { name: '黄水晶', element: ['土'], tags: ['财富', '自信', '行动'], directions: ['财富', '事业'], role: ['核心主珠'], description: '适合财富主题搭配。', status: '上架' },
  { name: '草莓晶', element: ['火'], tags: ['魅力', '爱情', '自信', '人缘'], directions: ['感情', '人缘'], role: ['主珠'], description: '适合甜美、人缘主题搭配。', status: '上架' },
  { name: '金发晶', element: ['金', '土'], tags: ['财富', '事业', '行动力', '自信'], directions: ['财富', '事业'], role: ['核心主珠'], description: '适合财富事业方向搭配。', status: '上架' },
  { name: '黑曜石', element: ['水'], tags: ['守护', '稳定', '安全感'], directions: ['事业', '情绪稳定'], role: ['主珠'], description: '适合稳定守护主题搭配。', status: '上架' },
  { name: '虎眼石', element: ['土', '火'], tags: ['勇气', '执行力', '财富', '行动'], directions: ['事业', '财富'], role: ['主珠'], description: '适合事业行动主题搭配。', status: '上架' },
  { name: '月光石', element: ['水', '金'], tags: ['温柔', '直觉', '情绪平衡'], directions: ['感情', '人际'], role: ['主珠'], description: '适合温柔清透风格搭配。', status: '上架' },
  { name: '青金石', element: ['水'], tags: ['学习', '智慧', '专注'], directions: ['学业', '事业'], role: ['辅助珠'], description: '适合学习和思考主题搭配。', status: '上架' }
];

function getJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function setJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function uid() { return `${Date.now()}_${Math.random().toString(16).slice(2)}`; }
function recordAIFeedback(result, decision) {
  if (!result?.requestId || !['accepted', 'modified', 'rejected'].includes(decision)) return;
  const feedback = getJSON(STORAGE.aiFeedback, []);
  feedback.unshift({
    requestId: String(result.requestId).slice(0, 200),
    decision,
    candidate: String(result.primaryCategory || '').slice(0, 100),
    confidenceLevel: ['high', 'medium', 'low'].includes(result.confidenceLevel) ? result.confidenceLevel : 'low',
    createdAt: new Date().toISOString()
  });
  setJSON(STORAGE.aiFeedback, feedback.slice(0, 200));
}
function splitList(value) { return String(value || '').split(/[,，、]/).map(item => item.trim()).filter(Boolean); }
function unique(list) { return [...new Set(list.filter(Boolean))]; }
function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function getCrystalImage(crystal) {
  return crystal.image || crystal.imageUrl || '';
}
function crystalInitial(name = '晶') {
  return escapeHTML(String(name).trim().slice(0, 1) || '晶');
}

async function loadInitialCrystals() {
  if (localStorage.getItem(STORAGE.crystals)) return;
  const files = ['./data/crystals.initial.json', './data/crystals.batch2.json', './data/crystals.batch3.json', './data/crystals.batch4.json'];
  try {
    const batches = await Promise.all(files.map(file => fetch(file).then(res => res.ok ? res.json() : [])));
    const all = batches.flat().map(item => ({ ...item, id: uid() }));
    setJSON(STORAGE.crystals, all.length ? all : DEFAULT_CRYSTALS.map(item => ({ ...item, id: uid() })));
  } catch {
    setJSON(STORAGE.crystals, DEFAULT_CRYSTALS.map(item => ({ ...item, id: uid() })));
  }
}

function setActiveTab(name) {
  tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === name));
}
function renderTemplate(id) {
  view.innerHTML = '';
  view.append(document.getElementById(id).content.cloneNode(true));
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function addBackButton(onBack) {
  const page = $('.page');
  if (!page) return;
  page.classList.add('has-back');
  const button = document.createElement('button');
  button.className = 'page-back-btn';
  button.type = 'button';
  button.setAttribute('aria-label', '返回上一页');
  button.textContent = '‹';
  button.onclick = onBack;
  page.prepend(button);
}

function getBazi(form) {
  const [year, month, day] = form.birthDate.split('-').map(Number);
  const [hour, minute] = (form.birthTime || '12:00').split(':').map(Number);
  if (!window.Solar) throw new Error('八字换算工具还没有加载成功，请刷新后再试。');
  const eightChar = window.Solar.fromYmdHms(year, month, day, hour, minute, 0).getLunar().getEightChar();
  return {
    yearPillar: eightChar.getYear(),
    monthPillar: eightChar.getMonth(),
    dayPillar: eightChar.getDay(),
    timePillar: eightChar.getTime()
  };
}
function emptyElements() {
  return Object.fromEntries(ELEMENT_ORDER.map(element => [element, 0]));
}
function addScore(scores, element, amount) {
  if (element) scores[element] += amount;
}
function normalizePercentages(scores) {
  const total = ELEMENT_ORDER.reduce((sum, element) => sum + scores[element], 0) || 1;
  const percentages = {};
  let used = 0;
  ELEMENT_ORDER.forEach((element, index) => {
    if (index === ELEMENT_ORDER.length - 1) {
      percentages[element] = Math.max(0, 100 - used);
    } else {
      percentages[element] = Math.round((scores[element] / total) * 100);
      used += percentages[element];
    }
  });
  return percentages;
}
function analyzeElements(bazi) {
  const scores = emptyElements();
  const pillars = [bazi.yearPillar, bazi.monthPillar, bazi.dayPillar, bazi.timePillar];
  const stemWeights = [.9, 1.2, 1.35, .9];
  const branchWeights = [.75, 1.65, 1, .8];

  pillars.forEach((pillar, index) => {
    const stem = pillar[0];
    const branch = pillar[1];
    addScore(scores, CHARACTER_ELEMENTS[stem], stemWeights[index]);
    addScore(scores, CHARACTER_ELEMENTS[branch], branchWeights[index] * .55);
    (HIDDEN_STEMS[branch] || []).forEach(item => {
      addScore(scores, CHARACTER_ELEMENTS[item.stem], branchWeights[index] * item.weight);
    });
  });

  const season = SEASON_MULTIPLIERS[bazi.monthPillar[1]] || {};
  ELEMENT_ORDER.forEach(element => {
    scores[element] = Number((scores[element] * (season[element] || 1)).toFixed(2));
  });

  const percentages = normalizePercentages(scores);
  return { scores, percentages };
}
function getGeneratingElement(element) {
  return ELEMENT_ORDER.find(item => GENERATES[item] === element);
}
function getControllingElement(element) {
  return ELEMENT_ORDER.find(item => CONTROLS[item] === element);
}
function assessDayMaster(bazi, percentages) {
  const stem = bazi.dayPillar[0];
  const element = CHARACTER_ELEMENTS[stem];
  const resourceElement = getGeneratingElement(element);
  const supportPercent = (percentages[resourceElement] || 0) + (percentages[element] || 0);
  const state = supportPercent >= 46 ? '偏旺' : supportPercent <= 30 ? '偏弱' : '中和';
  return {
    stem,
    element,
    resourceElement,
    companionElement: element,
    supportPercent,
    state,
    text: `${stem}${element}`
  };
}
function chooseUsefulGods(dayMaster, percentages) {
  const outputElement = GENERATES[dayMaster.element];
  const wealthElement = CONTROLS[dayMaster.element];
  const officerElement = getControllingElement(dayMaster.element);
  if (dayMaster.state === '偏旺') return unique([wealthElement, officerElement, outputElement]);
  if (dayMaster.state === '偏弱') return unique([dayMaster.resourceElement, dayMaster.companionElement, outputElement]);
  return [...ELEMENT_ORDER].sort((a, b) => percentages[a] - percentages[b]).slice(0, 3);
}
function makeElementAnalysis(percentages, weakElements, dayMaster) {
  const ordered = ELEMENT_ORDER.map(element => [element, percentages[element]]).sort((a, b) => b[1] - a[1]);
  const strongest = ordered.filter(item => item[1] === ordered[0][1]).map(item => item[0]);
  return `本次采用加权分析：结合天干、地支本气、藏干和月令季节影响。日主为${dayMaster.text}，整体倾向${dayMaster.state}；${strongest.join('、')}能量相对更明显，${weakElements.join('、')}相对偏弱。`;
}
function crystalElementText(crystal) { return Array.isArray(crystal.element) ? crystal.element.join('、') : crystal.element; }
function crystalElements(crystal) {
  return Array.isArray(crystal.element) ? crystal.element : crystal.element ? [crystal.element] : [];
}
function getActiveCrystalLibrary() {
  return getJSON(STORAGE.crystals, DEFAULT_CRYSTALS)
    .filter(item => item && item.name && item.status !== '下架')
    .map(item => ({
      ...item,
      element: crystalElements(item),
      tags: Array.isArray(item.tags) ? item.tags : [],
      directions: Array.isArray(item.directions) ? item.directions : [],
      role: Array.isArray(item.role) ? item.role : item.role ? [item.role] : []
    }));
}
function uniqueCrystals(list) {
  const seen = new Set();
  return list.filter(item => {
    if (!item || !item.name || seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}
function scoreCrystal(crystal, usefulGods = [], focusAreas = []) {
  const elements = crystalElements(crystal);
  let score = elements.filter(element => usefulGods.includes(element)).length * 20;
  score += crystal.directions.filter(direction => focusAreas.includes(direction)).length * 8;
  score += crystal.tags.filter(tag => focusAreas.includes(tag)).length * 6;
  score += crystal.role.some(role => String(role).includes('主珠') || String(role).includes('核心')) ? 2 : 0;
  return score;
}
function sortCrystals(pool, usefulGods = [], focusAreas = []) {
  return [...pool].sort((a, b) => {
    const diff = scoreCrystal(b, usefulGods, focusAreas) - scoreCrystal(a, usefulGods, focusAreas);
    return diff || a.name.localeCompare(b.name, 'zh');
  });
}
function findCrystals(usefulGods, focusAreas = []) {
  const pool = getActiveCrystalLibrary();
  const matched = sortCrystals(pool, usefulGods, focusAreas).filter(item => scoreCrystal(item, usefulGods, focusAreas) > 0);
  return uniqueCrystals(matched.length ? matched : sortCrystals(pool, usefulGods, focusAreas)).slice(0, 10);
}
function bead(crystal, planType, usefulGods) {
  const elements = crystalElements(crystal);
  const matched = elements.find(element => usefulGods.includes(element));
  const reason = matched
    ? `与本次建议补充的${matched}方向呼应，可作为重点搭配参考`
    : `用于丰富${planType}的整体层次与佩戴感受`;
  return { ...crystal, element: elements, reason };
}
function pickPlanCrystals(pool, usefulGods = [], focus = '', limit = 5) {
  const focusAreas = focus ? [focus] : [];
  const priorityNames = FOCUS_CRYSTALS[focus] || [];
  const priority = priorityNames
    .map(name => pool.find(item => item.name === name))
    .filter(Boolean);
  const scored = sortCrystals(pool, usefulGods, focusAreas).filter(item => {
    const score = scoreCrystal(item, usefulGods, focusAreas);
    return score > 0 && !priority.some(priorityItem => priorityItem.name === item.name);
  });
  return uniqueCrystals([...priority, ...scored, ...sortCrystals(pool, usefulGods, focusAreas)]).slice(0, limit);
}
function buildPlans(usefulGods, focusAreas = []) {
  const pool = getActiveCrystalLibrary();
  const baseBeads = pickPlanCrystals(pool, usefulGods, '', 5);
  const plans = [{
    title: '五行基础平衡方案',
    theme: '温和补充偏弱五行，兼顾整体协调',
    mainElements: usefulGods,
    beads: baseBeads.map(item => bead(item, '基础平衡', usefulGods)),
    summary: `本方案以${usefulGods.join('、')}为优先参考，同时保留不同五行的协调感，适合作为店员初次沟通和试戴的基础组合。`,
    suitableFor: '暂时没有单一明确诉求，希望先从五行基础协调方向挑选的顾客'
  }];
  focusAreas.forEach(focus => {
    if (!FOCUS_COPY[focus]) return;
    const focusBeads = pickPlanCrystals(pool, usefulGods, focus, 5);
    const copy = FOCUS_COPY[focus] || { theme: '日常支持与平衡', suitableFor: '希望获得日常搭配参考的顾客' };
    plans.push({
      title: `${focus}方案`,
      theme: copy.theme,
      mainElements: unique(focusBeads.flatMap(item => crystalElements(item))).slice(0, 3),
      beads: focusBeads.map(item => bead(item, focus, usefulGods)),
      summary: `围绕“${focus}”关注方向组合，并参考本次偏弱五行${usefulGods.join('、')}进行协调。店员可结合顾客颜色喜好、预算与试戴感受调整珠子比例。`,
      suitableFor: copy.suitableFor
    });
  });
  return plans;
}
function calculate(form) {
  const bazi = getBazi(form);
  const { scores, percentages } = analyzeElements(bazi);
  const dayMaster = assessDayMaster(bazi, percentages);
  const max = Math.max(...ELEMENT_ORDER.map(e => percentages[e]));
  const min = Math.min(...ELEMENT_ORDER.map(e => percentages[e]));
  const strongest = ELEMENT_ORDER.filter(e => percentages[e] === max);
  const weak = ELEMENT_ORDER.filter(e => percentages[e] === min);
  const usefulGods = chooseUsefulGods(dayMaster, percentages);
  const recommended = findCrystals(usefulGods);
  const now = new Date().toISOString();
  const result = {
    id: uid(),
    createdAt: now,
    updatedAt: now,
    status: 'active',
    ...form,
    bazi,
    fiveElementPercentages: percentages,
    fiveElements: scores,
    elementStatus: { strongest, weak },
    dayMaster,
    strongest,
    weak,
    weakElements: weak,
    usefulGods,
    elementAnalysis: makeElementAnalysis(percentages, weak, dayMaster),
    recommended,
    recommendedCrystals: recommended,
    braceletPlans: buildPlans(usefulGods, form.focusAreas)
  };
  result.detailAnalysis = buildDetailAnalysisData(result);
  return result;
}

function formatDate(value) {
  if (!value) return '-';
  return String(value).slice(0, 10);
}
function asArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}
function buildDetailAnalysisData(result) {
  const main = result.dayMaster?.element || '-';
  const useful = asArray(result.usefulGods)[0] || '-';
  const strong = asArray(result.strongest).join('、') || '-';
  const weak = asArray(result.weak || result.weakElements).join('、') || '-';
  return {
    personalityAnalysis: `日主偏向${main}，五行中${strong}较明显，${weak}相对需要关注。性格表达上可能更适合在稳定节奏里发挥，也适合通过清晰沟通减少内耗。`,
    careerAnalysis: `事业方向可围绕${useful}属性代表的补充感展开，先建立阶段目标，再逐步提升执行节奏。适合店员结合顾客当下状态，用“参考”和“优先考虑”来沟通。`,
    wealthAnalysis: `财富分析只作为倾向参考，不预测具体结果。当前更适合关注预算边界、长期积累和理性选择，让消费与目标感保持平衡。`,
    relationshipAnalysis: `感情与人际上适合关注表达方式和安全感需求。可以鼓励顾客用温和、具体的沟通代替猜测，减少关系里的反复拉扯。`,
    familyAnalysis: `家庭关系中可能会在责任、照顾和自我空间之间寻找平衡。建议把期待和分工说得更具体，让沟通更轻松。`
  };
}
function normalizeCustomerRecord(record) {
  const rawPercentages = record.fiveElementPercentages || record.fiveElements || {};
  const percentages = Object.fromEntries(ELEMENT_ORDER.map(element => [element, Number(rawPercentages[element] || 0)]));
  const strongest = record.strongest || record.elementStatus?.strongest || [];
  const weak = record.weak || record.weakElements || record.elementStatus?.weak || [];
  const libraryNames = new Set(getActiveCrystalLibrary().map(item => item.name));
  const usefulGods = asArray(record.usefulGods);
  const focusAreas = asArray(record.focusAreas);
  const recommended = asArray(record.recommended || record.recommendedCrystals).filter(item => item && libraryNames.has(item.name));
  const plans = asArray(record.braceletPlans);
  const plansNeedRebuild = !plans.length || plans.some(plan => asArray(plan.beads).some(item => !libraryNames.has(item.name)));
  const normalized = {
    ...record,
    id: record.id || uid(),
    name: record.name || '未命名顾客',
    focusAreas,
    remark: record.remark || '',
    status: record.status || 'active',
    createdAt: record.createdAt || new Date().toISOString(),
    updatedAt: record.updatedAt || record.createdAt || new Date().toISOString(),
    fiveElementPercentages: percentages,
    fiveElements: percentages,
    strongest,
    weak,
    elementStatus: record.elementStatus || { strongest, weak },
    weakElements: weak,
    usefulGods,
    recommended: recommended.length ? recommended : findCrystals(usefulGods, focusAreas),
    recommendedCrystals: recommended.length ? recommended : findCrystals(usefulGods, focusAreas),
    braceletPlans: plansNeedRebuild ? buildPlans(usefulGods, focusAreas) : plans
  };
  normalized.detailAnalysis = record.detailAnalysis || buildDetailAnalysisData(normalized);
  return normalized;
}
function getCustomerRecords() {
  const records = getJSON(STORAGE.records, []).map(normalizeCustomerRecord);
  const deduped = [];
  records.forEach(record => {
    const index = deduped.findIndex(item => sameCustomerRecord(item, record));
    if (index < 0) {
      deduped.push(record);
      return;
    }
    const oldTime = new Date(deduped[index].updatedAt || deduped[index].createdAt || 0).getTime();
    const newTime = new Date(record.updatedAt || record.createdAt || 0).getTime();
    if (newTime >= oldTime) deduped[index] = record;
  });
  if (deduped.length !== records.length) saveCustomerRecords(deduped);
  return deduped;
}
function saveCustomerRecords(records) {
  setJSON(STORAGE.records, records.map(normalizeCustomerRecord));
}
function customerFormData(record) {
  return {
    name: record.name,
    gender: record.gender,
    birthDate: record.birthDate,
    birthTime: record.birthTime || '12:00',
    birthPlace: record.birthPlace || '',
    focusAreas: asArray(record.focusAreas),
    remark: record.remark || ''
  };
}
function customerIdentity(record) {
  return [
    record.name,
    record.gender,
    record.birthDate,
    record.birthTime || '12:00',
    record.birthPlace
  ].map(value => String(value || '').trim()).join('|');
}
function sameCustomerRecord(a, b) {
  return customerIdentity(a) === customerIdentity(b);
}
function pad2(value) {
  return String(value).padStart(2, '0');
}
function daysInMonth(year, month) {
  return new Date(Number(year), Number(month), 0).getDate();
}
function setupBirthDatePicker(defaultDate = '') {
  const yearSelect = $('#birthYear');
  const monthSelect = $('#birthMonth');
  const daySelect = $('#birthDay');
  const hiddenInput = $('#birthDateValue');
  if (!yearSelect || !monthSelect || !daySelect || !hiddenInput) return;

  const now = new Date();
  const currentYear = now.getFullYear();
  const [defaultYear, defaultMonth, defaultDay] = (defaultDate || `${currentYear - 30}-01-01`).split('-').map(Number);
  yearSelect.innerHTML = Array.from({ length: currentYear - 1920 + 1 }, (_, index) => {
    const year = currentYear - index;
    return `<option value="${year}">${year}</option>`;
  }).join('');
  monthSelect.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    return `<option value="${pad2(month)}">${pad2(month)}</option>`;
  }).join('');

  const updateDays = () => {
    const year = Number(yearSelect.value);
    const month = Number(monthSelect.value);
    const previousDay = Number(daySelect.value || defaultDay || 1);
    const maxDay = daysInMonth(year, month);
    daySelect.innerHTML = Array.from({ length: maxDay }, (_, index) => {
      const day = index + 1;
      return `<option value="${pad2(day)}">${pad2(day)}</option>`;
    }).join('');
    daySelect.value = pad2(Math.min(previousDay, maxDay));
    hiddenInput.value = `${yearSelect.value}-${monthSelect.value}-${daySelect.value}`;
  };

  yearSelect.value = String(defaultYear || currentYear - 30);
  monthSelect.value = pad2(defaultMonth || 1);
  updateDays();
  daySelect.value = pad2(defaultDay || 1);
  hiddenInput.value = `${yearSelect.value}-${monthSelect.value}-${daySelect.value}`;
  yearSelect.onchange = updateDays;
  monthSelect.onchange = updateDays;
  daySelect.onchange = () => { hiddenInput.value = `${yearSelect.value}-${monthSelect.value}-${daySelect.value}`; };
}

function showHome() {
  setActiveTab('measure');
  renderTemplate('homeTemplate');
  $('#startMeasure').onclick = showForm;
}
function showForm() {
  setActiveTab('measure');
  renderTemplate('formTemplate');
  addBackButton(showHome);
  setupBirthDatePicker();
  $('#focusChips').innerHTML = FOCUS.map(item => `<button class="chip" type="button" data-focus="${item}">${item}</button>`).join('');
  $('#focusChips').onclick = event => {
    const chip = event.target.closest('.chip');
    if (chip) chip.classList.toggle('active');
  };
  $('#measureForm').onsubmit = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const focusAreas = [...document.querySelectorAll('.chip.active')].map(item => item.dataset.focus);
    const form = { ...data, focusAreas, name: data.name.trim(), birthPlace: data.birthPlace.trim(), remark: data.remark.trim() };
    if (!form.name || !form.gender || !form.birthDate || !form.birthTime || !form.birthPlace) {
      alert('请先填写完整出生信息，才能测算五行喜用神哦。');
      return;
    }
    const result = normalizeCustomerRecord(calculate(form));
    const records = getCustomerRecords();
    const sameIndex = records.findIndex(item => sameCustomerRecord(item, result));
    if (sameIndex >= 0) {
      result.id = records[sameIndex].id;
      result.createdAt = records[sameIndex].createdAt;
      result.updatedAt = new Date().toISOString();
      records[sameIndex] = result;
    } else {
      records.unshift(result);
    }
    saveCustomerRecords(records);
    setJSON(STORAGE.lastResult, result);
    showResult(result);
  };
}
function showResult(result = getJSON(STORAGE.lastResult, null), backHandler = showForm) {
  setActiveTab('measure');
  if (!result) return showForm();
  result = normalizeCustomerRecord(result);
  renderTemplate('resultTemplate');
  addBackButton(backHandler);
  $('#resultTitle').textContent = `${result.name}的五行搭配参考`;
  $('#birthSummary').textContent = `${result.gender} · ${result.birthDate} ${result.birthTime} · ${result.birthPlace}`;
  $('#baziPillars').innerHTML = [
    ['年柱', result.bazi.yearPillar],
    ['月柱', result.bazi.monthPillar],
    ['日柱', result.bazi.dayPillar],
    ['时柱', result.bazi.timePillar]
  ].map(([label, value]) => `<div class="pillar"><b>${value}</b><span>${label}</span></div>`).join('');
  $('#dayMasterOrb').textContent = result.dayMaster.element;
  $('#dayMasterOrb').style.background = ELEMENT_COLORS[result.dayMaster.element] || ELEMENT_COLORS.综合;
  $('#dayMasterTitle').textContent = `日主：${result.dayMaster.text}`;
  $('#dayMasterState').textContent = `综合月令、藏干和五行生扶关系，当前倾向：${result.dayMaster.state || '中和'}`;
  $('#dayMasterSupport').textContent = `生扶力量约 ${result.dayMaster.supportPercent || 0}%，可作为店员讲解参考。`;
  $('#elementBars').innerHTML = ELEMENT_ORDER.map(e => `
    <div class="element-row">
      <span>${e}</span><div class="track"><div class="fill" style="width:${Math.max(4, result.fiveElementPercentages[e])}%;background:${ELEMENT_COLORS[e]}"></div></div><span>${result.fiveElementPercentages[e]}%</span>
    </div>`).join('');
  $('#strongestText').textContent = result.strongest.join('、');
  $('#weakText').textContent = result.weak.join('、');
  $('#elementAnalysis').textContent = result.elementAnalysis || `日主为${result.dayMaster.text}，当前五行中${result.strongest.join('、')}相对更明显，${result.weak.join('、')}相对偏弱。结果适合作为店内沟通和水晶搭配参考。`;
  $('#usefulGods').innerHTML = ['第一推荐', '第二推荐', '辅助推荐'].map((label, i) => `<div class="recommend-item"><span>${label}</span><strong>${result.usefulGods[i] || '-'}</strong></div>`).join('');
  $('#pairingAdvice').textContent = `优先选择${result.usefulGods[0]}属性水晶，可搭配${result.usefulGods[1] || result.usefulGods[0]}属性水晶增强整体平衡。`;
  $('#recommendedCrystals').innerHTML = result.recommended.map(item => `<span class="crystal-tag">${item.name} · ${crystalElementText(item)}</span>`).join('');
  $('#braceletPlans').innerHTML = result.braceletPlans.map(plan => `
    <article class="card">
      <h2>${plan.title}</h2>
      <p>${plan.theme}</p>
      <div class="beads">${plan.beads.map(bead => `<div class="bead-item"><div class="bead" style="background:${ELEMENT_COLORS[(bead.element || [])[0]] || ELEMENT_COLORS.综合}"></div>${bead.name}<br>${crystalElementText(bead)}</div>`).join('')}</div>
      <div class="plan-meta"><p>${plan.summary}</p><p>${plan.suitableFor}</p></div>
    </article>`).join('');
  $('#detailBtn').onclick = () => showDetail(result, () => showResult(result, backHandler));
  $('#againBtn').onclick = showForm;
}
function analysisBlock(title, keywords, content) {
  return `<article class="card"><h2>${title}</h2><div class="chips">${keywords.map(k => `<span class="chip active">${k}</span>`).join('')}</div><p>${content}</p></article>`;
}
function showDetail(result = getJSON(STORAGE.lastResult, null), backHandler = () => showResult(result)) {
  setActiveTab('measure');
  if (!result) return showForm();
  result = normalizeCustomerRecord(result);
  renderTemplate('detailTemplate');
  addBackButton(backHandler);
  $('#detailTitle').textContent = `${result.name}的详细分析报告`;
  const main = result.dayMaster.element;
  const useful = result.usefulGods[0];
  $('#detailContent').innerHTML = `
    <article class="card"><h2>个人信息</h2><p>${result.birthDate} ${result.birthTime} · ${result.birthPlace}</p><p>八字：${Object.values(result.bazi).join(' / ')}</p></article>
    ${analysisBlock('性格分析', [`日主${main}`, `${useful}为参考`, '稳定发挥'], `从日主和五行分布来看，性格上可能带有${main}属性对应的表达方式。${result.strongest.join('、')}较明显时，做事容易有自己的节奏；${result.weak.join('、')}偏弱时，可以关注表达、休息和计划之间的平衡。整体更适合在被理解的环境里稳定发挥。`)}
    ${analysisBlock('事业分析', ['长期积累', '阶段目标', `${useful}补充`], `事业上适合把目标拆成可执行的小阶段，先建立稳定节奏，再逐步提高效率。可以优先关注${useful}方向带来的补充，让行动和判断更容易回到平衡。`)}
    ${analysisBlock('财富分析', ['稳健节奏', '理性选择', '不预测结果'], `财富倾向只作沟通参考，不预测具体结果。当前更适合用清单和预算降低选择焦虑，避免一时情绪带来的冲动投入。`)}
    ${analysisBlock('感情分析', ['温和表达', '关系边界', '真实沟通'], `感情模式上可以关注自己需要怎样的回应与安全感。关系里适合把重要想法说清楚，同时保留温和边界，不用单一标签判断关系走向。`)}
    ${analysisBlock('家庭关系分析', ['责任感', '具体分工', '减少内耗'], `家庭关系中可能会自然承担一部分照顾或协调角色。建议把期待、分工和压力说得更具体，既保留责任感，也给自己留下调整空间。`)}
  `;
}

function showMine() {
  setActiveTab('mine');
  if (mineUnlocked) return showManage();
  renderTemplate('mineTemplate');
  addBackButton(showHome);
  $('#unlockMine').onclick = async () => {
    const button = $('#unlockMine');
    const code = $('#minePassword').value.trim();
    if (!code) {
      $('#lockMessage').textContent = '请输入店主口令。';
      return;
    }
    button.disabled = true;
    button.textContent = '正在验证……';
    try {
      const response = await fetch('/.netlify/functions/analyze-crystal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-AI-Access-Code': code },
        body: JSON.stringify({ action: 'verify_access' })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.success) throw new Error(payload.message || '口令验证失败');
      sessionStorage.setItem(AI_ACCESS_SESSION_KEY, code);
      mineUnlocked = true;
      $('#lockMessage').style.color = '#3e7a48';
      $('#lockMessage').textContent = '晶石正在回应你……';
      setTimeout(showManage, 350);
    } catch (error) {
      mineUnlocked = false;
      sessionStorage.removeItem(AI_ACCESS_SESSION_KEY);
      $('#lockMessage').textContent = error.message;
    } finally {
      button.disabled = false;
      button.textContent = '进入管理';
    }
  };
}
function showManage() {
  setActiveTab('mine');
  if (!mineUnlocked) return showMine();
  renderTemplate('manageTemplate');
  addBackButton(showHome);
  const feedback = getJSON(STORAGE.aiFeedback, []);
  const count = decision => feedback.filter(item => item.decision === decision).length;
  $('#aiFeedbackSummary').textContent = feedback.length
    ? `已采用 ${count('accepted')} 次 · 人工修改 ${count('modified')} 次 · 不采用 ${count('rejected')} 次`
    : '当前设备暂无反馈记录。';
  $('#customerEntry').onclick = showRecords;
  $('#crystalEntry').onclick = showCrystals;
}
function showRecords() {
  setActiveTab('mine');
  renderTemplate('recordsTemplate');
  addBackButton(showManage);
  let activeFocus = '全部';
  const filters = ['全部', ...FOCUS];
  $('#customerFocusFilters').innerHTML = filters.map(item => `<button class="chip ${item === activeFocus ? 'active' : ''}" type="button" data-filter="${item}">${item}</button>`).join('');
  const render = () => {
    try {
      const q = $('#recordSearch').value.trim();
      let records = getCustomerRecords();
      if (q) {
        records = records.filter(item => `${item.name || ''} ${item.remark || ''}`.includes(q));
      }
      if (activeFocus !== '全部') {
        records = records.filter(item => asArray(item.focusAreas).includes(activeFocus));
      }
      $('#recordsList').innerHTML = records.length ? records.map(renderCustomerCard).join('') : `
        <article class="card empty-state">
          <h2>暂无顾客资料</h2>
          <p>可以先回到首页录入顾客信息</p>
        </article>`;
    } catch {
      $('#recordsList').innerHTML = '<p class="disclaimer">顾客资料加载失败，请稍后重试</p>';
    }
  };
  $('#recordsList').innerHTML = '<p class="disclaimer">正在加载顾客资料……</p>';
  $('#recordSearch').oninput = render;
  $('#customerFocusFilters').onclick = event => {
    const chip = event.target.closest('[data-filter]');
    if (!chip) return;
    activeFocus = chip.dataset.filter;
    [...document.querySelectorAll('#customerFocusFilters .chip')].forEach(item => item.classList.toggle('active', item.dataset.filter === activeFocus));
    render();
  };
  $('#recordsList').onclick = event => {
    const reportId = event.target.dataset.report;
    const recalcId = event.target.dataset.recalc;
    const editId = event.target.dataset.editCustomer;
    const delId = event.target.dataset.del;
    const records = getCustomerRecords();
    if (reportId) {
      const record = records.find(item => item.id === reportId);
      if (record) {
        setJSON(STORAGE.lastResult, record);
        showResult(record, showRecords);
      }
    }
    if (recalcId) {
      const oldRecord = records.find(item => item.id === recalcId);
      if (!oldRecord) return;
      if (!confirm('是否使用该顾客资料重新测算？新的结果会覆盖旧结果。')) return;
      const recalculated = normalizeCustomerRecord(calculate(customerFormData(oldRecord)));
      recalculated.id = oldRecord.id;
      recalculated.createdAt = oldRecord.createdAt;
      recalculated.updatedAt = new Date().toISOString();
      const nextRecords = records.map(item => item.id === oldRecord.id ? recalculated : item);
      saveCustomerRecords(nextRecords);
      setJSON(STORAGE.lastResult, recalculated);
      showResult(recalculated, showRecords);
    }
    if (editId) {
      const record = records.find(item => item.id === editId);
      if (record) openCustomerEditor(record, render);
    }
    if (delId && confirm('删除后将无法恢复该顾客资料，确认删除吗？')) {
      // 现在按需求执行真删除；后续如果要软删除，可改成把 status 改为 deleted。
      saveCustomerRecords(records.filter(item => item.id !== delId));
      render();
    }
  };
  render();
}

function renderCustomerCard(item) {
  const focusText = asArray(item.focusAreas).join('、') || '未填写';
  const usefulText = asArray(item.usefulGods).join('、') || '-';
  const strongText = asArray(item.strongest).join('、') || '-';
  const weakText = asArray(item.weak || item.weakElements).join('、') || '-';
  const remark = item.remark ? escapeHTML(item.remark).slice(0, 42) : '暂无备注';
  return `
    <article class="card record-card customer-card">
      <h3>${escapeHTML(item.name)}</h3>
      <p>录入时间：${formatDate(item.createdAt)}</p>
      <p>出生：${escapeHTML(item.birthDate || '-')} ${escapeHTML(item.birthTime || '12:00')}</p>
      <div class="customer-line"><span>关注</span><b>${escapeHTML(focusText)}</b></div>
      <div class="customer-line"><span>五行简要</span><b>最旺 ${escapeHTML(strongText)} / 偏弱 ${escapeHTML(weakText)}</b></div>
      <div class="customer-line"><span>喜用神</span><b>${escapeHTML(usefulText)}</b></div>
      <p class="remark-preview">备注：${remark}</p>
      <div class="card-actions customer-actions">
        <button class="ghost-btn" data-report="${item.id}">查看报告</button>
        <button class="ghost-btn" data-recalc="${item.id}">重新测算</button>
        <button class="ghost-btn" data-edit-customer="${item.id}">编辑资料</button>
        <button class="danger-btn" data-del="${item.id}">删除</button>
      </div>
    </article>
  `;
}

function openCustomerEditor(record, onSaved) {
  const dialog = $('#customerDialog');
  const form = $('#customerForm');
  const fields = form.elements;
  fields.id.value = record.id;
  fields.name.value = record.name || '';
  fields.gender.value = record.gender || '';
  fields.birthDate.value = record.birthDate || '';
  fields.birthTime.value = record.birthTime || '12:00';
  fields.remark.value = record.remark || '';
  const selected = asArray(record.focusAreas);
  $('#customerFocusOptions').innerHTML = FOCUS.map(item => `<button class="chip option-chip ${selected.includes(item) ? 'active' : ''}" type="button" data-customer-focus="${item}">${item}</button>`).join('');
  $('#customerFocusOptions').onclick = event => {
    const chip = event.target.closest('[data-customer-focus]');
    if (chip) chip.classList.toggle('active');
  };
  dialog.showModal();
  form.onsubmit = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const records = getCustomerRecords();
    const index = records.findIndex(item => item.id === data.id);
    if (index < 0) return;
    records[index] = normalizeCustomerRecord({
      ...records[index],
      name: data.name.trim(),
      gender: data.gender,
      birthDate: data.birthDate,
      birthTime: data.birthTime || '12:00',
      focusAreas: [...document.querySelectorAll('[data-customer-focus].active')].map(item => item.dataset.customerFocus),
      remark: data.remark.trim(),
      updatedAt: new Date().toISOString()
    });
    saveCustomerRecords(records);
    dialog.close();
    onSaved?.();
  };
}

$('#cancelCustomer').onclick = () => $('#customerDialog').close();
function showCrystals() {
  setActiveTab('mine');
  renderTemplate('crystalsTemplate');
  addBackButton(showManage);
  const render = () => {
    const q = $('#crystalSearch').value.trim();
    const crystals = getJSON(STORAGE.crystals, []).filter(item => {
      const nameMatched = item.name && item.name.includes(q);
      return !q || nameMatched;
    });
    $('#crystalList').innerHTML = crystals.length
      ? crystals.map(renderCrystalCard).join('')
      : '<p class="disclaimer">没有找到匹配的水晶。</p>';
  };
  $('#crystalSearch').oninput = render;
  $('#addCrystal').onclick = () => openCrystalEditor();
  $('#crystalList').onclick = event => {
    const crystals = getJSON(STORAGE.crystals, []);
    const id = event.target.dataset.edit || event.target.dataset.up || event.target.dataset.down || event.target.dataset.del;
    if (!id) return;
    const item = crystals.find(c => c.id === id);
    if (!item) return;
    if (event.target.dataset.edit) openCrystalEditor(item);
    if (event.target.dataset.up) {
      item.status = '上架';
      setJSON(STORAGE.crystals, crystals);
      render();
    }
    if (event.target.dataset.down) {
      item.status = '下架';
      setJSON(STORAGE.crystals, crystals);
      render();
    }
    if (event.target.dataset.del && confirm(`建议优先使用“下架”保留记录。\n\n确认要直接删除「${item.name}」吗？删除后不可恢复。`)) {
      setJSON(STORAGE.crystals, crystals.filter(c => c.id !== id));
      render();
    }
  };
  render();
}

function renderCrystalCard(item) {
  const image = getCrystalImage(item);
  const imageHTML = image
    ? `<img class="crystal-image" src="${escapeHTML(image)}" alt="${escapeHTML(item.name)}" />`
    : `<div class="crystal-image placeholder">${crystalInitial(item.name)}</div>`;
  const tags = (item.tags || []).slice(0, 6).map(tag => `<span>${escapeHTML(tag)}</span>`).join('');
  const directions = (item.directions || []).slice(0, 5).map(tag => `<span>${escapeHTML(tag)}</span>`).join('');
  const isOff = item.status === '下架';
  return `
    <article class="card crystal-card">
      <span class="status ${isOff ? 'off' : ''}">${escapeHTML(item.status || '上架')}</span>
      <div class="crystal-main">
        ${imageHTML}
        <div class="crystal-info">
          <h3>${escapeHTML(item.name)}</h3>
          <p class="crystal-elements">五行：${escapeHTML(crystalElementText(item))}</p>
          <div class="mini-tags">${tags}</div>
          <p class="crystal-directions">方向：${(item.directions || []).length ? directions : '<span>未填写</span>'}</p>
          <p>${escapeHTML(item.description || '暂无简介')}</p>
        </div>
      </div>
      <div class="card-actions crystal-actions">
        <button class="ghost-btn" data-edit="${item.id}">编辑</button>
        ${isOff ? `<button class="ghost-btn" data-up="${item.id}">上架</button>` : `<button class="ghost-btn" data-down="${item.id}">下架</button>`}
        <button class="danger-btn" data-del="${item.id}">删除</button>
      </div>
    </article>
  `;
}

function optionChip(name, selected, group) {
  return `<button class="chip option-chip ${selected ? 'active' : ''}" type="button" data-group="${group}" data-value="${escapeHTML(name)}">${escapeHTML(name)}</button>`;
}
function renderOptionGroup(selector, options, selected, group) {
  $(selector).innerHTML = options.map(name => optionChip(name, selected.includes(name), group)).join('');
}
function refreshCrystalOptionGroups(item = {}) {
  const elements = asArray(item.element);
  const tags = asArray(item.tags);
  const directions = asArray(item.directions);
  renderOptionGroup('#elementOptions', CRYSTAL_ELEMENTS, elements, 'element');
  renderOptionGroup('#tagOptions', unique([...CRYSTAL_TAGS, ...AI_EXTRA_TAGS, ...tags]), tags, 'tags');
  renderOptionGroup('#directionOptions', unique([...CRYSTAL_DIRECTIONS, ...AI_EXTRA_DIRECTIONS, ...directions]), directions, 'directions');
}
function getSelectedOptions(group) {
  return [...document.querySelectorAll(`.option-chip.active[data-group="${group}"]`)].map(item => item.dataset.value);
}
function updateImagePreview(value, name = '晶') {
  const preview = $('#crystalImagePreview');
  if (!preview) return;
  if (value) {
    preview.innerHTML = `<img src="${escapeHTML(value)}" alt="水晶图片预览" />`;
  } else {
    preview.textContent = crystalInitial(name);
  }
}
function compressImageForAI(file, maxSide = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('图片读取失败'));
    };
    image.src = objectUrl;
  });
}

function findConfirmedCrystalByName(name, currentId = '') {
  const normalizedName = String(name || '').trim();
  if (!normalizedName) return null;
  return getJSON(STORAGE.crystals, []).find(item =>
    item.id !== currentId
    && item.name === normalizedName
    && (item.source === 'manual' || item.manualEdited || item.source === 'store_confirmed')
  ) || null;
}
function inferCrystalByKeyword(name) {
  const rule = AI_KEYWORD_RULES.find(item => name.includes(item.keyword));
  if (!rule) return null;
  return {
    name,
    mineralCategory: rule.mineralCategory,
    element: rule.element,
    tags: rule.tags,
    directions: rule.directions,
    role: rule.role,
    description: `${name}可先按${rule.mineralCategory}进行店内分类参考。此名称可能存在不同商品叫法，建议店主结合实物颜色、质地和供应商信息确认后保存。`,
    aiConfidence: rule.confidence,
    aiStatus: rule.confidence >= 80 ? 'success' : 'uncertain',
    source: 'ai'
  };
}
function analyzeCrystalName(name, currentId = '') {
  const cleanName = String(name || '').trim();
  if (!cleanName) return { aiStatus: 'not_found', aiConfidence: 0, message: '请先输入水晶名称。' };
  const confirmed = findConfirmedCrystalByName(cleanName, currentId);
  if (confirmed) {
    return {
      ...confirmed,
      mineralCategory: confirmed.mineralCategory || '本店已保存数据',
      aiConfidence: 100,
      aiStatus: 'success',
      source: 'store_confirmed',
      message: '已找到本店保存过的同名水晶，优先使用本店数据。'
    };
  }
  if (AI_CRYSTAL_KNOWLEDGE[cleanName]) {
    return { name: cleanName, ...AI_CRYSTAL_KNOWLEDGE[cleanName], source: 'ai' };
  }
  const inferred = inferCrystalByKeyword(cleanName);
  if (inferred) return inferred;
  return {
    name: cleanName,
    aiConfidence: 0,
    aiStatus: 'not_found',
    source: 'manual',
    manualEdited: true,
    message: '暂未找到该水晶种类，请手动添加信息。'
  };
}
function fillCrystalForm(result) {
  const form = $('#crystalForm');
  const fields = form.elements;
  fields.name.value = result.name || fields.name.value;
  fields.aiConfidence.value = result.aiConfidence ?? '';
  fields.aiStatus.value = result.aiStatus || '';
  fields.source.value = result.source || 'ai';
  fields.manualEdited.value = result.source === 'store_confirmed' ? 'false' : 'true';
  fields.mineralCategory.value = result.mineralCategory || '';
  if (result.aiStatus === 'not_found' || Number(result.aiConfidence || 0) < 50) return;
  refreshCrystalOptionGroups(result);
  fields.role.value = asArray(result.role).join(',');
  fields.description.value = result.description || '';
}
function renderAIResult(result) {
  const box = $('#aiClassifyResult');
  if (!box) return;
  const confidence = Number(result.aiConfidence || 0);
  const status = result.aiStatus || 'not_found';
  const statusClass = status === 'not_found' || confidence < 50 ? 'not-found' : confidence < 80 ? 'uncertain' : '';
  const title = confidence >= 80
    ? 'AI分析完成，请确认'
    : confidence >= 50
      ? '该水晶名称可能存在多种叫法，请确认或修改'
      : '暂未找到该水晶种类，请手动添加信息。';
  box.className = `ai-result ${statusClass}`;
  box.hidden = false;
  box.innerHTML = `
    <strong>${escapeHTML(title)}</strong>
    <div>水晶名称：${escapeHTML(result.name || '-')}</div>
    <div>可能矿物类别：${escapeHTML(result.mineralCategory || '暂无')}</div>
    <div>AI判断可信度：${confidence}%</div>
    <div>状态：${escapeHTML(status)}</div>
    ${result.message ? `<div>${escapeHTML(result.message)}</div>` : ''}
    <div class="ai-meta">
      ${asArray(result.element).map(item => `<span>五行：${escapeHTML(item)}</span>`).join('')}
      ${asArray(result.tags).map(item => `<span>${escapeHTML(item)}</span>`).join('')}
      ${asArray(result.directions).map(item => `<span>${escapeHTML(item)}</span>`).join('')}
    </div>
  `;
}

function renderRemoteAIResult(result, { onAdopt, onReject }) {
  const box = $('#aiClassifyResult');
  const levelLabels = { high: '较高', medium: '中等', low: '较低' };
  const level = result.confidenceLevel || 'low';
  box.className = `ai-result ${level === 'low' ? 'not-found' : level === 'medium' ? 'uncertain' : ''}`;
  box.hidden = false;
  box.innerHTML = `
    <strong>AI 分析完成，请店员确认</strong>
    <div>首选候选：${escapeHTML(result.primaryCategory || '暂无')}</div>
    <div>其他可能：${escapeHTML(asArray(result.alternatives).join('、') || '暂无')}</div>
    <div>识别可信度：${escapeHTML(levelLabels[level] || '较低')}</div>
    <div>可见特征：${escapeHTML(Object.values(result.visibleFeatures || {}).filter(Boolean).join('；') || '暂无')}</div>
    <div>传统寓意：${escapeHTML(result.traditionalMeaning || '暂无')}</div>
    <div>商品简介：${escapeHTML(result.description || '暂无')}</div>
    ${result.customAnswer ? `<div>补充回答：${escapeHTML(result.customAnswer)}</div>` : ''}
    <div>判断依据：${escapeHTML(asArray(result.evidence).join('、') || '暂无')}</div>
    <div>不确定信息：${escapeHTML(asArray(result.uncertainties).join('、') || '无')}</div>
    <div class="ai-meta">
      ${asArray(result.element).map(item => `<span>五行：${escapeHTML(item)}</span>`).join('')}
      ${asArray(result.tags).map(item => `<span>${escapeHTML(item)}</span>`).join('')}
      ${asArray(result.directions).map(item => `<span>${escapeHTML(item)}</span>`).join('')}
    </div>
    ${level === 'low' ? '<div class="ai-warning">可信度较低，建议补拍清晰照片或人工核对后再采用。</div>' : ''}
    <div class="ai-actions">
      <button class="primary-btn" id="adoptAiSuggestion" type="button">${level === 'low' ? '核对后仍采用' : '采用这份建议'}</button>
      <button class="ghost-btn" id="rejectAiSuggestion" type="button">不采用</button>
    </div>
    <small>本次用量：${Number(result.totalTokens || 0)} tokens。AI 不能鉴定真伪、天然性、产地或实际功效。</small>
  `;
  $('#adoptAiSuggestion').onclick = onAdopt;
  $('#rejectAiSuggestion').onclick = onReject;
}

async function requestCrystalAI({ image, productName, customQuestion }) {
  const accessCode = sessionStorage.getItem(AI_ACCESS_SESSION_KEY) || '';
  const response = await fetch('/.netlify/functions/analyze-crystal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-AI-Access-Code': accessCode },
    body: JSON.stringify({ image, productName, customQuestion })
  });
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) {
    mineUnlocked = false;
    sessionStorage.removeItem(AI_ACCESS_SESSION_KEY);
  }
  if (response.status === 429) throw new Error('AI 请求过于频繁，请稍等一分钟后重试');
  if (!response.ok || !payload.success) throw new Error(payload.message || `AI 请求失败（${response.status}）`);
  return payload.data;
}

function fillRemoteAIForm(result) {
  const mapped = {
    name: result.primaryCategory,
    mineralCategory: result.mineralCategory,
    element: result.element,
    tags: result.tags,
    directions: result.directions,
    role: result.role,
    description: result.description,
    aiConfidence: { high: 90, medium: 65, low: 35 }[result.confidenceLevel] || 35,
    aiStatus: result.confidenceLevel === 'low' ? 'uncertain' : 'success',
    source: 'ai'
  };
  fillCrystalForm(mapped);
}

function openCrystalEditor(item = null) {
  const dialog = $('#crystalDialog');
  const form = $('#crystalForm');
  const fields = form.elements;
  $('#dialogTitle').textContent = item ? '编辑水晶' : '新增水晶';
  fields.id.value = item?.id || '';
  fields.name.value = item?.name || '';
  fields.image.value = getCrystalImage(item || {});
  fields.aiConfidence.value = item?.aiConfidence ?? '';
  fields.aiStatus.value = item?.aiStatus || '';
  fields.source.value = item?.source || (item ? 'manual' : '');
  fields.manualEdited.value = item?.manualEdited ? 'true' : '';
  fields.mineralCategory.value = item?.mineralCategory || '';
  fields.aiRequestId.value = '';
  fields.aiDecision.value = '';
  $('#aiClassifyResult').hidden = true;
  $('#aiClassifyResult').innerHTML = '';
  $('#crystalImageUrl').value = getCrystalImage(item || {});
  refreshCrystalOptionGroups(item || {});
  fields.role.value = (item?.role || []).join(',');
  fields.description.value = item?.description || '';
  fields.status.value = item?.status || '上架';
  updateImagePreview(fields.image.value, fields.name.value);
  let latestAIImage = '';

  const markAIEdited = () => {
    if (fields.aiDecision.value === 'accepted') fields.aiDecision.value = 'modified';
    fields.manualEdited.value = 'true';
  };

  dialog.onclick = event => {
    const chip = event.target.closest('.option-chip');
    if (chip) {
      chip.classList.toggle('active');
      markAIEdited();
    }
  };
  fields.name.oninput = () => {
    if (!fields.image.value) updateImagePreview('', fields.name.value);
    markAIEdited();
  };
  fields.role.oninput = markAIEdited;
  fields.description.oninput = markAIEdited;
  const runRemoteAnalysis = async image => {
    const button = $('#aiClassifyCrystal');
    const box = $('#aiClassifyResult');
    button.disabled = true;
    button.textContent = 'AI 正在观察……';
    box.hidden = false;
    box.className = 'ai-result';
    box.innerHTML = '<strong>正在分析图片与商品信息……</strong><div>通常需要数秒，请不要关闭页面。</div>';
    try {
      if (image) latestAIImage = image;
      const result = await requestCrystalAI({
        image: image || latestAIImage || fields.image.value,
        productName: fields.name.value.trim(),
        customQuestion: $('#crystalAiQuestion').value.trim()
      });
      fields.aiRequestId.value = '';
      fields.aiDecision.value = '';
      renderRemoteAIResult(result, {
        onAdopt: () => {
          fillRemoteAIForm(result);
          fields.aiRequestId.value = result.requestId || '';
          fields.aiDecision.value = 'accepted';
          fields.manualEdited.value = 'false';
          $('#adoptAiSuggestion').disabled = true;
          $('#adoptAiSuggestion').textContent = '已采用，可继续人工修改';
          $('#rejectAiSuggestion').disabled = true;
        },
        onReject: () => {
          recordAIFeedback(result, 'rejected');
          fields.aiRequestId.value = '';
          fields.aiDecision.value = 'rejected';
          $('#adoptAiSuggestion').disabled = true;
          $('#rejectAiSuggestion').disabled = true;
          $('#rejectAiSuggestion').textContent = '已记录不采用';
        }
      });
    } catch (error) {
      const fallback = analyzeCrystalName(fields.name.value, fields.id.value);
      box.className = 'ai-result not-found';
      box.innerHTML = `
        <strong>本次分析失败</strong>
        <div>${escapeHTML(error.message)}</div>
        <div class="ai-actions">
          <button class="primary-btn" id="retryAiAnalysis" type="button">重新尝试</button>
          ${fields.name.value.trim() ? '<button class="ghost-btn" id="useLocalRules" type="button">使用本地规则</button>' : ''}
        </div>
        <small>${fields.name.value.trim() ? '本地规则只根据名称判断，并非视觉模型结果。' : '也可以手动输入名称和分类信息。'}</small>`;
      $('#retryAiAnalysis').onclick = () => runRemoteAnalysis(latestAIImage);
      if ($('#useLocalRules')) $('#useLocalRules').onclick = () => {
        fallback.message = `真实 AI 暂时不可用：${error.message}。这是本地名称规则结果。`;
        renderAIResult(fallback);
        fillCrystalForm(fallback);
      };
    } finally {
      button.disabled = false;
      button.textContent = '重新 AI 分析';
    }
  };
  $('#aiClassifyCrystal').onclick = () => {
    if (!fields.image.value && !fields.name.value.trim()) {
      alert('请先上传图片或输入水晶名称。');
      return;
    }
    runRemoteAnalysis();
  };
  $('#crystalImageUrl').oninput = event => {
    fields.image.value = event.target.value.trim();
    latestAIImage = '';
    updateImagePreview(fields.image.value, fields.name.value);
  };
  $('#crystalImageFile').onchange = async event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件。');
      return;
    }
    const box = $('#aiClassifyResult');
    box.hidden = false;
    box.className = 'ai-result';
    box.innerHTML = '<strong>正在处理手机照片……</strong><div>图片会先压缩，再用于预览、保存和 AI 分析。</div>';
    try {
      const aiImage = await compressImageForAI(file);
      fields.image.value = aiImage;
      latestAIImage = aiImage;
      $('#crystalImageUrl').value = '';
      updateImagePreview(aiImage, fields.name.value);
      await runRemoteAnalysis(aiImage);
    } catch (error) {
      box.className = 'ai-result not-found';
      box.innerHTML = `<strong>图片处理失败</strong><div>${escapeHTML(error.message || '请换一张 JPG、PNG 或系统可预览的照片重试。')}</div>`;
    }
  };
  dialog.showModal();
}

$('#cancelCrystal').onclick = () => $('#crystalDialog').close();
$('#crystalForm').onsubmit = event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const crystals = getJSON(STORAGE.crystals, []);
  const saved = {
    id: data.id || uid(),
    name: data.name.trim(),
    image: data.image || '',
    element: getSelectedOptions('element'),
    tags: getSelectedOptions('tags'),
    directions: getSelectedOptions('directions'),
    role: splitList(data.role),
    description: data.description.trim(),
    status: data.status,
    aiConfidence: data.aiConfidence === '' ? null : Number(data.aiConfidence),
    aiStatus: data.aiStatus || '',
    source: data.source || 'manual',
    manualEdited: data.manualEdited === 'true' || data.source !== 'ai',
    mineralCategory: data.mineralCategory || ''
  };
  if (!saved.name) {
    alert('请填写水晶名称。');
    return;
  }
  if (!saved.element.length) {
    alert('请至少选择一个五行属性。');
    return;
  }
  const index = crystals.findIndex(item => item.id === saved.id);
  if (data.aiRequestId && ['accepted', 'modified'].includes(data.aiDecision)) {
    recordAIFeedback({
      requestId: data.aiRequestId,
      primaryCategory: saved.name,
      confidenceLevel: saved.aiConfidence >= 80 ? 'high' : saved.aiConfidence >= 50 ? 'medium' : 'low'
    }, data.aiDecision);
  }
  if (index >= 0) crystals[index] = saved; else crystals.unshift(saved);
  setJSON(STORAGE.crystals, crystals);
  $('#crystalDialog').close();
  showCrystals();
};

tabs.forEach(tab => tab.onclick = () => tab.dataset.tab === 'measure' ? showHome() : showMine());

if ('serviceWorker' in navigator) {
  let reloadingForUpdate = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadingForUpdate) return;
    reloadingForUpdate = true;
    window.location.reload();
  });
  navigator.serviceWorker.register('./sw.js')
    .then(registration => registration.update())
    .catch(() => {});
}

await loadInitialCrystals();
showHome();
