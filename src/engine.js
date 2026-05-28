import {
  AXIS_CONVENTION,
  CARD_BANK,
  GATES,
  GATE_WEIGHTS,
  MODES,
  ROUTE_FACETS,
  SCOPES,
  SETTINGS,
  UI_COPY
} from '../data/cards.js';

const AXES = ['empathy', 'practicality', 'wisdom', 'knowledge'];
const GATE_IDS = Object.keys(GATES);
const ROUTES = Object.keys(ROUTE_FACETS);
const QUALITY_KEYS = [
  'high_signal',
  'precision_signal',
  'provisional_sample',
  'uncertainty',
  'narrow_sample',
  'noisy_sample',
  'needs_disambiguation',
  'low_signal',
  'low_stakes',
  'taste_sample',
  'social_performance_pressure',
  'score_badge_pressure',
  'answer_shopping_signal',
  'polished_neutrality_signal'
];

const SCOPE_ROUTE_BIAS = {
  claim: { evidence_claim: 0.32, value_tradeoff: 0.12 },
  decision: { micro_action: 0.28, value_tradeoff: 0.2, strategy: 0.15 },
  reaction: { task_friction: 0.18, public_pressure: 0.15, value_tradeoff: 0.15 },
  argument: { evidence_claim: 0.35, public_pressure: 0.15 },
  person_pattern: { person_pattern: 0.42, strategy: 0.18 },
  comparison: { comparison: 0.42, public_pressure: 0.12 }
};

const SETTING_ROUTE_BIAS = {
  private: {},
  group: { public_pressure: 0.42, comparison: 0.12 },
  debate: { public_pressure: 0.5, evidence_claim: 0.18 },
  fiction: { person_pattern: 0.35, comparison: 0.2, strategy: 0.18 }
};

const KEYWORD_ROUTE_RULES = [
  { route: 'body_need', weight: 0.78, rx: /\b(eat|food|meal|lunch|dinner|breakfast|hungry|hunger|thirst|drink|sleep|tired|pain|body|energy)\b/i },
  { route: 'micro_action', weight: 0.64, rx: /\b(should i|should we|do i|do we|now|today|tonight|start|stop|go|leave|eat|work|choose|decision|decide)\b/i },
  { route: 'task_friction', weight: 0.68, rx: /\b(procrastinat|avoid|avoiding|delay|delaying|stuck|friction|motivat|lazy|focus|adhd|distract|task)\b/i },
  { route: 'public_pressure', weight: 0.78, rx: /\b(friend|friends|group|debate|argue|argument|prove|win|clout|score|compare results|audience|people watching|status)\b/i },
  { route: 'comparison', weight: 0.7, rx: /\b(compare|comparison|versus|vs\.?|better than|stronger than|weaker than|which is better|between)\b/i },
  { route: 'person_pattern', weight: 0.68, rx: /\b(character|person|leader|villain|hero|player|subject|behavior|pattern|under pressure)\b/i },
  { route: 'evidence_claim', weight: 0.72, rx: /\b(true|false|fact|evidence|proof|claim|belief|source|study|data|counterexample|counter example|because)\b/i },
  { route: 'policy_system', weight: 0.72, rx: /\b(policy|law|rule|system|government|institution|society|public|enforce|regulation|tax|school|company)\b/i },
  { route: 'value_tradeoff', weight: 0.58, rx: /\b(fair|right|wrong|hurt|harm|help|cost|benefit|people|moral|duty|allow|ban|responsible)\b/i },
  { route: 'strategy', weight: 0.54, rx: /\b(strategy|tactic|plan|win|game|incentive|tradeoff|risk|execute|method)\b/i },
  { route: 'low_stakes', weight: 0.44, rx: /\b(silly|random|quick test|test only|whatever|minor|small|not serious|just testing)\b/i }
];

export function getMode(id) {
  return MODES[id] ?? MODES.fast;
}

export function getScope(id) {
  return SCOPES.find(scope => scope.id === id) ?? SCOPES[0];
}

export function getSetting(id) {
  return SETTINGS.find(item => item.id === id) ?? SETTINGS[0];
}

export function getUICopy(modeId) {
  return getMode(modeId).readingLevel === 'simple' ? UI_COPY.simple : UI_COPY.normal;
}

export function getReadableText(card, modeId) {
  const level = getMode(modeId).readingLevel === 'simple' ? 'simple' : 'normal';
  return card[level] ?? card.normal;
}

export function getAnswerText(answer, modeId) {
  const level = getMode(modeId).readingLevel === 'simple' ? 'simple' : 'normal';
  return answer[level] ?? answer.normal;
}

