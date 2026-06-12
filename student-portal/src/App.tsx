import { useState, useEffect } from 'react';
import { useUserStore, getTodayDateString } from './store/userStore';
import { Dashboard } from './components/Dashboard';
import { GrammarGalaxy } from './components/GrammarGalaxy';
import { WordRush } from './components/WordRush';
import { PhonicsMatcher } from './components/PhonicsMatcher';
import { PhrasalVerbExplorer } from './components/PhrasalVerbExplorer';
import { ModalMind } from './components/ModalMind';
import { WhatYesOrNo } from './components/WhatYesOrNo';
import { ModalTimeFusion } from './components/ModalTimeFusion';
import { EnglishChess } from './components/EnglishChess';
import { OnboardingForm } from './components/OnboardingForm';
import { Certificate } from './components/Certificate';
import { LockoutScreen } from './components/LockoutScreen';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { useSpeech } from './hooks/useSpeech';

function App() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, themeMode, onboarded, name, grade, school, completedGames, dailyActiveSeconds, lastActiveDate, tickActiveTime, checkDailyReset } = useUserStore();
  const { cancel } = useSpeech();

  // Sync theme class with HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'kids') {
      root.classList.add('kids-theme');
    } else {
      root.classList.remove('kids-theme');
    }
  }, [theme]);

  // Sync light/dark mode class with HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'light') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
  }, [themeMode]);

  // Tick active time every second
  useEffect(() => {
    if (!onboarded || dailyActiveSeconds >= 2400) return;

    const interval = setInterval(() => {
      tickActiveTime(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [onboarded, dailyActiveSeconds, tickActiveTime]);

  // Cancel speech on navigating between screens/games
  useEffect(() => {
    cancel();
  }, [selectedGame, onboarded, cancel]);

  // Scroll to top on navigation/onboarding transitions
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedGame, onboarded]);

  // Cancel speech instantly if the daily lock engages
  useEffect(() => {
    if (dailyActiveSeconds >= 2400) {
      cancel();
    }
  }, [dailyActiveSeconds, cancel]);

  // Check and reset daily screen-time limit if the calendar day has changed
  useEffect(() => {
    if (onboarded) {
      checkDailyReset();
    }
  }, [onboarded, checkDailyReset]);

  // Unique certificate identifier based on the student's name
  const verificationHash = (name || 'Karan').toUpperCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 100);
  const certId = `EV-GG-EASY-${verificationHash}`;

  // Check if the calendar day has changed (synchronous reset override)
  const today = getTodayDateString();
  const isNewDay = lastActiveDate && lastActiveDate !== today;

  // If daily practice limit of 40 minutes (2400 seconds) is reached, lock the portal
  if (onboarded && dailyActiveSeconds >= 2400 && !isNewDay) {
    return <LockoutScreen />;
  }

  return (
    <main className="main-container">
      
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}

      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)} 
          onOpenHelp={() => setShowHelp(true)} 
        />
      )}

      {!onboarded ? (
        <OnboardingForm />
      ) : (
        <>
          {!selectedGame && (
            <Dashboard onSelectGame={setSelectedGame} onOpenSettings={() => setShowSettings(true)} />
          )}

          {selectedGame === 'grammar-galaxy' && (
            <GrammarGalaxy onBackToDashboard={() => setSelectedGame(null)} />
          )}

          {selectedGame === 'word-rush' && (
            <WordRush onBackToDashboard={() => setSelectedGame(null)} />
          )}

          {selectedGame === 'phonics-matcher' && (
            <PhonicsMatcher onBackToDashboard={() => setSelectedGame(null)} />
          )}

          {selectedGame === 'phrasal-verbs' && (
            <PhrasalVerbExplorer onBackToDashboard={() => setSelectedGame(null)} />
          )}

          {selectedGame === 'modal-mind' && (
            <ModalMind onBackToDashboard={() => setSelectedGame(null)} />
          )}

          {selectedGame === 'what-yes-or-no' && (
            <WhatYesOrNo onBackToDashboard={() => setSelectedGame(null)} />
          )}

          {selectedGame === 'modal-time-fusion' && (
            <ModalTimeFusion onBackToDashboard={() => setSelectedGame(null)} />
          )}

          {selectedGame === 'english-chess' && (
            <EnglishChess onBackToDashboard={() => setSelectedGame(null)} />
          )}

          {selectedGame === 'view-certificate' && (
            <Certificate
              name={name}
              grade={grade}
              school={school}
              certId={certId}
              isPreview={!completedGames.includes('grammar-galaxy')}
              onReplay={() => setSelectedGame('grammar-galaxy')}
              onBackToDashboard={() => setSelectedGame(null)}
            />
          )}
        </>
      )}
    </main>
  );
}

export default App;

