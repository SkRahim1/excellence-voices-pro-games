export interface Challenge {
  id: string;
  sentence: string;
  expected: string;
  instruction: string;
}

export interface TimeTransformerLevel {
  levelNumber: number;
  timeExpression: string;
  explanation: string;
  examples: string[];
  challenges: Challenge[];
}

export const timeTransformerLevels: TimeTransformerLevel[] = [
  {
    levelNumber: 1,
    timeExpression: 'Every Day',
    explanation: 'Every day is used to talk about habits or routines that happen regularly in the present simple tense.',
    examples: [
      'Every day, I wake up at 6 o\'clock.',
      'Every day, she drinks milk.',
      'Every day, we play cricket after school.'
    ],
    challenges: [
      {
        id: 'l1-c1',
        sentence: 'Every day, I play football.',
        expected: 'Every day, I play football.',
        instruction: 'Read the sentence using the time expression.'
      },
      {
        id: 'l1-c2',
        sentence: 'Every day, she reads a book.',
        expected: 'Every day, she reads a book.',
        instruction: 'Read the sentence using the time expression.'
      }
    ]
  },
  {
    levelNumber: 2,
    timeExpression: 'Tomorrow',
    explanation: 'Tomorrow is used to talk about actions that will happen on the next day, using the future simple tense.',
    examples: [
      'Tomorrow, I will visit my grandparents.',
      'Tomorrow, we will have an English test.',
      'Tomorrow, she will buy a new bag.'
    ],
    challenges: [
      {
        id: 'l2-c1',
        sentence: 'Every day, I play football.',
        expected: 'Tomorrow, I will play football.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      },
      {
        id: 'l2-c2',
        sentence: 'Every day, she goes to the market.',
        expected: 'Tomorrow, she will go to the market.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      }
    ]
  },
  {
    levelNumber: 3,
    timeExpression: 'Yesterday',
    explanation: 'Yesterday is used to talk about actions that occurred in the past, using the past simple tense.',
    examples: [
      'Yesterday, I met my old friend.',
      'Yesterday, we ate pizza for lunch.',
      'Yesterday, he watched a movie.'
    ],
    challenges: [
      {
        id: 'l3-c1',
        sentence: 'Every day, I visit my friend.',
        expected: 'Yesterday, I visited my friend.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      },
      {
        id: 'l3-c2',
        sentence: 'Every day, she makes a delicious cake.',
        expected: 'Yesterday, she made a delicious cake.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      }
    ]
  },
  {
    levelNumber: 4,
    timeExpression: 'Now',
    explanation: 'Now is used to talk about actions happening right at the present moment, using the present continuous tense.',
    examples: [
      'Now, I am studying English.',
      'Now, they are playing in the park.',
      'Now, it is raining heavily.'
    ],
    challenges: [
      {
        id: 'l4-c1',
        sentence: 'Every day, I write a letter.',
        expected: 'Now, I am writing a letter.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      },
      {
        id: 'l4-c2',
        sentence: 'Every day, he watches television.',
        expected: 'Now, he is watching television.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      }
    ]
  },
  {
    levelNumber: 5,
    timeExpression: 'At 9 O\'Clock Yesterday',
    explanation: 'At 9 O\'Clock Yesterday is used to talk about continuous actions in progress at a specific past point in time, using the past continuous tense.',
    examples: [
      'At 9 o\'clock yesterday, I was sleeping.',
      'At 9 o\'clock yesterday, they were travelling.',
      'At 9 o\'clock yesterday, she was preparing breakfast.'
    ],
    challenges: [
      {
        id: 'l5-c1',
        sentence: 'Every day, I read a novel.',
        expected: 'At 9 o\'clock yesterday, I was reading a novel.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      },
      {
        id: 'l5-c2',
        sentence: 'Every day, we do our homework.',
        expected: 'At 9 o\'clock yesterday, we were doing our homework.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      }
    ]
  },
  {
    levelNumber: 6,
    timeExpression: 'At 9 O\'Clock Tomorrow',
    explanation: 'At 9 O\'Clock Tomorrow is used to talk about actions that will be in progress at a specific future point in time, using the future continuous tense.',
    examples: [
      'At 9 o\'clock tomorrow, I will be flying to Mumbai.',
      'At 9 o\'clock tomorrow, he will be writing his exam.',
      'At 9 o\'clock tomorrow, they will be playing a match.'
    ],
    challenges: [
      {
        id: 'l6-c1',
        sentence: 'Every day, I write my exam.',
        expected: 'At 9 o\'clock tomorrow, I will be writing my exam.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      },
      {
        id: 'l6-c2',
        sentence: 'Every day, she sleeps.',
        expected: 'At 9 o\'clock tomorrow, she will be sleeping.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      }
    ]
  },
  {
    levelNumber: 7,
    timeExpression: 'Already',
    explanation: 'Already is used to refer to actions completed prior to the present moment, using the present perfect tense.',
    examples: [
      'Already, I have finished my dinner.',
      'Already, she has completed her homework.',
      'Already, they have left the office.'
    ],
    challenges: [
      {
        id: 'l7-c1',
        sentence: 'Every day, I submit the report.',
        expected: 'Already, I have submitted the report.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      },
      {
        id: 'l7-c2',
        sentence: 'Every day, he reads the instructions.',
        expected: 'Already, he has read the instructions.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      }
    ]
  },
  {
    levelNumber: 8,
    timeExpression: 'For Two Hours',
    explanation: 'For Two Hours is used to talk about actions that started in the past and continue into the present, using the present perfect continuous tense.',
    examples: [
      'For two hours, I have been reading this book.',
      'For two hours, they have been waiting for the bus.',
      'For two hours, she has been practicing the piano.'
    ],
    challenges: [
      {
        id: 'l8-c1',
        sentence: 'Every day, I study English.',
        expected: 'For two hours, I have been studying English.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      },
      {
        id: 'l8-c2',
        sentence: 'Every day, it rains.',
        expected: 'For two hours, it has been raining.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      }
    ]
  },
  {
    levelNumber: 9,
    timeExpression: 'By Tomorrow',
    explanation: 'By Tomorrow is used to refer to actions that will be completed by a specific point in the future, using the future perfect tense.',
    examples: [
      'By tomorrow, I will have finished this project.',
      'By tomorrow, they will have arrived in Delhi.',
      'By tomorrow, he will have cleared all his doubts.'
    ],
    challenges: [
      {
        id: 'l9-c1',
        sentence: 'Every day, I read the whole book.',
        expected: 'By tomorrow, I will have read the whole book.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      },
      {
        id: 'l9-c2',
        sentence: 'Every day, she submits her application.',
        expected: 'By tomorrow, she will have submitted her application.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      }
    ]
  },
  {
    levelNumber: 10,
    timeExpression: 'Before You Said',
    explanation: 'Before You Said is used to talk about actions completed before another past action, using the past perfect tense.',
    examples: [
      'Before you said, I had already done the work.',
      'Before you said, she had left the room.',
      'Before you said, they had finished the game.'
    ],
    challenges: [
      {
        id: 'l10-c1',
        sentence: 'Every day, I write the email.',
        expected: 'Before you said, I had written the email.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      },
      {
        id: 'l10-c2',
        sentence: 'Every day, he packs his bags.',
        expected: 'Before you said, he had packed his bags.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      }
    ]
  },
  {
    levelNumber: 11,
    timeExpression: 'If You Had Asked Me',
    explanation: 'If You Had Asked Me is used to express hypothetical past actions and outcomes, using the third conditional tense structure (past perfect + would have + past participle).',
    examples: [
      'If you had asked me, I would have helped you.',
      'If you had asked me, I would have told you the truth.',
      'If you had asked me, we would have gone to the party.'
    ],
    challenges: [
      {
        id: 'l11-c1',
        sentence: 'Every day, I join the meeting.',
        expected: 'If you had asked me, I would have joined the meeting.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      },
      {
        id: 'l11-c2',
        sentence: 'Every day, she makes a decision.',
        expected: 'If you had asked me, she would have made a decision.',
        instruction: 'Speak the sentence using the time expression at the beginning.'
      }
    ]
  }
];