export function analyzeScopeLabel(label = '', scope = 'claim', setting = 'private') {
  const text = String(label || '').toLowerCase();
  const raw = emptyRouteVector();
  const hits = [];

  addRouteBias(raw, SCOPE_ROUTE_BIAS[scope] || {}, 'scope');
  addRouteBias(raw, SETTING_ROUTE_BIAS[setting] || {}, 'setting');

  for (const rule of KEYWORD_ROUTE_RULES) {
    if (rule.rx.test(text)) {
      raw[rule.route] += rule.weight;
      hits.push(`${rule.route}+${rule.weight.toFixed(2)}`);
    }
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount <= 3) {
    raw.low_stakes += 0.22;
    hits.push('low_stakes+0.22');
  }
  if (/[?]/.test(label)) {
    raw.micro_action += 0.08;
    raw.uncertainty = (raw.uncertainty || 0) + 0.1;
  }
  if (/\bshould\b/i.test(text) && /\bnow\b/i.test(text)) raw.micro_action += 0.18;
  if (raw.body_need > 0.25 && raw.task_friction > 0.25) raw.micro_action += 0.25;
  if (raw.public_pressure > 0.3 && raw.comparison > 0.25) raw.score_risk = 0.35;

  const route = normalizeRoute(raw);
  const confidence = routeConfidence(route);
  return {
    route,
    confidence,
    hits,
    top: topRoutes(route, 4),
    word_count: wordCount,
    note: confidence < 0.34 ? 'wide route; first card should narrow it' : 'route seeded from scope label and selected setting'
  };
}

function addRouteBias(target, bias, source) {
  for (const [route, value] of Object.entries(bias || {})) {
    if (route in target) target[route] += value;
  }
}

export function makeInitialState({ modeId, scope, setting = 'private', claim }) {
  const cleanClaim = String(claim || '').trim();
  const analysis = analyzeScopeLabel(cleanClaim, scope, setting);
  const maxCards = getMode(modeId).maxCards;
  const state = {
    repo: '42ndMirror',
    version: '0.4.0-deterministic-router',
    modeId,
    scope,
    setting,
    claim: cleanClaim,
    label: cleanClaim,
    maxCards,
    askedCardIds: [],
    answers: [],
    routeVector: analysis.route,
    routeAnalysis: analysis,
    routeLog: [{ step: 0, type: 'seed', route: clone(analysis.route), top: analysis.top, confidence: analysis.confidence, hits: analysis.hits }],
    selectionLog: [],
    startedAt: Date.now(),
    lastCardAt: Date.now(),
    timing: []
  };
  return state;
}

export function getNextCard(state) {
  if (!state || state.askedCardIds.length >= state.maxCards) return null;
  if (shouldStopEarly(state)) return null;
  const totals = computeTotalsSoFar(state);
  const candidates = CARD_BANK.filter(card => isCandidateCompatible(card, state));
  if (!candidates.length) return null;

  const ranked = candidates.map(card => scoreCard(card, state, totals)).sort((a, b) => b.total - a.total);
  const selected = ranked[0];
  if (isLowRelevanceTail(state, selected)) return null;
  const logItem = makeSelectionLogItem(state, selected, ranked.slice(0, 4));
  state.currentSelection = logItem;
  return selected.card;
}


function shouldStopEarly(state) {
  const asked = state.askedCardIds.length;
  if (asked < 3) return false;
  if (state.askedCardIds.includes('precision_close_01')) return true;
  const microMass = (state.routeVector.micro_action || 0) + (state.routeVector.body_need || 0) + (state.routeVector.task_friction || 0);
  if (microMass >= 0.58 && state.askedCardIds.includes('micro_next_step_01')) return true;
  if ((state.routeVector.low_stakes || 0) > 0.32 && asked >= 4) return true;
  return false;
}

function isLowRelevanceTail(state, selected) {
  if (state.askedCardIds.length < 4) return false;
  if (!selected) return true;
  if (selected.card.id === 'precision_close_01') return false;
  if ((selected.raw.routeFit || 0) < 0.12) return true;
  if (selected.total < 0.24) return true;
  const microMass = (state.routeVector.micro_action || 0) + (state.routeVector.body_need || 0) + (state.routeVector.task_friction || 0);
  if (microMass >= 0.55 && !['micro_body_state_01', 'micro_delay_cost_01', 'micro_next_step_01', 'precision_close_01'].includes(selected.card.id)) return true;
  return false;
}

