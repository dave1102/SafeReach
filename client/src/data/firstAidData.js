// Static first-aid reference content. Cached by the service worker for
// offline use (see vite.config.js runtimeCaching). This is general
// guidance, not a substitute for professional medical training —
// surfaced via the disclaimer in FirstAid.jsx and FirstAidDetail.jsx.
const firstAidGuides = [
  {
    slug: 'burns',
    title: 'Burns',
    icon: 'flame',
    severity: 'Moderate',
    summary: 'Cool the burn, cover it loosely, and know when it needs a hospital.',
    steps: [
      'Move away from the heat source. Remove jewelry/tight clothing near the burn before it swells.',
      'Cool the burn under cool (not icy) running water for 10–20 minutes. Do not use ice.',
      'Cover loosely with a clean, non-fluffy cloth or cling film — do not wrap tightly.',
      'Do not apply butter, oil, ice, or ointments to the burn.',
      'Do not burst any blisters that form.'
    ],
    seekHelpIf: [
      'The burn is larger than the person\u2019s palm, or is on the face, hands, feet, or genitals.',
      'The skin looks white, leathery, or charred (possible deep/third-degree burn).',
      'It was caused by chemicals, electricity, or an explosion.',
      'The person is a child, elderly, or shows signs of shock (pale, clammy, rapid breathing).'
    ]
  },
  {
    slug: 'bleeding',
    title: 'Severe Bleeding',
    icon: 'droplet',
    severity: 'High',
    summary: 'Apply firm, direct pressure and keep the injured area raised.',
    steps: [
      'Call for emergency help immediately if bleeding is heavy or won\u2019t stop.',
      'Apply firm, direct pressure to the wound with a clean cloth or dressing.',
      'Keep pressing continuously — do not lift the cloth to check, add more layers on top instead.',
      'Raise the injured area above the level of the heart if possible.',
      'Once bleeding is controlled, secure the dressing firmly (not so tight it cuts circulation) and keep the person warm and still.'
    ],
    seekHelpIf: [
      'Bleeding does not slow after 10 minutes of firm direct pressure.',
      'Blood is spurting (possible arterial bleed) or the wound is deep/gaping.',
      'There is an embedded object — do not remove it, pad around it instead.',
      'The person becomes pale, faint, confused, or their breathing changes.'
    ]
  },
  {
    slug: 'cpr',
    title: 'CPR (Cardiopulmonary Resuscitation)',
    icon: 'heart-pulse',
    severity: 'Critical',
    summary: 'Push hard and fast in the center of the chest until help arrives.',
    steps: [
      'Check responsiveness — tap firmly and shout. If unresponsive and not breathing normally, call emergency services immediately.',
      'Lay the person flat on their back on a firm surface.',
      'Kneel beside them, place the heel of one hand on the center of the chest, the other hand on top, fingers interlaced.',
      'Push hard and fast — about 5–6 cm deep, at 100–120 compressions per minute (the tempo of "Stayin\u2019 Alive").',
      'Allow the chest to fully recoil between compressions. Continue until help arrives or the person starts breathing.',
      'If trained, give 2 rescue breaths after every 30 compressions. If untrained, hands-only CPR (compressions only) is still effective.'
    ],
    seekHelpIf: [
      'This is always a call-emergency-services-immediately situation.',
      'Use an AED (automated external defibrillator) immediately if one is available — it will guide you with voice prompts.',
      'Continue CPR until professional help takes over, the person recovers, or you are physically unable to continue.'
    ]
  },
  {
    slug: 'fractures',
    title: 'Fractures & Broken Bones',
    icon: 'bone',
    severity: 'High',
    summary: 'Keep the area still and supported — don\u2019t try to realign it.',
    steps: [
      'Keep the injured area as still as possible. Do not move the person unless they are in immediate danger.',
      'Do not try to straighten or push a bone back into place.',
      'Support the limb above and below the injury with padding, a rolled towel, or a splint if you\u2019re trained to make one.',
      'Apply a cold pack wrapped in cloth to reduce swelling and pain — never directly on skin.',
      'If the skin is broken over the fracture, cover it with a clean dressing without pressing on the bone.'
    ],
    seekHelpIf: [
      'The bone is visibly deformed, or piercing the skin.',
      'The person cannot move or bear weight on the area, or has lost feeling/circulation beyond the injury.',
      'It involves the head, neck, spine, hip, or thigh — do not move the person at all, call emergency services.'
    ]
  },
  {
    slug: 'poisoning',
    title: 'Poisoning',
    icon: 'skull',
    severity: 'Critical',
    summary: 'Identify what was taken, and never induce vomiting unless told to.',
    steps: [
      'Call your local poison control center or emergency services right away.',
      'Try to identify the substance, amount, and time of exposure — keep the container/packaging to show responders.',
      'Do NOT induce vomiting unless specifically instructed to by a medical professional or poison control.',
      'If the poison is on the skin or in the eyes, rinse with plenty of clean water.',
      'If the person is unconscious but breathing, place them in the recovery position and monitor breathing closely.'
    ],
    seekHelpIf: [
      'This is always an emergency — call for help immediately, even if the person seems fine.',
      'The person is drowsy, having seizures, struggling to breathe, or unconscious.',
      'A child may have swallowed medication, household chemicals, or plants.'
    ]
  },
  {
    slug: 'choking',
    title: 'Choking',
    icon: 'wind',
    severity: 'Critical',
    summary: 'Encourage coughing first, then back blows and abdominal thrusts.',
    steps: [
      'If the person can cough, speak, or breathe, encourage them to keep coughing — don\u2019t interfere.',
      'If they cannot breathe, speak, or cough: stand behind them, lean them forward, and give up to 5 firm back blows between the shoulder blades with the heel of your hand.',
      'If that doesn\u2019t work, give up to 5 abdominal thrusts (Heimlich maneuver): stand behind them, fist above the navel, grasp with your other hand, and pull sharply inward and upward.',
      'Alternate 5 back blows and 5 abdominal thrusts until the object is dislodged or the person becomes unresponsive.',
      'If they become unresponsive, lower them to the ground, call emergency services, and begin CPR.'
    ],
    seekHelpIf: [
      'The obstruction does not clear after a couple of rounds of back blows and thrusts — call emergency services during, not just after.',
      'The person is pregnant or too large to get your arms around — use chest thrusts instead of abdominal thrusts.',
      'The person loses consciousness at any point.'
    ]
  },
  {
    slug: 'snake-bites',
    title: 'Snake Bites',
    icon: 'zap',
    severity: 'High',
    summary: 'Keep the person still and the bite below heart level — don\u2019t cut or suck the wound.',
    steps: [
      'Move the person away from the snake and keep them as calm and still as possible — movement spreads venom faster.',
      'Keep the bitten limb below the level of the heart, and immobilize it with a splint if possible.',
      'Remove rings, watches, or tight clothing near the bite before swelling starts.',
      'Loosely cover the wound with a clean, dry dressing. Note the time of the bite and the snake\u2019s appearance if it was seen (do not try to catch or kill it).',
      'Do NOT cut the wound, try to suck out venom, apply ice, or apply a tight tourniquet.'
    ],
    seekHelpIf: [
      'This is always an emergency — call for help and get to a hospital immediately, even if symptoms seem mild at first.',
      'There is swelling spreading rapidly, difficulty breathing, drooping eyelids, or slurred speech.',
      'The person feels faint, nauseated, or the bite area is going numb.'
    ]
  }
]

export default firstAidGuides
