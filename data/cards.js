export const AXIS_CONVENTION = {
  x: {
    positive: 'empathy',
    negative: 'practicality',
    note: '+x follows the uploaded visualizer: empathy is positive, practicality is negative.'
  },
  y: {
    positive: 'positive epistemic stability',
    negative: 'negative epistemic stability',
    note: '+y means coherent, reality-contacting, self-corrective, and non-sealed.'
  },
  z: {
    positive: 'wisdom',
    negative: 'knowledge',
    note: '+z follows the uploaded visualizer: wisdom is positive, knowledge is negative.'
  },
  surface: '|x| + |y| + |z| = 1'
};

export const GATES = {
  G1_counter_consideration: 'counter-consideration',
  G2_non_strawman: 'non-strawman',
  G3_self_correction: 'self-correction',
  G4_contradiction_handling: 'contradiction handling',
  G5_reality_contact: 'reality contact',
  G6_non_self_sealing: 'non-self-sealing'
};

export const GATE_WEIGHTS = {
  G1_counter_consideration: 0.8,
  G2_non_strawman: 1.0,
  G3_self_correction: 1.1,
  G4_contradiction_handling: 1.2,
  G5_reality_contact: 1.25,
  G6_non_self_sealing: 1.1
};

export const MODES = {
  fast: {
    id: 'fast',
    name: 'Fast mode',
    description: 'Short lunch-break pass. Uses balanced cards and a few adaptive checks.',
    readingLevel: 'normal',
    maxBaseCards: 9,
    maxFollowUps: 2
  },
  adhd: {
    id: 'adhd',
    name: 'ADHD mode',
    description: 'Same math as Fast mode, but the wording is shorter and plainer.',
    readingLevel: 'simple',
    maxBaseCards: 9,
    maxFollowUps: 2
  },
  serious: {
    id: 'serious',
    name: 'Serious mode',
    description: 'Longer pass. More pressure checks, stronger signal quality, still deterministic.',
    readingLevel: 'normal',
    maxBaseCards: 14,
    maxFollowUps: 4
  }
};

export const SCOPES = [
  {
    id: 'claim',
    name: 'Claim or belief',
    simpleName: 'Something I think',
    description: 'A view, opinion, take, or conclusion.'
  },
  {
    id: 'decision',
    name: 'Decision',
    simpleName: 'A choice',
    description: 'Something someone should do or not do.'
  },
  {
    id: 'reaction',
    name: 'Reaction',
    simpleName: 'A reaction',
    description: 'A response, feeling, argument, or impulse after pressure.'
  },
  {
    id: 'argument',
    name: 'Argument',
    simpleName: 'An argument',
    description: 'A case someone is making, whether yours or someone else’s.'
  },
  {
    id: 'character',
    name: 'Character or person',
    simpleName: 'A person/character',
    description: 'A visible pattern in a person, public figure, or fictional character.'
  },
  {
    id: 'comparison',
    name: 'Comparison',
    simpleName: 'Two sides',
    description: 'Two people, characters, views, strategies, or sides.'
  }
];

const C = (main, sub) => ({ main, sub });
const fx = (effects = {}) => effects;

