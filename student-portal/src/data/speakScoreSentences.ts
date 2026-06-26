export interface SpeakSentence {
  id: string;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
}

export interface SpeakCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sentences: SpeakSentence[];
}

export const speakCategories: SpeakCategory[] = [
  {
    id: 'daily-conversation',
    name: 'Daily Conversation 💬',
    description: 'Practice everyday expressions and conversational English.',
    icon: '💬',
    sentences: [
      {
        id: 'dc-1',
        text: 'Good morning! How are you doing today?',
        difficulty: 'Easy',
        xpReward: 15
      },
      {
        id: 'dc-2',
        text: 'Could you please pass me the water bottle?',
        difficulty: 'Easy',
        xpReward: 15
      },
      {
        id: 'dc-3',
        text: 'I really enjoy learning English with this interactive portal.',
        difficulty: 'Easy',
        xpReward: 15
      },
      {
        id: 'dc-4',
        text: 'Let\'s meet up for a cup of tea in the evening.',
        difficulty: 'Easy',
        xpReward: 15
      },
      {
        id: 'dc-5',
        text: 'What time does the train arrive at the station?',
        difficulty: 'Easy',
        xpReward: 15
      }
    ]
  },
  {
    id: 'grammar-fluency',
    name: 'Grammar & Fluency 🧠',
    description: 'Longer sentences testing tenses, modals, and complex structures.',
    icon: '🧠',
    sentences: [
      {
        id: 'gf-1',
        text: 'If it rains tomorrow, we will have to cancel our weekend picnic.',
        difficulty: 'Medium',
        xpReward: 20
      },
      {
        id: 'gf-2',
        text: 'She has been working as a software engineer here for three years.',
        difficulty: 'Medium',
        xpReward: 20
      },
      {
        id: 'gf-3',
        text: 'I would have visited the museum if I had more free time yesterday.',
        difficulty: 'Medium',
        xpReward: 20
      },
      {
        id: 'gf-4',
        text: 'Although he was extremely tired, he finished reading the entire book.',
        difficulty: 'Medium',
        xpReward: 20
      },
      {
        id: 'gf-5',
        text: 'The chef prepared a delicious three-course meal using fresh ingredients.',
        difficulty: 'Medium',
        xpReward: 20
      }
    ]
  },
  {
    id: 'tongue-twisters',
    name: 'Tongue Twisters 🤪',
    description: 'Supercharge your pronunciation clarity with classic articulation drills.',
    icon: '🤪',
    sentences: [
      {
        id: 'tt-1',
        text: 'She sells sea shells by the sea shore.',
        difficulty: 'Medium',
        xpReward: 25
      },
      {
        id: 'tt-2',
        text: 'Peter Piper picked a peck of pickled peppers.',
        difficulty: 'Medium',
        xpReward: 25
      },
      {
        id: 'tt-3',
        text: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
        difficulty: 'Medium',
        xpReward: 25
      },
      {
        id: 'tt-4',
        text: 'Red lorry, yellow lorry, red lorry, yellow lorry.',
        difficulty: 'Medium',
        xpReward: 25
      },
      {
        id: 'tt-5',
        text: 'Betty Botter bought some butter, but she said the butter is bitter.',
        difficulty: 'Medium',
        xpReward: 25
      }
    ]
  },
  {
    id: 'inspirational',
    name: 'Inspirational Quotes 🌟',
    description: 'Deliver powerful, inspiring sentences with confidence and clarity.',
    icon: '🌟',
    sentences: [
      {
        id: 'ip-1',
        text: 'The sun rises in the east, illuminating the sky with gold and orange.',
        difficulty: 'Hard',
        xpReward: 30
      },
      {
        id: 'ip-2',
        text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
        difficulty: 'Hard',
        xpReward: 30
      },
      {
        id: 'ip-3',
        text: 'We must embrace constant change to thrive in this rapidly evolving digital landscape.',
        difficulty: 'Hard',
        xpReward: 30
      },
      {
        id: 'ip-4',
        text: 'Active listening and clear communication are essential components of effective leadership.',
        difficulty: 'Hard',
        xpReward: 30
      },
      {
        id: 'ip-5',
        text: 'A journey of a thousand miles begins with a single step.',
        difficulty: 'Hard',
        xpReward: 30
      }
    ]
  }
];
