export interface ModalStudyDeck {
  usecase: string;
  explanation: string;
  examples: string[]; // exactly 5 examples
}

export interface ModalQuizQuestion {
  scenario: string;
  quizDialogue: string;
  options: string[];
  answer: string;
  feedback: string;
}

export interface ModalLevel {
  level: number;
  modal: string;
  studyDecks: ModalStudyDeck[];
  quizQuestions: ModalQuizQuestion[];
}

export const MODAL_LEVELS: ModalLevel[] = [
  // LEVEL 1: CAN
  {
    level: 1,
    modal: "can",
    studyDecks: [
      {
        usecase: "Ability",
        explanation: "We use 'can' to talk about skills or things we are able to do in the present.",
        examples: [
          "I can run very fast.",
          "She can speak French fluently.",
          "He can play the acoustic guitar.",
          "Birds can fly high in the sky.",
          "My sister can solve Rubik's cubes in under a minute."
        ]
      },
      {
        usecase: "Informal Permission",
        explanation: "We use 'can' to ask for or give permission casually among friends, classmates, or siblings.",
        examples: [
          "Can I borrow your blue pen?",
          "Can I sit next to you on the bench?",
          "You can go home now if you are done.",
          "Can we watch television after finishing our homework?",
          "Can I borrow your cricket bat for the weekend?"
        ]
      },
      {
        usecase: "Informal Request & Offer",
        explanation: "We use 'can' to ask someone for help in a friendly way, or to offer our own help.",
        examples: [
          "Can you help me carry this box?",
          "Can you open the door for me, please?",
          "I can carry your heavy school bag if you want.",
          "Can you pass the salt shaker across the table?",
          "Can I help you wash the paintbrushes after class?"
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "Expressing confidence in a classmate's ability to speak multiple languages",
        quizDialogue: "Rohan ______ speak three languages fluently.",
        options: ["can", "must not", "should have", "might"],
        answer: "can",
        feedback: "'Can' is used to show Rohan's current ability to speak languages."
      },
      {
        scenario: "Asking a classmate if you can borrow their science textbook for a day",
        quizDialogue: "______ I borrow your science textbook for a day?",
        options: ["can", "had better", "ought to", "would have"],
        answer: "can",
        feedback: "'Can' is the informal choice for asking permission from friends."
      },
      {
        scenario: "Asking a classmate to open the door for you when your hands are full",
        quizDialogue: "______ you open the class door for me, Amit?",
        options: ["can", "shall", "must", "might"],
        answer: "can",
        feedback: "'Can' is used for casual requests when asking peers for help."
      },
      {
        scenario: "Offering to lend a spare pencil to a friend who doesn't have one",
        quizDialogue: "Don't worry, I ______ lend you a spare pencil.",
        options: ["can", "must not", "should", "could have"],
        answer: "can",
        feedback: "'Can' is used to make a helpful offer in a casual way."
      },
      {
        scenario: "Stating a possibility that grammar tests are easy if we practice",
        quizDialogue: "Grammar tests ______ be easy if you practice every day.",
        options: ["can", "should have", "must not", "would like to"],
        answer: "can",
        feedback: "'Can' is used to describe general truth or situations that are sometimes possible."
      }
    ]
  },

  // LEVEL 2: COULD
  {
    level: 2,
    modal: "could",
    studyDecks: [
      {
        usecase: "Past Ability",
        explanation: "We use 'could' to talk about skills or things we were able to do in the past, but might not do now.",
        examples: [
          "When I was in grade 3, I could write very neatly.",
          "She could read simple storybooks when she was only four.",
          "They could not run fast because of the slippery playground.",
          "My brother could swim across the lake when he lived in the village.",
          "Rohan could play the piano well before he stopped practicing."
        ]
      },
      {
        usecase: "Polite Request & Permission",
        explanation: "We use 'could' to ask for help or request permission in a polite, respectful way.",
        examples: [
          "Could you please explain this geography question to me?",
          "Could I use your laptop for a minute to submit my essay?",
          "Could you help me carry these heavy reference books?",
          "Could you repeat the sentence, teacher?",
          "Excuse me, could I leave the classroom early today?"
        ]
      },
      {
        usecase: "Gentle Possibility & Suggestion",
        explanation: "We use 'could' to make soft suggestions or state gentle possibilities that are not 100% certain.",
        examples: [
          "We could get a holiday if the heavy rain continues tomorrow.",
          "If you are bored, we could play a game of chess.",
          "The lost key could be inside the laboratory cupboard drawer.",
          "We could ask the librarian to help us search for this novel.",
          "You could try studying in the quiet room for better focus."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "Explaining that Amit was unable to solve a riddle yesterday",
        quizDialogue: "Last year, Amit ______ not solve this complex riddle.",
        options: ["could", "should", "will", "may"],
        answer: "could",
        feedback: "'Could' is the past form of 'can', showing past ability or lack thereof with 'not'."
      },
      {
        scenario: "Politely asking a stranger for directions to the science lab",
        quizDialogue: "______ you please show me the way to the science lab?",
        options: ["could", "must", "shall", "would rather"],
        answer: "could",
        feedback: "'Could you' is a very polite and standard way to make a request."
      },
      {
        scenario: "Politely asking a class teacher for permission to leave early",
        quizDialogue: "Excuse me teacher, ______ I leave the room early?",
        options: ["could", "will", "must", "used to"],
        answer: "could",
        feedback: "'Could I' is a polite way to ask a teacher or elder for permission."
      },
      {
        scenario: "Stating a possibility that a missing book is in the cupboard",
        quizDialogue: "The missing book ______ be in the class cupboard.",
        options: ["could", "shall", "ought to", "would have"],
        answer: "could",
        feedback: "'Could' indicates a weak present or future possibility, showing it's possible."
      },
      {
        scenario: "Suggesting studying together in the library to a confused friend",
        quizDialogue: "If you are confused, we ______ study together at the library.",
        options: ["could", "must", "had better", "should have"],
        answer: "could",
        feedback: "'Could' is perfect for offering open, gentle ideas or suggestions."
      }
    ]
  },

  // LEVEL 3: WILL
  {
    level: 3,
    modal: "will",
    studyDecks: [
      {
        usecase: "Future Plan & Prediction",
        explanation: "We use 'will' to talk about plans we have decided to do in the future, or to predict what will happen.",
        examples: [
          "I will join the debate club next month.",
          "It will rain tomorrow morning according to the news.",
          "Our school will build a new science lab next year.",
          "They will arrive at the train station by 5:00 PM.",
          "I think Sneha will win the first prize in drawing."
        ]
      },
      {
        usecase: "Promise",
        explanation: "We use 'will' to make promises to other people.",
        examples: [
          "I will help you study for the science test.",
          "I will not forget to bring your storybook tomorrow.",
          "We will be on time for the school assembly.",
          "I promise I will clean up the art room desk.",
          "I will study hard to score good marks."
        ]
      },
      {
        usecase: "Willingness & Offers",
        explanation: "We use 'will' when we decide to do something instantly, or when we offer to do something right now.",
        examples: [
          "The phone is ringing; I will answer it.",
          "I will carry those heavy display charts for you.",
          "The computer won't turn on, so I will call the tech support.",
          "Will you help me tidy the blackboard before recess?",
          "I will wash the paintbrushes for you."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "Declaring that the class is going on a field trip next Thursday",
        quizDialogue: "Our class ______ go on a field trip next Thursday.",
        options: ["will", "should", "must not", "need to"],
        answer: "will",
        feedback: "'Will' is used to make statements about scheduled or decided future plans."
      },
      {
        scenario: "Making a promise not to forget a classmate's book tomorrow",
        quizDialogue: "I promise I ______ not forget to bring your storybook.",
        options: ["will", "might", "shall", "could have"],
        answer: "will",
        feedback: "'Will' (or 'won't') is the primary modal verb used to express promises."
      },
      {
        scenario: "Offering instantly to carry display charts for a teacher",
        quizDialogue: "I ______ carry those charts for you, teacher.",
        options: ["will", "may", "might as well", "would have"],
        answer: "will",
        feedback: "'Will' is used for immediate decisions or offers made at the moment of speaking."
      },
      {
        scenario: "Predicting that Sneha will win the drawing competition",
        quizDialogue: "I think Sneha ______ win the first prize in drawing.",
        options: ["will", "should have", "must not", "need to"],
        answer: "will",
        feedback: "'Will' is used to make factual or highly confident future predictions."
      },
      {
        scenario: "Asking a classmate to close classroom windows before leaving",
        quizDialogue: "______ you close the classroom windows before you exit?",
        options: ["Will", "May", "Ought to", "Would like to"],
        answer: "will",
        feedback: "'Will you' makes a direct, friendly request to peers or close friends."
      }
    ]
  },

  // LEVEL 4: WOULD
  {
    level: 4,
    modal: "would",
    studyDecks: [
      {
        usecase: "Polite Request & Desire",
        explanation: "We use 'would' to ask for things very politely or to express what we want.",
        examples: [
          "I would like to drink a glass of water.",
          "I would love to participate in the school play.",
          "Would you please help me paste these labels on the map?",
          "Would you mind closing the classroom window?",
          "I would like to ask a question to the class speaker."
        ]
      },
      {
        usecase: "Preference",
        explanation: "We use 'would rather' to state a choice or preference between two activities.",
        examples: [
          "I would rather draw than paint today.",
          "Rohan would rather study math than science tonight.",
          "We would rather play chess than watch television.",
          "She would rather read a book in the quiet library.",
          "I would rather walk to the sports stadium than wait for the bus."
        ]
      },
      {
        usecase: "Imaginary Situation",
        explanation: "We use 'would' to describe what we would do in imaginary or hypothetical situations.",
        examples: [
          "If I won a lottery, I would buy a giant telescope.",
          "If I had wings, I would fly over the mountains.",
          "I would help you with the science project if I had free time.",
          "She would travel around the world if she had the chance.",
          "They would win the championship if they practiced every weekend."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "Expressing a polite desire to act in the school play",
        quizDialogue: "I ______ love to participate in the school play.",
        options: ["would", "shall", "must", "can"],
        answer: "would",
        feedback: "'Would like' or 'would love' is the polite equivalent of 'want'."
      },
      {
        scenario: "Stating Rohan's preference to study math over science tonight",
        quizDialogue: "Rohan ______ rather study math than science tonight.",
        options: ["would", "should", "must", "might"],
        answer: "would",
        feedback: "'Would rather' is a set expression used to declare a preference."
      },
      {
        scenario: "Politely asking a classmate to help paste labels on a geography map",
        quizDialogue: "______ you please help me paste these labels on the map?",
        options: ["would", "shall", "must not", "ought to"],
        answer: "would",
        feedback: "'Would you' or 'would you mind' is highly polite for making requests."
      },
      {
        scenario: "Speculating on what you would do if you had wings to fly",
        quizDialogue: "If I had wings, I ______ fly over the mountains.",
        options: ["would", "will", "may", "should have"],
        answer: "would",
        feedback: "'Would' is used in conditional sentences to talk about imaginary actions."
      },
      {
        scenario: "Describing a coordinator's refusal to open a door despite knocking",
        quizDialogue: "We knocked on the door, but the coordinator ______ not let us in.",
        options: ["would", "will", "may", "should"],
        answer: "would",
        feedback: "'Would not' shows that someone or something strongly refused to do something in the past."
      }
    ]
  },

  // LEVEL 5: SHALL
  {
    level: 5,
    modal: "shall",
    studyDecks: [
      {
        usecase: "Offer of Help & Suggestion",
        explanation: "We use 'shall' in questions to offer help or make suggestions to others politely.",
        examples: [
          "Shall I carry this heavy lunch tray for you?",
          "Shall we start our science project now?",
          "Shall we meet at the park at 5:00 PM to play cricket?",
          "Shall I turn on the classroom lights for you?",
          "Shall we take a quick break after finishing this chapter?"
        ]
      },
      {
        usecase: "Formal Future & Rules",
        explanation: "We use 'shall' in formal declarations, announcements, or strict rules.",
        examples: [
          "The winners shall receive their medals tomorrow morning.",
          "Our school shall announce the final exam dates next week.",
          "Candidates shall not use mobile phones during the test.",
          "All students shall follow the library guidelines.",
          "We shall overcome these grammar challenges soon."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "Offering to turn on the lights because it is dark outside",
        quizDialogue: "It looks dark outside; ______ I turn on the lights?",
        options: ["shall", "would rather", "need to", "could have"],
        answer: "shall",
        feedback: "'Shall I' is the polite way to offer help or assistance to others."
      },
      {
        scenario: "Suggesting to meet at the local park at 5:00 PM to play",
        quizDialogue: "______ we meet at the park at 5:00 PM to play?",
        options: ["shall", "would", "must", "might"],
        answer: "shall",
        feedback: "'Shall we' is used to make friendly suggestions for group actions."
      },
      {
        scenario: "Formally stating that the school will release exam dates next week",
        quizDialogue: "Our school ______ announce the exam dates next week.",
        options: ["shall", "would", "must", "might as well"],
        answer: "shall",
        feedback: "'Shall' is used in formal writing to express future events with certainty."
      },
      {
        scenario: "Stating a formal rule banning calculators during the test",
        quizDialogue: "Candidates ______ not use calculators during the test.",
        options: ["shall", "would", "may", "ought to"],
        answer: "shall",
        feedback: "'Shall' in rules represents a strict obligation or requirement."
      },
      {
        scenario: "Suggesting taking a short break after finishing a chapter",
        quizDialogue: "______ we take a quick break after this chapter?",
        options: ["shall", "would rather", "need", "could"],
        answer: "shall",
        feedback: "'Shall we' is used to pitch a cooperative activity to a group."
      }
    ]
  },

  // LEVEL 6: SHOULD
  {
    level: 6,
    modal: "should",
    studyDecks: [
      {
        usecase: "Advice & Recommendations",
        explanation: "We use 'should' to give friendly advice or recommend what is the best thing to do.",
        examples: [
          "You should eat healthy food to keep active during games.",
          "You should brush your teeth twice a day.",
          "He should study daily to get good grades.",
          "You should consult the school nurse if you feel sick.",
          "You should try reading this mystery story book."
        ]
      },
      {
        usecase: "Opinions & Expectations",
        explanation: "We use 'should' to express what we believe is right (opinions) or what we expect to happen (expectations).",
        examples: [
          "In my opinion, students should spend less time on screens.",
          "We should respect our class guidelines and keep desks clean.",
          "The school bus should be here in five minutes.",
          "Rohan practiced hard, so he should win the running race.",
          "I should have slept early last night; now I feel sleepy."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "Advising a classmate to eat healthy food for sports energy",
        quizDialogue: "You ______ eat healthy food to keep active during games.",
        options: ["should", "will", "must not", "might as well"],
        answer: "should",
        feedback: "'Should' is the standard modal used to offer friendly, constructive advice."
      },
      {
        scenario: "Expressing an opinion that students ought to use screens less",
        quizDialogue: "In my opinion, students ______ spend less time on screens.",
        options: ["should", "must", "will", "need to"],
        answer: "should",
        feedback: "'Should' is used to express subjective opinions and right choices."
      },
      {
        scenario: "Expecting Rohan to win a running race based on his hard practice",
        quizDialogue: "Rohan practiced hard, so he ______ win the running race.",
        options: ["should", "must not", "can't", "may as well"],
        answer: "should",
        feedback: "'Should' is used to state outcomes that we expect to happen naturally."
      },
      {
        scenario: "Regretting sleeping late last night because you feel tired now",
        quizDialogue: "I ______ have slept early last night; now I feel sleepy.",
        options: ["should", "will", "must", "could"],
        answer: "should",
        feedback: "'Should have' (or 'should' before a perfect infinitive) is used to express past regrets."
      },
      {
        scenario: "Recommending a friend with a cold to consult the school doctor",
        quizDialogue: "If you have a cold, you ______ consult the school doctor.",
        options: ["should", "will not", "must not", "would rather"],
        answer: "should",
        feedback: "'Should' is used to recommend or suggest courses of action."
      }
    ]
  },

  // LEVEL 7: MUST
  {
    level: 7,
    modal: "must",
    studyDecks: [
      {
        usecase: "Strict Rules & Obligations",
        explanation: "We use 'must' for rules we are obliged to follow, or when we feel an action is highly necessary.",
        examples: [
          "All drivers must stop their vehicles at the red light.",
          "You must wear a seatbelt in the car.",
          "I must study hard tonight for the final science exam.",
          "I must clean my room before my mother returns.",
          "All students must submit their signed permission slips before the trip."
        ]
      },
      {
        usecase: "Prohibition (Must Not)",
        explanation: "We use 'must not' to state that something is strictly forbidden or against the rules.",
        examples: [
          "You must not run in the school corridors.",
          "Students must not touch the chemistry lab beakers without a teacher.",
          "You must not make noise inside the reading room.",
          "We must not eat lunch in the computer room.",
          "You must not use calculators during the math test."
        ]
      },
      {
        usecase: "Logical Deduction",
        explanation: "We use 'must' when we are almost 100% sure about a fact based on evidence.",
        examples: [
          "Rohan is yawning; he must be tired.",
          "The playground is wet; it must have rained heavily.",
          "She won three medals; she must be very smart.",
          "Amit got a perfect score; he must have prepared well.",
          "The library light is on; the librarian must be inside."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "Stating a traffic rule requiring drivers to stop at red lights",
        quizDialogue: "All drivers ______ stop their vehicles at the red light.",
        options: ["must", "may", "can't", "should have"],
        answer: "must",
        feedback: "'Must' is used for official rules, laws, or strict requirements."
      },
      {
        scenario: "Stating the personal need to clean your room before parents return",
        quizDialogue: "I ______ clean my room before my mother returns.",
        options: ["must", "might", "can", "could have"],
        answer: "must",
        feedback: "'Must' shows a strong obligation originating from the speaker's own feelings."
      },
      {
        scenario: "Reminding students of a rule banning touching lab chemicals",
        quizDialogue: "Students ______ not touch the chemicals in the lab.",
        options: ["must", "don't have to", "could", "should have"],
        answer: "must",
        feedback: "'Must not' is used for strict prohibitions where actions are forbidden."
      },
      {
        scenario: "Concluding it rained heavily because the playground is wet",
        quizDialogue: "The playground is wet; it ______ have rained heavily.",
        options: ["must", "may", "can't", "should have"],
        answer: "must",
        feedback: "'Must' is used to draw logical conclusions when evidence makes us almost certain."
      },
      {
        scenario: "Concluding Amit prepared well because of a perfect test score",
        quizDialogue: "Amit got a perfect score; he ______ have prepared well.",
        options: ["must", "can't", "might as well", "should have"],
        answer: "must",
        feedback: "'Must have' indicates certainty about a completed past action based on current evidence."
      }
    ]
  },

  // LEVEL 8: MAY
  {
    level: 8,
    modal: "may",
    studyDecks: [
      {
        usecase: "Formal Permission",
        explanation: "We use 'may' to ask for or give permission in a formal and highly respectful way.",
        examples: [
          "May I enter the computer lab, ma'am?",
          "May I drink some water, teacher?",
          "You may leave the classroom now.",
          "May I ask a question about the assignment, sir?",
          "Students may check out three books from the library."
        ]
      },
      {
        usecase: "Possibility",
        explanation: "We use 'may' to talk about a good, realistic possibility of something happening.",
        examples: [
          "It may rain later as the sky is getting dark.",
          "She may join our science project team tomorrow.",
          "If the weather clears, our group may visit the zoo.",
          "The coordinator may call us for the debate trials.",
          "The science fair may be delayed due to construction work."
        ]
      },
      {
        usecase: "Wish & Hope",
        explanation: "We use 'may' to express formal wishes, blessings, or hopes for others.",
        examples: [
          "May you succeed in your final exams!",
          "May you have a wonderful birthday celebration today!",
          "May all your dreams come true in the future!",
          "May you recover quickly from the flu!",
          "May your team win the debate championship!"
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "Politely asking a supervisor to enter the computer lab room",
        quizDialogue: "______ I enter the computer lab, ma'am?",
        options: ["may", "will", "must not", "would rather"],
        answer: "may",
        feedback: "'May' is the most respectful and formal modal for asking permission."
      },
      {
        scenario: "Formally offering directions to a visitor seeking the principal's room",
        quizDialogue: "______ I help you find the principal's room, sir?",
        options: ["may", "will", "ought to", "would rather"],
        answer: "may",
        feedback: "'May I' is highly formal and polite when offering services to guests."
      },
      {
        scenario: "Stating a possibility that the group visits the zoo if weather clears",
        quizDialogue: "If the weather clears, our group ______ visit the zoo.",
        options: ["may", "will not", "must not", "would rather"],
        answer: "may",
        feedback: "'May' represents a realistic, moderate possibility of a future event."
      },
      {
        scenario: "Expressing a birthday wish for a friend's celebration",
        quizDialogue: "______ you have a wonderful birthday celebration today!",
        options: ["may", "will", "should", "might as well"],
        answer: "may",
        feedback: "'May' is used at the start of a sentence to express formal wishes and blessings."
      },
      {
        scenario: "Stating a rule that allows students to check out three books",
        quizDialogue: "Students ______ check out three books from the library.",
        options: ["may", "must not", "can't", "would rather"],
        answer: "may",
        feedback: "'May' is used to formally grant permission to perform an action."
      }
    ]
  },

  // LEVEL 9: MIGHT
  {
    level: 9,
    modal: "might",
    studyDecks: [
      {
        usecase: "Weak Possibility & Uncertain Plans",
        explanation: "We use 'might' to express a low or tentative possibility about future events or undecided plans.",
        examples: [
          "It might rain, but the sun is still shining bright.",
          "Rohan might come to play, but he is busy studying.",
          "My family might travel to the hills during summer holidays.",
          "The bus might be late due to traffic on the main road.",
          "We might get a surprise quiz in the english class today."
        ]
      },
      {
        usecase: "Suggestions & Deductions",
        explanation: "We use 'might' to make polite, non-pushy suggestions or low-certainty guesses.",
        examples: [
          "You might want to check this spelling again.",
          "If you have free time, you might enjoy this puzzle.",
          "He might be at home, but he didn't pick up the phone.",
          "I might have left my science notes in the art classroom.",
          "Since the shuttle bus is delayed, we might as well walk."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "Speculating on whether Rohan will play, knowing he is busy studying",
        quizDialogue: "Rohan ______ come to play, but he is busy studying.",
        options: ["might", "must", "won't", "need to"],
        answer: "might",
        feedback: "'Might' is used to express a low or tentative possibility."
      },
      {
        scenario: "Stating a tentative summer holiday plan to visit the hills",
        quizDialogue: "My family ______ travel to the hills during summer holidays.",
        options: ["might", "must", "shall", "ought to"],
        answer: "might",
        feedback: "'Might' describes plans that are possible but not yet decided."
      },
      {
        scenario: "Suggesting a puzzle to a friend with free time",
        quizDialogue: "If you have free time, you ______ enjoy this puzzle.",
        options: ["might", "would rather", "must not", "should have"],
        answer: "might",
        feedback: "'Might' offers a tentative suggestion, making it polite and non-demanding."
      },
      {
        scenario: "Guessing that you left your science notes in the art room",
        quizDialogue: "I ______ have left my science notes in the art room.",
        options: ["might", "must", "should", "would like to"],
        answer: "might",
        feedback: "'Might have' indicates that a past event was possible, though we are not sure."
      },
      {
        scenario: "Speculating why the bus is late, guessing it is in traffic",
        quizDialogue: "The bus is late; it ______ be stuck in traffic.",
        options: ["might", "must", "won't", "should"],
        answer: "might",
        feedback: "'Might' is used to make guesses about current situations with low confidence."
      }
    ]
  },

  // LEVEL 10: USED TO
  {
    level: 10,
    modal: "used to",
    studyDecks: [
      {
        usecase: "Past Habits and States",
        explanation: "We use 'used to' to talk about routines, hobbies, states, or habits that were true in the past but are no longer true today.",
        examples: [
          "I used to play with toy cars when I was young.",
          "There used to be a large banyan tree in our school yard.",
          "My father used to walk me to school every morning.",
          "I used to fear dogs, but now I have a puppy.",
          "Rohan used to play table tennis before joining soccer."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "Describing Sneha's transition from writing with pencils to pens",
        quizDialogue: "Sneha ______ write with a pencil, but now she uses a pen.",
        options: ["used to", "would rather", "may", "ought to"],
        answer: "used to",
        feedback: "'Used to' is used to contrast past habits with present behavior."
      },
      {
        scenario: "Describing a building's past function as a library before it became a lab",
        quizDialogue: "This building ______ be a library before it became a lab.",
        options: ["used to", "would rather", "may", "ought to"],
        answer: "used to",
        feedback: "'Used to' describes states or facts in the past that are no longer true."
      },
      {
        scenario: "Recalling how your family visited the lake house every summer",
        quizDialogue: "Our family ______ visit the lake house every summer.",
        options: ["used to", "would rather", "may", "ought to"],
        answer: "used to",
        feedback: "'Used to' is perfect for describing past routines and traditions."
      },
      {
        scenario: "Explaining how you overcame your fear of dogs and got a puppy",
        quizDialogue: "I ______ fear dogs, but now I have a puppy.",
        options: ["used to", "would rather", "may", "ought to"],
        answer: "used to",
        feedback: "'Used to' highlights a change in preferences or emotional states over time."
      },
      {
        scenario: "Stating Amit swam in the river when he lived in the village",
        quizDialogue: "Amit ______ swim in the river when he lived in the village.",
        options: ["used to", "would rather", "may", "ought to"],
        answer: "used to",
        feedback: "'Used to' describes sports or hobbies that were practiced in the past."
      }
    ]
  },

  // LEVEL 11: NEED TO
  {
    level: 11,
    modal: "need to",
    studyDecks: [
      {
        usecase: "Necessity and Requirements",
        explanation: "We use 'need to' to express personal necessities, functional requirements, or actions essential for success and health.",
        examples: [
          "I need to buy a blue ruler for my math geometry class.",
          "We need to submit our assignments by next Monday.",
          "You need to rest if you feel dizzy during sports practice.",
          "You need to practice spelling words daily to improve.",
          "We need to set up the presentation screen before class starts."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "Stating the need to borrow a calculator for a physics test",
        quizDialogue: "I ______ borrow a calculator for the physics test.",
        options: ["need to", "are not allowed to", "shall", "would have"],
        answer: "need to",
        feedback: "'Need to' expresses that an action is necessary to complete a task."
      },
      {
        scenario: "Stating the requirement to wear black shoes on sports day",
        quizDialogue: "All students ______ wear black shoes on sports day.",
        options: ["need to", "are not allowed to", "shall", "would have"],
        answer: "need to",
        feedback: "'Need to' indicates external requirements that must be met."
      },
      {
        scenario: "Advising a student who hurt their ankle to visit the nurse",
        quizDialogue: "If you hurt your ankle, you ______ visit the nurse.",
        options: ["need to", "are not allowed to", "shall", "would have"],
        answer: "need to",
        feedback: "'Need to' is used to express important actions for health and safety."
      },
      {
        scenario: "Advising someone to read more books to improve vocabulary",
        quizDialogue: "You ______ read more books to improve your English vocabulary.",
        options: ["need to", "are not allowed to", "shall", "would have"],
        answer: "need to",
        feedback: "'Need to' highlights a necessary focus area to achieve improvement."
      },
      {
        scenario: "Stating the need to pack lunch boxes before the bus arrives",
        quizDialogue: "We ______ pack our lunch boxes before the school bus arrives.",
        options: ["need to", "are not allowed to", "shall", "would have"],
        answer: "need to",
        feedback: "'Need to' is used to describe necessary preparatory actions."
      }
    ]
  }
];
