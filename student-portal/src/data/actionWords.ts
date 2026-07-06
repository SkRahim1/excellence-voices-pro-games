export interface ActionWord {
  base: string;
  forms: [string, string, string, string, string]; // [Base/V1, Past/V2, Past Participle/V3, Present Participle/V4, Future/Will V1]
  context: string; // context phrase e.g. "breakfast", "to school"
}

export interface ActionWordLevel {
  levelNumber: number;
  title: string;
  words: ActionWord[];
}

export const getActionWordExamples = (word: ActionWord): [string, string, string, string, string] => {
  const [v1, v2, v3, v4, v5] = word.forms;
  const ctx = word.context ? ` ${word.context}` : '';
  
  // Custom templates to ensure natural-sounding sentences for specific verbs
  if (word.base.toLowerCase() === 'go') {
    return [
      `I go${ctx} every day.`,
      `I went${ctx} yesterday.`,
      `I have gone${ctx}.`,
      `I am going${ctx} now.`,
      `I will go${ctx} later.`
    ];
  }
  
  if (word.base.toLowerCase() === 'come') {
    return [
      `I come${ctx} every day.`,
      `I came${ctx} yesterday.`,
      `I have come${ctx}.`,
      `I am coming${ctx} now.`,
      `I will come${ctx} later.`
    ];
  }

  return [
    `I ${v1}${ctx} every day.`,
    `I ${v2}${ctx} yesterday.`,
    `I have ${v3}${ctx}.`,
    `I am ${v4}${ctx}.`,
    `I ${v5}${ctx} later.`
  ];
};

