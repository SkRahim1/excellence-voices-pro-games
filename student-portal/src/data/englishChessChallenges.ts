export interface ChessChallenge {
  id: string;
  type: 'meaning' | 'synonym' | 'antonym' | 'grammar' | 'scramble' | 'correction' | 'word-id' | 'reading';
  question: string;
  options: string[];
  answer: number; // 0-indexed index of correct option
  clue: string;
}

export interface StoryChallenge {
  step: number;
  prompt: string;
  options: string[];
  answer: number;
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
      id: 'b-m-2',
      type: 'meaning',
      question: 'What is the meaning of "Gleeful"?',
      options: ['Very sad', 'Filled with joy and happiness', 'Angry at someone', 'Extremely tired'],
      answer: 1,
      clue: 'Look for the word related to joy.'
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
      id: 'b-s-2',
      type: 'synonym',
      question: 'Choose the synonym of "Tiny".',
      options: ['Huge', 'Small', 'Heavy', 'Fast'],
      answer: 1,
      clue: 'It is the opposite of big.'
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
      id: 'b-a-2',
      type: 'antonym',
      question: 'Choose the antonym of "Cold".',
      options: ['Chilly', 'Hot', 'Freezing', 'Wet'],
      answer: 1,
      clue: 'Think of fire.'
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
      type: 'grammar', // mapped to grammar mode
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
    }
  ]
};

