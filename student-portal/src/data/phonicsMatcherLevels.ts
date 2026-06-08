export interface PhonicsRound {
  textToSpeak: string;
  questionText: string;
  options: string[];
  answer: string;
}

export interface PhonicsMatcherLevel {
  levelIndex: number;
  title: string;
  description: string;
  rounds: PhonicsRound[];
}

export const PHONICS_MATCHER_LEVELS: PhonicsMatcherLevel[] = [
  {
    levelIndex: 0,
    title: "Short Vowel Sounds",
    description: "Distinguish between brief vowel sounds (e.g., pen vs. pin, set vs. sit).",
    rounds: [
      { textToSpeak: "sheet", questionText: "Listen to the word and select the correct spelling:", options: ["sheet", "sit", "seat", "shout"], answer: "sheet" },
      { textToSpeak: "pen", questionText: "Listen to the word and select the correct spelling:", options: ["pin", "pen", "pan", "pain"], answer: "pen" },
      { textToSpeak: "bat", questionText: "Listen to the word and select the correct spelling:", options: ["bet", "bit", "bat", "but"], answer: "bat" },
      { textToSpeak: "ship", questionText: "Listen to the word and select the correct spelling:", options: ["sheep", "ship", "shape", "shop"], answer: "ship" },
      { textToSpeak: "ten", questionText: "Listen to the word and select the correct spelling:", options: ["tin", "ten", "tan", "teen"], answer: "ten" }
    ]
  },
  {
    levelIndex: 1,
    title: "Long Vowel Digraphs",
    description: "Master spells containing double vowel combinations (ee, ea, oo, oa).",
    rounds: [
      { textToSpeak: "reach", questionText: "Listen to the word and select the correct spelling:", options: ["rich", "reach", "wretch", "roach"], answer: "reach" },
      { textToSpeak: "boat", questionText: "Listen to the word and select the correct spelling:", options: ["boot", "boat", "bout", "bought"], answer: "boat" },
      { textToSpeak: "meet", questionText: "Listen to the word and select the correct spelling:", options: ["meat", "meet", "met", "mate"], answer: "meet" },
      { textToSpeak: "spoon", questionText: "Listen to the word and select the correct spelling:", options: ["spun", "spoon", "spawn", "spine"], answer: "spoon" },
      { textToSpeak: "soap", questionText: "Listen to the word and select the correct spelling:", options: ["sap", "soup", "soap", "sop"], answer: "soap" }
    ]
  },
  {
    levelIndex: 2,
    title: "Tricky Silent Letters",
    description: "Identify words with spelling-letters that are completely silent in pronunciation.",
    rounds: [
      { textToSpeak: "climb", questionText: "Listen to the word (with a silent 'b') and select the correct spelling:", options: ["claim", "climb", "limb", "climbed"], answer: "climb" },
      { textToSpeak: "receipt", questionText: "Listen to the word (with a silent 'p') and select the correct spelling:", options: ["receipt", "recipe", "receive", "recept"], answer: "receipt" },
      { textToSpeak: "doubt", questionText: "Listen to the word (with a silent 'b') and select the correct spelling:", options: ["dot", "doubt", "debt", "double"], answer: "doubt" },
      { textToSpeak: "knife", questionText: "Listen to the word (with a silent 'k') and select the correct spelling:", options: ["knife", "nife", "life", "wife"], answer: "knife" },
      { textToSpeak: "ghost", questionText: "Listen to the word (with a silent 'h') and select the correct spelling:", options: ["goat", "ghost", "gost", "host"], answer: "ghost" }
    ]
  },
  {
    levelIndex: 3,
    title: "Soft vs. Hard Sounds",
    description: "Calibrate letters C and G which produce soft (/s/, /dʒ/) or hard (/k/, /g/) sounds.",
    rounds: [
      { textToSpeak: "cell", questionText: "Listen to the soft 'C' word (/s/) and select the correct spelling:", options: ["sell", "cell", "call", "coal"], answer: "cell" },
      { textToSpeak: "gem", questionText: "Listen to the soft 'G' word (/dʒ/) and select the correct spelling:", options: ["jam", "gem", "gum", "game"], answer: "gem" },
      { textToSpeak: "call", questionText: "Listen to the hard 'C' word (/k/) and select the correct spelling:", options: ["cell", "sell", "call", "coal"], answer: "call" },
      { textToSpeak: "gum", questionText: "Listen to the hard 'G' word (/g/) and select the correct spelling:", options: ["gum", "gem", "gym", "game"], answer: "gum" },
      { textToSpeak: "city", questionText: "Listen to the soft 'C' word (/s/) and select the correct spelling:", options: ["sity", "city", "pity", "kitty"], answer: "city" }
    ]
  },
  {
    levelIndex: 4,
    title: "Consonant Digraphs",
    description: "Practice blended double-consonant sounds like sh, ch, th, and ph.",
    rounds: [
      { textToSpeak: "brush", questionText: "Listen to the sound ending in /ʃ/ and select the correct spelling:", options: ["brush", "brushy", "blush", "brunch"], answer: "brush" },
      { textToSpeak: "photo", questionText: "Listen to the sound starting in /f/ spelt with digraph and select spelling:", options: ["foto", "photo", "photor", "potter"], answer: "photo" },
      { textToSpeak: "chime", questionText: "Listen to the sound starting in /tʃ/ and select the correct spelling:", options: ["chime", "time", "crime", "climb"], answer: "chime" },
      { textToSpeak: "think", questionText: "Listen to the sound starting in /θ/ and select the correct spelling:", options: ["think", "sink", "thank", "tink"], answer: "think" },
      { textToSpeak: "phone", questionText: "Listen to the sound starting in /f/ and select the correct spelling:", options: ["fone", "phone", "bone", "prone"], answer: "phone" }
    ]
  },
  {
    levelIndex: 5,
    title: "Magic E Effect",
    description: "Learn how a silent 'E' at the end changes short vowels to long ones.",
    rounds: [
      { textToSpeak: "pine", questionText: "Listen to the long 'I' word and select the correct spelling:", options: ["pin", "pine", "pain", "pane"], answer: "pine" },
      { textToSpeak: "hate", questionText: "Listen to the long 'A' word and select the correct spelling:", options: ["hat", "hate", "heat", "height"], answer: "hate" },
      { textToSpeak: "bite", questionText: "Listen to the long 'I' word and select the correct spelling:", options: ["bit", "bite", "beat", "bait"], answer: "bite" },
      { textToSpeak: "tape", questionText: "Listen to the long 'A' word and select the correct spelling:", options: ["tap", "tape", "tip", "type"], answer: "tape" },
      { textToSpeak: "cube", questionText: "Listen to the long 'U' word and select the correct spelling:", options: ["cub", "cube", "cobb", "tube"], answer: "cube" }
    ]
  },
  {
    levelIndex: 6,
    title: "Diphthong Vowel Glides",
    description: "Identify sliding double-vowel sounds (oi, oy, ou, ow).",
    rounds: [
      { textToSpeak: "coin", questionText: "Listen to the sound /ɔɪ/ and select the correct spelling:", options: ["coin", "corn", "cone", "coyne"], answer: "coin" },
      { textToSpeak: "house", questionText: "Listen to the sound /aʊ/ and select the correct spelling:", options: ["house", "hose", "hows", "horse"], answer: "house" },
      { textToSpeak: "toy", questionText: "Listen to the sound /ɔɪ/ ending and select the correct spelling:", options: ["toy", "tie", "toe", "tray"], answer: "toy" },
      { textToSpeak: "clown", questionText: "Listen to the sound /aʊ/ and select the correct spelling:", options: ["clone", "clown", "crown", "clean"], answer: "clown" },
      { textToSpeak: "soil", questionText: "Listen to the sound /ɔɪ/ and select the correct spelling:", options: ["soul", "sail", "soil", "sole"], answer: "soil" }
    ]
  },
  {
    levelIndex: 7,
    title: "R-Controlled Vowels",
    description: "Calibrate vowels whose sound is altered when followed by letter 'R'.",
    rounds: [
      { textToSpeak: "skirt", questionText: "Listen to the word and select the correct spelling:", options: ["skirt", "shirt", "skart", "skert"], answer: "skirt" },
      { textToSpeak: "bark", questionText: "Listen to the word and select the correct spelling:", options: ["back", "bark", "bake", "buck"], answer: "bark" },
      { textToSpeak: "fork", questionText: "Listen to the word and select the correct spelling:", options: ["folk", "fork", "fake", "frock"], answer: "fork" },
      { textToSpeak: "burn", questionText: "Listen to the word and select the correct spelling:", options: ["barn", "burn", "born", "bun"], answer: "burn" },
      { textToSpeak: "fern", questionText: "Listen to the word and select the correct spelling:", options: ["fern", "farm", "firm", "fawn"], answer: "fern" }
    ]
  },
  {
    levelIndex: 8,
    title: "Tricky Spelling Exceptions",
    description: "Calibrate uncommon pronunciations of standard letter patterns.",
    rounds: [
      { textToSpeak: "choir", questionText: "Listen to the word (pronounced 'kwai-er') and select the correct spelling:", options: ["choir", "chore", "core", "chair"], answer: "choir" },
      { textToSpeak: "schedule", questionText: "Listen to the word and select the correct spelling:", options: ["schedule", "school", "sketch", "schemed"], answer: "schedule" },
      { textToSpeak: "yacht", questionText: "Listen to the word (pronounced 'yot') and select the correct spelling:", options: ["yacht", "yatch", "yat", "yought"], answer: "yacht" },
      { textToSpeak: "island", questionText: "Listen to the word (with a silent 's') and select the correct spelling:", options: ["iland", "island", "ireland", "highland"], answer: "island" },
      { textToSpeak: "recipe", questionText: "Listen to the word (pronounced 'reh-see-pee') and select spelling:", options: ["recipe", "receipt", "receive", "recite"], answer: "recipe" }
    ]
  },
  {
    levelIndex: 9,
    title: "Suffix -ed Pronunciation",
    description: "Distinguish between past verb ending sounds /t/, /d/, and /ɪd/.",
    rounds: [
      { textToSpeak: "walked", questionText: "Listen to the past verb (ending in the /t/ sound) and select spelling:", options: ["walkt", "walked", "walk", "walking"], answer: "walked" },
      { textToSpeak: "played", questionText: "Listen to the past verb (ending in the /d/ sound) and select spelling:", options: ["playd", "played", "play", "playing"], answer: "played" },
      { textToSpeak: "started", questionText: "Listen to the past verb (ending in the /ɪd/ sound) and select spelling:", options: ["startid", "started", "start", "starting"], answer: "started" },
      { textToSpeak: "helped", questionText: "Listen to the past verb (ending in the /t/ sound) and select spelling:", options: ["helpt", "helped", "help", "helping"], answer: "helped" },
      { textToSpeak: "called", questionText: "Listen to the past verb (ending in the /d/ sound) and select spelling:", options: ["calld", "called", "call", "calling"], answer: "called" }
    ]
  },
  {
    levelIndex: 10,
    title: "Tricky -gh- Spelling Sounds",
    description: "Identify how letter combination -gh- changes to /f/, /g/, or stays silent.",
    rounds: [
      { textToSpeak: "laugh", questionText: "Listen to the word (ending in the /f/ sound) and select spelling:", options: ["laf", "laugh", "lofty", "luff"], answer: "laugh" },
      { textToSpeak: "through", questionText: "Listen to the word (where -gh- is silent) and select spelling:", options: ["thru", "through", "threw", "thorough"], answer: "through" },
      { textToSpeak: "tough", questionText: "Listen to the word (ending in the /f/ sound) and select spelling:", options: ["tuff", "tough", "touch", "though"], answer: "tough" },
      { textToSpeak: "ghost", questionText: "Listen to the word (where -gh- makes a hard /g/ sound) and select spelling:", options: ["gost", "ghost", "goat", "guest"], answer: "ghost" },
      { textToSpeak: "cough", questionText: "Listen to the word (ending in the /f/ sound) and select spelling:", options: ["kof", "cough", "coffe", "cuff"], answer: "cough" }
    ]
  },
  {
    levelIndex: 11,
    title: "Complex Phonics Calibration",
    description: "Advanced audio spelling challenges to lock in your active calibration.",
    rounds: [
      { textToSpeak: "foreign", questionText: "Listen to the word (with a silent 'g') and select the correct spelling:", options: ["forin", "foreign", "foriegn", "foreign"], answer: "foreign" },
      { textToSpeak: "subtle", questionText: "Listen to the word (with a silent 'b') and select the correct spelling:", options: ["suttle", "subtle", "subtel", "subtlely"], answer: "subtle" },
      { textToSpeak: "tongue", questionText: "Listen to the word (pronounced 'tung') and select the correct spelling:", options: ["tung", "tongue", "tonge", "tonguey"], answer: "tongue" },
      { textToSpeak: "rhythm", questionText: "Listen to the word (pronounced 'ri-thum') and select the correct spelling:", options: ["rythm", "rhythm", "ri-them", "rythum"], answer: "rhythm" },
      { textToSpeak: "column", questionText: "Listen to the word (with a silent 'n') and select the correct spelling:", options: ["colum", "column", "coloum", "colume"], answer: "column" }
    ]
  }
];
