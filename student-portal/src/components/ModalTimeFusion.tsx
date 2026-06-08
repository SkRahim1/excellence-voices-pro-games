import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { ArrowLeft, Volume2, HelpCircle, AlertCircle, Lock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { MODAL_TIME_FUSION_LEVELS } from '../data/modalTimeFusion';
import { useSpeech } from '../hooks/useSpeech';

interface ModalTimeFusionProps {
  onBackToDashboard: () => void;
}

export const ModalTimeFusion: React.FC<ModalTimeFusionProps> = ({ onBackToDashboard }) => {
  const { 
    addXp, 
    addCoins, 
    completeGame, 
    modalTimeFusionLevelIndex, 
    setModalTimeFusionLevelIndex 
  } = useUserStore();
  
  const { speak, cancel } = useSpeech();

  // Screen selection
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
  // Game session states
  const [showStudyDeck, setShowStudyDeck] = useState(true);
  const [currentStudyCardIndex, setCurrentStudyCardIndex] = useState(0);
  
  // Quiz states
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  // Initialize level session
  useEffect(() => {
    if (selectedLevel !== null) {
      setShowStudyDeck(true);
      setCurrentStudyCardIndex(0);
      setCurrentRound(0);
      setSelectedOpt(null);
      setChecked(false);
      setIsCorrect(false);
      setShowHint(false);
      setScore(0);
      setLevelCompleted(false);
    }
  }, [selectedLevel]);

  // Scroll to top when switching between level map and active gameplay
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedLevel]);

  const activeLevelData = selectedLevel !== null ? MODAL_TIME_FUSION_LEVELS[selectedLevel] : null;
  const currentStudyDecks = activeLevelData?.studyDecks || [];
  const activeStudyCard = currentStudyDecks[currentStudyCardIndex] || null;
  
  const currentQuestions = activeLevelData?.questions || [];
  const activeQuestion = currentQuestions[currentRound] || null;

  // Auto-narration for study slides
  useEffect(() => {
    if (selectedLevel !== null && showStudyDeck && activeStudyCard && !levelCompleted) {
      speakStudyCard();
    }
  }, [selectedLevel, showStudyDeck, currentStudyCardIndex, activeStudyCard]);

  // Clean up speech on exit or unmount
  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  const speakStudyCard = () => {
    if (!activeStudyCard || selectedLevel === null) return;
    cancel();
    
    // Narrate deck title, explanation, and example lines
    const examplesText = activeStudyCard.examples.map(ex => ex.replace("->", "which response is: ")).join('. ');
    const speechText = `Level ${selectedLevel + 1}. ${activeStudyCard.title}. ${activeStudyCard.explanation}. Let's listen to the examples. ${examplesText}`;
    
    speak(speechText);
  };

  const speakQuizCompletedSentence = () => {
    if (!activeQuestion) return;
    cancel();
    
    // Replace the blanks with the correct answer for narration.
    // If the question has multiple blanks, we just speak the final dialogue representation
    const optionsParts = activeQuestion.answer.split(" / ");
    let completedDialogue = activeQuestion.quizDialogue;
    
    // We assume option is formatted like "Modal / Timeword" or similar.
    // Replace first blank with Modal, second blank with Timeword.
    if (optionsParts.length >= 2) {
      completedDialogue = completedDialogue
        .replace("______", optionsParts[0])
        .replace("______", optionsParts[1]);
    } else {
      completedDialogue = completedDialogue.replace("______", activeQuestion.answer);
    }

    // Clean dialogue representation for voice
    const cleanDialogue = completedDialogue.replace("->", ". Response: ");
    speak(cleanDialogue);
  };

  const handleLevelSelect = (levelIdx: number) => {
    if (levelIdx > modalTimeFusionLevelIndex) return; // Locked
    setSelectedLevel(levelIdx);
  };

  const handleOptionSelect = (option: string) => {
    if (checked) return;
    setSelectedOpt(option);
  };

  const handleCheck = () => {
    if (!selectedOpt || !activeQuestion) return;
    
    const isAnsCorrect = selectedOpt === activeQuestion.answer;
    setIsCorrect(isAnsCorrect);
    setChecked(true);

    if (isAnsCorrect) {
      setScore(prev => prev + 10);
      addXp(15);
      addCoins(1);
      speakQuizCompletedSentence();
    } else {
      speak("That is incorrect. Look at the tutor explanation below.");
    }
  };

  const handleNextQuestion = () => {
    cancel();
    if (currentRound < currentQuestions.length - 1) {
      setCurrentRound(prev => prev + 1);
      setSelectedOpt(null);
      setChecked(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      // Completed all 10 rounds
      setLevelCompleted(true);
      
      // Completion rewards
      addXp(50);
      addCoins(5);

      // Unlock next level
      const nextLevel = (selectedLevel ?? 0) + 1;
      if (selectedLevel === modalTimeFusionLevelIndex) {
        setModalTimeFusionLevelIndex(nextLevel);
        if (nextLevel >= MODAL_TIME_FUSION_LEVELS.length) {
          completeGame('modal-time-fusion');
        }
      }
    }
  };

  const handleBackToLevels = () => {
    cancel();
    setSelectedLevel(null);
  };

  const advanceNextLevel = () => {
    if (selectedLevel !== null && selectedLevel < MODAL_TIME_FUSION_LEVELS.length - 1) {
      setSelectedLevel(selectedLevel + 1);
    } else {
      setSelectedLevel(null);
    }
  };

  // Render variables
  const fusionGradient = 'linear-gradient(135deg, #d946ef, #db2777)';
  const fusionGlow = 'rgba(217, 70, 239, 0.25)';

  return (
    <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto' }}>
      
      {/* 1. LEVEL SELECTOR MAP */}
      {selectedLevel === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Top Navigation */}
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
            <div style={{ fontSize: '1.1rem', color: '#db2777', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>🔮</span> DIFFICULT CHALLENGE MAP
            </div>
          </div>

          {/* Banner */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Soft decorative glow background */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-20%',
              width: '140%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(217, 70, 239, 0.08) 0%, transparent 60%)',
              pointerEvents: 'none'
            }} />
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 800, 
              marginBottom: '0.5rem',
              background: fusionGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Modal Time Fusion 🔮
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
              Calibrate past, present, and hypothetical modal auxiliaries coupled with duration and deadline time expressions. Master complex conversational Q&A patterns in double-blank dialogues!
            </p>
          </div>

          {/* Grid of 11 Levels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {MODAL_TIME_FUSION_LEVELS.map((level, idx) => {
              const isCompleted = idx < modalTimeFusionLevelIndex;
              const isActive = idx === modalTimeFusionLevelIndex;
              const isLocked = idx > modalTimeFusionLevelIndex;

              let cardBg = 'rgba(255, 255, 255, 0.03)';
              let borderStyle = 'var(--card-border)';
              let titleColor = 'var(--text-main)';

              if (isActive) {
                cardBg = 'rgba(217, 70, 239, 0.08)';
                borderStyle = '2px solid #d946ef';
                titleColor = '#d946ef';
              } else if (isCompleted) {
                cardBg = 'rgba(16, 185, 129, 0.04)';
                borderStyle = '1px solid rgba(16, 185, 129, 0.25)';
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
                    opacity: isLocked ? 0.45 : 1,
                    transition: 'all 0.2s',
                    boxShadow: isActive ? `0 0 15px ${fusionGlow}` : 'none'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: titleColor }}>
                        Level {idx + 1}
                      </span>
                      {isCompleted && <CheckCircle style={{ width: '18px', height: '18px', color: '#10b981' }} />}
                      {isActive && <Play style={{ width: '16px', height: '16px', color: '#d946ef', fill: 'currentColor' }} />}
                      {isLocked && <Lock style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />}
                    </div>
                    
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.4rem 0', color: 'var(--text-main)' }}>
                      {level.title}
                    </h5>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      {level.description}
                    </p>
                  </div>

                  <div style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: isCompleted ? '#10b981' : isActive ? '#d946ef' : 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {isCompleted ? '✓ Completed' : isActive ? '⚡ Playing' : '🔒 Locked'}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* 2. ACTIVE GAMEPLAY SCREENS (STUDY DECK VS QUIZ BOARD) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              onClick={handleBackToLevels}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.05)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
              className="hover-lift"
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              Exit Level
            </button>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{
                background: fusionGradient,
                color: 'white',
                padding: '0.35rem 0.75rem',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                boxShadow: `0 0 10px ${fusionGlow}`
              }}>
                LEVEL {selectedLevel + 1}: {activeLevelData?.title}
              </span>
              {!levelCompleted && !showStudyDeck && (
                <span className="glass-card" style={{ padding: '0.35rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                  🎯 Score: {score}
                </span>
              )}
            </div>
          </div>

          {/* Main Card View */}
          {!levelCompleted ? (
            showStudyDeck ? (
              /* STUDY SLIDESHOW PHASE */
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', minHeight: '380px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-divider)', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d946ef' }}>
                    📖 Study deck: {activeStudyCard?.title}
                  </h3>
                  <button 
                    onClick={speakStudyCard}
                    style={{
                      background: 'rgba(217, 70, 239, 0.12)',
                      border: '1px solid rgba(217, 70, 239, 0.25)',
                      color: '#d946ef',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Listen to slide content"
                    className="hover-lift"
                  >
                    <Volume2 style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>Grammar Concept:</h5>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                      {activeStudyCard?.explanation}
                    </p>
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text-main)' }}>Key Double-Blank Q&A Examples:</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {activeStudyCard?.examples.map((example, idx) => {
                        const parts = example.split(" -> ");
                        return (
                          <div 
                            key={idx} 
                            style={{ 
                              padding: '0.75rem 1rem', 
                              background: 'rgba(255,255,255,0.02)', 
                              borderLeft: '3px solid #db2777',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              lineHeight: '1.5'
                            }}
                          >
                            <div style={{ color: 'var(--text-muted)' }}><strong>Q:</strong> {parts[0]}</div>
                            {parts[1] && <div style={{ color: 'var(--text-main)', marginTop: '0.15rem' }}><strong>A:</strong> {parts[1]}</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Slides Navigation footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-divider)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Slide {currentStudyCardIndex + 1} of {currentStudyDecks.length}
                  </span>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      disabled={currentStudyCardIndex === 0}
                      onClick={() => setCurrentStudyCardIndex(p => p - 1)}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: 'var(--card-border)',
                        color: 'var(--text-main)',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-btn)',
                        cursor: currentStudyCardIndex === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        opacity: currentStudyCardIndex === 0 ? 0.3 : 1
                      }}
                    >
                      <ChevronLeft style={{ width: '16px', height: '16px' }} />
                      Back
                    </button>

                    {currentStudyCardIndex < currentStudyDecks.length - 1 ? (
                      <button
                        onClick={() => setCurrentStudyCardIndex(p => p + 1)}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: 'var(--card-border)',
                          color: 'var(--text-main)',
                          padding: '0.5rem 1rem',
                          borderRadius: 'var(--radius-btn)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                        className="hover-lift"
                      >
                        Next
                        <ChevronRight style={{ width: '16px', height: '16px' }} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          cancel();
                          setShowStudyDeck(false);
                        }}
                        style={{
                          background: fusionGradient,
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1.25rem',
                          borderRadius: 'var(--radius-btn)',
                          cursor: 'pointer',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: `0 0 10px ${fusionGlow}`
                        }}
                        className="hover-lift"
                      >
                        <Play style={{ width: '14px', height: '14px', fill: 'currentColor' }} />
                        Start Quiz
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* QUIZ QUESTIONS BOARD */
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', minHeight: '380px' }}>
                
                {/* Round Progress Tracker */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800 }}>
                    QUESTION {currentRound + 1} OF {currentQuestions.length}
                  </span>
                  
                  {/* Progress Line */}
                  <div style={{ flex: 1, margin: '0 1.5rem', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${((currentRound) / currentQuestions.length) * 100}%`,
                      height: '100%',
                      background: fusionGradient,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>

                  <span style={{ fontSize: '0.85rem', color: '#db2777', fontWeight: 800 }}>
                    {Math.round(((currentRound) / currentQuestions.length) * 100)}% Done
                  </span>
                </div>

                {/* Scenario Details */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <AlertCircle style={{ color: '#d946ef', width: '20px', height: '20px', flexShrink: 0, marginTop: '0.1rem' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                      Dialogue Context / Scenario:
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.15rem', lineHeight: '1.4' }}>
                      {activeQuestion?.scenario}
                    </div>
                  </div>
                </div>

                {/* Double-Blank Dialogue display */}
                <div className="glass-card" style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.15)',
                  border: 'var(--card-border)',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  lineHeight: '1.6',
                  borderRadius: 'var(--radius-card)',
                  margin: '0.25rem 0'
                }}>
                  {(() => {
                    if (!activeQuestion) return null;
                    const qDialogue = activeQuestion.quizDialogue;
                    const parts = qDialogue.split(" -> ");
                    
                    // Format blanks inside question and responses
                    // Render selected options inline if checked or selected
                    let displayQ = parts[0];
                    let displayA = parts[1] || '';

                    // For the display dialogue, let's substitute the blanks dynamically
                    const optParts = selectedOpt ? selectedOpt.split(" / ") : [];
                    
                    if (checked || selectedOpt) {
                      // Modal is index 0, Timeword is index 1.
                      // If there is only one blank, we replace standard. If two blanks:
                      if (optParts.length >= 2) {
                        displayQ = displayQ.replace("______", `[ ${optParts[0]} ]`).replace("______", `[ ${optParts[1]} ]`);
                        displayA = displayA.replace("______", `[ ${optParts[0]} ]`).replace("______", `[ ${optParts[1]} ]`);
                      } else {
                        const substVal = selectedOpt || '';
                        displayQ = displayQ.replace("______", `[ ${substVal} ]`);
                        displayA = displayA.replace("______", `[ ${substVal} ]`);
                      }
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div>
                          <strong style={{ color: '#d946ef', marginRight: '0.5rem' }}>Q:</strong> 
                          <span style={{ letterSpacing: '0.01em' }}>{displayQ}</span>
                        </div>
                        {displayA && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
                            <strong style={{ color: '#db2777', marginRight: '0.5rem' }}>A:</strong> 
                            <span style={{ color: 'var(--text-muted)' }}>{displayA}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Interactive Multi-Part Options */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                  {activeQuestion?.options.map((option, idx) => {
                    const isSelected = selectedOpt === option;
                    let optBg = 'rgba(255,255,255,0.02)';
                    let optBorder = 'var(--card-border)';
                    let optColor = 'var(--text-main)';

                    if (isSelected) {
                      optBg = 'rgba(217, 70, 239, 0.12)';
                      optBorder = '1.5px solid #d946ef';
                      optColor = '#d946ef';
                    }

                    if (checked) {
                      if (option === activeQuestion.answer) {
                        optBg = 'rgba(16, 185, 129, 0.12)';
                        optBorder = '2px solid #10b981';
                        optColor = '#10b981';
                      } else if (isSelected) {
                        optBg = 'rgba(239, 68, 68, 0.12)';
                        optBorder = '2px solid #ef4444';
                        optColor = '#ef4444';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={checked}
                        onClick={() => handleOptionSelect(option)}
                        style={{
                          background: optBg,
                          border: optBorder,
                          color: optColor,
                          padding: '1rem',
                          borderRadius: 'var(--radius-btn)',
                          cursor: checked ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                        className={checked ? '' : 'hover-lift'}
                      >
                        {option}
                        {checked && option === activeQuestion.answer && <CheckCircle style={{ width: '16px', height: '16px' }} />}
                        {checked && isSelected && option !== activeQuestion.answer && <XCircle style={{ width: '16px', height: '16px' }} />}
                      </button>
                    );
                  })}
                </div>

                {/* Checked Feedback Info Box */}
                {checked && (
                  <div style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-card)',
                    background: isCorrect ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)',
                    border: isCorrect ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    marginTop: '0.5rem'
                  }}>
                    <div style={{ fontWeight: 800, color: isCorrect ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      {isCorrect ? '✓ Excellent! Correct combination' : '✗ Incorrect choice'}
                      <button 
                        onClick={speakQuizCompletedSentence} 
                        style={{ background: 'none', border: 'none', color: 'inherit', padding: '0 0.25rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                        title="Play dialogue audio"
                      >
                        <Volume2 style={{ width: '14px', height: '14px', marginLeft: '0.25rem' }} />
                      </button>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      {activeQuestion?.feedback}
                    </div>
                  </div>
                )}

                {/* Footer Controls: Check vs Next, and Hint */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-divider)' }}>
                  <div>
                    <button
                      onClick={() => setShowHint(p => !p)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      <HelpCircle style={{ width: '16px', height: '16px', color: '#db2777' }} />
                      {showHint ? 'Hide Tutor Tip' : 'Need a Tutor Tip?'}
                    </button>
                    {showHint && activeQuestion && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '300px', fontStyle: 'italic', lineHeight: '1.4' }}>
                        💡 Think about the matching timeline: check if the pronouns align, and make sure the modal auxiliary denotes the correct mood (possibility, request, advice, or duty).
                      </div>
                    )}
                  </div>

                  {!checked ? (
                    <button
                      disabled={!selectedOpt}
                      onClick={handleCheck}
                      style={{
                        background: selectedOpt ? fusionGradient : 'rgba(255,255,255,0.06)',
                        color: selectedOpt ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        padding: '0.6rem 1.75rem',
                        borderRadius: 'var(--radius-btn)',
                        cursor: selectedOpt ? 'pointer' : 'not-allowed',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        boxShadow: selectedOpt ? `0 0 10px ${fusionGlow}` : 'none'
                      }}
                      className={selectedOpt ? 'hover-lift' : ''}
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      style={{
                        background: fusionGradient,
                        color: 'white',
                        border: 'none',
                        padding: '0.6rem 1.75rem',
                        borderRadius: 'var(--radius-btn)',
                        cursor: 'pointer',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        boxShadow: `0 0 10px ${fusionGlow}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                      className="hover-lift"
                    >
                      {currentRound < currentQuestions.length - 1 ? 'Next Question' : 'Complete Level'}
                      <ChevronRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  )}
                </div>

              </div>
            )
          ) : (
            /* 3. LEVEL CLEARED CONGRATULATIONS OVERLAY */
            <div className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '3rem 2rem',
              gap: '1.5rem',
              minHeight: '380px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Celeb particle effects background */}
              <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-20%',
                width: '140%',
                height: '140%',
                background: 'radial-gradient(circle, rgba(217, 70, 239, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{ fontSize: '4.5rem', animation: 'bounce 1s infinite' }}>🏆</div>
              
              <div>
                <h2 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 800, 
                  background: fusionGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem'
                }}>
                  Level {selectedLevel + 1} Cleared!
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '450px', margin: '0 auto', lineHeight: '1.5' }}>
                  Magnificent! You successfully fused advanced modal syntax with double-blank time expressions in conversational dialogues.
                </p>
              </div>

              {/* Score and Payout Cards */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '0.5rem 0' }}>
                <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '15px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>XP Awarded</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>+50 XP</span>
                </div>
                <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '15px', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Coins Earned</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>+5 Coins</span>
                </div>
              </div>

              {/* Navigation buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={handleBackToLevels}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: 'var(--card-border)',
                    color: 'var(--text-main)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-btn)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}
                  className="hover-lift"
                >
                  Back to Levels Map
                </button>

                {selectedLevel < MODAL_TIME_FUSION_LEVELS.length - 1 && (
                  <button
                    onClick={advanceNextLevel}
                    style={{
                      background: fusionGradient,
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: 'var(--radius-btn)',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      boxShadow: `0 0 15px ${fusionGlow}`
                    }}
                    className="hover-lift"
                  >
                    Play Next Level
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
