export const AXIS_CONVENTION = {
  x_positive: 'empathy',
  x_negative: 'practicality',
  y_positive: 'positive epistemic stability',
  y_negative: 'negative epistemic stability',
  z_positive: 'wisdom',
  z_negative: 'knowledge',
  surface: '|x| + |y| + |z| = 1'
};

export const MODES = {
  fast: { id: 'fast', name: 'Fast mode', simpleName: 'Fast', readingLevel: 'normal', maxCards: 7 },
  adhd: { id: 'adhd', name: 'ADHD mode', simpleName: 'Easy words', readingLevel: 'simple', maxCards: 7 },
  serious: { id: 'serious', name: 'Serious mode', simpleName: 'Deeper', readingLevel: 'normal', maxCards: 11 }
};

export const SCOPES = [
  { id: 'claim', name: 'Claim or belief', simpleName: 'Thought', bias: { evidential: 0.16, definitional: 0.08 } },
  { id: 'decision', name: 'Decision', simpleName: 'Choice', bias: { practical: 0.14, consequence: 0.12, micro: 0.06 } },
  { id: 'reaction', name: 'Reaction', simpleName: 'Reaction', bias: { affective: 0.14, social: 0.1 } },
  { id: 'argument', name: 'Argument', simpleName: 'Argument', bias: { evidential: 0.12, countercase: 0.1, social: 0.06 } },
  { id: 'pattern', name: 'Person or character pattern', simpleName: 'Person/character', bias: { comparative: 0.12, consequence: 0.1, social: 0.06 } },
  { id: 'comparison', name: 'Comparison', simpleName: 'Compare two things', bias: { comparative: 0.18, definitional: 0.06 } }
];

export const SETTINGS = [
  { id: 'private', name: 'Private check', simpleName: 'Just me', bias: {} },
  { id: 'group', name: 'Group comparison', simpleName: 'With friends', bias: { social: 0.18, score_pressure: 0.16 } },
  { id: 'debate', name: 'Debate pressure', simpleName: 'To prove a point', bias: { social: 0.2, score_pressure: 0.16, countercase: 0.08 } },
  { id: 'fiction', name: 'Fiction or strategy read', simpleName: 'Story/game read', bias: { comparative: 0.15, consequence: 0.08, practical: 0.06 } }
];

export const UI_COPY = {
  normal: {
    title: '42ndMirror',
    subtitle: 'A quick card test for the shape of an idea, choice, argument, or comparison.',
    howItWorks: 'Name the scope, answer the cards, then see the plotted point.',
    modeTitle: 'Mode',
    scopeTitle: 'Scope',
    settingTitle: 'Setting',
    labelTitle: 'Label the scope',
    labelHelp: 'This quoted label follows the cards and result.',
    labelPlaceholder: 'Example: the chicken probably came after the egg',
    start: 'Start',
    reset: 'Clear',
    restart: 'Start over',
    retake: 'Run another scope',
    copy: 'Copy JSON',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    result: 'Result',
    graphPoint: 'Graph point',
    mathCheck: 'Surface check',
    routing: 'Live routing',
    routingHelp: 'Intent and pressure routing shown without the answer key.',
    resultText: 'Plain readout',
    saved: 'Recent entries',
    savedEmpty: 'Completed runs will appear here.',
    remove: 'Remove',
    confirmTitle: 'Remove entry?',
    confirmText: 'This removes the saved run from this browser.',
    cancel: 'Cancel',
    confirmRemove: 'Remove entry',
    quotedScope: 'Scope',
    card: 'Card',
    noLabel: 'Untitled scope',
    back: 'Back',
    chooseOne: 'Pick the closest honest answer.'
  },
  simple: {
    title: '42ndMirror',
    subtitle: 'A short card test for a thought, choice, argument, or comparison.',
    howItWorks: 'Name it, pick answers, get x, y, z.',
    modeTitle: 'Mode',
    scopeTitle: 'Thing',
    settingTitle: 'Where it is used',
    labelTitle: 'Name it',
    labelHelp: 'This name stays on every card.',
    labelPlaceholder: 'Example: should I eat now',
    start: 'Start',
    reset: 'Clear',
    restart: 'Start over',
    retake: 'Try another one',
    copy: 'Copy JSON',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    result: 'Result',
    graphPoint: 'Graph point',
    mathCheck: 'Math check',
    routing: 'Card picker',
    routingHelp: 'Shows why the next card was picked.',
    resultText: 'Simple readout',
    saved: 'Saved runs',
    savedEmpty: 'Finished runs show up here.',
    remove: 'Delete',
    confirmTitle: 'Delete this?',
    confirmText: 'This deletes the saved run from this browser.',
    cancel: 'Cancel',
    confirmRemove: 'Delete',
    quotedScope: 'Thing',
    card: 'Card',
    noLabel: 'Unnamed thing',
    back: 'Back',
    chooseOne: 'Pick the best fit.'
  }
};

export const LOADS = [
  'causal', 'definitional', 'evidential', 'consequence', 'moral', 'practical',
  'comparative', 'social', 'affective', 'micro', 'playful', 'stakes', 'uncertainty',
  'score_pressure', 'countercase'
];

