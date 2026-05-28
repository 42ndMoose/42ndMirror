import {
  AXIS_CONVENTION,
  BASE_CARDS,
  FOLLOW_UP_CARDS,
  GATES,
  GATE_WEIGHTS,
  MODES,
  SCOPES,
  UI_COPY,
  USE_CASES
} from '../data/cards.js';

const AXES = ['empathy', 'practicality', 'wisdom', 'knowledge'];
const GATE_IDS = Object.keys(GATES);
const QUALITY_KEYS = [
  'high_signal',
  'precision_signal',
  'incomplete_signal',
  'low_signal',
  'provisional_sample',
  'uncertainty',
  'narrow_sample',
  'noisy_sample',
  'sandbox_sample',
  'taste_sample',
  'needs_disambiguation',
  'self_protective_signal',
  'sealed_signal',
  'social_performance_pressure',
  'score_badge_pressure',
  'answer_shopping_signal',
  'polished_neutrality_signal'
];

export function getMode(id) {
  return MODES[id] ?? MODES.fast;
}

export function getScope(id) {
  return SCOPES.find(scope => scope.id === id) ?? SCOPES[0];
}

export function getUseCase(id) {
  return USE_CASES.find(item => item.id === id) ?? USE_CASES[0];
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

export function buildBaseDeck(modeId, scopeId = 'claim', useCaseId = 'private') {
  const mode = getMode(modeId);
  const cards = BASE_CARDS.filter(card => {
    if (card.seriousOnly && modeId !== 'serious') return false;
    if (Array.isArray(card.scopeIds) && !card.scopeIds.includes(scopeId)) return false;
    if (Array.isArray(card.useCases) && !card.useCases.includes(useCaseId)) return false;
    return true;
  });

  const final = cards.find(card => card.id === 'seriousness_01');
  const regular = cards.filter(card => card.id !== 'seriousness_01');

  const importantIds = new Set([
    'sample_shape_01',
    'anchor_under_time_01',
    'good_value_clash_01',
    'challenge_move_01',
    'counter_evidence_01',
    'opponent_model_01',
    'public_pressure_01',
    'fascination_split_01',
    'precision_vs_status_01',
    'missing_dimension_01'
  ]);

  const ordered = [...regular].sort((a, b) => {
    const ap = importantIds.has(a.id) ? 0 : 1;
    const bp = importantIds.has(b.id) ? 0 : 1;
    if (ap !== bp) return ap - bp;
    return 0;
  });

  const cap = Math.max(0, mode.maxBaseCards - (final ? 1 : 0));
  const capped = ordered.slice(0, cap);
  return final ? [...capped, final] : capped;
}

export function makeInitialState({ modeId, scope, useCase = 'private', claim }) {
  const cleanClaim = String(claim || '').trim();
  const deck = buildBaseDeck(modeId, scope, useCase);
  return {
    repo: '42ndMirror',
    version: '0.3.0-pressure-aware-cards',
    modeId,
    scope,
    useCase,
    claim: cleanClaim,
    label: cleanClaim,
    baseDeck: deck,
    baseIndex: 0,
    pendingFollowUps: [],
    askedCardIds: [],
    answers: [],
    startedAt: Date.now(),
    lastCardAt: Date.now(),
    timing: []
  };
}

export function getNextCard(state) {
  const follow = popNextFollowUp(state);
  if (follow) return follow;
  return state.baseDeck[state.baseIndex] ?? null;
}

function popNextFollowUp(state) {
  while (state.pendingFollowUps.length) {
    const id = state.pendingFollowUps.shift();
    if (state.askedCardIds.includes(id)) continue;
    const card = FOLLOW_UP_CARDS.find(item => item.id === id);
    if (card) return card;
  }
  return null;
}

export function answerCard(state, card, answer) {
  const now = Date.now();
  const elapsedMs = Math.max(0, now - state.lastCardAt);
  const isBase = state.baseDeck[state.baseIndex]?.id === card.id;

  state.answers.push({
    cardId: card.id,
    answerId: answer.id,
    elapsedMs,
    effects: cloneEffects(answer.effects ?? {})
  });

  state.askedCardIds.push(card.id);
  state.timing.push(elapsedMs);
  state.lastCardAt = now;

  const mode = getMode(state.modeId);
  if (Array.isArray(answer.followUps)) {
    const queued = new Set(state.pendingFollowUps);
    for (const id of answer.followUps) {
      const currentFollowUps = countAskedFollowUps(state) + state.pendingFollowUps.length;
      if (currentFollowUps >= mode.maxFollowUps && state.modeId !== 'serious') break;
      if (!state.askedCardIds.includes(id) && !queued.has(id)) {
        state.pendingFollowUps.push(id);
        queued.add(id);
      }
    }
  }

  if (isBase) state.baseIndex += 1;
  return state;
}

function countAskedFollowUps(state) {
  const ids = new Set(FOLLOW_UP_CARDS.map(card => card.id));
  return state.askedCardIds.filter(id => ids.has(id)).length;
}

function cloneEffects(effects) {
  return JSON.parse(JSON.stringify(effects || {}));
}

export function calculateResult(state) {
  const totals = emptyTotals();
  applyUseCasePressure(totals, state.useCase);
  for (const item of state.answers) applyEffects(totals, item.effects || {});

  applyMetaSignals(totals, state);

  const gateSummary = summarizeGates(totals.gates);
  const coverage = summarizeCoverage(totals.coverage);
  const quality = summarizeQuality(totals.quality, state.timing, state.answers.length, coverage, gateSummary);

  const lateralScale = computeLateralScale(state, coverage);
  let xRaw = round6((totals.empathy - totals.practicality) / lateralScale);
  let zRaw = round6((totals.wisdom - totals.knowledge) / lateralScale);
  let yRaw = round6(computeYRaw(gateSummary, quality, coverage));

  const adjusted = applyQualityCaps({ x: xRaw, y: yRaw, z: zRaw }, quality, coverage, totals);
  xRaw = adjusted.x;
  yRaw = adjusted.y;
  zRaw = adjusted.z;

  const projected = projectToOctahedronSurface({ x: xRaw, y: yRaw, z: zRaw });
  const interpretation = buildInterpretation(projected, totals, gateSummary, quality, coverage, state);

  const id = makeResultId();
  const label = getResultLabel(state);
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
    use_case: state.useCase,
    use_case_label: getUseCase(state.useCase).name,
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
    entry_text: entryText,
    selected_answers: state.answers.map(item => ({
      card_id: item.cardId,
      answer_id: item.answerId,
      elapsed_ms: item.elapsedMs
    }))
  };
}