// Story Chess Progression Banks (15 sequential steps per level)
export const STORY_CHALLENGES: {
  beginner: StoryChallenge[];
  intermediate: StoryChallenge[];
  advanced: StoryChallenge[];
} = {
  beginner: [
    {
      step: 1,
      prompt: 'Story Start: Choose the best sentence to begin your tale.',
      options: [
        'Once there was a little bird named Pip who lived in a tall oak tree.',
        'Computers are very helpful machines for doing mathematics.',
        'He has two yellow pencils in his drawer.',
        'A bus has four large black tires.'
      ],
      answer: 0,
      clue: 'Look for the character introduction.'
    },
    {
      step: 2,
      prompt: 'Next: Pip was small, but he had a big dream.',
      options: [
        'He wanted to fly higher than the fluffy white clouds in the sky.',
        'A dog barked at the red car.',
        'His wing was blue and red.',
        'Apples grow on big green trees.'
      ],
      answer: 0,
      clue: 'Find what Pip\'s dream was.'
    },
    {
      step: 3,
      prompt: 'Next: One sunny morning, he took a deep breath and jumped off his branch.',
      options: [
        'The water in the river was cold.',
        'He flapped his tiny wings as hard as he could.',
        'Many children walk to school.',
        'He decided to eat a sweet red berry.'
      ],
      answer: 1,
      clue: 'What action does a bird do after jumping off a branch?'
    },
    {
      step: 4,
      prompt: 'Next: To his surprise, he did not fall down.',
      options: [
        'He began to glide smoothly on the warm morning breeze.',
        'Rain comes from dark grey clouds.',
        'He walked slowly on the grass.',
        'His mother was cooking food.'
      ],
      answer: 0,
      clue: 'What happened when he did not fall?'
    },
    {
      step: 5,
      prompt: 'Next: High in the air, Pip met a friendly yellow butterfly.',
      options: [
        'The butterfly showed him the way to the top of the mountain.',
        'Monkeys like to eat yellow bananas.',
        'Butterfly wings are colorful.',
        'He flew down to drink some water.'
      ],
      answer: 0,
      clue: 'Find the interaction between Pip and the butterfly.'
    },
    {
      step: 6,
      prompt: 'Next: Suddenly, a strong wind began to blow.',
      options: [
        'Pip felt scared, but he kept flapping his wings brave and strong.',
        'The sun was very hot in summer.',
        'Squirrels collect nuts in the forest.',
        'He landed on a soft green leaf.'
      ],
      answer: 0,
      clue: 'How does Pip react to the strong wind?'
    },
    {
      step: 7,
      prompt: 'Next: He pushed through the wind and flew even higher.',
      options: [
        'He finally reached the top of the highest cloud.',
        'Birds build nests in tall trees.',
        'He decided to return to his oak tree.',
        'A cat was sleeping on the ground.'
      ],
      answer: 0,
      clue: 'Find the outcome of flying higher.'
    },
    {
      step: 8,
      prompt: 'Next: From the top, the world below looked very small.',
      options: [
        'He could see rivers winding like silver ribbons.',
        'Trains run on iron tracks.',
        'He was hungry and wanted food.',
        'The sky was blue.'
      ],
      answer: 0,
      clue: 'What could he see from the high cloud?'
    },
    {
      step: 9,
      prompt: 'Next: Pip saw a golden crown shining on a nearby mountain peak.',
      options: [
        'He decided to fly towards the peak to inspect it.',
        'Crowns are worn by kings.',
        'Mountains are tall and snowy.',
        'He returned to his nest.'
      ],
      answer: 0,
      clue: 'What does Pip do when he sees the crown?'
    },
    {
      step: 10,
      prompt: 'Next: As he approached the peak, a large eagle appeared.',
      options: [
        'The eagle smiled and said, "Only the bravest birds can reach this crown."',
        'Eagles are very large birds of prey.',
        'The eagle ate a fish from the river.',
        'Pip hid under a gray stone.'
      ],
      answer: 0,
      clue: 'Find what the eagle said to Pip.'
    },
    {
      step: 11,
      prompt: 'Next: The eagle picked up the golden crown with its talons.',
      options: [
        'He gently placed it on Pip\'s head as a reward.',
        'The crown was made of solid gold.',
        'The eagle flew away into the sun.',
        'Pip was too small to carry it.'
      ],
      answer: 0,
      clue: 'Find what the eagle does with the crown.'
    },
    {
      step: 12,
      prompt: 'Next: Pip felt extremely proud and happy.',
      options: [
        'He realized that size does not limit your dreams.',
        'His wings were very tired.',
        'The squirrel cheered from below.',
        'He decided to fly back to his oak tree.'
      ],
      answer: 0,
      clue: 'What lesson did Pip realize?'
    },
    {
      step: 13,
      prompt: 'Next: Pip flew back to his home branch in the oak tree.',
      options: [
        'All the forest animals gathered to celebrate the new King of the Air.',
        'The oak tree had many green leaves.',
        'Pip took a long nap.',
        'The squirrel ran up the trunk.'
      ],
      answer: 0,
      clue: 'How did the forest react to Pip\'s return?'
    },
    {
      step: 14,
      prompt: 'Next: Pip knew this was just the beginning of his adventures.',
      options: [
        'He looked up at the moon, dreaming of his next flight.',
        'The moon shines at night.',
        'Pip was safe and sound.',
        'His mother was proud.'
      ],
      answer: 0,
      clue: 'Find Pip\'s final thought looking at the night sky.'
    },
    {
      step: 15,
      prompt: 'Story End: Choose the concluding line of your story.',
      options: [
        'And so, the little bird with the big heart ruled the skies with wisdom and joy.',
        'The story of the oak tree ends here.',
        'Computers are still very useful.',
        'He ate some seeds and went to sleep.'
      ],
      answer: 0,
      clue: 'Find the classic fairy tale ending.'
    }
  ],
  intermediate: [
    {
      step: 1,
      prompt: 'Story Start: Choose the best sentence to begin your tale.',
      options: [
        'Deep within the Whispering Woods, a forgotten stone temple stood cloaked in vines.',
        'Calculators were invented to help people compute numbers.',
        'Libraries contain many kinds of fictional books.',
        'Many tourists visit the old monument.'
      ],
      answer: 0,
      clue: 'Identify the setting introduction.'
    },
    {
      step: 2,
      prompt: 'Next: Maya, an eager young archeologist, discovered a map pointing to the temple.',
      options: [
        'She packed her journal and set out on a quest to uncover its secrets.',
        'Maps are very useful for geography lessons.',
        'Maya decided to stay home and read a book instead.',
        'The forest was full of mosquitoes.'
      ],
      answer: 0,
      clue: 'What did Maya do once she found the map?'
    },
    {
      step: 3,
      prompt: 'Next: After hiking for hours, she arrived at the massive stone entrance.',
      options: [
        'She noticed a strange runic symbol carved into the keyhole.',
        'Stone entrances are common in historical sites.',
        'She felt extremely tired and decided to sleep.',
        'Trees grow tall in tropical forests.'
      ],
      answer: 0,
      clue: 'What did she find on the entrance?'
    },
    {
      step: 4,
      prompt: 'Next: The symbol matched a gold ring she had inherited from her grandfather.',
      options: [
        'She pressed the ring into the carving, and the stone door groaned open.',
        'Inheritance tax is a complex law.',
        'The ring was made of shiny gold.',
        'Maya went back to the village.'
      ],
      answer: 0,
      clue: 'What happened when she used the ring?'
    },
    {
      step: 5,
      prompt: 'Next: Inside, the air was cool and smelled of damp earth and ancient paper.',
      options: [
        'She lit her flashlight, revealing walls covered in beautiful murals.',
        'Murals are paintings done directly on walls.',
        'Damp earth is good for growing mushrooms.',
        'She heard a bat screech.'
      ],
      answer: 0,
      clue: 'Find the exploration step using a flashlight.'
    },
    {
      step: 6,
      prompt: 'Next: The murals depicted a legendary explorer holding a glowing crystal.',
      options: [
        'According to the inscription, this crystal could heal any illness.',
        'Crystals have symmetric atomic structures.',
        'The crystal was blue and very bright.',
        'She took a photograph of the wall.'
      ],
      answer: 0,
      clue: 'What properties did the crystal have?'
    },
    {
      step: 7,
      prompt: 'Next: In the center of the room sat a stone pedestal with a locked chest.',
      options: [
        'Maya solved the riddle carved on the chest: "What has keys but opens no locks?"',
        'Stone pedestals are heavy.',
        'She decided to break the chest with a hammer.',
        'The riddle was too difficult.'
      ],
      answer: 0,
      clue: 'Find the riddle solving step.'
    },
    {
      step: 8,
      prompt: 'Next: The answer to the riddle was a "Piano".',
      options: [
        'When she entered the word into the puzzle lock, the chest clicked open.',
        'Pianos have 88 keys.',
        'She played a tune on the pedestal.',
        'The chest was full of dust.'
      ],
      answer: 0,
      clue: 'What happened when the riddle was answered?'
    },
    {
      step: 9,
      prompt: 'Next: Nestled inside the velvet lining was the fabled healing crystal.',
      options: [
        'It pulsed with a soft, warm green light.',
        'Velvet is a very soft fabric.',
        'The crystal was heavier than expected.',
        'She put it in her bag.'
      ],
      answer: 0,
      clue: 'Describe the crystal\'s appearance.'
    },
    {
      step: 10,
      prompt: 'Next: Suddenly, a rumbling sound echoed through the chamber.',
      options: [
        'The walls began to shake as the ancient temple started to collapse.',
        'Sound travels faster in solids.',
        'Maya ran out of the room.',
        'A stone fell from the ceiling.'
      ],
      answer: 0,
      clue: 'What was the cause of the rumbling?'
    },
    {
      step: 11,
      prompt: 'Next: Maya sprinted towards the exit as stones crashed around her.',
      options: [
        'She leaped through the closing stone doorway just in the nick of time.',
        'Sprinting is a great cardiovascular exercise.',
        'The exit was blocked by rubble.',
        'She dropped her flashlight.'
      ],
      answer: 0,
      clue: 'Find her escape through the door.'
    },
    {
      step: 12,
      prompt: 'Next: She rolled onto the soft grass outside as the temple entrance sealed forever.',
      options: [
        'Breathing heavily, she looked down and saw the crystal still safe in her hand.',
        'Grass is green in spring.',
        'The temple was gone.',
        'She decided to hike back.'
      ],
      answer: 0,
      clue: 'What did she discover in her hand after escaping?'
    },
    {
      step: 13,
      prompt: 'Next: Maya returned to her village, where her grandfather lay sick.',
      options: [
        'She placed the glowing crystal beside his bed, hoping the legend was true.',
        'Grandfathers tell great stories.',
        'The village was small and quiet.',
        'She cooked some hot soup.'
      ],
      answer: 0,
      clue: 'What did she do with the crystal at her grandfather\'s bedside?'
    },
    {
      step: 14,
      prompt: 'Next: Within minutes, a healthy color returned to his cheeks, and he sat up smiling.',
      options: [
        'The magic of the Whispering Woods had saved him.',
        'He asked for a cup of tea.',
        'Maya was relieved.',
        'The crystal lost its glow.'
      ],
      answer: 0,
      clue: 'Find the reference to the magic of the woods.'
    },
    {
      step: 15,
      prompt: 'Story End: Choose the concluding line of your story.',
      options: [
        'And so, Maya\'s brave quest not only unlocked ancient history but brought life back to her family.',
        'The archeological report was submitted.',
        'They lived in the village.',
        'She went back to look for more keys.'
      ],
      answer: 0,
      clue: 'Find the final thematic wrap-up.'
    }
  ],
  advanced: [
    {
      step: 1,
      prompt: 'Story Start: Choose the best sentence to begin your tale.',
      options: [
        'In the year 2145, New Kyoto was a metropolis defined by neon spires and synthetic rain.',
        'Metropolitan cities require large electrical grids to sustain power.',
        'Kyoto is a historical city located in Japan.',
        'He looked at his holographic watch.'
      ],
      answer: 0,
      clue: 'Find the futuristic sci-fi setting introduction.'
    },
    {
      step: 2,
      prompt: 'Next: Ren, a freelance cyber-detective, received an encrypted file containing a blueprint.',
      options: [
        'The blueprint detailed a secret quantum server hidden beneath the city\'s central bank.',
        'Blueprints are architect drawing files.',
        'Ren decided to delete the file immediately.',
        'Kyoto was full of flying vehicles.'
      ],
      answer: 0,
      clue: 'What did the blueprint reveal?'
    },
    {
      step: 3,
      prompt: 'Next: He knew accessing the server could expose the city\'s corrupt leadership.',
      options: [
        'Determined to bring justice, he initiated his cloaking gear and entered the dark subway lines.',
        'Corruption is a systemic problem.',
        'Ren was wearing a leather jacket.',
        'Kyoto\'s subway was fast.'
      ],
      answer: 0,
      clue: 'Find the detective\'s action starting his infiltration.'
    },
    {
      step: 4,
      prompt: 'Next: He bypassed the perimeter lasers using a custom decryption device.',
      options: [
        'He slipped unnoticed into the high-security server basement.',
        'Lasers are dangerous light beams.',
        'The decryption took twelve seconds.',
        'Ren took a deep breath.'
      ],
      answer: 0,
      clue: 'Where did he slip into next?'
    },
    {
      step: 5,
      prompt: 'Next: The server was a massive pillar of black glass pulsing with cyan data lines.',
      options: [
        'Ren connected his neural link directly to the core terminal.',
        'Quantum servers operate on qubits.',
        'The glass was cold to the touch.',
        'He started downloading files.'
      ],
      answer: 0,
      clue: 'Find his action connecting to the server terminal.'
    },
    {
      step: 6,
      prompt: 'Next: Instantly, his consciousness was projected into the digital grid.',
      options: [
        'He was greeted by an AI defense program resembling a silver samurai.',
        'Consciousness is a subject of philosophy.',
        'The grid was bright and infinite.',
        'He felt a sudden headache.'
      ],
      answer: 0,
      clue: 'What security bot did he encounter?'
    },
    {
      step: 7,
      prompt: 'Next: The samurai drew a sword of pure code, warning him to turn back.',
      options: [
        'Ren initiated his firewall algorithms to defend his neural link.',
        'Samurai swords are called katanas.',
        'Ren was a skilled programmer.',
        'The digital wind blew.'
      ],
      answer: 0,
      clue: 'Find Ren\'s defensive action.'
    },
    {
      step: 8,
      prompt: 'Next: He redirected the server\'s cooling protocols to freeze the AI.',
      options: [
        'The silver samurai shattered into thousands of harmless code blocks.',
        'Cooling systems prevent computer overheating.',
        'The AI froze instantly.',
        'Ren smiled in relief.'
      ],
      answer: 0,
      clue: 'What happened to the silver samurai?'
    },
    {
      step: 9,
      prompt: 'Next: With the path cleared, the core files lay completely unguarded.',
      options: [
        'He downloaded the encryption keys containing proof of corporate fraud.',
        'Unguarded data is easy to steal.',
        'The download was very fast.',
        'Ren finished the hack.'
      ],
      answer: 0,
      clue: 'What files did he download?'
    },
    {
      step: 10,
      prompt: 'Next: A siren blared as physical security guards descended the elevator.',
      options: [
        'Ren severed his neural link and slipped into the ventilation shaft.',
        'Sirens emit loud acoustic waves.',
        'The elevator was fast.',
        'Ren ran toward the door.'
      ],
      answer: 0,
      clue: 'How did Ren escape the elevator guards?'
    },
    {
      step: 11,
      prompt: 'Next: He crawled through the shafts, emerging on a rain-slicked rooftop.',
      options: [
        'His hover-bike was waiting on the launch pad, engine hum ticking to life.',
        'Rooftops are flat in modern metropolises.',
        'The rain was cold.',
        'He hopped over the edge.'
      ],
      answer: 0,
      clue: 'Find his transport vehicle waiting for him.'
    },
    {
      step: 12,
      prompt: 'Next: Guards opened fire as he sped away into the neon canyons of the city.',
      options: [
        'He wove through the automated traffic lines, losing them in the lower sectors.',
        'Firing weapons is illegal in city zones.',
        'The hover-bike was extremely fast.',
        'The guards gave up.'
      ],
      answer: 0,
      clue: 'How did he escape the guards\' fire?'
    },
    {
      step: 13,
      prompt: 'Next: Safe in his hidden warehouse lab, he uploaded the data.',
      options: [
        'He broadcast the file to every screen and hologram in New Kyoto simultaneously.',
        'Warehouse labs are common for hackers.',
        'The upload took two minutes.',
        'Ren sat down exhausted.'
      ],
      answer: 0,
      clue: 'Where did he broadcast the files?'
    },
    {
      step: 14,
      prompt: 'Next: Citizens filled the streets in protest, demanding the corrupt council resign.',
      options: [
        'By morning, the old regime had fallen, and a new era of transparency had begun.',
        'Protest is a democratic right.',
        'The council resigned.',
        'Ren turned off his monitor.'
      ],
      answer: 0,
      clue: 'Find the outcome by morning.'
    },
    {
      step: 15,
      prompt: 'Story End: Choose the concluding line of your story.',
      options: [
        'As the synthetic rain washed over the city, Ren looked out, knowing he had finally cleared the air.',
        'The city of New Kyoto was quiet once again.',
        'He went to sleep.',
        'The cyber-detective retired.'
      ],
      answer: 0,
      clue: 'Find the poetic concluding thought.'
    }
  ]
};
