import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDk82via9x6SrhcjfR4tKvfzUk0WT2uqFw',
  authDomain: 'excellence-voices-games.firebaseapp.com',
  projectId: 'excellence-voices-games',
  storageBucket: 'excellence-voices-games.firebasestorage.app',
  messagingSenderId: '269553452016',
  appId: '1:269553452016:web:a46118570c79b64aed1335',
  measurementId: 'G-BRJNPTGJS8'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkSurveys() {
  console.log('🔍 Checking "surveys" collection...');
  try {
    const surveysSnapshot = await getDocs(collection(db, 'surveys'));
    console.log(`📊 "surveys" collection has ${surveysSnapshot.size} document(s).`);
    surveysSnapshot.forEach((doc) => {
      console.log(`Document ID ${doc.id}:`, doc.data());
    });
  } catch (err) {
    console.error('❌ Error checking surveys collection:', err);
  }

  console.log('\n🔍 Checking "students" collection for any embedded survey responses...');
  try {
    const studentsSnapshot = await getDocs(collection(db, 'students'));
    let surveyCount = 0;
    studentsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.surveyResponse || data.feedbackText || data.rating) {
        surveyCount++;
        console.log(`Student ${data.name} (${doc.id}):`, {
          rating: data.rating,
          favoriteGame: data.favoriteGame,
          feedbackText: data.feedbackText || data.surveyResponse?.feedbackText
        });
      }
    });
    console.log(`📊 Total students with feedback fields: ${surveyCount}`);
  } catch (err) {
    console.error('❌ Error checking students collection:', err);
  }
  process.exit(0);
}

checkSurveys();
