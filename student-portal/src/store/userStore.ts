import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  registerStudent: (details: { name: string; grade: string; school: string; mobileNumber: string }) => void;
  tickActiveTime: (seconds: number) => void;
  resetAll: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
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

      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'teen' ? 'kids' : 'teen' })),
      toggleThemeMode: () => set((state) => ({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark' })),
      completeGame: (gameId) =>
        set((state) => ({
          completedGames: state.completedGames.includes(gameId)
            ? state.completedGames
            : [...state.completedGames, gameId],
        })),
      setGrammarGalaxyProgress: (levelIndex, slideIndex) =>
        set(() => ({
          grammarGalaxyLevelIndex: levelIndex,
          grammarGalaxySlideIndex: slideIndex,
        })),
      resetGrammarGalaxyProgress: () =>
        set(() => ({
          grammarGalaxyLevelIndex: 0,
          grammarGalaxySlideIndex: 0,
        })),
      setPhrasalVerbLevelIndex: (levelIndex) =>
        set(() => ({
          phrasalVerbLevelIndex: levelIndex,
        })),
      setModalLevelIndex: (levelIndex) =>
        set(() => ({
          modalLevelIndex: levelIndex,
        })),
      setWhatYesOrNoLevelIndex: (levelIndex) =>
        set(() => ({
          whatYesOrNoLevelIndex: levelIndex,
        })),
      setWordRushLevelIndex: (levelIndex) =>
        set(() => ({
          wordRushLevelIndex: levelIndex,
        })),
      setPhonicsLevelIndex: (levelIndex) =>
        set(() => ({
          phonicsLevelIndex: levelIndex,
        })),
      setModalTimeFusionLevelIndex: (levelIndex) =>
        set(() => ({
          modalTimeFusionLevelIndex: levelIndex,
        })),
      registerStudent: (details) =>
        set(() => ({
          name: details.name,
          grade: details.grade,
          school: details.school,
          mobileNumber: details.mobileNumber,
          onboarded: true,
          xp: 100, // starting bonus
          coins: 10,
          streak: 1
        })),
      tickActiveTime: (seconds) =>
        set((state) => {
          const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
          let currentActiveSeconds = state.dailyActiveSeconds;
          let currentStreak = state.streak;
          let lastStreakDate = state.lastStreakUpdatedDate;

          // If date changed, reset active seconds
          if (state.lastActiveDate !== today) {
            currentActiveSeconds = 0;
          }

          const newActiveSeconds = currentActiveSeconds + seconds;
          
          // Check if user hit the 40 minutes (2400 seconds) milestone today
          let xpAwarded = 0;
          if (newActiveSeconds >= 2400 && lastStreakDate !== today) {
            currentStreak = state.streak + 1;
            xpAwarded = 100; // 100 XP streak bonus
            lastStreakDate = today;
          }

          return {
            dailyActiveSeconds: newActiveSeconds,
            lastActiveDate: today,
            streak: currentStreak,
            xp: state.xp + xpAwarded,
            lastStreakUpdatedDate: lastStreakDate
          };
        }),
      resetAll: () =>
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
          lastStreakUpdatedDate: '',
        })),
    }),
    {
      name: 'excellence-voices-pro-user-storage',
    }
  )
);
