import React, { useState, useEffect, useRef } from 'react';
import { useUserStore } from '../store/userStore';
import { ArrowLeft, Timer, Zap, CheckCircle, XCircle, Lock, Play } from 'lucide-react';
import { WORD_RUSH_LEVELS } from '../data/wordRushLevels';

interface WordRushProps {
  onBackToDashboard: () => void;
}

export const WordRush: React.FC<WordRushProps> = ({ onBackToDashboard }) => {
  const { addXp, addCoins, completeGame, wordRushLevelIndex, setWordRushLevelIndex } = useUserStore();
  
  // Navigation State (null means showing Level Map Selector)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Game gameplay states (per level)
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [combo, setCombo] = useState(0);
  const [checked, setChecked] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);

  const timerRef = useRef<any>(null);

  const levelData = selectedLevel !== null ? WORD_RUSH_LEVELS[selectedLevel] : null;
  const question = levelData ? levelData.questions[currentIdx] : null;

  // Reset gameplay session when active level changes
  useEffect(() => {
    if (selectedLevel !== null) {
      setCurrentIdx(0);
      setSelectedOpt(null);
      setTimeLeft(10);
      setCombo(0);
      setChecked(false);
      setLevelCleared(false);
    }
  }, [selectedLevel]);

  // Tick countdown timer
  useEffect(() => {
    if (selectedLevel === null || levelCleared || checked) return;

    if (timeLeft === 0) {
      handleTimeout();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, checked, levelCleared, selectedLevel]);

  const handleTimeout = () => {
    setSelectedOpt(null);
    setChecked(true);
    setCombo(0);
  };

  const handleLevelSelect = (levelIdx: number) => {
    if (levelIdx > wordRushLevelIndex) return; // Locked
    setSelectedLevel(levelIdx);
  };

  const handleOptionSelect = (option: string) => {
    if (checked || !question) return;
    setSelectedOpt(option);
    setChecked(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    const isCorrect = option === question.answer;
    if (isCorrect) {
      const multiplier = combo >= 3 ? 2 : combo >= 1 ? 1.5 : 1;
      const basePoints = 15;
      const pointsEarned = Math.round(basePoints * multiplier);
      
      setCombo(prev => prev + 1);
      addXp(pointsEarned);
      addCoins(1);
    } else {
      setCombo(0);
    }
  };

  const handleNext = () => {
    if (currentIdx < 4) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setChecked(false);
      setTimeLeft(10);
    } else {
      // Completed level!
      setLevelCleared(true);
      addXp(50); // Completion rewards
      addCoins(5);

      // Save progress to Zustand store
      const nextLevel = (selectedLevel ?? 0) + 1;
      if (selectedLevel === wordRushLevelIndex) {
        setWordRushLevelIndex(nextLevel);
        if (nextLevel >= WORD_RUSH_LEVELS.length) {
          completeGame('word-rush');
        }
      }
    }
  };

  const advanceNextLevel = () => {
    if (selectedLevel !== null && selectedLevel < WORD_RUSH_LEVELS.length - 1) {
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
            <div style={{ fontSize: '1rem', color: 'var(--accent-purple)', fontWeight: 800 }}>
              MAP: 12 WORD RUSH LEVELS ⚡
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Word Rush Curriculum</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
              Beat the clock in this speed test! Practice subject-verb agreements and conjugations across 12 comprehensive levels.
            </p>
          </div>

          {/* Grid Map */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {WORD_RUSH_LEVELS.map((levelData, idx) => {
              const isCompleted = idx < wordRushLevelIndex;
              const isActive = idx === wordRushLevelIndex;
              const isLocked = idx > wordRushLevelIndex;

              let cardBg = 'rgba(255, 255, 255, 0.03)';
              let borderStyle = 'var(--card-border)';
              let titleColor = 'var(--text-main)';

              if (isActive) {
                cardBg = 'rgba(139, 92, 246, 0.08)';
                borderStyle = '2px solid var(--accent-purple)';
                titleColor = 'var(--accent-purple)';
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
                      {isActive && <Play style={{ width: '18px', height: '18px', color: 'var(--accent-purple)', fill: 'currentColor' }} />}
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
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>5 Questions</span>
                    <span style={{ color: isCompleted ? '#10b981' : isActive ? 'var(--accent-purple)' : 'var(--text-muted)', fontWeight: 800 }}>
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
              Level {selectedLevel + 1} - Slide {currentIdx + 1}/5
            </div>
          </div>

          {!levelCleared ? (
            question && (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                
                {/* HUD info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800, color: timeLeft <= 3 ? '#ef4444' : 'var(--text-main)' }}>
                    <Timer style={{ width: '20px', height: '20px' }} />
                    <span>{timeLeft}s Left</span>
                  </div>

                  {combo > 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'rgba(234, 179, 8, 0.1)',
                      border: '1px solid #eab308',
                      color: '#eab308',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      fontWeight: 800
                    }}>
                      <Zap style={{ width: '14px', height: '14px', fill: '#eab308' }} />
                      <span>{combo}x Combo ({combo >= 3 ? '2x XP' : '1.5x XP'})</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '6px', background: 'var(--progress-bg)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(timeLeft / 10) * 100}%`,
                    height: '100%',
                    background: timeLeft <= 3 ? '#ef4444' : 'var(--accent-gradient)',
                    transition: 'width 1s linear'
                  }} />
                </div>

                {/* Question Text */}
                <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: '1.5' }}>
                    {question.text}
                  </h2>
                </div>

                {/* Options Grid */}
                <div className="options-grid">
                  {question.options.map((option, idx) => {
                    const isSelected = selectedOpt === option;
                    const isCorrectOption = option === question.answer;
                    
                    let borderStyle = 'var(--card-border)';
                    let bgStyle = 'var(--level-card-bg)';
                    let colorStyle = 'var(--text-main)';

                    if (checked) {
                      if (isCorrectOption) {
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
                          boxShadow: isSelected && isCorrectOption ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none'
                        }}
                        className={!checked ? "hover-lift" : ""}
                      >
                        {checked && isCorrectOption && <CheckCircle style={{ width: '18px', height: '18px' }} />}
                        {checked && isSelected && !isCorrectOption && <XCircle style={{ width: '18px', height: '18px' }} />}
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Feedback or Next Trigger */}
                {checked && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      color: selectedOpt === question.answer ? '#10b981' : '#ef4444',
                      fontWeight: 700
                    }}>
                      {selectedOpt === question.answer 
                        ? `Correct! +${combo >= 3 ? 30 : combo >= 2 ? 22 : 15} XP earned.` 
                        : selectedOpt === null 
                          ? "Time's up! Correct answer: " + question.answer
                          : "Oops! Correct answer: " + question.answer
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
                      {currentIdx < 4 ? 'Next Question ➡️' : 'Complete Level'}
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
                ⚡
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
                Excellent work! Rapid-fire syntax games test your active reflex and grammar internalization. Unlocking the next level...
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
