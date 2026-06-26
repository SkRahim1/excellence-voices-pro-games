import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  Check, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Lock, 
  Play, 
  Flame, 
  Sparkles,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useSpeech } from '../hooks/useSpeech';
import { idiomLevels, IdiomLevel, Idiom } from '../data/idiomsData';

interface IdiomMatchProps {
  onBackToDashboard: () => void;
}

interface Question {
  type: 'meaning_from_idiom' | 'idiom_from_meaning' | 'fill_blank';
  prompt: string;
  correctAnswer: string;
  options: string[];
  idiom: Idiom;
}

export const IdiomMatch: React.FC<IdiomMatchProps> = ({ onBackToDashboard }) => {
  const { 
    xp, 
    coins, 
    streak, 
    addXp, 
    addCoins, 
    idiomMatchLevelIndex, 
    setIdiomMatchLevelIndex, 
    completeGame 
  } = useUserStore();
  const { speak: tutorSpeak, cancel: tutorCancel } = useSpeech();

  // Screen routing states: 'levels' | 'explain' | 'game' | 'complete'
  const [activeScreen, setActiveScreen] = useState<'levels' | 'explain' | 'game' | 'complete'>('levels');
  const [selectedLevel, setSelectedLevel] = useState<IdiomLevel | null>(null);

  // Study Phase States
  const [studyIndex, setStudyIndex] = useState<number>(0);

  // Play Phase States
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [optionStates, setOptionStates] = useState<{ [key: string]: 'correct' | 'incorrect' | 'neutral' }>({});

  // Completion summary rewards
  const [rewardsEarned, setRewardsEarned] = useState<{ xp: number; coins: number; isFirstCompletion: boolean }>({
    xp: 0,
    coins: 0,
    isFirstCompletion: false
  });

  // Cancel voice synthesizers on view switches
  useEffect(() => {
    tutorCancel();
  }, [activeScreen, studyIndex, currentSlide, tutorCancel]);

  // Generate 5 dynamic questions for the active level
  const startLevelGame = (level: IdiomLevel) => {
    const list = level.idioms;
    const generated: Question[] = list.map((item, idx) => {
      // Choose question type based on index
      // 0, 3: Find Meaning from Idiom
      // 1, 4: Find Idiom from Meaning
      // 2: Fill in the blank
      let type: 'meaning_from_idiom' | 'idiom_from_meaning' | 'fill_blank' = 'meaning_from_idiom';
      if (idx === 1 || idx === 4) type = 'idiom_from_meaning';
      else if (idx === 2) type = 'fill_blank';

      let prompt = '';
      let correctAnswer = '';

      // Generate incorrect choices from the level's other idioms
      const others = list.filter(x => x.id !== item.id);
      
      let options: string[] = [];

      if (type === 'meaning_from_idiom') {
        prompt = `What is the meaning of the idiom: "${item.phrase}"?`;
        correctAnswer = item.meaning;
        options = [correctAnswer, ...others.map(x => x.meaning)];
      } else if (type === 'idiom_from_meaning') {
        prompt = `Which idiom means: "${item.meaning}"?`;
        correctAnswer = item.phrase;
        options = [correctAnswer, ...others.map(x => x.phrase)];
      } else {
        // Fill the blank
        // Replace the phrase inside the example with blanks (case insensitive)
        const regex = new RegExp(item.phrase, 'gi');
        prompt = item.example.replace(regex, '_______');
        correctAnswer = item.phrase;
        options = [correctAnswer, ...others.map(x => x.phrase)];
      }

      // Shuffle options
      options = options.sort(() => Math.random() - 0.5);

      return {
        type,
        prompt,
        correctAnswer,
        options,
        idiom: item
      };
    });

    setQuestions(generated);
    setCurrentSlide(0);
    setIsAnswered(false);
    setCorrectAnswersCount(0);
    setOptionStates({});
    setActiveScreen('game');
  };

  // Synthesize text for explanation
  const handleSpeakIdiom = (idiom: Idiom) => {
    tutorCancel();
    tutorSpeak(`Idiom: ${idiom.phrase}. Meaning: ${idiom.meaning}. Example: ${idiom.example}`, 0.9);
  };

  // Choice selection handler
  const handleSelectOption = (option: string, question: Question) => {
    if (isAnswered) return;

    setIsAnswered(true);

    const isCorrect = option === question.correctAnswer;
    const newStates: typeof optionStates = {};
    
    question.options.forEach(opt => {
      if (opt === question.correctAnswer) {
        newStates[opt] = 'correct';
      } else if (opt === option) {
        newStates[opt] = 'incorrect';
      } else {
        newStates[opt] = 'neutral';
      }
    });

    setOptionStates(newStates);

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }

    // Auto voice output for correct/incorrect reinforcement
    if (isCorrect) {
      tutorSpeak("Correct!", 1.1);
    } else {
      tutorSpeak("Let's review this idiom.", 1.0);
    }

    // Move to next slide after 2.5 seconds
    setTimeout(() => {
      if (currentSlide < 4) {
        setCurrentSlide(prev => prev + 1);
        setIsAnswered(false);
        setOptionStates({});
      } else {
        // Evaluate level completion
        const finalScore = correctAnswersCount + (isCorrect ? 1 : 0);
        handleLevelCompletion(finalScore);
      }
    }, 2500);
  };

  const handleLevelCompletion = (score: number) => {
    if (!selectedLevel) return;

    let xpGain = 0;
    let coinGain = 0;
    let isFirst = false;

    // Must get at least 3/5 correct to clear
    const hasCleared = score >= 3;

    if (hasCleared) {
      // First time completing this specific level
      if (selectedLevel.levelNumber === idiomMatchLevelIndex + 1) {
        setIdiomMatchLevelIndex(selectedLevel.levelNumber);
        isFirst = true;
      }
      
      // Award rewards
      if (score === 5) {
        xpGain = 120; // Max XP
        coinGain = 4; // Bonus coin
      } else if (score === 4) {
        xpGain = 100;
        coinGain = 2;
      } else {
        xpGain = 80;
        coinGain = 1;
      }
    }

    setRewardsEarned({
      xp: xpGain,
      coins: coinGain,
      isFirstCompletion: isFirst
    });

    if (xpGain > 0) addXp(xpGain);
    if (coinGain > 0) addCoins(coinGain);

    completeGame('idiom-match');
    setActiveScreen('complete');
  };

  return (
    <div style={{
      maxWidth: '850px',
      width: '100%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      padding: '1rem 0'
    }}>
      {/* Dynamic Header */}
      <div className="glass-card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        borderRadius: '16px'
      }}>
        <button 
          onClick={
            activeScreen === 'levels' 
              ? onBackToDashboard 
              : activeScreen === 'explain'
                ? () => setActiveScreen('levels')
                : () => {
                    const confirmExit = window.confirm("Are you sure you want to quit this level? Your progress will not be saved.");
                    if (confirmExit) setActiveScreen('levels');
                  }
          }
          style={{
            background: 'var(--btn-bg-ghost)',
            border: 'none',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
          className="hover-lift"
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          {activeScreen === 'levels' ? 'Dashboard' : 'Quit Level'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
            🧩 Level: {Math.min(10, idiomMatchLevelIndex + 1)} / 10
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: '#f97316', fontWeight: 700 }}>
            <Flame style={{ width: '18px', height: '18px', fill: '#f97316' }} />
            {streak} Days
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: '#eab308', fontWeight: 800 }}>
            🪙 {coins}
          </div>
          <div style={{
            background: 'var(--accent-gradient)',
            color: 'white',
            padding: '0.3rem 0.8rem',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: 800
          }}>
            {xp} XP
          </div>
        </div>
      </div>

      {/* SCREEN 1: LEVEL SELECTOR */}
      {activeScreen === 'levels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Idiom Match 🧩
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Learn 50 common English idioms. Complete study cards first, then match them to clear levels!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            {idiomLevels.map((lvl) => {
              const isUnlocked = lvl.levelNumber <= idiomMatchLevelIndex + 1;
              const isCompleted = lvl.levelNumber <= idiomMatchLevelIndex;

              return (
                <div 
                  key={lvl.levelNumber}
                  className={`glass-card ${isUnlocked ? 'hover-lift' : ''}`}
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedLevel(lvl);
                      setStudyIndex(0);
                      setActiveScreen('explain');
                    }
                  }}
                  style={{
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    opacity: isUnlocked ? 1 : 0.5,
                    border: isCompleted ? '1px solid #10b981' : isUnlocked ? '1px solid var(--accent-cyan)' : 'var(--card-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {isCompleted && (
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      background: '#10b981',
                      color: 'white',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      borderBottomLeftRadius: '10px'
                    }}>
                      COMPLETED
                    </div>
                  )}

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                      LEVEL {lvl.levelNumber}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.15rem' }}>
                      {lvl.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      📚 5 Idioms
                    </div>
                    <div>
                      {isUnlocked ? (
                        <span style={{
                          color: isCompleted ? '#10b981' : 'var(--accent-cyan)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {isCompleted ? 'Review' : 'Start'} <ChevronRight style={{ width: '14px', height: '14px' }} />
                        </span>
                      ) : (
                        <Lock style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SCREEN 2: EXPLANATION PHASE */}
      {activeScreen === 'explain' && selectedLevel && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Level header */}
          <div className="glass-card" style={{
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                Level {selectedLevel.levelNumber}: {selectedLevel.title}
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                Study Phase 📖
              </h3>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '0.25rem'
            }}>
              {selectedLevel.idioms.map((_, idx) => (
                <div 
                  key={idx}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: idx === studyIndex ? 'var(--accent-cyan)' : idx < studyIndex ? '#10b981' : 'var(--progress-bg)',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Idiom Definition card */}
          <div className="glass-card animate-pulse-slow" style={{
            padding: '3rem 2rem',
            borderRadius: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center',
            minHeight: '320px',
            justifyContent: 'center',
            border: '2px solid rgba(6, 182, 212, 0.15)'
          }}>
            <div style={{
              background: 'rgba(6, 182, 212, 0.1)',
              padding: '0.3rem 0.8rem',
              borderRadius: '50px',
              color: 'var(--accent-cyan)',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <BookOpen style={{ width: '12px', height: '12px' }} />
              IDIOM STUDY {studyIndex + 1} OF 5
            </div>

            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em'
              }}>
                "{selectedLevel.idioms[studyIndex].phrase}"
              </h1>
            </div>

            <div style={{ maxWidth: '600px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                MEANING
              </span>
              <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {selectedLevel.idioms[studyIndex].meaning}
              </p>
            </div>

            <div style={{
              background: 'var(--btn-bg-ghost)',
              padding: '1rem 1.5rem',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              border: '1px solid var(--border-divider)'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem', textAlign: 'left' }}>
                EXAMPLE SENTENCE
              </span>
              <p style={{ fontSize: '0.95rem', fontStyle: 'italic', textAlign: 'left', color: 'var(--text-main)' }}>
                "{selectedLevel.idioms[studyIndex].example}"
              </p>
            </div>

            {/* Audio Synthesis */}
            <button
              onClick={() => handleSpeakIdiom(selectedLevel.idioms[studyIndex])}
              style={{
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid var(--accent-cyan)',
                color: 'var(--accent-cyan)',
                padding: '0.6rem 1.2rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
                marginTop: '0.5rem'
              }}
              className="hover-lift"
            >
              <Volume2 style={{ width: '16px', height: '16px' }} />
              Listen & Practice 🔊
            </button>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setStudyIndex(prev => Math.max(0, prev - 1))}
              disabled={studyIndex === 0}
              style={{
                flex: 1,
                background: 'var(--btn-bg-ghost)',
                border: '1px solid var(--border-divider)',
                color: 'var(--text-main)',
                padding: '0.85rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: studyIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                opacity: studyIndex === 0 ? 0.4 : 1,
                transition: 'all 0.2s'
              }}
            >
              <ChevronLeft style={{ width: '20px', height: '20px' }} />
              Previous
            </button>

            {studyIndex < 4 ? (
              <button
                onClick={() => setStudyIndex(prev => prev + 1)}
                style={{
                  flex: 1,
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  color: 'white',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px var(--accent-glow)',
                  transition: 'all 0.2s'
                }}
                className="hover-lift"
              >
                Next Idiom
                <ChevronRight style={{ width: '20px', height: '20px' }} />
              </button>
            ) : (
              <button
                onClick={() => startLevelGame(selectedLevel)}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                  transition: 'all 0.2s'
                }}
                className="hover-lift"
              >
                Start Quiz! 🎮
                <Play style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* SCREEN 3: PLAY PHASE (GAME) */}
      {activeScreen === 'game' && questions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quiz Header */}
          <div className="glass-card" style={{
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                MATCHING QUIZ
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                Question {currentSlide + 1} of 5
              </h3>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Score: {correctAnswersCount} / 5
              </span>
              <div style={{
                width: '120px',
                height: '6px',
                background: 'var(--progress-bg)',
                borderRadius: '3px',
                marginTop: '0.3rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${((currentSlide + 1) / 5) * 100}%`,
                  height: '100%',
                  background: 'var(--accent-gradient)'
                }} />
              </div>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="glass-card" style={{
            padding: '2rem 1.5rem',
            borderRadius: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            minHeight: '130px',
            justifyContent: 'center',
            border: '1px solid var(--border-divider)'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              <HelpCircle style={{ width: '14px', height: '14px' }} />
              {questions[currentSlide].type === 'meaning_from_idiom' && 'Identify the correct meaning:'}
              {questions[currentSlide].type === 'idiom_from_meaning' && 'Identify the correct idiom:'}
              {questions[currentSlide].type === 'fill_blank' && 'Complete the sentence with the correct idiom:'}
            </span>

            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              lineHeight: 1.35,
              color: 'var(--text-main)',
              maxWidth: '650px',
              margin: '0 auto'
            }}>
              {questions[currentSlide].prompt}
            </h2>
          </div>

          {/* Options Grid */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            {questions[currentSlide].options.map((opt, idx) => {
              const state = optionStates[opt] || 'neutral';
              
              let btnBg = 'var(--card-bg)';
              let btnBorder = 'var(--card-border)';
              let btnColor = 'var(--text-main)';
              let icon = null;

              if (isAnswered) {
                if (state === 'correct') {
                  btnBg = 'rgba(16, 185, 129, 0.15)';
                  btnBorder = '2px solid #10b981';
                  btnColor = '#10b981';
                  icon = <Check style={{ width: '18px', height: '18px', strokeWidth: 3 }} />;
                } else if (state === 'incorrect') {
                  btnBg = 'rgba(239, 68, 68, 0.15)';
                  btnBorder = '2px solid #ef4444';
                  btnColor = '#ef4444';
                  icon = <X style={{ width: '18px', height: '18px', strokeWidth: 3 }} />;
                } else {
                  btnBg = 'rgba(255, 255, 255, 0.01)';
                  btnColor = 'rgba(255, 255, 255, 0.2)';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt, questions[currentSlide])}
                  disabled={isAnswered}
                  style={{
                    width: '100%',
                    background: btnBg,
                    border: btnBorder,
                    color: btnColor,
                    padding: '1.15rem 1.5rem',
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: isAnswered ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--card-glow)',
                    transition: 'all 0.2s'
                  }}
                  className={!isAnswered ? 'hover-lift' : ''}
                >
                  <span>{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SCREEN 4: LEVEL COMPLETION VIEW */}
      {activeScreen === 'complete' && selectedLevel && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{
            padding: '3rem 2rem',
            borderRadius: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            border: `2px solid ${correctAnswersCount >= 3 ? '#10b981' : '#ef4444'}22`
          }}>
            {/* Visual Header Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: correctAnswersCount >= 3 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: correctAnswersCount >= 3 ? '#10b981' : '#ef4444',
              fontSize: '2.5rem'
            }}>
              {correctAnswersCount >= 3 ? '🏆' : '💪'}
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: correctAnswersCount >= 3 ? '#10b981' : '#ef4444' }}>
                {correctAnswersCount === 5 && 'Perfect Score! 🌟'}
                {correctAnswersCount === 4 && 'Excellent Clearance! 🎉'}
                {correctAnswersCount === 3 && 'Level Cleared! 👍'}
                {correctAnswersCount < 3 && 'Level Failed!'}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {correctAnswersCount >= 3 
                  ? `You got ${correctAnswersCount} out of 5 matches correct!` 
                  : `You only got ${correctAnswersCount} matches correct. Study and try again to unlock the next level!`
                }
              </p>
            </div>

            {/* Reward Display Widget */}
            {correctAnswersCount >= 3 && rewardsEarned.xp > 0 && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                background: 'var(--btn-bg-ghost)',
                padding: '0.5rem 1.5rem',
                borderRadius: '50px',
                alignItems: 'center',
                marginTop: '0.5rem',
                border: '1px solid var(--border-divider)'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  🪙 +{rewardsEarned.coins} Coins
                </span>
                <span style={{ width: '1px', height: '12px', background: 'var(--border-divider)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  ⭐ +{rewardsEarned.xp} XP
                </span>
                {rewardsEarned.isFirstCompletion && (
                  <>
                    <span style={{ width: '1px', height: '12px', background: 'var(--border-divider)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Sparkles style={{ width: '14px', height: '14px' }} />
                      LEVEL COMPLETED!
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Quick Action buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              width: '100%',
              maxWidth: '450px',
              marginTop: '1.25rem'
            }}>
              <button
                onClick={() => {
                  setStudyIndex(0);
                  setActiveScreen('explain');
                }}
                style={{
                  flex: 1,
                  background: 'var(--btn-bg-ghost)',
                  border: '1px solid var(--border-divider)',
                  color: 'var(--text-main)',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="hover-lift"
              >
                Replay Level
              </button>

              {correctAnswersCount >= 3 && selectedLevel.levelNumber < 10 ? (
                <button
                  onClick={() => {
                    const next = idiomLevels.find(l => l.levelNumber === selectedLevel.levelNumber + 1);
                    if (next) {
                      setSelectedLevel(next);
                      setStudyIndex(0);
                      setActiveScreen('explain');
                    }
                  }}
                  style={{
                    flex: 1,
                    background: 'var(--accent-gradient)',
                    border: 'none',
                    color: 'white',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    boxShadow: '0 4px 12px var(--accent-glow)',
                    transition: 'all 0.2s'
                  }}
                  className="hover-lift"
                >
                  Next Level
                  <ChevronRight style={{ width: '18px', height: '18px' }} />
                </button>
              ) : (
                <button
                  onClick={() => setActiveScreen('levels')}
                  style={{
                    flex: 1,
                    background: 'var(--accent-gradient)',
                    border: 'none',
                    color: 'white',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px var(--accent-glow)',
                    transition: 'all 0.2s'
                  }}
                  className="hover-lift"
                >
                  All Levels
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
