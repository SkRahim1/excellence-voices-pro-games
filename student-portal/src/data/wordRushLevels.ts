export interface WordRushQuestion {
  text: string;
  options: string[];
  answer: string;
}

export interface WordRushLevel {
  levelIndex: number;
  title: string;
  description: string;
  questions: WordRushQuestion[];
}

export const WORD_RUSH_LEVELS: WordRushLevel[] = [
  {
    levelIndex: 0,
    title: "Present Simple Habits",
    description: "Master singular vs. plural pronoun agreements (e.g., He plays vs. They play).",
    questions: [
      { text: "Every morning, my brother ______ for a run.", options: ["go", "goes", "going", "gone"], answer: "goes" },
      { text: "They ______ in a large apartment in the city center.", options: ["live", "lives", "living", "lived"], answer: "live" },
      { text: "She ______ coffee every day but prefers tea in the evening.", options: ["drink", "drinks", "drinking", "drunk"], answer: "drinks" },
      { text: "My parents ______ my grandparents every single weekend.", options: ["visit", "visits", "visiting", "visited"], answer: "visit" },
      { text: "The sun ______ in the east and sets in the west.", options: ["rise", "rises", "rising", "rose"], answer: "rises" }
    ]
  },
  {
    levelIndex: 1,
    title: "Past Simple Tense",
    description: "Practice regular -ed endings and common irregular verb conjugations in the past.",
    questions: [
      { text: "Yesterday, I ______ to my teacher about the upcoming project.", options: ["talk", "talks", "talking", "talked"], answer: "talked" },
      { text: "We ______ an exciting movie at the cinema last night.", options: ["watch", "watches", "watched", "watching"], answer: "watched" },
      { text: "He ______ a beautiful letter to his pen-friend last Sunday.", options: ["write", "writes", "wrote", "written"], answer: "wrote" },
      { text: "They ______ to Delhi by train for their vacation last month.", options: ["go", "goes", "went", "gone"], answer: "went" },
      { text: "The school bell ______ exactly ten minutes ago.", options: ["ring", "rings", "rang", "rung"], answer: "rang" }
    ]
  },
  {
    levelIndex: 2,
    title: "Plural Subject Agreement",
    description: "Align verbs correctly with complex plural subjects and compound sentences.",
    questions: [
      { text: "The children ______ playing games when the teacher entered.", options: ["was", "were", "are", "is"], answer: "were" },
      { text: "Both Rohan and Amit ______ coming to my birthday party.", options: ["is", "are", "am", "was"], answer: "are" },
      { text: "The keys to the front door ______ lost since yesterday.", options: ["has been", "have been", "is", "was"], answer: "have been" },
      { text: "Various books in the library ______ new covers.", options: ["need", "needs", "needing", "needed"], answer: "need" },
      { text: "My classmates ______ helping each other with the project.", options: ["is", "was", "are", "has"], answer: "are" }
    ]
  },
  {
    levelIndex: 3,
    title: "Collective Noun Agreements",
    description: "Master singular vs. plural verbs for collective groups (team, class, family).",
    questions: [
      { text: "The football team ______ practice every afternoon at 4 PM.", options: ["has", "have", "having", "had"], answer: "has" },
      { text: "My family ______ planning a trip to Mumbai next summer.", options: ["is", "are", "am", "were"], answer: "is" },
      { text: "The class ______ finished their exam early today.", options: ["has", "have", "having", "had"], answer: "has" },
      { text: "A group of students ______ waiting outside the principal's office.", options: ["is", "are", "am", "were"], answer: "is" },
      { text: "The jury ______ disagreed on the final verdict.", options: ["has", "have", "having", "had"], answer: "have" }
    ]
  },
  {
    levelIndex: 4,
    title: "Present Continuous Action",
    description: "Conjugate actions in progress right now with correct auxiliary verbs.",
    questions: [
      { text: "Look! The birds ______ flying high in the sky.", options: ["is", "are", "am", "was"], answer: "are" },
      { text: "I ______ studying English grammar at this moment.", options: ["is", "are", "am", "were"], answer: "am" },
      { text: "He ______ currently writing an email to his uncle.", options: ["is", "are", "am", "were"], answer: "is" },
      { text: "The baby ______ sleeping soundly in the cradle right now.", options: ["is", "are", "was", "were"], answer: "is" },
      { text: "We ______ planning a surprise party for our mother.", options: ["is", "are", "am", "was"], answer: "are" }
    ]
  },
  {
    levelIndex: 5,
    title: "Past Continuous Timeline",
    description: "Practice conjugating actions that were in progress at a specific past moment.",
    questions: [
      { text: "I ______ reading a storybook when the lights went out.", options: ["was", "were", "is", "are"], answer: "was" },
      { text: "The dogs ______ barking all through the night yesterday.", options: ["was", "were", "is", "are"], answer: "were" },
      { text: "What ______ you doing at nine o'clock last night?", options: ["was", "were", "is", "are"], answer: "were" },
      { text: "She ______ cooking dinner while her brother washed the dishes.", options: ["was", "were", "is", "are"], answer: "was" },
      { text: "The students ______ listening attentively during the lecture.", options: ["was", "were", "is", "are"], answer: "were" }
    ]
  },
  {
    levelIndex: 6,
    title: "Present Perfect Tense",
    description: "Conjugate completed past actions linked to the present using has/have.",
    questions: [
      { text: "I ______ already completed my home assignment.", options: ["has", "have", "had", "having"], answer: "have" },
      { text: "My sister ______ visited the Taj Mahal twice.", options: ["has", "have", "had", "having"], answer: "has" },
      { text: "They ______ lived in Delhi for more than ten years.", options: ["has", "have", "had", "having"], answer: "have" },
      { text: "The train ______ just departed from platform number two.", options: ["has", "have", "had", "having"], answer: "has" },
      { text: "We ______ not received the test results yet.", options: ["has", "have", "had", "having"], answer: "have" }
    ]
  },
  {
    levelIndex: 7,
    title: "Future Predictions & Plans",
    description: "Master future constructions using will and 'be going to' agreements.",
    questions: [
      { text: "Tomorrow, Rohan ______ fly to London for high studies.", options: ["will", "is going to", "goes", "went"], answer: "will" },
      { text: "I ______ visit my grandparents next weekend as planned.", options: ["am going to", "will be", "is going to", "are going to"], answer: "am going to" },
      { text: "We ______ have an English test tomorrow morning.", options: ["will", "are going to", "is going to", "have"], answer: "will" },
      { text: "They ______ build a new playground in our colony soon.", options: ["are going to", "is going to", "will be", "built"], answer: "are going to" },
      { text: "It ______ rain this evening; look at those dark clouds.", options: ["is going to", "will be", "rains", "rained"], answer: "is going to" }
    ]
  },
  {
    levelIndex: 8,
    title: "Indefinite Pronouns",
    description: "Practice singular agreements with tricky pronouns like Each, Neither, and Everyone.",
    questions: [
      { text: "Neither of the keys ______ the lock.", options: ["fit", "fits", "fitting", "are fitting"], answer: "fits" },
      { text: "Each of the students ______ received a certificate.", options: ["has", "have", "having", "had"], answer: "has" },
      { text: "Everyone in the classroom ______ listening to the speech.", options: ["was", "were", "are", "am"], answer: "was" },
      { text: "Either of the two routes ______ to the main station.", options: ["lead", "leads", "leading", "are leading"], answer: "leads" },
      { text: "Somebody ______ left their school bag on the bench.", options: ["has", "have", "had", "having"], answer: "has" }
    ]
  },
  {
    levelIndex: 9,
    title: "Mixed Auxiliary Verbs",
    description: "Practice agreements using do/does/did vs. has/have/had correctly.",
    questions: [
      { text: "______ you finish your breakfast before leaving?", options: ["Do", "Does", "Did", "Have"], answer: "Did" },
      { text: "He ______ not like to play cricket on hot afternoons.", options: ["do", "does", "did", "has"], answer: "does" },
      { text: "______ she completed her homework before going to bed?", options: ["Has", "Have", "Had", "Does"], answer: "Had" },
      { text: "We ______ not have any online classes yesterday.", options: ["do", "does", "did", "have"], answer: "did" },
      { text: "______ they bought the new textbooks yet?", options: ["Has", "Have", "Had", "Do"], answer: "Have" }
    ]
  },
  {
    levelIndex: 10,
    title: "Passive Voice Agreements",
    description: "Conjugate subjects receiving past/present actions with correct forms of 'be'.",
    questions: [
      { text: "This classroom ______ cleaned every single evening.", options: ["is", "are", "was", "were"], answer: "is" },
      { text: "The school building ______ constructed ten years ago.", options: ["is", "was", "are", "were"], answer: "was" },
      { text: "Several letters ______ posted by the postman yesterday.", options: ["is", "was", "are", "were"], answer: "were" },
      { text: "My favourite books ______ written by Shakespeare.", options: ["was", "were", "is", "has"], answer: "were" },
      { text: "Active speaking skills ______ taught in our grammar classes.", options: ["is", "are", "was", "has"], answer: "are" }
    ]
  },
  {
    levelIndex: 11,
    title: "Conditional Agreements",
    description: "Conjugate hypothetical past/present statements (If I were... I would have...).",
    questions: [
      { text: "If I ______ you, I would study harder for the final test.", options: ["am", "was", "were", "been"], answer: "were" },
      { text: "If he ______ early, he would have caught the school bus.", options: ["leave", "leaves", "had left", "has left"], answer: "had left" },
      { text: "We would have won the match if we ______ practiced more.", options: ["has", "have", "had", "would have"], answer: "had" },
      { text: "If it rains tomorrow, we ______ cancel the picnic.", options: ["will", "would", "had", "will have"], answer: "will" },
      { text: "If they had asked me, I ______ have helped them.", options: ["will", "would", "had", "have"], answer: "would" }
    ]
  }
];