export const ACTION_WORD_LEVELS: ActionWordLevel[] = [
  {
    levelNumber: 1,
    title: "Everyday Actions",
    words: [
      { base: "eat", forms: ["eat", "ate", "eaten", "eating", "will eat"], context: "breakfast" },
      { base: "go", forms: ["go", "went", "gone", "going", "will go"], context: "to school" },
      { base: "come", forms: ["come", "came", "come", "coming", "will come"], context: "home" },
      { base: "read", forms: ["read", "read", "read", "reading", "will read"], context: "books" },
      { base: "write", forms: ["write", "wrote", "written", "writing", "will write"], context: "letters" },
      { base: "drink", forms: ["drink", "drank", "drunk", "drinking", "will drink"], context: "water" },
      { base: "run", forms: ["run", "ran", "run", "running", "will run"], context: "in the park" },
      { base: "walk", forms: ["walk", "walked", "walked", "walking", "will walk"], context: "slowly" },
      { base: "speak", forms: ["speak", "spoke", "spoken", "speaking", "will speak"], context: "English" },
      { base: "play", forms: ["play", "played", "played", "playing", "will play"], context: "football" }
    ]
  },
  {
    levelNumber: 2,
    title: "Basic Interactions",
    words: [
      { base: "see", forms: ["see", "saw", "seen", "seeing", "will see"], context: "the birds" },
      { base: "look", forms: ["look", "looked", "looked", "looking", "will look"], context: "at the map" },
      { base: "make", forms: ["make", "made", "made", "making", "will make"], context: "a paper plane" },
      { base: "do", forms: ["do", "did", "done", "doing", "will do"], context: "homework" },
      { base: "give", forms: ["give", "gave", "given", "giving", "will give"], context: "gifts" },
      { base: "take", forms: ["take", "took", "taken", "taking", "will take"], context: "notes" },
      { base: "find", forms: ["find", "found", "found", "finding", "will find"], context: "the keys" },
      { base: "get", forms: ["get", "got", "gotten", "getting", "will get"], context: "prizes" },
      { base: "bring", forms: ["bring", "brought", "brought", "bringing", "will bring"], context: "lunch" },
      { base: "buy", forms: ["buy", "bought", "bought", "buying", "will buy"], context: "toys" }
    ]
  },
  {
    levelNumber: 3,
    title: "Senses & Emotions",
    words: [
      { base: "think", forms: ["think", "thought", "thought", "thinking", "will think"], context: "about it" },
      { base: "know", forms: ["know", "knew", "known", "knowing", "will know"], context: "the answer" },
      { base: "tell", forms: ["tell", "told", "told", "telling", "will tell"], context: "stories" },
      { base: "say", forms: ["say", "said", "said", "saying", "will say"], context: "hello" },
      { base: "hear", forms: ["hear", "heard", "heard", "hearing", "will hear"], context: "the sound" },
      { base: "listen", forms: ["listen", "listened", "listened", "listening", "will listen"], context: "to music" },
      { base: "sing", forms: ["sing", "sang", "sung", "singing", "will sing"], context: "songs" },
      { base: "dance", forms: ["dance", "danced", "danced", "dancing", "will dance"], context: "on stage" },
      { base: "laugh", forms: ["laugh", "laughed", "laughed", "laughing", "will laugh"], context: "at jokes" },
      { base: "cry", forms: ["cry", "cried", "cried", "crying", "will cry"], context: "loudly" }
    ]
  },
  {
    levelNumber: 4,
    title: "Movement & Motion",
    words: [
      { base: "sleep", forms: ["sleep", "slept", "slept", "sleeping", "will sleep"], context: "early" },
      { base: "wake", forms: ["wake", "woke", "woken", "waking", "will wake"], context: "up at 6 AM" },
      { base: "sit", forms: ["sit", "sat", "sat", "sitting", "will sit"], context: "on the chair" },
      { base: "stand", forms: ["stand", "stood", "stood", "standing", "will stand"], context: "in a line" },
      { base: "jump", forms: ["jump", "jumped", "jumped", "jumping", "will jump"], context: "high" },
      { base: "swim", forms: ["swim", "swam", "swum", "swimming", "will swim"], context: "in the pool" },
      { base: "fly", forms: ["fly", "flew", "flown", "flying", "will fly"], context: "kites" },
      { base: "drive", forms: ["drive", "drove", "driven", "driving", "will drive"], context: "cars" },
      { base: "ride", forms: ["ride", "rode", "ridden", "riding", "will ride"], context: "bicycles" },
      { base: "climb", forms: ["climb", "climbed", "climbed", "climbing", "will climb"], context: "trees" }
    ]
  },
  {
    levelNumber: 5,
    title: "Study & Office",
    words: [
      { base: "work", forms: ["work", "worked", "worked", "working", "will work"], context: "hard" },
      { base: "study", forms: ["study", "studied", "studied", "studying", "will study"], context: "science" },
      { base: "learn", forms: ["learn", "learnt", "learnt", "learning", "will learn"], context: "grammar" },
      { base: "teach", forms: ["teach", "taught", "taught", "teaching", "will teach"], context: "students" },
      { base: "help", forms: ["help", "helped", "helped", "helping", "will help"], context: "friends" },
      { base: "ask", forms: ["ask", "asked", "asked", "asking", "will ask"], context: "questions" },
      { base: "answer", forms: ["answer", "answered", "answered", "answering", "will answer"], context: "clearly" },
      { base: "call", forms: ["call", "called", "called", "calling", "will call"], context: "teachers" },
      { base: "send", forms: ["send", "sent", "sent", "sending", "will send"], context: "emails" },
      { base: "receive", forms: ["receive", "received", "received", "receiving", "will receive"], context: "letters" }
    ]
  },
  {
    levelNumber: 6,
    title: "Domestic Tasks",
    words: [
      { base: "clean", forms: ["clean", "cleaned", "cleaned", "cleaning", "will clean"], context: "rooms" },
      { base: "wash", forms: ["wash", "washed", "washed", "washing", "will wash"], context: "clothes" },
      { base: "cook", forms: ["cook", "cooked", "cooked", "cooking", "will cook"], context: "dinner" },
      { base: "bake", forms: ["bake", "baked", "baked", "baking", "will bake"], context: "cakes" },
      { base: "cut", forms: ["cut", "cut", "cut", "cutting", "will cut"], context: "vegetables" },
      { base: "draw", forms: ["draw", "drew", "drawn", "drawing", "will draw"], context: "pictures" },
      { base: "paint", forms: ["paint", "painted", "painted", "painting", "will paint"], context: "walls" },
      { base: "build", forms: ["build", "built", "built", "building", "will build"], context: "houses" },
      { base: "break", forms: ["break", "broke", "broken", "breaking", "will break"], context: "rules" },
      { base: "fix", forms: ["fix", "fixed", "fixed", "fixing", "will fix"], context: "toys" }
    ]
  },
  {
    levelNumber: 7,
    title: "Physical Interactions",
    words: [
      { base: "open", forms: ["open", "opened", "opened", "opening", "will open"], context: "doors" },
      { base: "close", forms: ["close", "closed", "closed", "closing", "will close"], context: "windows" },
      { base: "push", forms: ["push", "pushed", "pushed", "pushing", "will push"], context: "carts" },
      { base: "pull", forms: ["pull", "pulled", "pulled", "pulling", "will pull"], context: "ropes" },
      { base: "throw", forms: ["throw", "threw", "thrown", "throwing", "will throw"], context: "balls" },
      { base: "catch", forms: ["catch", "caught", "caught", "catching", "will catch"], context: "fish" },
      { base: "hold", forms: ["hold", "held", "held", "holding", "will hold"], context: "hands" },
      { base: "drop", forms: ["drop", "dropped", "dropped", "dropping", "will drop"], context: "boxes" },
      { base: "lose", forms: ["lose", "lost", "lost", "losing", "will lose"], context: "games" },
      { base: "win", forms: ["win", "won", "won", "winning", "will win"], context: "medals" }
    ]
  },
  {
    levelNumber: 8,
    title: "Time & Progression",
    words: [
      { base: "start", forms: ["start", "started", "started", "starting", "will start"], context: "classes" },
      { base: "stop", forms: ["stop", "stopped", "stopped", "stopping", "will stop"], context: "cars" },
      { base: "begin", forms: ["begin", "began", "begun", "beginning", "will begin"], context: "projects" },
      { base: "end", forms: ["end", "ended", "ended", "ending", "will end"], context: "shows" },
      { base: "grow", forms: ["grow", "grew", "grown", "growing", "will grow"], context: "plants" },
      { base: "fall", forms: ["fall", "fell", "fallen", "falling", "will fall"], context: "leaves" },
      { base: "hide", forms: ["hide", "hid", "hidden", "hiding", "will hide"], context: "keys" },
      { base: "seek", forms: ["seek", "sought", "sought", "seeking", "will seek"], context: "answers" },
      { base: "search", forms: ["search", "searched", "searched", "searching", "will search"], context: "for clues" },
      { base: "chase", forms: ["chase", "chased", "chased", "chasing", "will chase"], context: "dogs" }
    ]
  },
  {
    levelNumber: 9,
    title: "Clothing & Grooming",
    words: [
      { base: "wear", forms: ["wear", "wore", "worn", "wearing", "will wear"], context: "uniforms" },
      { base: "dry", forms: ["dry", "dried", "dried", "drying", "will dry"], context: "plates" },
      { base: "comb", forms: ["comb", "combed", "combed", "combing", "will comb"], context: "hair" },
      { base: "brush", forms: ["brush", "brushed", "brushed", "brushing", "will brush"], context: "teeth" },
      { base: "iron", forms: ["iron", "ironed", "ironed", "ironing", "will iron"], context: "shirts" },
      { base: "fold", forms: ["fold", "folded", "folded", "folding", "will fold"], context: "mats" },
      { base: "pack", forms: ["pack", "packed", "packed", "packing", "will pack"], context: "bags" },
      { base: "unpack", forms: ["unpack", "unpacked", "unpacked", "unpacking", "will unpack"], context: "boxes" },
      { base: "wash", forms: ["wash", "washed", "washed", "washing", "will wash"], context: "dishes" },
      { base: "clean", forms: ["clean", "cleaned", "cleaned", "cleaning", "will clean"], context: "shoes" }
    ]
  },
  {
    levelNumber: 10,
    title: "Social Gatherings",
    words: [
      { base: "meet", forms: ["meet", "met", "met", "meeting", "will meet"], context: "relatives" },
      { base: "greet", forms: ["greet", "greeted", "greeted", "greeting", "will greet"], context: "guests" },
      { base: "hug", forms: ["hug", "hugged", "hugged", "hugging", "will hug"], context: "parents" },
      { base: "smile", forms: ["smile", "smiled", "smiled", "smiling", "will smile"], context: "happily" },
      { base: "talk", forms: ["talk", "talked", "talked", "talking", "will talk"], context: "to friends" },
      { base: "whisper", forms: ["whisper", "whispered", "whispered", "whispering", "will whisper"], context: "secrets" },
      { base: "shout", forms: ["shout", "shouted", "shouted", "shouting", "will shout"], context: "loudly" },
      { base: "invite", forms: ["invite", "invited", "invited", "inviting", "will invite"], context: "cousins" },
      { base: "visit", forms: ["visit", "visited", "visited", "visiting", "will visit"], context: "museums" },
      { base: "welcome", forms: ["welcome", "welcomed", "welcomed", "welcoming", "will welcome"], context: "visitors" }
    ]
  },
  {
    levelNumber: 11,
    title: "Decision & Mindset",
    words: [
      { base: "choose", forms: ["choose", "chose", "chosen", "choosing", "will choose"], context: "colors" },
      { base: "decide", forms: ["decide", "decided", "decided", "deciding", "will decide"], context: "plans" },
      { base: "agree", forms: ["agree", "agreed", "agreed", "agreeing", "will agree"], context: "with you" },
      { base: "promise", forms: ["promise", "promised", "promised", "promising", "will promise"], context: "honesty" },
      { base: "try", forms: ["try", "tried", "tried", "trying", "will try"], context: "our best" },
      { base: "hope", forms: ["hope", "hoped", "hoped", "hoping", "will hope"], context: "for good" },
      { base: "wish", forms: ["wish", "wished", "wished", "wishing", "will wish"], context: "well" },
      { base: "forget", forms: ["forget", "forgot", "forgotten", "forgetting", "will forget"], context: "problems" },
      { base: "remember", forms: ["remember", "remembered", "remembered", "remembering", "will remember"], context: "lessons" },
      { base: "dream", forms: ["dream", "dreamt", "dreamt", "dreaming", "will dream"], context: "big" }
    ]
  },
  {
    levelNumber: 12,
    title: "Commerce & Trade",
    words: [
      { base: "pay", forms: ["pay", "paid", "paid", "paying", "will pay"], context: "bills" },
      { base: "spend", forms: ["spend", "spent", "spent", "spending", "will spend"], context: "money" },
      { base: "earn", forms: ["earn", "earned", "earned", "earning", "will earn"], context: "salaries" },
      { base: "lend", forms: ["lend", "lent", "lent", "lending", "will lend"], context: "pencils" },
      { base: "borrow", forms: ["borrow", "borrowed", "borrowed", "borrowing", "will borrow"], context: "books" },
      { base: "save", forms: ["save", "saved", "saved", "saving", "will save"], context: "water" },
      { base: "keep", forms: ["keep", "kept", "kept", "keeping", "will keep"], context: "promises" },
      { base: "share", forms: ["share", "shared", "shared", "sharing", "will share"], context: "toys" },
      { base: "sell", forms: ["sell", "sold", "sold", "selling", "will sell"], context: "goods" },
      { base: "rent", forms: ["rent", "rented", "rented", "renting", "will rent"], context: "houses" }
    ]
  },
  {
    levelNumber: 13,
    title: "Kitchen & Science",
    words: [
      { base: "burn", forms: ["burn", "burnt", "burnt", "burning", "will burn"], context: "wood" },
      { base: "melt", forms: ["melt", "melted", "melted", "melting", "will melt"], context: "ice" },
      { base: "freeze", forms: ["freeze", "froze", "frozen", "freezing", "will freeze"], context: "water" },
      { base: "boil", forms: ["boil", "boiled", "boiled", "boiling", "will boil"], context: "milk" },
      { base: "mix", forms: ["mix", "mixed", "mixed", "mixing", "will mix"], context: "colors" },
      { base: "shake", forms: ["shake", "shook", "shaken", "shaking", "will shake"], context: "bottles" },
      { base: "pour", forms: ["pour", "poured", "poured", "pouring", "will pour"], context: "juice" },
      { base: "fill", forms: ["fill", "filled", "filled", "filling", "will fill"], context: "glasses" },
      { base: "empty", forms: ["empty", "emptied", "emptied", "emptying", "will empty"], context: "bins" },
      { base: "peel", forms: ["peel", "peeled", "peeled", "peeling", "will peel"], context: "bananas" }
    ]
  },
  {
    levelNumber: 14,
    title: "Gardening & Nature",
    words: [
      { base: "plant", forms: ["plant", "planted", "planted", "planting", "will plant"], context: "seeds" },
      { base: "water", forms: ["water", "watered", "watered", "watering", "will water"], context: "saplings" },
      { base: "dig", forms: ["dig", "dug", "dug", "digging", "will dig"], context: "holes" },
      { base: "sow", forms: ["sow", "sowed", "sown", "sowing", "will sow"], context: "crops" },
      { base: "reap", forms: ["reap", "reaped", "reaped", "reaping", "will reap"], context: "benefits" },
      { base: "harvest", forms: ["harvest", "harvested", "harvested", "harvesting", "will harvest"], context: "wheat" },
      { base: "prune", forms: ["prune", "pruned", "pruned", "pruning", "will prune"], context: "bushes" },
      { base: "weed", forms: ["weed", "weeded", "weeded", "weeding", "will weed"], context: "plots" },
      { base: "bloom", forms: ["bloom", "bloomed", "bloomed", "blooming", "will bloom"], context: "beautifully" },
      { base: "gather", forms: ["gather", "gathered", "gathered", "gathering", "will gather"], context: "flowers" }
    ]
  },
  {
    levelNumber: 15,
    title: "Travel & Adventure",
    words: [
      { base: "travel", forms: ["travel", "travelled", "travelled", "travelling", "will travel"], context: "by train" },
      { base: "sail", forms: ["sail", "sailed", "sailed", "sailing", "will sail"], context: "boats" },
      { base: "hike", forms: ["hike", "hiked", "hiked", "hiking", "will hike"], context: "mountains" },
      { base: "camp", forms: ["camp", "camped", "camped", "camping", "will camp"], context: "in forests" },
      { base: "explore", forms: ["explore", "explored", "explored", "exploring", "will explore"], context: "caves" },
      { base: "discover", forms: ["discover", "discovered", "discovered", "discovering", "will discover"], context: "treasures" },
      { base: "journey", forms: ["journey", "journeyed", "journeyed", "journeying", "will journey"], context: "far" },
      { base: "pack", forms: ["pack", "packed", "packed", "packing", "will pack"], context: "luggage" },
      { base: "fly", forms: ["fly", "flew", "flown", "flying", "will fly"], context: "abroad" },
      { base: "leave", forms: ["leave", "left", "left", "leaving", "will leave"], context: "for airport" }
    ]
  },
  {
    levelNumber: 16,
    title: "Craft & Material",
    words: [
      { base: "knit", forms: ["knit", "knitted", "knitted", "knitting", "will knit"], context: "sweaters" },
      { base: "sew", forms: ["sew", "sewed", "sewn", "sewing", "will sew"], context: "buttons" },
      { base: "weave", forms: ["weave", "wove", "woven", "weaving", "will weave"], context: "baskets" },
      { base: "spin", forms: ["spin", "spun", "spun", "spinning", "will spin"], context: "threads" },
      { base: "dye", forms: ["dye", "dyed", "dyed", "dyeing", "will dye"], context: "fabrics" },
      { base: "fold", forms: ["fold", "folded", "folded", "folding", "will fold"], context: "paper" },
      { base: "carry", forms: ["carry", "carried", "carried", "carrying", "will carry"], context: "bags" },
      { base: "lift", forms: ["lift", "lifted", "lifted", "lifting", "will lift"], context: "weights" },
      { base: "load", forms: ["load", "loaded", "loaded", "loading", "will load"], context: "trucks" },
      { base: "unload", forms: ["unload", "unloaded", "unloaded", "unloading", "will unload"], context: "goods" }
    ]
  },
  {
    levelNumber: 17,
    title: "Animal Care & Outdoors",
    words: [
      { base: "feed", forms: ["feed", "fed", "fed", "feeding", "will feed"], context: "puppies" },
      { base: "pet", forms: ["pet", "petted", "petted", "petting", "will pet"], context: "cats" },
      { base: "train", forms: ["train", "trained", "trained", "training", "will train"], context: "dogs" },
      { base: "tame", forms: ["tame", "tamed", "tamed", "taming", "will tame"], context: "animals" },
      { base: "track", forms: ["track", "tracked", "tracked", "tracking", "will track"], context: "deer" },
      { base: "watch", forms: ["watch", "watched", "watched", "watching", "will watch"], context: "birds" },
      { base: "protect", forms: ["protect", "protected", "protected", "protecting", "will protect"], context: "nature" },
      { base: "save", forms: ["save", "saved", "saved", "saving", "will save"], context: "forests" },
      { base: "care", forms: ["care", "cared", "cared", "caring", "will care"], context: "for pets" },
      { base: "lead", forms: ["lead", "led", "led", "leading", "will lead"], context: "the herd" }
    ]
  },
  {
    levelNumber: 18,
    title: "Entry & Departures",
    words: [
      { base: "lock", forms: ["lock", "locked", "locked", "locking", "will lock"], context: "gates" },
      { base: "unlock", forms: ["unlock", "unlocked", "unlocked", "unlocking", "will unlock"], context: "drawers" },
      { base: "enter", forms: ["enter", "entered", "entered", "entering", "will enter"], context: "rooms" },
      { base: "exit", forms: ["exit", "exited", "exited", "exiting", "will exit"], context: "buildings" },
      { base: "return", forms: ["return", "returned", "returned", "returning", "will return"], context: "books" },
      { base: "stay", forms: ["stay", "stayed", "stayed", "staying", "will stay"], context: "at hotels" },
      { base: "wait", forms: ["wait", "waited", "waited", "waiting", "will wait"], context: "for buses" },
      { base: "remain", forms: ["remain", "remained", "remained", "remaining", "will remain"], context: "silent" },
      { base: "depart", forms: ["depart", "departed", "departed", "departing", "will depart"], context: "early" },
      { base: "arrive", forms: ["arrive", "arrived", "arrived", "arriving", "will arrive"], context: "on time" }
    ]
  },
  {
    levelNumber: 19,
    title: "School Exams",
    words: [
      { base: "solve", forms: ["solve", "solved", "solved", "solving", "will solve"], context: "math puzzles" },
      { base: "explain", forms: ["explain", "explained", "explained", "explaining", "will explain"], context: "answers" },
      { base: "prove", forms: ["prove", "proved", "proved", "proving", "will prove"], context: "theorems" },
      { base: "check", forms: ["check", "checked", "checked", "checking", "will check"], context: "errors" },
      { base: "correct", forms: ["correct", "corrected", "corrected", "correcting", "will correct"], context: "mistakes" },
      { base: "mark", forms: ["mark", "marked", "marked", "marking", "will mark"], context: "papers" },
      { base: "score", forms: ["score", "scored", "scored", "scoring", "will score"], context: "good grades" },
      { base: "fail", forms: ["fail", "failed", "failed", "failing", "will fail"], context: "to submit" },
      { base: "pass", forms: ["pass", "passed", "passed", "passing", "will pass"], context: "exams" },
      { base: "excel", forms: ["excel", "excelled", "excelled", "excelling", "will excel"], context: "in studies" }
    ]
  },
  {
    levelNumber: 20,
    title: "Sports & Victory",
    words: [
      { base: "aim", forms: ["aim", "aimed", "aimed", "aiming", "will aim"], context: "at targets" },
      { base: "shoot", forms: ["shoot", "shot", "shot", "shooting", "will shoot"], context: "arrows" },
      { base: "hit", forms: ["hit", "hit", "hit", "hitting", "will hit"], context: "wickets" },
      { base: "miss", forms: ["miss", "missed", "missed", "missing", "will miss"], context: "chances" },
      { base: "strike", forms: ["strike", "struck", "struck", "striking", "will strike"], context: "goals" },
      { base: "fight", forms: ["fight", "fought", "fought", "fighting", "will fight"], context: "bravely" },
      { base: "defend", forms: ["defend", "defended", "defended", "defending", "will defend"], context: "posts" },
      { base: "attack", forms: ["attack", "attacked", "attacked", "attacking", "will attack"], context: "opponents" },
      { base: "win", forms: ["win", "won", "won", "winning", "will win"], context: "trophies" },
      { base: "celebrate", forms: ["celebrate", "celebrated", "celebrated", "celebrating", "will celebrate"], context: "victories" }
    ]
  }
];
