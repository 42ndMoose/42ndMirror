import {
  AXIS_CONVENTION,
  CARD_BANK,
  GATES,
  GATE_WEIGHTS,
  LOADS,
  MODES,
  PRESSURES,
  ROUTING_WEIGHTS,
  SCOPES,
  SETTINGS,
  UI_COPY
} from '../data/cards.js';

const AXES = ['empathy', 'practicality', 'wisdom', 'knowledge'];
const PRESSURE_IDS = Object.keys(PRESSURES);
const GATE_IDS = Object.keys(GATES);

const KEYWORD_LOAD_RULES = [
  { key: 'micro', weight: 0.48, rx: /\b(should i|should we|do i|do we|now|today|tonight|eat|sleep|drink|hungry|tired|procrastinat|start|stop|quick|small|minor|lunch|food)\b/i },
  { key: 'practical', weight: 0.26, rx: /\b(do|avoid|allow|ban|choose|decision|work|fix|plan|method|cost|time|money|enforce|execute)\b/i },
  { key: 'causal', weight: 0.34, rx: /\b(came after|came before|cause|caused|origin|first|after|before|timeline|because|leads to|created|born|laid)\b/i },
  { key: 'definitional', weight: 0.3, rx: /\b(counts as|meaning|define|definition|word|label|called|is a|are a|what is|egg|chicken)\b/i },
  { key: 'evidential', weight: 0.3, rx: /\b(probably|proof|evidence|fact|true|false|source|data|study|example|counterexample|claim|belief)\b/i },
  { key: 'moral', weight: 0.28, rx: /\b(fair|right|wrong|moral|harm|hurt|help|duty|deserve|responsible|good|bad)\b/i },
  { key: 'social', weight: 0.32, rx: /\b(friend|friends|group|people|audience|public|clout|win|prove|debate|argue|argument|compare score|higher score)\b/i },
  { key: 'comparative', weight: 0.34, rx: /\b(compare|versus|vs\.?|better than|stronger|weaker|which one|between|wins)\b/i },
  { key: 'affective', weight: 0.2, rx: /\b(feel|feels|angry|sad|annoyed|worried|scared|disgust|like|hate|love)\b/i },
  { key: 'playful', weight: 0.22, rx: /\b(silly|random|joke|meme|funny|just testing|not serious|whatever)\b/i },
  { key: 'stakes', weight: 0.22, rx: /\b(serious|important|danger|risk|controversial|life|job|money|relationship|policy|law)\b/i },
  { key: 'uncertainty', weight: 0.18, rx: /\b(probably|maybe|might|could|unsure|uncertain|guess|seems|i think)\b/i },
  { key: 'score_pressure', weight: 0.28, rx: /\b(score|result|rank|clout|prove|win|higher number|compare results)\b/i }
];

export function getMode(id) {
  return MODES[id] || MODES.fast;
}

export function getScope(id) {
  return SCOPES.find(item => item.id === id) || SCOPES[0];
}

export function getSetting(id) {
  return SETTINGS.find(item => item.id === id) || SETTINGS[0];
}

export function getUICopy(modeId) {
  return getMode(modeId).readingLevel === 'simple' ? UI_COPY.simple : UI_COPY.normal;
}

export function getReadableText(card, modeId) {
  return getMode(modeId).readingLevel === 'simple' ? (card.simple || card.normal) : (card.normal || card.simple);
}

export function getAnswerText(answer, modeId) {
  return getMode(modeId).readingLevel === 'simple' ? (answer.simple || answer.normal) : (answer.normal || answer.simple);
}

export function quoteLabel(label, copy = UI_COPY.normal) {
  const clean = String(label || '').trim();
  return `“${clean || copy.noLabel || 'Untitled scope'}”`;
}

