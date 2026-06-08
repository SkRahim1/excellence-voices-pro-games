export interface Distractor {
  word: string;
  feedback: string;
}

export interface Slide {
  prompt: string;
  jumbled: string[];
  correctOrder: string[];
  distractors: Distractor[];
}

export interface Level {
  timeExpression: string;
  simpleExplanation: string;
  examples: string[];
  slides: Slide[];
}

export const LEVELS: Level[] = [
  {
    timeExpression: "Everyday",
    simpleExplanation: "Use this to talk about things you do regularly, like daily habits or routines.",
    examples: [
      "Everyday, I practice English.",
      "I drink milk everyday.",
      "They play in the park everyday."
    ],
    slides: [
      {
        prompt: "Tell your friend: I study for one hour.",
        jumbled: ["I", "English.", "practice", "Everyday,", "studying"],
        correctOrder: ["Everyday,", "I", "practice", "English."],
        distractors: [
          {
            word: "studying",
            feedback: "We use 'practice' or 'study' for regular habits. 'studying' is only used for actions happening right now."
          }
        ]
      },
      {
        prompt: "Say that you eat fresh fruit.",
        jumbled: ["eat", "everyday.", "fruit", "I", "fresh", "eats"],
        correctOrder: ["I", "eat", "fresh", "fruit", "everyday."],
        distractors: [
          {
            word: "eats",
            feedback: "We say 'I eat', not 'I eats'. Add 's' to the verb only for singular people like he, she, or it."
          }
        ]
      },
      {
        prompt: "Say that you wake up early.",
        jumbled: ["Everyday,", "I", "wake up", "early.", "wakes"],
        correctOrder: ["Everyday,", "I", "wake up", "early."],
        distractors: [
          {
            word: "wakes",
            feedback: "Use 'wake up' for 'I'. We only use 'wakes' for singular nouns like he, she, or it."
          }
        ]
      },
      {
        prompt: "Say that your father goes to work.",
        jumbled: ["to work", "My father", "goes", "everyday.", "go"],
        correctOrder: ["My father", "goes", "to work", "everyday."],
        distractors: [
          {
            word: "go",
            feedback: "'My father' is singular, so we must use 'goes' instead of 'go'."
          }
        ]
      },
      {
        prompt: "Say that you help your mother.",
        jumbled: ["Everyday,", "help", "my mother.", "I", "helping"],
        correctOrder: ["Everyday,", "I", "help", "my mother."],
        distractors: [
          {
            word: "helping",
            feedback: "Use 'help' for regular actions. 'helping' requires an auxiliary helper verb like 'am'."
          }
        ]
      }
    ]
  },
  {
    timeExpression: "Tomorrow",
    simpleExplanation: "Use this to talk about your plans, promises, or things that will happen on the day after today.",
    examples: [
      "Tomorrow, I will speak English.",
      "I will meet my friend tomorrow.",
      "We will go to the market tomorrow."
    ],
    slides: [
      {
        prompt: "Say you will play cricket.",
        jumbled: ["will play", "Tomorrow,", "I", "cricket.", "played"],
        correctOrder: ["Tomorrow,", "I", "will play", "cricket."],
        distractors: [
          {
            word: "played",
            feedback: "'played' is in the past. To talk about plans for 'tomorrow', you must use 'will play'."
          }
        ]
      },
      {
        prompt: "Say you will buy a new book.",
        jumbled: ["buy", "a new book", "tomorrow.", "will", "I", "bought"],
        correctOrder: ["I", "will", "buy", "a new book", "tomorrow."],
        distractors: [
          {
            word: "bought",
            feedback: "'bought' is past tense. For future plans tomorrow, use 'will buy'."
          }
        ]
      },
      {
        prompt: "Say it will rain.",
        jumbled: ["Tomorrow,", "it", "rain.", "will", "raining"],
        correctOrder: ["Tomorrow,", "it", "will", "rain."],
        distractors: [
          {
            word: "raining",
            feedback: "'raining' is used for actions happening right now. For tomorrow, use 'will rain'."
          }
        ]
      },
      {
        prompt: "Say you will help your friend.",
        jumbled: ["help", "tomorrow.", "my friend", "I", "will", "helped"],
        correctOrder: ["I", "will", "help", "my friend", "tomorrow."],
        distractors: [
          {
            word: "helped",
            feedback: "'helped' is past tense. For plans tomorrow, use 'will help'."
          }
        ]
      },
      {
        prompt: "Say the school will be closed.",
        jumbled: ["the school", "Tomorrow,", "be closed.", "will", "was"],
        correctOrder: ["Tomorrow,", "the school", "will", "be closed."],
        distractors: [
          {
            word: "was",
            feedback: "'was' is past tense. For tomorrow's state, use 'will be'."
          }
        ]
      }
    ]
  },
  {
    timeExpression: "Yesterday",
    simpleExplanation: "Use this to talk about things that already happened and were completed on the day before today.",
    examples: [
      "Yesterday, I spoke English.",
      "I visited my grandmother yesterday.",
      "We watched a movie yesterday."
    ],
    slides: [
      {
        prompt: "Say you ate pizza.",
        jumbled: ["I", "ate", "pizza.", "Yesterday,", "eat"],
        correctOrder: ["Yesterday,", "I", "ate", "pizza."],
        distractors: [
          {
            word: "eat",
            feedback: "'eat' is present tense. Since it happened yesterday, use the past form 'ate'."
          }
        ]
      },
      {
        prompt: "Say you finished your homework.",
        jumbled: ["finished", "yesterday.", "my homework", "I", "finish"],
        correctOrder: ["I", "finished", "my homework", "yesterday."],
        distractors: [
          {
            word: "finish",
            feedback: "'finish' is present tense. For yesterday, use the past tense 'finished'."
          }
        ]
      },
      {
        prompt: "Say you bought a pen.",
        jumbled: ["bought", "Yesterday,", "I", "a pen.", "buy"],
        correctOrder: ["Yesterday,", "I", "bought", "a pen."],
        distractors: [
          {
            word: "buy",
            feedback: "'buy' is present tense. For yesterday, use the past tense 'bought'."
          }
        ]
      },
      {
        prompt: "Say you cleaned your room.",
        jumbled: ["yesterday.", "cleaned", "my room", "I", "clean"],
        correctOrder: ["I", "cleaned", "my room", "yesterday."],
        distractors: [
          {
            word: "clean",
            feedback: "'clean' is present tense. Use 'cleaned' for past actions yesterday."
          }
        ]
      },
      {
        prompt: "Say it rained.",
        jumbled: ["rained.", "it", "Yesterday,", "rains"],
        correctOrder: ["Yesterday,", "it", "rained."],
        distractors: [
          {
            word: "rains",
            feedback: "'rains' is present tense. Use the past form 'rained' for yesterday."
          }
        ]
      }
    ]
  },
  {
    timeExpression: "Now",
    simpleExplanation: "Use this to talk about actions that are in progress right now, at this exact moment.",
    examples: [
      "Now, I am speaking English.",
      "He is playing football now.",
      "We are learning grammar now."
    ],
    slides: [
      {
        prompt: "Say you are writing a letter.",
        jumbled: ["am writing", "Now,", "I", "a letter.", "write"],
        correctOrder: ["Now,", "I", "am", "writing", "a letter."],
        distractors: [
          {
            word: "write",
            feedback: "'write' is standard present. For continuous actions happening now, use 'am writing'."
          }
        ]
      },
      {
        prompt: "Say you are drinking juice.",
        jumbled: ["juice", "drinking", "now.", "I am", "drink"],
        correctOrder: ["I am", "drinking", "juice", "now."],
        distractors: [
          {
            word: "drink",
            feedback: "'drink' is simple present. To show you are doing it now, use 'am drinking'."
          }
        ]
      },
      {
        prompt: "Say the baby is sleeping.",
        jumbled: ["the baby", "Now,", "is sleeping.", "sleeps"],
        correctOrder: ["Now,", "the baby", "is sleeping."],
        distractors: [
          {
            word: "sleeps",
            feedback: "'sleeps' is used for daily habits. Use 'is sleeping' to show it is happening now."
          }
        ]
      },
      {
        prompt: "Say you are listening to music.",
        jumbled: ["now.", "listening", "to music", "I am", "listen"],
        correctOrder: ["I am", "listening", "to music", "now."],
        distractors: [
          {
            word: "listen",
            feedback: "'listen' is simple present. For active listening now, use 'am listening'."
          }
        ]
      },
      {
        prompt: "Say they are reading stories.",
        jumbled: ["they", "Now,", "are reading", "stories.", "reads"],
        correctOrder: ["Now,", "they", "are reading", "stories."],
        distractors: [
          {
            word: "reads",
            feedback: "'reads' is used for singular habits. For 'they' performing it now, use 'are reading'."
          }
        ]
      }
    ]
  },
  {
    timeExpression: "At 9 o’ clock yesterday",
    simpleExplanation: "Use this to talk about a continuous action that was in progress at a specific time in the past.",
    examples: [
      "At 9 o’ clock yesterday, I was attending my English class.",
      "I was sleeping at 9 o'clock yesterday.",
      "They were eating breakfast at 9 o'clock yesterday."
    ],
    slides: [
      {
        prompt: "Say you were doing your homework.",
        jumbled: ["doing", "At 9 o’ clock yesterday,", "was", "my homework.", "I", "did"],
        correctOrder: ["At 9 o’ clock yesterday,", "I", "was", "doing", "my homework."],
        distractors: [
          {
            word: "did",
            feedback: "'did' is for a finished past action. To show it was in progress at 9 o'clock, use 'was doing'."
          }
        ]
      },
      {
        prompt: "Say your mother was cooking.",
        jumbled: ["cooking", "My mother", "was", "at 9 o’ clock yesterday.", "cooked"],
        correctOrder: ["My mother", "was", "cooking", "at 9 o’ clock yesterday."],
        distractors: [
          {
            word: "cooked",
            feedback: "'cooked' is simple past. Use 'was cooking' for a continuous action in progress."
          }
        ]
      },
      {
        prompt: "Say you were travelling to school.",
        jumbled: ["I", "was", "travelling to school.", "At 9 o’ clock yesterday,", "travel"],
        correctOrder: ["At 9 o’ clock yesterday,", "I", "was", "travelling to school."],
        distractors: [
          {
            word: "travel",
            feedback: "'travel' is present tense. For a past continuous action, use 'was travelling'."
          }
        ]
      },
      {
        prompt: "Say your friends were playing football.",
        jumbled: ["football", "My friends", "were", "playing", "at 9 o’ clock yesterday.", "was"],
        correctOrder: ["My friends", "were", "playing", "football", "at 9 o’ clock yesterday."],
        distractors: [
          {
            word: "was",
            feedback: "'My friends' is plural, so we must use 'were' instead of 'was'."
          }
        ]
      },
      {
        prompt: "Say you were watching the news.",
        jumbled: ["was", "watching", "the news.", "I", "At 9 o’ clock yesterday,", "watch"],
        correctOrder: ["At 9 o’ clock yesterday,", "I", "was", "watching", "the news."],
        distractors: [
          {
            word: "watch",
            feedback: "'watch' is present. Use 'was watching' for a continuous past action."
          }
        ]
      }
    ]
  },
  {
    timeExpression: "At 9 o’ clock tomorrow",
    simpleExplanation: "Use this to talk about a continuous action that will be in progress at a specific time in the future.",
    examples: [
      "At 9 o’ clock tomorrow, I will be attending my English class.",
      "I will be flying to London at 9 o'clock tomorrow.",
      "They will be writing their exam at 9 o'clock tomorrow."
    ],
    slides: [
      {
        prompt: "Say you will be watching a movie.",
        jumbled: ["will be", "watching", "a movie.", "I", "At 9 o’ clock tomorrow,", "watched"],
        correctOrder: ["At 9 o’ clock tomorrow,", "I", "will be", "watching", "a movie."],
        distractors: [
          {
            word: "watched",
            feedback: "'watched' is past tense. For a future continuous plan, use 'will be watching'."
          }
        ]
      },
      {
        prompt: "Say your sister will be playing tennis.",
        jumbled: ["My sister", "will be", "playing", "tennis", "at 9 o’ clock tomorrow.", "played"],
        correctOrder: ["My sister", "will be", "playing", "tennis", "at 9 o’ clock tomorrow."],
        distractors: [
          {
            word: "played",
            feedback: "'played' is past. For a future continuous action, use 'will be playing'."
          }
        ]
      },
      {
        prompt: "Say you will be waiting at the airport.",
        jumbled: ["I", "will be", "waiting", "at the airport.", "At 9 o’ clock tomorrow,", "wait"],
        correctOrder: ["At 9 o’ clock tomorrow,", "I", "will be", "waiting", "at the airport."],
        distractors: [
          {
            word: "wait",
            feedback: "'wait' is present. For a future continuous action, use 'will be waiting'."
          }
        ]
      },
      {
        prompt: "Say they will be sleeping.",
        jumbled: ["They", "will be", "sleeping", "at 9 o’ clock tomorrow.", "slept"],
        correctOrder: ["They", "will be", "sleeping", "at 9 o’ clock tomorrow."],
        distractors: [
          {
            word: "slept",
            feedback: "'slept' is past tense. For a future continuous state, use 'will be sleeping'."
          }
        ]
      },
      {
        prompt: "Say you will be eating dinner.",
        jumbled: ["I", "will be", "eating", "dinner.", "At 9 o’ clock tomorrow,", "ate"],
        correctOrder: ["At 9 o’ clock tomorrow,", "I", "will be", "eating", "dinner."],
        distractors: [
          {
            word: "ate",
            feedback: "'ate' is past tense. For a future continuous action, use 'will be eating'."
          }
        ]
      }
    ]
  },
  {
    timeExpression: "Already",
    simpleExplanation: "Use this to talk about things that have already happened earlier than expected.",
    examples: [
      "Already, I have completed my homework.",
      "They have already left for the airport.",
      "She has already finished her lunch."
    ],
    slides: [
      {
        prompt: "Say you have read this book.",
        jumbled: ["completed", "have", "Already,", "I", "this book.", "had"],
        correctOrder: ["Already,", "I", "have", "completed", "this book."],
        distractors: [
          {
            word: "had",
            feedback: "'had' shows past perfect. For a completed action connected to now, use 'have completed'."
          }
        ]
      },
      {
        prompt: "Say they have cleaned the classroom.",
        jumbled: ["They", "already", "cleaned", "the classroom.", "have", "has"],
        correctOrder: ["They", "have", "already", "cleaned", "the classroom."],
        distractors: [
          {
            word: "has",
            feedback: "'They' is plural, so we must use 'have' instead of 'has'."
          }
        ]
      },
      {
        prompt: "Say you have seen this movie.",
        jumbled: ["Already,", "I", "have", "seen", "this movie.", "saw"],
        correctOrder: ["Already,", "I", "have", "seen", "this movie."],
        distractors: [
          {
            word: "saw",
            feedback: "'saw' is simple past. We must use the past participle form 'seen' after 'have'."
          }
        ]
      },
      {
        prompt: "Say your father has arrived home.",
        jumbled: ["My father", "already", "arrived home.", "has", "have"],
        correctOrder: ["My father", "has", "already", "arrived home."],
        distractors: [
          {
            word: "have",
            feedback: "'My father' is singular, so we must use 'has' instead of 'have'."
          }
        ]
      },
      {
        prompt: "Say you have paid the bills.",
        jumbled: ["Already,", "I", "have", "paid", "the bills.", "pay"],
        correctOrder: ["Already,", "I", "have", "paid", "the bills."],
        distractors: [
          {
            word: "pay",
            feedback: "'pay' is present. We must use the participle form 'paid' after 'have'."
          }
        ]
      }
    ]
  },
  {
    timeExpression: "For 2 hours",
    simpleExplanation: "Use this to show how long you have been doing an action that started in the past and is still going on.",
    examples: [
      "For 2 hours, I have been studying English.",
      "She has been waiting for 2 hours.",
      "They have been playing cricket for 2 hours."
    ],
    slides: [
      {
        prompt: "Say you have been writing a story.",
        jumbled: ["have been", "writing", "a story.", "For 2 hours,", "I", "was"],
        correctOrder: ["For 2 hours,", "I", "have been", "writing", "a story."],
        distractors: [
          {
            word: "was",
            feedback: "'was' is for past progress. To show it started in the past and is still continuing, use 'have been writing'."
          }
        ]
      },
      {
        prompt: "Say your friend has been sleeping.",
        jumbled: ["My friend", "has been", "sleeping", "for 2 hours.", "have"],
        correctOrder: ["My friend", "has been", "sleeping", "for 2 hours."],
        distractors: [
          {
            word: "have",
            feedback: "'My friend' is singular, so we must use 'has' instead of 'have'."
          }
        ]
      },
      {
        prompt: "Say it has been raining.",
        jumbled: ["raining.", "has been", "it", "For 2 hours,", "was"],
        correctOrder: ["For 2 hours,", "it", "has been", "raining."],
        distractors: [
          {
            word: "was",
            feedback: "'was' is for past progress. To show duration up to now, use 'has been'."
          }
        ]
      },
      {
        prompt: "Say they have been watching television.",
        jumbled: ["They", "have been", "watching", "television", "for 2 hours.", "has"],
        correctOrder: ["They", "have been", "watching", "television", "for 2 hours."],
        distractors: [
          {
            word: "has",
            feedback: "'They' is plural, so we must use 'have' instead of 'has'."
          }
        ]
      },
      {
        prompt: "Say you have been working on this puzzle.",
        jumbled: ["have been", "working", "on this puzzle.", "For 2 hours,", "I", "work"],
        correctOrder: ["For 2 hours,", "I", "have been", "working", "on this puzzle."],
        distractors: [
          {
            word: "work",
            feedback: "'work' is simple present. To show duration, use 'have been working'."
          }
        ]
      }
    ]
  },
  {
    timeExpression: "By tomorrow",
    simpleExplanation: "Use this to talk about things that will be finished before a specific deadline tomorrow.",
    examples: [
      "By tomorrow, I will have finished this chapter.",
      "They will have reached Delhi by tomorrow.",
      "She will have completed the project by tomorrow."
    ],
    slides: [
      {
        prompt: "Say you will have read this novel.",
        jumbled: ["will have", "read", "this novel.", "By tomorrow,", "I", "readed"],
        correctOrder: ["By tomorrow,", "I", "will have", "read", "this novel."],
        distractors: [
          {
            word: "readed",
            feedback: "'readed' is not a valid word. The past participle of 'read' is spelled 'read'."
          }
        ]
      },
      {
        prompt: "Say they will have repaired the road.",
        jumbled: ["They", "will have", "repaired", "the road", "by tomorrow.", "repairing"],
        correctOrder: ["They", "will have", "repaired", "the road", "by tomorrow."],
        distractors: [
          {
            word: "repairing",
            feedback: "'repairing' shows continuous progress. For completion by a future deadline, use 'will have repaired'."
          }
        ]
      },
      {
        prompt: "Say you will have submitted the assignment.",
        jumbled: ["will have", "submitted", "the assignment.", "By tomorrow,", "I", "submit"],
        correctOrder: ["By tomorrow,", "I", "will have", "submitted", "the assignment."],
        distractors: [
          {
            word: "submit",
            feedback: "'submit' is present. For a future completed action, use 'will have submitted'."
          }
        ]
      },
      {
        prompt: "Say your mother will have prepared the food.",
        jumbled: ["My mother", "will have", "prepared", "the food", "by tomorrow.", "preparing"],
        correctOrder: ["My mother", "will have", "prepared", "the food", "by tomorrow."],
        distractors: [
          {
            word: "preparing",
            feedback: "'preparing' shows progress. To express completion by a tomorrow deadline, use 'will have prepared'."
          }
        ]
      },
      {
        prompt: "Say they will have built the house.",
        jumbled: ["By tomorrow,", "they", "will have", "built", "the house.", "build"],
        correctOrder: ["By tomorrow,", "they", "will have", "built", "the house."],
        distractors: [
          {
            word: "build",
            feedback: "'build' is present. We must use the past participle 'built' after 'will have'."
          }
        ]
      }
    ]
  },
  {
    timeExpression: "Before you said",
    simpleExplanation: "Use this to show that you finished an action in the past before another past action occurred.",
    examples: [
      "Before you said, I had completed my work.",
      "We had reached the station before the train started.",
      "She had cooked dinner before they arrived."
    ],
    slides: [
      {
        prompt: "Say you had finished your lunch before they arrived.",
        jumbled: ["Before they arrived,", "I", "had", "finished", "my lunch.", "have"],
        correctOrder: ["Before they arrived,", "I", "had", "finished", "my lunch."],
        distractors: [
          {
            word: "have",
            feedback: "'have' is present. To show an action completed before another past event, use 'had finished'."
          }
        ]
      },
      {
        prompt: "Say you had closed the windows before it started raining.",
        jumbled: ["I", "had", "closed", "the windows", "before it started raining.", "close"],
        correctOrder: ["I", "had", "closed", "the windows", "before it started raining."],
        distractors: [
          {
            word: "close",
            feedback: "'close' is present. To show it was completed before it rained, use 'had closed'."
          }
        ]
      },
      {
        prompt: "Say they had left the house before the police arrived.",
        jumbled: ["Before the police arrived,", "they", "had", "left", "the house.", "leaving"],
        correctOrder: ["Before the police arrived,", "they", "had", "left", "the house."],
        distractors: [
          {
            word: "leaving",
            feedback: "'leaving' is continuous. To show completion before a past action, use 'had left'."
          }
        ]
      },
      {
        prompt: "Say you had met the teacher before she went home.",
        jumbled: ["I", "had", "met", "the teacher", "before she went home.", "meet"],
        correctOrder: ["I", "had", "met", "the teacher", "before she went home."],
        distractors: [
          {
            word: "meet",
            feedback: "'meet' is present. We must use the past perfect participle 'had met'."
          }
        ]
      },
      {
        prompt: "Say the guests had arrived before the party started.",
        jumbled: ["Before the party started,", "the guests", "had", "arrived.", "arriving"],
        correctOrder: ["Before the party started,", "the guests", "had", "arrived."],
        distractors: [
          {
            word: "arriving",
            feedback: "'arriving' is continuous. To show completion before the party started, use 'had arrived'."
          }
        ]
      }
    ]
  },
  {
    timeExpression: "If you had asked me",
    simpleExplanation: "Use this to talk about imaginary past situations—things you would have done if something else had happened.",
    examples: [
      "If you had asked me, I would have helped you.",
      "If they had run fast, they would have won the race.",
      "If she had studied hard, she would have passed the exam."
    ],
    slides: [
      {
        prompt: "Say you would have come to the party if they had invited you.",
        jumbled: ["If they had invited me,", "I", "would have", "come.", "will"],
        correctOrder: ["If they had invited me,", "I", "would have", "come."],
        distractors: [
          {
            word: "will",
            feedback: "'will' is for real future. For an imaginary past outcome, use 'would have come'."
          }
        ]
      },
      {
        prompt: "Say you would have bought that car if you had enough money.",
        jumbled: ["If I had enough money,", "I", "would have", "bought", "it.", "buy"],
        correctOrder: ["If I had enough money,", "I", "would have", "bought", "it."],
        distractors: [
          {
            word: "buy",
            feedback: "'buy' is present. For an imaginary past result, use 'would have bought'."
          }
        ]
      },
      {
        prompt: "Say they would have caught the bus if they had left early.",
        jumbled: ["If they had left early,", "they", "would have", "caught", "the bus.", "catch"],
        correctOrder: ["If they had left early,", "they", "would have", "caught", "the bus."],
        distractors: [
          {
            word: "catch",
            feedback: "'catch' is present. We must use 'would have caught' for hypothetical pasts."
          }
        ]
      },
      {
        prompt: "Say you would have played if it had not rained.",
        jumbled: ["If it had not rained,", "I", "would have", "played.", "play"],
        correctOrder: ["If it had not rained,", "I", "would have", "played."],
        distractors: [
          {
            word: "play",
            feedback: "'play' is present. For an imaginary past outcome, use 'would have played'."
          }
        ]
      },
      {
        prompt: "Say she would have finished early if you had assisted her.",
        jumbled: ["If you had assisted her,", "she", "would have", "finished", "early.", "finish"],
        correctOrder: ["If you had assisted her,", "she", "would have", "finished", "early."],
        distractors: [
          {
            word: "finish",
            feedback: "'finish' is present. We must use the participle form 'finished' after 'would have'."
          }
        ]
      }
    ]
  }
];
