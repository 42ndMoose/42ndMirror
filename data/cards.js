export const AXIS_CONVENTION = Object.freeze({
  x: 'positive = Practicality, negative = Empathy',
  y: 'positive = stable reasoning, negative = unstable reasoning',
  z: 'positive = Wisdom, negative = Knowledge',
  surface: '|x| + |y| + |z| = 1'
});

export const MODES = Object.freeze({
  fast: {
    id: 'fast',
    name: 'Fast mode',
    description: 'A short reasoning-shape check. Light enough for a break, still serious enough to be useful.',
    maxBaseCards: 8,
    maxFollowUps: 3,
    readingLevel: 'normal'
  },
  adhd: {
    id: 'adhd',
    name: 'ADHD mode',
    description: 'Same engine as Fast mode, but the words are shorter and the choices are easier to hold in your head.',
    maxBaseCards: 8,
    maxFollowUps: 3,
    readingLevel: 'simple'
  },
  serious: {
    id: 'serious',
    name: 'Serious mode',
    description: 'More checks, more follow-ups, and better signal quality. Still not a long personality test.',
    maxBaseCards: 12,
    maxFollowUps: 5,
    readingLevel: 'normal'
  }
});

export const SCOPES = Object.freeze([
  {
    id: 'belief',
    name: 'A belief I hold',
    simpleName: 'Something I believe',
    description: 'A claim, opinion, or worldview fragment you want to check.'
  },
  {
    id: 'decision',
    name: 'A decision I am making',
    simpleName: 'A choice I need to make',
    description: 'A practical choice where tradeoffs matter.'
  },
  {
    id: 'reaction',
    name: 'A reaction I had',
    simpleName: 'How I reacted',
    description: 'A moment where your response may reveal your reasoning shape.'
  },
  {
    id: 'argument',
    name: 'Someone else’s argument',
    simpleName: 'What someone said',
    description: 'Your interpretation of visible reasoning, not their inner mind.'
  },
  {
    id: 'policy',
    name: 'A public claim or policy',
    simpleName: 'A rule or public idea',
    description: 'A claim about society, systems, governance, institutions, or consequences.'
  },
  {
    id: 'conflict',
    name: 'A conflict between people',
    simpleName: 'People disagreeing',
    description: 'A dispute where motives, facts, consequences, and fairness may collide.'
  }
]);

const gates = Object.freeze({
  counter_consideration: 'Counter-consideration',
  non_strawman: 'Non-strawman',
  self_correction: 'Self-correction',
  contradiction_handling: 'Contradiction handling',
  reality_contact: 'Reality contact',
  non_self_sealing: 'Non-self-sealing'
});

export const GATES = gates;