function zero(keys) {
  return Object.fromEntries(keys.map(k => [k, 0]));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function addVector(target, source = {}, scale = 1) {
  for (const [key, value] of Object.entries(source || {})) {
    if (typeof target[key] !== 'number') target[key] = 0;
    target[key] += (Number(value) || 0) * scale;
  }
}

function normalizeVector(vector, keys, floor = 0) {
  const out = zero(keys);
  let total = 0;
  for (const key of keys) {
    out[key] = Math.max(floor, Number(vector[key]) || 0);
    total += out[key];
  }
  if (total <= 1e-9) {
    const even = 1 / keys.length;
    for (const key of keys) out[key] = even;
    return out;
  }
  for (const key of keys) out[key] = out[key] / total;
  return out;
}

function dot(a = {}, b = {}) {
  let total = 0;
  for (const [key, value] of Object.entries(a)) total += (Number(value) || 0) * (Number(b[key]) || 0);
  return total;
}

function topEntries(vector, count = 4, labelMap = null) {
  return Object.entries(vector)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key, value]) => ({ key, label: labelMap?.[key]?.label || key.replace(/_/g, '-'), value: round(value, 3) }));
}

function round(value, digits = 6) {
  return Number((Number(value) || 0).toFixed(digits));
}

export function analyzeScopeLabel(label = '', scopeId = 'claim', settingId = 'private') {
  const text = String(label || '');
  const lower = text.toLowerCase();
  const loadSeed = zero(LOADS);
  const hits = [];

  addVector(loadSeed, getScope(scopeId).bias, 1);
  addVector(loadSeed, getSetting(settingId).bias, 1);

  for (const rule of KEYWORD_LOAD_RULES) {
    if (rule.rx.test(lower)) {
      loadSeed[rule.key] += rule.weight;
      hits.push(`${rule.key}+${rule.weight.toFixed(2)}`);
    }
  }

  const wordCount = lower.split(/\s+/).filter(Boolean).length;
  if (wordCount <= 4) {
    loadSeed.playful += 0.08;
    loadSeed.uncertainty += 0.04;
    hits.push('short_scope+0.12');
  }
  if (/[?]/.test(text)) {
    loadSeed.uncertainty += 0.08;
    hits.push('question+0.08');
  }

  const loads = normalizeVector(loadSeed, LOADS, 0.01);
  return {
    loads,
    confidence: concentration(loads),
    top: topEntries(loads, 5),
    hits,
    word_count: wordCount
  };
}

function concentration(vector = {}) {
  const values = Object.values(vector).sort((a, b) => b - a);
  if (!values.length) return 0;
  return clamp((values[0] - (values[2] || 0)) * 2.4 + values[0] * 0.8, 0, 1);
}

export function makeInitialState({ modeId = 'fast', scope = 'claim', setting = 'private', claim = '' } = {}) {
  const route = analyzeScopeLabel(claim, scope, setting);
  const state = {
    repo: '42ndMirror',
    modeId,
    scope,
    setting,
    claim: String(claim || '').trim(),
    maxCards: getMode(modeId).maxCards,
    askedCardIds: [],
    answers: [],
    loads: clone(route.loads),
    coverage: zero(AXES),
    axes: zero(AXES),
    gates: zero(GATE_IDS),
    quality: {},
    pressureVector: zero(PRESSURE_IDS),
    pressureLog: [],
    routeLog: [{ step: 0, type: 'seed', loads: clone(route.loads), top: route.top, confidence: route.confidence, hits: route.hits }],
    selectionLog: [],
    currentSelection: null,
    startedAt: Date.now(),
    lastCardAt: Date.now(),
    timing: [],
    pressureTarget: null,
    balancedRun: 0
  };

  seedPressureFromLoads(state);
  updatePressureTarget(state);
  return state;
}

function seedPressureFromLoads(state) {
  const p = state.pressureVector;
  p.proof_cost += (state.loads.evidential || 0) * 0.3 + (state.loads.causal || 0) * 0.16 + (state.loads.definitional || 0) * 0.1;
  p.context_cost += (state.loads.definitional || 0) * 0.22 + (state.loads.comparative || 0) * 0.18 + (state.loads.uncertainty || 0) * 0.16;
  p.person_cost += (state.loads.moral || 0) * 0.24 + (state.loads.social || 0) * 0.14 + (state.loads.consequence || 0) * 0.12;
  p.constraint_cost += (state.loads.practical || 0) * 0.22 + (state.loads.micro || 0) * 0.14 + (state.loads.consequence || 0) * 0.12;
}

