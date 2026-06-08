export interface PhrasalVerb {
  verb: string;
  meaning: string;
  studyScenario: string;
  studyExample: string; // example sentence with the phrasal verb in place
  quizScenario: string;  // context for the quiz MCQ
  quizDialogue: string;  // question text with "______" blank
  options: string[];
  answer: string;
  feedback: string;
}

export const PHRASAL_VERBS: PhrasalVerb[] = [
  // LEVEL 1
  {
    verb: "ask around",
    meaning: "ask many people the same question",
    studyScenario: "Looking for recommendations for a good local bookseller",
    studyExample: "I wanted to find a cheap copy of the textbook, so I had to ask around the class.",
    quizScenario: "Looking for a lost dog in the neighborhood",
    quizDialogue: "I lost my puppy yesterday, so I will ______ to see if anyone has seen him.",
    options: ["ask around", "back up", "call off", "run out"],
    answer: "ask around",
    feedback: "'Ask around' means to talk to different people to gather information or see if they know something."
  },
  {
    verb: "back up",
    meaning: "support, defend, or make a copy of files",
    studyScenario: "Confirming your teammate's version of a debate argument",
    studyExample: "If you explain your science experiment to the teacher, I will back up your theory.",
    quizScenario: "Reassuring a classmate before a project presentation",
    quizDialogue: "Don't worry about the presentation; if anyone doubts your stats, I will ______ your claims.",
    options: ["back up", "break down", "hand in", "look up"],
    answer: "back up",
    feedback: "'Back up' means to support, confirm, or defend someone or something."
  },
  {
    verb: "blow up",
    meaning: "explode, or get suddenly very angry",
    studyScenario: "Warning someone not to lose their temper over minor issues",
    studyExample: "It's just a small pencil box that was misplaced, so please don't blow up at your brother.",
    quizScenario: "Reacting to a sibling breaking your toy",
    quizDialogue: "I tried to stay calm, but I had to ______ when I saw my favorite game broken.",
    options: ["blow up", "bring up", "work out", "let down"],
    answer: "blow up",
    feedback: "'Blow up' is a very common informal expression for getting extremely angry suddenly."
  },
  {
    verb: "break down",
    meaning: "stop working (machinery/vehicle), or lose emotional control",
    studyScenario: "Explaining why your laptop suddenly stopped working",
    studyExample: "If you don't update your computer's software regularly, it might break down during lessons.",
    quizScenario: "Talking about why your parents were late picking you up",
    quizDialogue: "Our car began to ______ on the highway, so we had to call a mechanic.",
    options: ["break down", "show up", "clear up", "get away"],
    answer: "break down",
    feedback: "'Break down' is used when machines, engines, or cars stop functioning properly."
  },
  {
    verb: "break up",
    meaning: "end a relationship, or split into smaller parts",
    studyScenario: "Dividing a large project team into smaller pairs",
    studyExample: "The teacher decided to break up the class into pairs for the chemistry lab session.",
    quizScenario: "Talking about friends who are no longer speaking",
    quizDialogue: "I was sad to hear that Rahul and Amit decided to ______ their study group partnership.",
    options: ["break up", "ask around", "hang out", "hold on"],
    answer: "break up",
    feedback: "'Break up' means to end a relationship, partnership, or team connection."
  },

  // LEVEL 2
  {
    verb: "bring up",
    meaning: "mention a topic in conversation",
    studyScenario: "Suggesting a weekend trip idea to parents",
    studyExample: "I will bring up the idea of a beach holiday during dinner tonight.",
    quizScenario: "Discussing school schedule shifts with your class teacher",
    quizDialogue: "During the class meeting, make sure to ______ the idea of changing the sport hours.",
    options: ["bring up", "call off", "give up", "point out"],
    answer: "bring up",
    feedback: "'Bring up' means to introduce a topic or start discussing something in a conversation."
  },
  {
    verb: "call off",
    meaning: "cancel an event or plan",
    studyScenario: "Cancelling an outdoor picnic due to heavy storm warnings",
    studyExample: "They had to call off the morning assembly because of the sudden lightning storm.",
    quizScenario: "Announcing sports practice delay due to heavy downpours",
    quizDialogue: "Because it is raining heavily, the coach decided to ______ today's football practice.",
    options: ["call off", "keep on", "hand in", "take off"],
    answer: "call off",
    feedback: "'Call off' is a widely used phrasal verb meaning to cancel an event that was scheduled."
  },
  {
    verb: "calm down",
    meaning: "relax after being angry, excited, or nervous",
    studyScenario: "Reassuring a crying child who dropped their school lunch tray",
    studyExample: "Please calm down; we can easily clean up the soup and get you another hot plate.",
    quizScenario: "Helping a friend before an important oral test",
    quizDialogue: "Take a deep breath and ______ before you walk into the exam room.",
    options: ["calm down", "cheer up", "carry on", "drop off"],
    answer: "calm down",
    feedback: "'Calm down' means to relax, stop being anxious, or control emotional excitement."
  },
  {
    verb: "carry on",
    meaning: "continue doing something",
    studyScenario: "Telling someone to ignore interruptions and keep reading",
    studyExample: "Even if there is background noise, you should carry on reading your book.",
    quizScenario: "Teacher leaving the classroom for a brief minute",
    quizDialogue: "Please ______ with your writing assignment while I check the register in the office.",
    options: ["carry on", "end up", "count on", "cut off"],
    answer: "carry on",
    feedback: "'Carry on' is a polite and professional way to tell someone to continue what they are doing."
  },
  {
    verb: "catch up",
    meaning: "reach the same level, or discuss recent news with friends",
    studyScenario: "Struggling to reach the same chapter as the rest of the class",
    studyExample: "Since I missed two days of class, I must study tonight to catch up with the group.",
    quizScenario: "Meeting a childhood friend after summer vacations",
    quizDialogue: "It has been so long since we met! Let's get ice cream and ______ on everything.",
    options: ["catch up", "ask around", "get away", "show up"],
    answer: "catch up",
    feedback: "'Catch up' means to update each other on news or make up for lost time/distance."
  },

  // LEVEL 3
  {
    verb: "check in",
    meaning: "register at a hotel, airport, or school reception",
    studyScenario: "Reporting to the security desk on arrival at the campus",
    studyExample: "All visitors must check in at the front office before walking to the classrooms.",
    quizScenario: "Arriving at the science symposium venue",
    quizDialogue: "All students participating in the debate must ______ at the counter by 9:00 AM.",
    options: ["check in", "check out", "fall apart", "look up"],
    answer: "check in",
    feedback: "'Check in' means to register yourself upon arrival at an event, hotel, or flight."
  },
  {
    verb: "check out",
    meaning: "investigate, look at, or pay and leave a place",
    studyScenario: "Looking at a rare insect found in the school playground",
    studyExample: "Come check out this fascinating green beetle crawling on the rose bush!",
    quizScenario: "Telling a friend to look at a new education website",
    quizDialogue: "You should really ______ this new portal; it has amazing grammar games!",
    options: ["check out", "check in", "give in", "do over"],
    answer: "check out",
    feedback: "'Check out' means to look at or inspect something interesting or useful."
  },
  {
    verb: "cheer up",
    meaning: "make happier, or become happier",
    studyScenario: "Lifting the mood of a sad friend who lost their pen",
    studyExample: "I bought some chocolate cupcakes to cheer up my cousin after her dental appointment.",
    quizScenario: "Comforting a classmate who failed to get into the cricket team",
    quizDialogue: "Don't be sad about the selection trials; let's play video games to ______.",
    options: ["cheer up", "calm down", "hang out", "let down"],
    answer: "cheer up",
    feedback: "'Cheer up' means to make someone feel happier or to lift their spirits."
  },
  {
    verb: "clean up",
    meaning: "make clean and tidy",
    studyScenario: "Tidying your desk before the final exam starts",
    studyExample: "It is important to clean up your study desk so you can find your pencils easily.",
    quizScenario: "Cleaning the art room after a painting session",
    quizDialogue: "We must ______ the color spills on the desks before the next class arrives.",
    options: ["clean up", "set up", "figure out", "back up"],
    answer: "clean up",
    feedback: "'Clean up' means to tidy up, remove dirt, and put things in order."
  },
  {
    verb: "come across",
    meaning: "find by chance, or seem to have a certain quality",
    studyScenario: "Finding an old silver coin in the garden sand",
    studyExample: "While digging in the backyard, I managed to come across an old rusty key.",
    quizScenario: "Finding a rare book while cleaning the library shelves",
    quizDialogue: "I did not expect to ______ this old diary while arranging the library books.",
    options: ["come across", "ask around", "run out of", "get over"],
    answer: "come across",
    feedback: "'Come across' means to find or meet something or someone unexpectedly."
  },

  // LEVEL 4
  {
    verb: "count on",
    meaning: "rely on or trust someone",
    studyScenario: "Trusting your partner to complete their share of the model",
    studyExample: "You can always count on me to help you carry these heavy textbooks.",
    quizScenario: "Delegating the captaincy tasks to a reliable friend",
    quizDialogue: "I know I can ______ you to manage the line during my absence.",
    options: ["count on", "carry on", "hand in", "point out"],
    answer: "count on",
    feedback: "'Count on' means to trust or depend on someone to do something."
  },
  {
    verb: "cut back on",
    meaning: "reduce consumption of sugar, screen time, etc.",
    studyScenario: "Deciding to eat less junk food during sports season",
    studyExample: "The doctor advised me to cut back on sweet soda drinks to protect my teeth.",
    quizScenario: "A parent advising a child to spend less time on mobile screens",
    quizDialogue: "You need to ______ your screen time if you want to focus on your studies.",
    options: ["cut back on", "take off", "blow up", "put off"],
    answer: "cut back on",
    feedback: "'Cut back on' means to consume or use less of something to improve a situation."
  },
  {
    verb: "cut off",
    meaning: "interrupt someone talking, or disconnect supply",
    studyScenario: "Unintentionally stopping a speaker by asking a question too early",
    studyExample: "Please do not cut off the professor while she is describing the science experiment.",
    quizScenario: "Apologizing for interrupting a teacher mid-sentence",
    quizDialogue: "I am sorry to ______ you, sir, but there is a visitor waiting at the door.",
    options: ["cut off", "back up", "show up", "get through"],
    answer: "cut off",
    feedback: "'Cut off' means to interrupt someone while they are speaking or to disconnect them."
  },
  {
    verb: "do over",
    meaning: "do something again because it was done poorly",
    studyScenario: "Redrawing a map after spilling ink on it",
    studyExample: "Since my first sketch was messy, the art teacher asked me to do over the project.",
    quizScenario: "Teacher asking for a rewritten essay assignment",
    quizDialogue: "This page has too many spelling mistakes; you will have to ______ this paragraph.",
    options: ["do over", "look up", "give up", "calm down"],
    answer: "do over",
    feedback: "'Do over' means to repeat an action from the beginning to make it correct."
  },
  {
    verb: "drop off",
    meaning: "deliver someone/something, or fall asleep",
    studyScenario: "Leaving a parcel at the post office counter",
    studyExample: "Please drop off these library books at the reception desk on your way home.",
    quizScenario: "Parent driving their child to the science lab classes",
    quizDialogue: "I will ______ you at the school gate and pick you up at 4:00 PM.",
    options: ["drop off", "grow up", "take off", "let down"],
    answer: "drop off",
    feedback: "'Drop off' means to deliver someone or something to a specific destination."
  },

  // LEVEL 5
  {
    verb: "end up",
    meaning: "eventually reach a state or place without planning it",
    studyScenario: "Choosing the wrong train station and reaching another village",
    studyExample: "If you don't check the directions, you might end up at the wrong bus stand.",
    quizScenario: "Getting lost because you took a wrong turn on a walk",
    quizDialogue: "If we don't look at the map, we might ______ in the wrong part of the city.",
    options: ["end up", "ask around", "back up", "go ahead"],
    answer: "end up",
    feedback: "'End up' means to reach a final stage or place, often unexpectedly."
  },
  {
    verb: "fall apart",
    meaning: "break into pieces, or lose emotional control",
    studyScenario: "A fragile old model bridge collapsing under weight",
    studyExample: "If we build the school project using cheap cardboard, the structure will fall apart.",
    quizScenario: "An old paper notebook losing its binding",
    quizDialogue: "My school bag is so old that the stitches are starting to ______.",
    options: ["fall apart", "calm down", "clean up", "hand in"],
    answer: "fall apart",
    feedback: "'Fall apart' means to disintegrate or break into pieces due to being old or weak."
  },
  {
    verb: "figure out",
    meaning: "understand or find a solution to a problem",
    studyScenario: "Struggling to solve a complex coding logic",
    studyExample: "With a little practice, you can easily figure out how to solve this Rubik's cube.",
    quizScenario: "Solving a tricky math riddle in class",
    quizDialogue: "It took me nearly an hour to ______ the answer to this algebra question.",
    options: ["figure out", "catch up", "carry on", "ask around"],
    answer: "figure out",
    feedback: "'Figure out' means to solve a problem or understand a logic after thinking."
  },
  {
    verb: "find out",
    meaning: "discover facts or learn new information",
    studyScenario: "Seeking information about school trip dates",
    studyExample: "I will call the principal's office to find out the date of our winter break.",
    quizScenario: "Checking the exam results on the notice board",
    quizDialogue: "I need to go to the main office to ______ if the exam schedule has been released.",
    options: ["find out", "do over", "give in", "hold on"],
    answer: "find out",
    feedback: "'Find out' means to discover or obtain new facts about something."
  },
  {
    verb: "get along",
    meaning: "have a friendly relationship with someone",
    studyScenario: "Describing how well you play with your new puppy",
    studyExample: "My sister and I get along very well, and we rarely argue about toys.",
    quizScenario: "Introducing your new group project member",
    quizDialogue: "I am happy that all members of our science project group ______ so well.",
    options: ["get along", "get over", "give up", "hang out"],
    answer: "get along",
    feedback: "'Get along' means to have a harmonious, friendly relationship with someone."
  },

  // LEVEL 6
  {
    verb: "get away",
    meaning: "go on vacation, or escape from a place",
    studyScenario: "Fleeing from a swarm of bees in the garden",
    studyExample: "The puppy managed to get away from the yard through a small hole in the fence.",
    quizScenario: "Planning a quick family trip during school breaks",
    quizDialogue: "After the final exams, my family wants to ______ to the hills for a week.",
    options: ["get away", "bring up", "show up", "back up"],
    answer: "get away",
    feedback: "'Get away' means to go on a trip or take a vacation from daily routines."
  },
  {
    verb: "get over",
    meaning: "recover from an illness, shock, or disappointment",
    studyScenario: "Recovering from losing a spelling bee match",
    studyExample: "It took Rahul a couple of days to get over the disappointment of missing the goal.",
    quizScenario: "Talking about recovering from a fever",
    quizDialogue: "It took me almost a week to ______ the flu and return to school.",
    options: ["get over", "get along", "fall apart", "cut off"],
    answer: "get over",
    feedback: "'Get over' means to recover your health or overcome a disappointment."
  },
  {
    verb: "get through",
    meaning: "finish a difficult task, or connect by phone",
    studyScenario: "Surviving a cold winter night without a heater",
    studyExample: "I need to get through these remaining two chapters before I can go to sleep.",
    quizScenario: "Motivating yourself to study for a long exam",
    quizDialogue: "If we study together, we can easily ______ this massive history syllabus.",
    options: ["get through", "get away", "give in", "look up"],
    answer: "get through",
    feedback: "'Get through' means to survive, finish, or complete a difficult challenge."
  },
  {
    verb: "give in",
    meaning: "reluctantly yield to a demand or surrender",
    studyScenario: "Agreeing to clean your room after your mother insists multiple times",
    studyExample: "I did not want to study grammar, but I had to give in to my teacher's requests.",
    quizScenario: "Letting your sibling have the last slide on the phone",
    quizDialogue: "My little brother kept begging for the phone, so I had to ______ and hand it over.",
    options: ["give in", "take off", "clean up", "carry on"],
    answer: "give in",
    feedback: "'Give in' means to yield, surrender, or agree to something you did not want to."
  },
  {
    verb: "give up",
    meaning: "stop trying to do something",
    studyScenario: "Encouraging someone to continue learning piano keys",
    studyExample: "Even if the classical tune is difficult to play, you must not give up.",
    quizScenario: "Encouraging a teammate who wants to stop running",
    quizDialogue: "You are very close to the finish line, so don't ______ now!",
    options: ["give up", "calm down", "get along", "do over"],
    answer: "give up",
    feedback: "'Give up' means to stop making an effort, surrender, or quit trying."
  },

  // LEVEL 7
  {
    verb: "go ahead",
    meaning: "proceed or start doing something",
    studyScenario: "Beginning a science presentation after the screen turns on",
    studyExample: "Once the slides are loaded, the class can go ahead with the science presentation.",
    quizScenario: "Teacher giving permission to start speaking in class",
    quizDialogue: "You have a great topic choice, so please ______ with your speech presentation.",
    options: ["go ahead", "go on", "hand in", "look after"],
    answer: "go ahead",
    feedback: "'Go ahead' means to begin or proceed with a planned action."
  },
  {
    verb: "go on",
    meaning: "continue happening or continue speaking",
    studyScenario: "Continuing a speech after a brief mic issue",
    studyExample: "Please go on explaining your project; we are all listening carefully.",
    quizScenario: "Asking a presenter to continue their story",
    quizDialogue: "That is a fascinating story! Please ______ and tell us what happened next.",
    options: ["go on", "go ahead", "drop off", "end up"],
    answer: "go on",
    feedback: "'Go on' means to continue doing or speaking, or to keep happening."
  },
  {
    verb: "grow up",
    meaning: "become an adult",
    studyScenario: "Reflecting on childhood games as we grow",
    studyExample: "We tend to change our hobbies and interests as we grow up.",
    quizScenario: "Talking about future careers in secondary school",
    quizDialogue: "What do you want to become when you ______?",
    options: ["grow up", "calm down", "clean up", "bring up"],
    answer: "grow up",
    feedback: "'Grow up' is used when children grow and develop into mature adults."
  },
  {
    verb: "hand in",
    meaning: "submit homework, projects, or documents",
    studyScenario: "Submitting a signed permission slip to the school trip coordinator",
    studyExample: "Please hand in your library cards to the clerk before the holiday starts.",
    quizScenario: "Reminding classmates to submit their assignments",
    quizDialogue: "Don't forget to ______ your science projects before the final bell rings.",
    options: ["hand in", "look up", "carry on", "count on"],
    answer: "hand in",
    feedback: "'Hand in' means to submit or turn in a document to a teacher or authority."
  },
  {
    verb: "hang out",
    meaning: "spend time relaxing with friends",
    studyScenario: "Sitting together in the school canteen during lunch break",
    studyExample: "During the lunch recess, my classmates like to hang out near the basketball court.",
    quizScenario: "Inviting a friend to meet at the park on Saturday",
    quizDialogue: "Would you like to ______ at the park this weekend and play cricket?",
    options: ["hang out", "hold on", "let down", "make up"],
    answer: "hang out",
    feedback: "'Hang out' is a very popular casual term for spending free time with friends."
  },

  // LEVEL 8
  {
    verb: "hold on",
    meaning: "wait for a short period of time",
    studyScenario: "Asking someone to pause in a queue",
    studyExample: "Please hold on for a moment while I tie my shoelaces.",
    quizScenario: "Asking someone on the phone to wait for a moment",
    quizDialogue: "Please ______ for a minute while I locate my notebook to write this down.",
    options: ["hold on", "show up", "take off", "blow up"],
    answer: "hold on",
    feedback: "'Hold on' is a common spoken instruction asking someone to wait briefly."
  },
  {
    verb: "keep on",
    meaning: "continue doing an action",
    studyScenario: "Continuing to paint despite the bell ringing",
    studyExample: "You must keep on typing your essay if you want to submit it before the deadline.",
    quizScenario: "Praising a student for their consistent writing work",
    quizDialogue: "If you ______ practicing every day, you will become a spelling champion!",
    options: ["keep on", "hand in", "get over", "calm down"],
    answer: "keep on",
    feedback: "'Keep on' followed by a gerund (-ing verb) means to continue doing that activity."
  },
  {
    verb: "let down",
    meaning: "disappoint someone by failing to do what was expected",
    studyScenario: "Failing to turn up for a promised soccer practice match",
    studyExample: "I worked very hard because I did not want to let down my running coach.",
    quizScenario: "Apologizing for forgetting to bring a promise book",
    quizDialogue: "I am sorry I forgot your book; I promise I won't ______ you again next time.",
    options: ["let down", "look after", "cheer up", "bring up"],
    answer: "let down",
    feedback: "'Let down' means to disappoint or fail to support someone who trusted you."
  },
  {
    verb: "look after",
    meaning: "take care of someone or something",
    studyScenario: "Caring for a younger sibling while parents are out shopping",
    studyExample: "My grandparents promised to look after our garden plants while we are away.",
    quizScenario: "Agreeing to feed your neighbor's pet birds",
    quizDialogue: "I promised to ______ my neighbor's cat while they are traveling this weekend.",
    options: ["look after", "look up", "look into", "look forward to"],
    answer: "look after",
    feedback: "'Look after' means to take care of, guard, or nurture someone or a pet."
  },
  {
    verb: "look forward to",
    meaning: "anticipate something with happiness or excitement",
    studyScenario: "Excitement about the upcoming school festival",
    studyExample: "I look forward to meeting my cousins during the upcoming summer holidays.",
    quizScenario: "Discussing an upcoming school science exhibition",
    quizDialogue: "I really ______ presenting my solar system model at the school fair next week.",
    options: ["look forward to", "look after", "look up", "look into"],
    answer: "look forward to",
    feedback: "'Look forward to' means to feel excited and happy about a future event."
  },

  // LEVEL 9
  {
    verb: "look into",
    meaning: "investigate or check facts about a situation",
    studyScenario: "Checking the reason why a library computer is running slowly",
    studyExample: "The IT coordinator said he would look into the network speed issues.",
    quizScenario: "Principal promising to investigate a missing sports kit issue",
    quizDialogue: "The class teacher promised to ______ the issue of missing lab coats.",
    options: ["look into", "look up", "look after", "look forward to"],
    answer: "look into",
    feedback: "'Look into' means to investigate, explore, or check details of a complaint or problem."
  },
  {
    verb: "look up",
    meaning: "search for information in a dictionary, book, or online",
    studyScenario: "Checking the capital of a country in an atlas",
    studyExample: "I had to look up the formula for volume in my math handbook.",
    quizScenario: "Teacher advising to find meaning of a difficult word",
    quizDialogue: "If you don't know what this term means, you should ______ its definition online.",
    options: ["look up", "look after", "look into", "look forward to"],
    answer: "look up",
    feedback: "'Look up' means to search for information, spellings, or meanings in a reference guide."
  },
  {
    verb: "make up",
    meaning: "invent a story, or reconcile after an argument",
    studyScenario: "Creating a creative fictional backstory for a roleplay character",
    studyExample: "You don't need to make up a story; just tell the teacher why you were late.",
    quizScenario: "Apologizing and agreeing to be friends again after a small fight",
    quizDialogue: "We had a small argument yesterday, but we managed to ______ this morning.",
    options: ["make up", "let down", "pass out", "end up"],
    answer: "make up",
    feedback: "'Make up' means to resolve a conflict, become friends again, or invent a story/excuse."
  },
  {
    verb: "pass out",
    meaning: "faint or lose consciousness",
    studyScenario: "Fainting due to dehydration during a long hike",
    studyExample: "If you run a marathon without drinking energy fluids, you might pass out.",
    quizScenario: "Standing in the hot sun for too long during assembly",
    quizDialogue: "Drink plenty of water before standing in the sun, or you might ______.",
    options: ["pass out", "break down", "show up", "hang out"],
    answer: "pass out",
    feedback: "'Pass out' is a spoken phrasal verb meaning to faint or lose consciousness."
  },
  {
    verb: "pick up",
    meaning: "collect someone/something, or learn something quickly",
    studyScenario: "Lifting a pencil box that fell off the desk",
    studyExample: "Could you please pick up that notebook from the classroom floor?",
    quizScenario: "Arranging a ride home from school with a friend's parent",
    quizDialogue: "Can your father ______ me from the library on his way back from work?",
    options: ["pick up", "drop off", "take off", "hand in"],
    answer: "pick up",
    feedback: "'Pick up' means to collect or gather someone or something from a location."
  },

  // LEVEL 10
  {
    verb: "point out",
    meaning: "draw attention to a specific fact or detail",
    studyScenario: "Showing a grammar mistake in a printed textbook",
    studyExample: "The student raised her hand to point out a typo on the grammar worksheet.",
    quizScenario: "Correcting a calculation mistake on the blackboard",
    quizDialogue: "I had to ______ the small spelling error on the final slides of the presentation.",
    options: ["point out", "bring up", "work out", "back up"],
    answer: "point out",
    feedback: "'Point out' means to show, draw attention to, or explain a specific detail."
  },
  {
    verb: "put off",
    meaning: "postpone or delay an action/event",
    studyScenario: "Postponing a test because many students are sick",
    studyExample: "The school board decided to put off the annual sports day until next month.",
    quizScenario: "Delaying homework until the last day of the vacation",
    quizDialogue: "You should never ______ your homework until the night before school starts.",
    options: ["put off", "put up with", "turn down", "set up"],
    answer: "put off",
    feedback: "'Put off' means to delay or postpone doing something until a later time."
  },
  {
    verb: "put up with",
    meaning: "tolerate an unpleasant situation without complaining",
    studyScenario: "Dealing with a flickering light in the class",
    studyExample: "I cannot put up with this loud lawnmower noise during our silent reading hour.",
    quizScenario: "Dealing with a noisy study environment",
    quizDialogue: "It is hard to ______ the construction noise while writing my essay.",
    options: ["put up with", "put off", "look after", "carry on"],
    answer: "put up with",
    feedback: "'Put up with' means to tolerate, bear, or endure an annoying or difficult situation."
  },
  {
    verb: "run into",
    meaning: "meet someone unexpectedly by chance",
    studyScenario: "Unexpectedly bumping into an old classmate at the bookstore",
    studyExample: "I was surprised to run into my primary school coach at the swimming pool.",
    quizScenario: "Meeting your math teacher at the grocery store",
    quizDialogue: "I did not expect to ______ my class tutor while shopping at the supermarket.",
    options: ["run into", "run out of", "show up", "ask around"],
    answer: "run into",
    feedback: "'Run into' means to meet a familiar person by chance in a public place."
  },
  {
    verb: "run out of",
    meaning: "have no supply left of something",
    studyScenario: "Using up the last drop of glue during art class",
    studyExample: "We had to pause our group presentation because the laptop ran out of battery.",
    quizScenario: "Realizing there is no blank paper in the printer",
    quizDialogue: "We had to stop printing because the copy machine has ______ paper.",
    options: ["run out of", "run into", "take off", "blow up"],
    answer: "run out of",
    feedback: "'Run out of' means to use up the entire supply of something so none is left."
  },

  // LEVEL 11
  {
    verb: "set up",
    meaning: "establish, assemble, or arrange something",
    studyScenario: "Arranging chairs in rows for a class presentation",
    studyExample: "It took the school volunteers an hour to set up the science exhibit tables.",
    quizScenario: "Assembling a microscope in the science lab",
    quizDialogue: "Let's work together to ______ the telescope before the night sky gets dark.",
    options: ["set up", "show up", "put off", "back up"],
    answer: "set up",
    feedback: "'Set up' means to assemble, establish, or arrange a device, system, or meeting."
  },
  {
    verb: "show up",
    meaning: "arrive or appear at an event",
    studyScenario: "Arriving at a birthday party in a funny costume",
    studyExample: "If you don't show up on time for the school bus, it will leave without you.",
    quizScenario: "Waiting for a group member who is late for rehearsal",
    quizDialogue: "We waited for twenty minutes, but Rohan failed to ______ for the drama practice.",
    options: ["show up", "hold on", "do over", "get away"],
    answer: "show up",
    feedback: "'Show up' is a very common informal expression meaning to arrive or appear."
  },
  {
    verb: "take off",
    meaning: "remove clothing, or depart/leave quickly",
    studyScenario: "An airplane leaving the runway for a flight",
    studyExample: "The pilot announced that the plane is ready to take off in five minutes.",
    quizScenario: "Taking off shoes before entering the computer room",
    quizDialogue: "All students must ______ their shoes before entering the smart computer lab.",
    options: ["take off", "drop off", "pick up", "set up"],
    answer: "take off",
    feedback: "'Take off' means to remove an article of clothing, or for an aircraft to leave the ground."
  },
  {
    verb: "turn down",
    meaning: "reject an offer, or decrease volume/heat",
    studyScenario: "Lowering the volume of speakers during study hour",
    studyExample: "The principal asked the students to turn down the volume of the radio.",
    quizScenario: "Declining a snack because you have a stomach ache",
    quizDialogue: "I had to ______ the offer of cake because I was already full.",
    options: ["turn down", "put off", "let down", "give up"],
    answer: "turn down",
    feedback: "'Turn down' means to reject or decline an offer, invitation, or application."
  },
  {
    verb: "work out",
    meaning: "exercise, or solve a problem successfully",
    studyScenario: "Solving a complicated riddle after brainstorming",
    studyExample: "If you think logically, you can work out the solution to this riddle.",
    quizScenario: "Reassuring a group that things will be resolved",
    quizDialogue: "Don't worry about the scheduling conflict; I am sure things will ______ in the end.",
    options: ["work out", "pass out", "fall apart", "cut off"],
    answer: "work out",
    feedback: "'Work out' means to exercise, or for a situation to resolve itself successfully."
  }
];