export const PRESSURES = {
  person_cost: { label: 'person-cost', axis: 'empathy' },
  constraint_cost: { label: 'constraint-cost', axis: 'practicality' },
  proof_cost: { label: 'proof-cost', axis: 'knowledge' },
  context_cost: { label: 'context-cost', axis: 'wisdom' }
};

export const GATES = {
  counter_consideration: 'Countercase considered',
  fair_opposition: 'Opposite side stated fairly',
  self_correction: 'Can revise',
  contradiction_handling: 'Handles conflict',
  reality_contact: 'Touches reality',
  non_sealing: 'No sealed loop'
};

export const GATE_WEIGHTS = {
  counter_consideration: 0.8,
  fair_opposition: 1.0,
  self_correction: 1.1,
  contradiction_handling: 1.2,
  reality_contact: 1.25,
  non_sealing: 1.1
};

export const ROUTING_WEIGHTS = {
  route: 0.44,
  pressure: 0.26,
  gap: 0.16,
  gate: 0.08,
  stage: 0.06
};

const C = (main, sub = '') => ({ main, sub });
const A = (id, normal, simple, effects = {}) => ({ id, normal, simple, effects });
const axes = (o = {}) => o;
const loads = (o = {}) => o;
const gates = (o = {}) => o;
const quality = (o = {}) => o;
const pressure = (o = {}) => o;