export function getNextCard(state) {
  if (!state || state.askedCardIds.length >= state.maxCards) return null;
  if (shouldStopEarly(state)) return null;

  const candidates = CARD_BANK.filter(card => isCandidateCompatible(card, state));
  if (!candidates.length) return null;

  const scored = candidates.map(card => scoreCard(card, state)).sort((a, b) => b.total - a.total);
  const selected = scored[0];
  state.currentSelection = makeSelectionLog(selected, scored.slice(0, 4), state);
  return selected.card;
}

function shouldStopEarly(state) {
  const n = state.askedCardIds.length;
  if (n < 4) return false;
  if (state.askedCardIds.includes('final_commitment_01')) return true;
  const microMass = (state.loads.micro || 0) + (state.loads.practical || 0) * 0.45 + (state.loads.playful || 0) * 0.35;
  const heavyMass = (state.loads.moral || 0) + (state.loads.social || 0) + (state.loads.stakes || 0) + (state.loads.score_pressure || 0);
  if (microMass > 0.48 && heavyMass < 0.35 && n >= 5) return true;
  if ((state.quality.low_stakes || 0) >= 2 && n >= 5) return true;
  return false;
}

function isCandidateCompatible(card, state) {
  if (state.askedCardIds.includes(card.id)) return false;
  const n = state.askedCardIds.length;
  if (card.fixedFirst && n !== 0) return false;
  if (!card.fixedFirst && n === 0) return false;
  if (card.stage === 'mid' && n < 1) return false;
  if (card.pressureCard && n < 3) return false;
  const lateFloor = Math.max(4, state.maxCards - 3);
  if (card.stage === 'late' && n < lateFloor) return false;
  if (card.id === 'score_pressure_01') {
    const socialMass = (state.loads.social || 0) + (state.loads.score_pressure || 0);
    if (socialMass < 0.14 && state.setting === 'private') return false;
  }
  if (card.pressureCard && state.pressureTarget && card.pressureCard !== state.pressureTarget) {
    return false;
  }
  return true;
}

function scoreCard(card, state) {
  const n = state.askedCardIds.length;
  const stageFit = stageScore(card.stage, n, state.maxCards);
  const routeFit = dot(card.routes || {}, state.loads);
  const pressureFit = scorePressureFit(card, state);
  const gapFit = coverageGapFit(card, state);
  const gateFit = gateNeedFit(card, state);
  const stage = stageFit;
  const penalty = repeatFamilyPenalty(card, state) + scopeMismatchPenalty(card, state);
  const total =
    routeFit * ROUTING_WEIGHTS.route +
    pressureFit * ROUTING_WEIGHTS.pressure +
    gapFit * ROUTING_WEIGHTS.gap +
    gateFit * ROUTING_WEIGHTS.gate +
    stage * ROUTING_WEIGHTS.stage -
    penalty;

  return {
    card,
    total: round(total),
    parts: {
      route: round(routeFit * ROUTING_WEIGHTS.route),
      pressure: round(pressureFit * ROUTING_WEIGHTS.pressure),
      gap: round(gapFit * ROUTING_WEIGHTS.gap),
      gate: round(gateFit * ROUTING_WEIGHTS.gate),
      stage: round(stage * ROUTING_WEIGHTS.stage),
      penalty: round(penalty)
    },
    raw: { routeFit: round(routeFit), pressureFit: round(pressureFit), gapFit: round(gapFit), gateFit: round(gateFit), stageFit: round(stage) }
  };
}

function scorePressureFit(card, state) {
  let base = dot(card.pressures || {}, normalizeVector(state.pressureVector, PRESSURE_IDS, 0.01));
  if (state.pressureTarget && card.pressureCard === state.pressureTarget) base += 0.72;
  if (state.pressureTarget && card.pressures?.[state.pressureTarget]) base += card.pressures[state.pressureTarget] * 0.25;
  return base;
}

function coverageGapFit(card, state) {
  const axisNeeds = axisDeficits(state);
  const cardAxis = cardPotentialAxes(card);
  return dot(axisNeeds, cardAxis);
}

function gateNeedFit(card, state) {
  const needs = {};
  for (const gate of GATE_IDS) needs[gate] = clamp(0.55 - (state.gates[gate] || 0), 0, 1);
  return dot(needs, card.gates || {});
}