function isCandidateCompatible(card, state) {
  if (state.askedCardIds.includes(card.id)) return false;
  if (Array.isArray(card.settings) && !card.settings.includes(state.setting)) return false;
  if (card.fixedEarly && state.askedCardIds.length > 0) return false;
  if (card.fixedEarly && routeConfidence(state.routeVector) >= 0.5) return false;
  const lateFloor = card.id === 'precision_close_01' ? Math.max(3, state.maxCards - 4) : Math.max(3, state.maxCards - 3);
  if (card.stage === 'late' && state.askedCardIds.length < lateFloor) return false;
  if (card.stage === 'mid' && state.askedCardIds.length < 1) return false;
  return true;
}

function scoreCard(card, state, totals) {
  const askedCount = state.askedCardIds.length;
  const maxCards = state.maxCards;
  const routeFit = dot(card.routes || {}, state.routeVector);
  const needFit = coverageNeedScore(card, totals.coverage);
  const gateFit = gateNeedScore(card, totals.gates);
  const stageFit = stageScore(card.stage, askedCount, maxCards);
  const settingFit = Array.isArray(card.settings) && card.settings.includes(state.setting) ? 0.12 : 0;
  const fixedEarly = card.fixedEarly && routeConfidence(state.routeVector) < 0.5 ? 0.2 : 0;
  const lowStakesPenalty = state.routeVector.low_stakes > 0.28 && ['opposition_best_01', 'policy_load_01', 'character_power_01'].includes(card.id) ? -0.35 : 0;
  const microMass = (state.routeVector.micro_action || 0) + (state.routeVector.body_need || 0) + (state.routeVector.task_friction || 0);
  const microTailPenalty = microMass >= 0.58 && !['micro_body_state_01', 'micro_delay_cost_01', 'micro_next_step_01', 'precision_close_01'].includes(card.id) ? -0.18 : 0;

  const total = routeFit * 0.54 + needFit * 0.22 + gateFit * 0.12 + stageFit * 0.08 + settingFit + fixedEarly + lowStakesPenalty + microTailPenalty;
  return {
    card,
    total: round6(total),
    parts: {
      route: round6(routeFit * 0.54),
      deficit: round6(needFit * 0.22),
      gate: round6(gateFit * 0.12),
      stage: round6(stageFit * 0.08),
      setting: round6(settingFit),
      fixed: round6(fixedEarly),
      penalty: round6(lowStakesPenalty + microTailPenalty)
    },
    raw: { routeFit: round6(routeFit), needFit: round6(needFit), gateFit: round6(gateFit), stageFit: round6(stageFit) }
  };
}

function coverageNeedScore(card, coverage) {
  const dimensionsFromAnswers = summarizeCardCoverage(card);
  let score = 0;
  let total = 0;
  for (const axis of AXES) {
    const cardTouch = dimensionsFromAnswers[axis] || 0;
    const deficit = clamp(1 - (coverage[axis] || 0) / 1.4, 0, 1);
    score += cardTouch * deficit;
    total += cardTouch;
  }
  return total ? score / total : 0;
}

function summarizeCardCoverage(card) {
  const out = Object.fromEntries(AXES.map(axis => [axis, 0]));
  for (const answer of card.answers || []) {
    const coverage = answer.effects?.coverage || {};
    for (const axis of AXES) out[axis] += Math.max(0, coverage[axis] || 0);
  }
  for (const axis of AXES) out[axis] = Math.min(1, out[axis] / Math.max(1, (card.answers || []).length / 2));
  return out;
}

function gateNeedScore(card, gates) {
  const answerGates = {};
  for (const id of GATE_IDS) answerGates[id] = 0;
  for (const answer of card.answers || []) {
    const gateEffects = answer.effects?.gates || {};
    for (const id of GATE_IDS) answerGates[id] += Math.abs(gateEffects[id] || 0);
  }
  let score = 0;
  let total = 0;
  for (const id of GATE_IDS) {
    const touch = Math.min(1, answerGates[id] / 1.5);
    const need = clamp(1 - Math.abs(gates[id] || 0) / 1.2, 0, 1);
    score += touch * need;
    total += touch;
  }
  return total ? score / total : 0;
}

function stageScore(stage, askedCount, maxCards) {
  const progress = askedCount / Math.max(1, maxCards - 1);
  if (stage === 'early') return clamp(1 - progress * 1.2, 0, 1);
  if (stage === 'mid') return 1 - Math.abs(progress - 0.5) * 1.4;
  if (stage === 'late') return clamp((progress - 0.48) * 1.8, 0, 1);
  return 0.5;
}

function makeSelectionLogItem(state, selected, topRanked) {
  return {
    step: state.askedCardIds.length + 1,
    selected_card_id: selected.card.id,
    selected_title: selected.card.normal?.title || selected.card.id,
    score: selected.total,
    parts: selected.parts,
    formula: 'S = .54R + .22D + .12G + .08T + setting + fixed - penalty',
    top_routes: topRoutes(state.routeVector, 5),
    top_candidates: topRanked.map(item => ({ id: item.card.id, score: item.total, routeFit: item.raw.routeFit }))
  };
}