export const BASE_CARDS = Object.freeze([
  {
    id: 'tradeoff_ep_01',
    kind: 'base',
    normal: {
      kicker: 'Axis check',
      title: 'When judging this scope, which pressure matters more?',
      help: 'Pick the answer closest to your actual reasoning, not the answer that sounds nicest.'
    },
    simple: {
      kicker: 'Big choice',
      title: 'What matters more here?',
      help: 'Pick what your brain actually uses.'
    },
    answers: [
      {
        id: 'human_cost_first',
        normal: { main: 'Human impact first', sub: 'Fairness, harm, emotional cost, and how people are affected matter most here.' },
        simple: { main: 'People first', sub: 'How this affects people matters most.' },
        effects: { empathy: 3, gates: { reality_contact: 0.4 } }
      },
      {
        id: 'results_first',
        normal: { main: 'Results first', sub: 'What works, what can be enforced, and what produces results matter most here.' },
        simple: { main: 'Results first', sub: 'What works matters most.' },
        effects: { practicality: 3, gates: { reality_contact: 0.4 } }
      },
      {
        id: 'depends_on_costs',
        normal: { main: 'The answer depends on the cost tradeoff', sub: 'I need both human impact and workable consequences before leaning hard.' },
        simple: { main: 'I need both', sub: 'People matter, but results matter too.' },
        effects: { empathy: 1.5, practicality: 1.5, gates: { contradiction_handling: 0.7, reality_contact: 0.5 } }
      },
      {
        id: 'mood_pick_ep',
        normal: { main: 'I am mostly picking by mood right now', sub: 'I do not have a clear reason yet.' },
        simple: { main: 'I am guessing', sub: 'I do not really know yet.' },
        effects: { gates: { reality_contact: -0.8, self_correction: 0.2 }, quality: { uncertainty: 1 } },
        followUps: ['unclear_reason_followup']
      }
    ]
  },
  {
    id: 'tradeoff_wk_01',
    kind: 'base',
    normal: {
      kicker: 'Axis check',
      title: 'What are you relying on more?',
      help: 'This separates proof-heavy reasoning from context-heavy reasoning.'
    },
    simple: {
      kicker: 'Big choice',
      title: 'What are you using more?',
      help: 'Facts, or big-picture judgment?'
    },
    answers: [
      {
        id: 'evidence_accuracy',
        normal: { main: 'Facts and accuracy', sub: 'Evidence, proof, definitions, credentials, records, or technical correctness carry the load.' },
        simple: { main: 'Facts', sub: 'Proof, records, numbers, or exact details.' },
        effects: { knowledge: 3, gates: { reality_contact: 0.6 } }
      },
      {
        id: 'context_limits',
        normal: { main: 'Context and limits', sub: 'Patterns, long-term effects, missing variables, and the limits of raw facts carry the load.' },
        simple: { main: 'Big picture', sub: 'Patterns, context, and what facts can miss.' },
        effects: { wisdom: 3, gates: { contradiction_handling: 0.5 } }
      },
      {
        id: 'both_fact_context',
        normal: { main: 'Facts first, context second', sub: 'I need facts, but I also check whether the facts are being used in the right frame.' },
        simple: { main: 'Facts plus big picture', sub: 'I want proof, then I ask what it means.' },
        effects: { knowledge: 1.8, wisdom: 1.8, gates: { reality_contact: 0.5, contradiction_handling: 0.5 } }
      },
      {
        id: 'already_know_wk',
        normal: { main: 'I already know the shape of it', sub: 'The details are secondary because the pattern is obvious to me.' },
        simple: { main: 'I already know', sub: 'The details do not matter much.' },
        effects: { wisdom: 0.8, gates: { reality_contact: -0.8, counter_consideration: -0.6 } },
        followUps: ['pattern_confidence_followup']
      }
    ]
  },
  {
    id: 'objection_01',
    kind: 'base',
    normal: {
      kicker: 'Stability gate',
      title: 'What do you do with the strongest objection?',
      help: 'This checks whether the scope can survive pressure without becoming defensive.'
    },
    simple: {
      kicker: 'Pressure check',
      title: 'What if someone has a good point against you?',
      help: 'Pick what you would actually do.'
    },
    answers: [
      {
        id: 'name_strong_objection',
        normal: { main: 'I can name it clearly', sub: 'I can state the best objection and explain why it matters.' },
        simple: { main: 'I can name it', sub: 'I can say the best point against me.' },
        effects: { wisdom: 1.2, gates: { counter_consideration: 1.2, non_strawman: 0.5, contradiction_handling: 0.4 } }
      },
      {
        id: 'objection_misses_point',
        normal: { main: 'Most objections miss the point', sub: 'The common objections usually fail because they attack a weaker version of the claim.' },
        simple: { main: 'They miss the point', sub: 'Most people argue against the wrong thing.' },
        effects: { knowledge: 0.8, gates: { counter_consideration: -0.2, non_strawman: -0.4 } },
        followUps: ['objection_quality_followup']
      },
      {
        id: 'need_to_hear_objection',
        normal: { main: 'I need to hear one first', sub: 'I do not know the strongest objection yet, but I am open to testing it.' },
        simple: { main: 'I need to hear it first', sub: 'I do not know the best attack yet.' },
        effects: { gates: { counter_consideration: 0.3, self_correction: 0.4 }, quality: { incomplete_signal: 1 } }
      },
      {
        id: 'objections_are_bad_faith',
        normal: { main: 'The objections are usually bad-faith', sub: 'People mostly object because they do not want the conclusion to be true.' },
        simple: { main: 'People just do not like it', sub: 'They argue because they hate the answer.' },
        effects: { gates: { counter_consideration: -1, non_strawman: -0.8, non_self_sealing: -1 } },
        followUps: ['bad_faith_followup']
      }
    ]
  },
  {
    id: 'other_side_01',
    kind: 'base',
    normal: {
      kicker: 'Stability gate',
      title: 'Can you state the other side in a way they would accept?',
      help: 'This does not mean agreeing with them. It means you can model their view accurately.'
    },
    simple: {
      kicker: 'Fairness check',
      title: 'Can you explain their side fairly?',
      help: 'You do not have to agree. Just show you get it.'
    },
    answers: [
      {
        id: 'yes_fair_model',
        normal: { main: 'Yes, I can state it fairly', sub: 'I can explain their actual concern without turning it into a cartoon.' },
        simple: { main: 'Yes', sub: 'I can say their real point.' },
        effects: { wisdom: 1.1, empathy: 0.7, gates: { non_strawman: 1.3, counter_consideration: 0.6 } }
      },
      {
        id: 'somewhat_fair_model',
        normal: { main: 'Somewhat', sub: 'I can state part of it, but I may still be missing why they believe it.' },
        simple: { main: 'Kind of', sub: 'I get some of it.' },
        effects: { empathy: 0.4, wisdom: 0.4, gates: { non_strawman: 0.3, self_correction: 0.3 }, quality: { incomplete_signal: 1 } }
      },
      {
        id: 'view_is_obvious_bad',
        normal: { main: 'Their view is basically just wrong', sub: 'There is not much to model because the error is obvious.' },
        simple: { main: 'They are just wrong', sub: 'There is not much else to say.' },
        effects: { knowledge: 0.9, gates: { non_strawman: -0.9, counter_consideration: -0.4 } },
        followUps: ['obvious_wrong_followup']
      },
      {
        id: 'not_enough_info_other',
        normal: { main: 'I do not have enough information', sub: 'I should not pretend I know their inner reason from the outside.' },
        simple: { main: 'I do not know yet', sub: 'I need more info.' },
        effects: { wisdom: 0.8, gates: { non_strawman: 0.7, reality_contact: 0.5, self_correction: 0.3 } }
      }
    ]
  },
  {
    id: 'change_mind_01',
    kind: 'base',
    normal: {
      kicker: 'Stability gate',
      title: 'What would change your mind?',
      help: 'A stable view can usually name what would weaken it.'
    },
    simple: {
      kicker: 'Change check',
      title: 'What could change your mind?',
      help: 'A strong brain can say what would count.'
    },
    answers: [
      {
        id: 'specific_evidence',
        normal: { main: 'Specific evidence or reasoning', sub: 'I can name the kind of fact, result, or argument that would make me revise.' },
        simple: { main: 'Real proof', sub: 'I know what would make me rethink.' },
        effects: { knowledge: 0.7, gates: { self_correction: 1.3, reality_contact: 0.8, non_self_sealing: 0.6 } }
      },
      {
        id: 'better_frame',
        normal: { main: 'A better frame', sub: 'I would revise if someone showed that I am using the wrong lens or missing a bigger variable.' },
        simple: { main: 'A better way to see it', sub: 'Maybe I am using the wrong lens.' },
        effects: { wisdom: 1.1, gates: { self_correction: 1, contradiction_handling: 0.7 } }
      },
      {
        id: 'hard_to_change',
        normal: { main: 'It would be hard to change', sub: 'I have seen enough that ordinary counterexamples probably would not move me.' },
        simple: { main: 'Hard to change', sub: 'I have seen enough already.' },
        effects: { gates: { self_correction: -0.4, non_self_sealing: -0.3 } },
        followUps: ['hard_to_change_followup']
      },
      {
        id: 'nothing_realistic',
        normal: { main: 'Nothing realistic', sub: 'At this point, disagreement mostly means the other side is missing something.' },
        simple: { main: 'Nothing really', sub: 'I think I already know.' },
        effects: { gates: { self_correction: -1.2, non_self_sealing: -1, counter_consideration: -0.6 } },
        followUps: ['nothing_changes_followup']
      }
    ]
  },
  {
    id: 'contradiction_01',
    kind: 'base',
    normal: {
      kicker: 'Stability gate',
      title: 'What if two parts of your view conflict?',
      help: 'This checks whether the reasoning keeps accounting clean under pressure.'
    },
    simple: {
      kicker: 'Mismatch check',
      title: 'What if your idea has two parts that do not fit?',
      help: 'What do you do with the mismatch?'
    },
    answers: [
      {
        id: 'resolve_conflict',
        normal: { main: 'I slow down and resolve it', sub: 'I do not want the conclusion to outrun the accounting.' },
        simple: { main: 'I stop and fix it', sub: 'The pieces need to fit.' },
        effects: { wisdom: 0.9, gates: { contradiction_handling: 1.3, self_correction: 0.5 } }
      },
      {
        id: 'keep_but_mark',
        normal: { main: 'I keep the view but mark the weak spot', sub: 'The main point may still stand, but I should track the unresolved part.' },
        simple: { main: 'I mark the weak part', sub: 'The idea may still work, but I should remember the problem.' },
        effects: { wisdom: 0.5, practicality: 0.4, gates: { contradiction_handling: 0.7, reality_contact: 0.3 } }
      },
      {
        id: 'main_conclusion_still',
        normal: { main: 'I keep the main conclusion', sub: 'The conflict might be messy, but the broader pattern still points the same way.' },
        simple: { main: 'I keep the big answer', sub: 'The small mismatch does not change much.' },
        effects: { practicality: 0.6, gates: { contradiction_handling: -0.4, reality_contact: -0.2 } },
        followUps: ['pattern_confidence_followup']
      },
      {
        id: 'ignore_conflict',
        normal: { main: 'I do not worry about it much', sub: 'Every view has rough edges, so I do not treat that as a big deal.' },
        simple: { main: 'I ignore it', sub: 'Every idea has messy parts.' },
        effects: { gates: { contradiction_handling: -1, self_correction: -0.5 }, quality: { shallow_signal: 1 } },
        followUps: ['ignore_conflict_followup']
      }
    ]
  },
  {
    id: 'reality_contact_01',
    kind: 'base',
    normal: {
      kicker: 'Stability gate',
      title: 'What is your view touching in the real world?',
      help: 'A view with no contact point becomes too easy to protect.'
    },
    simple: {
      kicker: 'Real-world check',
      title: 'What makes this real?',
      help: 'What is it based on?'
    },
    answers: [
      {
        id: 'concrete_evidence',
        normal: { main: 'Concrete evidence', sub: 'Examples, records, results, numbers, direct observation, or testable consequences.' },
        simple: { main: 'Real proof', sub: 'Examples, numbers, records, or things we can check.' },
        effects: { knowledge: 1, gates: { reality_contact: 1.3 } }
      },
      {
        id: 'lived_pattern',
        normal: { main: 'Repeated pattern', sub: 'I have seen a pattern often enough that it deserves weight, even if it is not fully measured.' },
        simple: { main: 'A pattern I keep seeing', sub: 'It happens a lot, even if I cannot prove every part.' },
        effects: { wisdom: 0.8, gates: { reality_contact: 0.6, counter_consideration: 0.2 } },
        followUps: ['pattern_evidence_followup']
      },
      {
        id: 'intuition_only',
        normal: { main: 'Mostly intuition', sub: 'It feels true, but I have not anchored it well yet.' },
        simple: { main: 'Mostly a feeling', sub: 'It feels true, but I have not checked much.' },
        effects: { gates: { reality_contact: -0.9, self_correction: 0.2 }, quality: { incomplete_signal: 1 } },
        followUps: ['intuition_followup']
      },
      {
        id: 'identity_loyalty',
        normal: { main: 'It fits my side or identity', sub: 'The view matches the people, values, or team I trust most.' },
        simple: { main: 'My side says this', sub: 'It fits the people I trust.' },
        effects: { empathy: 0.5, gates: { reality_contact: -1, non_self_sealing: -0.7 } },
        followUps: ['identity_anchor_followup']
      }
    ]
  },
  {
    id: 'disagreement_01',
    kind: 'base',
    normal: {
      kicker: 'Stability gate',
      title: 'What does disagreement usually mean here?',
      help: 'This checks whether the view protects itself by discrediting disagreement automatically.'
    },
    simple: {
      kicker: 'Disagree check',
      title: 'What if someone disagrees?',
      help: 'What does that mean?'
    },
    answers: [
      {
        id: 'may_have_point',
        normal: { main: 'They may have a real point', sub: 'Even if I disagree, I should check whether they see something I missed.' },
        simple: { main: 'They might have a point', sub: 'Maybe they see something I missed.' },
        effects: { empathy: 0.6, wisdom: 0.8, gates: { non_self_sealing: 1.2, counter_consideration: 0.6 } }
      },
      {
        id: 'depends_who_and_why',
        normal: { main: 'It depends who they are and why', sub: 'Some disagreement is useful. Some is noise. I need to sort it.' },
        simple: { main: 'It depends', sub: 'Some people have good points. Some do not.' },
        effects: { practicality: 0.5, wisdom: 0.5, gates: { non_self_sealing: 0.5, reality_contact: 0.4 } },
        followUps: ['source_sorting_followup']
      },
      {
        id: 'they_are_biased',
        normal: { main: 'They are probably biased', sub: 'Most disagreement comes from people protecting their side or their ego.' },
        simple: { main: 'They are probably biased', sub: 'They do not want to see it.' },
        effects: { gates: { non_self_sealing: -0.9, non_strawman: -0.5 } },
        followUps: ['bias_claim_followup']
      },
      {
        id: 'disagreement_confirms',
        normal: { main: 'The pushback mostly confirms it', sub: 'The fact that people react badly is part of why I think the view is right.' },
        simple: { main: 'Their reaction proves it', sub: 'The pushback makes me more sure.' },
        effects: { gates: { non_self_sealing: -1.3, counter_consideration: -0.7, reality_contact: -0.5 } },
        followUps: ['reaction_confirms_followup']
      }
    ]
  },
  {
    id: 'pressure_behavior_01',
    kind: 'base',
    seriousOnly: true,
    normal: {
      kicker: 'Pressure behavior',
      title: 'When pressure rises, what do you protect first?',
      help: 'This catches the difference between truth-protection, face-protection, and outcome-protection.'
    },
    simple: {
      kicker: 'Hard moment',
      title: 'When things get tense, what do you protect first?',
      help: 'Pick the real one.'
    },
    answers: [
      {
        id: 'protect_accuracy',
        normal: { main: 'Accuracy', sub: 'I would rather be corrected than keep a clean image.' },
        simple: { main: 'Being correct', sub: 'I can be wrong if the truth gets better.' },
        effects: { knowledge: 0.9, gates: { self_correction: 0.8, reality_contact: 0.5 } }
      },
      {
        id: 'protect_people',
        normal: { main: 'People', sub: 'I protect the human cost first, then sort out the details.' },
        simple: { main: 'People', sub: 'I care who gets hurt first.' },
        effects: { empathy: 1.2, gates: { reality_contact: 0.2 } }
      },
      {
        id: 'protect_action',
        normal: { main: 'Action', sub: 'I protect the decision path so the situation does not freeze.' },
        simple: { main: 'Getting it done', sub: 'We still need to act.' },
        effects: { practicality: 1.2, gates: { contradiction_handling: 0.2 } }
      },
      {
        id: 'protect_image',
        normal: { main: 'My position', sub: 'I do not want the core point weakened by attacks or side issues.' },
        simple: { main: 'My side of it', sub: 'I do not want my point to look weak.' },
        effects: { gates: { self_correction: -0.7, non_self_sealing: -0.5 }, quality: { self_protective_signal: 1 } },
        followUps: ['protect_position_followup']
      }
    ]
  },
  {
    id: 'decision_cost_01',
    kind: 'base',
    seriousOnly: true,
    normal: {
      kicker: 'Cost accounting',
      title: 'Which cost are you most likely to undercount?',
      help: 'A good result can expose its own blind spot.'
    },
    simple: {
      kicker: 'Blind spot',
      title: 'What cost might you miss?',
      help: 'What do you forget too easily?'
    },
    answers: [
      {
        id: 'undercount_human',
        normal: { main: 'Human cost', sub: 'I may undercount how this affects people.' },
        simple: { main: 'People getting hurt', sub: 'I might miss that.' },
        effects: { practicality: 0.7, empathy: 0.5, gates: { self_correction: 0.6 } }
      },
      {
        id: 'undercount_workability',
        normal: { main: 'Workability', sub: 'I may undercount whether this can actually work.' },
        simple: { main: 'Whether it works', sub: 'A nice idea may fail.' },
        effects: { empathy: 0.7, practicality: 0.5, gates: { reality_contact: 0.6 } }
      },
      {
        id: 'undercount_facts',
        normal: { main: 'Missing facts', sub: 'I may be drawing too much from too little evidence.' },
        simple: { main: 'Missing proof', sub: 'I may not know enough.' },
        effects: { wisdom: 0.6, knowledge: 0.5, gates: { self_correction: 0.5, reality_contact: 0.5 } }
      },
      {
        id: 'undercount_context',
        normal: { main: 'Missing context', sub: 'I may have facts but still be using them inside a weak frame.' },
        simple: { main: 'Missing big picture', sub: 'The facts may not be enough.' },
        effects: { knowledge: 0.6, wisdom: 0.5, gates: { contradiction_handling: 0.5 } }
      }
    ]
  },
  {
    id: 'final_check_01',
    kind: 'base',
    normal: {
      kicker: 'Final check',
      title: 'How seriously should this result be treated?',
      help: 'This does not change the axes much. It helps label the signal quality.'
    },
    simple: {
      kicker: 'Last check',
      title: 'How real were your answers?',
      help: 'Be honest. This protects the result.'
    },
    answers: [
      {
        id: 'careful_answers',
        normal: { main: 'Careful enough', sub: 'I answered based on the actual scope.' },
        simple: { main: 'I answered for real', sub: 'I tried.' },
        effects: { gates: { reality_contact: 0.3 }, quality: { high_signal: 1 } }
      },
      {
        id: 'rough_answers',
        normal: { main: 'Rough but usable', sub: 'Some answers were approximate, but the shape is probably still useful.' },
        simple: { main: 'Close enough', sub: 'Not perfect, but usable.' },
        effects: { quality: { incomplete_signal: 1 } }
      },
      {
        id: 'mostly_testing_app',
        normal: { main: 'I was mostly testing the app', sub: 'The result should be treated as weak signal.' },
        simple: { main: 'I was just testing', sub: 'Do not take the score too seriously.' },
        effects: { gates: { reality_contact: -0.4 }, quality: { low_signal: 2 } }
      },
      {
        id: 'clicked_through',
        normal: { main: 'I mostly clicked through', sub: 'The result should not be used as a real judgment.' },
        simple: { main: 'I clicked around', sub: 'This result is weak.' },
        effects: { gates: { reality_contact: -0.8, self_correction: -0.4 }, quality: { low_signal: 3, shallow_signal: 1 } }
      }
    ]
  }
]);

