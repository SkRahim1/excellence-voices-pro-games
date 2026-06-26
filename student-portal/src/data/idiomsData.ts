export interface Idiom {
  id: string;
  phrase: string;
  meaning: string;
  example: string;
}

export interface IdiomLevel {
  levelNumber: number;
  title: string;
  idioms: Idiom[];
}

export const idiomLevels: IdiomLevel[] = [
  {
    levelNumber: 1,
    title: 'Everyday Essentials 1',
    idioms: [
      {
        id: 'l1-1',
        phrase: 'Break the ice',
        meaning: 'Start a conversation or make people feel comfortable.',
        example: 'He told a funny joke to break the ice at the new school.'
      },
      {
        id: 'l1-2',
        phrase: 'Piece of cake',
        meaning: 'Something very easy to do.',
        example: 'Do not worry about the math test; it is a piece of cake!'
      },
      {
        id: 'l1-3',
        phrase: 'Hit the books',
        meaning: 'Study hard.',
        example: 'I have an exam tomorrow, so I need to hit the books tonight.'
      },
      {
        id: 'l1-4',
        phrase: 'Once in a blue moon',
        meaning: 'Something that happens very rarely.',
        example: 'My uncle lives in Canada, so we only see him once in a blue moon.'
      },
      {
        id: 'l1-5',
        phrase: 'Under the weather',
        meaning: 'Feeling sick or unwell.',
        example: 'Sarah stayed home from school today because she was feeling under the weather.'
      }
    ]
  },
  {
    levelNumber: 2,
    title: 'Everyday Essentials 2',
    idioms: [
      {
        id: 'l2-1',
        phrase: 'Bite the bullet',
        meaning: 'Face a difficult situation with courage.',
        example: 'I decided to bite the bullet and go to the dentist to fix my toothache.'
      },
      {
        id: 'l2-2',
        phrase: 'Spill the beans',
        meaning: 'Reveal a secret.',
        example: 'We were planning a surprise party, but my brother spilled the beans.'
      },
      {
        id: 'l2-3',
        phrase: 'Cost an arm and a leg',
        meaning: 'Very expensive.',
        example: 'Buying the new smartphone is going to cost an arm and a leg.'
      },
      {
        id: 'l2-4',
        phrase: 'Let the cat out of the bag',
        meaning: 'Accidentally reveal a secret.',
        example: 'He let the cat out of the bag when he mentioned the secret plan.'
      },
      {
        id: 'l2-5',
        phrase: 'Add insult to injury',
        meaning: 'Make a bad situation worse.',
        example: 'My car broke down in the rain, and to add insult to injury, I lost my umbrella.'
      }
    ]
  },
  {
    levelNumber: 3,
    title: 'Action & Effort',
    idioms: [
      {
        id: 'l3-1',
        phrase: 'Burn the midnight oil',
        meaning: 'Work or study late into the night.',
        example: 'She burned the midnight oil to prepare for her science presentation.'
      },
      {
        id: 'l3-2',
        phrase: 'Go the extra mile',
        meaning: 'Make a special effort to achieve something.',
        example: 'The teacher went the extra mile to explain the grammar rule to the students.'
      },
      {
        id: 'l3-3',
        phrase: 'Hit the nail on the head',
        meaning: 'Describe exactly what is causing a situation.',
        example: 'Your answer is exactly right; you hit the nail on the head!'
      },
      {
        id: 'l3-4',
        phrase: 'Call it a day',
        meaning: 'Stop working on something for the rest of the day.',
        example: 'We have been packing boxes for hours; let us call it a day.'
      },
      {
        id: 'l3-5',
        phrase: 'Pull someone\'s leg',
        meaning: 'Play a joke on someone by telling them something untrue.',
        example: 'Don\'t worry, I am not moving to another country; I was just pulling your leg!'
      }
    ]
  },
  {
    levelNumber: 4,
    title: 'Feelings & Situations',
    idioms: [
      {
        id: 'l4-1',
        phrase: 'Feeling blue',
        meaning: 'Feeling sad or depressed.',
        example: 'I was feeling blue when my best friend moved away.'
      },
      {
        id: 'l4-2',
        phrase: 'On cloud nine',
        meaning: 'Extremely happy and excited.',
        example: 'He was on cloud nine when he won the first prize in spelling bee.'
      },
      {
        id: 'l4-3',
        phrase: 'See eye to eye',
        meaning: 'Agree fully with someone.',
        example: 'My sister and I do not always see eye to eye, but we love each other.'
      },
      {
        id: 'l4-4',
        phrase: 'At the eleventh hour',
        meaning: 'At the last possible moment.',
        example: 'She completed her homework assignment at the eleventh hour.'
      },
      {
        id: 'l4-5',
        phrase: 'Face the music',
        meaning: 'Accept the unpleasant consequences of one\'s actions.',
        example: 'After breaking the window, he had to go home and face the music.'
      }
    ]
  },
  {
    levelNumber: 5,
    title: 'Communication & Advice',
    idioms: [
      {
        id: 'l5-1',
        phrase: 'Beat around the bush',
        meaning: 'Avoid talking about the main topic.',
        example: 'Stop beating around the bush and tell me what actually happened.'
      },
      {
        id: 'l5-2',
        phrase: 'Break a leg',
        meaning: 'A way to wish good luck (especially to performers).',
        example: 'As she went on stage to speak, her friend whispered, "Break a leg!"'
      },
      {
        id: 'l5-3',
        phrase: 'Keep your chin up',
        meaning: 'Remain cheerful in a difficult situation.',
        example: 'Keep your chin up! You will do much better in the next football match.'
      },
      {
        id: 'l5-4',
        phrase: 'Take it with a grain of salt',
        meaning: 'Do not completely believe something.',
        example: 'His stories are always exaggerated, so take them with a grain of salt.'
      },
      {
        id: 'l5-5',
        phrase: 'Straight from the horse\'s mouth',
        meaning: 'From a reliable, direct source.',
        example: 'I know the holiday starts tomorrow; I heard it straight from the horse\'s mouth.'
      }
    ]
  },
  {
    levelNumber: 6,
    title: 'Time & Efficiency',
    idioms: [
      {
        id: 'l6-1',
        phrase: 'Time flies',
        meaning: 'Time passes very quickly.',
        example: 'Time flies when you are having fun playing video games!'
      },
      {
        id: 'l6-2',
        phrase: 'In the nick of time',
        meaning: 'Just at the last moment before it\'s too late.',
        example: 'They arrived at the airport in the nick of time to catch the flight.'
      },
      {
        id: 'l6-3',
        phrase: 'Kill two birds with one stone',
        meaning: 'Achieve two things with a single action.',
        example: 'By cycling to school, I save money and get exercise, killing two birds with one stone.'
      },
      {
        id: 'l6-4',
        phrase: 'Cry over spilled milk',
        meaning: 'Worry about past mistakes that cannot be changed.',
        example: 'You lost the pencil, but there is no use crying over spilled milk; we can buy a new one.'
      },
      {
        id: 'l6-5',
        phrase: 'Curiosity killed the cat',
        meaning: 'Being too inquisitive can lead to trouble.',
        example: 'Do not open that drawer; remember that curiosity killed the cat!'
      }
    ]
  },
  {
    levelNumber: 7,
    title: 'Decisions & Hard Work',
    idioms: [
      {
        id: 'l7-1',
        phrase: 'Take the bull by the horns',
        meaning: 'Deal with a difficult situation directly and courageously.',
        example: 'Instead of waiting, he took the bull by the horns and talked to his boss.'
      },
      {
        id: 'l7-2',
        phrase: 'Cut corners',
        meaning: 'Do something in the easiest, cheapest, or fastest way (often sacrificing quality).',
        example: 'They cut corners during the building construction, and now the roof leaks.'
      },
      {
        id: 'l7-3',
        phrase: 'Cross that bridge when you come to it',
        meaning: 'Deal with a problem only when it actually arises.',
        example: 'We might fail the test, but let us cross that bridge when we come to it.'
      },
      {
        id: 'l7-4',
        phrase: 'Blessing in disguise',
        meaning: 'Something bad that turns out to have good results.',
        example: 'Losing that job was a blessing in disguise because she found a much better one.'
      },
      {
        id: 'l7-5',
        phrase: 'Miss the boat',
        meaning: 'Lose an opportunity by being too slow.',
        example: 'Apply for the summer camp today, or you will miss the boat.'
      }
    ]
  },
  {
    levelNumber: 8,
    title: 'Social & Relationships',
    idioms: [
      {
        id: 'l8-1',
        phrase: 'Speak of the devil',
        meaning: 'The person you were just talking about arrives.',
        example: 'We were just talking about Tom, and speak of the devil, there he walks in!'
      },
      {
        id: 'l8-2',
        phrase: 'Barking up the wrong tree',
        meaning: 'Following the wrong line of thought or accusing the wrong person.',
        example: 'If you think I took your bag, you are barking up the wrong tree.'
      },
      {
        id: 'l8-3',
        phrase: 'Burn bridges',
        meaning: 'Destroy relationships or paths so you cannot return.',
        example: 'Never be rude when leaving a job; you do not want to burn bridges.'
      },
      {
        id: 'l8-4',
        phrase: 'Birds of a feather flock together',
        meaning: 'People of similar character spend time together.',
        example: 'The studious children always study in a group; birds of a feather flock together.'
      },
      {
        id: 'l8-5',
        phrase: 'Show someone the ropes',
        meaning: 'Teach someone how to do a job or task.',
        example: 'On my first day at work, the supervisor showed me the ropes.'
      }
    ]
  },
  {
    levelNumber: 9,
    title: 'Mind & Intelligence',
    idioms: [
      {
        id: 'l9-1',
        phrase: 'Ring a bell',
        meaning: 'Sound familiar, though you can\'t remember details.',
        example: 'His face rings a bell, but I cannot remember where I met him.'
      },
      {
        id: 'l9-2',
        phrase: 'Lose your touch',
        meaning: 'Lose an ability you once had.',
        example: 'He used to be a great chess player, but he has lost his touch.'
      },
      {
        id: 'l9-3',
        phrase: 'On the ball',
        meaning: 'Alert, active, and quick to understand things.',
        example: 'She is really on the ball and answers every question instantly.'
      },
      {
        id: 'l9-4',
        phrase: 'By the book',
        meaning: 'Strictly following rules and procedures.',
        example: 'The inspector did everything by the book to ensure the test was fair.'
      },
      {
        id: 'l9-5',
        phrase: 'Get your act together',
        meaning: 'Organize yourself and start performing better.',
        example: 'You need to get your act together if you want to pass this exam.'
      }
    ]
  },
  {
    levelNumber: 10,
    title: 'Advanced & Expressive',
    idioms: [
      {
        id: 'l10-1',
        phrase: 'A penny for your thoughts',
        meaning: 'Ask someone what they are thinking about.',
        example: 'You have been quiet for a long time. A penny for your thoughts?'
      },
      {
        id: 'l10-2',
        phrase: 'Through thick and thin',
        meaning: 'Through good times and bad times.',
        example: 'True friends stand by you through thick and thin.'
      },
      {
        id: 'l10-3',
        phrase: 'Leave no stone unturned',
        meaning: 'Try every possible way to achieve something.',
        example: 'The police left no stone unturned in searching for the missing child.'
      },
      {
        id: 'l10-4',
        phrase: 'Take the wind out of someone\'s sails',
        meaning: 'Make someone lose confidence or enthusiasm.',
        example: 'By proving his theory wrong, she took the wind out of his sails.'
      },
      {
        id: 'l10-5',
        phrase: 'Rain on someone\'s parade',
        meaning: 'Spoil someone\'s plans or excitement.',
        example: 'I hate to rain on your parade, but the outdoor concert has been cancelled.'
      }
    ]
  }
];
