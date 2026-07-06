export interface Lesson {
  definition: string;
  examples: string[];
  sentences: string[];
}

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  sentence?: string; // Sentence in which they must identify the word
}

export interface PartOfSpeechModule {
  id: string; // 'noun', 'pronoun', etc.
  name: string;
  lesson: Lesson;
  questions: Question[];
}

export const PARTS_OF_SPEECH_DATA: PartOfSpeechModule[] = [
  {
    id: 'noun',
    name: 'Noun 🏷️',
    lesson: {
      definition: "A noun is a word that represents a person, place, thing, or idea. Nouns are the building blocks of sentences because they name what we are talking about.",
      examples: [
        "Person: teacher, sister, boy, doctor",
        "Place: school, park, India, city",
        "Thing: book, table, ball, pencil",
        "Idea: happiness, love, anger, truth"
      ],
      sentences: [
        "The dog ran across the garden.",
        "Riya loves to read books in the library.",
        "Happiness is the key to good health."
      ]
    },
    questions: [
      { id: 'n1', prompt: "Identify the noun in this sentence:", sentence: "The cat slept on the rug.", options: ["slept", "on", "cat", "the"], correctAnswer: "cat" },
      { id: 'n2', prompt: "Which of the following is a noun representing a PLACE?", options: ["teacher", "happiness", "school", "pencil"], correctAnswer: "school" },
      { id: 'n3', prompt: "Identify the noun in this sentence:", sentence: "She bought a beautiful doll.", options: ["bought", "beautiful", "doll", "she"], correctAnswer: "doll" },
      { id: 'n4', prompt: "Which word is a noun representing an IDEA?", options: ["brother", "honesty", "library", "laptop"], correctAnswer: "honesty" },
      { id: 'n5', prompt: "Identify the noun in this sentence:", sentence: "Rohan is going to Hyderabad tomorrow.", options: ["going", "Rohan", "tomorrow", "to"], correctAnswer: "Rohan" },
      { id: 'n6', prompt: "Identify the noun representing a THING in this sentence:", sentence: "Put the glass on the table.", options: ["put", "on", "glass", "the"], correctAnswer: "glass" },
      { id: 'n7', prompt: "Which of these words is a noun?", options: ["quickly", "beautiful", "happiness", "sing"], correctAnswer: "happiness" },
      { id: 'n8', prompt: "Identify the noun in this sentence:", sentence: "My doctor was very friendly.", options: ["doctor", "very", "friendly", "was"], correctAnswer: "doctor" },
      { id: 'n9', prompt: "Identify the noun in this sentence:", sentence: "The flowers in the vase look fresh.", options: ["look", "fresh", "flowers", "in"], correctAnswer: "flowers" },
      { id: 'n10', prompt: "Which of the following is a noun representing a PERSON?", options: ["brother", "bicycle", "bedroom", "bravery"], correctAnswer: "brother" }
    ]
  },
  {
    id: 'pronoun',
    name: 'Pronoun 👤',
    lesson: {
      definition: "A pronoun is a word used in place of one or more nouns. Pronouns prevent us from repeating the same noun over and over again.",
      examples: [
        "Subject Pronouns: I, he, she, they, we, you, it",
        "Object Pronouns: me, him, her, them, us, you, it",
        "Possessive Pronouns: mine, his, hers, ours, theirs, yours"
      ],
      sentences: [
        "Instead of: 'Raju is a boy. Raju is smart.' we say: 'Raju is a boy. He is smart.'",
        "They went to the park and enjoyed themselves.",
        "The blue bag is mine."
      ]
    },
    questions: [
      { id: 'pr1', prompt: "Replace the underlined noun with the correct pronoun: 'Ravi' loves reading.", options: ["She", "He", "They", "We"], correctAnswer: "He" },
      { id: 'pr2', prompt: "Identify the pronoun in this sentence:", sentence: "She is going to the market.", options: ["going", "market", "She", "the"], correctAnswer: "She" },
      { id: 'pr3', prompt: "Choose the correct pronoun: The boys said that ____ were tired.", options: ["he", "them", "they", "we"], correctAnswer: "they" },
      { id: 'pr4', prompt: "Identify the pronoun in this sentence:", sentence: "Tell us a story, please.", options: ["Tell", "us", "story", "please"], correctAnswer: "us" },
      { id: 'pr5', prompt: "Replace the underlined noun: 'The book' is on the shelf.", options: ["It", "She", "He", "They"], correctAnswer: "It" },
      { id: 'pr6', prompt: "Identify the possessive pronoun in this sentence:", sentence: "This pen is mine.", options: ["This", "pen", "is", "mine"], correctAnswer: "mine" },
      { id: 'pr7', prompt: "Choose the correct pronoun: Kiran and ____ are going to the zoo.", options: ["me", "I", "us", "him"], correctAnswer: "I" },
      { id: 'pr8', prompt: "Identify the pronoun in this sentence:", sentence: "They will arrive at noon.", options: ["arrive", "noon", "They", "at"], correctAnswer: "They" },
      { id: 'pr9', prompt: "Replace the underlined nouns: 'Rohan and Priya' are studying.", options: ["We", "They", "Them", "You"], correctAnswer: "They" },
      { id: 'pr10', prompt: "Identify the pronoun in this sentence:", sentence: "He gave me a pencil.", options: ["He", "gave", "pencil", "a"], correctAnswer: "He" }
    ]
  },
  {
    id: 'verb',
    name: 'Verb 🏃',
    lesson: {
      definition: "A verb is a word that expresses action, an occurrence, or a state of being. Verbs describe what the subject is doing or being.",
      examples: [
        "Action Verbs: run, write, think, dance, play",
        "Helping/Linking Verbs: is, am, are, was, were, has, have, had, will"
      ],
      sentences: [
        "The boys played cricket yesterday.",
        "She is reading a storybook.",
        "We will visit the museum tomorrow."
      ]
    },
    questions: [
      { id: 'v1', prompt: "Identify the verb in this sentence:", sentence: "The horse ran fast.", options: ["horse", "ran", "fast", "the"], correctAnswer: "ran" },
      { id: 'v2', prompt: "Choose the correct verb to complete the sentence: She ____ milk every day.", options: ["drink", "drinking", "drinks", "drank"], correctAnswer: "drinks" },
      { id: 'v3', prompt: "Identify the verb in this sentence:", sentence: "They are playing in the garden.", options: ["garden", "playing", "are", "garden"], correctAnswer: "playing" },
      { id: 'v4', prompt: "Which of the following is a linking/helping verb?", options: ["write", "is", "quickly", "pencil"], correctAnswer: "is" },
      { id: 'v5', prompt: "Identify the verb in this sentence:", sentence: "I wrote a letter to my father.", options: ["wrote", "letter", "father", "father"], correctAnswer: "wrote" },
      { id: 'v6', prompt: "Choose the correct verb: The birds ____ flying in the sky.", options: ["is", "am", "are", "was"], correctAnswer: "are" },
      { id: 'v7', prompt: "Identify the verb in this sentence:", sentence: "We baked cookies last night.", options: ["baked", "cookies", "night", "last"], correctAnswer: "baked" },
      { id: 'v8', prompt: "Identify the helping verb in this sentence:", sentence: "I have finished my homework.", options: ["finished", "have", "homework", "my"], correctAnswer: "have" },
      { id: 'v9', prompt: "Identify the verb in this sentence:", sentence: "Listen to the birds.", options: ["birds", "Listen", "to", "the"], correctAnswer: "Listen" },
      { id: 'v10', prompt: "Choose the correct verb: He ____ a new bicycle yesterday.", options: ["buy", "bought", "buying", "buys"], correctAnswer: "bought" }
    ]
  },
  {
    id: 'adjective',
    name: 'Adjective 🎨',
    lesson: {
      definition: "An adjective is a word that describes or modifies a noun or a pronoun. It tells what kind, how many, or which one.",
      examples: [
        "What kind: green leaves, beautiful girl, loud voice",
        "How many: five books, many students, several coins",
        "Which one: this house, those toys, that dog"
      ],
      sentences: [
        "He has a red bicycle.",
        "The tall tree stands near the gate.",
        "She ate three sweet mangoes."
      ]
    },
    questions: [
      { id: 'adj1', prompt: "Identify the adjective in this sentence:", sentence: "The cute puppy barked at me.", options: ["puppy", "barked", "cute", "at"], correctAnswer: "cute" },
      { id: 'adj2', prompt: "Which word describes the noun in: 'I saw a big elephant.'?", options: ["elephant", "saw", "big", "a"], correctAnswer: "big" },
      { id: 'adj3', prompt: "Identify the adjective in this sentence:", sentence: "She has five pencils.", options: ["five", "pencils", "has", "she"], correctAnswer: "five" },
      { id: 'adj4', prompt: "Identify the adjective representing size or shape:", sentence: "The round table is in the room.", options: ["table", "round", "room", "in"], correctAnswer: "round" },
      { id: 'adj5', prompt: "Identify the adjective in this sentence:", sentence: "The soup is hot.", options: ["soup", "is", "hot", "the"], correctAnswer: "hot" },
      { id: 'adj6', prompt: "Identify the adjective in this sentence:", sentence: "We walked down the dark alley.", options: ["walked", "alley", "dark", "down"], correctAnswer: "dark" },
      { id: 'adj7', prompt: "Identify the adjective in: 'Rohan is a smart student.'", options: ["Rohan", "smart", "student", "is"], correctAnswer: "smart" },
      { id: 'adj8', prompt: "Identify the adjective in this sentence:", sentence: "He wore a clean shirt.", options: ["shirt", "clean", "wore", "he"], correctAnswer: "clean" },
      { id: 'adj9', prompt: "Identify the adjective in this sentence:", sentence: "The water is cold.", options: ["water", "cold", "is", "the"], correctAnswer: "cold" },
      { id: 'adj10', prompt: "Which word is an adjective?", options: ["slowly", "beautiful", "run", "table"], correctAnswer: "beautiful" }
    ]
  },
  {
    id: 'adverb',
    name: 'Adverb ⏱️',
    lesson: {
      definition: "An adverb is a word that modifies or describes a verb, an adjective, or another adverb. It tells how, when, where, or to what extent.",
      examples: [
        "How (Manner): quickly, slowly, quietly, loudly",
        "When (Time): yesterday, today, tomorrow, early, late",
        "Where (Place): here, there, inside, outside, everywhere",
        "Extent/Degree: very, extremely, quite, too"
      ],
      sentences: [
        "She ran quickly to catch the bus.",
        "The teacher spoke very softly.",
        "We are going inside to study."
      ]
    },
    questions: [
      { id: 'adv1', prompt: "Identify the adverb in this sentence:", sentence: "The baby cried loudly.", options: ["baby", "cried", "loudly", "the"], correctAnswer: "loudly" },
      { id: 'adv2', prompt: "Which word is an adverb in: 'He walked very slowly.'?", options: ["walked", "slowly", "very", "he"], correctAnswer: "slowly" },
      { id: 'adv3', prompt: "Identify the adverb representing TIME:", sentence: "We will go tomorrow.", options: ["go", "tomorrow", "will", "we"], correctAnswer: "tomorrow" },
      { id: 'adv4', prompt: "Identify the adverb in this sentence:", sentence: "She writes neatly in her book.", options: ["neatly", "writes", "book", "her"], correctAnswer: "neatly" },
      { id: 'adv5', prompt: "Identify the adverb modifying the adjective 'hot':", sentence: "The tea is extremely hot.", options: ["tea", "is", "extremely", "hot"], correctAnswer: "extremely" },
      { id: 'adv6', prompt: "Identify the adverb representing PLACE:", sentence: "Please sit here.", options: ["Please", "sit", "here", "sit"], correctAnswer: "here" },
      { id: 'adv7', prompt: "Identify the adverb in: 'The train arrived early.'", options: ["train", "arrived", "early", "the"], correctAnswer: "early" },
      { id: 'adv8', prompt: "Identify the adverb in this sentence:", sentence: "The students listened quietly.", options: ["students", "listened", "quietly", "the"], correctAnswer: "quietly" },
      { id: 'adv9', prompt: "Choose the correct adverb to complete: She sings ____.", options: ["sweetly", "sweet", "sweeter", "sweetest"], correctAnswer: "sweetly" },
      { id: 'adv10', prompt: "Which word is an adverb?", options: ["quickly", "quick", "quicker", "quickest"], correctAnswer: "quickly" }
    ]
  },
  {
    id: 'preposition',
    name: 'Preposition 📍',
    lesson: {
      definition: "A preposition is a word placed before a noun or pronoun to show its relationship to some other word in the sentence. It usually indicates position, place, or time.",
      examples: [
        "Place/Position: in, on, under, behind, between, near, at",
        "Direction: to, into, out of, towards, through",
        "Time: at, on, in, before, after, during"
      ],
      sentences: [
        "The cat is under the table.",
        "The books are in my school bag.",
        "We met him at 5 O'clock in the evening."
      ]
    },
    questions: [
      { id: 'prep1', prompt: "Identify the preposition in this sentence:", sentence: "The book is on the table.", options: ["book", "on", "table", "the"], correctAnswer: "on" },
      { id: 'prep2', prompt: "Choose the correct preposition: The bird flew ____ the window.", options: ["through", "on", "at", "under"], correctAnswer: "through" },
      { id: 'prep3', prompt: "Identify the preposition in this sentence:", sentence: "He sat between Rohan and Amit.", options: ["sat", "between", "and", "Rohan"], correctAnswer: "between" },
      { id: 'prep4', prompt: "Choose the correct preposition: The dog was sleeping ____ the bed.", options: ["under", "in", "to", "during"], correctAnswer: "under" },
      { id: 'prep5', prompt: "Identify the preposition in this sentence:", sentence: "She walked into the classroom.", options: ["walked", "into", "classroom", "the"], correctAnswer: "into" },
      { id: 'prep6', prompt: "Choose the correct preposition: The train departs ____ 6 PM.", options: ["at", "on", "in", "for"], correctAnswer: "at" },
      { id: 'prep7', prompt: "Identify the preposition in: 'There is a map near the blackboard.'", options: ["map", "near", "blackboard", "is"], correctAnswer: "near" },
      { id: 'prep8', prompt: "Choose the correct preposition: The keys are kept ____ the drawer.", options: ["in", "on", "at", "between"], correctAnswer: "in" },
      { id: 'prep9', prompt: "Identify the preposition in this sentence:", sentence: "We went home after the class.", options: ["went", "home", "after", "class"], correctAnswer: "after" },
      { id: 'prep10', prompt: "Choose the correct preposition: The school is closed ____ Sundays.", options: ["on", "at", "in", "under"], correctAnswer: "on" }
    ]
  },
  {
    id: 'conjunction',
    name: 'Conjunction 🔗',
    lesson: {
      definition: "A conjunction is a word used to join words, phrases, or clauses. It connects ideas and helps sentences flow smoothly.",
      examples: [
        "Coordinating Conjunctions: and, but, or, so, yet, for, nor",
        "Subordinating Conjunctions: because, although, if, since, when, unless"
      ],
      sentences: [
        "I like apples and mangoes.",
        "He ran fast but missed the train.",
        "We stayed inside because it was raining."
      ]
    },
    questions: [
      { id: 'conj1', prompt: "Identify the conjunction in this sentence:", sentence: "Raju and Karan are best friends.", options: ["and", "are", "best", "friends"], correctAnswer: "and" },
      { id: 'conj2', prompt: "Choose the correct conjunction: He was tired, ____ he went to bed.", options: ["so", "but", "because", "or"], correctAnswer: "so" },
      { id: 'conj3', prompt: "Identify the conjunction in this sentence:", sentence: "I will go if you come with me.", options: ["go", "if", "come", "with"], correctAnswer: "if" },
      { id: 'conj4', prompt: "Choose the correct conjunction: Do you want tea ____ coffee?", options: ["or", "and", "but", "so"], correctAnswer: "or" },
      { id: 'conj5', prompt: "Identify the conjunction in this sentence:", sentence: "He did not study, so he failed the test.", options: ["study", "so", "failed", "test"], correctAnswer: "so" },
      { id: 'conj6', prompt: "Choose the correct conjunction: She is smart ____ very polite.", options: ["and", "but", "because", "or"], correctAnswer: "and" },
      { id: 'conj7', prompt: "Identify the conjunction in: 'We cannot go outside unless it stops raining.'", options: ["cannot", "outside", "unless", "stops"], correctAnswer: "unless" },
      { id: 'conj8', prompt: "Choose the correct conjunction: He ran fast ____ he missed the train.", options: ["but", "and", "because", "so"], correctAnswer: "but" },
      { id: 'conj9', prompt: "Identify the conjunction in this sentence:", sentence: "They stayed at home because it was cold.", options: ["stayed", "home", "because", "cold"], correctAnswer: "because" },
      { id: 'conj10', prompt: "Choose the correct conjunction: Although it was late, ____ we finished the project.", options: ["Although", "was", "late", "finished"], correctAnswer: "Although" }
    ]
  },
  {
    id: 'interjection',
    name: 'Interjection 💥',
    lesson: {
      definition: "An interjection is a word or phrase that expresses sudden or strong emotion. It has no grammatical connection to the rest of the sentence and is often followed by an exclamation mark.",
      examples: [
        "Excitement: Hurray!, Wow!, Yay!",
        "Pain: Ouch!, Oh!",
        "Surprise: Oh!, Oh no!, Oops!",
        "Attention: Hey!, Hush!"
      ],
      sentences: [
        "Hurray! We won the cricket match.",
        "Ouch! I stepped on a pin.",
        "Oops! I dropped the glass."
      ]
    },
    questions: [
      { id: 'int1', prompt: "Identify the interjection in this sentence:", sentence: "Wow! That is a beautiful painting.", options: ["Wow", "beautiful", "painting", "That"], correctAnswer: "Wow" },
      { id: 'int2', prompt: "Which interjection expresses PAIN?", options: ["Hurray", "Ouch", "Hush", "Wow"], correctAnswer: "Ouch" },
      { id: 'int3', prompt: "Identify the interjection in this sentence:", sentence: "Hurray! We got a holiday today.", options: ["holiday", "today", "got", "Hurray"], correctAnswer: "Hurray" },
      { id: 'int4', prompt: "Which interjection is used to request silence?", options: ["Hey", "Ouch", "Hush", "Wow"], correctAnswer: "Hush" },
      { id: 'int5', prompt: "Identify the interjection in this sentence:", sentence: "Oops! I forgot my keys.", options: ["forgot", "Oops", "keys", "my"], correctAnswer: "Oops" },
      { id: 'int6', prompt: "Choose the correct interjection: ____! We lost the game.", options: ["Alas", "Wow", "Hurray", "Hey"], correctAnswer: "Alas" },
      { id: 'int7', prompt: "Identify the interjection in: 'Hey! What are you doing?'", options: ["Hey", "doing", "What", "doing"], correctAnswer: "Hey" },
      { id: 'int8', prompt: "Which interjection expresses surprise or awe?", options: ["Wow", "Ouch", "Alas", "Hush"], correctAnswer: "Wow" },
      { id: 'int9', prompt: "Identify the interjection in this sentence:", sentence: "Oh no! The bus has already left.", options: ["left", "already", "Oh no", "bus"], correctAnswer: "Oh no" },
      { id: 'int10', prompt: "Choose the correct interjection: ____! That hot water burned me.", options: ["Ouch", "Hurray", "Hush", "Yay"], correctAnswer: "Ouch" }
    ]
  }
];

