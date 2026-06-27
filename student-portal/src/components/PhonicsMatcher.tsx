import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { ArrowLeft, Volume2, CheckCircle, XCircle, Lock, Play } from 'lucide-react';
import { PHONICS_MATCHER_LEVELS } from '../data/phonicsMatcherLevels';

interface PhonicsMatcherProps {
  onBackToDashboard: () => void;
}

export const PhonicsMatcher: React.FC<PhonicsMatcherProps> = ({ onBackToDashboard }) => {
  const { addXp, addCoins, completeGame, phonicsLevelIndex, setPhonicsLevelIndex } = useUserStore();
  
  // Navigation State (null means showing Level Map Selector)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Game gameplay states (per level)
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);

  const levelData = selectedLevel !== null ? PHONICS_MATCHER_LEVELS[selectedLevel] : null;
  const round = levelData ? levelData.rounds[currentIdx] : null;

  // Reset gameplay session when active level changes
  useEffect(() => {
    if (selectedLevel !== null) {
      setCurrentIdx(0);
      setSelectedOpt(null);
      setChecked(false);
      setLevelCleared(false);
    }
  }, [selectedLevel]);

  // Scroll to top when switching between level map and active gameplay
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedLevel]);

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8; // Speak slightly slower for phonics clarity
      utterance.lang = 'en-IN';
      
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => 
        v.lang === 'en-IN' || 
        v.lang === 'en_IN' || 
        v.name.toLowerCase().includes('india')
      );
      if (indianVoice) {
        utterance.voice = indianVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak the word automatically on round mount
  useEffect(() => {
    if (selectedLevel !== null && !levelCleared && round) {
      speakWord(round.textToSpeak);
    }
  }, [currentIdx, selectedLevel, levelCleared]);

  const handleLevelSelect = (levelIdx: number) => {
    if (levelIdx > phonicsLevelIndex) return; // Locked
    setSelectedLevel(levelIdx);
  };

  const handleOptionSelect = (option: string) => {
    if (checked || !round) return;
    setSelectedOpt(option);
    setChecked(true);

    if (option === round.answer) {
      addXp(15);
      addCoins(1);
    }
  };

  const handleNext = () => {
    if (currentIdx < 4) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setChecked(false);
    } else {
      // Completed level!
      setLevelCleared(true);

      // Save progress — only on FIRST-TIME completion
      const nextLevel = (selectedLevel ?? 0) + 1;
      if (selectedLevel === phonicsLevelIndex) {
        // Award completion rewards only on first-time completion
        addXp(50);
        addCoins(5);
        setPhonicsLevelIndex(nextLevel);
        if (nextLevel >= PHONICS_MATCHER_LEVELS.length) {
          completeGame('phonics-matcher');
        }
      }
      // Replaying a cleared level: no XP/coin reward
    }
  };

  const advanceNextLevel = () => {
    if (selectedLevel !== null && selectedLevel < PHONICS_MATCHER_LEVELS.length - 1) {
      setSelectedLevel(selectedLevel + 1);
    } else {
      setSelectedLevel(null); // Back to map
    }
  };

  return (
    <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto' }}>
      
      {/* 1. LEVEL MAP SELECTOR */}
      {selectedLevel === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={onBackToDashboard}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
              Back to Hub
            </button>
            <div style={{ fontSize: '1rem', color: '#f59e0b', fontWeight: 800 }}>
              MAP: 12 PHONICS LEVELS 🔊
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Phonics Matcher</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
              Listen to spoken words and match them with their correct spelling. Perfect spelling-sound calibration across 12 levels.
            </p>
          </div>

          {/* Grid Map */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {PHONICS_MATCHER_LEVELS.map((levelData, idx) => {
              const isCompleted = idx < phonicsLevelIndex;
              const isActive = idx === phonicsLevelIndex;
              const isLocked = idx > phonicsLevelIndex;

              let cardBg = 'rgba(255, 255, 255, 0.03)';
              let borderStyle = 'var(--card-border)';
              let titleColor = 'var(--text-main)';

              if (isActive) {
                cardBg = 'rgba(245, 158, 11, 0.08)'; // Amber/Orange glow
                borderStyle = '2px solid #f59e0b';
                titleColor = '#f59e0b';
              } else if (isCompleted) {
                cardBg = 'rgba(16, 185, 129, 0.04)';
                borderStyle = '1px solid rgba(16, 185, 129, 0.2)';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleLevelSelect(idx)}
                  className={`glass-card ${isLocked ? '' : 'hover-lift'}`}
                  style={{
                    background: cardBg,
                    border: borderStyle,
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-card)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    opacity: isLocked ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: titleColor }}>
                        Level {idx + 1}
                      </span>
                      {isCompleted && <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981' }} />}
                      {isActive && <Play style={{ width: '18px', height: '18px', color: '#f59e0b', fill: 'currentColor' }} />}
                      {isLocked && <Lock style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />}
                    </div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>
                      {levelData.title}
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      {levelData.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-divider)', paddingTop: '0.75rem', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>5 Rounds</span>
                    <span style={{ color: isCompleted ? '#10b981' : isActive ? '#f59e0b' : 'var(--text-muted)', fontWeight: 800 }}>
                      {isCompleted ? 'CLEARED' : isActive ? 'PLAY NOW' : 'LOCKED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        
        /* 2. GAMEPLAY SCREEN OR SUMMARY */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <button 
              onClick={() => setSelectedLevel(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
              Exit Level
            </button>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Level {selectedLevel + 1} - Round {currentIdx + 1}/5
            </div>
          </div>

          {!levelCleared ? (
            round && (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                
                <div style={{ width: '100%', textAlign: 'left' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Phonics Matcher 🔊</h2>
                  <p style={{ marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                    {round.questionText}
                  </p>
                </div>

                {/* Large Speak Button */}
                <button
                  onClick={() => speakWord(round.textToSpeak)}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px var(--accent-glow)',
                    transition: 'transform 0.2s'
                  }}
                  className="hover-lift"
                >
                  <Volume2 style={{ width: '36px', height: '36px' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Listen</span>
                </button>

                {/* Options Grid */}
                <div className="options-grid">
                  {round.options.map((option, idx) => {
                    const isSelected = selectedOpt === option;
                    const isCorrect = option === round.answer;
                    
                    let borderStyle = 'var(--card-border)';
                    let bgStyle = 'var(--level-card-bg)';
                    let colorStyle = 'var(--text-main)';

                    if (checked) {
                      if (isCorrect) {
                        borderStyle = '2px solid #10b981';
                        bgStyle = 'rgba(16, 185, 129, 0.1)';
                        colorStyle = '#10b981';
                      } else if (isSelected) {
                        borderStyle = '2px solid #ef4444';
                        bgStyle = 'rgba(239, 68, 68, 0.1)';
                        colorStyle = '#ef4444';
                      } else {
                        bgStyle = 'rgba(255,255,255,0.01)';
                        colorStyle = 'var(--text-muted)';
                        borderStyle = '1px solid rgba(255,255,255,0.03)';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(option)}
                        disabled={checked}
                        style={{
                          border: borderStyle,
                          background: bgStyle,
                          color: colorStyle,
                          padding: '1.25rem',
                          borderRadius: 'var(--radius-card)',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          cursor: checked ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          boxShadow: isSelected && isCorrect ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none'
                        }}
                        className={!checked ? "hover-lift" : ""}
                      >
                        {checked && isCorrect && <CheckCircle style={{ width: '18px', height: '18px' }} />}
                        {checked && isSelected && !isCorrect && <XCircle style={{ width: '18px', height: '18px' }} />}
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Action/Next triggers */}
                {checked && (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      color: selectedOpt === round.answer ? '#10b981' : '#ef4444',
                      fontWeight: 700
                    }}>
                      {selectedOpt === round.answer 
                        ? "Great listening! +15 XP earned." 
                        : "Oops! The correct spelling is: " + round.answer
                      }
                    </div>
                    <button
                      onClick={handleNext}
                      style={{
                        background: 'var(--accent-gradient)',
                        border: 'none',
                        color: 'white',
                        padding: '0.85rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-btn)',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px var(--accent-glow)'
                      }}
                    >
                      {currentIdx < 4 ? 'Next Sound ➡️' : 'Complete Level'}
                    </button>
                  </div>
                )}

              </div>
            )
          ) : (
            
            /* LEVEL CLEARED OVERLAY SCREEN */
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                color: 'white',
                boxShadow: '0 0 20px var(--accent-glow)',
                marginBottom: '1rem'
              }}>
                🔊
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Level {selectedLevel + 1} Cleared!</h2>
              
              <div style={{
                display: 'flex',
                gap: '2rem',
                margin: '1rem 0',
                padding: '1rem 2rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: 'var(--card-border)'
              }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>+50 XP</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bonus XP</div>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>+5</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bonus Coins</div>
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px' }}>
                Excellent listening skills! Sound-spelling calibration helps you master English accent variations and homophone distinction. Unlocking the next level...
              </p>

              <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '350px' }}>
                <button 
                  onClick={() => setSelectedLevel(null)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: 'var(--card-border)',
                    color: 'var(--text-main)',
                    padding: '0.85rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-btn)',
                    cursor: 'pointer'
                  }}
                >
                  Exit to Map
                </button>
                <button 
                  onClick={advanceNextLevel}
                  style={{
                    flex: 1.5,
                    background: 'var(--accent-gradient)',
                    border: 'none',
                    color: 'white',
                    padding: '0.85rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-btn)',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px var(--accent-glow)'
                  }}
                >
                  Next Level ➡️
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