function cardPotentialAxes(card) {
  const out = zero(AXES);
  for (const answer of card.answers || []) addVector(out, answer.effects?.axes, 1 / (card.answers.length || 1));
  return normalizeVector(out, AXES, 0);
}

function axisDeficits(state) {
  const out = zero(AXES);
  for (const axis of AXES) out[axis] = clamp(0.55 - (state.coverage[axis] || 0), 0, 1);
  const asym = currentAsymmetry(state);
  if (asym?.oppositeAxis) out[asym.oppositeAxis] += 0.55;
  return normalizeVector(out, AXES, 0.01);
}

function repeatFamilyPenalty(card, state) {
  if (!card.pressureCard) return 0;
  const askedPressureCards = state.askedCardIds
    .map(id => CARD_BANK.find(card => card.id === id)?.pressureCard)
    .filter(Boolean);
  return askedPressureCards.includes(card.pressureCard) ? 0.24 : 0;
}

function scopeMismatchPenalty(card, state) {
  if (card.id === 'micro_live_constraint_01') {
    const micro = (state.loads.micro || 0) + (state.loads.playful || 0);
    return micro < 0.14 ? 0.22 : 0;
  }
  if (card.id === 'score_pressure_01') {
    const social = (state.loads.social || 0) + (state.loads.score_pressure || 0);
    return social < 0.18 ? 0.28 : 0;
  }
  return 0;
}

function stageScore(stage, n, max) {
  const progress = max <= 1 ? 1 : n / (max - 1);
  if (stage === 'early') return clamp(1 - Math.abs(progress - 0.18) * 2.2, 0, 1);
  if (stage === 'mid') return clamp(1 - Math.abs(progress - 0.52) * 2.0, 0, 1);
  if (stage === 'late') return clamp(1 - Math.abs(progress - 0.86) * 2.4, 0, 1);
  return 0.5;
}

function makeSelectionLog(selected, top, state) {
  return {
    step: state.askedCardIds.length + 1,
    selected: selected.card.id,
    selected_title: selected.card.normal?.title || selected.card.id,
    pressure_target: state.pressureTarget,
    formula: 'S=.44R+.26P+.16C+.08G+.06T-penalty',
    score: selected.total,
    parts: selected.parts,
    raw: selected.raw,
    top: top.map(item => ({ id: item.card.id, score: item.total, parts: item.parts }))
  };
}

export function recordAnswer(state, card, answer) {
  const now = Date.now();
  const elapsedMs = now - (state.lastCardAt || now);
  state.lastCardAt = now;

  const effects = answer.effects || {};
  state.askedCardIds.push(card.id);
  state.timing.push({ card_id: card.id, elapsed_ms: elapsedMs });

  const beforeLoads = clone(state.loads);
  const beforePressure = clone(state.pressureVector);
  const beforeAsymmetry = currentAsymmetry(state);

  addVector(state.axes, effects.axes, 1);
  addVector(state.coverage, effects.axes, 0.75);
  addVector(state.loads, effects.loads, 0.9);
  state.loads = normalizeVector(state.loads, LOADS, 0.005);
  addVector(state.gates, effects.gates, 1);
  for (const gate of GATE_IDS) state.gates[gate] = clamp(state.gates[gate], -1.2, 1.2);
  addVector(state.quality, effects.quality, 1);
  addVector(state.pressureVector, effects.pressureNext, 1);
  nudgeOppositePressureFromAnswer(state, effects.axes || {});

  const pressureEvent = classifyPressureResponse(state, card, answer, beforeAsymmetry);
  if (pressureEvent) state.pressureLog.push(pressureEvent);

  updateBalanceRun(state);
  updatePressureTarget(state);

  const answerLog = {
    step: state.answers.length + 1,
    card_id: card.id,
    answer_id: answer.id,
    answer_label: answer.normal?.main || answer.id,
    elapsed_ms: elapsedMs,
    before_loads: beforeLoads,
    after_loads: clone(state.loads),
    before_pressure: beforePressure,
    after_pressure: clone(state.pressureVector),
    pressure_event: pressureEvent
  };

  state.answers.push(answerLog);
  state.routeLog.push({
    step: state.answers.length,
    type: 'answer',
    answer: answer.id,
    loads_top: topEntries(state.loads, 5),
    pressure_top: topEntries(normalizeVector(state.pressureVector, PRESSURE_IDS, 0.01), 4, PRESSURES),
    pressure_target: state.pressureTarget,
    asymmetry: currentAsymmetry(state),
    gates: clone(state.gates),
    quality: clone(state.quality)
  });

  if (state.currentSelection) state.selectionLog.push(state.currentSelection);
  state.currentSelection = null;
  return state;
}

