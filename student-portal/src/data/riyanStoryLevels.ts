export interface StorySegment {
  id: string;
  type: 'narrative' | 'animation' | 'puzzle';
  
  // For narrative segments
  storyText?: string;
  narratorEmoji?: string;
  
  // For animation segments
  animationAction?: 'idle' | 'walk' | 'lookAround' | 'shocked' | 'victory';
  backgroundTheme?: 'bedroom' | 'crossroad' | 'bridge' | 'castle-gate' | 'castle-hall';
  charactersPresent?: string[];
  speechBubbleText?: string; // Characters saying something in dialogue
  
  // For puzzle segments
  question?: string;
  options?: string[];
  answer?: number; // 0-indexed correct option
  clue?: string;
  successMessage?: string;
}

export interface StoryLevel {
  level: number;
  title: string;
  description: string;
  grammarFocus: string;
  colorTheme: string;
  segments: StorySegment[];
}

export const RIYAN_STORY_LEVELS: StoryLevel[] = [
  {
    level: 1,
    title: "The Mysterious Note 📜",
    description: "Help Riyan find the magical floating note in his bedroom and solve his first noun and pronoun challenges to begin the adventure.",
    grammarFocus: "Nouns & Pronouns",
    colorTheme: "from-rose-500 to-pink-600",
    segments: [
      {
        id: 'l1-s0',
        type: 'narrative',
        storyText: "Riyan was a cheerful boy who lived in a small, cozy town. He loved playing games and exploring, but he always found English very difficult at school. He wanted to speak fluently like his friends. One quiet evening, while studying at his desk, the lights suddenly flickered and a soft glow filled his room...",
        narratorEmoji: "📖"
      },
      {
        id: 'l1-s1',
        type: 'animation',
        animationAction: 'shocked',
        backgroundTheme: 'bedroom',
        charactersPresent: ['Riyan'],
        speechBubbleText: "Whoa! My desk is glowing! What is this floating paper?"
      },
      {
        id: 'l1-s2',
        type: 'puzzle',
        question: "The floating note lands on Riyan's desk. It says: 'Identify the NOUN (naming word) in this sentence: \"The magical castle awaits you.\"\'",
        options: ["Magical", "Castle", "Awaits", "You"],
        answer: 1,
        clue: "A noun is a name of a person, place, or thing. What place is mentioned in this sentence?",
        successMessage: "Superb! 'Castle' is a place noun. As soon as Riyan reads it, the note glows with bright blue letters!"
      },
      {
        id: 'l1-s3',
        type: 'narrative',
        storyText: "The magical note began to shine with a brilliant blue light! English letters floated off the page and danced around the room. Riyan rubbed his eyes in disbelief as a friendly voice echoed: 'Riyan, if you want to learn the secrets of English, you must find the Chamber of Fluency in the Castle of Voices. Take your notebook and begin your journey!'",
        narratorEmoji: "✨"
      },
      {
        id: 'l1-s4',
        type: 'animation',
        animationAction: 'walk',
        backgroundTheme: 'bedroom',
        charactersPresent: ['Riyan'],
        speechBubbleText: "I'll pack my bag and solve this mystery! Off to the Castle of Voices!"
      },
      {
        id: 'l1-s5',
        type: 'puzzle',
        question: "Riyan steps out of his garden gate. To unlock the pathway, he must solve this pronoun puzzle: 'Which word is a PRONOUN (replaces a name) here: \"Riyan packed his bag and he was ready.\"\'",
        options: ["Riyan", "Packed", "He", "Ready"],
        answer: 2,
        clue: "A pronoun replaces a noun to avoid repetition. Look for the short word representing Riyan.",
        successMessage: "Correct! 'He' is the pronoun. The path ahead turns bright green and guides Riyan forward!"
      }
    ]
  },
  {
    level: 2,
    title: "The Talking Signpost 🪧",
    description: "Riyan arrives at a magical crossroad and must solve verb puzzles to make the signpost point him in the right direction.",
    grammarFocus: "Action Verbs & Tenses",
    colorTheme: "from-orange-500 to-amber-600",
    segments: [
      {
        id: 'l2-s0',
        type: 'narrative',
        storyText: "Riyan walked for hours until he reached a mysterious crossroad in the forest. In the center stood a wooden signpost with spinning arrows that pointed in all directions. Riyan stood confused. Suddenly, the signpost yawned, opened its wooden eyes, and spoke!",
        narratorEmoji: "🌲"
      },
      {
        id: 'l2-s1',
        type: 'animation',
        animationAction: 'lookAround',
        backgroundTheme: 'crossroad',
        charactersPresent: ['Riyan'],
        speechBubbleText: "Oh! A talking signpost! Which road leads to the castle?"
      },
      {
        id: 'l2-s2',
        type: 'puzzle',
        question: "The Signpost groans: 'To make me point to the Castle of Voices, tell me which word is an ACTION VERB in: \"Riyan ran quickly through the woods.\"\'",
        options: ["Riyan", "Ran", "Quickly", "Woods"],
        answer: 1,
        clue: "An action verb describes what the subject is physically doing.",
        successMessage: "Correct! 'Ran' is the action verb. The signpost creaks and points one of its wooden arrows to the right!"
      },
      {
        id: 'l2-s3',
        type: 'narrative',
        storyText: "With a loud click, the signpost's main arrow aligned toward a dark forest trail. Riyan thanked the signpost and ran down the path. As he went, he noticed that the trees in this part of the forest seemed to move their branches, waving him forward.",
        narratorEmoji: "🌿"
      },
      {
        id: 'l2-s4',
        type: 'animation',
        animationAction: 'walk',
        backgroundTheme: 'crossroad',
        charactersPresent: ['Riyan'],
        speechBubbleText: "Thank you, Signpost! I will follow this path!"
      },
      {
        id: 'l2-s5',
        type: 'puzzle',
        question: "Before entering the deep woods, the signpost calls out: 'One more riddle! Choose the correct present tense verb: \"The forest trees ___ in the wind.\"\'",
        options: ["swings", "swing", "swinging", "swung"],
        answer: 1,
        clue: "The subject 'trees' is plural, so it takes the plural base verb form.",
        successMessage: "Excellent! 'swing' agrees with the plural subject 'trees'. Riyan advances safely!"
      }
    ]
  },
  {
    level: 3,
    title: "The Broken Stone Bridge 🌉",
    description: "Help Riyan repair a rope bridge over a rushing river by solving preposition puzzles.",
    grammarFocus: "Prepositions",
    colorTheme: "from-emerald-500 to-teal-600",
    segments: [
      {
        id: 'l3-s0',
        type: 'narrative',
        storyText: "Riyan's path was blocked by a roaring, wild river. An old rope bridge stretched across, but several of its wooden steps were broken and floating down the stream. There was no other way to cross. Riyan looked down at the rushing water below and wondered how to repair it.",
        narratorEmoji: "🌊"
      },
      {
        id: 'l3-s1',
        type: 'animation',
        animationAction: 'lookAround',
        backgroundTheme: 'bridge',
        charactersPresent: ['Riyan'],
        speechBubbleText: "Oh no! The bridge is broken! How will I cross this river?"
      },
      {
        id: 'l3-s2',
        type: 'puzzle',
        question: "A friendly water sprite appears and sings: 'Find the PREPOSITION of position in: \"Riyan looked under the wooden bridge.\"\'",
        options: ["Riyan", "Looked", "Under", "Bridge"],
        answer: 2,
        clue: "A preposition tells you the location of something in relation to another thing.",
        successMessage: "Splendid! 'Under' is the preposition. A broken wooden plank magically floats back and fits into the bridge!"
      },
      {
        id: 'l3-s3',
        type: 'narrative',
        storyText: "Step by step, the planks began returning to the bridge as Riyan solved the puzzles. The water sprite clapped its hands in joy, splashing water droplets that turned into sparkling stars in the air.",
        narratorEmoji: "✨"
      },
      {
        id: 'l3-s4',
        type: 'animation',
        animationAction: 'walk',
        backgroundTheme: 'bridge',
        charactersPresent: ['Riyan'],
        speechBubbleText: "It's working! The steps are coming back! Let's get across!"
      },
      {
        id: 'l3-s5',
        type: 'puzzle',
        question: "To secure the final step of the bridge, complete the sentence with the correct preposition: \"Riyan walked safely ___ the river sprite's help.\"\'",
        options: ["with", "on", "into", "at"],
        answer: 0,
        clue: "Look for the preposition that shows association or assistance.",
        successMessage: "Correct! 'with' is correct. The bridge is fully repaired and Riyan crosses to the other side!"
      }
    ]
  },
  {
    level: 4,
    title: "The Gatekeeper Robot 🤖",
    description: "Answer the gatekeeper robot's modal helper riddles to gain access to the Castle of Voices.",
    grammarFocus: "Modal Verbs",
    colorTheme: "from-cyan-500 to-blue-600",
    segments: [
      {
        id: 'l4-s0',
        type: 'narrative',
        storyText: "Finally, the towering gates of the Castle of Voices loomed before Riyan. The castle walls were made of glowing blue stone. Standing at the gate was a metallic Gatekeeper Robot. Its chest screen flashed with spelling words. As Riyan approached, the robot raised its metal arms.",
        narratorEmoji: "🏰"
      },
      {
        id: 'l4-s1',
        type: 'animation',
        animationAction: 'shocked',
        backgroundTheme: 'castle-gate',
        charactersPresent: ['Riyan'],
        speechBubbleText: "Whoa, a huge metal robot! Hello! Can I enter the castle?"
      },
      {
        id: 'l4-s2',
        type: 'puzzle',
        question: "The Robot whirs: 'Access restricted! Solve modal logic to enter. Which helper verb shows capability/ability: \"Riyan ___ speak English fluently with practice.\"\'",
        options: ["must", "can", "should", "might"],
        answer: 1,
        clue: "Select the modal verb used to express a physical or mental ability.",
        successMessage: "Great job! 'can' represents ability. The robot's eyes flash green!"
      },
      {
        id: 'l4-s3',
        type: 'narrative',
        storyText: "The gatekeeper robot emitted a pleasant chime. 'Correct. Ability unlocked.' The huge iron locks of the castle gate began to slide open, making a deep rumbling sound. Riyan smiled and prepared to take his final steps inside.",
        narratorEmoji: "🤖"
      },
      {
        id: 'l4-s4',
        type: 'animation',
        animationAction: 'victory',
        backgroundTheme: 'castle-gate',
        charactersPresent: ['Riyan'],
        speechBubbleText: "The gates are opening! Thank you, Mr. Robot!"
      },
      {
        id: 'l4-s5',
        type: 'puzzle',
        question: "The robot whirs: 'One final security check. Which modal verb shows a strong obligation or rule: \"Students ___ study daily to learn grammar.\"\'",
        options: ["must", "may", "could", "might"],
        answer: 0,
        clue: "Choose the word expressing a necessity or absolute obligation.",
        successMessage: "Excellent! 'must' expresses obligation. The gates swing wide open!"
      }
    ]
  },
  {
    level: 5,
    title: "Chamber of Fluency 👑",
    description: "Help Riyan solve advanced sentence building challenges to unlock his English Fluency Crown.",
    grammarFocus: "Conjunctions & Clauses",
    colorTheme: "from-fuchsia-500 to-indigo-600",
    segments: [
      {
        id: 'l5-s0',
        type: 'narrative',
        storyText: "Riyan entered the magnificent Castle of Voices. The walls were lined with books that whispered stories, and a grand staircase led to the Chamber of Fluency. In the center of the chamber floated a golden crown. To reach the crown, Riyan had to solve the ultimate sentence building test.",
        narratorEmoji: "👑"
      },
      {
        id: 'l5-s1',
        type: 'animation',
        animationAction: 'walk',
        backgroundTheme: 'castle-hall',
        charactersPresent: ['Riyan'],
        speechBubbleText: "There it is! The English Fluency Crown! I am so close!"
      },
      {
        id: 'l5-s2',
        type: 'puzzle',
        question: "The crown glows. A riddle appears: 'Select the correct conjunction to show contrast: \"Riyan was tired, ___ he continued studying.\"\'",
        options: ["so", "but", "because", "or"],
        answer: 1,
        clue: "Contrast shows opposing ideas (being tired vs. continuing to study).",
        successMessage: "Correct! 'but' shows contrast. The crown floats down closer to Riyan!"
      },
      {
        id: 'l5-s3',
        type: 'narrative',
        storyText: "With the last riddle solved, the Chamber of Fluency filled with a spectacular golden light! The crown floated down and rested gently on Riyan's head. Riyan felt a rush of confidence. He realized he wasn't afraid of English anymore because he had learned the rules step-by-step!",
        narratorEmoji: "🎉"
      },
      {
        id: 'l5-s4',
        type: 'animation',
        animationAction: 'victory',
        backgroundTheme: 'castle-hall',
        charactersPresent: ['Riyan'],
        speechBubbleText: "I did it! I can speak and understand English now! Thank you, everyone!"
      },
      {
        id: 'l5-s5',
        type: 'puzzle',
        question: "Final challenge! Select the word that combines these clauses: \"Riyan is happy ___ he completed his adventure successfully.\"\'",
        options: ["although", "because", "unless", "but"],
        answer: 1,
        clue: "Look for the conjunction that explains the reason/cause of his happiness.",
        successMessage: "Perfect! 'because' explains the cause. You have completed Riyan's adventure! 🎉"
      }
    ]
  }
];