export const CARD_BANK = [
  {
    id: 'opener_burden_01',
    stage: 'early',
    fixedFirst: true,
    routes: Object.fromEntries(LOADS.map(k => [k, 0.2])),
    pressures: { person_cost: 0.2, constraint_cost: 0.2, proof_cost: 0.2, context_cost: 0.2 },
    gates: { reality_contact: 0.2, contradiction_handling: 0.15 },
    normal: { kicker: 'First cut', title: 'What would make this harder to judge?', help: 'Pick the burden that would sharpen the run.' },
    simple: { kicker: 'First card', title: 'What makes this hard?', help: 'Pick what would make the answer clearer.' },
    answers: [
      A('words_do_work', C('The words may be doing the work.', 'A boundary, label, or definition could change the answer.'), C('The words matter.', 'A word or label could change it.'), { axes: axes({ knowledge: 0.24, wisdom: 0.16 }), loads: loads({ definitional: 0.55, evidential: 0.12 }), gates: gates({ reality_contact: 0.12 }), pressureNext: pressure({ proof_cost: 0.22, context_cost: 0.18 }) }),
      A('order_do_work', C('The order of events may be doing the work.', 'Timing, cause, sequence, or origin could decide it.'), C('The order matters.', 'Timing or cause could decide it.'), { axes: axes({ knowledge: 0.26, practicality: 0.12 }), loads: loads({ causal: 0.55, evidential: 0.16 }), gates: gates({ reality_contact: 0.18 }), pressureNext: pressure({ proof_cost: 0.25, context_cost: 0.1 }) }),
      A('real_world_cost', C('A real-world cost may be easy to undercount.', 'The clean answer might miss who or what pays for it.'), C('A hidden cost matters.', 'Someone or something may pay for it.'), { axes: axes({ empathy: 0.24, practicality: 0.14, wisdom: 0.1 }), loads: loads({ consequence: 0.34, moral: 0.26, practical: 0.14 }), gates: gates({ contradiction_handling: 0.12, reality_contact: 0.14 }), pressureNext: pressure({ person_cost: 0.24, constraint_cost: 0.16 }) }),
      A('not_that_deep', C('The scope may be small or casual.', 'The useful answer may be a light operational read.'), C('This is small.', 'Keep it light and practical.'), { axes: axes({ practicality: 0.22, wisdom: 0.08 }), loads: loads({ micro: 0.45, playful: 0.3, practical: 0.2 }), gates: gates({ reality_contact: 0.1 }), quality: quality({ low_stakes: 1, provisional: 1 }), pressureNext: pressure({ context_cost: 0.12, proof_cost: 0.1 }) })
    ]
  },
  {
    id: 'settle_best_01',
    stage: 'early',
    routes: { causal: 0.48, definitional: 0.48, evidential: 0.48, uncertainty: 0.25, countercase: 0.2 },
    pressures: { proof_cost: 0.42, context_cost: 0.22 },
    gates: { reality_contact: 0.45, counter_consideration: 0.2 },
    normal: { kicker: 'Settlement test', title: 'What would settle the core load best?', help: 'This narrows the kind of reasoning the scope needs.' },
    simple: { kicker: 'What settles it?', title: 'What would help most?', help: 'Pick the thing that would clear it up.' },
    answers: [
      A('cleaner_boundary', C('A cleaner boundary.', 'The answer depends on what counts and what does not.'), C('Clearer meaning.', 'What counts? What does not?'), { axes: axes({ wisdom: 0.24, knowledge: 0.2 }), loads: loads({ definitional: 0.5 }), gates: gates({ contradiction_handling: 0.22, reality_contact: 0.12 }), pressureNext: pressure({ proof_cost: 0.2 }) }),
      A('better_timeline', C('A better timeline.', 'The answer depends on order, cause, or sequence.'), C('Better order.', 'What came first? What caused what?'), { axes: axes({ knowledge: 0.28, practicality: 0.1 }), loads: loads({ causal: 0.5, evidential: 0.12 }), gates: gates({ reality_contact: 0.24 }), pressureNext: pressure({ context_cost: 0.16 }) }),
      A('strong_counterexample', C('A strong counterexample.', 'One clean exception could force a revision.'), C('One good counterexample.', 'A real exception could change it.'), { axes: axes({ knowledge: 0.24, wisdom: 0.12 }), loads: loads({ evidential: 0.38, countercase: 0.28 }), gates: gates({ counter_consideration: 0.34, self_correction: 0.26, non_sealing: 0.16 }), pressureNext: pressure({ context_cost: 0.14 }) }),
      A('decision_consequence', C('A consequence check.', 'The exact wording matters less than what follows from using it.'), C('What happens after.', 'The result matters more than the words.'), { axes: axes({ practicality: 0.25, empathy: 0.12, wisdom: 0.12 }), loads: loads({ consequence: 0.4, practical: 0.24 }), gates: gates({ reality_contact: 0.22 }), pressureNext: pressure({ person_cost: 0.14, constraint_cost: 0.18 }) })
    ]
  },
  {
    id: 'micro_live_constraint_01',
    stage: 'early',
    routes: { micro: 0.86, practical: 0.42, affective: 0.18, uncertainty: 0.12, playful: 0.25 },
    pressures: { constraint_cost: 0.36, person_cost: 0.12, context_cost: 0.12 },
    gates: { reality_contact: 0.38 },
    normal: { kicker: 'Small-scope check', title: 'What is the live constraint?', help: 'For small scopes, the useful card is usually the real friction.' },
    simple: { kicker: 'Small thing', title: 'What is the real thing here?', help: 'Pick the closest one.' },
    answers: [
      A('body_floor', C('Body floor.', 'Food, sleep, pain, energy, or focus sets the floor.'), C('Body needs.', 'Food, sleep, energy, or focus.'), { axes: axes({ practicality: 0.32, empathy: 0.12, wisdom: 0.1 }), loads: loads({ micro: 0.35, practical: 0.22 }), gates: gates({ reality_contact: 0.34 }), quality: quality({ low_stakes: 0.4 }), pressureNext: pressure({ context_cost: 0.14 }) }),
      A('task_flow', C('Task flow.', 'Stopping or switching may break useful momentum.'), C('Flow.', 'Stopping may break momentum.'), { axes: axes({ practicality: 0.34, knowledge: 0.08 }), loads: loads({ micro: 0.28, practical: 0.28 }), gates: gates({ reality_contact: 0.22 }), pressureNext: pressure({ person_cost: 0.1, context_cost: 0.12 }) }),
      A('avoidance_signal', C('Avoidance signal.', 'The small choice may be hiding a harder task or discomfort.'), C('Avoiding something.', 'This may hide a harder task.'), { axes: axes({ wisdom: 0.24, knowledge: 0.1 }), loads: loads({ affective: 0.26, uncertainty: 0.22, micro: 0.18 }), gates: gates({ self_correction: 0.18, reality_contact: 0.16 }), quality: quality({ needs_disambiguation: 0.8 }), pressureNext: pressure({ constraint_cost: 0.12, proof_cost: 0.1 }) }),
      A('tiny_operational', C('Tiny operational call.', 'The clean move is probably a low-drama next step.'), C('Just a tiny call.', 'Pick a simple next step.'), { axes: axes({ practicality: 0.22, wisdom: 0.08 }), loads: loads({ micro: 0.32, playful: 0.18 }), gates: gates({ reality_contact: 0.12 }), quality: quality({ low_stakes: 1.2, provisional: 0.8 }), pressureNext: pressure({ context_cost: 0.1 }) })
    ]
  },
  {
    id: 'seriousness_load_01',
    stage: 'mid',
    routes: { micro: 0.25, playful: 0.34, moral: 0.34, social: 0.28, stakes: 0.42, practical: 0.24, consequence: 0.24 },
    pressures: { person_cost: 0.26, constraint_cost: 0.24, context_cost: 0.22 },
    gates: { reality_contact: 0.22, contradiction_handling: 0.16 },
    normal: { kicker: 'Load test', title: 'How much weight should this scope carry?', help: 'This keeps light topics light and heavy topics honest.' },
    simple: { kicker: 'How heavy is it?', title: 'How much weight does this need?', help: 'Pick how serious it is.' },
    answers: [
      A('light_probe', C('Light probe.', 'Useful for testing the shape, but not worth a heavy verdict.'), C('Light test.', 'Useful, but not heavy.'), { axes: axes({ wisdom: 0.12, practicality: 0.14 }), loads: loads({ playful: 0.34, micro: 0.2 }), gates: gates({ self_correction: 0.12 }), quality: quality({ low_stakes: 1, provisional: 0.8 }), pressureNext: pressure({ proof_cost: 0.1 }) }),
      A('personal_action', C('Personal action.', 'The result matters because someone actually has to act.'), C('Real action.', 'Someone has to do something.'), { axes: axes({ practicality: 0.24, empathy: 0.12, wisdom: 0.08 }), loads: loads({ practical: 0.34, consequence: 0.2, stakes: 0.14 }), gates: gates({ reality_contact: 0.18 }), pressureNext: pressure({ person_cost: 0.14, context_cost: 0.12 }) }),
      A('moral_public', C('Moral or public load.', 'People, duties, fairness, or social consequences are in play.'), C('People/fairness issue.', 'People or fairness matter here.'), { axes: axes({ empathy: 0.26, wisdom: 0.18, practicality: 0.1 }), loads: loads({ moral: 0.36, social: 0.18, stakes: 0.24 }), gates: gates({ fair_opposition: 0.16, contradiction_handling: 0.14 }), pressureNext: pressure({ constraint_cost: 0.18, proof_cost: 0.1 }) }),
      A('contest_load', C('Contest load.', 'The point may be used to rank, win, persuade, or signal competence.'), C('People may use it to win.', 'It may become a contest.'), { axes: axes({ practicality: 0.16, wisdom: 0.14 }), loads: loads({ social: 0.32, score_pressure: 0.36, stakes: 0.1 }), gates: gates({ non_sealing: -0.08 }), quality: quality({ social_pressure: 1, score_badge_pressure: 1 }), pressureNext: pressure({ context_cost: 0.18, person_cost: 0.12 }) })
    ]
  },
  {
    id: 'person_pressure_01',
    stage: 'mid',
    pressureCard: 'person_cost',
    routes: { moral: 0.35, consequence: 0.34, social: 0.25, practical: 0.2, stakes: 0.25, comparative: 0.16 },
    pressures: { person_cost: 0.8 },
    gates: { counter_consideration: 0.22, fair_opposition: 0.2, contradiction_handling: 0.16 },
    normal: { kicker: 'Pressure check', title: 'If the clean answer misses something human, where would that happen?', help: 'Pick the pressure that most deserves a fair look.' },
    simple: { kicker: 'Pressure check', title: 'What person-cost could be missed?', help: 'Pick the one worth checking.' },
    answers: [
      A('hidden_person_cost', C('A real person pays quietly.', 'The cost is not dramatic, but it still matters.'), C('Someone pays quietly.', 'Small harm can still matter.'), { axes: axes({ empathy: 0.34, wisdom: 0.1 }), loads: loads({ moral: 0.22, consequence: 0.16 }), gates: gates({ counter_consideration: 0.22, fair_opposition: 0.14 }), pressureResponse: 'integrate' }),
      A('uneven_landing', C('The same rule lands unevenly.', 'The rule may look neutral but hit different cases differently.'), C('Same rule, uneven result.', 'The rule may land badly.'), { axes: axes({ empathy: 0.24, wisdom: 0.22, knowledge: 0.08 }), loads: loads({ moral: 0.22, definitional: 0.1, consequence: 0.16 }), gates: gates({ contradiction_handling: 0.22, reality_contact: 0.12 }), pressureResponse: 'integrate' }),
      A('considered_less_relevant_person', C('I can name it, but it is less relevant here.', 'The person-cost exists, but the scope still turns on another load.'), C('I see it, but it is smaller here.', 'It matters less for this case.'), { axes: axes({ empathy: 0.14, wisdom: 0.22, practicality: 0.08 }), loads: loads({ moral: 0.1, consequence: 0.1 }), gates: gates({ counter_consideration: 0.26, contradiction_handling: 0.2, reality_contact: 0.1 }), pressureResponse: 'principled_reject' }),
      A('person_cost_noise', C('That pressure mostly distracts from the load.', 'In this scope, adding person-cost muddies the actual test.'), C('That mostly distracts.', 'It does not help this case much.'), { axes: axes({ practicality: 0.18, knowledge: 0.08 }), loads: loads({ practical: 0.12 }), gates: gates({ counter_consideration: -0.08, fair_opposition: -0.08 }), quality: quality({ narrow_sample: 0.5 }), pressureResponse: 'dismiss' })
    ]
  },
  {
    id: 'constraint_pressure_01',
    stage: 'mid',
    pressureCard: 'constraint_cost',
    routes: { moral: 0.28, consequence: 0.38, practical: 0.36, social: 0.18, stakes: 0.24 },
    pressures: { constraint_cost: 0.8 },
    gates: { reality_contact: 0.28, contradiction_handling: 0.2 },
    normal: { kicker: 'Pressure check', title: 'If the generous answer fails, where would it fail?', help: 'Pick the constraint that most deserves a fair look.' },
    simple: { kicker: 'Pressure check', title: 'What could break the nice answer?', help: 'Pick the real limit.' },
    answers: [
      A('enforcement_limit', C('It cannot be enforced cleanly.', 'The rule may sound good but fail in real use.'), C('Hard to enforce.', 'Good idea, messy in real life.'), { axes: axes({ practicality: 0.36, wisdom: 0.08 }), loads: loads({ practical: 0.28, consequence: 0.14 }), gates: gates({ reality_contact: 0.28 }), pressureResponse: 'integrate' }),
      A('resource_limit', C('It burns time, money, attention, or capacity.', 'The limit is not moral hostility; it is load.'), C('It costs too much.', 'Time, money, or energy runs out.'), { axes: axes({ practicality: 0.34, knowledge: 0.08 }), loads: loads({ practical: 0.24, consequence: 0.14 }), gates: gates({ reality_contact: 0.24 }), pressureResponse: 'integrate' }),
      A('considered_less_relevant_constraint', C('I can name the limit, but it is not decisive here.', 'The constraint exists, but the scope is carried by another burden.'), C('I see the limit, but it is smaller here.', 'It matters less for this case.'), { axes: axes({ practicality: 0.14, wisdom: 0.22, empathy: 0.08 }), loads: loads({ practical: 0.1, moral: 0.08 }), gates: gates({ counter_consideration: 0.24, contradiction_handling: 0.2, reality_contact: 0.12 }), pressureResponse: 'principled_reject' }),
      A('constraint_as_excuse', C('The limit sounds like an excuse.', 'The practical objection may be hiding unwillingness.'), C('That sounds like an excuse.', 'The limit may be fake.'), { axes: axes({ empathy: 0.12, wisdom: 0.1 }), loads: loads({ moral: 0.12, affective: 0.08 }), gates: gates({ fair_opposition: -0.08, reality_contact: -0.06 }), quality: quality({ possible_dodge: 0.4 }), pressureResponse: 'dismiss' })
    ]
  },
  {
    id: 'proof_pressure_01',
    stage: 'mid',
    pressureCard: 'proof_cost',
    routes: { evidential: 0.48, causal: 0.28, definitional: 0.24, uncertainty: 0.34, comparative: 0.14 },
    pressures: { proof_cost: 0.85 },
    gates: { reality_contact: 0.34, self_correction: 0.24, non_sealing: 0.16 },
    normal: { kicker: 'Pressure check', title: 'What proof burden should your answer survive?', help: 'Pick the test that would make the answer less loose.' },
    simple: { kicker: 'Proof check', title: 'What proof would test this?', help: 'Pick the strongest test.' },
    answers: [
      A('needs_observable_anchor', C('An observable anchor.', 'A real example, measurement, record, or source should touch it.'), C('A real example.', 'Something observable should touch it.'), { axes: axes({ knowledge: 0.34, practicality: 0.08 }), loads: loads({ evidential: 0.3 }), gates: gates({ reality_contact: 0.34, self_correction: 0.12 }), pressureResponse: 'integrate' }),
      A('needs_counterexample_test', C('A counterexample test.', 'The answer should say what would count against it.'), C('A counterexample.', 'What would prove it wrong?'), { axes: axes({ knowledge: 0.26, wisdom: 0.1 }), loads: loads({ evidential: 0.22, countercase: 0.24 }), gates: gates({ counter_consideration: 0.28, self_correction: 0.26, non_sealing: 0.2 }), pressureResponse: 'integrate' }),
      A('proof_limited_by_scope', C('Proof helps, but the scope is not only factual.', 'The evidence matters, but meaning, context, or consequence still carries weight.'), C('Proof helps, but not alone.', 'Context or meaning still matters.'), { axes: axes({ knowledge: 0.12, wisdom: 0.24 }), loads: loads({ evidential: 0.1, definitional: 0.12, consequence: 0.1 }), gates: gates({ contradiction_handling: 0.2, counter_consideration: 0.16 }), pressureResponse: 'principled_reject' }),
      A('proof_not_needed_here', C('Proof burden is low here.', 'The point is too light, too obvious, or too operational to need much proof.'), C('Not much proof needed.', 'This is light or obvious enough.'), { axes: axes({ practicality: 0.12, wisdom: 0.08 }), loads: loads({ micro: 0.12, playful: 0.1 }), gates: gates({ reality_contact: -0.04, self_correction: -0.04 }), quality: quality({ low_stakes: 0.6, narrow_sample: 0.4 }), pressureResponse: 'dismiss' })
    ]
  },
  {
    id: 'context_pressure_01',
    stage: 'mid',
    pressureCard: 'context_cost',
    routes: { definitional: 0.28, causal: 0.26, moral: 0.28, comparative: 0.24, social: 0.18, consequence: 0.24 },
    pressures: { context_cost: 0.85 },
    gates: { contradiction_handling: 0.32, counter_consideration: 0.2, fair_opposition: 0.12 },
    normal: { kicker: 'Pressure check', title: 'Where could the answer be too narrow?', help: 'Pick the context that most deserves a fair look.' },
    simple: { kicker: 'Context check', title: 'Where could this be too narrow?', help: 'Pick what may be missing.' },
    answers: [
      A('boundary_case', C('A boundary case.', 'The answer may change near the edge of the category.'), C('Edge case.', 'Near the edge, it may change.'), { axes: axes({ wisdom: 0.34, knowledge: 0.08 }), loads: loads({ definitional: 0.2, uncertainty: 0.12 }), gates: gates({ contradiction_handling: 0.28 }), pressureResponse: 'integrate' }),
      A('time_scale', C('A time-scale shift.', 'What works now may change later, or the origin story may matter.'), C('Time changes it.', 'Now vs later may differ.'), { axes: axes({ wisdom: 0.28, practicality: 0.08, knowledge: 0.08 }), loads: loads({ causal: 0.18, consequence: 0.14 }), gates: gates({ contradiction_handling: 0.22, reality_contact: 0.1 }), pressureResponse: 'integrate' }),
      A('context_seen_not_decisive', C('I can place the context, but it does not overturn the answer.', 'The narrow answer survives after the wider view is included.'), C('I see the context, but it still holds.', 'The answer survives the wider view.'), { axes: axes({ wisdom: 0.2, knowledge: 0.1, practicality: 0.08 }), loads: loads({ definitional: 0.08, evidential: 0.08 }), gates: gates({ counter_consideration: 0.22, contradiction_handling: 0.2, non_sealing: 0.12 }), pressureResponse: 'principled_reject' }),
      A('context_muddies_it', C('More context mostly muddies the issue.', 'The strongest answer keeps the scope tight.'), C('More context muddies it.', 'Keep the scope tight.'), { axes: axes({ knowledge: 0.16, practicality: 0.1 }), loads: loads({ evidential: 0.08, practical: 0.08 }), gates: gates({ contradiction_handling: -0.04, counter_consideration: -0.06 }), quality: quality({ narrow_sample: 0.4 }), pressureResponse: 'dismiss' })
    ]
  },
  {
    id: 'opposite_model_01',
    stage: 'mid',
    routes: { countercase: 0.5, social: 0.25, evidential: 0.22, moral: 0.2, comparative: 0.2, uncertainty: 0.2 },
    pressures: { person_cost: 0.25, constraint_cost: 0.25, proof_cost: 0.25, context_cost: 0.25 },
    gates: { counter_consideration: 0.38, fair_opposition: 0.32, non_sealing: 0.18 },
    normal: { kicker: 'Opposite model', title: 'What would make the other answer reasonable?', help: 'This tests whether the asymmetry survives fair pressure.' },
    simple: { kicker: 'Other side', title: 'What could make the other answer fair?', help: 'Pick the strongest reason.' },
    answers: [
      A('other_has_real_load', C('It carries a real load I was not centering.', 'The other answer tracks something I could miss.'), C('It sees something real.', 'I may not be centering it.'), { axes: axes({ wisdom: 0.18, empathy: 0.08, practicality: 0.08, knowledge: 0.08 }), loads: loads({ countercase: 0.28, uncertainty: 0.1 }), gates: gates({ counter_consideration: 0.34, fair_opposition: 0.26, self_correction: 0.12 }), pressureResponse: 'integrate' }),
      A('other_right_wrong_weight', C('It sees something real but gives it the wrong weight.', 'The objection matters, but not enough to move the center.'), C('It sees something, but too strongly.', 'Good point, wrong size.'), { axes: axes({ wisdom: 0.24, knowledge: 0.08 }), loads: loads({ countercase: 0.2, definitional: 0.08 }), gates: gates({ counter_consideration: 0.28, contradiction_handling: 0.22, fair_opposition: 0.16 }), pressureResponse: 'principled_reject' }),
      A('other_needs_more_proof', C('It may be right, but the proof is too thin.', 'The other answer needs a better anchor before it should move the result.'), C('Maybe, but needs proof.', 'It needs stronger facts.'), { axes: axes({ knowledge: 0.24, wisdom: 0.12 }), loads: loads({ evidential: 0.2, countercase: 0.18 }), gates: gates({ reality_contact: 0.2, counter_consideration: 0.18 }), pressureResponse: 'principled_reject' }),
      A('other_misses_load', C('Even its best version misses the main load.', 'The other answer fails the core thing this scope requires.'), C('It still misses the main thing.', 'Best version still fails.'), { axes: axes({ practicality: 0.08, knowledge: 0.08 }), loads: loads({ countercase: 0.06 }), gates: gates({ fair_opposition: -0.04, counter_consideration: -0.04 }), quality: quality({ possible_dodge: 0.35 }), pressureResponse: 'dismiss' })
    ]
  },
  {
    id: 'definition_edge_01',
    stage: 'mid',
    routes: { definitional: 0.72, evidential: 0.18, uncertainty: 0.2, comparative: 0.12 },
    pressures: { context_cost: 0.38, proof_cost: 0.26 },
    gates: { contradiction_handling: 0.34, reality_contact: 0.18 },
    normal: { kicker: 'Boundary test', title: 'Where does the boundary actually sit?', help: 'This tests whether the answer is about the thing, the label, or the edge case.' },
    simple: { kicker: 'Boundary', title: 'Where does the line sit?', help: 'Pick how the label works.' },
    answers: [
      A('strict_label', C('Strict label.', 'The label only applies after the category fully exists.'), C('Strict name.', 'The name only counts once it fully exists.'), { axes: axes({ knowledge: 0.24, practicality: 0.08 }), loads: loads({ definitional: 0.34 }), gates: gates({ contradiction_handling: 0.16 }), pressureNext: pressure({ context_cost: 0.18 }) }),
      A('origin_label', C('Origin label.', 'The label can apply at the point the category begins.'), C('Origin name.', 'The name counts when it starts.'), { axes: axes({ wisdom: 0.24, knowledge: 0.12 }), loads: loads({ definitional: 0.3, causal: 0.12 }), gates: gates({ contradiction_handling: 0.18 }), pressureNext: pressure({ proof_cost: 0.16 }) }),
      A('label_less_important', C('The label matters less than the chain.', 'The sequence or mechanism carries more than the wording.'), C('The chain matters more.', 'Wording is not the main thing.'), { axes: axes({ practicality: 0.12, knowledge: 0.22 }), loads: loads({ causal: 0.26, evidential: 0.12 }), gates: gates({ reality_contact: 0.16 }), pressureNext: pressure({ context_cost: 0.12 }) }),
      A('boundary_uncertain', C('The boundary is not clean enough yet.', 'The honest answer needs a weaker conclusion.'), C('The line is fuzzy.', 'Use a weaker answer.'), { axes: axes({ wisdom: 0.22, knowledge: 0.1 }), loads: loads({ uncertainty: 0.3, definitional: 0.18 }), gates: gates({ self_correction: 0.2, contradiction_handling: 0.2 }), quality: quality({ uncertainty: 0.8 }), pressureNext: pressure({ proof_cost: 0.12 }) })
    ]
  },
  {
    id: 'causal_sequence_01',
    stage: 'mid',
    routes: { causal: 0.78, evidential: 0.24, definitional: 0.1, consequence: 0.12 },
    pressures: { proof_cost: 0.38, context_cost: 0.24 },
    gates: { reality_contact: 0.34, contradiction_handling: 0.18 },
    normal: { kicker: 'Sequence test', title: 'What kind of sequence is being claimed?', help: 'This separates timeline, origin, mechanism, and wording.' },
    simple: { kicker: 'Order test', title: 'What kind of order is this?', help: 'Pick the best fit.' },
    answers: [
      A('timeline_sequence', C('Timeline sequence.', 'One thing existed or happened before the other.'), C('Timeline.', 'One happened first.'), { axes: axes({ knowledge: 0.28 }), loads: loads({ causal: 0.32, evidential: 0.12 }), gates: gates({ reality_contact: 0.2 }), pressureNext: pressure({ context_cost: 0.12 }) }),
      A('mechanism_sequence', C('Mechanism sequence.', 'The process that creates the thing matters more than simple before/after.'), C('How it happens.', 'The process matters.'), { axes: axes({ wisdom: 0.18, knowledge: 0.18 }), loads: loads({ causal: 0.28, consequence: 0.08 }), gates: gates({ contradiction_handling: 0.16, reality_contact: 0.16 }), pressureNext: pressure({ proof_cost: 0.12 }) }),
      A('category_origin', C('Category origin.', 'The key is when a new kind begins inside an older chain.'), C('New kind starts.', 'A new category begins in an older chain.'), { axes: axes({ wisdom: 0.24, knowledge: 0.16 }), loads: loads({ causal: 0.22, definitional: 0.18 }), gates: gates({ contradiction_handling: 0.22 }), pressureNext: pressure({ proof_cost: 0.14 }) }),
      A('sequence_too_loose', C('The sequence is too loose for a strong claim.', 'The safer answer should stay probabilistic.'), C('Too loose.', 'Keep the answer weaker.'), { axes: axes({ wisdom: 0.22, knowledge: 0.08 }), loads: loads({ uncertainty: 0.26, causal: 0.12 }), gates: gates({ self_correction: 0.2, non_sealing: 0.14 }), quality: quality({ uncertainty: 0.7 }), pressureNext: pressure({ proof_cost: 0.16 }) })
    ]
  },
  {
    id: 'score_pressure_01',
    stage: 'late',
    routes: { score_pressure: 0.9, social: 0.55, comparative: 0.28, countercase: 0.14 },
    pressures: { context_cost: 0.35, proof_cost: 0.25, person_cost: 0.18, constraint_cost: 0.18 },
    gates: { non_sealing: 0.3, fair_opposition: 0.18, counter_consideration: 0.18 },
    normal: { kicker: 'Use pressure', title: 'If people compare outputs, what keeps the run useful?', help: 'This only appears after the scope has some shape.' },
    simple: { kicker: 'Score use', title: 'If people compare scores, what keeps it useful?', help: 'Pick the safest use.' },
    answers: [
      A('compare_after_reasons', C('Compare after reasons.', 'The number follows the argument instead of replacing it.'), C('Reasons first.', 'Score after reasons.'), { axes: axes({ wisdom: 0.22, knowledge: 0.1 }), loads: loads({ social: 0.12, score_pressure: 0.12 }), gates: gates({ non_sealing: 0.28, fair_opposition: 0.16, reality_contact: 0.12 }), quality: quality({ score_pressure_handled: 1 }), pressureResponse: 'integrate' }),
      A('same_standard', C('Same standard.', 'The useful part is applying one visible rule to every run.'), C('Same rule for all.', 'Use one visible rule.'), { axes: axes({ practicality: 0.14, knowledge: 0.14, wisdom: 0.1 }), loads: loads({ social: 0.14, score_pressure: 0.1 }), gates: gates({ contradiction_handling: 0.2, reality_contact: 0.12 }), quality: quality({ score_pressure_handled: 0.7 }), pressureResponse: 'integrate' }),
      A('map_not_trophy', C('Map the disagreement.', 'The output helps locate the split, not crown the person.'), C('Map the split.', 'See the shape, not the winner.'), { axes: axes({ wisdom: 0.24, empathy: 0.08 }), loads: loads({ social: 0.12, comparative: 0.08 }), gates: gates({ fair_opposition: 0.22, non_sealing: 0.22 }), quality: quality({ score_pressure_handled: 1 }), pressureResponse: 'integrate' }),
      A('higher_number_wins', C('Higher number wins.', 'The score should settle who has the stronger take.'), C('Higher wins.', 'Use the score as proof.'), { axes: axes({ practicality: 0.08 }), loads: loads({ social: 0.2, score_pressure: 0.34 }), gates: gates({ non_sealing: -0.28, fair_opposition: -0.14, self_correction: -0.12 }), quality: quality({ score_badge_pressure: 1.5, social_pressure: 1, answer_shopping_risk: 0.6 }), pressureResponse: 'dismiss' })
    ]
  },
  {
    id: 'polished_balance_01',
    stage: 'late',
    routes: { uncertainty: 0.22, social: 0.22, score_pressure: 0.16, countercase: 0.2, moral: 0.14, practical: 0.14 },
    pressures: { person_cost: 0.25, constraint_cost: 0.25, proof_cost: 0.25, context_cost: 0.25 },
    gates: { self_correction: 0.22, contradiction_handling: 0.22, reality_contact: 0.16 },
    normal: { kicker: 'Balance audit', title: 'If your answers stayed smooth, why?', help: 'This checks whether balance is earned or just safe-looking.' },
    simple: { kicker: 'Balance check', title: 'If you kept picking the middle, why?', help: 'Pick the honest reason.' },
    answers: [
      A('earned_balance', C('The scope really has competing loads.', 'The balance comes from real pressure on more than one side.'), C('Real competing loads.', 'More than one side really matters.'), { axes: axes({ wisdom: 0.22, empathy: 0.08, practicality: 0.08, knowledge: 0.08 }), loads: loads({ uncertainty: 0.14, consequence: 0.08, moral: 0.08, evidential: 0.08 }), gates: gates({ contradiction_handling: 0.26, reality_contact: 0.16 }), quality: quality({ high_signal: 0.5 }), pressureResponse: 'integrate' }),
      A('not_enough_info', C('I do not have enough information.', 'The honest answer should stay provisional.'), C('Not enough info.', 'Keep it weaker for now.'), { axes: axes({ wisdom: 0.18, knowledge: 0.12 }), loads: loads({ uncertainty: 0.24, evidential: 0.08 }), gates: gates({ self_correction: 0.24, non_sealing: 0.12 }), quality: quality({ provisional: 1, uncertainty: 0.8 }), pressureResponse: 'integrate' }),
      A('looks_fair', C('I want the result to look fair.', 'The smooth answer may be managing appearances.'), C('It looks fair.', 'Maybe I want it to look good.'), { axes: axes({ empathy: 0.06, wisdom: 0.04 }), loads: loads({ social: 0.18, score_pressure: 0.16 }), gates: gates({ reality_contact: -0.08, self_correction: -0.08 }), quality: quality({ polished_neutrality: 1, social_pressure: 0.7 }), pressureResponse: 'dodge' }),
      A('avoiding_hard_call', C('I am avoiding the hard call.', 'The balance protects me from choosing the load that actually decides it.'), C('Avoiding the hard call.', 'Middle answer feels safer.'), { axes: axes({ wisdom: 0.06 }), loads: loads({ affective: 0.16, uncertainty: 0.12 }), gates: gates({ contradiction_handling: -0.12, reality_contact: -0.08, self_correction: 0.1 }), quality: quality({ possible_dodge: 1, low_signal: 0.5 }), pressureResponse: 'dodge' })
    ]
  },
  {
    id: 'final_commitment_01',
    stage: 'late',
    routes: Object.fromEntries(LOADS.map(k => [k, 0.22])),
    pressures: { person_cost: 0.25, constraint_cost: 0.25, proof_cost: 0.25, context_cost: 0.25 },
    gates: { self_correction: 0.34, non_sealing: 0.28, reality_contact: 0.18 },
    normal: { kicker: 'Close', title: 'After the pressure checks, what changed?', help: 'This decides whether the result is retained, revised, weakened, or sealed.' },
    simple: { kicker: 'End check', title: 'After the checks, what changed?', help: 'Pick the honest ending.' },
    answers: [
      A('retained_after_pressure', C('The answer mostly holds.', 'The missing pressures were considered and the center still holds.'), C('It still holds.', 'I checked the missing parts.'), { axes: axes({ wisdom: 0.2, knowledge: 0.08, practicality: 0.06, empathy: 0.06 }), loads: loads({ countercase: 0.1 }), gates: gates({ counter_consideration: 0.2, contradiction_handling: 0.22, non_sealing: 0.18 }), quality: quality({ high_signal: 0.7 }), pressureResponse: 'principled_reject' }),
      A('revised_center', C('The center moved.', 'One pressure changed the weight or direction of the answer.'), C('It changed.', 'One check moved the answer.'), { axes: axes({ wisdom: 0.22, knowledge: 0.08 }), loads: loads({ uncertainty: 0.1, countercase: 0.14 }), gates: gates({ self_correction: 0.34, contradiction_handling: 0.22, non_sealing: 0.16 }), quality: quality({ high_signal: 0.8 }), pressureResponse: 'integrate' }),
      A('weakened_claim', C('The answer should be weaker.', 'The honest result is less certainty, not a new opposite.'), C('Make it weaker.', 'Less certainty is better.'), { axes: axes({ wisdom: 0.22, knowledge: 0.06 }), loads: loads({ uncertainty: 0.2 }), gates: gates({ self_correction: 0.26, non_sealing: 0.18 }), quality: quality({ provisional: 1, uncertainty: 0.8 }), pressureResponse: 'integrate' }),
      A('pressure_did_not_matter', C('The pressure did not matter.', 'The original answer stands without much change.'), C('No change.', 'The checks did not matter much.'), { axes: axes({ practicality: 0.06, knowledge: 0.06 }), loads: loads({ countercase: 0.04 }), gates: gates({ non_sealing: -0.1, counter_consideration: -0.08 }), quality: quality({ narrow_sample: 0.5, possible_dodge: 0.5 }), pressureResponse: 'dismiss' })
    ]
  }
];