function updateBalanceRun(state) {
  const vals = AXES.map(axis => state.axes[axis] || 0);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  if (max > 0.25 && max - min < 0.2) state.balancedRun += 1;
  else state.balancedRun = Math.max(0, state.balancedRun - 1);
  if (state.balancedRun >= 2) {
    state.loads.uncertainty += 0.06;
    state.loads.social += (state.loads.score_pressure || 0) > 0.07 ? 0.05 : 0;
    state.quality.smooth_balance_pattern = (state.quality.smooth_balance_pattern || 0) + 0.2;
  }
}

function nudgeOppositePressureFromAnswer(state, axisEffects = {}) {
  const e = Number(axisEffects.empathy || 0);
  const p = Number(axisEffects.practicality || 0);
  const w = Number(axisEffects.wisdom || 0);
  const k = Number(axisEffects.knowledge || 0);
  if (e > p + 0.1) state.pressureVector.constraint_cost += (e - p) * 0.36;
  if (p > e + 0.1) state.pressureVector.person_cost += (p - e) * 0.36;
  if (w > k + 0.1) state.pressureVector.proof_cost += (w - k) * 0.36;
  if (k > w + 0.1) state.pressureVector.context_cost += (k - w) * 0.36;
}

function classifyPressureResponse(state, card, answer, beforeAsymmetry) {
  if (!card.pressureCard && !answer.effects?.pressureResponse) return null;
  const response = answer.effects?.pressureResponse || 'unknown';
  const target = card.pressureCard || state.pressureTarget || null;
  const event = {
    card_id: card.id,
    target,
    response,
    previous_asymmetry: beforeAsymmetry,
    impact: pressureImpact(response)
  };
  if (response === 'integrate') {
    state.gates.counter_consideration += 0.08;
    state.gates.contradiction_handling += 0.06;
    state.quality.pressure_integrated = (state.quality.pressure_integrated || 0) + 1;
  } else if (response === 'principled_reject') {
    state.gates.counter_consideration += 0.06;
    state.gates.reality_contact += 0.04;
    state.quality.asymmetry_survived = (state.quality.asymmetry_survived || 0) + 1;
  } else if (response === 'dismiss') {
    state.gates.counter_consideration -= 0.05;
    state.gates.non_sealing -= 0.07;
    state.quality.pressure_dismissed = (state.quality.pressure_dismissed || 0) + 1;
  } else if (response === 'dodge') {
    state.gates.reality_contact -= 0.08;
    state.gates.contradiction_handling -= 0.08;
    state.quality.pressure_dodged = (state.quality.pressure_dodged || 0) + 1;
  }
  return event;
}

function pressureImpact(response) {
  return {
    integrate: 'missing load included',
    principled_reject: 'asymmetry retained after pressure',
    dismiss: 'pressure dismissed with weaker accounting',
    dodge: 'pressure avoided or appearance-managed'
  }[response] || 'recorded';
}

function updatePressureTarget(state) {
  const asym = currentAsymmetry(state);
  const pressureNorm = normalizeVector(state.pressureVector, PRESSURE_IDS, 0.01);
  let target = topEntries(pressureNorm, 1)[0]?.key || null;

  if (asym && asym.magnitude >= 0.18 && !recentlyPressed(state, asym.oppositePressure)) {
    target = asym.oppositePressure;
  }

  if ((state.quality.low_stakes || 0) > 1.8 && state.askedCardIds.length >= 3) {
    target = null;
  }

  state.pressureTarget = target;
}

function recentlyPressed(state, pressureId) {
  if (!pressureId) return false;
  const recent = state.askedCardIds.slice(-2);
  return recent.some(id => CARD_BANK.find(card => card.id === id)?.pressureCard === pressureId);
}