function emptyTotals() {
  const gates = {};
  for (const id of GATE_IDS) gates[id] = 0;
  const quality = {};
  for (const key of QUALITY_KEYS) quality[key] = 0;
  const coverage = {};
  for (const axis of AXES) coverage[axis] = 0;
  return { empathy: 0, practicality: 0, wisdom: 0, knowledge: 0, gates, quality, coverage };
}

function applyUseCasePressure(totals, useCase) {
  if (useCase === 'group') totals.quality.social_performance_pressure += 0.4;
  if (useCase === 'debate') totals.quality.social_performance_pressure += 0.8;
  if (useCase === 'fiction') totals.quality.provisional_sample += 0.35;
}

function applyEffects(totals, effects) {
  for (const axis of AXES) {
    if (Number.isFinite(effects[axis])) totals[axis] += effects[axis];
  }
  if (effects.gates) {
    for (const gate of GATE_IDS) {
      if (Number.isFinite(effects.gates[gate])) totals.gates[gate] += effects.gates[gate];
    }
  }
  if (effects.quality) {
    for (const key of Object.keys(effects.quality)) {
      if (!Number.isFinite(totals.quality[key])) totals.quality[key] = 0;
      if (Number.isFinite(effects.quality[key])) totals.quality[key] += effects.quality[key];
    }
  }
  if (effects.coverage) {
    for (const axis of AXES) {
      if (Number.isFinite(effects.coverage[axis])) totals.coverage[axis] += effects.coverage[axis];
    }
  }
}