export function answerCard(state, card, answer) {
  const now = Date.now();
  const elapsedMs = Math.max(0, now - state.lastCardAt);
  const before = clone(state.routeVector);

  state.answers.push({
    cardId: card.id,
    answerId: answer.id,
    elapsedMs,
    effects: clone(answer.effects || {}),
    route: clone(answer.route || {})
  });
  state.askedCardIds.push(card.id);
  state.timing.push(elapsedMs);
  state.lastCardAt = now;

  state.routeVector = updateRouteVector(state.routeVector, answer.route || {}, card.routes || {});
  const delta = routeDelta(before, state.routeVector);
  const routeLogItem = { step: state.answers.length, type: 'answer_update', card: card.id, answer: answer.id, delta, route: clone(state.routeVector), top: topRoutes(state.routeVector, 5) };
  state.routeLog.push(routeLogItem);
  if (state.currentSelection) {
    state.selectionLog.push({ ...state.currentSelection, answer: answer.id, route_delta: delta });
    state.currentSelection = null;
  }
  return state;
}

function updateRouteVector(current, answerRoute, cardRoute) {
  const next = { ...current };
  for (const [route, value] of Object.entries(cardRoute || {})) {
    if (route in next) next[route] += value * 0.035;
  }
  for (const [route, value] of Object.entries(answerRoute || {})) {
    if (route in next) next[route] += value;
  }
  return normalizeRoute(next);
}

function routeDelta(before, after) {
  return topRoutes(Object.fromEntries(ROUTES.map(route => [route, (after[route] || 0) - (before[route] || 0)])), 4, true);
}

export function getRoutingSnapshot(state) {
  const totals = computeTotalsSoFar(state);
  const next = state.currentSelection || (getNextCard(state), state.currentSelection);
  return {
    route: clone(state.routeVector),
    top_routes: topRoutes(state.routeVector, 5),
    coverage: summarizeCoverage(totals.coverage),
    gates: summarizeGates(totals.gates),
    selection: next,
    recent_route_log: state.routeLog.slice(-3)
  };
}

function computeTotalsSoFar(state) {
  const totals = emptyTotals();
  applySettingPressure(totals, state.setting);
  if (state.routeAnalysis?.confidence < 0.28) totals.quality.needs_disambiguation += 0.5;
  if ((state.routeVector.low_stakes || 0) > 0.28) totals.quality.low_stakes += 0.7;
  for (const item of state.answers) applyEffects(totals, item.effects || {});
  applyMetaSignals(totals, state);
  return totals;
}

export function calculateResult(state) {
  const totals = computeTotalsSoFar(state);
  const gateSummary = summarizeGates(totals.gates);
  const coverage = summarizeCoverage(totals.coverage);
  const quality = summarizeQuality(totals.quality, state.timing, state.answers.length, coverage, gateSummary, state);

  const lateralScale = computeLateralScale(state, coverage);
  let xRaw = round6((totals.empathy - totals.practicality) / lateralScale);
  let zRaw = round6((totals.wisdom - totals.knowledge) / lateralScale);
  let yRaw = round6(computeYRaw(gateSummary, quality, coverage));

  const adjusted = applyQualityCaps({ x: xRaw, y: yRaw, z: zRaw }, quality, coverage, totals, state);
  xRaw = adjusted.x;
  yRaw = adjusted.y;
  zRaw = adjusted.z;

  const projected = projectToOctahedronSurface({ x: xRaw, y: yRaw, z: zRaw });
  const interpretation = buildInterpretation(projected, totals, gateSummary, quality, coverage, state);
  const label = getResultLabel(state);
  const id = makeResultId();
  const entryText = makeEntryText(label, projected, quality, interpretation);

  return {
    id,
    repo: state.repo,
    version: state.version,
    created_at: new Date().toISOString(),
    mode: state.modeId,
    mode_label: getMode(state.modeId).name,
    scope: state.scope,
    scope_label: getScope(state.scope).name,
    setting: state.setting,
    setting_label: getSetting(state.setting).name,
    claim: state.claim,
    quoted_label: label,
    axis_convention: AXIS_CONVENTION,
    coordinates: {
      x: projected.x,
      y: projected.y,
      z: projected.z,
      surface_check: round6(Math.abs(projected.x) + Math.abs(projected.y) + Math.abs(projected.z)),
      raw: { x: xRaw, y: yRaw, z: zRaw },
      projection_note: projected.note
    },
    visualizer_payload: {
      type: 'set-profile',
      data: { data: { point: { x: projected.x, y: projected.y, z: projected.z } } }
    },
    components: {
      empathy: round6(totals.empathy),
      practicality: round6(totals.practicality),
      wisdom: round6(totals.wisdom),
      knowledge: round6(totals.knowledge)
    },
    coverage,
    gates: gateSummary,
    signal_quality: quality,
    interpretation,
    routing: {
      initial_analysis: state.routeAnalysis,
      final_route: clone(state.routeVector),
      top_routes: topRoutes(state.routeVector, 6),
      selected_cards: state.askedCardIds,
      route_log: state.routeLog,
      selection_log: state.selectionLog,
      route_specificity: computeRouteSpecificitySeries(state.selectionLog)
    },
    entry_text: entryText,
    selected_answers: state.answers.map(item => ({ card_id: item.cardId, answer_id: item.answerId, elapsed_ms: item.elapsedMs }))
  };
}

