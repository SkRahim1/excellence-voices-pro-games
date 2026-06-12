export interface EscapeRoomChallenge {
  id: string;
  room: 1 | 2 | 3 | 4 | 5;
  type: 'vocabulary' | 'grammar' | 'reading' | 'sentence' | 'keypad';
  question: string;
  options: string[];
  answer: number; // 0-indexed correct option
  clue: string;
  hiddenIn: string; // Room object name
  digitClue?: string; // Room 5 digit result text (e.g. "Digit: 5")
}

export const ESCAPE_ROOM_CHALLENGES: {
  beginner: EscapeRoomChallenge[];
  intermediate: EscapeRoomChallenge[];
  advanced: EscapeRoomChallenge[];
} = {
  beginner: [
    // --- ROOM 1: VOCABULARY VAULT (Golden Key) ---
    {
      id: 'b-r1-1',
      room: 1,
      type: 'vocabulary',
      question: 'What is the opposite of the word "Cold"?',
      options: ['Chilly', 'Hot', 'Wet', 'Ice'],
      answer: 1,
      clue: 'Think of boiling water or the sun.',
      hiddenIn: 'Bookshelf'
    },
    {
      id: 'b-r1-2',
      room: 1,
      type: 'vocabulary',
      question: 'Find the synonym (same meaning) of "Large".',
      options: ['Tiny', 'Small', 'Huge', 'Light'],
      answer: 2,
      clue: 'It refers to something very big.',
      hiddenIn: 'Wooden Chest'
    },
    {
      id: 'b-r1-3',
      room: 1,
      type: 'vocabulary',
      question: 'Which word means "a place where we read and borrow books"?',
      options: ['Market', 'Library', 'Zoo', 'Park'],
      answer: 1,
      clue: 'It contains rows of bookshelves and is silent.',
      hiddenIn: 'Wall Painting'
    },
    {
      id: 'b-r1-4',
      room: 1,
      type: 'vocabulary',
      question: 'Choose the word that describes a very happy feeling.',
      options: ['Gloomy', 'Angry', 'Joyful', 'Tired'],
      answer: 2,
      clue: 'It starts with "Joy".',
      hiddenIn: 'Desk Drawer'
    },

    // --- ROOM 2: GRAMMAR GALLERY (Silver Key) ---
    {
      id: 'b-r2-1',
      room: 2,
      type: 'grammar',
      question: 'Complete the sentence: She ___ to school every morning.',
      options: ['go', 'goes', 'going', 'wented'],
      answer: 1,
      clue: 'Third-person singular "She" takes a verb ending in "-es".',
      hiddenIn: 'Broken Clock'
    },
    {
      id: 'b-r2-2',
      room: 2,
      type: 'grammar',
      question: 'Choose the correct helping verb: They ___ playing football yesterday.',
      options: ['was', 'were', 'am', 'are'],
      answer: 1,
      clue: 'Past tense plural subject "They" takes "were".',
      hiddenIn: 'Display Case'
    },
    {
      id: 'b-r2-3',
      room: 2,
      type: 'grammar',
      question: 'Correct the mistake: "The boys has two red balls."',
      options: ['The boys having two red balls.', 'The boys does have two red balls.', 'The boys have two red balls.', 'The boy have two red balls.'],
      answer: 2,
      clue: 'Plural subject "The boys" needs the helper verb "have".',
      hiddenIn: 'Armor Suit'
    },
    {
      id: 'b-r2-4',
      room: 2,
      type: 'grammar',
      question: 'Complete the sentence: An apple is ___ fruit.',
      options: ['a', 'an', 'the', 'some'],
      answer: 0,
      clue: '"fruit" starts with a consonant sound "f", so use article "a".',
      hiddenIn: 'Stone Fireplace'
    },

    // --- ROOM 3: READING DETECTIVE OFFICE (Magic Key) ---
    {
      id: 'b-r3-1',
      room: 3,
      type: 'reading',
      question: 'Riddle: "I am a pet. I am soft. I say mew. What am I?"',
      options: ['Dog', 'Cat', 'Parrot', 'Rabbit'],
      answer: 1,
      clue: 'Cats are known to make the "mew" sound.',
      hiddenIn: 'Writing Desk'
    },
    {
      id: 'b-r3-2',
      room: 3,
      type: 'reading',
      question: 'Passage: "Rohan has a green bicycle. He rides it in the park every evening." Where does Rohan ride his bicycle?',
      options: ['At school', 'In the park', 'On the road', 'In his garden'],
      answer: 1,
      clue: 'Look at the last sentence: "...rides it in the park..."',
      hiddenIn: 'Bookshelf'
    },
    {
      id: 'b-r3-3',
      room: 3,
      type: 'reading',
      question: 'Riddle: "I fly in the sky. I have colorful feathers. I can copy your words. What am I?"',
      options: ['Crow', 'Parrot', 'Eagle', 'Sparrow'],
      answer: 1,
      clue: 'Think of a bird that mimics human speech.',
      hiddenIn: 'Filing Cabinet'
    },
    {
      id: 'b-r3-4',
      room: 3,
      type: 'reading',
      question: 'Passage: "Rani has a pet puppy named Max. Max likes to chase red balls." What color ball does Max like to chase?',
      options: ['Blue', 'Green', 'Red', 'Yellow'],
      answer: 2,
      clue: 'Look at the last word of the passage.',
      hiddenIn: 'Safe'
    },

    // --- ROOM 4: SENTENCE WORKSHOP (Crystal Key) ---
    {
      id: 'b-r4-1',
      room: 4,
      type: 'sentence',
      question: 'Arrange in correct order: like / apples / sweet / I',
      options: ['Apples like sweet I.', 'I sweet apples like.', 'I like sweet apples.', 'Sweet I like apples.'],
      answer: 2,
      clue: 'Subject (I) + Verb (like) + Adjective (sweet) + Object (apples).',
      hiddenIn: 'Work Bench'
    },
    {
      id: 'b-r4-2',
      room: 4,
      type: 'sentence',
      question: 'Arrange in correct order: is / my / brother / Rohan',
      options: ['Rohan is my brother.', 'My brother Rohan is.', 'Is Rohan my brother.', 'Brother my Rohan is.'],
      answer: 0,
      clue: 'Subject (Rohan) + Verb (is) + Possessive description (my brother).',
      hiddenIn: 'Tool Box'
    },
    {
      id: 'b-r4-3',
      room: 4,
      type: 'sentence',
      question: 'Unscramble: play / let / us / football / now',
      options: ['Football us play let now.', 'Let us play football now.', 'Us let play now football.', 'Now football let us play.'],
      answer: 1,
      clue: 'Starts with the polite command "Let us..." + action.',
      hiddenIn: 'Wall Gear'
    },
    {
      id: 'b-r4-4',
      room: 4,
      type: 'sentence',
      question: 'Unscramble: sun / shines / the / brightly',
      options: ['Shines the sun brightly.', 'The sun shines brightly.', 'Brightly shines the sun.', 'The sun brightly shines.'],
      answer: 1,
      clue: 'Subject (The sun) + verb (shines) + adverb (brightly).',
      hiddenIn: 'Steam Pipe'
    },

    // --- ROOM 5: MYSTERY ESCAPE CHAMBER (Code Keypad) - CODE: 5248 ---
    {
      id: 'b-r5-1',
      room: 5,
      type: 'keypad',
      question: 'Clue 1: "How many letters are there in the word: APPLE?"',
      options: ['3', '4', '5', '6'],
      answer: 2,
      clue: 'Count the letters: A-P-P-L-E.',
      hiddenIn: 'Control Desk',
      digitClue: 'First Digit: 5'
    },
    {
      id: 'b-r5-2',
      room: 5,
      type: 'keypad',
      question: 'Clue 2: "Select the number of eyes a standard human has."',
      options: ['One', 'Two', 'Three', 'Four'],
      answer: 1,
      clue: 'You use them to see this screen.',
      hiddenIn: 'Wall Poster',
      digitClue: 'Second Digit: 2'
    },
    {
      id: 'b-r5-3',
      room: 5,
      type: 'keypad',
      question: 'Clue 3: "How many letters in the word: CATS?"',
      options: ['2', '3', '4', '5'],
      answer: 2,
      clue: 'Count C-A-T-S.',
      hiddenIn: 'Locked Cabinet',
      digitClue: 'Third Digit: 4'
    },
    {
      id: 'b-r5-4',
      room: 5,
      type: 'keypad',
      question: 'Clue 4: "Count the total letters in the word: ESCAPING."',
      options: ['6', '7', '8', '9'],
      answer: 2,
      clue: 'Count E-S-C-A-P-I-N-G.',
      hiddenIn: 'Server Rack',
      digitClue: 'Fourth Digit: 8'
    }
  ],
  intermediate: [
    // --- ROOM 1: VOCABULARY VAULT ---
    {
      id: 'i-r1-1',
      room: 1,
      type: 'vocabulary',
      question: 'Choose the antonym (opposite) of the word "Generous".',
      options: ['Kind', 'Selfish', 'Brave', 'Thoughtful'],
      answer: 1,
      clue: 'Someone who does not want to share with others is selfish.',
      hiddenIn: 'Bookshelf'
    },
    {
      id: 'i-r1-2',
      room: 1,
      type: 'vocabulary',
      question: 'Find the synonym (same meaning) of "Diligent".',
      options: ['Lazy', 'Careless', 'Hard-working', 'Quiet'],
      answer: 2,
      clue: 'A diligent student studies consistently and puts in effort.',
      hiddenIn: 'Wooden Chest'
    },
    {
      id: 'i-r1-3',
      room: 1,
      type: 'vocabulary',
      question: 'What is the meaning of the word "Fragile"?',
      options: ['Extremely strong', 'Easily broken or damaged', 'Very loud', 'Brightly colored'],
      answer: 1,
      clue: 'Glass and ceramic objects are fragile.',
      hiddenIn: 'Wall Painting'
    },
    {
      id: 'i-r1-4',
      room: 1,
      type: 'vocabulary',
      question: 'Which word describes a person who speaks very little?',
      options: ['Talkative', 'Taciturn', 'Cheerful', 'Outgoing'],
      answer: 1,
      clue: 'It is a formal word starting with "T" meaning reserved in speech.',
      hiddenIn: 'Desk Drawer'
    },

    // --- ROOM 2: GRAMMAR GALLERY ---
    {
      id: 'i-r2-1',
      room: 2,
      type: 'grammar',
      question: 'Complete the sentence: By the time we arrived, the train ___ left.',
      options: ['has', 'had', 'was', 'is'],
      answer: 1,
      clue: 'Use Past Perfect ("had left") for an action completed before another past action.',
      hiddenIn: 'Broken Clock'
    },
    {
      id: 'i-r2-2',
      room: 2,
      type: 'grammar',
      question: 'Complete the sentence: Neither Amit nor his brothers ___ present at the meeting.',
      options: ['was', 'were', 'is', 'has been'],
      answer: 1,
      clue: 'With "neither/nor", the verb agrees with the closer subject ("brothers", plural).',
      hiddenIn: 'Display Case'
    },
    {
      id: 'i-r2-3',
      room: 2,
      type: 'grammar',
      question: 'Correct the sentence: "If I was you, I would take the job."',
      options: ['If I am you, I will take.', 'If I were you, I would take the job.', 'If I would be you, I take.', 'If I have been you, I will take.'],
      answer: 1,
      clue: 'Use the subjunctive mood "were" for hypothetical/unreal conditions.',
      hiddenIn: 'Armor Suit'
    },
    {
      id: 'i-r2-4',
      room: 2,
      type: 'grammar',
      question: 'Complete the sentence: I have been studying here ___ three years.',
      options: ['since', 'for', 'from', 'during'],
      answer: 1,
      clue: 'Use "for" to indicate a duration or length of time.',
      hiddenIn: 'Stone Fireplace'
    },

    // --- ROOM 3: READING DETECTIVE OFFICE ---
    {
      id: 'i-r3-1',
      room: 3,
      type: 'reading',
      question: 'Passage: "The library was established in 1925 by a wealthy merchant named Alfred. His goal was to provide free education resources." Who founded the library?',
      options: ['A teacher', 'Alfred', 'A librarian', 'The government'],
      answer: 1,
      clue: 'Look for the merchant\'s name in the passage.',
      hiddenIn: 'Writing Desk'
    },
    {
      id: 'i-r3-2',
      room: 3,
      type: 'reading',
      question: 'Riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"',
      options: ['A bird', 'An echo', 'A cloud', 'A shadow'],
      answer: 1,
      clue: 'It repeats what you say when sound bounces off a wall.',
      hiddenIn: 'Bookshelf'
    },
    {
      id: 'i-r3-3',
      room: 3,
      type: 'reading',
      question: 'Passage: "To make paper, wood logs are chipped, cooked with chemicals into pulp, pressed through rollers, and dried." What is the first step in papermaking?',
      options: ['Pressing through rollers', 'Chipping wood logs', 'Cooking with chemicals', 'Drying the pulp'],
      answer: 1,
      clue: 'Identify the very first action verb listed in the process.',
      hiddenIn: 'Filing Cabinet'
    },
    {
      id: 'i-r3-4',
      room: 3,
      type: 'reading',
      question: 'Riddle: "The person who makes it has no need of it; the person who buys it does not use it; the person who uses it does not know it. What is it?"',
      options: ['A gift', 'A coffin', 'A book', 'A car'],
      answer: 1,
      clue: 'It is a final resting structure built for a deceased person.',
      hiddenIn: 'Safe'
    },

    // --- ROOM 4: SENTENCE WORKSHOP ---
    {
      id: 'i-r4-1',
      room: 4,
      type: 'sentence',
      question: 'Unscramble: finished / homework / having / he / went / sleep / to',
      options: ['Sleep to went he having finished homework.', 'Having finished his homework, he went to sleep.', 'He having finished homework went sleep to.', 'Finished homework having he went to sleep.'],
      answer: 1,
      clue: 'Starts with the participle phrase: "Having finished his homework..."',
      hiddenIn: 'Work Bench'
    },
    {
      id: 'i-r4-2',
      room: 4,
      type: 'sentence',
      question: 'Unscramble: sooner / entered / no / than / left / she / she',
      options: ['She entered no sooner than she left.', 'No sooner had she entered than she left.', 'She left no sooner than she entered.', 'No sooner she entered than she left.'],
      answer: 1,
      clue: 'Use negative inversion structure: "No sooner had + subject + verb..."',
      hiddenIn: 'Tool Box'
    },
    {
      id: 'i-r4-3',
      room: 4,
      type: 'sentence',
      question: 'Arrange in correct order: despite / hard / she / failed / working / exam / the',
      options: ['Despite failed she working hard the exam.', 'She failed the exam despite working hard.', 'Working hard she despite failed the exam.', 'She failed working hard despite the exam.'],
      answer: 1,
      clue: 'Subject+verb+object followed by prepositional phrase: "despite working hard".',
      hiddenIn: 'Wall Gear'
    },
    {
      id: 'i-r4-4',
      room: 4,
      type: 'sentence',
      question: 'Arrange in correct order: unless / you / fail / study / will / you',
      options: ['Unless you fail you will study.', 'You will study unless you fail.', 'You will fail unless you study.', 'You study unless you will fail.'],
      answer: 2,
      clue: 'Condition: "unless you study" leads to the outcome "You will fail".',
      hiddenIn: 'Steam Pipe'
    },

    // --- ROOM 5: MYSTERY ESCAPE CHAMBER - CODE: 9317 ---
    {
      id: 'i-r5-1',
      room: 5,
      type: 'keypad',
      question: 'Clue 1: "Identify the number of letters in the word: BEAUTIFUL."',
      options: ['7', '8', '9', '10'],
      answer: 2,
      clue: 'Count: B-E-A-U-T-I-F-U-L.',
      hiddenIn: 'Control Desk',
      digitClue: 'First Digit: 9'
    },
    {
      id: 'i-r5-2',
      room: 5,
      type: 'keypad',
      question: 'Clue 2: "What is 10 minus 7?"',
      options: ['2', '3', '4', '5'],
      answer: 1,
      clue: 'Perform simple subtraction: 10 - 7.',
      hiddenIn: 'Wall Poster',
      digitClue: 'Second Digit: 3'
    },
    {
      id: 'i-r5-3',
      room: 5,
      type: 'keypad',
      question: 'Clue 3: "Count the proper nouns in: \'She lives in London with her sister.\'"',
      options: ['0', '1', '2', '3'],
      answer: 1,
      clue: 'Only "London" is a proper noun (refers to a specific city).',
      hiddenIn: 'Locked Cabinet',
      digitClue: 'Third Digit: 1'
    },
    {
      id: 'i-r5-4',
      room: 5,
      type: 'keypad',
      question: 'Clue 4: "Count the total letters in the word: GRAMMAR."',
      options: ['5', '6', '7', '8'],
      answer: 2,
      clue: 'Count G-R-A-M-M-A-R.',
      hiddenIn: 'Server Rack',
      digitClue: 'Fourth Digit: 7'
    }
  ],
  advanced: [
    // --- ROOM 1: VOCABULARY VAULT ---
    {
      id: 'a-r1-1',
      room: 1,
      type: 'vocabulary',
      question: 'Identify the synonym of the word "Ephemeral".',
      options: ['Permanent', 'Short-lived', 'Beautiful', 'Accidental'],
      answer: 1,
      clue: 'Think of cherry blossoms or bubbles that last a very short time.',
      hiddenIn: 'Bookshelf'
    },
    {
      id: 'a-r1-2',
      room: 1,
      type: 'vocabulary',
      question: 'Choose the antonym of the word "Meticulous".',
      options: ['Careful', 'Sloppy', 'Precise', 'Detailed'],
      answer: 1,
      clue: 'Meticulous means showing great attention to detail. The opposite is careless or sloppy.',
      hiddenIn: 'Wooden Chest'
    },
    {
      id: 'a-r1-3',
      room: 1,
      type: 'vocabulary',
      question: 'What is the meaning of the word "Obsequious"?',
      options: ['Extremely arrogant', 'Obedient or attentive to an excessive degree', 'Quiet and reserved', 'Difficult to understand'],
      answer: 1,
      clue: 'Think of a servant who flatters their master excessively.',
      hiddenIn: 'Wall Painting'
    },
    {
      id: 'a-r1-4',
      room: 1,
      type: 'vocabulary',
      question: 'Choose the word that describes something that is everywhere at the same time.',
      options: ['Scarce', 'Ubiquitous', 'Ephemeral', 'Obsolete'],
      answer: 1,
      clue: 'It starts with "U" and describes things like smartphones in modern society.',
      hiddenIn: 'Desk Drawer'
    },

    // --- ROOM 2: GRAMMAR GALLERY ---
    {
      id: 'a-r2-1',
      room: 2,
      type: 'grammar',
      question: 'Complete the sentence: Had I known about your arrival, I ___ you at the station.',
      options: ['will meet', 'would meet', 'would have met', 'should meet'],
      answer: 2,
      clue: 'This is a third conditional clause expressing an unreal past event.',
      hiddenIn: 'Broken Clock'
    },
    {
      id: 'a-r2-2',
      room: 2,
      type: 'grammar',
      question: 'Complete: It is essential that he ___ the report by tonight.',
      options: ['submit', 'submits', 'submitting', 'submitted'],
      answer: 0,
      clue: 'This uses the subjunctive mood ("It is essential that he submit..." instead of "submits").',
      hiddenIn: 'Display Case'
    },
    {
      id: 'a-r2-3',
      room: 2,
      type: 'grammar',
      question: 'Choose the correct preposition: The manager agreed ___ the proposal presented by Rohan.',
      options: ['with', 'to', 'on', 'at'],
      answer: 1,
      clue: 'You agree "with" a person, but agree "to" a proposal or plan.',
      hiddenIn: 'Armor Suit'
    },
    {
      id: 'a-r2-4',
      room: 2,
      type: 'grammar',
      question: 'Identify the sentence with the correct grammar:',
      options: ['She sings beautiful.', 'Each of the students have finished.', 'Scarcely had he left when it rained.', 'The committee is split on their views.'],
      answer: 2,
      clue: 'Negative inversion "Scarcely had he... when..." is grammatically perfect.',
      hiddenIn: 'Stone Fireplace'
    },

    // --- ROOM 3: READING DETECTIVE OFFICE ---
    {
      id: 'a-r3-1',
      room: 3,
      type: 'reading',
      question: 'Passage: "Dark matter makes up about 27% of the universe, yet it does not emit, absorb, or reflect light, rendering it invisible. Its existence is inferred from gravitational effects on visible matter." How do scientists detect dark matter?',
      options: ['Using optical telescopes', 'Through its gravitational pull', 'By measuring light reflections', 'By chemical analysis'],
      answer: 1,
      clue: 'Look at the last sentence: "...inferred from gravitational effects..."',
      hiddenIn: 'Writing Desk'
    },
    {
      id: 'a-r3-2',
      room: 3,
      type: 'reading',
      question: 'Riddle: "I am taken from a mine, and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?"',
      options: ['Coal', 'Pencil lead', 'Gold', 'Diamond'],
      answer: 1,
      clue: 'It is the graphite center inside a wooden writing pencil.',
      hiddenIn: 'Bookshelf'
    },
    {
      id: 'a-r3-3',
      room: 3,
      type: 'reading',
      question: 'Passage: "Cognitive dissonance is the psychological discomfort felt by a person who holds two contradictory beliefs. To reduce discomfort, individuals will justify or align their beliefs." What is cognitive dissonance?',
      options: ['A memory loss disorder', 'Discomfort from conflicting beliefs', 'A type of sleeping disorder', 'Extremely high intelligence'],
      answer: 1,
      clue: 'Read the first sentence to find the definition of the term.',
      hiddenIn: 'Filing Cabinet'
    },
    {
      id: 'a-r3-4',
      room: 3,
      type: 'reading',
      question: 'Riddle: "A man pushes his car to a hotel and tells the owner he\'s bankrupt. Why?"',
      options: ['His car broke down', 'He is playing Monopoly', 'He was robbed', 'He owes money'],
      answer: 1,
      clue: 'Think of a popular board game involving buying hotels and moving a car token.',
      hiddenIn: 'Safe'
    },

    // --- ROOM 4: SENTENCE WORKSHOP ---
    {
      id: 'a-r4-1',
      room: 4,
      type: 'sentence',
      question: 'Unscramble: under / circumstances / should / you / doors / open / no',
      options: ['You should open doors under no circumstances.', 'Under no circumstances should you open the doors.', 'Should you open doors under no circumstances.', 'Under no circumstances you should open doors.'],
      answer: 1,
      clue: 'Negative introductory phrases (Under no circumstances...) force subject-auxiliary inversion (should you...).',
      hiddenIn: 'Work Bench'
    },
    {
      id: 'a-r4-2',
      room: 4,
      type: 'sentence',
      question: 'Arrange in correct order: been / working / would / she / project / have / for / years / two',
      options: ['She would working have been for two years.', 'She have been working would for two years project.', 'She would have been working on the project for two years.', 'For two years she have been working would project.'],
      answer: 2,
      clue: 'Build: Subject (She) + auxiliary (would have been) + participle (working) + preposition.',
      hiddenIn: 'Tool Box'
    },
    {
      id: 'a-r4-3',
      room: 4,
      type: 'sentence',
      question: 'Arrange in correct order: unless / provided / that / we / hurry / fail / will / we',
      options: ['Provided that we hurry, we will fail.', 'We will fail unless we hurry, provided that.', 'Provided that we do not hurry, we will fail.', 'Unless we fail, we will hurry provided that.'],
      answer: 2,
      clue: 'Condition: "Provided that we do not hurry" sets the condition for the outcome "we will fail".',
      hiddenIn: 'Wall Gear'
    },
    {
      id: 'a-r4-4',
      room: 4,
      type: 'sentence',
      question: 'Unscramble: although / tired / she / was / she / persevered / diligently',
      options: ['She persevered diligently although she was tired.', 'Although she persevered diligently, she was tired.', 'Persevered diligently she although she was tired.', 'She was tired although she persevered diligently.'],
      answer: 0,
      clue: 'Main clause: "She persevered diligently" + concessive conjunction clause "although she was tired".',
      hiddenIn: 'Steam Pipe'
    },

    // --- ROOM 5: MYSTERY ESCAPE CHAMBER - CODE: 6195 ---
    {
      id: 'a-r5-1',
      room: 5,
      type: 'keypad',
      question: 'Clue 1: "Identify the number of letters in the word: CAVERN."',
      options: ['5', '6', '7', '8'],
      answer: 1,
      clue: 'Count: C-A-V-E-R-N.',
      hiddenIn: 'Control Desk',
      digitClue: 'First Digit: 6'
    },
    {
      id: 'a-r5-2',
      room: 5,
      type: 'keypad',
      question: 'Clue 2: "Count the total number of conjunctions in: \'Although she was tired, she studied.\'"',
      options: ['0', '1', '2', '3'],
      answer: 1,
      clue: 'The only conjunction is "Although".',
      hiddenIn: 'Wall Poster',
      digitClue: 'Second Digit: 1'
    },
    {
      id: 'a-r5-3',
      room: 5,
      type: 'keypad',
      question: 'Clue 3: "Count the total letters in the word: HACKERING."',
      options: ['7', '8', '9', '10'],
      answer: 2,
      clue: 'Count H-A-C-K-E-R-I-N-G.',
      hiddenIn: 'Locked Cabinet',
      digitClue: 'Third Digit: 9'
    },
    {
      id: 'a-r5-4',
      room: 5,
      type: 'keypad',
      question: 'Clue 4: "Count the letters in the word: CLUES."',
      options: ['3', '4', '5', '6'],
      answer: 2,
      clue: 'Count C-L-U-E-S.',
      hiddenIn: 'Server Rack',
      digitClue: 'Fourth Digit: 5'
    }
  ]
};