function applyMetaSignals(totals, state) {
  const answers = state.answers.map(item => item.answerId);
  const allComponents = [totals.empathy, totals.practicality, totals.wisdom, totals.knowledge];
  const max = Math.max(...allComponents);
  const min = Math.min(...allComponents);
  const spread = max - min;
  const total = allComponents.reduce((a, b) => a + b, 0);

  if (state.useCase === 'group' || state.useCase === 'debate') {
    totals.quality.social_performance_pressure += 0.35;
  }

  if (answers.includes('proof_badge') || answers.includes('score_still_settles') || answers.includes('ignore_lower_score')) {
    totals.quality.score_badge_pressure += 1;
  }

  if (answers.includes('repair_until_high') || answers.includes('audience_needs_higher')) {
    totals.quality.answer_shopping_signal += 1;
  }

  if (total >= 5.5 && spread <= 0.65 && (totals.quality.precision_signal || 0) < 2) {
    totals.quality.polished_neutrality_signal += 1;
    totals.gates.G4_contradiction_handling -= 0.15;
    totals.gates.G6_non_self_sealing -= 0.1;
  }
}

function summarizeGates(rawGates) {
  const items = {};
  let weightedSum = 0;
  let weightTotal = 0;

  for (const id of GATE_IDS) {
    const raw = rawGates[id] || 0;
    const normalized = clamp(raw / 2, -1, 1);
    const weight = GATE_WEIGHTS[id] ?? 1;
    const status = normalized >= 0.34 ? 'clear' : normalized <= -0.34 ? 'strained' : 'quiet';
    items[id] = {
      label: GATES[id],
      weight,
      raw: round6(raw),
      normalized: round6(normalized),
      status
    };
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
  const minCoverage = Math.min(...AXES.map(axis => items[axis]));
  const maxCoverage = Math.max(...AXES.map(axis => items[axis]));
  return {
    items,
    touched,
    weak,
    missing,
    touched_count: touched.length,
    all_four_touched: touched.length === 4,
    min: round6(minCoverage),
    max: round6(maxCoverage),
    spread: round6(maxCoverage - minCoverage)
  };
}

function computeLateralScale(state, coverage) {
  const base = state.modeId === 'serious' ? 5.5 : 4.3;
  const coverageLift = Math.min(1.3, coverage.touched_count * 0.18);
  const publicLift = state.useCase === 'debate' ? 0.25 : state.useCase === 'group' ? 0.15 : 0;
  return base + coverageLift + publicLift;
}

function computeYRaw(gateSummary, quality, coverage) {
  let y = gateSummary.average;

  if (coverage.all_four_touched && (quality.counts.precision_signal || 0) >= 2) y += 0.1;
  if (!coverage.all_four_touched) y -= (4 - coverage.touched_count) * 0.025;

  if (quality.grade === 'weak' || quality.grade === 'sandbox') y *= 0.5;
  else if (quality.grade === 'provisional') y *= 0.72;

  return clamp(y, -1, 1);
}

function applyQualityCaps(raw, quality, coverage, totals) {
  const out = { x: round6(raw.x), y: round6(raw.y), z: round6(raw.z) };
  const counts = quality.counts;

  if ((counts.sealed_signal || 0) >= 2) out.y = Math.min(out.y, -0.22);
  if ((counts.score_badge_pressure || 0) >= 2) out.y = Math.min(out.y, -0.12);
  if ((counts.answer_shopping_signal || 0) >= 2) out.y = Math.min(out.y, 0.03);
  if ((counts.social_performance_pressure || 0) >= 3) out.y = Math.min(out.y, 0.18);
  if ((counts.polished_neutrality_signal || 0) >= 1) out.y = Math.min(out.y, 0.42);
  if ((counts.low_signal || 0) >= 2 || quality.grade === 'sandbox') out.y = Math.min(out.y, 0.1);

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

function strongestComponent(totals) {
  return Object.entries({
    empathy: totals.empathy,
    practicality: totals.practicality,
    wisdom: totals.wisdom,
    knowledge: totals.knowledge
  }).sort((a, b) => b[1] - a[1])[0]?.[0] || 'wisdom';
}

function summarizeQuality(rawQuality, timing, answerCount, coverage, gateSummary) {
  const quality = {};
  for (const key of QUALITY_KEYS) quality[key] = rawQuality[key] || 0;

  const avgMs = timing.length ? timing.reduce((a, b) => a + b, 0) / timing.length : 0;
  const fastRatio = timing.length ? timing.filter(ms => ms > 0 && ms < 1050).length / timing.length : 0;

  let score = 72;
  score += (quality.high_signal || 0) * 4;
  score += (quality.precision_signal || 0) * 5;
  score += gateSummary.clear_count * 3;
  score -= gateSummary.strained_count * 6;
  score -= (quality.incomplete_signal || 0) * 5;
  score -= (quality.low_signal || 0) * 8;
  score -= (quality.provisional_sample || 0) * 4;
  score -= (quality.uncertainty || 0) * 3;
  score -= (quality.narrow_sample || 0) * 3;
  score -= (quality.noisy_sample || 0) * 5;
  score -= (quality.sandbox_sample || 0) * 16;
  score -= (quality.taste_sample || 0) * 7;
  score -= (quality.needs_disambiguation || 0) * 3;
  score -= (quality.self_protective_signal || 0) * 7;
  score -= (quality.sealed_signal || 0) * 12;
  score -= (quality.social_performance_pressure || 0) * 5;
  score -= (quality.score_badge_pressure || 0) * 9;
  score -= (quality.answer_shopping_signal || 0) * 11;
  score -= (quality.polished_neutrality_signal || 0) * 7;
  if (!coverage.all_four_touched) score -= (4 - coverage.touched_count) * 4;
  if (answerCount >= 5 && fastRatio >= 0.5) score -= 9;

  score = clamp(Math.round(score), 0, 100);

  let grade = 'strong';
  if ((quality.sandbox_sample || 0) >= 2) grade = 'sandbox';
  else if (score < 45) grade = 'weak';
  else if (score < 70) grade = 'provisional';
  else if (score < 86) grade = 'usable';

  const flags = [];
  if ((quality.social_performance_pressure || 0) >= 2) flags.push('public comparison pressure');
  if ((quality.score_badge_pressure || 0) >= 2) flags.push('score-as-proof pressure');
  if ((quality.answer_shopping_signal || 0) >= 2) flags.push('retake pressure');
  if ((quality.polished_neutrality_signal || 0) >= 1) flags.push('over-smooth answer pattern');
  if ((quality.sealed_signal || 0) >= 1) flags.push('low update room');
  if ((quality.self_protective_signal || 0) >= 1) flags.push('protective filtering');
  if ((quality.narrow_sample || 0) >= 1) flags.push('narrow sample');
  if ((quality.taste_sample || 0) >= 1) flags.push('appeal-heavy sample');
  if ((quality.sandbox_sample || 0) >= 1) flags.push('tool-test sample');
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

  if (manhattan < 1e-9) {
    return { x: 0, y: -1, z: 0, note: 'no active signal; strict surface fallback used' };
  }

  const point = {
    x: round6(x / manhattan),
    y: round6(y / manhattan),
    z: round6(z / manhattan)
  };
  forceRoundedSurface(point);

  return {
    x: point.x,
    y: point.y,
    z: point.z,
    note: 'raw vector normalized to octahedron surface'
  };
}

function forceRoundedSurface(point) {
  const axes = ['x', 'y', 'z'];
  const sum = axes.reduce((acc, axis) => acc + Math.abs(point[axis]), 0);
  const diff = round6(1 - sum);
  if (Math.abs(diff) < 0.000001) return;

  let target = axes[0];
  for (const axis of axes) {
    if (Math.abs(point[axis]) > Math.abs(point[target])) target = axis;
  }
  let sign = Math.sign(point[target]);
  if (!sign) sign = target === 'y' ? 1 : 1;
  point[target] = round6(point[target] + sign * diff);
}

function buildInterpretation(projected, totals, gateSummary, quality, coverage, state) {
  const simple = getMode(state.modeId).readingLevel === 'simple';
  const notes = [];
  const xLabel = projected.x >= 0.08 ? 'empathy-leaning' : projected.x <= -0.08 ? 'practicality-leaning' : 'balanced on empathy/practicality';
  const zLabel = projected.z >= 0.08 ? 'wisdom-leaning' : projected.z <= -0.08 ? 'knowledge-leaning' : 'balanced on wisdom/knowledge';
  const yLabel = projected.y >= 0.34 ? 'stable' : projected.y <= -0.34 ? 'unstable' : 'borderline';

  if (simple) {
    notes.push(`This run leans ${shortAxisText(xLabel)}.`);
    notes.push(`It also leans ${shortAxisText(zLabel)}.`);
    notes.push(`The pressure score is ${yLabel}.`);
  } else {
    notes.push(`X-axis: ${xLabel}.`);
    notes.push(`Z-axis: ${zLabel}.`);
    notes.push(`Y-axis: ${yLabel} for this scope.`);
  }

  const sorted = Object.entries({
    empathy: totals.empathy,
    practicality: totals.practicality,
    wisdom: totals.wisdom,
    knowledge: totals.knowledge
  }).sort((a, b) => b[1] - a[1]);

  const top = sorted[0];
  if (top && top[1] > 0) {
    notes.push(simple ? `Strongest pull: ${top[0]}.` : `Strongest expressed pull: ${top[0]}.`);
  }

  if (coverage.missing.length) notes.push(simple ? `Light count: ${coverage.missing.join(', ')}.` : `Light or untouched accounting: ${coverage.missing.join(', ')}.`);
  else if (coverage.weak.length) notes.push(simple ? `Some light parts: ${coverage.weak.join(', ')}.` : `Lightly touched accounting: ${coverage.weak.join(', ')}.`);
  else notes.push(simple ? 'All four parts were counted.' : 'All four lateral dimensions were counted.');

  if (gateSummary.strained_count > 0) {
    const strained = Object.values(gateSummary.items).filter(g => g.status === 'strained').map(g => g.label);
    notes.push(simple ? `Strained checks: ${strained.join(', ')}.` : `Strained gate pressure: ${strained.join(', ')}.`);
  } else if (gateSummary.clear_count >= 4) {
    notes.push(simple ? 'Most pressure checks cleared.' : 'Most stability gates cleared for this scope.');
  } else {
    notes.push(simple ? 'Some checks stayed quiet.' : 'Several gates stayed quiet rather than strongly clear or strained.');
  }

  if (quality.flags.length) notes.push(simple ? `Signal note: ${quality.flags[0]}.` : `Signal note: ${quality.flags[0]}.`);

  const label = `${capitalize(yLabel)} · ${capitalize(xLabel)} · ${capitalize(zLabel)}`;
  return {
    label,
    notes,
    reading: {
      stability: yLabel,
      empathy_practicality: xLabel,
      wisdom_knowledge: zLabel,
      scope: getScope(state.scope).name,
      use_case: getUseCase(state.useCase).name
    }
  };
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

function getResultLabel(state) {
  return state.claim || `${getScope(state.scope).name} (${getUseCase(state.useCase).name})`;
}

function makeEntryText(label, projected, quality, interpretation) {
  return `“${label}” → x ${format(projected.x)}, y ${format(projected.y)}, z ${format(projected.z)} · ${quality.grade} · ${interpretation.label}`;
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