function emptyTotals() {
  const gates = Object.fromEntries(GATE_IDS.map(id => [id, 0]));
  const quality = Object.fromEntries(QUALITY_KEYS.map(key => [key, 0]));
  const coverage = Object.fromEntries(AXES.map(axis => [axis, 0]));
  return { empathy: 0, practicality: 0, wisdom: 0, knowledge: 0, gates, quality, coverage };
}

function applySettingPressure(totals, setting) {
  if (setting === 'group') totals.quality.social_performance_pressure += 0.4;
  if (setting === 'debate') totals.quality.social_performance_pressure += 0.8;
  if (setting === 'fiction') totals.quality.provisional_sample += 0.2;
}

function applyEffects(totals, effects) {
  for (const axis of AXES) if (Number.isFinite(effects[axis])) totals[axis] += effects[axis];
  for (const [id, value] of Object.entries(effects.gates || {})) if (id in totals.gates && Number.isFinite(value)) totals.gates[id] += value;
  for (const [key, value] of Object.entries(effects.quality || {})) {
    if (!Number.isFinite(totals.quality[key])) totals.quality[key] = 0;
    if (Number.isFinite(value)) totals.quality[key] += value;
  }
  for (const [axis, value] of Object.entries(effects.coverage || {})) if (axis in totals.coverage && Number.isFinite(value)) totals.coverage[axis] += value;
}

function applyMetaSignals(totals, state) {
  const answers = state.answers.map(item => item.answerId);
  const allComponents = [totals.empathy, totals.practicality, totals.wisdom, totals.knowledge];
  const max = Math.max(...allComponents);
  const min = Math.min(...allComponents);
  const spread = max - min;
  const total = allComponents.reduce((a, b) => a + b, 0);

  if (answers.includes('score_as_badge')) totals.quality.score_badge_pressure += 1.2;
  if (answers.includes('rerun_until_better')) totals.quality.answer_shopping_signal += 1.2;
  if (answers.includes('compare_appeal')) totals.quality.taste_sample += 0.7;
  if (answers.includes('tiny_stakes') || answers.includes('drop_the_scope') || answers.includes('little_changes')) totals.quality.low_stakes += 0.6;
  if (total >= 4.8 && spread <= 0.48 && (totals.quality.precision_signal || 0) < 1.5) {
    totals.quality.polished_neutrality_signal += 0.7;
    totals.gates.G4_contradiction_handling -= 0.1;
    totals.gates.G6_non_self_sealing -= 0.1;
  }

  if ((state.routeVector.public_pressure || 0) > 0.35 && state.setting !== 'private') totals.quality.social_performance_pressure += 0.45;
}

function summarizeGates(rawGates) {
  const items = {};
  let weightedSum = 0;
  let weightTotal = 0;
  for (const id of GATE_IDS) {
    const raw = rawGates[id] || 0;
    const normalized = clamp(raw / 1.8, -1, 1);
    const weight = GATE_WEIGHTS[id] ?? 1;
    const status = normalized >= 0.34 ? 'clear' : normalized <= -0.34 ? 'strained' : 'quiet';
    items[id] = { label: GATES[id], weight, raw: round6(raw), normalized: round6(normalized), status };
    weightedSum += normalized * weight;
    weightTotal += weight;
  }
  const values = Object.values(items);
  return {
    average: round6(weightTotal ? weightedSum / weightTotal : 0),
    items,
    clear_count: values.filter(g => g.status === 'clear').length,
    strained_count: values.filter(g => g.status === 'strained').length,
    quiet_count: values.filter(g => g.status === 'quiet').length
  };
}

