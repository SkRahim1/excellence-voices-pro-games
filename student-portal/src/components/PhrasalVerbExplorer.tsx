import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { ArrowLeft, Volume2, HelpCircle, AlertCircle, Lock, CheckCircle, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { PHRASAL_VERBS, PhrasalVerb } from '../data/phrasalVerbs';
import { useSpeech } from '../hooks/useSpeech';

interface PhrasalVerbExplorerProps {
  onBackToDashboard: () => void;
}

export const PhrasalVerbExplorer: React.FC<PhrasalVerbExplorerProps> = ({ onBackToDashboard }) => {
  const { addXp, addCoins, completeGame, phrasalVerbLevelIndex, setPhrasalVerbLevelIndex } = useUserStore();
  const { speak, cancel } = useSpeech();

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
  // Game Flow States (per level session)
  const [currentLevelVerbs, setCurrentLevelVerbs] = useState<PhrasalVerb[]>([]);
  const [showStudyDeck, setShowStudyDeck] = useState(true);
  const [currentStudyCardIndex, setCurrentStudyCardIndex] = useState(0);
  
  // Quiz States
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  // Initialize level verbs when a level is chosen
  useEffect(() => {
    if (selectedLevel !== null) {
      const verbs = PHRASAL_VERBS.slice(selectedLevel * 5, selectedLevel * 5 + 5);
      setCurrentLevelVerbs(verbs);
      
      // Reset state for new level session
      setShowStudyDeck(true);
      setCurrentStudyCardIndex(0);
      setCurrentRound(0);
      setSelectedOpt(null);
      setChecked(false);
      setIsCorrect(false);
      setShowHint(false);
      setScore(0);
      setGameEnded(false);
    }
  }, [selectedLevel]);

  // Scroll to top when switching between level map and active gameplay
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedLevel]);

  const activeVerb = currentLevelVerbs[showStudyDeck ? currentStudyCardIndex : currentRound];

  // Auto-play voice narration for the Study deck cards
  useEffect(() => {
    if (selectedLevel !== null && showStudyDeck && activeVerb && !gameEnded) {
      const textToSpeak = `Phrasal Verb: ${activeVerb.verb}. Meaning: ${activeVerb.meaning}. Example: ${activeVerb.studyExample}`;
      speak(textToSpeak);
    }
  }, [selectedLevel, showStudyDeck, currentStudyCardIndex, speak, gameEnded, activeVerb]);

  // Clean up audio on back button or unmount
  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  const handleLevelSelect = (levelIdx: number) => {
    if (levelIdx > phrasalVerbLevelIndex) return; // Locked
    setSelectedLevel(levelIdx);
  };

  const handleOptionSelect = (option: string) => {
    if (checked) return;
    setSelectedOpt(option);
  };

  const handleCheck = () => {
    if (!selectedOpt || !activeVerb) return;
    const answerCorrect = selectedOpt === activeVerb.answer;
    setIsCorrect(answerCorrect);
    setChecked(true);

    if (answerCorrect) {
      setScore(prev => prev + 20);
      addXp(20);
      addCoins(2);
      
      // Narrate the correct sentence with answer
      const completedSentence = activeVerb.quizDialogue.replace("______", activeVerb.answer);
      speak(completedSentence);
    } else {
      speak("Incorrect. Let's study the tutor tip.");
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
      // Finished level quiz!
      setGameEnded(true);

      // Unlock next level in Zustand store — only on FIRST-TIME completion
      const nextLevel = (selectedLevel ?? 0) + 1;
      if (selectedLevel === phrasalVerbLevelIndex) {
        // Award completion rewards only on first-time completion
        addXp(50);
        addCoins(5);
        setPhrasalVerbLevelIndex(nextLevel);
        if (nextLevel >= 11) {
          completeGame('phrasal-verbs');
        }
      }
      // Replaying a cleared level: no XP/coin reward
    }
  };

  const handleBackToLevels = () => {
    cancel();
    setSelectedLevel(null);
  };

  const speakStudyCard = () => {
    if (!activeVerb) return;
    const textToSpeak = `Phrasal Verb: ${activeVerb.verb}. Meaning: ${activeVerb.meaning}. Example: ${activeVerb.studyExample}`;
    speak(textToSpeak);
  };

  const speakQuizCompletedSentence = () => {
    if (!activeVerb) return;
    const word = checked && isCorrect ? activeVerb.answer : "______";
    const completedSentence = activeVerb.quizDialogue.replace("______", word);
    speak(completedSentence);
  };

  const advanceNextLevel = () => {
    if (selectedLevel !== null && selectedLevel < 10) {
      setSelectedLevel(selectedLevel + 1);
    }
  };

  // Helper to format level verbs string preview
  const getLevelPreview = (levelIdx: number) => {
    const startIdx = levelIdx * 5;
    const verbsSlice = PHRASAL_VERBS.slice(startIdx, startIdx + 5);
    if (verbsSlice.length === 0) return '';
    return verbsSlice.map(v => v.verb).join(', ');
  };

  return (
    <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto' }}>
      
      {/* 1. LEVEL SELECTOR SCREEN */}
      {selectedLevel === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header */}
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
              MAP: 11 PHRASAL VERB LEVELS 🗺️
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Phrasal Verb Explorer Curriculum</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
              Master 55 high-frequency daily communication phrasal verbs. Unlock levels step-by-step, study the flashcards, and clear the grammar quizzes!
            </p>
          </div>

          {/* Levels Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {Array.from({ length: 11 }).map((_, idx) => {
              const isCompleted = idx < phrasalVerbLevelIndex;
              const isActive = idx === phrasalVerbLevelIndex;
              const isLocked = idx > phrasalVerbLevelIndex;

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
                      {isActive && <Play style={{ width: '18px', height: '18px', color: 'var(--accent-cyan)', fill: 'currentColor' }} />}
                      {isLocked && <Lock style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />}
                    </div>
                    
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', fontStyle: 'italic' }}>
                      {getLevelPreview(idx)}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>5 Phrasal Verbs</span>
                    <span style={{ color: isCompleted ? '#10b981' : isActive ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 800 }}>
                      {isCompleted ? 'CLEARED' : isActive ? 'READY' : 'LOCKED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        
        /* 2. GAMEPLAY PORTION (STUDY DECK, QUIZ OR SUMMARY) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header */}
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
              Level {selectedLevel + 1} of 11
            </div>
          </div>

          {!gameEnded ? (
            showStudyDeck ? (
              
              /* A. STUDY DECK FLASHCARD MODE */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Visual progression bar for Study Mode */}
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <div 
                      key={sIdx} 
                      style={{
                        flexGrow: 1,
                        height: '6px',
                        borderRadius: '3px',
                        background: sIdx === currentStudyCardIndex 
                          ? 'var(--accent-cyan)' 
                          : sIdx < currentStudyCardIndex 
                            ? 'rgba(6, 182, 212, 0.4)' 
                            : 'rgba(255, 255, 255, 0.1)',
                        transition: 'background 0.3s'
                      }}
                    />
                  ))}
                </div>

                <div className="glass-card animate-pulse-slow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem 2rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                    📖 Flashcard Study Phase ({currentStudyCardIndex + 1} of 5)
                  </span>
                  
                  <h2 style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '0.02em', margin: '0.5rem 0' }}>
                    {activeVerb?.verb}
                  </h2>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', margin: '0.25rem 0' }} />
                  
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                    <div>
                      <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What it means:</strong>
                      <p style={{ marginTop: '0.25rem', fontSize: '1.1rem', fontWeight: 600 }}>{activeVerb?.meaning}</p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: 'var(--card-border)' }}>
                      <strong style={{ color: '#eab308', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Study Context:</strong>
                      <p style={{ marginTop: '0.25rem', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        🎬 {activeVerb?.studyScenario}
                      </p>
                      
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0.75rem 0' }} />
                      
                      <strong style={{ color: '#34d399', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Example Sentence:</strong>
                      <p style={{ marginTop: '0.25rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.4' }}>
                        ⚡ {activeVerb?.studyExample}
                      </p>
                    </div>
                  </div>

                  {/* Flashcard Action Buttons */}
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
                      Listen Again
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

                    {currentStudyCardIndex < 4 ? (
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
                        Next Verb
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
                
                {/* Round Tracker HUD */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Quiz Progress: Round {currentRound + 1} of 5
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                    XP: +{score}
                  </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Scenario & Sentence Prompt */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                        💬 Scenario: {activeVerb?.quizScenario}
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
                        Meaning
                      </button>
                    </div>

                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, lineHeight: '1.5', margin: '0.5rem 0 0 0' }}>
                      "{activeVerb?.quizDialogue.split("______")[0]}
                      <span style={{ 
                        color: checked 
                          ? isCorrect 
                            ? '#10b981' 
                            : '#ef4444' 
                          : 'var(--accent-cyan)', 
                        textDecoration: 'underline',
                        fontWeight: 800
                      }}>
                        {checked ? selectedOpt : ' _________ '}
                      </span>
                      {activeVerb?.quizDialogue.split("______")[1]}"
                    </h2>

                    {showHint && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderLeft: '4px solid var(--accent-cyan)',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)'
                      }}>
                        💡 Phrasal verb meaning: <strong>{activeVerb?.meaning}</strong>
                      </div>
                    )}
                  </div>

                  {/* Option Selection Grid */}
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                      🔠 Select the correct Phrasal Verb:
                    </span>
                    <div className="options-grid">
                      {activeVerb?.options.map((option, idx) => {
                        const isSelected = selectedOpt === option;
                        const isAnswer = option === activeVerb.answer;
                        
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
                          borderStyle = '2px solid var(--accent-cyan)';
                          bgStyle = 'rgba(6, 182, 212, 0.08)';
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
                        Verify Dialogue ✓
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        
                        {/* Tutor Tip Alert Box */}
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
                            💡 <strong>Tutor Tip:</strong> {activeVerb?.feedback}
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
                          {currentRound < 4 ? 'Next Dialogue ➡️' : 'Submit Level Quiz 🏁'}
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
                🏆
              </div>
              
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Level {selectedLevel + 1} Cleared!</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '480px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Fantastic study effort! You completed the Study phase and checked all 5 quiz dialogues for Level {selectedLevel + 1}. Keeping up with these daily lessons strengthens your spoken English fluency.
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

                {selectedLevel < 10 && (
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
