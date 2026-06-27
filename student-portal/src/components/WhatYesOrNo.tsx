import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { ArrowLeft, Volume2, HelpCircle, AlertCircle, Lock, CheckCircle, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { WHAT_YES_OR_NO_LEVELS } from '../data/whatYesOrNo';
import { useSpeech } from '../hooks/useSpeech';

interface WhatYesOrNoProps {
  onBackToDashboard: () => void;
}

export const WhatYesOrNo: React.FC<WhatYesOrNoProps> = ({ onBackToDashboard }) => {
  const { 
    addXp, 
    addCoins, 
    completeGame, 
    whatYesOrNoLevelIndex, 
    setWhatYesOrNoLevelIndex 
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

  const activeLevelData = selectedLevel !== null ? WHAT_YES_OR_NO_LEVELS[selectedLevel] : null;
  const currentStudyDecks = activeLevelData?.studyDecks || [];
  const activeStudyCard = currentStudyDecks[currentStudyCardIndex] || null;
  
  const currentQuizQuestions = activeLevelData?.quizQuestions || [];
  const activeQuizQuestion = currentQuizQuestions[currentRound] || null;

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
    if (!activeStudyCard || !activeLevelData) return;
    cancel();
    
    // Narrate focus modal, usecase, explanation, and then the examples
    const examplesText = activeStudyCard.examples.join('. ');
    const speechText = `Level ${selectedLevel! + 1}. Focus modal: ${activeLevelData.modal.toUpperCase()}. Use Case: ${activeStudyCard.usecase}. Explanation: ${activeStudyCard.explanation}. Let's listen to the examples: ${examplesText}`;
    
    speak(speechText);
  };

  const speakQuizCompletedSentence = () => {
    if (!activeQuizQuestion) return;
    cancel();
    
    // Replace the blank with the correct answer for narration
    const text = activeQuizQuestion.quizDialogue.replace("______", activeQuizQuestion.answer);
    speak(text);
  };

  const handleLevelSelect = (levelIdx: number) => {
    if (levelIdx > whatYesOrNoLevelIndex) return; // Locked
    setSelectedLevel(levelIdx);
  };

  const handleOptionSelect = (option: string) => {
    if (checked) return;
    setSelectedOpt(option);
  };

  const handleCheck = () => {
    if (!selectedOpt || !activeQuizQuestion) return;
    
    const isAnsCorrect = selectedOpt === activeQuizQuestion.answer;
    setIsCorrect(isAnsCorrect);
    setChecked(true);

    if (isAnsCorrect) {
      setScore(prev => prev + 20);
      addXp(20);
      addCoins(2);
      speakQuizCompletedSentence();
    } else {
      speak("Oops, incorrect! Let's read the tutor tip.");
    }
  };

  const handleNextQuestion = () => {
    cancel();
    if (currentRound < 4) {
      setCurrentRound(prev => prev + 1);
      setSelectedOpt(null);
      setChecked(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      // Completed all 5 rounds
      setLevelCompleted(true);

      // Unlock next level — only on FIRST-TIME completion
      const nextLevel = (selectedLevel ?? 0) + 1;
      if (selectedLevel === whatYesOrNoLevelIndex) {
        // Award completion rewards only on first-time completion
        addXp(50);
        addCoins(5);
        setWhatYesOrNoLevelIndex(nextLevel);
        if (nextLevel >= WHAT_YES_OR_NO_LEVELS.length) {
          completeGame('what-yes-or-no');
        }
      }
      // Replaying a cleared level: no XP/coin reward
    }
  };

  const handleBackToLevels = () => {
    cancel();
    setSelectedLevel(null);
  };

  const advanceNextLevel = () => {
    if (selectedLevel !== null && selectedLevel < WHAT_YES_OR_NO_LEVELS.length - 1) {
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
            <div style={{ fontSize: '1rem', color: 'var(--accent-purple)', fontWeight: 800 }}>
              MAP: 22 LEVEL QUESTS 🗺️
            </div>
          </div>

          {/* Heading Banner */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              What Yes or No? 💬
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
              Master the construction and quick answering of Yes/No questions using combinations of modal verbs and time indicators. Move through study slides, listen to narration, and score in grammar quizzes!
            </p>
          </div>

          {/* Levels Grid (22 Levels) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {WHAT_YES_OR_NO_LEVELS.map((levelData, idx) => {
              const isCompleted = idx < whatYesOrNoLevelIndex;
              const isActive = idx === whatYesOrNoLevelIndex;
              const isLocked = idx > whatYesOrNoLevelIndex;

              let cardBg = 'rgba(255, 255, 255, 0.03)';
              let borderStyle = 'var(--card-border)';
              let titleColor = 'var(--text-main)';

              if (isActive) {
                cardBg = 'rgba(99, 102, 241, 0.08)';
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
                      {isActive && <Play style={{ width: '16px', height: '16px', color: 'var(--accent-purple)', fill: 'currentColor' }} />}
                      {isLocked && <Lock style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />}
                    </div>
                    
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                      {levelData.focus.split(" - ")[0]}
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3', margin: 0 }}>
                      {levelData.focus.split(" - ")[1]}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', fontSize: '0.7rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>5 Study Decks • 5 Rounds</span>
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
              Level {selectedLevel + 1} of {WHAT_YES_OR_NO_LEVELS.length}
            </div>
          </div>

          {!levelCompleted ? (
            showStudyDeck ? (
              
              /* A. STUDY DECK FLASHCARD MODE */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Visual progression bar */}
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  {currentStudyDecks.map((_, sIdx) => (
                    <div 
                      key={sIdx} 
                      style={{
                        flexGrow: 1,
                        height: '6px',
                        borderRadius: '3px',
                        background: sIdx === currentStudyCardIndex 
                          ? 'var(--accent-purple)' 
                          : sIdx < currentStudyCardIndex 
                            ? 'rgba(99, 102, 241, 0.4)' 
                            : 'rgba(255, 255, 255, 0.1)',
                        transition: 'background 0.3s'
                      }}
                    />
                  ))}
                </div>

                <div className="glass-card animate-pulse-slow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem 2rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                    📖 Flashcard Study Phase ({currentStudyCardIndex + 1} of {currentStudyDecks.length})
                  </span>
                  
                  <h2 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '0.02em', margin: '0.5rem 0' }}>
                    {activeLevelData?.focus.split(" - ")[0].toUpperCase()}
                  </h2>
                  <div style={{ fontSize: '1.1rem', color: 'var(--accent-purple)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginTop: '-0.5rem' }}>
                    🎯 Rule: {activeStudyCard?.usecase}
                  </div>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', margin: '0.25rem 0' }} />
                  
                  <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1rem 1.25rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-purple)', textAlign: 'left', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Easy Explanation:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.4' }}>
                      {activeStudyCard?.explanation}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: 'var(--card-border)' }}>
                      <strong style={{ color: '#34d399', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>5 Q&A Examples:</strong>
                      <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {activeStudyCard?.examples.map((ex, exIdx) => {
                          const parts = ex.split(" -> ");
                          if (parts.length === 2) {
                            const question = parts[0];
                            const answer = parts[1];
                            
                            if (answer.trim() === "(Question Structure)") {
                              return (
                                <li key={exIdx} style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: '1.4' }}>
                                  <span style={{ color: '#67e8f9' }}>⚡ {question}</span>
                                </li>
                              );
                            }
                            
                            const isYes = answer.trim().toLowerCase().startsWith("yes");
                            const isNo = answer.trim().toLowerCase().startsWith("no");
                            
                            let answerColor = 'var(--text-muted)';
                            if (isYes) answerColor = '#34d399'; // emerald green
                            if (isNo) answerColor = '#f87171';  // rose red
                            
                            return (
                              <li key={exIdx} style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: '1.4' }}>
                                <span style={{ color: '#67e8f9' }}>⚡ {question}</span>
                                <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 0.5rem' }}>➔</span>
                                <span style={{ color: answerColor, fontWeight: 700 }}>{answer}</span>
                              </li>
                            );
                          }
                          return (
                            <li key={exIdx} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.4' }}>
                              ⚡ {ex}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {/* Flashcard Actions */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <button 
                      onClick={speakStudyCard}
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
                      Listen Examples
                    </button>

                    <div style={{ flexGrow: 1 }} />

                    <button 
                      disabled={currentStudyCardIndex === 0}
                      onClick={() => {
                        cancel();
                        setCurrentStudyCardIndex(prev => prev - 1);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: 'var(--card-border)',
                        color: 'var(--text-main)',
                        padding: '0.85rem 1.5rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-btn)',
                        cursor: currentStudyCardIndex === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentStudyCardIndex === 0 ? 0.3 : 1
                      }}
                    >
                      <ChevronLeft style={{ width: '18px', height: '18px', display: 'inline', marginRight: '0.25rem' }} />
                      Prev
                    </button>

                    {currentStudyCardIndex < currentStudyDecks.length - 1 ? (
                      <button 
                        onClick={() => {
                          cancel();
                          setCurrentStudyCardIndex(prev => prev + 1);
                        }}
                        style={{
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
                        Next Concept
                        <ChevronRight style={{ width: '18px', height: '18px', display: 'inline', marginLeft: '0.25rem' }} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          cancel();
                          setShowStudyDeck(false);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          color: 'white',
                          padding: '0.85rem 2.25rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-btn)',
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        Start Quiz! 🚀
                      </button>
                    )}
                  </div>

                </div>

              </div>
            ) : (
              
              /* B. QUIZ PLAY MODE */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Round HUD */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Quiz Progress: Round {currentRound + 1} of 5
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 800 }}>
                    XP: +{score}
                  </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Scenario & Question Prompt */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                        💬 Scenario: {activeQuizQuestion?.scenario}
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
                        Grammar Tip
                      </button>
                    </div>

                    {(() => {
                      const dialogue = activeQuizQuestion?.quizDialogue || "";
                      const dialogueParts = dialogue.split(" -> ");
                      if (dialogueParts.length === 2) {
                        const qPart = dialogueParts[0];
                        const aPart = dialogueParts[1];
                        
                        const isYes = aPart.trim().toLowerCase().startsWith("yes");
                        const isNo = aPart.trim().toLowerCase().startsWith("no");
                        let answerColor = 'var(--text-muted)';
                        if (isYes) answerColor = '#34d399';
                        if (isNo) answerColor = '#f87171';
                        
                        const questionPrefix = qPart.split("______")[0];
                        const questionSuffix = qPart.split("______")[1] || "";
                        
                        return (
                          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: '1.5', margin: '0.5rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                            <div style={{ color: '#67e8f9' }}>
                              {questionPrefix}
                              <span style={{ 
                                color: checked 
                                  ? isCorrect 
                                    ? '#10b981' 
                                    : '#ef4444' 
                                  : 'var(--accent-purple)', 
                                textDecoration: 'underline',
                                fontWeight: 800
                              }}>
                                {checked ? selectedOpt : ' _________ '}
                              </span>
                              {questionSuffix}
                            </div>
                            <div style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ color: 'rgba(255,255,255,0.2)' }}>➔</span>
                              <span style={{ color: answerColor, fontWeight: 800 }}>{aPart}</span>
                            </div>
                          </h2>
                        );
                      }
                      
                      return (
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: '1.5', margin: '0.5rem 0 0 0' }}>
                          {activeQuizQuestion?.quizDialogue.split("______")[0]}
                          <span style={{ 
                            color: checked 
                              ? isCorrect 
                                ? '#10b981' 
                                : '#ef4444' 
                              : 'var(--accent-purple)', 
                            textDecoration: 'underline',
                            fontWeight: 800
                          }}>
                            {checked ? selectedOpt : ' _________ '}
                          </span>
                          {activeQuizQuestion?.quizDialogue.split("______")[1]}
                        </h2>
                      );
                    })()}

                    {showHint && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderLeft: '4px solid var(--accent-purple)',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)'
                      }}>
                        💡 Level Focus: <strong>{activeLevelData?.modal.toUpperCase()}</strong> combined with time expressions.
                      </div>
                    )}
                  </div>

                  {/* Options List */}
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                      🔠 Fill in the Dialogue Blank:
                    </span>
                    <div className="options-grid">
                      {activeQuizQuestion?.options.map((option, idx) => {
                        const isSelected = selectedOpt === option;
                        const isAnswer = option === activeQuizQuestion.answer;
                        
                        let borderStyle = 'var(--card-border)';
                        let bgStyle = 'rgba(255,255,255,0.03)';
                        let colorStyle = 'var(--text-main)';

                        if (checked) {
                          if (isAnswer) {
                            borderStyle = '2px solid #10b981';
                            bgStyle = 'rgba(16, 185, 129, 0.1)';
                            colorStyle = '#10b981';
                          } else if (isSelected) {
                            borderStyle = '2px solid #ef4444';
                            bgStyle = 'rgba(239, 68, 68, 0.1)';
                            colorStyle = '#ef4444';
                          } else {
                            bgStyle = 'rgba(255,255,255,0.01)';
                            colorStyle = 'rgba(255,255,255,0.2)';
                          }
                        } else if (isSelected) {
                          borderStyle = '2px solid var(--accent-purple)';
                          bgStyle = 'rgba(99, 102, 241, 0.08)';
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
                              padding: '1.2rem',
                              borderRadius: 'var(--radius-card)',
                              fontSize: '1.05rem',
                              fontWeight: 700,
                              cursor: checked ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.15s'
                            }}
                            className={!checked ? "hover-lift" : ""}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Check / Continue */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {!checked ? (
                      <button 
                        onClick={handleCheck}
                        disabled={!selectedOpt}
                        style={{
                          background: 'var(--accent-gradient)',
                          border: 'none',
                          color: 'white',
                          padding: '0.9rem',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          borderRadius: 'var(--radius-btn)',
                          cursor: !selectedOpt ? 'not-allowed' : 'pointer',
                          opacity: !selectedOpt ? 0.5 : 1,
                          boxShadow: '0 4px 15px var(--accent-glow)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        Verify Answer ✓
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        
                        {/* Tutor Tip Box */}
                        <div style={{
                          padding: '1.25rem',
                          borderRadius: '16px',
                          background: isCorrect ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)',
                          border: isCorrect ? '1px solid #10b981' : '1px solid #ef4444',
                          color: isCorrect ? '#10b981' : '#ef4444',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {isCorrect ? (
                                <>🎉 Correct Answer!</>
                              ) : (
                                <>
                                  <AlertCircle style={{ width: '20px', height: '20px' }} />
                                  Oops! Incorrect
                                </>
                              )}
                            </span>
                            <button 
                              onClick={speakQuizCompletedSentence}
                              style={{ background: 'none', border: 'none', color: isCorrect ? '#10b981' : '#ef4444', cursor: 'pointer' }}
                              title="Speak completed sentence"
                            >
                              <Volume2 style={{ width: '22px', height: '22px' }} />
                            </button>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.15)', padding: '0.75rem 1rem', borderRadius: '8px', margin: '0.25rem 0 0 0', borderLeft: isCorrect ? '3px solid #10b981' : '3px solid #ef4444', lineHeight: '1.5' }}>
                            💡 <strong>Tutor Tip:</strong> {activeQuizQuestion?.feedback}
                          </p>
                        </div>

                        {/* Continue Button */}
                        <button
                          onClick={handleNextQuestion}
                          style={{
                            background: 'var(--accent-gradient)',
                            border: 'none',
                            color: 'white',
                            padding: '0.9rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-btn)',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px var(--accent-glow)'
                          }}
                        >
                          {currentRound < 4 ? 'Next Question ➡️' : 'Submit Level Quiz 🏁'}
                        </button>
  
                      </div>
                    )}
                  </div>

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
                💬
              </div>
              
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Level {selectedLevel + 1} Cleared!</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '480px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Fantastic job! You completed the Study Decks and successfully checked all 5 Yes/No dialog structures for Level {selectedLevel + 1}. You are mastering the rhythm of conversational responses!
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
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>+{score + 50}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.25rem' }}>XP Earned</div>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>+{Math.round(score/10) + 5}</div>
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

                {selectedLevel < WHAT_YES_OR_NO_LEVELS.length - 1 && (
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
                )}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