export const MASTER_CHALLENGE_QUESTIONS: Question[] = [
  { id: 'm1', prompt: "Identify the NOUN in this sentence:", sentence: "The children played happily in the park.", options: ["children", "played", "happily", "in"], correctAnswer: "children" },
  { id: 'm2', prompt: "Identify the VERB in this sentence:", sentence: "The children played happily in the park.", options: ["children", "played", "happily", "park"], correctAnswer: "played" },
  { id: 'm3', prompt: "Identify the ADVERB in this sentence:", sentence: "The children played happily in the park.", options: ["children", "played", "happily", "park"], correctAnswer: "happily" },
  { id: 'm4', prompt: "Identify the PREPOSITION in this sentence:", sentence: "The children played happily in the park.", options: ["happily", "in", "park", "played"], correctAnswer: "in" },
  { id: 'm5', prompt: "Identify the PRONOUN in this sentence:", sentence: "She bought a new dress for herself.", options: ["She", "bought", "new", "dress"], correctAnswer: "She" },
  { id: 'm6', prompt: "Identify the ADJECTIVE in this sentence:", sentence: "She bought a new dress for herself.", options: ["bought", "new", "dress", "herself"], correctAnswer: "new" },
  { id: 'm7', prompt: "Identify the CONJUNCTION in this sentence:", sentence: "Although he studied hard, he missed the grade.", options: ["Although", "studied", "hard", "missed"], correctAnswer: "Although" },
  { id: 'm8', prompt: "Identify the INTERJECTION in this sentence:", sentence: "Hurray! The exam was very easy.", options: ["Hurray", "exam", "very", "easy"], correctAnswer: "Hurray" },
  { id: 'm9', prompt: "What part of speech is 'delhi' in: 'Delhi is the capital of India.'?", options: ["Noun", "Pronoun", "Adjective", "Verb"], correctAnswer: "Noun" },
  { id: 'm10', prompt: "What part of speech is 'she' in: 'Riya runs fast because she is athletic.'?", options: ["Noun", "Pronoun", "Adverb", "Conjunction"], correctAnswer: "Pronoun" },
  { id: 'm11', prompt: "What part of speech is 'run' in: 'We will run a marathon tomorrow.'?", options: ["Noun", "Verb", "Adjective", "Adverb"], correctAnswer: "Verb" },
  { id: 'm12', prompt: "What part of speech is 'quickly' in: 'Rohan quickly wrote the letter.'?", options: ["Adjective", "Adverb", "Verb", "Preposition"], correctAnswer: "Adverb" },
  { id: 'm13', prompt: "What part of speech is 'beautiful' in: 'The flowers are beautiful.'?", options: ["Noun", "Verb", "Adjective", "Adverb"], correctAnswer: "Adjective" },
  { id: 'm14', prompt: "What part of speech is 'under' in: 'Put the suitcase under the bed.'?", options: ["Preposition", "Conjunction", "Adverb", "Noun"], correctAnswer: "Preposition" },
  { id: 'm15', prompt: "What part of speech is 'because' in: 'I was late because the traffic was heavy.'?", options: ["Preposition", "Conjunction", "Interjection", "Adjective"], correctAnswer: "Conjunction" },
  { id: 'm16', prompt: "What part of speech is 'Oops' in: 'Oops! I spilled the milk.'?", options: ["Noun", "Pronoun", "Conjunction", "Interjection"], correctAnswer: "Interjection" },
  { id: 'm17', prompt: "Identify the ADJECTIVE in this sentence:", sentence: "The smart child solved the difficult math puzzle.", options: ["child", "smart", "solved", "puzzle"], correctAnswer: "smart" },
  { id: 'm18', prompt: "Identify the ADVERB in this sentence:", sentence: "The horse runs extremely fast.", options: ["horse", "runs", "extremely", "fast"], correctAnswer: "extremely" },
  { id: 'm19', prompt: "Identify the PRONOUN representing the object:", sentence: "Give him the book.", options: ["Give", "him", "book", "the"], correctAnswer: "him" },
  { id: 'm20', prompt: "Identify the CONJUNCTION in this sentence:", sentence: "We must leave now, or we will be late.", options: ["leave", "now", "or", "late"], correctAnswer: "or" }
];