function currentAsymmetry(state) {
  const e = state.axes.empathy || 0;
  const p = state.axes.practicality || 0;
  const w = state.axes.wisdom || 0;
  const k = state.axes.knowledge || 0;
  const ep = e - p;
  const wk = w - k;
  const candidates = [
    ep > 0 ? { axis: 'empathy', oppositeAxis: 'practicality', oppositePressure: 'constraint_cost', magnitude: Math.abs(ep), pair: 'empathy/practicality' } : { axis: 'practicality', oppositeAxis: 'empathy', oppositePressure: 'person_cost', magnitude: Math.abs(ep), pair: 'empathy/practicality' },
    wk > 0 ? { axis: 'wisdom', oppositeAxis: 'knowledge', oppositePressure: 'proof_cost', magnitude: Math.abs(wk), pair: 'wisdom/knowledge' } : { axis: 'knowledge', oppositeAxis: 'wisdom', oppositePressure: 'context_cost', magnitude: Math.abs(wk), pair: 'wisdom/knowledge' }
  ];
  const top = candidates.sort((a, b) => b.magnitude - a.magnitude)[0];
  if (!top || top.magnitude < 0.08) return null;
  return top;
}

export function finalizeProfile(state) {
  const axesRaw = clone(state.axes);
  const gateScore = weightedGateScore(state.gates);
  const quality = qualityAdjustment(state);
  const yRaw = clamp(gateScore + quality.yBonus - quality.yPenalty, -1, 1);

  let xRaw = (axesRaw.empathy || 0) - (axesRaw.practicality || 0);
  let zRaw = (axesRaw.wisdom || 0) - (axesRaw.knowledge || 0);

  const asymmetry = currentAsymmetry(state);
  const pressureSummary = summarizePressure(state);

  if (pressureSummary.integrated + pressureSummary.survived === 0 && asymmetry?.magnitude > 0.35) {
    // Asymmetry that never saw pressure should remain more tentative.
    xRaw *= 0.85;
    zRaw *= 0.85;
  }
  if ((state.quality.low_stakes || 0) > 1.8) {
    xRaw *= 0.75;
    zRaw *= 0.75;
  }

  const coordinates = projectToOctahedron({ x: xRaw, y: yRaw, z: zRaw });
  const surfaceCheck = Math.abs(coordinates.x) + Math.abs(coordinates.y) + Math.abs(coordinates.z);
  const signalQuality = signalQualityGrade(state, quality, pressureSummary);
  const result = {
    repo: '42ndMirror',
    claim: state.claim,
    quoted_scope: quoteLabel(state.claim, getUICopy(state.modeId)),
    mode: state.modeId,
    scope: state.scope,
    setting: state.setting,
    coordinates,
    surface_check: round(surfaceCheck, 6),
    axis_convention: AXIS_CONVENTION,
    raw: { x: round(xRaw, 6), y: round(yRaw, 6), z: round(zRaw, 6) },
    axes_raw: Object.fromEntries(Object.entries(axesRaw).map(([k, v]) => [k, round(v, 6)])),
    gates: Object.fromEntries(Object.entries(state.gates).map(([k, v]) => [k, round(v, 6)])),
    loads_top: topEntries(state.loads, 6),
    pressure: pressureSummary,
    quality_flags: clone(state.quality),
    signal_quality: signalQuality,
    interpretation: buildInterpretation(coordinates, signalQuality, pressureSummary, state),
    visualizer_payload: { type: 'set-profile', data: { data: { point: coordinates } } },
    route_log: clone(state.routeLog),
    selection_log: clone(state.selectionLog),
    answers: clone(state.answers),
    created_at: new Date().toISOString()
  };
  return result;
}

function weightedGateScore(gates) {
  let total = 0;
  let weight = 0;
  for (const gate of GATE_IDS) {
    const w = GATE_WEIGHTS[gate] || 1;
    total += clamp(gates[gate] || 0, -1, 1) * w;
    weight += w;
  }
  return weight ? clamp(total / weight, -1, 1) : 0;
}