export const BASE_CARDS = [
  {
    id: 'scope_distance_01',
    normal: {
      kicker: 'Referent check',
      title: 'What are you trying to plot?',
      help: 'Pick the closest target. This keeps the result from pretending to judge more than your scope supports.'
    },
    simple: {
      kicker: 'What is this about?',
      title: 'What are we scoring?',
      help: 'Pick the closest one. This keeps the result fair.'
    },
    answers: [
      {
        id: 'visible_output',
        normal: C('The visible output.', 'Words, actions, choices, or argument structure. I am not claiming to read the inner soul.'),
        simple: C('What can be seen.', 'I am judging words or actions, not someone’s hidden mind.'),
        effects: fx({
          wisdom: 0.35,
          knowledge: 0.25,
          gates: { G5_reality_contact: 0.75, G6_non_self_sealing: 0.35 },
          quality: { high_signal: 1 },
          coverage: { wisdom: 1, knowledge: 1 }
        })
      },
      {
        id: 'single_moment',
        normal: C('One moment or one example.', 'This can still be useful, but the result should stay narrow.'),
        simple: C('One example.', 'Useful, but small sample.'),
        effects: fx({
          knowledge: 0.3,
          gates: { G5_reality_contact: 0.45 },
          quality: { narrow_sample: 1, provisional_sample: 1 },
          coverage: { knowledge: 1 }
        })
      },
      {
        id: 'repeated_pattern',
        normal: C('A repeated pattern.', 'Several moments point in the same direction, not just one dramatic case.'),
        simple: C('A pattern.', 'More than one example points the same way.'),
        effects: fx({
          practicality: 0.25,
          wisdom: 0.35,
          knowledge: 0.25,
          gates: { G5_reality_contact: 0.65, G4_contradiction_handling: 0.35 },
          quality: { high_signal: 1 },
          coverage: { practicality: 1, wisdom: 1, knowledge: 1 }
        }),
        followUps: ['pattern_strength_followup']
      },
      {
        id: 'taste_or_play',
        normal: C('A taste read or thought experiment.', 'I am mostly exploring, comparing, or playing with the idea.'),
        simple: C('Just playing with it.', 'This is more “what if?” than serious judgement.'),
        effects: fx({
          empathy: 0.1,
          wisdom: 0.1,
          quality: { sandbox_sample: 2, playful_sample: 1, low_signal: 1 },
          coverage: { empathy: 0.25, wisdom: 0.25 }
        }),
        followUps: ['signal_intent_followup']
      }
    ]
  },
  {
    id: 'primary_lens_01',
    normal: {
      kicker: 'Main lens',
      title: 'Which lens gives the cleanest first read?',
      help: 'All four are legitimate. The card is not asking which one is morally better.'
    },
    simple: {
      kicker: 'Main lens',
      title: 'What should we look at first?',
      help: 'All choices can make sense. Pick the first lens.'
    },
    answers: [
      {
        id: 'person_impact',
        normal: C('Person-impact lens.', 'Start with harm, pressure, trust, dignity, or what the choice does to people.'),
        simple: C('People first.', 'Start with who gets helped or hurt.'),
        effects: fx({ empathy: 1.0, wisdom: 0.15, gates: { G5_reality_contact: 0.2 }, coverage: { empathy: 1, wisdom: 0.35 } })
      },
      {
        id: 'constraint_lens',
        normal: C('Constraint lens.', 'Start with incentives, enforcement, cost, limits, and what can actually work.'),
        simple: C('What works first.', 'Start with limits, cost, and what can actually be done.'),
        effects: fx({ practicality: 1.0, knowledge: 0.15, gates: { G5_reality_contact: 0.2 }, coverage: { practicality: 1, knowledge: 0.35 } })
      },
      {
        id: 'evidence_lens',
        normal: C('Evidence lens.', 'Start with facts, sequence, proof, definitions, and what is actually known.'),
        simple: C('Facts first.', 'Start with what we know and can prove.'),
        effects: fx({ knowledge: 1.0, practicality: 0.15, gates: { G5_reality_contact: 0.3 }, coverage: { knowledge: 1, practicality: 0.35 } })
      },
      {
        id: 'context_lens',
        normal: C('Context lens.', 'Start with proportion, situation, incentives, limits, and second-order effects.'),
        simple: C('Big picture first.', 'Start with context and what might happen next.'),
        effects: fx({ wisdom: 1.0, empathy: 0.15, gates: { G4_contradiction_handling: 0.25 }, coverage: { wisdom: 1, empathy: 0.35 } })
      }
    ]
  },
  {
    id: 'protect_first_01',
    normal: {
      kicker: 'Value under pressure',
      title: 'When good values clash, what do you protect first?',
      help: 'This measures orientation, not virtue. A mature judgement may still emphasize one side because the situation demands it.'
    },
    simple: {
      kicker: 'Hard choice',
      title: 'When two good things clash, what comes first?',
      help: 'This is about focus, not “good person vs bad person.”'
    },
    answers: [
      {
        id: 'protect_people',
        normal: C('Protect people from avoidable damage.', 'Especially when systems treat people like disposable parts.'),
        simple: C('Protect people.', 'Do not let the system crush people.'),
        effects: fx({ empathy: 1.0, wisdom: 0.2, coverage: { empathy: 1, wisdom: 0.5 } })
      },
      {
        id: 'protect_function',
        normal: C('Protect the working structure.', 'Especially when compassion-talk would break incentives, rules, or capacity.'),
        simple: C('Protect what works.', 'Do not break the machine that everyone relies on.'),
        effects: fx({ practicality: 1.0, knowledge: 0.2, coverage: { practicality: 1, knowledge: 0.5 } })
      },
      {
        id: 'protect_truth_standard',
        normal: C('Protect the truth standard.', 'Especially when pressure pushes people to skip evidence or redefine terms.'),
        simple: C('Protect truth.', 'Do not bend facts just to win.'),
        effects: fx({ knowledge: 1.0, wisdom: 0.2, gates: { G5_reality_contact: 0.35 }, coverage: { knowledge: 1, wisdom: 0.5 } })
      },
      {
        id: 'protect_proportion',
        normal: C('Protect proportion.', 'Especially when one loud fact or feeling is about to distort the whole picture.'),
        simple: C('Protect the bigger picture.', 'Do not let one loud thing take over everything.'),
        effects: fx({ wisdom: 1.0, practicality: 0.2, gates: { G4_contradiction_handling: 0.25 }, coverage: { wisdom: 1, practicality: 0.5 } })
      }
    ]
  },
  {
    id: 'challenge_response_01',
    normal: {
      kicker: 'Challenge behavior',
      title: 'A serious challenge hits your view. What is the first clean move?',
      help: 'These can all be valid in the right context. The follow-up separates discipline from reflex.'
    },
    simple: {
      kicker: 'Pushback',
      title: 'Someone challenges the view. What first?',
      help: 'Pick what you would actually do first.'
    },
    answers: [
      {
        id: 'steelman_first',
        normal: C('State the strongest version of the challenge.', 'Make sure you are answering the real objection, not a weaker copy.'),
        simple: C('Make their point strong first.', 'Do not answer a fake weak version.'),
        effects: fx({ wisdom: 0.45, gates: { G1_counter_consideration: 1.0, G2_non_strawman: 1.0 }, coverage: { wisdom: 1 } })
      },
      {
        id: 'evidence_standard_first',
        normal: C('Ask for the evidence standard.', 'What would count as proof, disproof, or a real exception?'),
        simple: C('Ask what would prove it.', 'Set the evidence rule first.'),
        effects: fx({ knowledge: 0.45, gates: { G5_reality_contact: 1.0, G6_non_self_sealing: 0.45 }, coverage: { knowledge: 1 } })
      },
      {
        id: 'core_vs_edge_first',
        normal: C('Separate core claim from edge case.', 'A challenge may weaken a detail without destroying the whole structure.'),
        simple: C('Separate big point from small point.', 'Maybe only one part changes.'),
        effects: fx({ wisdom: 0.5, practicality: 0.25, gates: { G4_contradiction_handling: 1.0, G3_self_correction: 0.5 }, coverage: { wisdom: 1, practicality: 0.5 } })
      },
      {
        id: 'filter_low_quality',
        normal: C('Filter the challenge first.', 'Not every objection deserves equal time. Bad-faith noise can waste attention.'),
        simple: C('Check if it is even worth answering.', 'Some pushback is just noise.'),
        effects: fx({ practicality: 0.5, wisdom: 0.25, gates: { G4_contradiction_handling: 0.15 }, quality: { needs_disambiguation: 1 }, coverage: { practicality: 1, wisdom: 0.5 } }),
        followUps: ['challenge_filter_followup']
      }
    ]
  },
  {
    id: 'evidence_bad_01',
    normal: {
      kicker: 'Bad evidence',
      title: 'Evidence appears that hurts your preferred read. What happens next?',
      help: 'A strong system can revise parts without instantly flipping or instantly sealing itself.'
    },
    simple: {
      kicker: 'Bad evidence',
      title: 'New facts make your side look weaker. What next?',
      help: 'Do you update, check, split, or hold?'
    },
    answers: [
      {
        id: 'revise_conclusion',
        normal: C('Revise the conclusion.', 'If the evidence is clean and relevant, the view should move.'),
        simple: C('Change the answer.', 'If the facts are good, move.'),
        effects: fx({ knowledge: 0.35, wisdom: 0.25, gates: { G3_self_correction: 1.1, G5_reality_contact: 0.75, G6_non_self_sealing: 0.55 }, coverage: { knowledge: 1, wisdom: 0.75 } })
      },
      {
        id: 'revise_part',
        normal: C('Revise only the affected part.', 'A good objection may force a narrower claim, not a total surrender.'),
        simple: C('Change only the part that broke.', 'Do not throw away the whole thing too fast.'),
        effects: fx({ wisdom: 0.6, knowledge: 0.25, gates: { G4_contradiction_handling: 1.0, G3_self_correction: 0.65 }, coverage: { wisdom: 1, knowledge: 0.75 } })
      },
      {
        id: 'audit_evidence',
        normal: C('Audit the evidence before moving.', 'Check source, context, definitions, and whether it actually touches the claim.'),
        simple: C('Check the evidence first.', 'Make sure the fact really proves what people say.'),
        effects: fx({ knowledge: 0.65, practicality: 0.25, gates: { G5_reality_contact: 0.85, G4_contradiction_handling: 0.45 }, coverage: { knowledge: 1, practicality: 0.5 } })
      },
      {
        id: 'hold_pattern',
        normal: C('Hold the larger pattern for now.', 'One bad-looking point may not outweigh a bigger structure.'),
        simple: C('Hold the bigger pattern.', 'One bad point may not beat many other points.'),
        effects: fx({ wisdom: 0.35, practicality: 0.15, gates: { G6_non_self_sealing: -0.15 }, quality: { needs_disambiguation: 1 }, coverage: { wisdom: 0.75, practicality: 0.35 } }),
        followUps: ['pattern_strength_followup']
      }
    ]
  },
  {
    id: 'opposing_side_01',
    normal: {
      kicker: 'Opposition model',
      title: 'How do you model the other side at its strongest?',
      help: 'This is where a lot of false objectivity breaks. The answer should separate motive, method, and evidence.'
    },
    simple: {
      kicker: 'Other side',
      title: 'How do you see the other side at its best?',
      help: 'Do not pick what sounds nice. Pick what fits.'
    },
    answers: [
      {
        id: 'valid_concern_bad_solution',
        normal: C('Valid concern, weak solution.', 'They are tracking something real, but their answer may fail.'),
        simple: C('Good concern, bad fix.', 'They see something real, but their answer may not work.'),
        effects: fx({ empathy: 0.35, practicality: 0.45, wisdom: 0.35, gates: { G2_non_strawman: 0.9, G4_contradiction_handling: 0.65 }, coverage: { empathy: 0.75, practicality: 0.75, wisdom: 0.75 } })
      },
      {
        id: 'good_data_bad_frame',
        normal: C('Good data, weak frame.', 'They may have real facts but poor context or proportion.'),
        simple: C('Good facts, weak frame.', 'They may know facts but miss context.'),
        effects: fx({ knowledge: 0.45, wisdom: 0.45, gates: { G2_non_strawman: 0.75, G4_contradiction_handling: 0.55 }, coverage: { knowledge: 0.75, wisdom: 0.75 } })
      },
      {
        id: 'good_frame_bad_data',
        normal: C('Good frame, weak data.', 'They may understand the pattern but lack enough proof.'),
        simple: C('Good idea, weak facts.', 'They may see the shape but need better proof.'),
        effects: fx({ wisdom: 0.55, knowledge: 0.35, gates: { G2_non_strawman: 0.75, G5_reality_contact: 0.35 }, coverage: { wisdom: 0.75, knowledge: 0.75 } })
      },
      {
        id: 'mainly_bad_frame',
        normal: C('Mainly a bad frame.', 'Their strongest version still seems to dodge the central reality.'),
        simple: C('Mostly wrong frame.', 'Even their best version misses the main thing.'),
        effects: fx({ practicality: 0.25, knowledge: 0.25, gates: { G1_counter_consideration: -0.25, G2_non_strawman: -0.15 }, quality: { needs_disambiguation: 1 }, coverage: { practicality: 0.5, knowledge: 0.5 } }),
        followUps: ['opposition_dismissal_followup']
      }
    ]
  },
  {
    id: 'failure_watch_01',
    normal: {
      kicker: 'Failure mode',
      title: 'Which failure would most distort this scope?',
      help: 'This card checks which missing dimension you are watching for.'
    },
    simple: {
      kicker: 'Failure check',
      title: 'What mistake would mess this up most?',
      help: 'Pick the danger you are watching for.'
    },
    answers: [
      {
        id: 'harm_blindness',
        normal: C('Harm-blindness.', 'A clever or efficient answer that stops seeing the people inside the system.'),
        simple: C('Forgetting people.', 'The answer works but hurts people badly.'),
        effects: fx({ empathy: 0.75, wisdom: 0.2, gates: { G4_contradiction_handling: 0.25 }, coverage: { empathy: 1, wisdom: 0.5 } })
      },
      {
        id: 'constraint_blindness',
        normal: C('Constraint-blindness.', 'A caring or ideal answer that fails when rules, cost, scale, or enforcement arrive.'),
        simple: C('Forgetting limits.', 'The answer sounds nice but cannot work.'),
        effects: fx({ practicality: 0.75, knowledge: 0.2, gates: { G5_reality_contact: 0.25 }, coverage: { practicality: 1, knowledge: 0.5 } })
      },
      {
        id: 'context_blindness',
        normal: C('Context-blindness.', 'A narrow answer that misses proportion, timing, incentives, or second-order effects.'),
        simple: C('Forgetting context.', 'The answer misses the bigger situation.'),
        effects: fx({ wisdom: 0.75, practicality: 0.2, gates: { G4_contradiction_handling: 0.25 }, coverage: { wisdom: 1, practicality: 0.5 } })
      },
      {
        id: 'fact_blindness',
        normal: C('Fact-blindness.', 'A confident answer that outruns the actual evidence.'),
        simple: C('Forgetting facts.', 'The answer is confident but not proven.'),
        effects: fx({ knowledge: 0.75, wisdom: 0.2, gates: { G5_reality_contact: 0.35 }, coverage: { knowledge: 1, wisdom: 0.5 } })
      }
    ]
  },
  {
    id: 'character_judgement_01',
    scopeIds: ['character', 'comparison'],
    normal: {
      kicker: 'Character/person distance',
      title: 'When judging someone interesting, what carries the judgement?',
      help: 'A character can be fascinating while the structure of their judgement is still objectively weaker.'
    },
    simple: {
      kicker: 'Person/character check',
      title: 'What are you judging?',
      help: 'A cool character can still have weaker judgement.'
    },
    answers: [
      {
        id: 'method_under_pressure',
        normal: C('Method under pressure.', 'How they reason when the situation stops rewarding performance.'),
        simple: C('How they think under pressure.', 'What they do when things get hard.'),
        effects: fx({ wisdom: 0.5, knowledge: 0.25, gates: { G4_contradiction_handling: 0.75, G5_reality_contact: 0.45 }, quality: { high_signal: 1 }, coverage: { wisdom: 1, knowledge: 0.5 } })
      },
      {
        id: 'cost_of_method',
        normal: C('Cost of method.', 'What their method produces, who pays for it, and whether the result survives scrutiny.'),
        simple: C('What their method costs.', 'Who pays, and does it really work?'),
        effects: fx({ empathy: 0.45, practicality: 0.45, wisdom: 0.25, gates: { G5_reality_contact: 0.65 }, coverage: { empathy: 0.75, practicality: 0.75, wisdom: 0.5 } })
      },
      {
        id: 'rule_consistency',
        normal: C('Rule consistency.', 'Whether their standards stay stable when the same rule hurts their side.'),
        simple: C('Same rule both ways.', 'Do they keep the rule when it hurts them?'),
        effects: fx({ knowledge: 0.4, wisdom: 0.35, gates: { G4_contradiction_handling: 0.75, G6_non_self_sealing: 0.5 }, coverage: { knowledge: 0.75, wisdom: 0.75 } })
      },
      {
        id: 'aesthetic_pull',
        normal: C('Aesthetic pull.', 'They are compelling, intense, brilliant, funny, or satisfying to watch.'),
        simple: C('They are just cool.', 'They feel fun, smart, intense, or satisfying.'),
        effects: fx({ empathy: 0.15, wisdom: 0.05, quality: { taste_sample: 2, low_signal: 1, scope_confusion: 1 }, coverage: { empathy: 0.25 } }),
        followUps: ['fan_distance_followup']
      }
    ]
  },
  {
    id: 'comparison_ground_01',
    scopeIds: ['comparison'],
    normal: {
      kicker: 'Comparison ground',
      title: 'For the comparison, what makes one side objectively stronger?',
      help: 'The point is not which side is more likable. It is what standard survives pressure.'
    },
    simple: {
      kicker: 'Two-side check',
      title: 'What makes one side stronger?',
      help: 'Not who is cooler. What standard survives?'
    },
    answers: [
      {
        id: 'better_reality_tracking',
        normal: C('Better reality tracking.', 'One side predicts, explains, or accounts for the facts more cleanly.'),
        simple: C('Tracks reality better.', 'It explains the facts better.'),
        effects: fx({ knowledge: 0.55, wisdom: 0.3, gates: { G5_reality_contact: 0.95 }, coverage: { knowledge: 1, wisdom: 0.5 } })
      },
      {
        id: 'better_tradeoff_accounting',
        normal: C('Better tradeoff accounting.', 'One side counts costs, incentives, people, and second-order effects more completely.'),
        simple: C('Counts tradeoffs better.', 'It counts cost, people, limits, and consequences.'),
        effects: fx({ practicality: 0.4, empathy: 0.35, wisdom: 0.35, gates: { G4_contradiction_handling: 0.8 }, coverage: { practicality: 0.75, empathy: 0.75, wisdom: 0.75 } })
      },
      {
        id: 'better_revision_behavior',
        normal: C('Better revision behavior.', 'One side can update without pretending the old version was perfect.'),
        simple: C('Updates better.', 'It can change without pretending nothing changed.'),
        effects: fx({ wisdom: 0.45, knowledge: 0.25, gates: { G3_self_correction: 0.95, G6_non_self_sealing: 0.65 }, coverage: { wisdom: 0.75, knowledge: 0.5 } })
      },
      {
        id: 'better_personal_pull',
        normal: C('Better personal pull.', 'One side is more interesting, relatable, stylish, or emotionally satisfying.'),
        simple: C('Feels better to me.', 'It is more fun, cool, or satisfying.'),
        effects: fx({ empathy: 0.2, quality: { taste_sample: 2, low_signal: 1, scope_confusion: 1 }, coverage: { empathy: 0.25 } }),
        followUps: ['fan_distance_followup']
      }
    ]
  },
  {
    id: 'evidence_breadth_01',
    normal: {
      kicker: 'Evidence breadth',
      title: 'How broad is the support behind this plot?',
      help: 'This affects confidence and guards against overclaiming.'
    },
    simple: {
      kicker: 'Proof size',
      title: 'How much support do you have?',
      help: 'This changes how strong the result should be treated.'
    },
    answers: [
      {
        id: 'thin_support',
        normal: C('Thin but real support.', 'Enough for a rough plot, not enough for a strong claim.'),
        simple: C('A little support.', 'Good enough for rough, not strong.'),
        effects: fx({ knowledge: 0.15, gates: { G5_reality_contact: 0.2 }, quality: { provisional_sample: 1, incomplete_signal: 1 }, coverage: { knowledge: 0.25 } })
      },
      {
        id: 'medium_support',
        normal: C('Moderate support.', 'Several reasons or examples, but some gaps remain.'),
        simple: C('Some support.', 'Several reasons, still gaps.'),
        effects: fx({ knowledge: 0.3, wisdom: 0.2, gates: { G5_reality_contact: 0.45, G4_contradiction_handling: 0.25 }, quality: { high_signal: 1 }, coverage: { knowledge: 0.5, wisdom: 0.35 } })
      },
      {
        id: 'strong_support',
        normal: C('Strong support within this scope.', 'The evidence, tradeoffs, and obvious objections have been accounted for.'),
        simple: C('Strong for this scope.', 'Facts, tradeoffs, and objections are counted.'),
        effects: fx({ knowledge: 0.35, wisdom: 0.35, gates: { G1_counter_consideration: 0.45, G4_contradiction_handling: 0.45, G5_reality_contact: 0.65 }, quality: { high_signal: 2 }, coverage: { knowledge: 0.75, wisdom: 0.75 } })
      },
      {
        id: 'not_sure_support',
        normal: C('Not sure.', 'This is more of a first pass than a defended judgement.'),
        simple: C('Not sure.', 'This is a first try.'),
        effects: fx({ gates: { G3_self_correction: 0.25 }, quality: { uncertainty: 1, incomplete_signal: 1, provisional_sample: 1 } })
      }
    ]
  },
  {
    id: 'seriousness_01',
    normal: {
      kicker: 'Signal check',
      title: 'How should the final coordinate be treated?',
      help: 'This does not shame the sample. It tells the output whether to act like a serious plot or a sandbox plot.'
    },
    simple: {
      kicker: 'Signal check',
      title: 'How real is this answer?',
      help: 'This tells the app how seriously to treat it.'
    },
    answers: [
      {
        id: 'serious_current_read',
        normal: C('Serious current read.', 'I answered as honestly as I could for this scope.'),
        simple: C('Real answer.', 'I answered honestly.'),
        effects: fx({ gates: { G6_non_self_sealing: 0.25 }, quality: { high_signal: 2 } })
      },
      {
        id: 'rough_current_read',
        normal: C('Rough current read.', 'Useful, but I would not overclaim it.'),
        simple: C('Rough answer.', 'Useful, but not final.'),
        effects: fx({ gates: { G3_self_correction: 0.2 }, quality: { provisional_sample: 1, uncertainty: 1 } })
      },
      {
        id: 'testing_the_tool',
        normal: C('Tool test.', 'I was checking how the app behaves more than plotting a real scope.'),
        simple: C('Testing the app.', 'Not really scoring something.'),
        effects: fx({ quality: { sandbox_sample: 2, low_signal: 2 } })
      },
      {
        id: 'messy_or_mixed',
        normal: C('Messy or mixed.', 'Some answers were serious, some were vibes, speed, or curiosity.'),
        simple: C('Mixed answer.', 'Some real, some just vibes.'),
        effects: fx({ gates: { G3_self_correction: 0.1 }, quality: { noisy_sample: 1, provisional_sample: 1, low_signal: 1 } })
      }
    ]
  },
  {
    id: 'serious_integrated_tradeoff_01',
    seriousOnly: true,
    normal: {
      kicker: 'Integration check',
      title: 'What would make this plot stronger without changing its basic direction?',
      help: 'Serious mode asks whether the missing dimensions are actually being carried.'
    },
    simple: {
      kicker: 'Integration check',
      title: 'What would make the answer stronger?',
      help: 'This checks what is missing.'
    },
    answers: [
      {
        id: 'add_people_cost',
        normal: C('A cleaner accounting of human cost.', 'The method may work, but the person-impact needs sharper counting.'),
        simple: C('Count people better.', 'The answer needs clearer human cost.'),
        effects: fx({ empathy: 0.65, wisdom: 0.25, gates: { G4_contradiction_handling: 0.3 }, coverage: { empathy: 1, wisdom: 0.5 } })
      },
      {
        id: 'add_workability',
        normal: C('A cleaner accounting of workability.', 'The concern may be real, but the mechanism needs sharper counting.'),
        simple: C('Count workability better.', 'The answer needs clearer mechanism.'),
        effects: fx({ practicality: 0.65, knowledge: 0.25, gates: { G5_reality_contact: 0.3 }, coverage: { practicality: 1, knowledge: 0.5 } })
      },
      {
        id: 'add_context',
        normal: C('A cleaner accounting of context.', 'The facts may be real, but timing, proportion, and second effects need attention.'),
        simple: C('Count context better.', 'The answer needs bigger-picture control.'),
        effects: fx({ wisdom: 0.65, practicality: 0.25, gates: { G4_contradiction_handling: 0.35 }, coverage: { wisdom: 1, practicality: 0.5 } })
      },
      {
        id: 'add_facts',
        normal: C('A cleaner accounting of facts.', 'The pattern may be plausible, but evidence and definitions need tightening.'),
        simple: C('Count facts better.', 'The answer needs stronger proof.'),
        effects: fx({ knowledge: 0.65, wisdom: 0.25, gates: { G5_reality_contact: 0.35 }, coverage: { knowledge: 1, wisdom: 0.5 } })
      }
    ]
  },
  {
    id: 'serious_repair_01',
    seriousOnly: true,
    normal: {
      kicker: 'Repair check',
      title: 'If your plot turns out wrong, what is the clean repair path?',
      help: 'This checks whether the position can repair itself instead of merely defending itself.'
    },
    simple: {
      kicker: 'Repair check',
      title: 'If wrong, how does it get fixed?',
      help: 'This checks if the answer can repair itself.'
    },
    answers: [
      {
        id: 'change_rule',
        normal: C('Change the rule.', 'The standard itself would need revision.'),
        simple: C('Change the rule.', 'The standard needs fixing.'),
        effects: fx({ wisdom: 0.35, gates: { G3_self_correction: 0.75, G6_non_self_sealing: 0.45 }, coverage: { wisdom: 0.5 } })
      },
      {
        id: 'change_data',
        normal: C('Change the data model.', 'The evidence base or definitions would need revision.'),
        simple: C('Change the facts model.', 'The proof or definitions need fixing.'),
        effects: fx({ knowledge: 0.45, gates: { G3_self_correction: 0.55, G5_reality_contact: 0.55 }, coverage: { knowledge: 0.75 } })
      },
      {
        id: 'change_application',
        normal: C('Change the application.', 'The principle may stand, but this case was applied badly.'),
        simple: C('Change how it is used.', 'The idea may stand, but the case was wrong.'),
        effects: fx({ practicality: 0.35, wisdom: 0.35, gates: { G4_contradiction_handling: 0.6, G3_self_correction: 0.45 }, coverage: { practicality: 0.5, wisdom: 0.5 } })
      },
      {
        id: 'not_repairable',
        normal: C('It probably would not need repair.', 'The core is strong enough that apparent failures are mostly misreads.'),
        simple: C('It probably does not need fixing.', 'Problems are likely misreads.'),
        effects: fx({ practicality: 0.2, gates: { G3_self_correction: -0.55, G6_non_self_sealing: -0.65 }, quality: { sealed_signal: 1 }, coverage: { practicality: 0.25 } }),
        followUps: ['repair_closure_followup']
      }
    ]
  }
];

