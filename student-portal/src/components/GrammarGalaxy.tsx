import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { ArrowLeft, RefreshCw, Volume2, HelpCircle, AlertCircle, Lock, CheckCircle, Play } from 'lucide-react';
import { LEVELS } from '../data/timeExpressionLevels';
import { useSpeech } from '../hooks/useSpeech';
import { Certificate } from './Certificate';

interface GrammarGalaxyProps {
  onBackToDashboard: () => void;
}

export const GrammarGalaxy: React.FC<GrammarGalaxyProps> = ({ onBackToDashboard }) => {
  const { 
    name,
    grade,
    school,
    addXp, 
    addCoins, 
    completeGame, 
    grammarGalaxyLevelIndex, 
    setGrammarGalaxyProgress
  } = useUserStore();

  // Selected level state (null means showing Level Map Selector)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
  // Game session states (per level)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);
  const [levelCleared, setLevelCleared] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  // Active word-builder states
  const [draft, setDraft] = useState<string[]>([]);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [customFeedback, setCustomFeedback] = useState<string | null>(null);

  const { speak, cancel } = useSpeech();

  // Reset session states when selected level changes
  useEffect(() => {
    if (selectedLevel !== null) {
      setCurrentSlideIndex(0);
      setShowExplanation(true);
      setLevelCleared(false);
      setGameEnded(false);
      setDraft([]);
      setShuffled([]);
      setChecked(false);
      setIsCorrect(false);
      setShowHint(false);
      setCustomFeedback(null);
    }
  }, [selectedLevel]);

  const currentLevel = selectedLevel !== null ? LEVELS[selectedLevel] : null;
  const currentSlide = currentLevel ? currentLevel.slides[currentSlideIndex] : null;

  // Unique certificate identifier based on the student's name
  const verificationHash = (name || 'Karan').toUpperCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 100);
  const certId = `EV-GG-EASY-${verificationHash}`;

  // Sync state changes back to Zustand store (only for current active progress level)
  useEffect(() => {
    if (selectedLevel !== null && !levelCleared && !gameEnded) {
      if (selectedLevel === grammarGalaxyLevelIndex) {
        setGrammarGalaxyProgress(selectedLevel, currentSlideIndex);
      }
    }
  }, [selectedLevel, currentSlideIndex, levelCleared, gameEnded, grammarGalaxyLevelIndex, setGrammarGalaxyProgress]);

  // Trigger voice narration automatically when the explanation card loads
  useEffect(() => {
    if (selectedLevel !== null && currentLevel && showExplanation && !levelCleared && !gameEnded) {
      const textToSpeak = `Time Expression: ${currentLevel.timeExpression}. Explanation: ${currentLevel.simpleExplanation}. For example: ${currentLevel.examples.join('. ')}`;
      speak(textToSpeak);
    }
  }, [selectedLevel, showExplanation, levelCleared, gameEnded, speak, currentLevel]);

  // Jumble words for the active slide
  useEffect(() => {
    if (selectedLevel !== null && currentSlide && !showExplanation && !levelCleared && !gameEnded) {
      setShuffled([...currentSlide.jumbled]);
      setDraft([]);
      setChecked(false);
      setIsCorrect(false);
      setShowHint(false);
      setCustomFeedback(null);
    }
  }, [selectedLevel, currentSlideIndex, showExplanation, levelCleared, gameEnded, currentSlide]);

  // Clean up speech on exit or unmount
  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  const handleLevelSelect = (levelIdx: number) => {
    if (levelIdx > grammarGalaxyLevelIndex) return; // Locked
    setSelectedLevel(levelIdx);
  };

  const handleWordClick = (word: string, isFromDraft: boolean) => {
    if (checked) return;
    if (isFromDraft) {
      setDraft(draft.filter(w => w !== word));
      setShuffled([...shuffled, word]);
    } else {
      setDraft([...draft, word]);
      setShuffled(shuffled.filter(w => w !== word));
    }
  };

  const handleCheck = () => {
    if (draft.length === 0 || !currentSlide) return;
    const isAnswerCorrect = draft.join(' ') === currentSlide.correctOrder.join(' ');
    setIsCorrect(isAnswerCorrect);
    setChecked(true);

    if (isAnswerCorrect) {
      addXp(15);
      addCoins(1);
      speak(draft.join(' '));
    } else {
      // Find if student used any distractor words
      const usedDistractor = currentSlide.distractors.find(d => draft.includes(d.word));
      if (usedDistractor) {
        setCustomFeedback(usedDistractor.feedback);
      } else {
        setCustomFeedback("Incorrect order! Try arranging the words differently to match the time expression.");
      }
    }
  };

  const handleNext = () => {
    cancel();
    if (currentSlideIndex < (currentLevel?.slides.length || 5) - 1) {
      // Go to next slide in current level
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      // Finished all 5 slides of this level
      setLevelCleared(true);
      
      // Award level completion points and coins
      addXp(50);
      addCoins(5);

      // Unlock next level in Zustand store
      const nextLevel = (selectedLevel ?? 0) + 1;
      if (selectedLevel === grammarGalaxyLevelIndex) {
        setGrammarGalaxyProgress(nextLevel, 0);
        if (nextLevel >= LEVELS.length) {
          completeGame('grammar-galaxy');
        }
      }
    }
  };

  const handleReset = () => {
    if (!currentSlide) return;
    setDraft([]);
    setShuffled([...currentSlide.jumbled]);
    setChecked(false);
    setIsCorrect(false);
    setCustomFeedback(null);
  };

  const handleBackToLevels = () => {
    cancel();
    setSelectedLevel(null);
  };

  const advanceNextLevel = () => {
    if (selectedLevel !== null && selectedLevel < LEVELS.length - 1) {
      setSelectedLevel(selectedLevel + 1);
    }
  };

  return (
    <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto' }}>
      
      {/* 1. LEVEL SELECTOR SCREEN */}
      {selectedLevel === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Top Navigation Row */}
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
            <div style={{ fontSize: '1rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
              MAP: 11 TIME MASTER LEVELS ⏳
            </div>
          </div>

          {/* Heading Banner */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Time Expression Master ⏳
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
              Master the jumbled sentence builder. Arrange words in perfect chronological order using exact past, present, and future time expressions.
            </p>
          </div>

          {/* Levels Grid (11 Levels) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {LEVELS.map((levelData, idx) => {
              const isCompleted = idx < grammarGalaxyLevelIndex;
              const isActive = idx === grammarGalaxyLevelIndex;
              const isLocked = idx > grammarGalaxyLevelIndex;

              let cardBg = 'rgba(255, 255, 255, 0.03)';
              let borderStyle = 'var(--card-border)';
              let titleColor = 'var(--text-main)';

              if (isActive) {
                cardBg = 'rgba(6, 182, 212, 0.08)';
                borderStyle = '2px solid var(--accent-cyan)';
                titleColor = 'var(--accent-cyan)';
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
                    padding: '1.25rem',
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
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: titleColor }}>
                        Level {idx + 1}
                      </span>
                      {isCompleted && <CheckCircle style={{ width: '18px', height: '18px', color: '#10b981' }} />}
                      {isActive && <Play style={{ width: '16px', height: '16px', color: 'var(--accent-cyan)', fill: 'currentColor' }} />}
                      {isLocked && <Lock style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />}
                    </div>
                    
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>
                      "{levelData.timeExpression}"
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {levelData.simpleExplanation}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', fontSize: '0.7rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>5 Jumbled Challenges</span>
                    <span style={{ color: isCompleted ? '#10b981' : isActive ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 800 }}>
                      {isCompleted ? 'CLEARED' : isActive ? 'PLAY NOW' : 'LOCKED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        
        /* 2. GAMEPLAY PORTION */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <button 
              onClick={handleBackToLevels}
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
              Level {selectedLevel + 1} of {LEVELS.length}
            </div>
          </div>

          {!levelCleared ? (
            showExplanation ? (
              
              /* A. LEVEL EXPLANATION INTRO SCREEN */
              <div className="glass-card animate-pulse-slow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', padding: '2.5rem 2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📖</div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Level {selectedLevel + 1}: "{currentLevel?.timeExpression}"</h2>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
                
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', textTransform: 'uppercase' }}>How to Use:</strong>
                    <p style={{ marginTop: '0.25rem', fontSize: '1.05rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                      {currentLevel?.simpleExplanation}
                    </p>
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: 'var(--card-border)' }}>
                    <strong style={{ color: '#eab308', fontSize: '0.9rem', textTransform: 'uppercase' }}>Spoken Examples:</strong>
                    <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: 0 }}>
                      {currentLevel?.examples.map((example, idx) => (
                        <li key={idx} style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                          ⚡ "{example}"
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => speak(`Time Expression: ${currentLevel?.timeExpression}. Explanation: ${currentLevel?.simpleExplanation}. For example: ${currentLevel?.examples.join('. ')}`)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: 'var(--card-border)',
                      color: 'var(--text-main)',
                      padding: '0.85rem 1.5rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-btn)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    className="hover-lift"
                  >
                    <Volume2 style={{ width: '18px', height: '18px' }} />
                    Listen Again
                  </button>
                  
                  <div style={{ flexGrow: 1 }} />
                  
                  <button 
                    onClick={() => {
                      cancel();
                      setShowExplanation(false);
                    }}
                    style={{
                      background: 'var(--accent-gradient)',
                      border: 'none',
                      color: 'white',
                      padding: '0.85rem 2.25rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-btn)',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px var(--accent-glow)'
                    }}
                  >
                    Ready, Let's Play! 🚀
                  </button>
                </div>
              </div>
            ) : (
              
              /* B. JUMBLED SENTENCE BUILDER SCREEN */
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Word count HUD */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Sentence Builder: Slide {currentSlideIndex + 1} of {currentLevel?.slides.length || 5}
                  </div>
                </div>

                {/* Top Prompt Banner */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                      ⏳ Time Expression: "{currentLevel?.timeExpression}"
                    </span>
                    <button 
                      onClick={() => setShowHint(!showHint)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.85rem'
                      }}
                    >
                      <HelpCircle style={{ width: '16px', height: '16px' }} />
                      Hint
                    </button>
                  </div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: '1.4', margin: '0.5rem 0 0 0' }}>
                    Prompt: {currentSlide?.prompt}
                  </h2>

                  {showHint && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.05)',
                      borderLeft: '4px solid var(--accent-cyan)',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)'
                    }}>
                      💡 Hint: Arrange the words to answer the prompt. Make sure you use the correct verb form for the time expression "{currentLevel?.timeExpression}".
                    </div>
                  )}
                </div>

                {/* Middle Drop Box */}
                <div style={{
                  minHeight: '90px',
                  background: 'rgba(0,0,0,0.18)',
                  border: checked 
                    ? isCorrect 
                      ? '2px solid #10b981' 
                      : '2px solid #ef4444'
                    : '2px dashed rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: checked && isCorrect ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
                }}>
                  {draft.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>
                      Tap the words at the bottom to arrange your sentence here...
                    </div>
                  ) : (
                    draft.map((word, index) => (
                      <button
                        key={`draft-${index}`}
                        onClick={() => handleWordClick(word, true)}
                        disabled={checked}
                        style={{
                          background: 'var(--accent-gradient)',
                          border: 'none',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: 'var(--radius-btn)',
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          cursor: checked ? 'default' : 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>

                {/* Bottom Jumbled Word Bank */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                    🔠 Word Bank (Tap to add):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', minHeight: '60px' }}>
                    {shuffled.map((word, index) => (
                      <button
                        key={`jumbled-${index}`}
                        onClick={() => handleWordClick(word, false)}
                        disabled={checked}
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: 'var(--card-border)',
                          color: 'var(--text-main)',
                          padding: '0.6rem 1.25rem',
                          borderRadius: 'var(--radius-btn)',
                          fontSize: '1rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        className="hover-lift"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions & Feedback Alert */}
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginTop: '0.5rem' }}>
                  {!checked ? (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        onClick={handleCheck}
                        disabled={draft.length === 0}
                        style={{
                          flexGrow: 1,
                          background: 'var(--accent-gradient)',
                          border: 'none',
                          color: 'white',
                          padding: '0.85rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-btn)',
                          cursor: draft.length === 0 ? 'not-allowed' : 'pointer',
                          opacity: draft.length === 0 ? 0.5 : 1,
                          boxShadow: '0 4px 15px var(--accent-glow)'
                        }}
                      >
                        Check Syntax ✓
                      </button>
                      <button 
                        onClick={handleReset}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: 'var(--card-border)',
                          color: 'var(--text-main)',
                          padding: '0.85rem 1.5rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-btn)',
                          cursor: 'pointer'
                        }}
                      >
                        <RefreshCw style={{ width: '18px', height: '18px' }} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      
                      {/* Result Box */}
                      <div style={{
                        padding: '1.25rem',
                        borderRadius: '16px',
                        background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                        border: isCorrect ? '1px solid #10b981' : '1px solid #ef4444',
                        color: isCorrect ? '#10b981' : '#ef4444',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isCorrect ? (
                              <strong style={{ fontSize: '1.1rem' }}>Excellent! Correct Sentence ✓</strong>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertCircle style={{ width: '20px', height: '20px' }} />
                                <strong style={{ fontSize: '1.1rem' }}>Incorrect Word Order</strong>
                              </div>
                            )}
                          </div>
                          {isCorrect && (
                            <button 
                              onClick={() => speak(draft.join(' '))}
                              style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}
                            >
                              <Volume2 style={{ width: '22px', height: '22px' }} />
                            </button>
                          )}
                        </div>
                        
                        {!isCorrect && customFeedback && (
                          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.15)', padding: '0.75rem 1rem', borderRadius: '8px', marginTop: '0.5rem', lineHeight: '1.5', borderLeft: '3px solid #ef4444' }}>
                            💡 <strong>Tutor Tip:</strong> {customFeedback}
                          </p>
                        )}

                        {isCorrect && (
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Earned +15 XP. Click continue to proceed.
                          </p>
                        )}
                      </div>

                      {/* Controls */}
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        {!isCorrect && (
                          <button 
                            onClick={handleReset}
                            style={{
                              flexGrow: 1,
                              background: 'rgba(255,255,255,0.06)',
                              border: 'var(--card-border)',
                              color: 'var(--text-main)',
                              padding: '0.85rem',
                              fontWeight: 700,
                              borderRadius: 'var(--radius-btn)',
                              cursor: 'pointer'
                            }}
                          >
                            Retry Slide
                          </button>
                        )}
                        <button 
                          onClick={handleNext}
                          style={{
                            flexGrow: isCorrect ? 1 : 2,
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
                          {currentSlideIndex < (currentLevel?.slides.length || 5) - 1 
                            ? 'Next Slide ➡️' 
                            : 'Complete Level 🏁'
                          }
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )
          ) : (
            
            /* C. LEVEL CLEARED SCREEN */
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
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
                ⏳
              </div>
              
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Level {selectedLevel + 1} Cleared!</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '480px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Sensational! You cleared all 5 sentence building slides for Level {selectedLevel + 1}: "{currentLevel?.timeExpression}". You are mastering temporal sequencing structures!
              </p>

              <div style={{
                display: 'flex',
                gap: '2rem',
                margin: '1rem 0',
                padding: '1.25rem 2rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: 'var(--card-border)'
              }}>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>+125</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.25rem' }}>XP Earned</div>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>+10</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.25rem' }}>Coins Claimed</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '500px' }}>
                <button 
                  onClick={handleBackToLevels}
                  style={{
                    flexGrow: 1,
                    background: 'rgba(255,255,255,0.06)',
                    border: 'var(--card-border)',
                    color: 'var(--text-main)',
                    padding: '0.85rem 1.5rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-btn)',
                    cursor: 'pointer'
                  }}
                  className="hover-lift"
                >
                  Map Select 🗺️
                </button>

                {selectedLevel < LEVELS.length - 1 ? (
                  <button 
                    onClick={advanceNextLevel}
                    style={{
                      flexGrow: 1,
                      background: 'var(--accent-gradient)',
                      border: 'none',
                      color: 'white',
                      padding: '0.85rem 2rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-btn)',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px var(--accent-glow)'
                    }}
                  >
                    Play Level {selectedLevel + 2} ➡️
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setGameEnded(true);
                      cancel();
                    }}
                    style={{
                      flexGrow: 1,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      color: 'white',
                      padding: '0.85rem 2rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-btn)',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Graduation Certificate 🎓
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Graduation Screen */}
      {gameEnded && (
        <Certificate 
          name={name}
          grade={grade}
          school={school}
          certId={certId}
          onReplay={() => {
            setSelectedLevel(0);
          }}
          onBackToDashboard={onBackToDashboard}
        />
      )}

    </div>
  );
};