function qualityAdjustment(state) {
  const q = state.quality || {};
  const yBonus =
    (q.high_signal || 0) * 0.04 +
    (q.pressure_integrated || 0) * 0.035 +
    (q.asymmetry_survived || 0) * 0.03 +
    (q.score_pressure_handled || 0) * 0.025;
  const yPenalty =
    (q.score_badge_pressure || 0) * 0.08 +
    (q.answer_shopping_risk || 0) * 0.07 +
    (q.polished_neutrality || 0) * 0.055 +
    (q.pressure_dodged || 0) * 0.06 +
    (q.pressure_dismissed || 0) * 0.035 +
    (q.possible_dodge || 0) * 0.04 +
    (q.low_signal || 0) * 0.04;
  return { yBonus: round(yBonus), yPenalty: round(yPenalty) };
}

function summarizePressure(state) {
  const summary = {
    integrated: 0,
    survived: 0,
    dismissed: 0,
    dodged: 0,
    events: clone(state.pressureLog || [])
  };
  for (const event of state.pressureLog || []) {
    if (event.response === 'integrate') summary.integrated += 1;
    if (event.response === 'principled_reject') summary.survived += 1;
    if (event.response === 'dismiss') summary.dismissed += 1;
    if (event.response === 'dodge') summary.dodged += 1;
  }
  summary.status = summary.integrated || summary.survived
    ? 'pressure tested'
    : summary.dismissed || summary.dodged
      ? 'pressure encountered but weakly handled'
      : 'pressure light';
  return summary;
}

function signalQualityGrade(state, quality, pressure) {
  let score = 0.55;
  score += (state.answers.length / Math.max(1, state.maxCards)) * 0.12;
  score += (quality.yBonus || 0) * 0.45;
  score -= (quality.yPenalty || 0) * 0.55;
  if ((state.quality.low_stakes || 0) > 1.8) score -= 0.08;
  if (pressure.integrated + pressure.survived >= 2) score += 0.08;
  if (pressure.dodged + pressure.dismissed >= 2) score -= 0.12;
  score = clamp(score, 0, 1);
  const grade = score >= 0.78 ? 'strong signal' : score >= 0.58 ? 'usable signal' : score >= 0.38 ? 'thin signal' : 'weak signal';
  return { score: round(score, 3), grade };
}

function projectToOctahedron(raw) {
  let x = Number(raw.x) || 0;
  let y = Number(raw.y) || 0;
  let z = Number(raw.z) || 0;
  let sum = Math.abs(x) + Math.abs(y) + Math.abs(z);
  if (sum < 1e-9) {
    y = 1;
    sum = 1;
  }
  return {
    x: round(x / sum, 6),
    y: round(y / sum, 6),
    z: round(z / sum, 6)
  };
}

function buildInterpretation(coords, signalQuality, pressure, state) {
  const xLabel = coords.x >= 0 ? 'empathy-leaning' : 'practicality-leaning';
  const zLabel = coords.z >= 0 ? 'wisdom-leaning' : 'knowledge-leaning';
  const yLabel = coords.y >= 0 ? 'positive stability' : 'negative stability';
  const serious = (state.loads.stakes || 0) + (state.loads.moral || 0) + (state.loads.social || 0) > 0.22;
  const light = (state.loads.micro || 0) + (state.loads.playful || 0) > 0.28 && !serious;
  return {
    short: `${xLabel}, ${zLabel}, ${yLabel}.`,
    signal: signalQuality.grade,
    pressure: pressure.status,
    scope_load: light ? 'light or operational scope' : serious ? 'heavier social/moral/practical scope' : 'mixed scope',
    note: pressure.integrated || pressure.survived
      ? 'The result includes at least one missing-side pressure check.'
      : 'The result should be read as more provisional because pressure coverage was light.'
  };
}

export function getLiveReadout(state) {
  const selection = state.currentSelection;
  const pressureNorm = normalizeVector(state.pressureVector, PRESSURE_IDS, 0.01);
  return {
    step: state.askedCardIds.length + 1,
    loads: topEntries(state.loads, 5),
    pressure: topEntries(pressureNorm, 4, PRESSURES),
    pressure_target: state.pressureTarget ? PRESSURES[state.pressureTarget]?.label || state.pressureTarget : 'none',
    asymmetry: currentAsymmetry(state),
    gates: clone(state.gates),
    selection,
    formula: 'S=.44R+.26P+.16C+.08G+.06T-penalty'
  };
}

export function exportedForTests() {
  return { concentration, projectToOctahedron, currentAsymmetry, scoreCard };
}