export const FOLLOW_UP_CARDS = [
  {
    id: 'challenge_filter_followup',
    normal: {
      kicker: 'Filter follow-up',
      title: 'What makes the challenge low-quality?',
      help: 'Filtering is valid. The reason decides whether it is disciplined or sealed.'
    },
    simple: {
      kicker: 'Noise check',
      title: 'Why is the pushback low-quality?',
      help: 'Filtering can be smart. The reason matters.'
    },
    answers: [
      {
        id: 'misses_claim',
        normal: C('It misses the actual claim.', 'It attacks a version I am not defending.'),
        simple: C('It attacks the wrong point.', 'Not my real claim.'),
        effects: fx({ wisdom: 0.25, gates: { G2_non_strawman: 0.65, G4_contradiction_handling: 0.35 }, quality: { high_signal: 1 }, coverage: { wisdom: 0.5 } })
      },
      {
        id: 'no_evidence_standard',
        normal: C('It gives no usable evidence standard.', 'There is no clear way to test what would change the claim.'),
        simple: C('No proof rule.', 'There is no clear test.'),
        effects: fx({ knowledge: 0.25, gates: { G5_reality_contact: 0.55, G6_non_self_sealing: 0.25 }, coverage: { knowledge: 0.5 } })
      },
      {
        id: 'wrong_team',
        normal: C('It comes from the wrong camp.', 'Their side usually frames this issue badly.'),
        simple: C('Wrong side said it.', 'Their side usually gets this wrong.'),
        effects: fx({ gates: { G1_counter_consideration: -0.65, G2_non_strawman: -0.5, G6_non_self_sealing: -0.75 }, quality: { sealed_signal: 1, self_protective_signal: 1 } })
      },
      {
        id: 'not_worth_attention',
        normal: C('It may not be worth attention right now.', 'Possible issue, but the scope is too small or noisy for this pass.'),
        simple: C('Maybe later.', 'It might matter, but not in this quick pass.'),
        effects: fx({ practicality: 0.15, gates: { G3_self_correction: 0.1 }, quality: { provisional_sample: 1, incomplete_signal: 1 } })
      }
    ]
  },
  {
    id: 'pattern_strength_followup',
    normal: {
      kicker: 'Pattern follow-up',
      title: 'What makes the pattern strong enough to carry weight?',
      help: 'This separates real pattern recognition from vague certainty.'
    },
    simple: {
      kicker: 'Pattern check',
      title: 'Why does the pattern count?',
      help: 'Pattern can be real. Show what holds it up.'
    },
    answers: [
      {
        id: 'repeated_examples',
        normal: C('Repeated concrete examples.', 'Different cases point to the same structure.'),
        simple: C('Many clear examples.', 'Different cases point the same way.'),
        effects: fx({ knowledge: 0.35, gates: { G5_reality_contact: 0.85 }, quality: { high_signal: 1 }, coverage: { knowledge: 0.75 } })
      },
      {
        id: 'mechanism',
        normal: C('A mechanism explains it.', 'The incentives, constraints, or causal structure make the pattern likely.'),
        simple: C('There is a mechanism.', 'Incentives or causes explain it.'),
        effects: fx({ practicality: 0.3, wisdom: 0.25, gates: { G4_contradiction_handling: 0.55, G5_reality_contact: 0.45 }, coverage: { practicality: 0.5, wisdom: 0.5 } })
      },
      {
        id: 'trusted_cluster',
        normal: C('Trusted people converge on it.', 'Several serious observers see the same thing.'),
        simple: C('Trusted people agree.', 'Serious people see the same thing.'),
        effects: fx({ knowledge: 0.15, wisdom: 0.15, gates: { G5_reality_contact: 0.1 }, quality: { incomplete_signal: 1 }, coverage: { knowledge: 0.25, wisdom: 0.25 } })
      },
      {
        id: 'obvious_once_seen',
        normal: C('It is obvious once you see it.', 'The pattern feels too clear to keep reopening.'),
        simple: C('It is just obvious.', 'Once you see it, you see it.'),
        effects: fx({ wisdom: 0.1, gates: { G1_counter_consideration: -0.45, G5_reality_contact: -0.35, G6_non_self_sealing: -0.55 }, quality: { sealed_signal: 1, low_signal: 1 } })
      }
    ]
  },
  {
    id: 'opposition_dismissal_followup',
    normal: {
      kicker: 'Dismissal follow-up',
      title: 'Why is the other side’s best frame still weak?',
      help: 'A negative judgement can be objective, but it needs a stable basis.'
    },
    simple: {
      kicker: 'Why weak?',
      title: 'Why is their best version still weak?',
      help: 'A side can be wrong. The reason matters.'
    },
    answers: [
      {
        id: 'fails_prediction',
        normal: C('It fails prediction or real-world contact.', 'Its own expectations do not survive the evidence.'),
        simple: C('It fails reality.', 'It predicts badly or ignores facts.'),
        effects: fx({ knowledge: 0.4, gates: { G5_reality_contact: 0.85, G2_non_strawman: 0.35 }, coverage: { knowledge: 0.75 } })
      },
      {
        id: 'fails_tradeoffs',
        normal: C('It fails tradeoff accounting.', 'It counts one value while hiding cost somewhere else.'),
        simple: C('It hides costs.', 'It counts one good thing but ignores the cost.'),
        effects: fx({ practicality: 0.35, wisdom: 0.3, gates: { G4_contradiction_handling: 0.65, G2_non_strawman: 0.35 }, coverage: { practicality: 0.5, wisdom: 0.5 } })
      },
      {
        id: 'fails_same_rule',
        normal: C('It fails the same-rule test.', 'The standard changes when the target changes.'),
        simple: C('It changes rules.', 'Same rule is not used both ways.'),
        effects: fx({ knowledge: 0.25, wisdom: 0.35, gates: { G4_contradiction_handling: 0.75, G6_non_self_sealing: 0.35 }, coverage: { knowledge: 0.5, wisdom: 0.75 } })
      },
      {
        id: 'corrupt_or_stupid',
        normal: C('Because the frame is obviously corrupt or stupid.', 'The weakness is mostly explained by the people holding it.'),
        simple: C('Because they are stupid or corrupt.', 'The people are the explanation.'),
        effects: fx({ gates: { G1_counter_consideration: -0.65, G2_non_strawman: -0.75, G6_non_self_sealing: -0.55 }, quality: { self_protective_signal: 1, sealed_signal: 1 } })
      }
    ]
  },
  {
    id: 'fan_distance_followup',
    normal: {
      kicker: 'Taste follow-up',
      title: 'Can you separate appeal from judgement?',
      help: 'This is the Death Note problem: Light and L can both be interesting, but the plot should judge structure, not fan pull.'
    },
    simple: {
      kicker: 'Coolness check',
      title: 'Can you separate cool from correct?',
      help: 'Someone can be cool and still reason worse.'
    },
    answers: [
      {
        id: 'separate_method_from_appeal',
        normal: C('Yes. I can like the figure and still judge the method.', 'Appeal does not decide the coordinate.'),
        simple: C('Yes.', 'I can like them and still judge the method.'),
        effects: fx({ wisdom: 0.35, gates: { G6_non_self_sealing: 0.6, G4_contradiction_handling: 0.35 }, quality: { high_signal: 1 }, coverage: { wisdom: 0.5 } })
      },
      {
        id: 'mostly_taste',
        normal: C('Not really. This pass is mostly taste.', 'The coordinate should be treated as weak signal.'),
        simple: C('Mostly taste.', 'The result should be weak.'),
        effects: fx({ quality: { taste_sample: 2, low_signal: 2, sandbox_sample: 1 } })
      },
      {
        id: 'result_proves_method',
        normal: C('Their result mostly proves the method.', 'If they keep winning, the method deserves weight.'),
        simple: C('Winning proves a lot.', 'If they keep winning, the method counts.'),
        effects: fx({ practicality: 0.35, knowledge: 0.15, gates: { G5_reality_contact: 0.15, G4_contradiction_handling: -0.15 }, quality: { needs_disambiguation: 1 }, coverage: { practicality: 0.5, knowledge: 0.25 } })
      },
      {
        id: 'rule_proves_method',
        normal: C('Their rule mostly proves the method.', 'The method is strong because its standard is principled.'),
        simple: C('The rule proves a lot.', 'Their standard matters most.'),
        effects: fx({ knowledge: 0.25, wisdom: 0.25, gates: { G4_contradiction_handling: 0.25 }, coverage: { knowledge: 0.5, wisdom: 0.5 } })
      }
    ]
  },
  {
    id: 'signal_intent_followup',
    normal: {
      kicker: 'Sandbox follow-up',
      title: 'What kind of sandbox pass is this?',
      help: 'The app can still output xyz, but the output should not pretend the signal is stronger than it is.'
    },
    simple: {
      kicker: 'Play check',
      title: 'What kind of play is this?',
      help: 'It can still output xyz, just with a warning.'
    },
    answers: [
      {
        id: 'exploring_real_possibility',
        normal: C('Exploring a real possibility.', 'Not final, but not nonsense either.'),
        simple: C('Real possibility.', 'Not final, but real enough.'),
        effects: fx({ wisdom: 0.15, gates: { G3_self_correction: 0.25 }, quality: { provisional_sample: 1 } })
      },
      {
        id: 'stress_testing_app',
        normal: C('Stress-testing the app.', 'The coordinate should be treated as diagnostic of the app, not the scope.'),
        simple: C('Testing the app.', 'This is about the app, not the topic.'),
        effects: fx({ quality: { sandbox_sample: 3, low_signal: 2 } })
      },
      {
        id: 'random_clicking',
        normal: C('Mostly random or unserious.', 'The coordinate should be marked weak.'),
        simple: C('Mostly random.', 'The result should be weak.'),
        effects: fx({ gates: { G5_reality_contact: -0.35 }, quality: { sandbox_sample: 3, playful_sample: 2, low_signal: 3, noisy_sample: 1 } })
      },
      {
        id: 'roleplay_sample',
        normal: C('Roleplay sample.', 'I am answering as a perspective, not necessarily my own judgement.'),
        simple: C('Roleplay.', 'I am answering as a viewpoint.'),
        effects: fx({ wisdom: 0.1, quality: { provisional_sample: 1, scope_confusion: 1 } })
      }
    ]
  },
  {
    id: 'repair_closure_followup',
    normal: {
      kicker: 'Closure follow-up',
      title: 'What would reopen the view anyway?',
      help: 'A view can be firm. This asks whether it is also answerable to reality.'
    },
    simple: {
      kicker: 'Reopen check',
      title: 'What would make you reopen it?',
      help: 'Firm is fine. Sealed is different.'
    },
    answers: [
      {
        id: 'clear_counterexample',
        normal: C('A clear counterexample that hits the core.', 'Not every complaint, but a real contradiction would matter.'),
        simple: C('A real counterexample.', 'If it hits the core, it matters.'),
        effects: fx({ knowledge: 0.25, gates: { G1_counter_consideration: 0.45, G3_self_correction: 0.45, G6_non_self_sealing: 0.45 }, coverage: { knowledge: 0.5 } })
      },
      {
        id: 'better_framework',
        normal: C('A better framework that explains more.', 'A stronger model could replace this one.'),
        simple: C('A better model.', 'If it explains more, it matters.'),
        effects: fx({ wisdom: 0.35, gates: { G3_self_correction: 0.45, G6_non_self_sealing: 0.35 }, coverage: { wisdom: 0.5 } })
      },
      {
        id: 'trusted_authority_only',
        normal: C('Only a trusted authority could reopen it.', 'The source matters more than the structure of the challenge.'),
        simple: C('Only a trusted person.', 'The person matters more than the argument.'),
        effects: fx({ knowledge: 0.1, gates: { G5_reality_contact: -0.25, G6_non_self_sealing: -0.35 }, quality: { incomplete_signal: 1 } })
      },
      {
        id: 'nothing_reopens',
        normal: C('Nothing realistic would reopen it.', 'At that point the view is acting sealed for this scope.'),
        simple: C('Nothing would reopen it.', 'Then it is sealed for this scope.'),
        effects: fx({ gates: { G1_counter_consideration: -0.65, G3_self_correction: -0.8, G6_non_self_sealing: -0.9 }, quality: { sealed_signal: 2, low_signal: 1 } })
      }
    ]
  }
];
