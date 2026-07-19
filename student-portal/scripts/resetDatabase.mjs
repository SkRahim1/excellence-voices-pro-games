import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDk82via9x6SrhcjfR4tKvfzUk0WT2uqFw',
  authDomain: 'excellence-voices-games.firebaseapp.com',
  projectId: 'excellence-voices-games',
  storageBucket: 'excellence-voices-games.firebasestorage.app',
  messagingSenderId: '269553452016',
  appId: '1:269553452016:web:a46118570c79b64aed1335',
  measurementId: 'G-BRJNPTGJS8'
};

console.log('🚀 Connecting to Firebase Firestore...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetAllStudentsDatabase() {
  console.log('🔍 Fetching all student records from "students" collection...');
  const studentsCol = collection(db, 'students');
  const snapshot = await getDocs(studentsCol);

  if (snapshot.empty) {
    console.log('⚠️ No student records found in Firestore database.');
    process.exit(0);
  }

  console.log(`📋 Found ${snapshot.size} student record(s). Starting batch reset to 0...`);

  const batch = writeBatch(db);
  let count = 0;

  snapshot.forEach((docSnap) => {
    const studentData = docSnap.data();
    console.log(` Resetting student: ${studentData.name || docSnap.id} (${docSnap.id})...`);
    
    batch.update(docSnap.ref, {
      xp: 0,
      coins: 0,
      streak: 1,
      completedGames: [],
      chessHighScore: 0,
      escapeRoomHighScore: 0,
      speakScoreHighScore: 0,
      grammarGalaxyLevelIndex: 0,
      grammarGalaxySlideIndex: 0,
      phrasalVerbLevelIndex: 0,
      modalLevelIndex: 0,
      whatYesOrNoLevelIndex: 0,
      wordRushLevelIndex: 0,
      phonicsLevelIndex: 0,
      modalTimeFusionLevelIndex: 0,
      riyanStoryLevelIndex: 0,
      idiomMatchLevelIndex: 0,
      timeTransformerLevelIndex: 0,
      actionWordsLevelIndex: 0,
      partsOfSpeechLevelIndex: 0,
      hasSeenFairnessResetV1: false,
      hasCompletedSurvey: false
    });

    count++;
  });

  await batch.commit();
  console.log(`\n SUCCESS! ${count} student records in Firestore database have been reset to 0 XP, 0 Coins, 0 Completed Games, and 0 High Scores!`);
  process.exit(0);
}

resetAllStudentsDatabase().catch((err) => {
  console.error('❌ Error executing database reset query:', err);
  process.exit(1);
});
