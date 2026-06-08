export interface YesNoStudyCard {
  usecase: string;
  explanation: string;
  examples: string[];
}

export interface YesNoQuizQuestion {
  scenario: string;
  quizDialogue: string; // Must contain "______"
  options: string[];
  answer: string;
  feedback: string;
}

export interface YesNoLevel {
  level: number;
  modal: string;
  focus: string;
  studyDecks: YesNoStudyCard[];
  quizQuestions: YesNoQuizQuestion[];
}

export const WHAT_YES_OR_NO_LEVELS: YesNoLevel[] = [
  {
    level: 0,
    modal: "can",
    focus: "Can - Present Ability (now, today, currently)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask about present ability, start the question with the modal verb 'Can', followed by the subject, the action verb, and a present timeword (like 'now' or 'today').",
        examples: [
          "Can you carry this bag now? -> (Question Structure)",
          "Can they finish the work today? -> (Question Structure)",
          "Can she write the letter today? -> (Question Structure)",
          "Can this printer scan documents currently? -> (Question Structure)",
          "Can your phone connect to the Wi-Fi now? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To give a complete positive answer, start with 'Yes', followed by the subject, the helper 'can', and repeat the full action verb and timeword.",
        examples: [
          "Can you carry this bag now? -> Yes, I can carry this bag now.",
          "Can they finish the work today? -> Yes, they can finish the work today.",
          "Can she write the letter today? -> Yes, she can write the letter today.",
          "Can this printer scan documents currently? -> Yes, this printer can scan documents currently.",
          "Can your phone connect to the Wi-Fi now? -> Yes, my phone can connect to the Wi-Fi now."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To give a complete negative answer, start with 'No', followed by the subject, the negative helper 'cannot' (or contracted 'can't'), and repeat the action.",
        examples: [
          "Can you carry this bag now? -> No, I cannot carry this bag now.",
          "Can they finish the work today? -> No, they cannot finish the work today.",
          "Can she write the letter today? -> No, she cannot write the letter today.",
          "Can this printer scan documents currently? -> No, this printer cannot scan documents currently.",
          "Can your phone connect to the Wi-Fi now? -> No, my phone cannot connect to the Wi-Fi now."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to know if your friend has the strength and time to lift a heavy table at this moment.",
        quizDialogue: "______ you help me move this table now? -> Yes, I can help you move this table now.",
        options: ["Could have", "Can", "Must", "Might"],
        answer: "Can",
        feedback: "We use 'Can' to ask about present ability or availability combined with the present timeword 'now'."
      },
      {
        scenario: "A colleague wants to confirm if they are allowed to submit the project today.",
        quizDialogue: "Can we submit the report today? -> Yes, we ______ submit the report today.",
        options: ["mustn't", "can't", "could", "can"],
        answer: "can",
        feedback: "The question starts with 'Can we', so the positive short response is expanded to: 'Yes, we can submit the report today'."
      },
      {
        scenario: "You are checking if a phone is working and connected to the internet currently.",
        quizDialogue: "Can your phone load the website currently? -> No, it ______ load the website currently.",
        options: ["can't", "couldn't", "won't", "mustn't"],
        answer: "can't",
        feedback: "For a negative answer to a 'Can' question, use the negative contracted modal 'can't' followed by the rest of the action."
      },
      {
        scenario: "You ask your teacher if she has time to discuss your grades right now.",
        quizDialogue: "______ you talk to me about my grade now? -> No, I cannot talk to you now because I am busy.",
        options: ["Should have", "Would", "Can", "Used to"],
        answer: "Can",
        feedback: "Present availability uses 'Can' coupled with the timeword 'now' and completed with a full negative response."
      },
      {
        scenario: "Asking if a software tool has the feature to translate languages currently.",
        quizDialogue: "Can this software translate Spanish currently? -> Yes, it ______ translate Spanish currently.",
        options: ["can", "will", "may", "could"],
        answer: "can",
        feedback: "The subject 'this software' is singular ('it'), and the response echoes the question's modal to make a complete sentence: 'Yes, it can translate Spanish currently'."
      }
    ]
  },
  {
    level: 1,
    modal: "can",
    focus: "Can - Present Permission & Offers (now, today)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask for permission or offer assistance, start the question with 'Can I' or 'Can we', followed by the verb and present timewords like 'now' or 'today'.",
        examples: [
          "Can I sit in this chair now? -> (Question Structure)",
          "Can we park the car here today? -> (Question Structure)",
          "Can I help you with those boxes now? -> (Question Structure)",
          "Can I get you a glass of water now? -> (Question Structure)",
          "Can we clean the table for you today? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To grant permission or accept help in a complete sentence, reply with 'Yes', followed by the correct pronouns, modal 'can', and the action.",
        examples: [
          "Can I sit in this chair now? -> Yes, you can sit in this chair now.",
          "Can I help you with those boxes now? -> Yes, you can help me with those boxes now.",
          "Can I get you a glass of water now? -> Yes, you can get me a glass of water now.",
          "Can I take this book today? -> Yes, you can take this book today.",
          "Can we eat lunch inside now? -> Yes, you can eat lunch inside now."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To refuse permission or decline help, start with 'No', followed by the subject pronoun, the negative modal 'cannot' (or 'can't'), and the rest of the sentence.",
        examples: [
          "Can I sit in this chair now? -> No, you cannot sit in this chair now.",
          "Can we park the car here today? -> No, you cannot park the car here today.",
          "Can we leave early today? -> No, you cannot leave early today.",
          "Can I open the window now? -> No, you cannot open the window now.",
          "Can we use the gym today? -> No, you cannot use the gym today."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask your classmate for permission to borrow their pencil for today's class.",
        quizDialogue: "______ I borrow your pencil today? -> Yes, you can borrow my pencil today.",
        options: ["Can", "Would", "Used to", "Should have"],
        answer: "Can",
        feedback: "For informal requests and permissions in the present, 'Can I' is the standard conversational choice."
      },
      {
        scenario: "A student asks if they are allowed to sit in the front row now.",
        quizDialogue: "Can I sit in the front row now? -> No, you ______ sit in the front row now.",
        options: ["can't", "couldn't", "need to", "shall"],
        answer: "can't",
        feedback: "Refusing permission in the present uses the negative modal 'can't' in a full sentence."
      },
      {
        scenario: "You offer to wash the dishes for your mother right now.",
        quizDialogue: "______ I wash the dishes now? -> Yes, you can wash the dishes now.",
        options: ["Must", "Can", "Could have", "Need to"],
        answer: "Can",
        feedback: "'Can I' is the standard way to offer help or ask for permission for immediate tasks."
      },
      {
        scenario: "Asking if people are allowed to park in front of the gate today.",
        quizDialogue: "Can they park their cars here today? -> No, they ______ park their cars here today.",
        options: ["must", "can't", "could", "should"],
        answer: "can't",
        feedback: "The negative response to a permission question starting with 'Can' is 'No, they can't park their cars here today'."
      },
      {
        scenario: "You ask your friend if they are able to come over to your house today.",
        quizDialogue: "Can you come over today? -> Yes, I ______ come over today.",
        options: ["can", "will have", "could", "might"],
        answer: "can",
        feedback: "The complete positive response for present availability is 'Yes, I can come over today'."
      }
    ]
  },
  {
    level: 2,
    modal: "could",
    focus: "Could - Past Ability (yesterday, last year, when younger)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask if someone had the ability to do something in the past, place the modal 'Could' at the beginning, followed by the subject, action verb, and a past timeword (like 'yesterday' or 'last year').",
        examples: [
          "Could you run fast when you were younger? -> (Question Structure)",
          "Could they speak English last year? -> (Question Structure)",
          "Could she play the violin years ago? -> (Question Structure)",
          "Could you sleep well last night? -> (Question Structure)",
          "Could they find the shop yesterday? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm a past ability in a full sentence, reply with 'Yes', followed by the subject, the past modal 'could', and the action.",
        examples: [
          "Could you run fast when you were younger? -> Yes, I could run fast when I was younger.",
          "Could she play the violin years ago? -> Yes, she could play the violin years ago.",
          "Could they find the shop yesterday? -> Yes, they could find the shop yesterday.",
          "Could she finish the exam yesterday? -> Yes, she could finish the exam yesterday.",
          "Could he fix the tap yesterday? -> Yes, he could fix the tap yesterday."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To deny a past ability, reply with 'No', followed by the subject, the negative past modal 'could not' (or contracted 'couldn't'), and the action.",
        examples: [
          "Could you run fast when you were younger? -> No, I could not run fast when I was younger.",
          "Could they speak English last year? -> No, they could not speak English last year.",
          "Could you sleep well last night? -> No, I could not sleep well last night.",
          "Could you climb trees years ago? -> No, I could not climb trees years ago.",
          "Could computers run video games thirty years ago? -> No, computers could not run video games thirty years ago."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask your grandfather if he was able to run a marathon when he was younger.",
        quizDialogue: "______ you run a marathon when you were younger? -> Yes, I could run a marathon when I was younger.",
        options: ["Will", "Could", "May", "Should have"],
        answer: "Could",
        feedback: "'Could' is the past form of 'can' and is used to ask about general ability in the past."
      },
      {
        scenario: "Checking if a friend was able to fall asleep easily last night.",
        quizDialogue: "Could you sleep well last night? -> No, I ______ sleep well last night.",
        options: ["can't", "mustn't", "couldn't", "won't"],
        answer: "couldn't",
        feedback: "For a negative answer about past ability, we use the negative past form 'couldn't' followed by the action."
      },
      {
        scenario: "You ask if the team was able to solve the technical bug yesterday.",
        quizDialogue: "Could they solve the bug yesterday? -> Yes, they ______ solve the bug yesterday.",
        options: ["can", "will", "may", "could"],
        answer: "could",
        feedback: "The short answer echoes the past modal verb: 'Yes, they could solve the bug yesterday'."
      },
      {
        scenario: "Asking if a child was able to write sentences last year before joining school.",
        quizDialogue: "______ she write full sentences last year? -> No, she could not write full sentences last year.",
        options: ["Could", "Must", "Will", "Shall"],
        answer: "Could",
        feedback: "The past time indicator 'last year' requires the past ability modal 'Could'."
      },
      {
        scenario: "Confirming if your sister was unable to cook pasta yesterday.",
        quizDialogue: "Could she not cook pasta yesterday? -> Yes, she ______ cook pasta yesterday.",
        options: ["can't", "couldn't", "mustn't", "wouldn't"],
        answer: "couldn't",
        feedback: "Confirming a negative past capability requires 'couldn't' in the complete response."
      }
    ]
  },
  {
    level: 3,
    modal: "could",
    focus: "Could - Polite Requests & Permission (now, today, tomorrow)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To make a polite request or ask for permission, start the question with 'Could you' or 'Could I', followed by the base action verb.",
        examples: [
          "Could you open the window now? -> (Question Structure)",
          "Could I use your laptop today? -> (Question Structure)",
          "Could we schedule the test tomorrow? -> (Question Structure)",
          "Could you bring the bill now? -> (Question Structure)",
          "Could we start the session today? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To grant permission or agree to a request politely in a full sentence, respond with 'Yes', followed by the subject, the modal helper 'could', and the action.",
        examples: [
          "Could you open the window now? -> Yes, I could open the window now.",
          "Could I use your laptop today? -> Yes, you could use my laptop today.",
          "Could we schedule the test tomorrow? -> Yes, we could schedule the test tomorrow.",
          "Could you bring the bill now? -> Yes, I could bring the bill now.",
          "Could we start the session today? -> Yes, we could start the session today."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To decline the request politely, respond with 'No', followed by the subject, the negative modal 'could not' (or contracted 'couldn't'), and the action.",
        examples: [
          "Could you open the window now? -> No, I could not open the window now.",
          "Could I use your laptop today? -> No, you could not use my laptop today.",
          "Could we meet at five tomorrow? -> No, we could not meet at five tomorrow.",
          "Could we leave the hall today? -> No, you could not leave the hall today.",
          "Could they deliver the package today? -> No, they could not deliver the package today."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask a stranger politely to help you open a heavy door now.",
        quizDialogue: "______ you help me open this door now? -> Yes, I could help you open this door now.",
        options: ["Did you", "Could", "Must", "Shall"],
        answer: "Could",
        feedback: "'Could you' is a polite, formal way to request assistance in the present moment."
      },
      {
        scenario: "Asking your teacher politely if you may leave the classroom today.",
        quizDialogue: "Could I leave the room today? -> Yes, you ______ leave the room today.",
        options: ["will", "could", "mustn't", "need"],
        answer: "could",
        feedback: "The polite permission question starting with 'Could I' is answered with a complete 'Yes, you could leave the room today'."
      },
      {
        scenario: "You want to ask if it is possible to reschedule a meeting tomorrow.",
        quizDialogue: "Could we reschedule the meeting tomorrow? -> No, we ______ reschedule the meeting tomorrow.",
        options: ["couldn't", "can't have", "mustn't", "needn't"],
        answer: "couldn't",
        feedback: "A negative response to a request starting with 'Could we' is 'No, we could not reschedule the meeting tomorrow'."
      },
      {
        scenario: "Asking a waiter politely to bring you more water right now.",
        quizDialogue: "______ you bring me some water now? -> Yes, I could bring you some water now.",
        options: ["Might have", "Used to", "Could", "Must"],
        answer: "Could",
        feedback: "'Could you' represents a polite request for assistance in service contexts."
      },
      {
        scenario: "Politely asking if you can use a colleague's phone today.",
        quizDialogue: "Could I borrow your phone today? -> Yes, you ______ borrow my phone today.",
        options: ["could", "will", "did", "would have"],
        answer: "could",
        feedback: "To politely grant permission in response to a 'Could I' question, echo with the complete: 'Yes, you could borrow my phone today'."
      }
    ]
  },
  {
    level: 4,
    modal: "will",
    focus: "Will - Future Intent & Promises (tomorrow, next week, soon)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask about future plans, promises, or scheduled events, start the question with the modal 'Will', followed by the subject, base verb, and a future timeword (like 'tomorrow' or 'next week').",
        examples: [
          "Will you join the coding class tomorrow? -> (Question Structure)",
          "Will they travel to London next week? -> (Question Structure)",
          "Will you help me clean the room soon? -> (Question Structure)",
          "Will the flight depart on time tomorrow? -> (Question Structure)",
          "Will we finish the project next week? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm a future action or make a promise in a complete sentence, reply with 'Yes', followed by the subject, the future modal 'will', and the rest of the sentence.",
        examples: [
          "Will you join the coding class tomorrow? -> Yes, I will join the coding class tomorrow.",
          "Will you help me clean the room soon? -> Yes, I will help you clean the room soon.",
          "Will the flight depart on time tomorrow? -> Yes, the flight will depart on time tomorrow.",
          "Will we finish the project next week? -> Yes, we will finish the project next week.",
          "Will she visit the library tomorrow? -> Yes, she will visit the library tomorrow."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To deny a future action or refuse to make a promise, reply with 'No', followed by the subject, the negative helper 'will not' (or contracted 'won't'), and the action.",
        examples: [
          "Will you join the coding class tomorrow? -> No, I will not join the coding class tomorrow.",
          "Will they travel to London next week? -> No, they will not travel to London next week.",
          "Will you call me tonight? -> No, I will not call you tonight.",
          "Will the museum open next week? -> No, the museum will not open next week.",
          "Will he send the invoice next week? -> No, he will not send the invoice next week."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You are asking your friend if they plan to attend the science camp tomorrow.",
        quizDialogue: "______ you attend the science camp tomorrow? -> Yes, I will attend the science camp tomorrow.",
        options: ["Could have", "Will", "Did you", "Must"],
        answer: "Will",
        feedback: "For future intent combined with 'tomorrow', 'Will' is the correct question starter."
      },
      {
        scenario: "You ask your brother if he promises to call you tonight.",
        quizDialogue: "Will you call me tonight? -> No, I ______ call you tonight.",
        options: ["can't have", "mustn't", "couldn't", "won't"],
        answer: "won't",
        feedback: "The negative response to a future 'Will' question is complete: 'No, I won't call you tonight'."
      },
      {
        scenario: "Confirming if the scheduled train will arrive soon.",
        quizDialogue: "Will the train arrive soon? -> Yes, it ______ arrive soon.",
        options: ["can", "will", "may", "could"],
        answer: "will",
        feedback: "The question uses 'Will the train', so the positive response is 'Yes, it will arrive soon'."
      },
      {
        scenario: "Asking if the team will complete the design next week.",
        quizDialogue: "______ they finish the design next week? -> No, they won't finish the design next week.",
        options: ["Will", "Used to", "Should have", "Might"],
        answer: "Will",
        feedback: "The future timeframe 'next week' matched with the response 'won't' requires 'Will'."
      },
      {
        scenario: "You ask if your sister will visit the dentist tomorrow.",
        quizDialogue: "Will she visit the dentist tomorrow? -> Yes, she ______ visit the dentist tomorrow.",
        options: ["will", "could", "would", "must"],
        answer: "will",
        feedback: "The complete response to a future action starting with 'Will she' is 'Yes, she will visit the dentist tomorrow'."
      }
    ]
  },
  {
    level: 5,
    modal: "will",
    focus: "Will - Future Predictions (next month, in the future, by next year)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask for predictions about the future, start the question with the modal verb 'Will', followed by the subject, the verb, and a speculative future timeframe.",
        examples: [
          "Will it rain tomorrow? -> (Question Structure)",
          "Will humans land on Mars in the future? -> (Question Structure)",
          "Will you pass the entrance exam next month? -> (Question Structure)",
          "Will phone prices drop by next year? -> (Question Structure)",
          "Will he like the cake later today? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To make a positive prediction in a complete sentence, reply with 'Yes', followed by the subject, the future modal 'will', and the predicted action.",
        examples: [
          "Will it rain tomorrow? -> Yes, it will rain tomorrow.",
          "Will humans land on Mars in the future? -> Yes, humans will land on Mars in the future.",
          "Will you pass the entrance exam next month? -> Yes, I will pass the entrance exam next month.",
          "Will phone prices drop by next year? -> Yes, phone prices will drop by next year.",
          "Will he like the cake later today? -> Yes, he will like the cake later today."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To make a negative prediction in a complete sentence, reply with 'No', followed by the subject, the negative helper 'will not' (or contracted 'won't'), and the action.",
        examples: [
          "Will it rain tomorrow? -> No, it will not rain tomorrow.",
          "Will it snow next month? -> No, it will not snow next month.",
          "Will paper books disappear in the future? -> No, paper books will not disappear in the future.",
          "Will cars fly by next year? -> No, cars will not fly by next year.",
          "Will she enjoy the movie tonight? -> No, she will not enjoy the movie tonight."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask if scientists predict that humans will land on Mars in the future.",
        quizDialogue: "______ humans land on Mars in the future? -> Yes, they will land on Mars in the future.",
        options: ["Could", "Will", "Shall", "Must"],
        answer: "Will",
        feedback: "For making general predictions about the future, 'Will' is the correct modal."
      },
      {
        scenario: "Asking if a friend predicts it will snow next month.",
        quizDialogue: "Will it snow next month? -> No, it ______ snow next month.",
        options: ["can't", "couldn't", "won't", "mustn't"],
        answer: "won't",
        feedback: "The negative prediction response for future timeframes is 'No, it won't snow next month'."
      },
      {
        scenario: "You ask if gold prices are predicted to fall by next year.",
        quizDialogue: "Will gold prices fall by next year? -> Yes, they ______ fall by next year.",
        options: ["will", "can", "should", "would"],
        answer: "will",
        feedback: "The positive prediction response is: 'Yes, they will fall by next year'."
      },
      {
        scenario: "Predicting if your friend will like the cake you bought for tonight's party.",
        quizDialogue: "______ he like the cake tonight? -> Yes, he will like the cake tonight.",
        options: ["Will", "Used to", "Should have", "Could have"],
        answer: "Will",
        feedback: "Predicting a reaction tonight uses the modal 'Will'."
      },
      {
        scenario: "Asking if the software update will fix the bugs next month.",
        quizDialogue: "Will the update fix the bugs next month? -> Yes, it ______ fix the bugs next month.",
        options: ["will", "could", "would", "must"],
        answer: "will",
        feedback: "The complete response to a prediction about a singular object is 'Yes, it will fix the bugs next month'."
      }
    ]
  },
  {
    level: 6,
    modal: "would",
    focus: "Would - Polite Requests & Offers (now, this afternoon)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To offer something politely or ask about preferences, start the question with 'Would you like' or 'Would you mind' followed by the verb phrase.",
        examples: [
          "Would you like some tea now? -> (Question Structure)",
          "Would you mind opening the door now? -> (Question Structure)",
          "Would you rather watch a movie tonight? -> (Question Structure)",
          "Would you be interested in joining the club today? -> (Question Structure)",
          "Would she like to join the call this afternoon? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To accept a polite offer or request in a complete sentence, reply with 'Yes', followed by the subject, the modal helper 'would', and the main action verb.",
        examples: [
          "Would you like some tea now? -> Yes, I would like some tea now.",
          "Would you rather watch a movie tonight? -> Yes, I would rather watch a movie tonight.",
          "Would you be interested in joining the club today? -> Yes, I would be interested in joining today.",
          "Would you attend the conference this afternoon? -> Yes, I would attend the conference this afternoon.",
          "Would you participate in the contest today? -> Yes, I would participate in the contest today."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To decline the offer or request politely, start with 'No', followed by the subject, the negative helper 'would not' (or contracted 'wouldn't'), and the action.",
        examples: [
          "Would you like some tea now? -> No, I would not like some tea now.",
          "Would they like some snacks now? -> No, they would not like some snacks now.",
          "Would you rather stay home today? -> No, I would not rather stay home today.",
          "Would you eat another slice of cake now? -> No, I would not eat another slice of cake now.",
          "Would they prefer to wait in the lobby this afternoon? -> No, they would not prefer to wait in the lobby."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to offer a guest a cup of hot coffee right now in a polite manner.",
        quizDialogue: "______ you like a cup of coffee now? -> Yes, I would like a cup of coffee now.",
        options: ["Should", "Did", "Would", "Shall"],
        answer: "Would",
        feedback: "'Would you like' is the standard polite formula for offering food or drinks."
      },
      {
        scenario: "Asking a friend if they would prefer to stay at home tonight rather than go out.",
        quizDialogue: "Would you rather stay home tonight? -> Yes, I ______ rather stay home tonight.",
        options: ["will", "could", "would", "must"],
        answer: "would",
        feedback: "The preference question starts with 'Would you rather', so the positive short response is 'Yes, I would'."
      },
      {
        scenario: "You ask your colleague politely if they would mind checking a file this afternoon.",
        quizDialogue: "Would you mind checking this file this afternoon? -> No, I ______ mind checking this file.",
        options: ["wouldn't", "mustn't", "won't", "couldn't"],
        answer: "wouldn't",
        feedback: "Responding that you do not mind a polite request requires the negative helper 'wouldn't' in a full sentence."
      },
      {
        scenario: "Asking if a client would be interested in seeing the new office today.",
        quizDialogue: "______ they be interested in seeing the office today? -> No, they wouldn't be interested in seeing it today.",
        options: ["Would", "Used to", "Should have", "Might"],
        answer: "Would",
        feedback: "The polite interest query uses 'Would they be' to match the negative response 'wouldn't'."
      },
      {
        scenario: "Offering to show someone the library this afternoon and checking if they would like that.",
        quizDialogue: "Would you like to see the library this afternoon? -> No, I ______ like to see the library this afternoon.",
        options: ["won't", "wouldn't", "mustn't", "can't have"],
        answer: "wouldn't",
        feedback: "Declining a polite offer of 'Would you like' is formulated as 'No, I wouldn't'."
      }
    ]
  },
  {
    level: 7,
    modal: "would",
    focus: "Would - Hypothetical & Conditional (tomorrow if..., today if...)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask hypothetical questions in conditional contexts, start the question with 'Would', followed by the subject, main verb, and an imaginary condition (like 'if you had the money').",
        examples: [
          "Would you buy a new car today if you had the money? -> (Question Structure)",
          "Would they play the match tomorrow if it stopped raining? -> (Question Structure)",
          "Would you support the policy today if you were the boss? -> (Question Structure)",
          "Would she sign the contract today if we doubled the pay? -> (Question Structure)",
          "Would we win the tournament currently if we trained daily? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm a hypothetical action in a complete sentence, reply with 'Yes', followed by the subject, the helper 'would', and repeat the action verb under the condition.",
        examples: [
          "Would you buy a new car today if you had the money? -> Yes, I would buy a new car today if I had the money.",
          "Would they play the match tomorrow if it stopped raining? -> Yes, they would play the match tomorrow if it stopped raining.",
          "Would you support the policy today if you were the boss? -> Yes, I would support the policy today if I were the boss.",
          "Would she sign the contract today if we doubled the pay? -> Yes, she would sign the contract today if we doubled the pay.",
          "Would we win the tournament currently if we trained daily? -> Yes, we would win the tournament currently if we trained daily."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To deny the counterfactual action, reply with 'No', followed by the subject, the negative hypothetical helper 'would not' (or contracted 'wouldn't'), and the action.",
        examples: [
          "Would you buy a new car today if you had the money? -> No, I would not buy a new car today if I had the money.",
          "Would they help us today if they were free? -> No, they would not help us today if they were free.",
          "Would you join the trek tomorrow if you felt better? -> No, I would not join the trek tomorrow if I felt better.",
          "Would he resign today if he were in my position? -> No, he would not resign today if he were in your position.",
          "Would we get lost currently if we used a map? -> No, we would not get lost currently if we used a map."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You ask your friend if they would buy a laptop today if they had enough money.",
        quizDialogue: "______ you buy a laptop today if you had the money? -> Yes, I would buy a laptop today if I had the money.",
        options: ["Can", "Would", "Did", "Shall"],
        answer: "Would",
        feedback: "Hypothetical questions in conditional structures (if you had...) are introduced with 'Would'."
      },
      {
        scenario: "Asking if the team would play the match tomorrow if it stopped raining.",
        quizDialogue: "Would they play tomorrow if it stopped raining? -> No, they ______ play tomorrow if it stopped raining.",
        options: ["won't", "couldn't", "wouldn't", "mustn't"],
        answer: "wouldn't",
        feedback: "A negative response to a conditional 'Would they' question is complete: 'No, they wouldn't play'."
      },
      {
        scenario: "You ask if your colleague would resign today if they were in your position.",
        quizDialogue: "Would you resign today if you were in my shoes? -> Yes, I ______ resign today if I were in your shoes.",
        options: ["will", "can", "would", "should"],
        answer: "would",
        feedback: "The question uses 'Would you', so the positive hypothetical response is 'Yes, I would resign today'."
      },
      {
        scenario: "Checking if a client would sign the contract today if the price were lower.",
        quizDialogue: "______ she sign the contract today if we lowered the price? -> Yes, she would sign the contract today if we lowered the price.",
        options: ["Would", "Used to", "Should have", "Might"],
        answer: "Would",
        feedback: "The conditional clause 'if we lowered...' indicates a hypothetical scenario requiring 'Would'."
      },
      {
        scenario: "Asking if the machine would function now if you switched on the power.",
        quizDialogue: "Would the machine work now if you turned it on? -> No, it ______ work now if you turned it on.",
        options: ["won't", "wouldn't", "mustn't", "can't have"],
        answer: "wouldn't",
        feedback: "The hypothetical response for a singular object is complete: 'No, it wouldn't work now'."
      }
    ]
  },
  {
    level: 8,
    modal: "should",
    focus: "Should - Advice & Recommendation (today, tonight, this week)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To seek or offer advice and recommendations, start the question with 'Should', followed by the subject, action verb, and present/future timewords.",
        examples: [
          "Should I buy this winter coat today? -> (Question Structure)",
          "Should we visit the museum this afternoon? -> (Question Structure)",
          "Should they start preparing the slides tonight? -> (Question Structure)",
          "Should you drink more water daily? -> (Question Structure)",
          "Should he drive fast in the rain today? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To give positive advice in a complete sentence, reply with 'Yes', followed by the subject, the advice helper 'should', and repeat the recommended action.",
        examples: [
          "Should I buy this winter coat today? -> Yes, you should buy this winter coat today.",
          "Should we visit the museum this afternoon? -> Yes, we should visit the museum this afternoon.",
          "Should they start preparing the slides tonight? -> Yes, they should start preparing the slides tonight.",
          "Should you drink more water daily? -> Yes, you should drink more water daily.",
          "Should he exercise in the morning today? -> Yes, he should exercise in the morning today."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To give negative advice or recommend against an action, reply with 'No', followed by the subject, the negative helper 'should not' (or contracted 'shouldn't'), and the action.",
        examples: [
          "Should I buy this winter coat today? -> No, you should not buy this winter coat today.",
          "Should I call the doctor tonight? -> No, you should not call the doctor tonight.",
          "Should we wait for the bus here today? -> No, we should not wait for the bus here today.",
          "Should she walk alone late tonight? -> No, she should not walk alone late tonight.",
          "Should he drive fast in the rain today? -> No, he should not drive fast in the rain today."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask your friend's opinion on whether you should buy a specific dictionary today.",
        quizDialogue: "______ I buy this dictionary today? -> Yes, you should buy this dictionary today.",
        options: ["Would", "Did", "Should", "Shall"],
        answer: "Should",
        feedback: "When asking for advice or a recommendation in the present, 'Should' is the standard modal verb."
      },
      {
        scenario: "A teammate asks if the team should start writing the code tonight.",
        quizDialogue: "Should they start writing the code tonight? -> No, they ______ start writing the code tonight.",
        options: ["won't", "couldn't", "shouldn't", "mustn't"],
        answer: "shouldn't",
        feedback: "A negative advice response to a 'Should they' question is complete: 'No, they shouldn't start'."
      },
      {
        scenario: "You ask your mother if the family should eat healthy salads today.",
        quizDialogue: "Should we eat salads today? -> Yes, we ______ eat salads today.",
        options: ["should", "will", "can", "would"],
        answer: "should",
        feedback: "The question uses 'Should we', so the positive advice response is 'Yes, we should eat salads today'."
      },
      {
        scenario: "Checking if it is a bad idea to walk alone in the dark tonight.",
        quizDialogue: "______ I walk alone in the dark tonight? -> No, you shouldn't walk alone in the dark tonight.",
        options: ["Should", "Used to", "Should have", "Could have"],
        answer: "Should",
        feedback: "Asking for a safety recommendation ('tonight') requires the advice modal 'Should'."
      },
      {
        scenario: "Asking if your sister should consult a doctor this week for her back pain.",
        quizDialogue: "Should she consult a doctor this week? -> Yes, she ______ consult a doctor this week.",
        options: ["should", "could", "would", "must"],
        answer: "should",
        feedback: "The complete response to a recommendation question starting with 'Should she' is 'Yes, she should consult a doctor this week'."
      }
    ]
  },
  {
    level: 9,
    modal: "should",
    focus: "Should - Future Expectation (by tomorrow, soon)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask if something is expected to happen by a future time, start the question with 'Should', followed by the subject, verb, and a future expectation timeword.",
        examples: [
          "Should the parcel arrive by tomorrow? -> (Question Structure)",
          "Should they reach the station by tomorrow? -> (Question Structure)",
          "Should the exam results be out by tomorrow? -> (Question Structure)",
          "Should the team finish the call in ten minutes? -> (Question Structure)",
          "Should the rain stop by tomorrow? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm a positive expectation, reply with 'Yes', followed by the subject, the expectation helper 'should', and repeat the action verb.",
        examples: [
          "Should the parcel arrive by tomorrow? -> Yes, the parcel should arrive by tomorrow.",
          "Should they reach the station by tomorrow? -> Yes, they should reach the station by tomorrow.",
          "Should the exam results be out by tomorrow? -> Yes, the exam results should be out by tomorrow.",
          "Should the team finish the call in ten minutes? -> Yes, the team should finish the call in ten minutes.",
          "Should the rain stop by tomorrow? -> Yes, the rain should stop by tomorrow."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To state that an outcome is not expected, reply with 'No', followed by the subject, the negative helper 'should not' (or contracted 'shouldn't'), and the action.",
        examples: [
          "Should the parcel arrive by tomorrow? -> No, the parcel should not arrive by tomorrow.",
          "Should the books deliver soon? -> No, the books should not deliver soon.",
          "Should he land in Delhi soon? -> No, he should not land in Delhi soon.",
          "Should the board meeting wrap up soon? -> No, the board meeting should not wrap up soon.",
          "Should the fog clear up soon? -> No, the fog should not clear up soon."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask if the courier package is expected to arrive by tomorrow.",
        quizDialogue: "______ the package arrive by tomorrow? -> Yes, the package should arrive by tomorrow.",
        options: ["Could", "Should", "Shall", "Must"],
        answer: "Should",
        feedback: "To ask about logical expectations in the future (by tomorrow), use the modal 'Should'."
      },
      {
        scenario: "Checking if a friend expects the meeting to end in ten minutes.",
        quizDialogue: "Should the meeting end in ten minutes? -> No, it ______ end in ten minutes.",
        options: ["can't", "couldn't", "shouldn't", "mustn't"],
        answer: "shouldn't",
        feedback: "The negative response to a future expectation question is complete: 'No, it shouldn't end'."
      },
      {
        scenario: "You ask if the travelers are expected to arrive soon.",
        quizDialogue: "Should they arrive soon? -> Yes, they ______ arrive soon.",
        options: ["should", "will", "can", "would"],
        answer: "should",
        feedback: "The question starts with 'Should they', so the expectation reply is 'Yes, they should arrive soon'."
      },
      {
        scenario: "Predicting if the heavy rain is expected to clear up by tomorrow.",
        quizDialogue: "______ the rain clear up by tomorrow? -> No, it shouldn't clear up by tomorrow.",
        options: ["Should", "Used to", "Should have", "Could have"],
        answer: "Should",
        feedback: "Asking about a natural expectation ('by tomorrow') requires the modal 'Should'."
      },
      {
        scenario: "Asking if the grades are expected to release soon.",
        quizDialogue: "Should the grades release soon? -> Yes, they ______ release soon.",
        options: ["should", "could", "would", "must"],
        answer: "should",
        feedback: "The short response to a future expectation for plural objects is 'Yes, they should release soon'."
      }
    ]
  },
  {
    level: 10,
    modal: "must",
    focus: "Must - Strong Obligation & Necessity (now, immediately, today)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask if an action is strictly compulsory under rules or urgent situations today, start the question with the modal 'Must', followed by the subject and the action verb.",
        examples: [
          "Must we wear school uniforms today? -> (Question Structure)",
          "Must I sign this paper immediately? -> (Question Structure)",
          "Must he attend the safety training today? -> (Question Structure)",
          "Must passengers wear seatbelts now? -> (Question Structure)",
          "Must you leave the party now? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm a strict obligation in a complete sentence, reply with 'Yes', followed by the subject, the obligation modal 'must', and repeat the action.",
        examples: [
          "Must we wear school uniforms today? -> Yes, you must wear school uniforms today.",
          "Must I sign this paper immediately? -> Yes, you must sign this paper immediately.",
          "Must he attend the safety training today? -> Yes, he must attend the safety training today.",
          "Must passengers wear seatbelts now? -> Yes, they must wear seatbelts now.",
          "Must we submit our passports today? -> Yes, we must submit our passports today."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To state that there is NO strict obligation (absence of necessity), reply with 'No', followed by the subject, the helper 'need not' (or contracted 'needn't'), and the action.",
        examples: [
          "Must we wear school uniforms today? -> No, you do not need to wear school uniforms today.",
          "Must I sign this paper immediately? -> No, you do not need to sign this paper immediately.",
          "Must he print the email now? -> No, he does not need to print the email now.",
          "Must I pay for the ticket today? -> No, you do not need to pay for the ticket today.",
          "Must they attend the meeting now? -> No, they do not need to attend the meeting now."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask the teacher if it is strictly compulsory to submit the project today.",
        quizDialogue: "______ we submit the project today? -> Yes, you must submit the project today.",
        options: ["Would", "Did", "Must", "Shall"],
        answer: "Must",
        feedback: "To ask about strong obligation or rules in the present, 'Must' is used."
      },
      {
        scenario: "A friend asks if they are forced to leave the hall immediately.",
        quizDialogue: "Must I leave the hall immediately? -> No, you ______ leave the hall immediately.",
        options: ["must", "needn't", "shouldn't", "couldn't"],
        answer: "needn't",
        feedback: "When answering 'No' to a 'Must' question about obligation, use 'needn't' in the complete sentence to show lack of necessity."
      },
      {
        scenario: "You ask your father if passengers are strictly required to wear helmets now.",
        quizDialogue: "Must we wear helmets now? -> Yes, we ______ wear helmets now.",
        options: ["must", "will", "can", "would"],
        answer: "must",
        feedback: "The question starts with 'Must we', so the positive obligation response is complete: 'Yes, we must wear helmets now'."
      },
      {
        scenario: "Checking if you are strictly required to sign a contract immediately.",
        quizDialogue: "______ I sign this contract immediately? -> No, you needn't sign this contract immediately.",
        options: ["Must", "Used to", "Should have", "Could have"],
        answer: "Must",
        feedback: "Asking about an absolute rule or requirement uses 'Must'."
      },
      {
        scenario: "Asking if your brother must attend the offline test today.",
        quizDialogue: "Must he attend the test today? -> Yes, he ______ attend the test today.",
        options: ["must", "could", "would", "shall"],
        answer: "must",
        feedback: "The complete response to a strict rule question starting with 'Must he' is 'Yes, he must attend the test today'."
      }
    ]
  },
  {
    level: 11,
    modal: "must",
    focus: "Must - Logical Certainty / Deduction (currently, tonight)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask if a deduction is logically certain based on present evidence, start the question with 'Must', followed by the subject, the verb 'be', and a present state.",
        examples: [
          "Must he be the new English teacher currently? -> (Question Structure)",
          "Must this be the correct key for the gate currently? -> (Question Structure)",
          "Must it be this hot in the room currently? -> (Question Structure)",
          "Must she be upset about losing the watch today? -> (Question Structure)",
          "Must they be excited about the tour tonight? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm a logical deduction, reply with 'Yes', followed by the subject, the deduction helper 'must', and repeat the state.",
        examples: [
          "Must he be the new English teacher currently? -> Yes, he must be the new English teacher currently.",
          "Must this be the correct key for the gate currently? -> Yes, this must be the correct key for the gate currently.",
          "Must it be this hot in the room currently? -> Yes, it must be this hot in the room currently.",
          "Must she be upset about losing the watch today? -> Yes, she must be upset about losing the watch today.",
          "Must they be excited about the tour tonight? -> Yes, they must be excited about the tour tonight."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "If the logical deduction is incorrect, reply with a direct factual negation starting with 'No', followed by the subject and the negative form of 'be' (like 'isn't' or 'are not').",
        examples: [
          "Must they be tired after the long match today? -> No, they are not tired after the long match today.",
          "Must that be the right school bus today? -> No, that is not the right school bus today.",
          "Must this box be the delivery package today? -> No, this box is not the delivery package today.",
          "Must the shop be closed at this hour today? -> No, the shop is not closed at this hour today.",
          "Must the class be empty right now? -> No, the class is not empty right now."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You notice someone has a key and want to confirm if it must logically be the right one currently.",
        quizDialogue: "______ this be the correct key for the door currently? -> Yes, this must be the correct key for the door currently.",
        options: ["Could have", "Must", "Did", "Shall"],
        answer: "Must",
        feedback: "For present logical deductions based on evidence, we start the question with 'Must'."
      },
      {
        scenario: "Asking if a classmate must logically be exhausted after playing for three hours today.",
        quizDialogue: "Must they be exhausted after the game today? -> Yes, they ______ be exhausted after the game today.",
        options: ["can", "will", "would", "must"],
        answer: "must",
        feedback: "The question uses 'Must they be', so the logical deduction complete response is 'Yes, they must be exhausted'."
      },
      {
        scenario: "You ask if a building is logically certain to be the school library currently.",
        quizDialogue: "Must this building be the library currently? -> No, it ______ the library currently.",
        options: ["isn't", "mustn't", "couldn't", "won't"],
        answer: "isn't",
        feedback: "If a present deduction is wrong, the natural complete reply uses 'No, it isn't the library'."
      },
      {
        scenario: "Confirming if your teacher must logically be angry about the noise currently.",
        quizDialogue: "______ she be angry about the noise currently? -> Yes, she must be angry about the noise currently.",
        options: ["Must", "Used to", "Should have", "Might"],
        answer: "Must",
        feedback: "Logical deduction of emotional states based on present evidence uses 'Must'."
      },
      {
        scenario: "Asking if a package must logically be the one ordered yesterday.",
        quizDialogue: "Must this be the package ordered yesterday? -> Yes, it ______ be the package ordered yesterday.",
        options: ["must", "could", "would", "shall"],
        answer: "must",
        feedback: "The complete response to a logical deduction question starting with 'Must this' is 'Yes, it must be the package'."
      }
    ]
  },
  {
    level: 12,
    modal: "may",
    focus: "May - Formal Request & Permission (now, today)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask for permission or make an offer in a highly formal way, start the question with 'May I' or 'May we', followed by the base action verb.",
        examples: [
          "May I enter the office now? -> (Question Structure)",
          "May we submit the drafts today? -> (Question Structure)",
          "May I assist you with the bags now? -> (Question Structure)",
          "May I check your ticket now? -> (Question Structure)",
          "May we check the data today? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To grant permission formally in a complete sentence, reply with 'Yes', followed by the subject, the formal helper 'may', and repeat the action.",
        examples: [
          "May I enter the office now? -> Yes, you may enter the office now.",
          "May we submit the drafts today? -> Yes, you may submit the drafts today.",
          "May I assist you with the bags now? -> Yes, you may assist me with the bags now.",
          "May I check your ticket now? -> Yes, you may check my ticket now.",
          "May we check the data today? -> Yes, you may check the data today."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To refuse permission formally, reply with 'No', followed by the subject, the formal negative helper 'may not', and repeat the action verb.",
        examples: [
          "May I enter the office now? -> No, you may not enter the office now.",
          "May I use the printer today? -> No, you may not use the printer today.",
          "May I borrow this diary today? -> No, you may not borrow this diary today.",
          "May I take the test tomorrow? -> No, you may not take the test tomorrow.",
          "May we take photos here now? -> No, you may not take photos here now."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask a librarian formally for permission to enter the research room now.",
        quizDialogue: "______ I enter the research room now? -> Yes, you may enter the research room now.",
        options: ["Did I", "May", "Must", "Shall"],
        answer: "May",
        feedback: "'May I' is the standard, grammatically formal phrase to request permission."
      },
      {
        scenario: "A student asks if they may use the chemistry lab today.",
        quizDialogue: "May we use the lab today? -> No, you ______ use the lab today.",
        options: ["won't", "couldn't", "may not", "mustn't"],
        answer: "may not",
        feedback: "The formal negative response to a permission question starting with 'May' is complete: 'No, you may not use the lab today'."
      },
      {
        scenario: "You ask your principal formally if the class may host a seminar today.",
        quizDialogue: "May we host a seminar today? -> Yes, you ______ host a seminar today.",
        options: ["may", "will", "can", "would"],
        answer: "may",
        feedback: "The question starts with 'May we', so the positive formal response is complete: 'Yes, you may host a seminar today'."
      },
      {
        scenario: "Formally offering to assist a customer with their luggage at the hotel entrance.",
        quizDialogue: "______ I assist you with your bags now? -> Yes, you may assist me with my bags now.",
        options: ["May", "Used to", "Should have", "Could have"],
        answer: "May",
        feedback: "Formally offering services in the present uses the polite helper 'May'."
      },
      {
        scenario: "Asking if you may inspect the final copy of the file today.",
        quizDialogue: "May I inspect the file today? -> Yes, you ______ inspect the file today.",
        options: ["may", "could", "would", "shall"],
        answer: "may",
        feedback: "The short response to a formal permission question starting with 'May I' is complete: 'Yes, you may inspect the file today'."
      }
    ]
  },
  {
    level: 13,
    modal: "may",
    focus: "May - Possibility (later, this weekend, tomorrow)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask about logical or factual possibilities in the future, start the question with the modal 'May', followed by the subject, action verb, and a future timeframe.",
        examples: [
          "May it rain later today? -> (Question Structure)",
          "May they visit the beach this weekend? -> (Question Structure)",
          "May the train be delayed later today? -> (Question Structure)",
          "May the boss reject the plan tomorrow? -> (Question Structure)",
          "May she approve the leave tomorrow? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm a positive possibility in a complete sentence, reply with 'Yes', followed by the subject, the helper 'may', and repeat the action.",
        examples: [
          "May it rain later today? -> Yes, it may rain later today.",
          "May they visit the beach this weekend? -> Yes, they may visit the beach this weekend.",
          "May the train be delayed later today? -> Yes, the train may be delayed later today.",
          "May the boss reject the plan tomorrow? -> Yes, the boss may reject the plan tomorrow.",
          "May she approve the leave tomorrow? -> Yes, she may approve the leave tomorrow."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To express that a possibility is not expected, reply with 'No', followed by the subject, the negative possibility helper 'may not', and the action.",
        examples: [
          "May it rain later today? -> No, it may not rain later today.",
          "May she travel to Rome next week? -> No, she may not travel to Rome next week.",
          "May he drive to the city next week? -> No, he may not drive to the city next week.",
          "May the concert be cancelled tomorrow? -> No, the concert may not be cancelled tomorrow.",
          "May they sign the contract next week? -> No, they may not sign the contract next week."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask if the meteorologists think it might rain later today.",
        quizDialogue: "______ it rain later today? -> Yes, it may rain later today.",
        options: ["Did", "May", "Shall", "Must"],
        answer: "May",
        feedback: "To ask about factual possibility combined with 'later today', 'May' is the appropriate formal modal."
      },
      {
        scenario: "Checking if there is a possibility that a flight is delayed tomorrow.",
        quizDialogue: "May the flight be delayed tomorrow? -> No, it ______ be delayed tomorrow.",
        options: ["can't", "couldn't", "may not", "mustn't"],
        answer: "may not",
        feedback: "The negative possibility response is complete: 'No, it may not be delayed tomorrow'."
      },
      {
        scenario: "You ask if the company is likely to hire new interns next week.",
        quizDialogue: "May they hire interns next week? -> Yes, they ______ hire interns next week.",
        options: ["may", "will", "can", "would"],
        answer: "may",
        feedback: "The question uses 'May they', so the possibility response is complete: 'Yes, they may hire interns next week'."
      },
      {
        scenario: "Asking if there is a possibility the team won't arrive later today.",
        quizDialogue: "______ they not arrive later today? -> Yes, they may not arrive later today.",
        options: ["May", "Used to", "Should have", "Could have"],
        answer: "May",
        feedback: "To discuss possibilities in the near future, 'May' is the standard modal in a full sentence."
      },
      {
        scenario: "Asking if the manager may approve the leave tomorrow.",
        quizDialogue: "May she approve the leave tomorrow? -> Yes, she ______ approve the leave tomorrow.",
        options: ["may", "could", "would", "shall"],
        answer: "may",
        feedback: "The short response to a possibility question starting with 'May she' is complete: 'Yes, she may approve the leave'."
      }
    ]
  },
  {
    level: 14,
    modal: "might",
    focus: "Might - Weak Possibility (tonight, next year, someday)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask about a weak, hesitant, or small possibility in the future, start the question with the modal 'Might', followed by the subject and base action verb.",
        examples: [
          "Might you be free for a chat tonight? -> (Question Structure)",
          "Might it rain tonight? -> (Question Structure)",
          "Might he study medicine someday? -> (Question Structure)",
          "Might our team win the cup next week? -> (Question Structure)",
          "Might she feel better by tomorrow? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm a weak possibility in a complete sentence, reply with 'Yes', followed by the subject, the weak modal 'might', and repeat the action.",
        examples: [
          "Might you be free for a chat tonight? -> Yes, I might be free for a chat tonight.",
          "Might it rain tonight? -> Yes, it might rain tonight.",
          "Might he study medicine someday? -> Yes, he might study medicine someday.",
          "Might our team win the cup next week? -> Yes, our team might win the cup next week.",
          "Might she feel better by tomorrow? -> Yes, she might feel better by tomorrow."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To deny the weak possibility in a complete sentence, reply with 'No', followed by the subject, the negative helper 'might not', and the action.",
        examples: [
          "Might you be free for a chat tonight? -> No, I might not be free for a chat tonight.",
          "Might they change their plans tomorrow? -> No, they might not change their plans tomorrow.",
          "Might she join the dinner tonight? -> No, she might not join the dinner tonight.",
          "Might he visit the clinic tomorrow? -> No, he might not visit the clinic tomorrow.",
          "Might they buy a house next year? -> No, they might not buy a house next year."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask if there is a slight, weak chance your friend is free tonight.",
        quizDialogue: "______ you be free to meet tonight? -> Yes, I might be free to meet tonight.",
        options: ["Did", "Might", "Shall", "Must"],
        answer: "Might",
        feedback: "To express a weak or hesitant possibility ('tonight'), the modal 'Might' is correct."
      },
      {
        scenario: "Checking if there is a small chance the team might not join next week.",
        quizDialogue: "Might they skip the class next week? -> No, they ______ skip the class next week.",
        options: ["can't", "couldn't", "might not", "mustn't"],
        answer: "might not",
        feedback: "The negative short response to a weak possibility starting with 'Might' is complete: 'No, they might not skip'."
      },
      {
        scenario: "You ask if a medicine might cure the allergy by tomorrow.",
        quizDialogue: "Might it cure the allergy by tomorrow? -> Yes, it ______ cure the allergy by tomorrow.",
        options: ["might", "will", "can", "would"],
        answer: "might",
        feedback: "The question starts with 'Might it', so the weak possibility reply is complete: 'Yes, it might cure it'."
      },
      {
        scenario: "Asking if there is a slight chance your sister won't cook tonight.",
        quizDialogue: "______ she not cook tonight? -> Yes, she might not cook tonight.",
        options: ["Might", "Used to", "Should have", "Could have"],
        answer: "Might",
        feedback: "Weak possibility of negative outcomes in the near future uses 'Might' in full statements."
      },
      {
        scenario: "Asking if a company might expand to India next year.",
        quizDialogue: "Might the company expand next year? -> Yes, it ______ expand next year.",
        options: ["might", "could", "would", "shall"],
        answer: "might",
        feedback: "The short response to a weak possibility question starting with 'Might' is complete: 'Yes, it might expand next year'."
      }
    ]
  },
  {
    level: 15,
    modal: "shall",
    focus: "Shall - Offers & Suggestions (now, this evening)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To offer help or make cooperative suggestions, start the question with 'Shall I' or 'Shall we', followed by the action verb.",
        examples: [
          "Shall we start the meeting now? -> (Question Structure)",
          "Shall I carry your heavy bag now? -> (Question Structure)",
          "Shall we meet at six this evening? -> (Question Structure)",
          "Shall we turn left here now? -> (Question Structure)",
          "Shall we eat dinner now? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To accept the suggestion or offer in a complete sentence, reply with 'Yes, let's [action]' or 'Yes, we shall [action]'.",
        examples: [
          "Shall we start the meeting now? -> Yes, let's start the meeting now.",
          "Shall I carry your heavy bag now? -> Yes, please carry my heavy bag now.",
          "Shall we meet at six this evening? -> Yes, we shall meet at six this evening.",
          "Shall we turn left here now? -> Yes, let's turn left here now.",
          "Shall we eat dinner now? -> Yes, let's eat dinner now."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To decline the suggestion or offer, reply with 'No, let's not [action]' or 'No, we shall not [action]'.",
        examples: [
          "Shall we start the meeting now? -> No, let's not start the meeting now.",
          "Shall I open the window today? -> No, thank you, do not open the window today.",
          "Shall we meet at six this evening? -> No, we shall not meet at six this evening.",
          "Shall we play chess this evening? -> No, let's not play chess this evening.",
          "Shall we play inside now? -> No, let's not play inside now."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to suggest to your friend that you both go to the park this evening.",
        quizDialogue: "______ we go to the park this evening? -> Yes, let's go to the park this evening.",
        options: ["Did", "Shall", "Must", "Would"],
        answer: "Shall",
        feedback: "'Shall we' is the standard polite formula to make suggestions for shared activities."
      },
      {
        scenario: "Offering politely to carry a heavy box for your teacher right now.",
        quizDialogue: "Shall I carry this box now? -> Yes, ______ carry this box now.",
        options: ["please", "let's not", "mustn't", "won't"],
        answer: "please",
        feedback: "A polite offer of help starting with 'Shall I' is answered with 'Yes, please carry this box now'."
      },
      {
        scenario: "You ask your friend if you both should meet at the cafe this evening.",
        quizDialogue: "Shall we meet at the cafe this evening? -> Yes, we ______ meet at the cafe this evening.",
        options: ["shall", "will", "can", "would"],
        answer: "shall",
        feedback: "The question uses 'Shall we', so the positive planning response is complete: 'Yes, we shall meet at the cafe'."
      },
      {
        scenario: "Suggesting that the group turns off the computer screens now.",
        quizDialogue: "______ we turn off the screens now? -> No, let's not turn off the screens now.",
        options: ["Shall", "Used to", "Should have", "Could have"],
        answer: "Shall",
        feedback: "Making suggestions for group actions in the present uses the modal 'Shall'."
      },
      {
        scenario: "Asking if you both should eat dinner now.",
        quizDialogue: "Shall we eat dinner now? -> No, let's ______ eat dinner now.",
        options: ["not", "never", "mustn't", "won't"],
        answer: "not",
        feedback: "Declining a 'Shall we' suggestion is naturally formulated as a complete 'No, let's not eat dinner now'."
      }
    ]
  },
  {
    level: 16,
    modal: "used to",
    focus: "Used to - Past Habits & States (in childhood, years ago, back then)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask about past habits, start the question with the helper 'Did', followed by the subject, the infinitive 'use to' (without 'd'), and the action verb.",
        examples: [
          "Did you use to play football in childhood? -> (Question Structure)",
          "Did they use to live in Delhi years ago? -> (Question Structure)",
          "Did you use to wake up early back then? -> (Question Structure)",
          "Did you use to eat sweets when younger? -> (Question Structure)",
          "Did you use to travel by train years ago? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm a past habit in a complete sentence, reply with 'Yes', followed by the subject, the past habit marker 'did' or 'used to', and repeat the action.",
        examples: [
          "Did you use to play football in childhood? -> Yes, I did play football in childhood.",
          "Did they use to live in Delhi years ago? -> Yes, they did live in Delhi years ago.",
          "Did you use to wake up early back then? -> Yes, I did wake up early back then.",
          "Did you use to eat sweets when younger? -> Yes, I did eat sweets when I was younger.",
          "Did you use to travel by train years ago? -> Yes, I did travel by train years ago."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To deny the past habit in a complete sentence, reply with 'No', followed by the subject, the negative auxiliary 'did not' (or 'didn't'), and repeat the action verb.",
        examples: [
          "Did you use to play football in childhood? -> No, I did not play football in childhood.",
          "Did they use to swim in the river years ago? -> No, they did not swim in the river years ago.",
          "Did you use to live in a flat years ago? -> No, we did not live in a flat years ago.",
          "Did he study late back then? -> No, he did not study late back then.",
          "Did she ride a bicycle years ago? -> No, she did not ride a bicycle years ago."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask your uncle if he regularly played cricket when he was a child.",
        quizDialogue: "Did you ______ to play cricket in childhood? -> Yes, I did play cricket in childhood.",
        options: ["used", "use", "using", "uses"],
        answer: "use",
        feedback: "In questions starting with 'Did', the infinitive 'use to' is correct (not 'used to') because past tense is carried by 'Did'."
      },
      {
        scenario: "Checking if a friend regularly woke up early years ago.",
        quizDialogue: "Did you use to wake up early years ago? -> No, I ______ wake up early years ago.",
        options: ["didn't", "don't", "hadn't", "wasn't"],
        answer: "didn't",
        feedback: "The question starts with 'Did you', so the negative short answer is complete: 'No, I didn't wake up early'."
      },
      {
        scenario: "You ask if your cousins lived in New York years ago.",
        quizDialogue: "Did they use to live in New York years ago? -> Yes, they ______ live in New York years ago.",
        options: ["did", "do", "used", "were"],
        answer: "did",
        feedback: "Questions starting with 'Did they' are answered with the complete: 'Yes, they did live in New York'."
      },
      {
        scenario: "Inquiring if someone regularly drank coffee when they were younger.",
        quizDialogue: "______ you use to drink coffee when younger? -> No, I didn't drink coffee when younger.",
        options: ["Did", "Do", "Have", "Were"],
        answer: "Did",
        feedback: "Questions about past habits starting with 'use to' require the auxiliary 'Did'."
      },
      {
        scenario: "Asking if your mother used to travel by bus years ago.",
        quizDialogue: "Did she use to travel by bus years ago? -> Yes, she ______ travel by bus years ago.",
        options: ["did", "used", "was", "does"],
        answer: "did",
        feedback: "The short response to a past habit question starting with 'Did she' is complete: 'Yes, she did travel by bus'."
      }
    ]
  },
  {
    level: 17,
    modal: "need to",
    focus: "Need to - Necessity & Obligation (today, urgently, this week)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask if an action is necessary today or this week, start the question with the present auxiliary 'Do' or 'Does', followed by the subject, 'need to', and the main action verb.",
        examples: [
          "Do I need to buy milk today? -> (Question Structure)",
          "Do we need to submit the files urgently? -> (Question Structure)",
          "Does he need to finish the review this week? -> (Question Structure)",
          "Does this laptop need to be repaired today? -> (Question Structure)",
          "Do you need to study for the test today? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm the necessity in a complete sentence, reply with 'Yes', followed by the subject, the present auxiliary helper 'do' or 'does' (or full verb 'need to'), and the action.",
        examples: [
          "Do I need to buy milk today? -> Yes, you do need to buy milk today.",
          "Do we need to submit the files urgently? -> Yes, we do need to submit the files urgently.",
          "Does he need to finish the review this week? -> Yes, he does need to finish the review this week.",
          "Does this laptop need to be repaired today? -> Yes, this laptop does need to be repaired today.",
          "Do you need to study for the test today? -> Yes, I do need to study for the test today."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To state that the action is not necessary, reply with 'No', followed by the subject, the negative auxiliary 'don't' or 'doesn't', and repeat 'need to' with the action.",
        examples: [
          "Do I need to buy milk today? -> No, you do not need to buy milk today.",
          "Do they need to call the boss urgently? -> No, they do not need to call the boss urgently.",
          "Does she need to attend the camp this week? -> No, she does not need to attend the camp this week.",
          "Does the software need to be updated today? -> No, the software does not need to be updated today.",
          "Do they need to practice French currently? -> No, they do not need to practice French currently."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask if it is necessary for you to buy groceries today.",
        quizDialogue: "______ I need to buy groceries today? -> Yes, you do need to buy groceries today.",
        options: ["Do", "Does", "Have", "Am"],
        answer: "Do",
        feedback: "For present tense questions with 'need to' and first-person subject 'I', we use the auxiliary 'Do'."
      },
      {
        scenario: "Checking if your brother needs to finish his project this week.",
        quizDialogue: "Does he need to finish the project this week? -> No, he ______ need to finish the project this week.",
        options: ["don't", "doesn't", "needn't", "isn't"],
        answer: "doesn't",
        feedback: "The question starts with 'Does he', so the negative response is complete: 'No, he doesn't need to finish'."
      },
      {
        scenario: "You ask if the team is required to submit the documents urgently.",
        quizDialogue: "Do they need to submit the documents urgently? -> Yes, they ______ need to submit the documents urgently.",
        options: ["do", "does", "need", "have"],
        answer: "do",
        feedback: "Questions starting with 'Do they' are answered with the complete: 'Yes, they do need to submit'."
      },
      {
        scenario: "Checking if a smartphone requires a software update currently.",
        quizDialogue: "______ this phone need to be updated now? -> No, it doesn't need to be updated now.",
        options: ["Do", "Does", "Is", "Has"],
        answer: "Does",
        feedback: "The singular subject 'this phone' requires the singular auxiliary 'Does'."
      },
      {
        scenario: "Asking your classmate if they currently need to study for the science test.",
        quizDialogue: "Do you need to study for the test today? -> Yes, I ______ need to study for the test today.",
        options: ["do", "need", "am", "have"],
        answer: "do",
        feedback: "The short response to a present necessity question starting with 'Do you' is complete: 'Yes, I do need to study'."
      }
    ]
  },
  {
    level: 18,
    modal: "could have",
    focus: "Could have - Past Speculation & Regret (yesterday, last week)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask if a past action was possible to achieve (even if it didn't happen), start the question with the modal 'Could', followed by the subject, the helping verb 'have', and the past participle verb.",
        examples: [
          "Could you have completed the work yesterday? -> (Question Structure)",
          "Could they have won the match yesterday? -> (Question Structure)",
          "Could she have lost the keys at school yesterday? -> (Question Structure)",
          "Could we have avoided the accident back then? -> (Question Structure)",
          "Could he have attended the session last night? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm that a past action was possible in a complete sentence, reply with 'Yes', followed by the subject, the past speculation helper 'could have', and the past participle action.",
        examples: [
          "Could you have completed the work yesterday? -> Yes, I could have completed the work yesterday.",
          "Could they have won the match yesterday? -> Yes, they could have won the match yesterday.",
          "Could she have lost the keys at school yesterday? -> Yes, she could have lost the keys at school yesterday.",
          "Could we have avoided the accident back then? -> Yes, we could have avoided the accident back then.",
          "Could he have attended the session last night? -> Yes, he could have attended the session last night."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To state that the past action was completely impossible, reply with 'No', followed by the subject, the negative helper 'could not have' (or 'couldn't have'), and the past participle action.",
        examples: [
          "Could you have completed the work yesterday? -> No, I could not have completed the work yesterday.",
          "Could they have won the match yesterday? -> No, they could not have won the match yesterday.",
          "Could she have written the essay yesterday? -> No, she could not have written the essay yesterday.",
          "Could you have dropped the wallet yesterday? -> No, I could not have dropped the wallet yesterday.",
          "Could they have visited the doctor last night? -> No, they could not have visited the doctor last night."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask if it was possible for your friend to complete the report yesterday.",
        quizDialogue: "______ you have completed the report yesterday? -> Yes, I could have completed the report yesterday.",
        options: ["Should", "Could", "Would", "Shall"],
        answer: "Could",
        feedback: "To ask about past possibility or ability that was not realized, 'Could' is used in the 'Could have' structure."
      },
      {
        scenario: "Checking if a friend thinks the team was capable of winning the match last week.",
        quizDialogue: "Could they have won the match last week? -> No, they ______ won the match last week.",
        options: ["won't have", "couldn't have", "mustn't have", "shouldn't have"],
        answer: "couldn't have",
        feedback: "The negative response to a past capability question is complete: 'No, they couldn't have won the match'."
      },
      {
        scenario: "You ask if your brother could have caught the early bus yesterday.",
        quizDialogue: "Could he have caught the bus yesterday? -> Yes, he ______ caught the bus yesterday.",
        options: ["could have", "will have", "can have", "would have"],
        answer: "could have",
        feedback: "The question starts with 'Could he have', so the positive response is complete: 'Yes, he could have caught the bus'."
      },
      {
        scenario: "Asking if a fire could have been avoided years ago with safety checks.",
        quizDialogue: "______ the fire have been avoided years ago? -> Yes, it could have been avoided years ago.",
        options: ["Could", "Used to", "Should have", "Might"],
        answer: "Could",
        feedback: "Evaluating past possibilities uses the 'Could have' question format."
      },
      {
        scenario: "Asking if your sister could have lost her keys at the cafe yesterday.",
        quizDialogue: "Could she have lost the keys at the cafe yesterday? -> No, she ______ lost the keys at the cafe yesterday.",
        options: ["couldn't have", "won't have", "mustn't have", "shouldn't have"],
        answer: "couldn't have",
        feedback: "The negative response to a past speculation question is complete: 'No, she couldn't have lost the keys'."
      }
    ]
  },
  {
    level: 19,
    modal: "should have",
    focus: "Should have - Past Advice & Regret (last night, previously)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask if a past duty or recommendation was missed (expressing regret), start the question with 'Should', followed by the subject, the helping verb 'have', and the past participle.",
        examples: [
          "Should I have called you last night? -> (Question Structure)",
          "Should they have submitted the files yesterday? -> (Question Structure)",
          "Should she have worn a coat in the rain last week? -> (Question Structure)",
          "Should we have bought the tickets previously? -> (Question Structure)",
          "Should he have answered the email earlier today? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm that the past action was recommended (meaning it was a mistake not to do it), reply with 'Yes', followed by 'should have' and the past participle.",
        examples: [
          "Should I have called you last night? -> Yes, you should have called me last night.",
          "Should they have submitted the files yesterday? -> Yes, they should have submitted the files yesterday.",
          "Should she have worn a coat in the rain last week? -> Yes, she should have worn a coat in the rain last week.",
          "Should we have bought the tickets previously? -> Yes, we should have bought the tickets previously.",
          "Should he have answered the email earlier today? -> Yes, he should have answered the email earlier today."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To confirm that the past action was not recommended, reply with 'No', followed by the negative helper 'should not have' (or 'shouldn't have'), and the past participle.",
        examples: [
          "Should I have called you last night? -> No, you should not have called me last night.",
          "Should I have paid for the lunch yesterday? -> No, you should not have paid for the lunch yesterday.",
          "Should I have stayed up late last night? -> No, you should not have stayed up late last night.",
          "Should she have bought the expensive watch yesterday? -> No, she should not have bought the expensive watch yesterday.",
          "Should he have signed the contract yesterday? -> No, he should not have signed the contract yesterday."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask if it was a mistake that you did not call your mother last night.",
        quizDialogue: "______ I have called you last night? -> Yes, you should have called me last night.",
        options: ["Could", "Should", "Would", "Shall"],
        answer: "Should",
        feedback: "To ask about a past duty or recommendation that was not fulfilled, use 'Should' in the 'Should have' structure."
      },
      {
        scenario: "Checking if a friend thinks the team made a mistake by not checking the data yesterday.",
        quizDialogue: "Should they have checked the data yesterday? -> No, they ______ checked the data yesterday.",
        options: ["won't have", "couldn't have", "shouldn't have", "mustn't have"],
        answer: "shouldn't have",
        feedback: "The negative response to a past recommendation question is complete: 'No, they shouldn't have checked the data'."
      },
      {
        scenario: "You ask if it was recommended for your sister to wear a raincoat yesterday.",
        quizDialogue: "Should she have worn a raincoat yesterday? -> Yes, she ______ worn a raincoat yesterday.",
        options: ["should have", "will have", "can have", "would have"],
        answer: "should have",
        feedback: "The question starts with 'Should she have', so the positive short response is complete: 'Yes, she should have worn a raincoat'."
      },
      {
        scenario: "Asking if we made a mistake by not booking the flight tickets last week.",
        quizDialogue: "______ we have booked the tickets last week? -> Yes, we should have booked the tickets last week.",
        options: ["Should", "Used to", "Could", "Would"],
        answer: "Should",
        feedback: "Inquiring about past duties or recommendations that were missed uses 'Should'."
      },
      {
        scenario: "Asking if your brother should have spoken to the teacher yesterday.",
        quizDialogue: "Should he have spoken to the teacher yesterday? -> No, he ______ spoken to the teacher yesterday.",
        options: ["shouldn't have", "won't have", "mustn't have", "couldn't have"],
        answer: "shouldn't have",
        feedback: "The negative response to a past advice question is complete: 'No, he shouldn't have spoken'."
      }
    ]
  },
  {
    level: 20,
    modal: "would have",
    focus: "Would have - Past Counterfactual (yesterday, back then)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "To ask about imaginary or counterfactual past plans that depended on a condition, start the question with 'Would', followed by the subject, 'have', and the past participle.",
        examples: [
          "Would you have helped me yesterday if I asked? -> (Question Structure)",
          "Would they have traveled last year if they had visas? -> (Question Structure)",
          "Would she have accepted the job back then? -> (Question Structure)",
          "Would the server have crashed yesterday without the fix? -> (Question Structure)",
          "Would they have won the cup last week with more training? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To confirm the counterfactual past plan in a complete sentence, reply with 'Yes', followed by 'would have' and the past participle action.",
        examples: [
          "Would you have helped me yesterday if I asked? -> Yes, I would have helped you yesterday if you asked.",
          "Would they have traveled last year if they had visas? -> Yes, they would have traveled last year if they had visas.",
          "Would she have accepted the job back then? -> Yes, she would have accepted the job back then.",
          "Would the server have crashed yesterday without the fix? -> Yes, the server would have crashed yesterday without the fix.",
          "Would they have won the cup last week with more training? -> Yes, they would have won the cup last week with more training."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To deny the counterfactual past plan in a complete sentence, reply with 'No', followed by the counterfactual helper 'would not have' (or contracted 'wouldn't have').",
        examples: [
          "Would you have helped me yesterday if I asked? -> No, I would not have helped you yesterday if you asked.",
          "Would they have helped us yesterday if they knew? -> No, they would not have helped us yesterday if they knew.",
          "Would he have guided us yesterday if we called? -> No, he would not have guided us yesterday if we called.",
          "Would the engine have failed yesterday without oil? -> No, the engine would not have failed yesterday without oil.",
          "Would she have finished the work yesterday if she slept? -> No, she would not have finished the work yesterday if she slept."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask if your friend would have helped you paint the fence yesterday if you had asked them.",
        quizDialogue: "______ you have helped me yesterday if I asked? -> Yes, I would have helped you yesterday if you asked.",
        options: ["Could", "Would", "Should", "Shall"],
        answer: "Would",
        feedback: "For past hypothetical questions in conditional contexts, 'Would' is used in the 'Would have' structure."
      },
      {
        scenario: "Checking if a friend thinks the system would have crashed yesterday without the software patch.",
        quizDialogue: "Would the system have crashed yesterday without the patch? -> No, it ______ crashed yesterday without the patch.",
        options: ["won't have", "couldn't have", "wouldn't have", "mustn't have"],
        answer: "wouldn't have",
        feedback: "The negative counterfactual response matching 'Would ... have' is complete: 'No, it wouldn't have crashed'."
      },
      {
        scenario: "You ask if your sister would have accepted the scholarship last year.",
        quizDialogue: "Would she have accepted the scholarship last year? -> Yes, she ______ accepted the scholarship last year.",
        options: ["would have", "will have", "can have", "could have"],
        answer: "would have",
        feedback: "The question starts with 'Would she have', so the positive short response is complete: 'Yes, she would have accepted the scholarship'."
      },
      {
        scenario: "Asking if the team would have won the match last week if their captain had played.",
        quizDialogue: "______ they have won last week if the captain played? -> Yes, they would have won last week if the captain played.",
        options: ["Would", "Used to", "Could", "Should"],
        answer: "Would",
        feedback: "Inquiring about a hypothetical past outcome uses the 'Would have' question format."
      },
      {
        scenario: "Asking if your brother would have missed the train yesterday without an alarm.",
        quizDialogue: "Would he have missed the train yesterday without an alarm? -> No, he ______ missed the train yesterday without an alarm.",
        options: ["wouldn't have", "won't have", "mustn't have", "couldn't have"],
        answer: "wouldn't have",
        feedback: "The negative response to a past counterfactual question is complete: 'No, he wouldn't have missed the train'."
      }
    ]
  },
  {
    level: 21,
    modal: "mixed",
    focus: "Mixed Modals - Speed Response Challenge (Summary Level)",
    studyDecks: [
      {
        usecase: "Forming the Question",
        explanation: "In real life, we mix different modals depending on if we are asking about ability (Can/Could), future plans (Will), suggestions (Shall), or advice (Should).",
        examples: [
          "Can you lift this weight now? -> (Question Structure)",
          "Will you call the manager tomorrow? -> (Question Structure)",
          "May I borrow your ruler now? -> (Question Structure)",
          "Shall we watch a show tonight? -> (Question Structure)",
          "Did you use to play violin years ago? -> (Question Structure)"
        ]
      },
      {
        usecase: "Forming the Yes Answer",
        explanation: "To match diverse questions, select the matching modal helper to construct the complete positive response.",
        examples: [
          "Can you lift this weight now? -> Yes, I can lift this weight now.",
          "Will you call the manager tomorrow? -> Yes, I will call the manager tomorrow.",
          "May I borrow your ruler now? -> Yes, you may borrow my ruler now.",
          "Shall we watch a show tonight? -> Yes, let's watch a show tonight.",
          "Did you use to play violin years ago? -> Yes, I did play violin years ago."
        ]
      },
      {
        usecase: "Forming the No Answer",
        explanation: "To match diverse questions in negative answers, use the negative counterpart of the corresponding modal in a complete sentence.",
        examples: [
          "Can you speak French now? -> No, I cannot speak French now.",
          "Will they paint the gate tomorrow? -> No, they will not paint the gate tomorrow.",
          "May we leave the classroom now? -> No, you may not leave the classroom now.",
          "Shall we clean the yard tonight? -> No, let's not clean the yard tonight.",
          "Did she use to cook years ago? -> No, she did not cook years ago."
        ]
      }
    ],
    quizQuestions: [
      {
        scenario: "You want to ask your friend if they were capable of swimming when they were younger.",
        quizDialogue: "______ you swim when you were younger? -> Yes, I could swim when I was younger.",
        options: ["Can", "Could", "Should", "Shall"],
        answer: "Could",
        feedback: "Asking about capability in the past requires the past ability modal 'Could'."
      },
      {
        scenario: "Formally asking the officer for permission to check the register now.",
        quizDialogue: "May I check the register now? -> Yes, you ______ check the register now.",
        options: ["may", "will", "did", "would"],
        answer: "may",
        feedback: "The formal permission question starts with 'May I', so the positive reply is complete: 'Yes, you may check the register'."
      },
      {
        scenario: "You ask your colleague if it was a mistake not to save the spreadsheet yesterday.",
        quizDialogue: "Should we have saved the spreadsheet yesterday? -> Yes, we ______ saved the spreadsheet yesterday.",
        options: ["should have", "will have", "can have", "would have"],
        answer: "should have",
        feedback: "A past recommendation question starting with 'Should we have' is answered with the complete: 'Yes, we should have saved it'."
      },
      {
        scenario: "Suggesting to a teammate that you both start cleaning the project boards today.",
        quizDialogue: "______ we clean the project boards today? -> Yes, let's clean the project boards today.",
        options: ["Shall", "Must", "Would", "Did"],
        answer: "Shall",
        feedback: "'Shall we' is the standard modal used to make cooperative suggestions."
      },
      {
        scenario: "Checking if a client is strictly required to sign a document immediately.",
        quizDialogue: "Must I sign the file now? -> No, you ______ sign the file now.",
        options: ["needn't", "mustn't", "can't", "shouldn't"],
        answer: "needn't",
        feedback: "Answering 'No' to a strict present requirement ('Must I') uses 'needn't' in full sentences to denote absence of necessity."
      }
    ]
  }
];