export const FOLLOW_UP_CARDS = Object.freeze([
  {
    id: 'unclear_reason_followup',
    kind: 'followup',
    normal: {
      kicker: 'Clarifier',
      title: 'Why is the reason unclear?',
      help: 'This separates honest uncertainty from low-contact guessing.'
    },
    simple: {
      kicker: 'Quick check',
      title: 'Why are you unsure?',
      help: 'Pick the closest one.'
    },
    answers: [
      { id: 'need_more_info', normal: { main: 'I need more information', sub: 'The scope may be real, but I lack enough inputs.' }, simple: { main: 'I need more info', sub: 'I do not know enough yet.' }, effects: { gates: { self_correction: 0.6, reality_contact: 0.4 }, quality: { incomplete_signal: 1 } } },
      { id: 'not_thinking_hard', normal: { main: 'I am not thinking hard about it', sub: 'I am giving a loose answer.' }, simple: { main: 'I am not thinking hard', sub: 'Loose answer.' }, effects: { gates: { reality_contact: -0.5 }, quality: { low_signal: 2 } } },
      { id: 'feels_mixed', normal: { main: 'The tradeoff is genuinely mixed', sub: 'Both sides have real force in this scope.' }, simple: { main: 'It is mixed', sub: 'Both sides matter.' }, effects: { gates: { contradiction_handling: 0.8, counter_consideration: 0.4 } } }
    ]
  },
  {
    id: 'pattern_confidence_followup',
    kind: 'followup',
    normal: { kicker: 'Pattern check', title: 'What makes the pattern obvious?', help: 'Pattern recognition can be sharp, or it can become a shortcut.' },
    simple: { kicker: 'Pattern check', title: 'Why does it feel obvious?', help: 'What makes you so sure?' },
    answers: [
      { id: 'many_examples', normal: { main: 'Many examples across time', sub: 'The pattern keeps showing up in different places.' }, simple: { main: 'Many examples', sub: 'I keep seeing it.' }, effects: { wisdom: 0.8, gates: { reality_contact: 0.7, counter_consideration: 0.2 } } },
      { id: 'clear_mechanism', normal: { main: 'A clear mechanism', sub: 'I can explain what causes the pattern, not just point at vibes.' }, simple: { main: 'I know why it happens', sub: 'There is a cause.' }, effects: { knowledge: 0.6, wisdom: 0.6, gates: { reality_contact: 0.7, contradiction_handling: 0.5 } } },
      { id: 'people_show_it', normal: { main: 'People reveal it when challenged', sub: 'Their reactions seem to expose the pattern.' }, simple: { main: 'People show it', sub: 'Their reaction gives it away.' }, effects: { gates: { non_self_sealing: -0.5, non_strawman: -0.3 } }, followUps: ['reaction_confirms_followup'] },
      { id: 'cant_explain_pattern', normal: { main: 'I cannot explain it cleanly yet', sub: 'It feels obvious, but I have not made it accountable.' }, simple: { main: 'I cannot explain it yet', sub: 'It just feels clear.' }, effects: { gates: { reality_contact: -0.6, contradiction_handling: -0.3 }, quality: { incomplete_signal: 1 } } }
    ]
  },
  {
    id: 'objection_quality_followup',
    kind: 'followup',
    normal: { kicker: 'Objection check', title: 'Why do the objections miss the point?', help: 'This checks whether you can separate weak objections from all objections.' },
    simple: { kicker: 'Objection check', title: 'Why do they miss the point?', help: 'Pick the reason.' },
    answers: [
      { id: 'they_attack_wrong_claim', normal: { main: 'They attack the wrong claim', sub: 'I can state the stronger version they are failing to address.' }, simple: { main: 'Wrong target', sub: 'They attack a weaker version.' }, effects: { knowledge: 0.7, gates: { non_strawman: 0.6, counter_consideration: 0.4 } } },
      { id: 'they_ignore_tradeoff', normal: { main: 'They ignore the tradeoff', sub: 'They focus on one cost and erase another.' }, simple: { main: 'They miss the tradeoff', sub: 'They see only one cost.' }, effects: { wisdom: 0.7, gates: { contradiction_handling: 0.5, counter_consideration: 0.3 } } },
      { id: 'they_are_motivated', normal: { main: 'They are motivated against the conclusion', sub: 'Their objection mainly protects their side.' }, simple: { main: 'They do not want it true', sub: 'Their side gets protected.' }, effects: { gates: { non_self_sealing: -0.7, non_strawman: -0.4 } }, followUps: ['bad_faith_followup'] }
    ]
  },
  {
    id: 'bad_faith_followup',
    kind: 'followup',
    normal: { kicker: 'Motive check', title: 'How do you know the objection is bad-faith?', help: 'Motive claims need stronger accounting than ordinary disagreement.' },
    simple: { kicker: 'Motive check', title: 'How do you know they are not honest?', help: 'What is the proof?' },
    answers: [
      { id: 'record_of_misrepresenting', normal: { main: 'A record of misrepresenting', sub: 'There is a concrete pattern of them twisting the claim.' }, simple: { main: 'They keep twisting it', sub: 'There is a record.' }, effects: { knowledge: 0.8, gates: { reality_contact: 0.7, non_self_sealing: 0.2 } } },
      { id: 'direct_incentive', normal: { main: 'A direct incentive', sub: 'They benefit from pretending not to understand.' }, simple: { main: 'They gain from it', sub: 'They have a reason to fake it.' }, effects: { practicality: 0.6, gates: { reality_contact: 0.4 } } },
      { id: 'they_disagree_so_bad', normal: { main: 'Because no honest person would hold that view', sub: 'The disagreement itself is enough evidence for me.' }, simple: { main: 'Because no honest person would say that', sub: 'The disagreement proves it.' }, effects: { gates: { non_self_sealing: -1, non_strawman: -0.8, counter_consideration: -0.6 } } },
      { id: 'not_sure_badfaith', normal: { main: 'I should soften that claim', sub: 'I may be reading motive too strongly.' }, simple: { main: 'Maybe I went too far', sub: 'I should not guess their motive too fast.' }, effects: { wisdom: 0.6, gates: { self_correction: 0.8, non_strawman: 0.5, non_self_sealing: 0.5 } } }
    ]
  },
  {
    id: 'obvious_wrong_followup',
    kind: 'followup',
    normal: { kicker: 'Certainty check', title: 'What makes the other side obviously wrong?', help: 'This separates clean refutation from status-defense.' },
    simple: { kicker: 'Certainty check', title: 'Why are they clearly wrong?', help: 'What makes it clear?' },
    answers: [
      { id: 'contradicts_record', normal: { main: 'It contradicts the record', sub: 'There are clear facts or results against it.' }, simple: { main: 'Facts go against it', sub: 'The record says no.' }, effects: { knowledge: 1, gates: { reality_contact: 0.8 } } },
      { id: 'internal_contradiction', normal: { main: 'It contradicts itself', sub: 'The view fails by its own terms.' }, simple: { main: 'It fights itself', sub: 'Its own pieces do not fit.' }, effects: { wisdom: 0.7, knowledge: 0.5, gates: { contradiction_handling: 0.8 } } },
      { id: 'people_who_believe_low_status', normal: { main: 'The people who believe it are not serious', sub: 'Their side is the main reason I dismiss the view.' }, simple: { main: 'Those people are not serious', sub: 'That is why I dismiss it.' }, effects: { gates: { non_strawman: -0.8, non_self_sealing: -0.7 } } },
      { id: 'not_sure_obvious', normal: { main: 'Maybe “obvious” is too strong', sub: 'I still disagree, but I should model it better.' }, simple: { main: 'Maybe not obvious', sub: 'I should check more.' }, effects: { wisdom: 0.5, gates: { self_correction: 0.7, non_strawman: 0.5 } } }
    ]
  },
  {
    id: 'hard_to_change_followup',
    kind: 'followup',
    normal: { kicker: 'Revision check', title: 'Why would it be hard to change?', help: 'Some views are stable because they are well-tested. Others are sealed.' },
    simple: { kicker: 'Change check', title: 'Why is it hard to change?', help: 'Strong proof or locked door?' },
    answers: [
      { id: 'well_tested', normal: { main: 'It has been tested many ways', sub: 'Different evidence streams keep pointing the same way.' }, simple: { main: 'I tested it a lot', sub: 'Many checks point the same way.' }, effects: { knowledge: 0.7, wisdom: 0.5, gates: { reality_contact: 0.7, self_correction: 0.4 } } },
      { id: 'core_values', normal: { main: 'It protects a core value', sub: 'Changing it would require changing what I prioritize.' }, simple: { main: 'It protects something important', sub: 'It connects to my values.' }, effects: { empathy: 0.7, gates: { self_correction: -0.2 } } },
      { id: 'dont_trust_counter', normal: { main: 'I do not trust counter-evidence here', sub: 'Most evidence against it is likely filtered or manipulated.' }, simple: { main: 'I do not trust the other proof', sub: 'It may be fake or filtered.' }, effects: { gates: { non_self_sealing: -0.6, reality_contact: -0.4 } }, followUps: ['source_sorting_followup'] }
    ]
  },
  {
    id: 'nothing_changes_followup',
    kind: 'followup',
    normal: { kicker: 'Seal check', title: 'Is the view allowed to lose?', help: 'A view that cannot lose cannot be measured well.' },
    simple: { kicker: 'Locked-door check', title: 'Can your idea lose?', help: 'Can anything beat it?' },
    answers: [
      { id: 'can_lose_in_principle', normal: { main: 'Yes, in principle', sub: 'I overstated it. There are extreme cases that would change it.' }, simple: { main: 'Yes, maybe', sub: 'I said it too strongly.' }, effects: { wisdom: 0.4, gates: { self_correction: 0.8, non_self_sealing: 0.6 } } },
      { id: 'cannot_lose', normal: { main: 'No, it cannot realistically lose', sub: 'Any counterexample would probably be fake, irrelevant, or misread.' }, simple: { main: 'No', sub: 'Anything against it is probably wrong.' }, effects: { gates: { self_correction: -1.1, non_self_sealing: -1.2, reality_contact: -0.7 }, quality: { sealed_signal: 2 } } },
      { id: 'depends_on_definition', normal: { main: 'It depends on definitions', sub: 'I may need to tighten the claim before testing it fairly.' }, simple: { main: 'I need clearer words', sub: 'The idea may be too messy.' }, effects: { knowledge: 0.4, gates: { contradiction_handling: 0.7, self_correction: 0.4 } } }
    ]
  },
  {
    id: 'ignore_conflict_followup',
    kind: 'followup',
    normal: { kicker: 'Conflict check', title: 'Why is the conflict safe to ignore?', help: 'Some conflicts are minor. Some expose the center of the issue.' },
    simple: { kicker: 'Mismatch check', title: 'Why can you ignore it?', help: 'Is it small or important?' },
    answers: [
      { id: 'minor_edge_case', normal: { main: 'It is a minor edge case', sub: 'It affects the boundary, not the main claim.' }, simple: { main: 'It is small', sub: 'It does not change the main point.' }, effects: { practicality: 0.5, gates: { contradiction_handling: 0.3, reality_contact: 0.3 } } },
      { id: 'will_fix_later', normal: { main: 'I should fix it later', sub: 'The result is useful, but the unresolved part should be tracked.' }, simple: { main: 'I should fix it later', sub: 'The weak part should be marked.' }, effects: { wisdom: 0.4, gates: { contradiction_handling: 0.5, self_correction: 0.4 }, quality: { incomplete_signal: 1 } } },
      { id: 'dont_care_conflict', normal: { main: 'I do not care because the conclusion feels right', sub: 'The conflict does not matter to me.' }, simple: { main: 'I do not care', sub: 'The answer feels right anyway.' }, effects: { gates: { contradiction_handling: -0.9, reality_contact: -0.5 }, quality: { shallow_signal: 2 } } }
    ]
  },
  {
    id: 'pattern_evidence_followup',
    kind: 'followup',
    normal: { kicker: 'Pattern evidence', title: 'How broad is the pattern?', help: 'One repeated example is weaker than a pattern across contexts.' },
    simple: { kicker: 'Pattern proof', title: 'Where do you see the pattern?', help: 'One place or many places?' },
    answers: [
      { id: 'across_contexts', normal: { main: 'Across different contexts', sub: 'The pattern repeats even when the setting changes.' }, simple: { main: 'Many places', sub: 'It shows up in different settings.' }, effects: { wisdom: 0.7, gates: { reality_contact: 0.7 } } },
      { id: 'same_circle', normal: { main: 'Mostly in one circle', sub: 'The pattern may be real, but the sample is narrow.' }, simple: { main: 'Mostly one place', sub: 'It might be a small sample.' }, effects: { gates: { reality_contact: 0.1, self_correction: 0.3 }, quality: { narrow_sample: 1 } } },
      { id: 'online_examples', normal: { main: 'Mostly online examples', sub: 'It may still matter, but the input is noisy.' }, simple: { main: 'Mostly online', sub: 'Could be noisy.' }, effects: { gates: { reality_contact: -0.2, counter_consideration: 0.1 }, quality: { noisy_sample: 1 } } }
    ]
  },
  {
    id: 'intuition_followup',
    kind: 'followup',
    normal: { kicker: 'Intuition check', title: 'What should happen before using this result?', help: 'Intuition can start a test. It should not always finish it.' },
    simple: { kicker: 'Feeling check', title: 'What should happen next?', help: 'A feeling can start the work.' },
    answers: [
      { id: 'look_for_evidence', normal: { main: 'Find evidence', sub: 'I should anchor the feeling before using it strongly.' }, simple: { main: 'Look for proof', sub: 'Check it first.' }, effects: { gates: { self_correction: 0.7, reality_contact: 0.5 } } },
      { id: 'use_as_warning', normal: { main: 'Use it as a warning signal', sub: 'I should treat it as a possible clue, not the conclusion.' }, simple: { main: 'Use it as a clue', sub: 'Not the final answer.' }, effects: { wisdom: 0.5, gates: { contradiction_handling: 0.4, self_correction: 0.4 } } },
      { id: 'trust_feeling', normal: { main: 'Trust the feeling', sub: 'I do not need much more for this scope.' }, simple: { main: 'Trust it', sub: 'The feeling is enough.' }, effects: { gates: { reality_contact: -0.7, self_correction: -0.4 } } }
    ]
  },
  {
    id: 'identity_anchor_followup',
    kind: 'followup',
    normal: { kicker: 'Anchor check', title: 'Is the trusted side allowed to be wrong?', help: 'Trusted groups can be useful filters, but they can also become shields.' },
    simple: { kicker: 'Team check', title: 'Can your side be wrong?', help: 'Can your trusted people mess up?' },
    answers: [
      { id: 'side_can_be_wrong', normal: { main: 'Yes, my side can be wrong', sub: 'I trust them more, but I still need checks.' }, simple: { main: 'Yes', sub: 'My side can mess up.' }, effects: { gates: { non_self_sealing: 0.8, self_correction: 0.6, reality_contact: 0.4 } } },
      { id: 'side_more_reliable', normal: { main: 'They are more reliable, but not perfect', sub: 'Their track record matters, but it does not end the test.' }, simple: { main: 'They are better, not perfect', sub: 'Still need checks.' }, effects: { practicality: 0.3, gates: { reality_contact: 0.3, non_self_sealing: 0.3 } } },
      { id: 'side_basically_right', normal: { main: 'They are basically right on this kind of thing', sub: 'I do not need to reopen it every time.' }, simple: { main: 'My side is usually right', sub: 'I trust them here.' }, effects: { gates: { non_self_sealing: -0.5, reality_contact: -0.4 } } }
    ]
  },
  {
    id: 'source_sorting_followup',
    kind: 'followup',
    normal: { kicker: 'Source sorting', title: 'How do you decide what is useful disagreement?', help: 'Source criticism is valid only if it stays accountable.' },
    simple: { kicker: 'Source check', title: 'How do you sort good points from bad points?', help: 'What is your filter?' },
    answers: [
      { id: 'track_record_specific', normal: { main: 'Specific track record', sub: 'I check whether the source has been accurate on this kind of claim.' }, simple: { main: 'Track record', sub: 'Were they right before?' }, effects: { knowledge: 0.6, gates: { reality_contact: 0.7, non_self_sealing: 0.3 } } },
      { id: 'argument_quality', normal: { main: 'Argument quality', sub: 'I check the claim itself before leaning on source trust.' }, simple: { main: 'The argument itself', sub: 'Does the point work?' }, effects: { wisdom: 0.5, knowledge: 0.4, gates: { non_strawman: 0.6, counter_consideration: 0.4 } } },
      { id: 'side_membership', normal: { main: 'Which side they are on', sub: 'The side usually tells me what I need to know.' }, simple: { main: 'Their side', sub: 'That tells me enough.' }, effects: { gates: { non_self_sealing: -0.8, non_strawman: -0.5, reality_contact: -0.4 } } }
    ]
  },
  {
    id: 'bias_claim_followup',
    kind: 'followup',
    normal: { kicker: 'Bias check', title: 'What proves the bias is controlling their view?', help: 'Bias can explain errors, but it cannot replace the argument.' },
    simple: { kicker: 'Bias check', title: 'How do you know bias is the reason?', help: 'What shows it?' },
    answers: [
      { id: 'bias_inconsistency', normal: { main: 'They apply standards inconsistently', sub: 'They change rules depending on who benefits.' }, simple: { main: 'Double standard', sub: 'They change rules for their side.' }, effects: { knowledge: 0.6, gates: { reality_contact: 0.7 } } },
      { id: 'bias_incentive', normal: { main: 'They have a clear incentive', sub: 'Their position protects status, money, power, identity, or convenience.' }, simple: { main: 'They gain from it', sub: 'It helps them.' }, effects: { practicality: 0.5, gates: { reality_contact: 0.4 } } },
      { id: 'bias_assumed', normal: { main: 'It is mostly assumed', sub: 'Their conclusion sounds like what their side would say.' }, simple: { main: 'I mostly assume it', sub: 'It sounds like their side.' }, effects: { gates: { reality_contact: -0.6, non_strawman: -0.5 } } }
    ]
  },
  {
    id: 'reaction_confirms_followup',
    kind: 'followup',
    normal: { kicker: 'Reaction check', title: 'Could the reaction have another explanation?', help: 'A reaction can be evidence, but it can also be noise.' },
    simple: { kicker: 'Reaction check', title: 'Could their reaction mean something else?', help: 'Maybe it proves less than it feels like.' },
    answers: [
      { id: 'yes_other_explanation', normal: { main: 'Yes, another explanation is possible', sub: 'They may be reacting to tone, framing, timing, or a missing distinction.' }, simple: { main: 'Yes', sub: 'Maybe they reacted to tone or timing.' }, effects: { empathy: 0.4, wisdom: 0.4, gates: { non_self_sealing: 0.7, non_strawman: 0.4 } } },
      { id: 'reaction_pattern_strong', normal: { main: 'Maybe, but the repeated pattern is strong', sub: 'I should not use one reaction, but repeated reactions across contexts matter.' }, simple: { main: 'Maybe, but it happens a lot', sub: 'One time is weak. Many times matter.' }, effects: { wisdom: 0.5, gates: { reality_contact: 0.4, counter_consideration: 0.2 } } },
      { id: 'no_reaction_proves', normal: { main: 'No, the reaction proves the point', sub: 'Their reaction is exactly what the view predicts.' }, simple: { main: 'No, it proves it', sub: 'Their reaction gives it away.' }, effects: { gates: { non_self_sealing: -0.9, counter_consideration: -0.5 } } }
    ]
  },
  {
    id: 'protect_position_followup',
    kind: 'followup',
    normal: { kicker: 'Position check', title: 'Why protect the position first?', help: 'Sometimes a position needs defense. Sometimes the defense becomes the thought.' },
    simple: { kicker: 'Position check', title: 'Why protect your point first?', help: 'Is it truth, or image?' },
    answers: [
      { id: 'prevent_misread', normal: { main: 'To prevent a misread', sub: 'If the claim is distorted, the test becomes useless.' }, simple: { main: 'So people do not twist it', sub: 'The real claim matters.' }, effects: { knowledge: 0.5, gates: { non_strawman: 0.5 } } },
      { id: 'high_stakes', normal: { main: 'The stakes are high', sub: 'A bad framing could cause real harm or bad action.' }, simple: { main: 'Because it matters a lot', sub: 'Bad framing could hurt people or decisions.' }, effects: { empathy: 0.4, practicality: 0.4, gates: { reality_contact: 0.3 } } },
      { id: 'dont_want_lose', normal: { main: 'I do not want to lose the point', sub: 'If I give ground, people may use it against the whole view.' }, simple: { main: 'I do not want to lose', sub: 'They might use it against me.' }, effects: { gates: { self_correction: -0.7, non_self_sealing: -0.6 }, quality: { self_protective_signal: 1 } } }
    ]
  }
]);