function summarizeCoverage(rawCoverage) {
  const items = {};
  for (const axis of AXES) items[axis] = round6(rawCoverage[axis] || 0);
  const touched = AXES.filter(axis => items[axis] >= 0.75);
  const weak = AXES.filter(axis => items[axis] > 0 && items[axis] < 0.75);
  const missing = AXES.filter(axis => items[axis] <= 0);
  const min = Math.min(...AXES.map(axis => items[axis]));
  const max = Math.max(...AXES.map(axis => items[axis]));
  return { items, touched, weak, missing, touched_count: touched.length, all_four_touched: touched.length === 4, min: round6(min), max: round6(max), spread: round6(max - min) };
}

function computeLateralScale(state, coverage) {
  const base = state.modeId === 'serious' ? 5.7 : 4.6;
  const coverageLift = Math.min(1.2, coverage.touched_count * 0.16);
  const publicLift = state.setting === 'debate' ? 0.22 : state.setting === 'group' ? 0.12 : 0;
  return base + coverageLift + publicLift;
}

function computeYRaw(gateSummary, quality, coverage) {
  let y = gateSummary.average;
  if (coverage.all_four_touched && (quality.counts.precision_signal || 0) >= 2) y += 0.08;
  if (!coverage.all_four_touched) y -= (4 - coverage.touched_count) * 0.02;
  if (quality.grade === 'light') y *= 0.52;
  else if (quality.grade === 'weak') y *= 0.55;
  else if (quality.grade === 'provisional') y *= 0.74;
  return clamp(y, -1, 1);
}

function applyQualityCaps(raw, quality, coverage, totals, state) {
  const out = { x: round6(raw.x), y: round6(raw.y), z: round6(raw.z) };
  const counts = quality.counts;
  if ((counts.score_badge_pressure || 0) >= 1.5) out.y = Math.min(out.y, -0.1);
  if ((counts.answer_shopping_signal || 0) >= 1.5) out.y = Math.min(out.y, 0.03);
  if ((counts.social_performance_pressure || 0) >= 2.5) out.y = Math.min(out.y, 0.2);
  if ((counts.polished_neutrality_signal || 0) >= 0.7) out.y = Math.min(out.y, 0.42);
  if ((counts.low_signal || 0) >= 2 || quality.grade === 'light') out.y = Math.min(out.y, 0.12);
  if ((state.routeVector.low_stakes || 0) > 0.36) out.y = Math.min(out.y, 0.16);

  const lateralMagnitude = Math.abs(out.x) + Math.abs(out.z);
  if (lateralMagnitude < 0.08 && coverage.touched_count < 4) {
    const strongest = strongestComponent(totals);
    if (strongest === 'empathy') out.x += 0.08;
    else if (strongest === 'practicality') out.x -= 0.08;
    else if (strongest === 'wisdom') out.z += 0.08;
    else if (strongest === 'knowledge') out.z -= 0.08;
  }
  out.x = round6(clamp(out.x, -1, 1));
  out.y = round6(clamp(out.y, -1, 1));
  out.z = round6(clamp(out.z, -1, 1));
  return out;
}

function summarizeQuality(rawQuality, timing, answerCount, coverage, gateSummary, state) {
  const quality = {};
  for (const key of QUALITY_KEYS) quality[key] = rawQuality[key] || 0;
  const avgMs = timing.length ? timing.reduce((a, b) => a + b, 0) / timing.length : 0;
  const fastRatio = timing.length ? timing.filter(ms => ms > 0 && ms < 1050).length / timing.length : 0;

  let score = 72;
  score += (quality.high_signal || 0) * 4;
  score += (quality.precision_signal || 0) * 5;
  score += gateSummary.clear_count * 3;
  score -= gateSummary.strained_count * 6;
  score -= (quality.provisional_sample || 0) * 4;
  score -= (quality.uncertainty || 0) * 3;
  score -= (quality.narrow_sample || 0) * 3;
  score -= (quality.noisy_sample || 0) * 5;
  score -= (quality.needs_disambiguation || 0) * 3;
  score -= (quality.low_signal || 0) * 8;
  score -= (quality.low_stakes || 0) * 7;
  score -= (quality.taste_sample || 0) * 7;
  score -= (quality.social_performance_pressure || 0) * 5;
  score -= (quality.score_badge_pressure || 0) * 9;
  score -= (quality.answer_shopping_signal || 0) * 11;
  score -= (quality.polished_neutrality_signal || 0) * 7;
  if (!coverage.all_four_touched) score -= (4 - coverage.touched_count) * 3;
  if (answerCount >= 5 && fastRatio >= 0.5) score -= 8;
  score = clamp(Math.round(score), 0, 100);

  let grade = 'strong';
  if ((quality.low_stakes || 0) >= 2 || (state.routeVector.low_stakes || 0) > 0.36) grade = 'light';
  else if (score < 45) grade = 'weak';
  else if (score < 70) grade = 'provisional';
  else if (score < 86) grade = 'usable';

  const flags = [];
  if ((quality.low_stakes || 0) >= 1.2) flags.push('light operational scope');
  if ((quality.social_performance_pressure || 0) >= 2) flags.push('public comparison pressure');
  if ((quality.score_badge_pressure || 0) >= 1.2) flags.push('score-as-proof pressure');
  if ((quality.answer_shopping_signal || 0) >= 1.2) flags.push('retake pressure');
  if ((quality.polished_neutrality_signal || 0) >= 0.7) flags.push('over-smooth answer pattern');
  if ((quality.taste_sample || 0) >= 1) flags.push('appeal-heavy sample');
  if (!coverage.all_four_touched) flags.push('partial coverage');
  if (answerCount >= 5 && fastRatio >= 0.5) flags.push('very fast answers');

  return {
    score,
    grade,
    flags,
    average_answer_ms: Math.round(avgMs),
    fast_ratio: round6(fastRatio),
    counts: Object.fromEntries(QUALITY_KEYS.map(key => [key, round6(quality[key] || 0)]))
  };
}

