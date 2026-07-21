import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, isFirebaseEnabled } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';

export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface UserState {
  name: string;
  grade: string;
  school: string;
  mobileNumber: string;
  onboarded: boolean;
  xp: number;
  coins: number;
  streak: number;
  theme: 'kids' | 'teen';
  themeMode: 'dark' | 'light';
  completedGames: string[];
  grammarGalaxyLevelIndex: number;
  grammarGalaxySlideIndex: number;
  phrasalVerbLevelIndex: number;
  modalLevelIndex: number;
  whatYesOrNoLevelIndex: number;
  wordRushLevelIndex: number;
  phonicsLevelIndex: number;
  modalTimeFusionLevelIndex: number;
  dailyActiveSeconds: number;
  lastActiveDate: string;
  lastStreakUpdatedDate: string;
  chessHighScore: number;
  escapeRoomHighScore: number;
  riyanStoryLevelIndex: number;
  speakScoreHighScore: number;
  idiomMatchLevelIndex: number;
  timeTransformerLevelIndex: number;
  actionWordsLevelIndex: number;
  partsOfSpeechLevelIndex: number;
  hasSeenFairnessResetV1: boolean;
  hasCompletedSurvey: boolean;
  
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  incrementStreak: () => void;
  toggleTheme: () => void;
  toggleThemeMode: () => void;
  completeGame: (gameId: string) => void;
  setGrammarGalaxyProgress: (levelIndex: number, slideIndex: number) => void;
  resetGrammarGalaxyProgress: () => void;
  setPhrasalVerbLevelIndex: (levelIndex: number) => void;
  setModalLevelIndex: (levelIndex: number) => void;
  setWhatYesOrNoLevelIndex: (levelIndex: number) => void;
  setWordRushLevelIndex: (levelIndex: number) => void;
  setPhonicsLevelIndex: (levelIndex: number) => void;
  setModalTimeFusionLevelIndex: (levelIndex: number) => void;
  setRiyanStoryLevelIndex: (levelIndex: number) => void;
  setChessHighScore: (score: number) => void;
  setEscapeRoomHighScore: (score: number) => void;
  setSpeakScoreHighScore: (score: number) => void;
  setIdiomMatchLevelIndex: (levelIndex: number) => void;
  setTimeTransformerLevelIndex: (levelIndex: number) => void;
  setActionWordsLevelIndex: (levelIndex: number) => void;
  setPartsOfSpeechLevelIndex: (levelIndex: number) => void;
  registerStudent: (details: { name: string; grade: string; school: string; mobileNumber: string }) => void;
  loginStudent: (mobileNumber: string) => Promise<boolean>;
  completeFairnessResetAndSurvey: (surveyData?: { rating: number; favoriteGame: string; feedbackText: string; fairnessAgreed: boolean }) => Promise<void>;
  tickActiveTime: (seconds: number) => void;
  checkDailyReset: () => void;
  resetAll: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => {
      // Helper to sync local Zustand updates to Firebase in the background
      const syncStoreToCloud = async (updates: Record<string, any>) => {
        const mobile = get().mobileNumber;
        if (isFirebaseEnabled && db && get().onboarded && mobile) {
          try {
            await updateDoc(doc(db, 'students', mobile), updates);
          } catch (err) {
            console.error('Failed to sync to Firebase:', err);
          }
        }
      };

      return {
        name: '',
        grade: 'Grade 7',
        school: '',
        mobileNumber: '',
        onboarded: false,
        xp: 0,
        coins: 0,
        streak: 1,
        theme: 'teen',
        themeMode: 'dark',
        completedGames: [],
        grammarGalaxyLevelIndex: 0,
        grammarGalaxySlideIndex: 0,
        phrasalVerbLevelIndex: 0,
        modalLevelIndex: 0,
        whatYesOrNoLevelIndex: 0,
        wordRushLevelIndex: 0,
        phonicsLevelIndex: 0,
        modalTimeFusionLevelIndex: 0,
        dailyActiveSeconds: 0,
        lastActiveDate: '',
        lastStreakUpdatedDate: '',
        chessHighScore: 0,
        escapeRoomHighScore: 0,
        riyanStoryLevelIndex: 0,
        speakScoreHighScore: 0,
        idiomMatchLevelIndex: 0,
        timeTransformerLevelIndex: 0,
        actionWordsLevelIndex: 0,
        partsOfSpeechLevelIndex: 0,
        hasSeenFairnessResetV1: false,
        hasCompletedSurvey: false,

        addXp: (amount) =>
          set((state) => {
            if (amount <= 0) return {}; // reject invalid/negative awards
            const nextXp = Math.max(0, state.xp + amount);
            syncStoreToCloud({ xp: nextXp });
            return { xp: nextXp };
          }),
        addCoins: (amount) =>
          set((state) => {
            if (amount <= 0) return {}; // reject invalid/negative awards
            const nextCoins = Math.max(0, state.coins + amount);
            syncStoreToCloud({ coins: nextCoins });
            return { coins: nextCoins };
          }),
        incrementStreak: () =>
          set((state) => {
            const nextStreak = state.streak + 1;
            syncStoreToCloud({ streak: nextStreak });
            return { streak: nextStreak };
          }),
        toggleTheme: () =>
          set((state) => {
            const nextTheme = state.theme === 'teen' ? 'kids' : 'teen';
            syncStoreToCloud({ theme: nextTheme });
            return { theme: nextTheme };
          }),
        toggleThemeMode: () =>
          set((state) => {
            const nextThemeMode = state.themeMode === 'dark' ? 'light' : 'dark';
            syncStoreToCloud({ themeMode: nextThemeMode });
            return { themeMode: nextThemeMode };
          }),
        completeGame: (gameId) =>
          set((state) => {
            const nextCompleted = state.completedGames.includes(gameId)
              ? state.completedGames
              : [...state.completedGames, gameId];
            syncStoreToCloud({ completedGames: nextCompleted });
            return { completedGames: nextCompleted };
          }),
        setGrammarGalaxyProgress: (levelIndex, slideIndex) =>
          set(() => {
            syncStoreToCloud({
              grammarGalaxyLevelIndex: levelIndex,
              grammarGalaxySlideIndex: slideIndex,
            });
            return {
              grammarGalaxyLevelIndex: levelIndex,
              grammarGalaxySlideIndex: slideIndex,
            };
          }),
        resetGrammarGalaxyProgress: () =>
          set(() => {
            syncStoreToCloud({
              grammarGalaxyLevelIndex: 0,
              grammarGalaxySlideIndex: 0,
            });
            return {
              grammarGalaxyLevelIndex: 0,
              grammarGalaxySlideIndex: 0,
            };
          }),
        setPhrasalVerbLevelIndex: (levelIndex) =>
          set(() => {
            syncStoreToCloud({ phrasalVerbLevelIndex: levelIndex });
            return { phrasalVerbLevelIndex: levelIndex };
          }),
        setModalLevelIndex: (levelIndex) =>
          set(() => {
            syncStoreToCloud({ modalLevelIndex: levelIndex });
            return { modalLevelIndex: levelIndex };
          }),
        setWhatYesOrNoLevelIndex: (levelIndex) =>
          set(() => {
            syncStoreToCloud({ whatYesOrNoLevelIndex: levelIndex });
            return { whatYesOrNoLevelIndex: levelIndex };
          }),
        setWordRushLevelIndex: (levelIndex) =>
          set(() => {
            syncStoreToCloud({ wordRushLevelIndex: levelIndex });
            return { wordRushLevelIndex: levelIndex };
          }),
        setPhonicsLevelIndex: (levelIndex) =>
          set(() => {
            syncStoreToCloud({ phonicsLevelIndex: levelIndex });
            return { phonicsLevelIndex: levelIndex };
          }),
        setModalTimeFusionLevelIndex: (levelIndex) =>
          set(() => {
            syncStoreToCloud({ modalTimeFusionLevelIndex: levelIndex });
            return { modalTimeFusionLevelIndex: levelIndex };
          }),
        setChessHighScore: (score) =>
          set((state) => {
            if (score > state.chessHighScore) {
              syncStoreToCloud({ chessHighScore: score });
              return { chessHighScore: score };
            }
            return {};
          }),
        setEscapeRoomHighScore: (score) =>
           set((state) => {
             if (score > (state.escapeRoomHighScore || 0)) {
               syncStoreToCloud({ escapeRoomHighScore: score });
               return { escapeRoomHighScore: score };
             }
             return {};
           }),
        setRiyanStoryLevelIndex: (levelIndex) =>
          set(() => {
            syncStoreToCloud({ riyanStoryLevelIndex: levelIndex });
            return { riyanStoryLevelIndex: levelIndex };
          }),
        setSpeakScoreHighScore: (score) =>
          set((state) => {
            if (score > (state.speakScoreHighScore || 0)) {
              syncStoreToCloud({ speakScoreHighScore: score });
              return { speakScoreHighScore: score };
            }
            return {};
          }),
        setIdiomMatchLevelIndex: (levelIndex) =>
          set(() => {
            syncStoreToCloud({ idiomMatchLevelIndex: levelIndex });
            return { idiomMatchLevelIndex: levelIndex };
          }),
        setTimeTransformerLevelIndex: (levelIndex) =>
          set(() => {
            syncStoreToCloud({ timeTransformerLevelIndex: levelIndex });
            return { timeTransformerLevelIndex: levelIndex };
          }),
        setActionWordsLevelIndex: (levelIndex) =>
          set(() => {
            syncStoreToCloud({ actionWordsLevelIndex: levelIndex });
            return { actionWordsLevelIndex: levelIndex };
          }),
        setPartsOfSpeechLevelIndex: (levelIndex) =>
          set(() => {
            syncStoreToCloud({ partsOfSpeechLevelIndex: levelIndex });
            return { partsOfSpeechLevelIndex: levelIndex };
          }),
        registerStudent: (details) => {
          const studentData = {
            name: details.name,
            grade: details.grade,
            school: details.school,
            mobileNumber: details.mobileNumber,
            onboarded: true,
            xp: 0,
            coins: 0,
            streak: 1,
            completedGames: [],
            grammarGalaxyLevelIndex: 0,
            grammarGalaxySlideIndex: 0,
            phrasalVerbLevelIndex: 0,
            modalLevelIndex: 0,
            whatYesOrNoLevelIndex: 0,
            wordRushLevelIndex: 0,
            phonicsLevelIndex: 0,
            modalTimeFusionLevelIndex: 0,
            dailyActiveSeconds: 0,
            lastActiveDate: '',
            lastStreakUpdatedDate: '',
            chessHighScore: 0,
            escapeRoomHighScore: 0,
            riyanStoryLevelIndex: 0,
            speakScoreHighScore: 0,
            idiomMatchLevelIndex: 0,
            timeTransformerLevelIndex: 0,
            actionWordsLevelIndex: 0,
            partsOfSpeechLevelIndex: 0,
            hasSeenFairnessResetV1: true,
            hasCompletedSurvey: true,
          };

          set(() => studentData);

          if (isFirebaseEnabled && db) {
            setDoc(doc(db, 'students', details.mobileNumber), studentData)
              .then(() => console.log('Successfully registered student profile in Firestore!'))
              .catch((error) => console.error('Failed to register student in Firestore:', error));
          }
        },
        loginStudent: async (mobileNumber) => {
          if (!isFirebaseEnabled || !db) {
            console.warn('Firebase is disabled. Cannot load from cloud.');
            return false;
          }
          try {
            const docRef = doc(db, 'students', mobileNumber);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              const isResetDone = data.hasSeenFairnessResetV1 ?? false;
              
              set(() => ({
                name: data.name || '',
                grade: data.grade || 'Grade 7',
                school: data.school || '',
                mobileNumber: data.mobileNumber || mobileNumber,
                onboarded: true,
                xp: isResetDone ? (data.xp ?? 0) : 0,
                coins: isResetDone ? (data.coins ?? 0) : 0,
                streak: isResetDone ? (data.streak ?? 1) : 1,
                completedGames: data.completedGames || [],
                grammarGalaxyLevelIndex: data.grammarGalaxyLevelIndex ?? 0,
                grammarGalaxySlideIndex: data.grammarGalaxySlideIndex ?? 0,
                phrasalVerbLevelIndex: data.phrasalVerbLevelIndex ?? 0,
                modalLevelIndex: data.modalLevelIndex ?? 0,
                whatYesOrNoLevelIndex: data.whatYesOrNoLevelIndex ?? 0,
                wordRushLevelIndex: data.wordRushLevelIndex ?? 0,
                phonicsLevelIndex: data.phonicsLevelIndex ?? 0,
                modalTimeFusionLevelIndex: data.modalTimeFusionLevelIndex ?? 0,
                dailyActiveSeconds: data.dailyActiveSeconds ?? 0,
                lastActiveDate: data.lastActiveDate || '',
                lastStreakUpdatedDate: data.lastStreakUpdatedDate || '',
                chessHighScore: isResetDone ? (data.chessHighScore ?? 0) : 0,
                escapeRoomHighScore: isResetDone ? (data.escapeRoomHighScore ?? 0) : 0,
                riyanStoryLevelIndex: data.riyanStoryLevelIndex ?? 0,
                speakScoreHighScore: isResetDone ? (data.speakScoreHighScore ?? 0) : 0,
                idiomMatchLevelIndex: data.idiomMatchLevelIndex ?? 0,
                timeTransformerLevelIndex: data.timeTransformerLevelIndex ?? 0,
                actionWordsLevelIndex: data.actionWordsLevelIndex ?? 0,
                partsOfSpeechLevelIndex: data.partsOfSpeechLevelIndex ?? 0,
                hasSeenFairnessResetV1: isResetDone,
                hasCompletedSurvey: data.hasCompletedSurvey ?? false,
              }));
              return true;
            }
            return false;
          } catch (error) {
            console.error('Failed to query student profile from Firestore:', error);
            return false;
          }
        },
        completeFairnessResetAndSurvey: async (surveyData) => {
          const state = get();
          const surveyPayload = surveyData ? {
            rating: surveyData.rating || 5,
            favoriteGame: surveyData.favoriteGame || 'General',
            feedbackText: surveyData.feedbackText || '',
            fairnessAgreed: surveyData.fairnessAgreed ?? true,
            submittedAt: new Date().toISOString(),
          } : null;

          const updates = {
            xp: 0,
            coins: 0,
            streak: 1,
            chessHighScore: 0,
            escapeRoomHighScore: 0,
            speakScoreHighScore: 0,
            hasSeenFairnessResetV1: true,
            hasCompletedSurvey: true,
            ...(surveyPayload ? { surveyResponse: surveyPayload } : {})
          };

          set(() => updates);

          if (isFirebaseEnabled && db && state.mobileNumber) {
            try {
              // Save directly into student document (100% permitted under Firestore rules)
              await setDoc(doc(db, 'students', state.mobileNumber), updates, { merge: true });

              // Also try separate surveys collection
              if (surveyPayload) {
                try {
                  await addDoc(collection(db, 'surveys'), {
                    studentName: state.name || 'Anonymous',
                    mobileNumber: state.mobileNumber,
                    grade: state.grade || 'Grade 7',
                    school: state.school || 'exscl-01',
                    ...surveyPayload
                  });
                } catch (surveyColErr) {
                  console.warn('Surveys collection fallback triggered:', surveyColErr);
                }
              }
            } catch (err) {
              console.error('Failed to complete reset / submit survey to Firestore:', err);
            }
          }
        },
        tickActiveTime: (seconds) =>
          set((state) => {
            const today = getTodayDateString();
            let currentActiveSeconds = state.dailyActiveSeconds;
            let currentStreak = state.streak;
            let lastStreakDate = state.lastStreakUpdatedDate;

            if (state.lastActiveDate !== today) {
              currentActiveSeconds = 0;
            }

            const newActiveSeconds = currentActiveSeconds + seconds;
            
            let xpAwarded = 0;
            if (newActiveSeconds >= 2400 && lastStreakDate !== today) {
              currentStreak = state.streak + 1;
              xpAwarded = 100; // 100 XP streak bonus
              lastStreakDate = today;
            }

            const updates = {
              dailyActiveSeconds: newActiveSeconds,
              lastActiveDate: today,
              streak: currentStreak,
              xp: state.xp + xpAwarded,
              lastStreakUpdatedDate: lastStreakDate
            };

            // Throttle database writes: Only write to Firestore every 60 seconds (1 minute),
            // or immediately when the daily lockout threshold (2400 seconds) is reached.
            if (newActiveSeconds % 60 === 0 || newActiveSeconds >= 2400) {
              syncStoreToCloud(updates);
            }

            return updates;
          }),
        checkDailyReset: () => {
          const today = getTodayDateString();
          const state = get();
          if (!state.lastActiveDate || state.lastActiveDate !== today) {
            const updates = {
              dailyActiveSeconds: 0,
              lastActiveDate: today
            };
            set(() => updates);
            syncStoreToCloud(updates);
          }
        },
        resetAll: () => {
          const mobile = get().mobileNumber;
          if (isFirebaseEnabled && db && mobile) {
            setDoc(doc(db, 'students', mobile), {
              name: '',
              grade: 'Grade 7',
              school: '',
              mobileNumber: '',
              onboarded: false,
              xp: 0,
              coins: 0,
              streak: 1,
              completedGames: [],
              grammarGalaxyLevelIndex: 0,
              grammarGalaxySlideIndex: 0,
              phrasalVerbLevelIndex: 0,
              modalLevelIndex: 0,
              whatYesOrNoLevelIndex: 0,
              wordRushLevelIndex: 0,
              phonicsLevelIndex: 0,
              modalTimeFusionLevelIndex: 0,
              dailyActiveSeconds: 0,
              lastActiveDate: '',
              lastStreakUpdatedDate: '',
              chessHighScore: 0,
              escapeRoomHighScore: 0,
              riyanStoryLevelIndex: 0,
              speakScoreHighScore: 0,
              idiomMatchLevelIndex: 0,
              timeTransformerLevelIndex: 0,
              actionWordsLevelIndex: 0,
              partsOfSpeechLevelIndex: 0,
            }).catch((err) => console.error('Cloud reset failed:', err));
          }

          set(() => ({
            name: '',
            grade: 'Grade 7',
            school: '',
            mobileNumber: '',
            onboarded: false,
            xp: 0,
            coins: 0,
            streak: 1,
            theme: 'teen',
            themeMode: 'dark',
            completedGames: [],
            grammarGalaxyLevelIndex: 0,
            grammarGalaxySlideIndex: 0,
            phrasalVerbLevelIndex: 0,
            modalLevelIndex: 0,
            whatYesOrNoLevelIndex: 0,
            wordRushLevelIndex: 0,
            phonicsLevelIndex: 0,
            modalTimeFusionLevelIndex: 0,
            dailyActiveSeconds: 0,
            lastActiveDate: '',
            chessHighScore: 0,
            escapeRoomHighScore: 0,
            riyanStoryLevelIndex: 0,
            speakScoreHighScore: 0,
            idiomMatchLevelIndex: 0,
            timeTransformerLevelIndex: 0,
            actionWordsLevelIndex: 0,
            partsOfSpeechLevelIndex: 0,
          }));
        },
        logout: () => {
          set(() => ({
            name: '',
            grade: 'Grade 7',
            school: '',
            mobileNumber: '',
            onboarded: false,
            xp: 0,
            coins: 0,
            streak: 1,
            completedGames: [],
            grammarGalaxyLevelIndex: 0,
            grammarGalaxySlideIndex: 0,
            phrasalVerbLevelIndex: 0,
            modalLevelIndex: 0,
            whatYesOrNoLevelIndex: 0,
            wordRushLevelIndex: 0,
            phonicsLevelIndex: 0,
            modalTimeFusionLevelIndex: 0,
            dailyActiveSeconds: 0,
            lastActiveDate: '',
            lastStreakUpdatedDate: '',
            chessHighScore: 0,
            escapeRoomHighScore: 0,
            riyanStoryLevelIndex: 0,
            speakScoreHighScore: 0,
            idiomMatchLevelIndex: 0,
            timeTransformerLevelIndex: 0,
            actionWordsLevelIndex: 0,
            partsOfSpeechLevelIndex: 0,
          }));
        },
      };
    },
    {
      name: 'excellence-voices-pro-user-storage',
      onRehydrateStorage: () => (state) => {
        if (state && !state.hasSeenFairnessResetV1) {
          state.xp = 0;
          state.coins = 0;
          state.chessHighScore = 0;
          state.escapeRoomHighScore = 0;
          state.speakScoreHighScore = 0;
        }
      }
    }
  )
);
