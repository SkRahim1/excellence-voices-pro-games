export interface ChessChallenge {
  id: string;
  type: 'meaning' | 'synonym' | 'antonym' | 'grammar' | 'scramble' | 'correction' | 'word-id' | 'reading' | 'story';
  question: string;
  options: string[];
  answer: number; // 0-indexed index of correct option
  clue: string;
}

export const CHESS_CHALLENGES: {
  beginner: ChessChallenge[];
  intermediate: ChessChallenge[];
  advanced: ChessChallenge[];
} = {
  beginner: [
    {
      id: 'b-m-1',
      type: 'meaning',
      question: 'What is the meaning of "Brave"?',
      options: ['Scared of everything', 'Showing courage or no fear', 'Being very quiet', 'Running away quickly'],
      answer: 1,
      clue: 'Think of a hero facing a dragon without fear.'
    },
    {
      id: 'b-s-1',
      type: 'synonym',
      question: 'Choose the synonym (same meaning) of "Happy".',
      options: ['Sad', 'Angry', 'Glad', 'Sleepy'],
      answer: 2,
      clue: 'It starts with "Gl" and describes how you feel when you win a prize.'
    },
    {
      id: 'b-a-1',
      type: 'antonym',
      question: 'Choose the antonym (opposite meaning) of "Strong".',
      options: ['Heavy', 'Weak', 'Mighty', 'Brave'],
      answer: 1,
      clue: 'It is the opposite of powerful.'
    },
    {
      id: 'b-g-1',
      type: 'grammar',
      question: 'Complete the sentence: The dog ___ after the cat yesterday.',
      options: ['runs', 'runned', 'ran', 'running'],
      answer: 2,
      clue: 'It is the past tense of the verb "run".'
    },
    {
      id: 'b-g-2',
      type: 'grammar',
      question: 'Choose the correct sentence:',
      options: ['He do his homework.', 'He does his homework.', 'He doing his homework.', 'He done his homework.'],
      answer: 1,
      clue: 'Singular subject "He" takes the verb form "does".'
    },
    {
      id: 'b-sc-1',
      type: 'scramble',
      question: 'Unscramble: school / I / every / day / go / to',
      options: ['I every day go to school.', 'I go to school every day.', 'School every day I go to.', 'I school go to every day.'],
      answer: 1,
      clue: 'Subject (I) + Verb (go) + Destination (to school) + Time (every day).'
    },
    {
      id: 'b-sc-2',
      type: 'scramble',
      question: 'Unscramble: play / with / my / friends / I',
      options: ['I play with my friends.', 'I play my friends with.', 'Friends I play with my.', 'My friends with I play.'],
      answer: 0,
      clue: 'Subject (I) + Action (play) + Companion (with my friends).'
    },
    {
      id: 'b-c-1',
      type: 'correction',
      question: 'Correct the sentence: She like apples.',
      options: ['She likes apples.', 'She liking apples.', 'She like apple.', 'She has like apples.'],
      answer: 0,
      clue: 'Add an "s" to the verb "like" for third-person singular (She).'
    },
    {
      id: 'b-w-1',
      type: 'word-id',
      question: 'Identify the verb (action word) in: "The blue bird sings beautifully."',
      options: ['blue', 'bird', 'sings', 'beautifully'],
      answer: 2,
      clue: 'What action is the bird performing?'
    },
    {
      id: 'b-w-2',
      type: 'word-id',
      question: 'Identify the noun (naming word) in: "He visited the zoo."',
      options: ['He', 'visited', 'the', 'zoo'],
      answer: 3,
      clue: 'It is a place where animals are kept.'
    },
    {
      id: 'b-st-1',
      type: 'story',
      question: 'Choose the best sentence to continue the story: "Once there was a little bird named Pip. Pip loved to fly high..."',
      options: [
        'He lived in a dark dusty attic.',
        'But one day, he hurt his wing and could not fly.',
        'My mother bought some groceries from the shop.',
        'The water was cold and deep.'
      ],
      answer: 1,
      clue: 'Look for the sentence that continues Pip\'s flight adventure with a twist.'
    },
    {
      id: 'b-st-2',
      type: 'story',
      question: 'Continue the story: "Pip sat on a branch feeling sad. Then, a friendly squirrel walked up to him..."',
      options: [
        'The squirrel ate a big nut and ran away.',
        'The squirrel offered to help Pip find some soft leaves for his wing.',
        'Squirrels are good at climbing tall trees.',
        'He fell asleep under the moon.'
      ],
      answer: 1,
      clue: 'Find a helpful action by the friendly squirrel.'
    },
    {
      id: 'b-r-1',
      type: 'reading',
      question: 'Which of the following is correct pronunciation practice for: "The sun rises in the east."',
      options: ['The son rises in the yeast.', 'The sun rises in the east.', 'The sun raise in the east.', 'A sun rises in an east.'],
      answer: 1,
      clue: 'Standard spelling and sentence structure.'
    }
  ],
  intermediate: [
    {
      id: 'i-m-1',
      type: 'meaning',
      question: 'What is the meaning of "Generous"?',
      options: ['Showing kindness by giving more than expected', 'Extremely greedy or selfish', 'Quiet and keeping to oneself', 'Easily frightened'],
      answer: 0,
      clue: 'Think of someone sharing their food, money, or time willingly.'
    },
    {
      id: 'i-m-2',
      type: 'meaning',
      question: 'What does "Diligent" mean?',
      options: ['Lazy and slow', 'Careful and hard-working', 'Very noisy', 'Forgetful'],
      answer: 1,
      clue: 'An excellent student who studies consistently is diligent.'
    },
    {
      id: 'i-s-1',
      type: 'synonym',
      question: 'Choose the synonym of "Sufficient".',
      options: ['Lacking', 'Empty', 'Enough', 'Excessive'],
      answer: 2,
      clue: 'It means you have exactly the amount you need.'
    },
    {
      id: 'i-a-1',
      type: 'antonym',
      question: 'Choose the antonym of "Ambitious".',
      options: ['Determined', 'Lazy', 'Eager', 'Hopeful'],
      answer: 1,
      clue: 'Someone who lacks goals or desire to work hard.'
    },
    {
      id: 'i-g-1',
      type: 'grammar',
      question: 'Complete the sentence: By the time we arrived, they ___ dinner.',
      options: ['already finished', 'have already finished', 'had already finished', 'were already finished'],
      answer: 2,
      clue: 'Use Past Perfect ("had finished") because the action happened before another past action.'
    },
    {
      id: 'i-g-2',
      type: 'grammar',
      question: 'Complete the sentence: Neither Amit nor his classmates ___ present today.',
      options: ['is', 'are', 'was', 'am'],
      answer: 1,
      clue: 'In "neither/nor" structures, the verb agrees with the closer subject ("classmates").'
    },
    {
      id: 'i-sc-1',
      type: 'scramble',
      question: 'Unscramble: has / since / raining / been / morning / it',
      options: ['It raining has been since morning.', 'Morning since it has been raining.', 'It has been raining since morning.', 'Raining it has been since morning.'],
      answer: 2,
      clue: 'Subject (It) + auxiliary (has been) + participle (raining) + time modifier (since morning).'
    },
    {
      id: 'i-c-1',
      type: 'correction',
      question: 'Correct the sentence: He returned back my book.',
      options: ['He returned back my book to me.', 'He returned my book.', 'He return my book back.', 'He has returned back my book.'],
      answer: 1,
      clue: '"Returned" means to give back, so adding the word "back" is redundant.'
    },
    {
      id: 'i-c-2',
      type: 'correction',
      question: 'Correct the sentence: Every student must do their homework.',
      options: ['Every student must do his or her homework.', 'Every students must do their homework.', 'Every student must did their homework.', 'Every student must do homework.'],
      answer: 0,
      clue: '"Every student" is singular, requiring singular possessive pronouns ("his or her").'
    },
    {
      id: 'i-w-1',
      type: 'word-id',
      question: 'Identify the adjective (describing word) in: "The chef cooked a delicious meal."',
      options: ['chef', 'cooked', 'delicious', 'meal'],
      answer: 2,
      clue: 'Which word describes the noun "meal"?'
    },
    {
      id: 'i-st-1',
      type: 'story',
      question: 'Choose the best sentence to continue the story: "The old library was closed for years. Yesterday, Maya found a key hidden under the door mat..."',
      options: [
        'She went home and watched television.',
        'With a trembling hand, she inserted the key and turned it in the rusty lock.',
        'Libraries contain many ancient reference books.',
        'Maya decided to buy a new key from the store.'
      ],
      answer: 1,
      clue: 'Find the sentence that describes what Maya does next with the key at the library door.'
    },
    {
      id: 'i-st-2',
      type: 'story',
      question: 'Continue the story: "The heavy wooden door creaked open. Inside, dust swirled in the beams of sunlight, revealing..."',
      options: [
        'That the library was completely empty of books.',
        'A mysterious golden chest sitting on the librarian\'s desk.',
        'A group of students playing football.',
        'Maya\'s house was clean.'
      ],
      answer: 1,
      clue: 'Look for a discovery inside the ancient library.'
    }
  ],
  advanced: [
    {
      id: 'a-m-1',
      type: 'meaning',
      question: 'What is the meaning of the idiom "Burn the midnight oil"?',
      options: ['To waste fuel unnecessarily', 'To work or study late into the night', 'To set a lamp on fire', 'To sleep extremely early'],
      answer: 1,
      clue: 'Students do this when cramming the night before an exam.'
    },
    {
      id: 'a-m-2',
      type: 'meaning',
      question: 'What does the phrasal verb "Call off" mean?',
      options: ['To shout someone\'s name', 'To postpone an event', 'To cancel something', 'To make a phone call'],
      answer: 2,
      clue: 'If it rains heavily, the organizers might call off the match.'
    },
    {
      id: 'a-s-1',
      type: 'synonym',
      question: 'Choose the synonym of "Obsolete".',
      options: ['Modern', 'Outdated', 'Trendy', 'Fragile'],
      answer: 1,
      clue: 'Think of old technology, like floppy disks or cassette tapes.'
    },
    {
      id: 'a-a-1',
      type: 'antonym',
      question: 'Choose the antonym of "Ephemeral".',
      options: ['Short-lived', 'Permanent', 'Beautiful', 'Accidental'],
      answer: 1,
      clue: 'Ephemeral means lasting a very short time. The antonym means lasting forever.'
    },
    {
      id: 'a-g-1',
      type: 'grammar',
      question: 'Complete the sentence: Had I known about the traffic, I ___ a different route.',
      options: ['will take', 'would take', 'would have taken', 'should take'],
      answer: 2,
      clue: 'This is a third conditional structure (inverted: "Had I known... I would have done...").'
    },
    {
      id: 'a-g-2',
      type: 'grammar',
      question: 'Complete the sentence: The committee ___ split on their decisions regarding the budget.',
      options: ['is', 'are', 'was', 'has'],
      answer: 1,
      clue: 'When members of a collective noun act individually (shown by "their"), use a plural verb ("are").'
    },
    {
      id: 'a-sc-1',
      type: 'scramble',
      question: 'Unscramble: sooner / we / set / had / no / out / than / it / rained',
      options: ['No sooner had we set out than it rained.', 'No sooner we had set out than it rained.', 'Had we set out no sooner than it rained.', 'We had set out no sooner than it rained.'],
      answer: 0,
      clue: 'Inverted structure: "No sooner had + subject + past participle + than + past simple".'
    },
    {
      id: 'a-c-1',
      type: 'correction',
      question: 'Correct the sentence: I look forward to meet you.',
      options: ['I look forward to meeting you.', 'I look forward for meeting you.', 'I look forward to met you.', 'I am looking forward to meet you.'],
      answer: 0,
      clue: 'The phrase "look forward to" is a prepositional idiom and must be followed by a gerund ("meeting").'
    },
    {
      id: 'a-c-2',
      type: 'correction',
      question: 'Correct the sentence: Although she was tired, but she finished the report.',
      options: ['Although she was tired, but she has finished the report.', 'She was tired, although she finished the report.', 'Although she was tired, she finished the report.', 'Although she was tired but finished the report.'],
      answer: 2,
      clue: 'Do not use both "Although" and "but" in the same complex sentence.'
    },
    {
      id: 'a-w-1',
      type: 'word-id',
      question: 'Identify the participle in: "Having finished the exam, Rohan left the room."',
      options: ['Having finished', 'exam', 'left', 'room'],
      answer: 0,
      clue: 'Look for the perfect participle phrase at the beginning.'
    },
    {
      id: 'a-st-1',
      type: 'story',
      question: 'Choose the best sentence to continue the story: "The spacecraft landed on the crimson sands of Mars. Captain Miller stepped onto the ladder..."',
      options: [
        'She remembered she forgot to turn off her cooker.',
        'Peering through her visor, she witnessed a gargantuan dust storm brewing on the horizon.',
        'Mars is the fourth planet from the sun.',
        'Miller walked back inside the cabin and slept.'
      ],
      answer: 1,
      clue: 'Look for the sentence that details Miller\'s immediate observation as she stepped onto the ladder.'
    },
    {
      id: 'a-st-2',
      type: 'story',
      question: 'Continue the story: "The storm was closing in at breakneck speed. Miller radioed the crew, shouting..."',
      options: [
        'That the weather was quite pleasant for a walk.',
        '"Secure the auxiliary thrusters and prepare for immediate evacuation!"',
        'That Mars was indeed very red.',
        '"We should start planting potatoes here tomorrow."'
      ],
      answer: 1,
      clue: 'Choose the urgent command suited for an approaching dust storm.'
    }
  ]
};