export function projectToOctahedronSurface(raw) {
  const x = finite(raw.x);
  const y = finite(raw.y);
  const z = finite(raw.z);
  const manhattan = Math.abs(x) + Math.abs(y) + Math.abs(z);
  if (manhattan < 1e-9) return { x: 0, y: -1, z: 0, note: 'no active signal; strict surface fallback used' };
  const point = { x: round6(x / manhattan), y: round6(y / manhattan), z: round6(z / manhattan) };
  forceRoundedSurface(point);
  return { x: point.x, y: point.y, z: point.z, note: 'raw vector normalized to octahedron surface' };
}

function forceRoundedSurface(point) {
  const axes = ['x', 'y', 'z'];
  const sum = axes.reduce((acc, axis) => acc + Math.abs(point[axis]), 0);
  const diff = round6(1 - sum);
  if (Math.abs(diff) < 0.000001) return;
  let target = axes[0];
  for (const axis of axes) if (Math.abs(point[axis]) > Math.abs(point[target])) target = axis;
  const sign = Math.sign(point[target]) || 1;
  point[target] = round6(point[target] + sign * diff);
}

function buildInterpretation(projected, totals, gateSummary, quality, coverage, state) {
  const simple = getMode(state.modeId).readingLevel === 'simple';
  const notes = [];
  const xLabel = projected.x >= 0.08 ? 'empathy-leaning' : projected.x <= -0.08 ? 'practicality-leaning' : 'balanced on empathy/practicality';
  const zLabel = projected.z >= 0.08 ? 'wisdom-leaning' : projected.z <= -0.08 ? 'knowledge-leaning' : 'balanced on wisdom/knowledge';
  const yLabel = projected.y >= 0.34 ? 'stable' : projected.y <= -0.34 ? 'unstable' : 'borderline';
  const topRoute = topRoutes(state.routeVector, 1)[0];

  if (simple) {
    notes.push(`This run leaned ${shortAxisText(xLabel)}.`);
    notes.push(`It also leaned ${shortAxisText(zLabel)}.`);
    notes.push(`The pressure score is ${yLabel}.`);
  } else {
    notes.push(`X-axis: ${xLabel}.`);
    notes.push(`Z-axis: ${zLabel}.`);
    notes.push(`Y-axis: ${yLabel} for this scope.`);
  }
  if (topRoute) notes.push(simple ? `Card route: ${ROUTE_FACETS[topRoute.id]}.` : `Dominant card route: ${ROUTE_FACETS[topRoute.id]} (${topRoute.value.toFixed(2)}).`);

  const sorted = Object.entries({ empathy: totals.empathy, practicality: totals.practicality, wisdom: totals.wisdom, knowledge: totals.knowledge }).sort((a, b) => b[1] - a[1]);
  if (sorted[0]?.[1] > 0) notes.push(simple ? `Strongest pull: ${sorted[0][0]}.` : `Strongest expressed pull: ${sorted[0][0]}.`);
  if (coverage.missing.length) notes.push(simple ? `Light count: ${coverage.missing.join(', ')}.` : `Light or untouched accounting: ${coverage.missing.join(', ')}.`);
  else if (coverage.weak.length) notes.push(simple ? `Some light parts: ${coverage.weak.join(', ')}.` : `Lightly touched accounting: ${coverage.weak.join(', ')}.`);
  else notes.push(simple ? 'All four parts were counted.' : 'All four lateral dimensions were counted.');

  if (gateSummary.strained_count > 0) {
    const strained = Object.values(gateSummary.items).filter(g => g.status === 'strained').map(g => g.label);
    notes.push(simple ? `Strained checks: ${strained.join(', ')}.` : `Strained gate pressure: ${strained.join(', ')}.`);
  } else if (gateSummary.clear_count >= 4) notes.push(simple ? 'Most checks cleared.' : 'Most stability gates cleared for this scope.');
  else notes.push(simple ? 'Some checks stayed quiet.' : 'Several gates stayed quiet rather than strongly clear or strained.');
  if (quality.flags.length) notes.push(`Signal note: ${quality.flags[0]}.`);

  return {
    label: `${capitalize(yLabel)} · ${capitalize(xLabel)} · ${capitalize(zLabel)}`,
    notes,
    reading: { stability: yLabel, empathy_practicality: xLabel, wisdom_knowledge: zLabel, scope: getScope(state.scope).name, setting: getSetting(state.setting).name }
  };
}

