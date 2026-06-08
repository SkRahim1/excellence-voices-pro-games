export interface FusionStudyCard {
  title: string;
  explanation: string;
  examples: string[];
}

export interface FusionQuizQuestion {
  scenario: string;
  quizDialogue: string; // dialogue question and answer with "______" placeholders
  options: string[]; // e.g. ["Must / always", "Should / yesterday"]
  answer: string;
  feedback: string;
}

export interface ModalTimeFusionLevel {
  levelIndex: number;
  title: string;
  description: string;
  studyDecks: FusionStudyCard[];
  questions: FusionQuizQuestion[];
}

export const MODAL_TIME_FUSION_LEVELS: ModalTimeFusionLevel[] = [
  {
    levelIndex: 0,
    title: "Present Modals & Frequency Timewords",
    description: "Combine present ability/obligation modals (can, must, need to) with frequency time markers.",
    studyDecks: [
      {
        title: "Obligation & Habitual Frequency",
        explanation: "When describing daily rules or habits, couple modal verbs of obligation ('must', 'need to') with frequency adverbs ('always', 'usually', 'daily') to show continuous necessity.",
        examples: [
          "Question: Must we always wear uniforms? -> Yes, we must always wear them.",
          "Question: Need they check the system daily? -> Yes, they need to check the system daily.",
          "Question: Must you usually arrive early? -> Yes, I must usually arrive early.",
          "Question: Do you need to always practice? -> Yes, I need to always practice.",
          "Question: Must he daily report his progress? -> Yes, he must daily report his progress."
        ]
      },
      {
        title: "Present Ability & Current Timewords",
        explanation: "Present capability modals ('can', 'cannot') represent skills active right now. Pair them with timewords like 'currently', 'nowadays', or 'at present'.",
        examples: [
          "Question: Can you speak fluent English nowadays? -> Yes, I can speak it nowadays.",
          "Question: Can she currently manage the project? -> Yes, she can currently manage it.",
          "Question: Can they access the server at present? -> Yes, they can access it at present.",
          "Question: Can you solve these equations now? -> Yes, I can solve them now.",
          "Question: Can we travel abroad currently? -> No, we cannot travel currently due to restrictions."
        ]
      }
    ],
    questions: [
      {
        scenario: "You want to check if school regulations require students to wear safety goggles in the science lab at all times.",
        quizDialogue: "Question: ______ we ______ wear safety goggles in the lab? -> Yes, we must always wear them for safety.",
        options: ["Must / always", "Can / currently", "Need / nowadays", "Shall / sometimes"],
        answer: "Must / always",
        feedback: "'Must' denotes strong school regulations, while 'always' represents the frequency (at all times) in the present."
      },
      {
        scenario: "Asking a colleague if the software tool is operational and working right now.",
        quizDialogue: "Question: ______ this application ______ process transactions? -> Yes, it can currently process them without bugs.",
        options: ["Can / currently", "Must / always", "Should / yesterday", "Used to / last year"],
        answer: "Can / currently",
        feedback: "Ability/features in the present use the modal 'Can' combined with the active timeword 'currently'."
      },
      {
        scenario: "Confirming if a driver is obliged to inspect the engine fluids every single day.",
        quizDialogue: "Question: ______ you ______ check the engine oil? -> Yes, I need to daily check the oil level.",
        options: ["Need to / daily", "Could / yesterday", "Might / soon", "Would / if then"],
        answer: "Need to / daily",
        feedback: "Ongoing routine requirements are framed using 'need to' or 'must' alongside the frequency timeword 'daily'."
      },
      {
        scenario: "You want to ask if children are permitted to swim in the pool during winter months nowadays.",
        quizDialogue: "Question: ______ children swim here ______? -> No, they cannot swim here nowadays due to the cold.",
        options: ["Can / nowadays", "Must / always", "Should / last week", "Will / tomorrow"],
        answer: "Can / nowadays",
        feedback: "Present general permissions and capabilities use 'Can' combined with the active timeframe 'nowadays'."
      },
      {
        scenario: "You ask your fitness trainer if you are obligated to perform stretches before every workout.",
        quizDialogue: "Question: ______ I ______ stretch before running? -> Yes, you must always stretch to avoid injuries.",
        options: ["Must / always", "Could / yesterday", "Can / currently", "Would / tomorrow"],
        answer: "Must / always",
        feedback: "Strict physical recommendations or obligations use the helper 'Must' paired with 'always'."
      },
      {
        scenario: "Checking if the virtual meeting room is open for joiners at this very moment.",
        quizDialogue: "Question: ______ guests ______ join the meeting? -> Yes, guests can currently enter the lobby.",
        options: ["Can / currently", "Must / always", "Will / tomorrow", "Should / yesterday"],
        answer: "Can / currently",
        feedback: "Present possibility/ability at this moment fits 'Can' and the active time indicator 'currently'."
      },
      {
        scenario: "Asking if employees are required to verify their security badges each time they enter the office.",
        quizDialogue: "Question: ______ employees ______ swipe their badges? -> Yes, they must always swipe them at the gate.",
        options: ["Must / always", "Can / currently", "Could / yesterday", "Need to / last week"],
        answer: "Must / always",
        feedback: "Continuous security compliance uses 'Must' + 'always'."
      },
      {
        scenario: "You are checking if a friend is able to read small font sizes without glasses these days.",
        quizDialogue: "Question: ______ you read small text ______? -> No, I cannot read small text nowadays without my spectacles.",
        options: ["Can / nowadays", "Could / yesterday", "Will / soon", "Must / daily"],
        answer: "Can / nowadays",
        feedback: "Active present abilities are checked with 'Can' paired with the present time word 'nowadays'."
      },
      {
        scenario: "Asking if a student is required to submit a health report on a regular weekly schedule.",
        quizDialogue: "Question: ______ they ______ submit a medical form? -> Yes, they need to weekly submit their status report.",
        options: ["Need to / weekly", "Can / currently", "Should / yesterday", "Might / tomorrow"],
        answer: "Need to / weekly",
        feedback: "'Need to' expresses the necessity, and 'weekly' represents the regular time frequency."
      },
      {
        scenario: "Confirming if the customer helpline has the feature to support live chat at present.",
        quizDialogue: "Question: ______ users ______ contact support? -> Yes, they can currently open a live chat session.",
        options: ["Can / currently", "Must / always", "Will / tomorrow", "Could / last year"],
        answer: "Can / currently",
        feedback: "Capabilities active in the present use 'Can' combined with 'currently'."
      }
    ]
  },
  {
    levelIndex: 1,
    title: "Past Possibility & Relative Timewords",
    description: "Formulate past hypothetical options (could have, might have) with relative past markers (yesterday, last week).",
    studyDecks: [
      {
        title: "Speculative Past Ability",
        explanation: "To discuss possibilities or opportunities in the past that did not occur, pair 'could have' or 'might have' with specific relative past markers like 'yesterday' or 'last week'.",
        examples: [
          "Question: Could they have finished the task yesterday? -> Yes, they could have finished it yesterday.",
          "Question: Might she have left the keys last night? -> Yes, she might have left them last night.",
          "Question: Could you have joined the match yesterday? -> Yes, I could have joined the match yesterday.",
          "Question: Might they have lost their way yesterday? -> Yes, they might have lost their way yesterday.",
          "Question: Could he have completed the run last week? -> Yes, he could have completed it last week."
        ]
      },
      {
        title: "Negative Past Possibilities",
        explanation: "To deny past possibilities, use 'couldn't have' or 'might not have' with the relative time word to explain that the action was impossible.",
        examples: [
          "Question: Could he have arrived yesterday? -> No, he couldn't have arrived yesterday because flights were cancelled.",
          "Question: Might they have finished the project last week? -> No, they might not have finished it last week without tools.",
          "Question: Could you have caught the train yesterday? -> No, I couldn't have caught it yesterday.",
          "Question: Might she have solved the riddle last night? -> No, she might not have solved it last night.",
          "Question: Could the team have won the cup last week? -> No, they couldn't have won it last week."
        ]
      }
    ],
    questions: [
      {
        scenario: "You want to ask if it was possible for your friend to complete the homework on Sunday.",
        quizDialogue: "Question: ______ you ______ completed the homework ______? -> Yes, I could have completed it yesterday if I had worked.",
        options: ["Could / yesterday", "Will / tomorrow", "Can / currently", "Must / always"],
        answer: "Could / yesterday",
        feedback: "Speculating on past possible actions that didn't happen uses 'Could [subject] have' combined with the relative past timeword 'yesterday'."
      },
      {
        scenario: "Checking if there was a possibility that the parcel was sent by post last Wednesday.",
        quizDialogue: "Question: ______ they ______ shipped the order ______? -> Yes, they might have shipped it last week.",
        options: ["Might / last week", "Can / currently", "Should / now", "Will / soon"],
        answer: "Might / last week",
        feedback: "Past possibility uses 'Might' + 'have' combined with the past timeframe 'last week'."
      },
      {
        scenario: "You ask if it was physically impossible for Rohan to catch the early flight yesterday morning.",
        quizDialogue: "Question: Could Rohan have caught the flight? -> No, he ______ caught the flight ______ because he woke up late.",
        options: ["couldn't have / yesterday", "can't / currently", "won't / tomorrow", "mustn't / always"],
        answer: "couldn't have / yesterday",
        feedback: "Denying past ability or possibility uses the helper 'couldn't have' alongside the relative timeword 'yesterday'."
      },
      {
        scenario: "Asking if there was a chance that your sister misplaced her ring at the theater last night.",
        quizDialogue: "Question: ______ she ______ dropped the ring ______? -> Yes, she might have dropped it last night.",
        options: ["Might / last night", "Can / now", "Should / tomorrow", "Must / daily"],
        answer: "Might / last night",
        feedback: "Past speculation uses the modal 'Might' + 'have' paired with the past timeword 'last night'."
      },
      {
        scenario: "You want to confirm if the team had the ability to release the app update last week.",
        quizDialogue: "Question: ______ the team ______ released the build ______? -> Yes, they could have released it last week.",
        options: ["Could / last week", "Will / tomorrow", "Must / daily", "Can / currently"],
        answer: "Could / last week",
        feedback: "Past capacity speculation uses 'Could' + 'have' with the relative time marker 'last week'."
      },
      {
        scenario: "Asking if there was any chance that Amit forgot about the online class yesterday afternoon.",
        quizDialogue: "Question: ______ Amit ______ forgotten the class ______? -> Yes, he might have forgotten it yesterday.",
        options: ["Might / yesterday", "Can / now", "Will / tomorrow", "Must / always"],
        answer: "Might / yesterday",
        feedback: "Past probability uses 'Might' + 'have' with 'yesterday'."
      },
      {
        scenario: "Confirming if it was impossible for the store to deliver the groceries last night due to rain.",
        quizDialogue: "Question: Could the store have delivered the goods? -> No, they ______ delivered them ______ due to the storm.",
        options: ["couldn't have / last night", "can't / currently", "won't / tomorrow", "should / always"],
        answer: "couldn't have / last night",
        feedback: "To deny past capability, use the negative helper 'couldn't have' combined with the timeword 'last night'."
      },
      {
        scenario: "Asking if your group had the opportunity to study together at the library last weekend.",
        quizDialogue: "Question: ______ we ______ studied in the library ______? -> Yes, we could have studied there last week.",
        options: ["Could / last week", "Can / currently", "Will / tomorrow", "Must / daily"],
        answer: "Could / last week",
        feedback: "Hypothetical past ability uses 'Could' + 'have' with the relative past timeword 'last week'."
      },
      {
        scenario: "Speculating if the guide could have lost the path markers yesterday during the trek.",
        quizDialogue: "Question: ______ the guide ______ lost the markers ______? -> Yes, he might have lost them yesterday.",
        options: ["Might / yesterday", "Can / now", "Should / tomorrow", "Must / always"],
        answer: "Might / yesterday",
        feedback: "Uncertain past possibility uses 'Might' + 'have' and the relative marker 'yesterday'."
      },
      {
        scenario: "Confirming if it was impossible for the package to arrive last week without express shipping.",
        quizDialogue: "Question: Could the package have arrived? -> No, it ______ arrived ______ without courier courier services.",
        options: ["couldn't have / last week", "can't / currently", "won't / tomorrow", "should / always"],
        answer: "couldn't have / last week",
        feedback: "To rule out a past possibility completely, use the negative modal 'couldn't have' with 'last week'."
      }
    ]
  },
  {
    levelIndex: 2,
    title: "Future Obligations & Target Timewords",
    description: "Calibrate future necessity modals (must, need to) against target deadline markers (by tomorrow, soon).",
    studyDecks: [
      {
        title: "Future Obligation Deadlines",
        explanation: "To express strict obligations that must be completed before a future target time, use 'must' or 'need to' combined with deadline markers like 'by tomorrow' or 'by next Monday'.",
        examples: [
          "Question: Must we submit the project by tomorrow? -> Yes, we must submit it by tomorrow.",
          "Question: Need you complete the report by next Monday? -> Yes, I need to complete it by next Monday.",
          "Question: Must she pay the fees by tomorrow? -> Yes, she must pay the fees by tomorrow.",
          "Question: Need they register for the camp by next Monday? -> Yes, they need to register by next Monday.",
          "Question: Must you finish the task soon? -> Yes, I must finish it soon."
        ]
      },
      {
        title: "Declining Future Obligation",
        explanation: "To indicate that there is no obligation or necessity in the future, pair 'need not' (or 'don't need to') with the future time marker.",
        examples: [
          "Question: Must we submit the papers by tomorrow? -> No, we don't need to submit them by tomorrow.",
          "Question: Need they pay the rent by next Monday? -> No, they needn't pay it by next Monday.",
          "Question: Must I call the client by tomorrow? -> No, you don't need to call them by tomorrow.",
          "Question: Need she buy the tickets soon? -> No, she needn't buy them soon.",
          "Question: Must you lock the gates by tonight? -> No, I don't need to lock them by tonight."
        ]
      }
    ],
    questions: [
      {
        scenario: "You want to ask if the teacher requires the assignments to be turned in before tomorrow's class.",
        quizDialogue: "Question: ______ we ______ submit the assignments ______? -> Yes, we must submit them by tomorrow.",
        options: ["Must / by tomorrow", "Could / yesterday", "Can / currently", "Used to / last year"],
        answer: "Must / by tomorrow",
        feedback: "Strict future obligations matching a target deadline use the modal 'Must' and the timeword 'by tomorrow'."
      },
      {
        scenario: "Checking if it is necessary for Amit to renew his student registration card before next Monday.",
        quizDialogue: "Question: ______ Amit ______ renew his card ______? -> Yes, he needs to renew it by next Monday.",
        options: ["Need / by next Monday", "Could / yesterday", "Can / now", "Might / soon"],
        answer: "Need / by next Monday",
        feedback: "Future necessity matching a relative deadline uses 'Need' (subject) to 'renew' paired with 'by next Monday'."
      },
      {
        scenario: "Asking if there is no obligation to attend the guest lecture tomorrow.",
        quizDialogue: "Question: Must we attend the lecture tomorrow? -> No, we ______ attend the lecture ______.",
        options: ["don't need to / tomorrow", "couldn't have / yesterday", "can't / currently", "must / always"],
        answer: "don't need to / tomorrow",
        feedback: "To decline obligation for a future event, use the negative form 'don't need to' with the timeword 'tomorrow'."
      },
      {
        scenario: "You want to ask if the company requires the contract files to be signed before tonight's meeting.",
        quizDialogue: "Question: ______ she ______ sign the contract ______? -> Yes, she must sign it by tonight.",
        options: ["Must / by tonight", "Can / currently", "Should / yesterday", "Will / soon"],
        answer: "Must / by tonight",
        feedback: "Future obligation with a specific timeline target uses 'Must' + 'by tonight'."
      },
      {
        scenario: "Checking if there is no necessity to purchase the event tickets immediately.",
        quizDialogue: "Question: Need we buy the tickets now? -> No, we ______ buy the tickets ______.",
        options: ["needn't / soon", "couldn't / yesterday", "can't / currently", "must / daily"],
        answer: "needn't / soon",
        feedback: "To express lack of necessity in the near future, use 'needn't' paired with the time marker 'soon'."
      },
      {
        scenario: "Asking if the team is required to finish the server maintenance before tomorrow morning.",
        quizDialogue: "Question: ______ you ______ finish the maintenance ______? -> Yes, we must finish it by tomorrow.",
        options: ["Must / by tomorrow", "Could / yesterday", "Can / currently", "Used to / last year"],
        answer: "Must / by tomorrow",
        feedback: "Future obligation with a deadline uses 'Must' + 'by tomorrow'."
      },
      {
        scenario: "Checking if Rohan needs to submit his application before next Monday's cutoff.",
        quizDialogue: "Question: ______ Rohan ______ apply ______? -> Yes, he needs to apply by next Monday.",
        options: ["Need / by next Monday", "Can / currently", "Could / last week", "Would / tomorrow"],
        answer: "Need / by next Monday",
        feedback: "Future necessity with a specific deadline uses 'Need' + 'by next Monday'."
      },
      {
        scenario: "Confirming that you are not obligated to submit the feedback forms by tomorrow.",
        quizDialogue: "Question: Must they submit the feedback tomorrow? -> No, they ______ submit the feedback ______.",
        options: ["don't need to / tomorrow", "couldn't / yesterday", "can't / currently", "must / always"],
        answer: "don't need to / tomorrow",
        feedback: "The absence of a future obligation is expressed with 'don't need to' alongside 'tomorrow'."
      },
      {
        scenario: "Asking if a traveler must get a visa before traveling next week.",
        quizDialogue: "Question: ______ she ______ get a visa ______? -> Yes, she must get a visa by next week.",
        options: ["Must / by next week", "Could / yesterday", "Can / now", "Might / soon"],
        answer: "Must / by next week",
        feedback: "Strict obligation prior to a future event uses 'Must' + 'by next week'."
      },
      {
        scenario: "Confirming that it is not necessary to lock the server room by tonight.",
        quizDialogue: "Question: Need you lock the server room tonight? -> No, I ______ lock it ______.",
        options: ["needn't / tonight", "couldn't / yesterday", "can't / now", "must / daily"],
        answer: "needn't / tonight",
        feedback: "Lack of immediate future necessity uses 'needn't' paired with 'tonight'."
      }
    ]
  },
  {
    levelIndex: 3,
    title: "Hypothetical Conditionals & Past Timewords",
    description: "Combine counterfactual conditional modals (would have, could have) with past conditional markers.",
    studyDecks: [
      {
        title: "Counterfactual Past Actions",
        explanation: "To discuss hypothetical actions in the past that depended on a condition, use 'would have' or 'could have' with past markers like 'yesterday if...' or 'last week if...'.",
        examples: [
          "Question: Would you have helped yesterday if I had asked? -> Yes, I would have helped yesterday if you had asked.",
          "Question: Could they have won last week if they had trained? -> Yes, they could have won last week if they had trained.",
          "Question: Would she have attended yesterday if she were free? -> Yes, she would have attended yesterday if she were free.",
          "Question: Could he have completed it yesterday if he had tools? -> Yes, he could have completed it yesterday.",
          "Question: Would they have joined last week if invited? -> Yes, they would have joined last week if invited."
        ]
      },
      {
        title: "Negative Counterfactuals",
        explanation: "To state that a hypothetical past action wouldn't or couldn't have occurred even under a condition, use 'wouldn't have' or 'couldn't have' with the past conditional context.",
        examples: [
          "Question: Would you have traveled yesterday if it rained? -> No, I wouldn't have traveled yesterday if it had rained.",
          "Question: Could they have finished last week without help? -> No, they couldn't have finished last week without help.",
          "Question: Would she have signed yesterday if unhappy? -> No, she wouldn't have signed yesterday if she were unhappy.",
          "Question: Could he have run yesterday if injured? -> No, he couldn't have run yesterday if he were injured.",
          "Question: Would they have built it last week without funds? -> No, they wouldn't have built it last week without funds."
        ]
      }
    ],
    questions: [
      {
        scenario: "You want to ask if your friend would have helped move the furniture yesterday if you had asked them.",
        quizDialogue: "Question: ______ you ______ helped me ______ if I had asked? -> Yes, I would have helped you yesterday if you had asked.",
        options: ["Would / yesterday", "Will / tomorrow", "Should / now", "Can / currently"],
        answer: "Would / yesterday",
        feedback: "Hypothetical past actions that didn't happen use 'Would' + 'have' combined with the past timeword 'yesterday'."
      },
      {
        scenario: "Asking if the team would have won the tournament last week if they had had their captain present.",
        quizDialogue: "Question: ______ they ______ won the match ______ if the captain played? -> Yes, they could have won last week if he played.",
        options: ["Could / last week", "Can / currently", "Should / now", "Will / soon"],
        answer: "Could / last week",
        feedback: "Past hypothetical ability uses 'Could' + 'have' paired with the conditional timeline 'last week'."
      },
      {
        scenario: "Confirming that your classmate would not have visited the museum yesterday if it had been closed.",
        quizDialogue: "Question: Would she have visited the museum? -> No, she ______ visited it ______ if it were closed.",
        options: ["wouldn't have / yesterday", "won't / tomorrow", "can't / currently", "mustn't / daily"],
        answer: "wouldn't have / yesterday",
        feedback: "Negative past counterfactuals use the helper 'wouldn't have' paired with the past timeword 'yesterday'."
      },
      {
        scenario: "Asking if Rohan would have attended the online seminar last night if he had received the link.",
        quizDialogue: "Question: ______ Rohan ______ attended the call ______ if he had the link? -> Yes, he would have attended last night.",
        options: ["Would / last night", "Will / tomorrow", "Should / now", "Can / currently"],
        answer: "Would / last night",
        feedback: "Hypothetical past intention uses 'Would' + 'have' combined with 'last night'."
      },
      {
        scenario: "Confirming that the team could not have completed the building project last week without helper tools.",
        quizDialogue: "Question: Could they have built the house last week? -> No, they ______ built it ______ without tools.",
        options: ["couldn't have / last week", "can't / currently", "won't / tomorrow", "should / always"],
        answer: "couldn't have / last week",
        feedback: "To deny hypothetical past ability, use 'couldn't have' with the timeline 'last week'."
      },
      {
        scenario: "Asking if Sneha would have joined the dance class yesterday if she had been feeling healthy.",
        quizDialogue: "Question: ______ Sneha ______ joined the class ______ if she were well? -> Yes, she would have joined yesterday.",
        options: ["Would / yesterday", "Can / now", "Will / tomorrow", "Must / daily"],
        answer: "Would / yesterday",
        feedback: "Hypothetical past willingness uses 'Would' + 'have' with 'yesterday'."
      },
      {
        scenario: "Confirming that you wouldn't have traveled yesterday if the storm warning had been active.",
        quizDialogue: "Question: Would you have traveled during the storm? -> No, I ______ traveled ______ if the warning was active.",
        options: ["wouldn't have / yesterday", "won't / tomorrow", "can't / now", "should / always"],
        answer: "wouldn't have / yesterday",
        feedback: "Negative past counterfactuals require the helper 'wouldn't have' and the relative marker 'yesterday'."
      },
      {
        scenario: "Asking if the software developers could have solved the issue last week if they had worked overtime.",
        quizDialogue: "Question: ______ they ______ solved the bug ______ if they worked extra hours? -> Yes, they could have solved it last week.",
        options: ["Could / last week", "Can / currently", "Will / tomorrow", "Must / daily"],
        answer: "Could / last week",
        feedback: "Past hypothetical capability uses 'Could' + 'have' with the relative time 'last week'."
      },
      {
        scenario: "Asking if Rohan would have written the letter yesterday if he had had a pen.",
        quizDialogue: "Question: ______ Rohan ______ written the letter ______ if he had a pen? -> Yes, he would have written it yesterday.",
        options: ["Would / yesterday", "Can / now", "Will / tomorrow", "Must / daily"],
        answer: "Would / yesterday",
        feedback: "Hypothetical past actions are introduced with 'Would' + 'have' paired with 'yesterday'."
      },
      {
        scenario: "Confirming that the travelers could not have reached the destination last week without a guide.",
        quizDialogue: "Question: Could they have reached the peak last week? -> No, they ______ reached it ______ without a guide.",
        options: ["couldn't have / last week", "can't / currently", "won't / tomorrow", "should / always"],
        answer: "couldn't have / last week",
        feedback: "Denying past hypothetical capability uses 'couldn't have' combined with 'last week'."
      }
    ]
  },
  {
    levelIndex: 4,
    title: "Advice Regrets & Relative Timewords",
    description: "Master expressions of regret or past advice (should have, ought to have) with past relative markers.",
    studyDecks: [
      {
        title: "Expressing Regret & Past Advice",
        explanation: "To express regret or describe actions that were advisable but did not happen in the past, use 'should have' paired with past relative time markers like 'yesterday' or 'by now'.",
        examples: [
          "Question: Should they have locked the gate yesterday? -> Yes, they should have locked it yesterday.",
          "Question: Should I have called the doctor yesterday? -> Yes, you should have called him yesterday.",
          "Question: Should we have checked the files by now? -> Yes, we should have checked them by now.",
          "Question: Should you have left the keys yesterday? -> Yes, I should have left them yesterday.",
          "Question: Should he have submitted it yesterday? -> Yes, he should have submitted it yesterday."
        ]
      },
      {
        title: "Negative Regrets & Criticisms",
        explanation: "To express that a past action was a mistake or inadvisable, use 'shouldn't have' paired with the relative past timeword.",
        examples: [
          "Question: Should she have spent the money yesterday? -> No, she shouldn't have spent it yesterday.",
          "Question: Should we have walked in the rain last night? -> No, we shouldn't have walked last night.",
          "Question: Should they have ignored the email yesterday? -> No, they shouldn't have ignored it yesterday.",
          "Question: Should you have eaten the cake last night? -> No, I shouldn't have eaten it last night.",
          "Question: Should he have driven fast yesterday? -> No, he shouldn't have driven fast yesterday."
        ]
      }
    ],
    questions: [
      {
        scenario: "You want to state that it was a mistake for your friend not to call the ambulance yesterday.",
        quizDialogue: "Question: ______ you ______ called the ambulance ______? -> Yes, I should have called them yesterday.",
        options: ["Should / yesterday", "Must / tomorrow", "Can / currently", "Will / soon"],
        answer: "Should / yesterday",
        feedback: "Past regrets and advisable actions that were missed use 'Should' + 'have' combined with 'yesterday'."
      },
      {
        scenario: "Stating that locking the main office doors was an action that ought to have been done before this moment.",
        quizDialogue: "Question: ______ the team ______ locked the doors ______? -> Yes, they should have locked them by now.",
        options: ["Should / by now", "Can / currently", "Will / tomorrow", "Could / last week"],
        answer: "Should / by now",
        feedback: "Advisable past actions expected to be completed before the present use 'Should' + 'have' and the timeword 'by now'."
      },
      {
        scenario: "Admitting that buying the expensive watch yesterday was a mistake and shouldn't have occurred.",
        quizDialogue: "Question: Should you have bought the watch? -> No, I ______ bought it ______.",
        options: ["shouldn't have / yesterday", "won't / tomorrow", "can't / now", "mustn't / daily"],
        answer: "shouldn't have / yesterday",
        feedback: "To express regret over an inadvisable past action, use the negative helper 'shouldn't have' with the timeword 'yesterday'."
      },
      {
        scenario: "Expressing that Rohan made a mistake by skipping his medical checkup yesterday afternoon.",
        quizDialogue: "Question: ______ Rohan ______ attended the checkup ______? -> Yes, he should have attended it yesterday.",
        options: ["Should / yesterday", "Will / tomorrow", "Can / now", "Must / always"],
        answer: "Should / yesterday",
        feedback: "Past advisable actions are introduced with 'Should' + 'have' paired with the past timeword 'yesterday'."
      },
      {
        scenario: "Indicating that ignoring the client's urgent email last night was a mistake.",
        quizDialogue: "Question: Should we have ignored the email? -> No, we ______ ignored it ______.",
        options: ["shouldn't have / last night", "won't / tomorrow", "can't / currently", "mustn't / daily"],
        answer: "shouldn't have / last night",
        feedback: "Expressing that a past action was incorrect uses 'shouldn't have' paired with the timeline 'last night'."
      },
      {
        scenario: "Asking if Amit should have completed his homework yesterday before going out.",
        quizDialogue: "Question: ______ Amit ______ finished the homework ______? -> Yes, he should have finished it yesterday.",
        options: ["Should / yesterday", "Can / now", "Will / tomorrow", "Must / always"],
        answer: "Should / yesterday",
        feedback: "Past advice uses 'Should' + 'have' with the relative past timeword 'yesterday'."
      },
      {
        scenario: "Stating that arriving late to the interview yesterday was a mistake that should have been avoided.",
        quizDialogue: "Question: Should you have arrived late? -> No, I ______ arrived late ______.",
        options: ["shouldn't have / yesterday", "won't / tomorrow", "can't / currently", "must / always"],
        answer: "shouldn't have / yesterday",
        feedback: "Expressing regret for a past mistake uses the negative modal 'shouldn't have' paired with 'yesterday'."
      },
      {
        scenario: "Asking if you should have checked the car tire pressure by this time today.",
        quizDialogue: "Question: ______ we ______ checked the tires ______? -> Yes, we should have checked them by now.",
        options: ["Should / by now", "Can / currently", "Will / tomorrow", "Must / daily"],
        answer: "Should / by now",
        feedback: "Advisable past actions that are overdue use 'Should' + 'have' with 'by now'."
      },
      {
        scenario: "Expressing that driving through the flooded road yesterday was a huge mistake.",
        quizDialogue: "Question: Should he have driven through the flood? -> No, he ______ driven through it ______.",
        options: ["shouldn't have / yesterday", "won't / tomorrow", "can't / now", "must / always"],
        answer: "shouldn't have / yesterday",
        feedback: "Advising against a past action that occurred is formulated as 'shouldn't have' with 'yesterday'."
      },
      {
        scenario: "Stating that the manager should have sent the meeting agenda by this moment.",
        quizDialogue: "Question: ______ she ______ sent the agenda ______? -> Yes, she should have sent it by now.",
        options: ["Should / by now", "Will / tomorrow", "Can / currently", "Must / daily"],
        answer: "Should / by now",
        feedback: "Expecting a past action to be complete before the present uses 'Should' + 'have' and 'by now'."
      }
    ]
  },
  {
    levelIndex: 5,
    title: "Permission Requests & Future Timewords",
    description: "Request future permissions (may, could, might) matched with future markers (later tonight, tomorrow).",
    studyDecks: [
      {
        title: "Polite Future Permissions",
        explanation: "To ask for permission to perform an action in the future, start the question with 'May I' or 'Could I', and pair it with future time markers like 'later tonight' or 'tomorrow'.",
        examples: [
          "Question: May I borrow your car later tonight? -> Yes, you may borrow it later tonight.",
          "Question: Could I use the hall tomorrow? -> Yes, you could use it tomorrow.",
          "Question: May we leave early tomorrow? -> Yes, you may leave early tomorrow.",
          "Question: Could I call you later tonight? -> Yes, you could call me later tonight.",
          "Question: May we visit the lab tomorrow? -> Yes, you may visit it tomorrow."
        ]
      },
      {
        title: "Refusing Future Permissions",
        explanation: "To politely refuse permission for a future action, reply with 'No', followed by the subject and the negative modal 'may not' or 'cannot'.",
        examples: [
          "Question: May I borrow your laptop later tonight? -> No, you may not borrow it later tonight.",
          "Question: Could I park here tomorrow? -> No, you cannot park here tomorrow.",
          "Question: May we enter the hall later tonight? -> No, you may not enter it later tonight.",
          "Question: Could I take the day off tomorrow? -> No, you cannot take the day off tomorrow.",
          "Question: May we use the library tomorrow? -> No, you may not use it tomorrow."
        ]
      }
    ],
    questions: [
      {
        scenario: "You want to ask your parent's permission to borrow the car for a trip later tonight.",
        quizDialogue: "Question: ______ I ______ borrow the car ______? -> Yes, you may borrow it later tonight.",
        options: ["May / later tonight", "Should / yesterday", "Must / last week", "Used to / nowadays"],
        answer: "May / later tonight",
        feedback: "Formal requests for permission in the future use the modal 'May' paired with the future timeword 'later tonight'."
      },
      {
        scenario: "Asking the manager politely if it is possible to take a leave tomorrow.",
        quizDialogue: "Question: ______ I ______ take the day off ______? -> Yes, you could take the day off tomorrow.",
        options: ["Could / tomorrow", "Can / currently", "Will / soon", "Must / yesterday"],
        answer: "Could / tomorrow",
        feedback: "Polite queries for future permission use the helper 'Could' with the target timeframe 'tomorrow'."
      },
      {
        scenario: "Asking if guests are not allowed to enter the private gallery later tonight.",
        quizDialogue: "Question: May guests enter the gallery tonight? -> No, they ______ enter it ______.",
        options: ["may not / later tonight", "couldn't / yesterday", "can't / currently", "must / always"],
        answer: "may not / later tonight",
        feedback: "Formally denying permission for a future event uses 'may not' paired with 'later tonight'."
      },
      {
        scenario: "Asking if you can access the laboratory room tomorrow morning.",
        quizDialogue: "Question: ______ we ______ access the laboratory ______? -> Yes, you may access it tomorrow.",
        options: ["May / tomorrow", "Should / yesterday", "Will / soon", "Must / daily"],
        answer: "May / tomorrow",
        feedback: "Asking for official permission tomorrow uses 'May' + 'tomorrow'."
      },
      {
        scenario: "Politely refusing a friend's request to use your office room tomorrow.",
        quizDialogue: "Question: Could I use your desk tomorrow? -> No, you ______ use it ______.",
        options: ["cannot / tomorrow", "couldn't / yesterday", "can't / now", "mustn't / daily"],
        answer: "cannot / tomorrow",
        feedback: "Refusing permission for a future action uses 'cannot' paired with 'tomorrow'."
      },
      {
        scenario: "Asking if you have permission to call the instructor later tonight.",
        quizDialogue: "Question: ______ I ______ call the instructor ______? -> Yes, you may call him later tonight.",
        options: ["May / later tonight", "Could / yesterday", "Will / tomorrow", "Must / daily"],
        answer: "May / later tonight",
        feedback: "Formal future permission uses 'May' + 'later tonight'."
      },
      {
        scenario: "Asking if a student is permitted to submit the application tomorrow.",
        quizDialogue: "Question: ______ I ______ submit the form ______? -> Yes, you could submit it tomorrow.",
        options: ["Could / tomorrow", "Can / currently", "Will / soon", "Must / yesterday"],
        answer: "Could / tomorrow",
        feedback: "Polite future permission uses 'Could' + 'tomorrow'."
      },
      {
        scenario: "Refusing permission for the kids to stay up late tonight.",
        quizDialogue: "Question: May the kids stay up late tonight? -> No, they ______ stay up ______.",
        options: ["may not / later tonight", "couldn't / yesterday", "can't / now", "must / daily"],
        answer: "may not / later tonight",
        feedback: "Denying permission for later tonight uses 'may not' paired with 'later tonight'."
      },
      {
        scenario: "Asking if you may borrow a book from the library tomorrow.",
        quizDialogue: "Question: ______ I ______ borrow a book ______? -> Yes, you may borrow it tomorrow.",
        options: ["May / tomorrow", "Should / yesterday", "Will / soon", "Must / daily"],
        answer: "May / tomorrow",
        feedback: "Asking for future permission uses 'May' + 'tomorrow'."
      },
      {
        scenario: "Politely refusing permission to host a party in the apartment tomorrow.",
        quizDialogue: "Question: Could we host a party tomorrow? -> No, you ______ host it ______.",
        options: ["cannot / tomorrow", "couldn't / yesterday", "can't / now", "must / always"],
        answer: "cannot / tomorrow",
        feedback: "Denying future permission uses 'cannot' paired with 'tomorrow'."
      }
    ]
  },
  {
    levelIndex: 6,
    title: "Ability Calibrations & Duration Timewords",
    description: "Pair ability modals (can, was able to) with duration expressions (for three years, since last month).",
    studyDecks: [
      {
        title: "Active Ability Durations",
        explanation: "To show that a skill or capability has been active over a period of time up to the present, combine 'can' or 'have been able to' with duration indicators like 'for three years' or 'since last month'.",
        examples: [
          "Question: Can you play the piano? -> Yes, I can play it, and I have practiced for three years.",
          "Question: Can she speak German? -> Yes, she can speak it, and she has studied since last month.",
          "Question: Can they code in Python? -> Yes, they can code, and they have done so for three years.",
          "Question: Can he run long distances? -> Yes, he can run, and he has trained since last month.",
          "Question: Can you draw cartoons? -> Yes, I can draw, and I have done so for three years."
        ]
      },
      {
        title: "Past Ability Durations",
        explanation: "To describe abilities that were held in the past over a specific duration, use 'could' or 'was able to' with the past duration timeword.",
        examples: [
          "Question: Could you swim when younger? -> Yes, I was able to swim, and I took lessons for three years.",
          "Question: Could she drive last year? -> Yes, she could drive, and she had a license since last month.",
          "Question: Could they cook back then? -> Yes, they were able to cook, and they ran a bakery for three years.",
          "Question: Could he paint in college? -> Yes, he could paint, and he held art shows for three years.",
          "Question: Could you speak Spanish in Spain? -> Yes, I could speak it because I lived there for three years."
        ]
      }
    ],
    questions: [
      {
        scenario: "You want to state that she has the ability to speak French and has practiced this skill for three years.",
        quizDialogue: "Question: ______ she ______ speak French? -> Yes, she can speak French, and she has practiced it ______.",
        options: ["Can / for three years", "Could / yesterday", "Will / tomorrow", "Must / daily"],
        answer: "Can / for three years",
        feedback: "Active present ability paired with a duration uses the modal 'Can' and the time expression 'for three years'."
      },
      {
        scenario: "Asking if Rohan had the capability to paint landscapes during his college years.",
        quizDialogue: "Question: ______ Rohan ______ paint landscapes? -> Yes, he was able to paint, and he studied art ______.",
        options: ["Could / for three years", "Can / currently", "Will / soon", "Must / daily"],
        answer: "Could / for three years",
        feedback: "Past ability held over a duration uses 'Could' (subject) 'paint' combined with 'for three years'."
      },
      {
        scenario: "Confirming that she has been able to drive a car since last month.",
        quizDialogue: "Question: Can she drive a car? -> Yes, she ______ drive, and she has been driving ______.",
        options: ["can / since last month", "could / yesterday", "will / tomorrow", "must / daily"],
        answer: "can / since last month",
        feedback: "Active present capability with a starting point uses 'can' paired with 'since last month'."
      },
      {
        scenario: "Asking if your grandfather had the ability to run fast in his youth.",
        quizDialogue: "Question: ______ you ______ run fast? -> Yes, I could run fast, and I competed in races ______.",
        options: ["Could / for three years", "Can / now", "Will / tomorrow", "Must / always"],
        answer: "Could / for three years",
        feedback: "Past capability over a duration uses the modal 'Could' + 'for three years'."
      },
      {
        scenario: "Confirming that the team has been able to build websites since last month's training.",
        quizDialogue: "Question: Can they build websites? -> Yes, they ______ build them ______.",
        options: ["can / since last month", "could / yesterday", "won't / tomorrow", "should / always"],
        answer: "can / since last month",
        feedback: "Present ability since a specific starting time uses 'can' paired with 'since last month'."
      },
      {
        scenario: "Asking if Amit had the ability to play violin during his high school years.",
        quizDialogue: "Question: ______ Amit ______ play the violin? -> Yes, he could play it, and he practiced ______.",
        options: ["Could / for three years", "Can / now", "Will / tomorrow", "Must / always"],
        answer: "Could / for three years",
        feedback: "Past capability over a duration uses the modal 'Could' + 'for three years'."
      },
      {
        scenario: "Confirming that Rohan has the ability to speak fluent Japanese and has practiced it since last month.",
        quizDialogue: "Question: Can Rohan speak Japanese? -> Yes, he ______ speak it, and he has studied ______.",
        options: ["can / since last month", "could / yesterday", "will / tomorrow", "should / always"],
        answer: "can / since last month",
        feedback: "Present capability with a starting point uses 'can' paired with 'since last month'."
      },
      {
        scenario: "Asking if the chef was able to manage the kitchen for three years during his previous job.",
        quizDialogue: "Question: ______ the chef ______ manage the kitchen? -> Yes, he could manage it ______.",
        options: ["Could / for three years", "Can / currently", "Will / tomorrow", "Must / daily"],
        answer: "Could / for three years",
        feedback: "Past capability held over a specific duration uses 'Could' + 'for three years'."
      },
      {
        scenario: "Confirming that she has been able to play basketball since last month's coaching camp.",
        quizDialogue: "Question: Can she play basketball? -> Yes, she ______ play ______.",
        options: ["can / since last month", "could / yesterday", "will / soon", "must / daily"],
        answer: "can / since last month",
        feedback: "Active present ability with a starting timeframe uses 'can' paired with 'since last month'."
      },
      {
        scenario: "Asking if the coder could write games for three years in his previous company.",
        quizDialogue: "Question: ______ you ______ write games? -> Yes, I could write them ______.",
        options: ["Could / for three years", "Can / currently", "Will / tomorrow", "Must / always"],
        answer: "Could / for three years",
        feedback: "Past capability over a duration uses the modal 'Could' + 'for three years'."
      }
    ]
  },
  {
    levelIndex: 7,
    title: "Modal Deductions & Specific Past Timewords",
    description: "Formulate logical past deductions (must have, can't have) based on specific past events.",
    studyDecks: [
      {
        title: "Logical Deductions (Certainty)",
        explanation: "To express strong certainty about a past action, use 'must have' followed by a past participle, paired with specific past markers like 'last night' or 'at that moment'.",
        examples: [
          "Question: Must he have left the keys last night? -> Yes, he must have left them last night because the office was locked.",
          "Question: Must she have called last night? -> Yes, she must have called last night.",
          "Question: Must they have finished yesterday? -> Yes, they must have finished yesterday.",
          "Question: Must the glass have broken last night? -> Yes, it must have broken last night.",
          "Question: Must they have left the meeting early? -> Yes, they must have left early."
        ]
      },
      {
        title: "Logical Deductions (Impossibility)",
        explanation: "To express that a past event was logically impossible, use 'can't have' (or 'cannot have') paired with the specific past time marker.",
        examples: [
          "Question: Can he have stolen the money last night? -> No, he can't have stolen it last night because he was with me.",
          "Question: Can they have finished the task last night? -> No, they can't have finished it last night.",
          "Question: Can she have left yesterday? -> No, she can't have left yesterday.",
          "Question: Can the car have broken down last night? -> No, it can't have broken down last night.",
          "Question: Can he have completed the run yesterday? -> No, he can't have completed it yesterday."
        ]
      }
    ],
    questions: [
      {
        scenario: "You are certain that Rohan left his wallet at the restaurant last night because he had it there.",
        quizDialogue: "Question: ______ Rohan ______ left his wallet ______? -> Yes, he must have left it last night.",
        options: ["Must / last night", "Should / tomorrow", "Can / currently", "Will / soon"],
        answer: "Must / last night",
        feedback: "Logical past deductions of certainty use the modal 'Must' + 'have' paired with the past timeword 'last night'."
      },
      {
        scenario: "Stating that it is logically impossible that Sneha broke the expensive vase yesterday as she was out.",
        quizDialogue: "Question: Can Sneha have broken the vase? -> No, she ______ broken it ______ because she was out.",
        options: ["can't have / yesterday", "mustn't / tomorrow", "couldn't / now", "won't / daily"],
        answer: "can't have / yesterday",
        feedback: "Past logical impossibility deductions use 'can't have' paired with the relative past timeword 'yesterday'."
      },
      {
        scenario: "You are sure that the dog barked last night because the guard heard it.",
        quizDialogue: "Question: ______ the dog ______ barked ______? -> Yes, it must have barked last night.",
        options: ["Must / last night", "Can / now", "Will / tomorrow", "Should / yesterday"],
        answer: "Must / last night",
        feedback: "Deductions of certainty about the past use 'Must' + 'have' with 'last night'."
      },
      {
        scenario: "Stating that it is logically impossible that the flight departed yesterday before the scheduled time.",
        quizDialogue: "Question: Can the flight have departed early? -> No, it ______ departed ______ before schedule.",
        options: ["can't have / yesterday", "mustn't / tomorrow", "couldn't / now", "won't / always"],
        answer: "can't have / yesterday",
        feedback: "To express logical impossibility in the past, use 'can't have' alongside the past marker 'yesterday'."
      },
      {
        scenario: "You are certain that the postman delivered the letter yesterday as it is in the mailbox.",
        quizDialogue: "Question: ______ the postman ______ delivered the letter ______? -> Yes, he must have delivered it yesterday.",
        options: ["Must / yesterday", "Can / currently", "Will / soon", "Should / daily"],
        answer: "Must / yesterday",
        feedback: "Past certainty deduction uses 'Must' + 'have' paired with 'yesterday'."
      },
      {
        scenario: "Expressing that it is logically impossible for the computer to have crashed last night as it is running fine.",
        quizDialogue: "Question: Can the computer have crashed? -> No, it ______ crashed ______ because it works perfectly.",
        options: ["can't have / last night", "mustn't / tomorrow", "couldn't / now", "won't / always"],
        answer: "can't have / last night",
        feedback: "Logical impossibility in the past uses 'can't have' paired with 'last night'."
      },
      {
        scenario: "You are sure the heater was left on last night because the room is extremely hot this morning.",
        quizDialogue: "Question: ______ the heater ______ been left on ______? -> Yes, it must have been left on last night.",
        options: ["Must / last night", "Can / now", "Will / tomorrow", "Should / yesterday"],
        answer: "Must / last night",
        feedback: "Strong logical past deduction uses the modal 'Must' + 'have' with 'last night'."
      },
      {
        scenario: "Stating that it is logically impossible that Rohan wrote the report yesterday because he doesn't have the login.",
        quizDialogue: "Question: Can Rohan have written the report? -> No, he ______ written it ______ without access.",
        options: ["can't have / yesterday", "mustn't / tomorrow", "couldn't / now", "won't / daily"],
        answer: "can't have / yesterday",
        feedback: "To deny past logical possibility, use 'can't have' alongside 'yesterday'."
      },
      {
        scenario: "You are certain the phone rang last night because there is a missed call notification.",
        quizDialogue: "Question: ______ the phone ______ rung ______? -> Yes, it must have rung last night.",
        options: ["Must / last night", "Can / now", "Will / tomorrow", "Should / yesterday"],
        answer: "Must / last night",
        feedback: "Deductions of past certainty use 'Must' + 'have' with 'last night'."
      },
      {
        scenario: "Stating that it is logically impossible that the shop was open last night during the blackout.",
        quizDialogue: "Question: Can the shop have been open? -> No, it ______ open ______ during the power cut.",
        options: ["can't have / last night", "mustn't / tomorrow", "couldn't / now", "won't / always"],
        answer: "can't have / last night",
        feedback: "Deductions of logical impossibility use 'can't have' paired with 'last night'."
      }
    ]
  },
  {
    levelIndex: 8,
    title: "Intentions & Willingness & Precise Timelines",
    description: "Align future intentions (will, would) with specific timelines (by next Monday, back in those days).",
    studyDecks: [
      {
        title: "Future Intention Targets",
        explanation: "To express firm decisions or willingness that will be completed by a specific future target, use the modal 'will' paired with timewords like 'by next Monday' or 'tomorrow'.",
        examples: [
          "Question: Will you send the report by next Monday? -> Yes, I will send the report by next Monday.",
          "Question: Will they finish the construction by next Monday? -> Yes, they will finish it by next Monday.",
          "Question: Will you call the client tomorrow? -> Yes, I will call the client tomorrow.",
          "Question: Will she write the letter by next Monday? -> Yes, she will write it by next Monday.",
          "Question: Will we complete the setup tomorrow? -> Yes, we will complete the setup tomorrow."
        ]
      },
      {
        title: "Past Willingness & Habits",
        explanation: "To describe habitual willingness or actions that someone used to do in the past, use the modal 'would' paired with past timelines like 'back in those days' or 'years ago'.",
        examples: [
          "Question: Would you play outdoor games back in those days? -> Yes, I would play outdoor games back in those days.",
          "Question: Would they visit the beach years ago? -> Yes, they would visit the beach years ago.",
          "Question: Would she cook dinner back in those days? -> Yes, she would cook dinner back in those days.",
          "Question: Would he draw paintings years ago? -> Yes, he would draw paintings years ago.",
          "Question: Would you read books back in those days? -> Yes, I would read books back in those days."
        ]
      }
    ],
    questions: [
      {
        scenario: "You want to confirm if you will send the office project report before next Monday.",
        quizDialogue: "Question: ______ you ______ send the report ______? -> Yes, I will send it by next Monday.",
        options: ["Will / by next Monday", "Could / yesterday", "Must / last week", "Used to / nowadays"],
        answer: "Will / by next Monday",
        feedback: "Future intention matching a specific calendar timeline uses the modal 'Will' and 'by next Monday'."
      },
      {
        scenario: "Asking your grandmother if she had the habit of cooking on firewood ovens in her childhood days.",
        quizDialogue: "Question: ______ you ______ cook on firewood ______? -> Yes, I would cook on firewood back in those days.",
        options: ["Would / back in those days", "Will / tomorrow", "Can / currently", "Must / daily"],
        answer: "Would / back in those days",
        feedback: "Past habitual actions and willingness use the modal 'Would' paired with the past timeframe 'back in those days'."
      },
      {
        scenario: "Confirming that you will not attend the sports practice session tomorrow.",
        quizDialogue: "Question: Will you attend the practice tomorrow? -> No, I ______ attend the practice ______.",
        options: ["won't / tomorrow", "couldn't / yesterday", "can't / currently", "mustn't / daily"],
        answer: "won't / tomorrow",
        feedback: "Declining future willingness uses the negative helper 'won't' alongside 'tomorrow'."
      },
      {
        scenario: "Asking if the builders will complete the apartment roof setup before next Monday.",
        quizDialogue: "Question: ______ they ______ finish the roof ______? -> Yes, they will finish it by next Monday.",
        options: ["Will / by next Monday", "Would / back in those days", "Should / now", "Can / currently"],
        answer: "Will / by next Monday",
        feedback: "Future intention with a specific target uses 'Will' + 'by next Monday'."
      },
      {
        scenario: "Asking if Amit would walk to the school years ago when there were no school buses.",
        quizDialogue: "Question: ______ Amit ______ walk to school ______? -> Yes, he would walk to school back in those days.",
        options: ["Would / back in those days", "Will / tomorrow", "Can / currently", "Must / daily"],
        answer: "Would / back in those days",
        feedback: "Past regular willingness/habits use 'Would' + 'back in those days'."
      },
      {
        scenario: "Asking if she will submit the invoice before next Monday.",
        quizDialogue: "Question: ______ she ______ send the invoice ______? -> Yes, she will send it by next Monday.",
        options: ["Will / by next Monday", "Would / back in those days", "Could / yesterday", "Can / currently"],
        answer: "Will / by next Monday",
        feedback: "Future intention with a specific target uses 'Will' + 'by next Monday'."
      },
      {
        scenario: "Confirming that you will not travel to Mumbai tomorrow due to a cancelled ticket.",
        quizDialogue: "Question: Will you travel to Mumbai tomorrow? -> No, I ______ travel ______.",
        options: ["won't / tomorrow", "couldn't / yesterday", "can't / now", "should / always"],
        answer: "won't / tomorrow",
        feedback: "Negative future intention is expressed with the contracted 'won't' and the timeline 'tomorrow'."
      },
      {
        scenario: "Asking if you would listen to radio programs during the early 90s.",
        quizDialogue: "Question: ______ you ______ listen to the radio ______? -> Yes, I would listen to the radio back in those days.",
        options: ["Would / back in those days", "Will / tomorrow", "Can / currently", "Must / daily"],
        answer: "Would / back in those days",
        feedback: "Past habitual willingness uses the modal 'Would' + 'back in those days'."
      },
      {
        scenario: "Confirming that they will finish the coding sprint before next Monday.",
        quizDialogue: "Question: ______ they ______ finish the sprint ______? -> Yes, they will finish it by next Monday.",
        options: ["Will / by next Monday", "Would / back in those days", "Could / yesterday", "Can / currently"],
        answer: "Will / by next Monday",
        feedback: "Future scheduled intention uses 'Will' + 'by next Monday'."
      },
      {
        scenario: "Confirming that the child would not eat vegetables years ago.",
        quizDialogue: "Question: Would he eat vegetables back then? -> No, he ______ eat them ______.",
        options: ["wouldn't / back in those days", "won't / tomorrow", "can't / now", "must / always"],
        answer: "wouldn't / back in those days",
        feedback: "Negative past willingness uses the modal 'wouldn't' paired with 'back in those days'."
      }
    ]
  },
  {
    levelIndex: 9,
    title: "Perfect Modal Passive & Deadline Timewords",
    description: "Navigate passive structures (should have been, must have been) with specific past deadlines.",
    studyDecks: [
      {
        title: "Past Passive Obligations",
        explanation: "To describe actions that were required to be completed on a target object in the past, use the perfect passive helper 'should have been' or 'must have been' with deadlines like 'before last Tuesday' or 'by yesterday'.",
        examples: [
          "Question: Should the report have been submitted before last Tuesday? -> Yes, it should have been submitted before last Tuesday.",
          "Question: Must the bills have been paid by yesterday? -> Yes, they must have been paid by yesterday.",
          "Question: Should the package have been delivered before last Tuesday? -> Yes, it should have been delivered before last Tuesday.",
          "Question: Must the server have been upgraded by yesterday? -> Yes, it must have been upgraded by yesterday.",
          "Question: Should the keys have been returned by yesterday? -> Yes, they should have been returned by yesterday."
        ]
      },
      {
        title: "Negative Passive Regrets",
        explanation: "To indicate that a past passive action was not required or was done incorrectly, pair 'shouldn't have been' or 'needn't have been' with the deadline time marker.",
        examples: [
          "Question: Should the tree have been cut before last Tuesday? -> No, it shouldn't have been cut before last Tuesday.",
          "Question: Need the files have been printed by yesterday? -> No, they needn't have been printed by yesterday.",
          "Question: Should the food have been thrown before last Tuesday? -> No, it shouldn't have been thrown before last Tuesday.",
          "Question: Need the meeting have been cancelled by yesterday? -> No, it needn't have been cancelled by yesterday.",
          "Question: Should the building have been painted by yesterday? -> No, it shouldn't have been painted by yesterday."
        ]
      }
    ],
    questions: [
      {
        scenario: "You want to ask if the student project files were expected to be uploaded before last Tuesday.",
        quizDialogue: "Question: ______ the project ______ uploaded ______? -> Yes, it should have been uploaded before last Tuesday.",
        options: ["Should / before last Tuesday", "Must / tomorrow", "Can / currently", "Will / soon"],
        answer: "Should / before last Tuesday",
        feedback: "Past passive advisable requirements use 'Should [object] have been' paired with 'before last Tuesday'."
      },
      {
        scenario: "Checking if there was a strict necessity that the phone bills were settled by yesterday's deadline.",
        quizDialogue: "Question: ______ the bills ______ paid ______? -> Yes, they must have been paid by yesterday.",
        options: ["Must / by yesterday", "Could / tomorrow", "Can / now", "Will / soon"],
        answer: "Must / by yesterday",
        feedback: "Strong past passive obligation/certainty uses 'Must [object] have been' paired with 'by yesterday'."
      },
      {
        scenario: "Confirming that the trees should not have been cut down before last Tuesday's environmental order.",
        quizDialogue: "Question: Should the trees have been cut? -> No, they ______ cut ______.",
        options: ["shouldn't have been / before last Tuesday", "won't be / tomorrow", "can't be / now", "mustn't / daily"],
        answer: "shouldn't have been / before last Tuesday",
        feedback: "Negative past passive regrets use 'shouldn't have been' paired with 'before last Tuesday'."
      },
      {
        scenario: "Asking if the package was expected to be delivered before last Tuesday's delivery window.",
        quizDialogue: "Question: ______ the package ______ delivered ______? -> Yes, it should have been delivered before last Tuesday.",
        options: ["Should / before last Tuesday", "Will / tomorrow", "Can / currently", "Must / daily"],
        answer: "Should / before last Tuesday",
        feedback: "Past passive expectations use 'Should' + 'have been' with 'before last Tuesday'."
      },
      {
        scenario: "Confirming that the documents did not need to be printed by yesterday's meeting.",
        quizDialogue: "Question: Need the documents have been printed? -> No, they ______ printed ______.",
        options: ["needn't have been / by yesterday", "couldn't be / yesterday", "can't be / now", "mustn't / always"],
        answer: "needn't have been / by yesterday",
        feedback: "Absence of past necessity in passive voice uses 'needn't have been' paired with 'by yesterday'."
      },
      {
        scenario: "Asking if the server room was required to be upgraded before last Tuesday.",
        quizDialogue: "Question: ______ the server ______ upgraded ______? -> Yes, it should have been upgraded before last Tuesday.",
        options: ["Should / before last Tuesday", "Can / now", "Will / tomorrow", "Must / daily"],
        answer: "Should / before last Tuesday",
        feedback: "Past passive expectation uses 'Should' + 'have been' with 'before last Tuesday'."
      },
      {
        scenario: "Asking if the taxes must have been paid by yesterday.",
        quizDialogue: "Question: ______ the taxes ______ paid ______? -> Yes, they must have been paid by yesterday.",
        options: ["Must / by yesterday", "Could / yesterday", "Can / now", "Will / soon"],
        answer: "Must / by yesterday",
        feedback: "Strong past passive obligation uses 'Must' + 'have been' with 'by yesterday'."
      },
      {
        scenario: "Confirming that the car should not have been repaired before last Tuesday's inspection.",
        quizDialogue: "Question: Should the car have been repaired? -> No, it ______ repaired ______.",
        options: ["shouldn't have been / before last Tuesday", "won't be / tomorrow", "can't / now", "must / always"],
        answer: "shouldn't have been / before last Tuesday",
        feedback: "Negative past passive regrets use 'shouldn't have been' paired with 'before last Tuesday'."
      },
      {
        scenario: "Asking if the letters should have been sent by yesterday's dispatch.",
        quizDialogue: "Question: ______ the letters ______ sent ______? -> Yes, they should have been sent by yesterday.",
        options: ["Should / by yesterday", "Will / tomorrow", "Can / currently", "Must / daily"],
        answer: "Should / by yesterday",
        feedback: "Past passive expectation uses 'Should' + 'have been' with 'by yesterday'."
      },
      {
        scenario: "Confirming that the meeting did not need to be cancelled by yesterday's announcement.",
        quizDialogue: "Question: Need the meeting have been cancelled? -> No, it ______ cancelled ______.",
        options: ["needn't have been / by yesterday", "couldn't be / yesterday", "can't / now", "must / always"],
        answer: "needn't have been / by yesterday",
        feedback: "Absence of past necessity in passive voice uses 'needn't have been' paired with 'by yesterday'."
      }
    ]
  },
  {
    levelIndex: 10,
    title: "Mixed Advanced Dialogues Fusion",
    description: "The ultimate gladiator challenge combining modals, time expressions, and Yes/No conversational syntax.",
    studyDecks: [
      {
        title: "Complex Temporal Logic",
        explanation: "This final review combines active, passive, hypothetical, and obligational grammar elements. Select helper responses that match both the time frame and the structural auxiliary verb.",
        examples: [
          "Question: Should you have completed it yesterday? -> Yes, I should have completed it yesterday.",
          "Question: Will you send the file by next Monday? -> Yes, I will send it by next Monday.",
          "Question: Can she write the letters nowadays? -> Yes, she can write them nowadays.",
          "Question: Could Rohan swim years ago? -> Yes, he could swim years ago.",
          "Question: Would they join the class tomorrow if invited? -> Yes, they would join tomorrow."
        ]
      },
      {
        title: "Conversational Consistency",
        explanation: "Always match the pronouns, polarity, helper verbs, and time frames in complete responses. Do not shift tenses mid-sentence.",
        examples: [
          "Question: Must she check the server daily? -> No, she don't need to check the server daily.",
          "Question: Could Rohan have run yesterday? -> No, he couldn't have run yesterday.",
          "Question: May we leave tomorrow? -> No, you may not leave tomorrow.",
          "Question: Would she have attended yesterday? -> No, she wouldn't have attended yesterday.",
          "Question: Need they pay by tomorrow? -> No, they needn't pay by tomorrow."
        ]
      }
    ],
    questions: [
      {
        scenario: "Asking if a client was expected to be contacted before last Tuesday's meeting.",
        quizDialogue: "Question: ______ the client ______ contacted ______? -> Yes, he should have been contacted before last Tuesday.",
        options: ["Should / before last Tuesday", "Must / tomorrow", "Can / currently", "Will / soon"],
        answer: "Should / before last Tuesday",
        feedback: "Past passive advisable actions use 'Should' + 'have been' with 'before last Tuesday'."
      },
      {
        scenario: "You are sure your brother finished the book last night as he was reading it all day.",
        quizDialogue: "Question: ______ he ______ finished the book ______? -> Yes, he must have finished it last night.",
        options: ["Must / last night", "Can / now", "Will / tomorrow", "Should / yesterday"],
        answer: "Must / last night",
        feedback: "Deductions of certainty about the past use 'Must' + 'have' with 'last night'."
      },
      {
        scenario: "Asking your grandfather if he would play football back in his school days.",
        quizDialogue: "Question: ______ you ______ play football ______? -> Yes, I would play football back in those days.",
        options: ["Would / back in those days", "Will / tomorrow", "Can / currently", "Must / daily"],
        answer: "Would / back in those days",
        feedback: "Past habitual willingness uses 'Would' + 'back in those days'."
      },
      {
        scenario: "Checking if you will send the project files before next Monday's deadline.",
        quizDialogue: "Question: ______ you ______ send the files ______? -> Yes, I will send them by next Monday.",
        options: ["Will / by next Monday", "Could / yesterday", "Must / last week", "Used to / nowadays"],
        answer: "Will / by next Monday",
        feedback: "Future intention with a specific target timeline uses 'Will' + 'by next Monday'."
      },
      {
        scenario: "Asking if she has the ability to speak fluent Spanish nowadays.",
        quizDialogue: "Question: ______ she speak Spanish ______? -> Yes, she can speak Spanish nowadays.",
        options: ["Can / nowadays", "Could / yesterday", "Will / tomorrow", "Must / daily"],
        answer: "Can / nowadays",
        feedback: "Active present ability uses 'Can' paired with the present time word 'nowadays'."
      },
      {
        scenario: "Asking if the team would have won the championship last week if they had trained more.",
        quizDialogue: "Question: ______ they ______ won the cup ______ if they trained? -> Yes, they could have won last week.",
        options: ["Could / last week", "Can / currently", "Will / tomorrow", "Must / daily"],
        answer: "Could / last week",
        feedback: "Past hypothetical capability uses 'Could' + 'have' with 'last week'."
      },
      {
        scenario: "Confirming that the reports did not need to be printed by yesterday's deadline.",
        quizDialogue: "Question: Need the reports have been printed? -> No, they ______ printed ______.",
        options: ["needn't have been / by yesterday", "couldn't be / yesterday", "can't be / now", "mustn't / always"],
        answer: "needn't have been / by yesterday",
        feedback: "Absence of past necessity in passive voice uses 'needn't have been' paired with 'by yesterday'."
      },
      {
        scenario: "Stating that ignoring the warning yesterday was a mistake that should have been avoided.",
        quizDialogue: "Question: Should you have ignored the warning? -> No, I ______ ignored it ______.",
        options: ["shouldn't have / yesterday", "won't / tomorrow", "can't / currently", "must / always"],
        answer: "shouldn't have / yesterday",
        feedback: "Expressing regret for a past mistake uses the negative modal 'shouldn't have' paired with 'yesterday'."
      },
      {
        scenario: "Confirming that it is not necessary to lock the archive files by tonight.",
        quizDialogue: "Question: Need you lock the files tonight? -> No, I ______ lock them ______.",
        options: ["needn't / tonight", "couldn't / yesterday", "can't / now", "must / daily"],
        answer: "needn't / tonight",
        feedback: "Lack of immediate future necessity uses 'needn't' paired with 'tonight'."
      },
      {
        scenario: "Stating that it is logically impossible that the shop was open last night during the blackout.",
        quizDialogue: "Question: Can the shop have been open? -> No, it ______ open ______ during the power cut.",
        options: ["can't have / last night", "mustn't / tomorrow", "couldn't / now", "won't / always"],
        answer: "can't have / last night",
        feedback: "Deductions of logical impossibility use 'can't have' paired with 'last night'."
      }
    ]
  }
];