function computeRouteSpecificitySeries(selectionLog = []) {
  const values = selectionLog.map(item => ({ step: item.step, card: item.selected_card_id, routeFit: round6(item.top_candidates?.[0]?.routeFit ?? 0), score: item.score }));
  const first = values.slice(0, 2).reduce((a, b) => a + (b.routeFit || 0), 0) / Math.max(1, Math.min(2, values.length));
  const last = values.slice(-2).reduce((a, b) => a + (b.routeFit || 0), 0) / Math.max(1, Math.min(2, values.length));
  return { values, first_avg_route_fit: round6(first), last_avg_route_fit: round6(last), delta: round6(last - first) };
}

function emptyRouteVector() {
  return Object.fromEntries(ROUTES.map(route => [route, 0]));
}

function normalizeRoute(raw) {
  const clean = emptyRouteVector();
  for (const route of ROUTES) clean[route] = Math.max(0, Number(raw[route] || 0));
  const max = Math.max(...Object.values(clean), 0.001);
  const softened = Object.fromEntries(ROUTES.map(route => [route, Math.pow(clean[route] / max, 0.85)]));
  const sum = Object.values(softened).reduce((a, b) => a + b, 0);
  if (sum <= 0) return Object.fromEntries(ROUTES.map(route => [route, route === 'value_tradeoff' ? 0.3 : 0.06]));
  const normalized = Object.fromEntries(ROUTES.map(route => [route, round6(softened[route] / sum)]));
  return normalized;
}

function routeConfidence(route) {
  const sorted = Object.values(route).sort((a, b) => b - a);
  return round6((sorted[0] || 0) - (sorted[2] || 0) + (sorted[0] || 0) * 0.4);
}

function topRoutes(route, count = 4, allowNegative = false) {
  return Object.entries(route)
    .filter(([, value]) => allowNegative ? Math.abs(value) > 0.0001 : value > 0.0001)
    .map(([id, value]) => ({ id, label: ROUTE_FACETS[id] || id, value: round6(value) }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, count);
}

function dot(left, right) {
  let out = 0;
  for (const [key, value] of Object.entries(left || {})) out += (Number(value) || 0) * (Number(right?.[key]) || 0);
  return out;
}

function strongestComponent(totals) {
  return Object.entries({ empathy: totals.empathy, practicality: totals.practicality, wisdom: totals.wisdom, knowledge: totals.knowledge }).sort((a, b) => b[1] - a[1])[0]?.[0] || 'wisdom';
}

function getResultLabel(state) {
  return state.claim || `${getScope(state.scope).name} (${getSetting(state.setting).name})`;
}

function makeEntryText(label, projected, quality, interpretation) {
  return `“${label}” → x ${format(projected.x)}, y ${format(projected.y)}, z ${format(projected.z)} · ${quality.grade} · ${interpretation.label}`;
}

function shortAxisText(label) {
  return label
    .replace('empathy-leaning', 'toward people-cost')
    .replace('practicality-leaning', 'toward workability')
    .replace('wisdom-leaning', 'toward context')
    .replace('knowledge-leaning', 'toward proof')
    .replace('balanced on empathy/practicality', 'balanced on people-cost/workability')
    .replace('balanced on wisdom/knowledge', 'balanced on context/proof');
}

function makeResultId() {
  return `mirror-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function finite(value) {
  return Number.isFinite(value) ? value : 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round6(value) {
  return Math.round((Number(value) || 0) * 1_000_000) / 1_000_000;
}

function format(value) {
  return Number(value).toFixed(3);
}

function capitalize(value) {
  return String(value || '').replace(/^./, char => char.toUpperCase());
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
