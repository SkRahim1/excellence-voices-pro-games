import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { 
  ArrowLeft, 
  Volume2, 
  CheckCircle, 
  Lock, 
  Play, 
  BookOpen, 
  Award,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { PARTS_OF_SPEECH_DATA, MASTER_CHALLENGE_QUESTIONS, PartOfSpeechModule, Question } from '../data/partsOfSpeechData';
import { useSpeech } from '../hooks/useSpeech';

interface PartsOfSpeechProps {
  onBackToDashboard: () => void;
}

export const PartsOfSpeech: React.FC<PartsOfSpeechProps> = ({ onBackToDashboard }) => {
  const { 
    addXp, 
    addCoins, 
    completeGame, 
    partsOfSpeechLevelIndex, 
    setPartsOfSpeechLevelIndex 
  } = useUserStore();

  const { speak, cancel } = useSpeech();

  // Screen routing states: 'levels' | 'learn' | 'play' | 'master_challenge' | 'complete'
  const [activeScreen, setActiveScreen] = useState<'levels' | 'learn' | 'play' | 'master_challenge' | 'complete'>('levels');
  const [selectedModule, setSelectedModule] = useState<PartOfSpeechModule | null>(null);
  
  // Game Play States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // Completion summary rewards
  const [rewardsEarned, setRewardsEarned] = useState<{ xp: number; coins: number; isFirstCompletion: boolean }>({
    xp: 0,
    coins: 0,
    isFirstCompletion: false
  });

  // Auto scroll to top on transitions
  useEffect(() => {
    window.scrollTo(0, 0);
    cancel();
  }, [activeScreen, selectedModule, currentQuestionIndex]);

  // Shuffles options when question changes
  useEffect(() => {
    let activeQuestion: Question | null = null;
    if (activeScreen === 'play' && selectedModule) {
      activeQuestion = selectedModule.questions[currentQuestionIndex];
    } else if (activeScreen === 'master_challenge') {
      activeQuestion = MASTER_CHALLENGE_QUESTIONS[currentQuestionIndex];
    }

    if (activeQuestion) {
      const opts = [...activeQuestion.options];
      setShuffledOptions(opts.sort(() => Math.random() - 0.5));
    }
  }, [activeScreen, selectedModule, currentQuestionIndex]);

  const handleSelectModule = (mod: PartOfSpeechModule, idx: number) => {
    if (idx > partsOfSpeechLevelIndex) return; // Locked
    setSelectedModule(mod);
    setActiveScreen('learn');
  };

  const handleSpeakLesson = () => {
    if (!selectedModule) return;
    cancel();
    const lesson = selectedModule.lesson;
    const text = `Lesson: ${selectedModule.name}. Definition: ${lesson.definition}. Examples include: ${lesson.examples.join(', ')}.`;
    speak(text, 0.9);
  };

  const handleSpeakExampleSentence = (sentence: string) => {
    cancel();
    speak(sentence, 0.9);
  };

  const handleAnswerSelect = (option: string, question: Question) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === question.correctAnswer;
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      speak("Correct!", 1.1);
    } else {
      speak("Let's review this.", 1.0);
    }

    // Auto progress to next question after 2 seconds
    setTimeout(() => {
      const totalQuestions = activeScreen === 'play' ? 10 : 20;
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        // Evaluate quiz end
        const finalScore = correctAnswersCount + (isCorrect ? 1 : 0);
        handleQuizEnd(finalScore);
      }
    }, 2000);
  };

  const handleQuizEnd = (finalScore: number) => {
    if (activeScreen === 'play' && selectedModule) {
      const hasPassed = finalScore >= 7; // Must score 7/10 to pass
      let xpGain = 0;
      let coinGain = 0;
      let isFirst = false;

      if (hasPassed) {
        const moduleIdx = PARTS_OF_SPEECH_DATA.findIndex(m => m.id === selectedModule.id);
        if (moduleIdx === partsOfSpeechLevelIndex) {
          // Unlock next module
          setPartsOfSpeechLevelIndex(moduleIdx + 1);
          isFirst = true;
          xpGain = 50;
          coinGain = 5;
        } else {
          // Already completed, just review rewards
          xpGain = 10; 
        }
      }

      setRewardsEarned({
        xp: xpGain,
        coins: coinGain,
        isFirstCompletion: isFirst
      });

      if (xpGain > 0) addXp(xpGain);
      if (coinGain > 0) addCoins(coinGain);

      setActiveScreen('complete');
    } else if (activeScreen === 'master_challenge') {
      const hasPassed = finalScore >= 15; // Must score 15/20 to pass
      let xpGain = 0;
      let coinGain = 0;
      let isFirst = false;

      if (hasPassed) {
        if (partsOfSpeechLevelIndex === 8) {
          setPartsOfSpeechLevelIndex(9); // Completely cleared
          completeGame('parts-of-speech');
          isFirst = true;
          xpGain = 100;
          coinGain = 10;
        } else {
          xpGain = 20;
        }
      }

      setRewardsEarned({
        xp: xpGain,
        coins: coinGain,
        isFirstCompletion: isFirst
      });

      if (xpGain > 0) addXp(xpGain);
      if (coinGain > 0) addCoins(coinGain);

      setActiveScreen('complete');
    }
  };

  const handleStartMasterChallenge = () => {
    if (partsOfSpeechLevelIndex < 8) return; // Locked
    setSelectedModule(null);
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setActiveScreen('master_challenge');
  };

  const startPracticeGame = () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setActiveScreen('play');
  };

  const handleRetry = () => {
    if (selectedModule) {
      startPracticeGame();
    } else {
      handleStartMasterChallenge();
    }
  };

  // Theme Gradients
  const cyanGradient = 'linear-gradient(135deg, #06b6d4, #3b82f6)';
  const cyanGlow = 'rgba(6, 182, 212, 0.15)';

  return (
    <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. LEVELS ROADMAP SCREEN */}
      {activeScreen === 'levels' && (
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
            <div style={{ fontSize: '1.1rem', color: '#06b6d4', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>📝</span> PARTS OF SPEECH ROADMAP
            </div>
          </div>

          {/* Banner */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-20%',
              width: '140%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
              pointerEvents: 'none'
            }} />
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 800, 
              marginBottom: '0.5rem',
              background: cyanGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Parts of Speech Master 📝
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
              Master the eight core categories of English words (Noun through Interjection) and solve interactive quizzes. Clear all 8 modules to unlock the Final Parts of Speech Master Challenge!
            </p>
          </div>

          {/* 8 Modules Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {PARTS_OF_SPEECH_DATA.map((mod, idx) => {
              const isCompleted = idx < partsOfSpeechLevelIndex;
              const isActive = idx === partsOfSpeechLevelIndex;
              const isLocked = idx > partsOfSpeechLevelIndex;

              let cardBg = 'rgba(255, 255, 255, 0.03)';
              let borderStyle = 'var(--card-border)';
              let titleColor = 'var(--text-main)';

              if (isActive) {
                cardBg = 'rgba(6, 182, 212, 0.08)';
                borderStyle = '2px solid #06b6d4';
                titleColor = '#06b6d4';
              } else if (isCompleted) {
                cardBg = 'rgba(16, 185, 129, 0.04)';
                borderStyle = '1px solid rgba(16, 185, 129, 0.25)';
              }

              return (
                <div
                  key={mod.id}
                  onClick={() => handleSelectModule(mod, idx)}
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
                    boxShadow: isActive ? `0 0 15px ${cyanGlow}` : 'none'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: titleColor }}>
                        {idx + 1}. {mod.name.replace(/🏷️|👤|🏃|🎨|⏱️|📍|🔗|💥/g, '')}
                      </span>
                      {isCompleted && <CheckCircle style={{ width: '18px', height: '18px', color: '#10b981' }} />}
                      {isActive && <Play style={{ width: '16px', height: '16px', color: '#06b6d4', fill: 'currentColor' }} />}
                      {isLocked && <Lock style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />}
                    </div>
                    
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      {mod.lesson.definition.substring(0, 85)}...
                    </p>
                  </div>

                  <div style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: isCompleted ? '#10b981' : isActive ? '#06b6d4' : 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {isCompleted ? '✓ Cleared' : isActive ? '⚡ Start Lesson' : '🔒 Locked'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Challenge Node */}
          {(() => {
            const isMasterUnlocked = partsOfSpeechLevelIndex >= 8;
            const isMasterCompleted = partsOfSpeechLevelIndex === 9;
            
            let cardBg = 'rgba(255, 255, 255, 0.02)';
            let borderStyle = '1px dashed var(--border-divider)';
            let titleColor = 'var(--text-muted)';

            if (isMasterUnlocked && !isMasterCompleted) {
              cardBg = 'rgba(168, 85, 247, 0.08)';
              borderStyle = '2px solid #a855f7';
              titleColor = '#a855f7';
            } else if (isMasterCompleted) {
              cardBg = 'rgba(16, 185, 129, 0.04)';
              borderStyle = '2px solid #10b981';
              titleColor = '#10b981';
            }

            return (
              <div 
                className={`glass-card ${isMasterUnlocked ? 'hover-lift' : ''}`}
                onClick={handleStartMasterChallenge}
                style={{
                  background: cardBg,
                  border: borderStyle,
                  padding: '2rem 1.5rem',
                  borderRadius: 'var(--radius-card)',
                  cursor: isMasterUnlocked ? 'pointer' : 'not-allowed',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  opacity: isMasterUnlocked ? 1 : 0.5,
                  transition: 'all 0.2s',
                  marginTop: '1rem',
                  boxShadow: isMasterUnlocked && !isMasterCompleted ? '0 0 20px rgba(168, 85, 247, 0.15)' : 'none'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: isMasterCompleted ? 'rgba(16, 185, 129, 0.1)' : isMasterUnlocked ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: isMasterCompleted ? '#10b981' : isMasterUnlocked ? '#a855f7' : 'var(--text-muted)'
                }}>
                  <Award style={{ width: '32px', height: '32px' }} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: titleColor }}>
                    Parts of Speech Master Challenge 🏆
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '550px', margin: '0 auto', lineHeight: '1.5' }}>
                    Showcase your total mastery! Take a comprehensive 20-question mixed test covering all 8 parts of speech. Score at least 15/20 to earn the Parts of Speech Master title.
                  </p>
                </div>

                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {isMasterCompleted ? '🏆 Mastered' : isMasterUnlocked ? '🔥 Unlocked - Play Now' : '🔒 Clear all 8 modules to unlock'}
                </div>
              </div>
            );
          })()}

        </div>
      )}

      {/* 2. LEARN MODULE SCREEN */}
      {activeScreen === 'learn' && selectedModule && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveScreen('levels')}
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
              Exit to Map
            </button>

            <span style={{
              background: cyanGradient,
              color: 'white',
              padding: '0.35rem 0.75rem',
              borderRadius: '50px',
              fontSize: '0.8rem',
              fontWeight: 800,
              boxShadow: `0 0 10px ${cyanGlow}`
            }}>
              STUDY DECK
            </span>

            <span className="glass-card" style={{ padding: '0.35rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
              Module: {selectedModule.name}
            </span>
          </div>

          {/* Study Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
            
            {/* Word Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-divider)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ fontSize: '2rem' }}>
                  <BookOpen style={{ width: '28px', height: '28px', color: '#06b6d4' }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grammar Focus</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    What is a {selectedModule.name.replace(/🏷️|👤|🏃|🎨|⏱️|📍|🔗|💥/g, '')}?
                  </h2>
                </div>
              </div>
              <button 
                onClick={handleSpeakLesson}
                style={{
                  background: 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  color: '#06b6d4',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Listen Lesson"
                className="hover-lift"
              >
                <Volume2 style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Definition */}
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Definition</span>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>
                {selectedModule.lesson.definition}
              </p>
            </div>

            {/* Examples grid */}
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Examples</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {selectedModule.lesson.examples.map((ex, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                    {ex}
                  </div>
                ))}
              </div>
            </div>

            {/* Sentences */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>Context Sentences</span>
              {selectedModule.lesson.sentences.map((sent, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.01)',
                    borderLeft: '4px solid #06b6d4',
                    padding: '0.75rem 1rem',
                    borderRadius: '4px',
                    fontSize: '0.92rem'
                  }}
                >
                  <span>{sent}</span>
                  <button 
                    onClick={() => handleSpeakExampleSentence(sent)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <Volume2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={startPracticeGame}
              style={{
                width: '100%',
                background: cyanGradient,
                border: 'none',
                color: 'white',
                padding: '0.9rem',
                borderRadius: 'var(--radius-btn)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${cyanGlow}`,
                marginTop: '1rem'
              }}
              className="hover-lift"
            >
              Start Practice Game 🎮
            </button>

          </div>

        </div>
      )}

      {/* 3. PLAY SCREEN (PRACTICE QUIZ) */}
      {(activeScreen === 'play' || activeScreen === 'master_challenge') && (
        (() => {
          const totalQ = activeScreen === 'play' ? 10 : 20;
          const activeQuestion = activeScreen === 'play' && selectedModule 
            ? selectedModule.questions[currentQuestionIndex]
            : MASTER_CHALLENGE_QUESTIONS[currentQuestionIndex];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Header Progress */}
              <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                    {activeScreen === 'play' ? 'PRACTICE QUIZ' : 'MASTER CHALLENGE'}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.1rem 0 0 0' }}>
                    Question {currentQuestionIndex + 1} of {totalQ}
                  </h3>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Score: {correctAnswersCount} / {totalQ}
                  </span>
                  <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '0.3rem' }}>
                    <div style={{
                      width: `${((currentQuestionIndex + 1) / totalQ) * 100}%`,
                      height: '100%',
                      background: activeScreen === 'play' ? cyanGradient : 'linear-gradient(135deg, #a855f7, #6366f1)'
                    }} />
                  </div>
                </div>
              </div>

              {/* Prompt Card */}
              <div className="glass-card" style={{ padding: '2rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '130px', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: activeScreen === 'play' ? '#06b6d4' : '#a855f7', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  <HelpCircle style={{ width: '14px', height: '14px' }} />
                  {activeQuestion.prompt}
                </span>

                {activeQuestion.sentence && (
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    "{activeQuestion.sentence}"
                  </h2>
                )}
              </div>

              {/* Options list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {shuffledOptions.map((opt, idx) => {
                  const isUserSelection = selectedAnswer === opt;
                  const isCorrectAnswer = opt === activeQuestion.correctAnswer;
                  
                  let btnBg = 'rgba(255,255,255,0.03)';
                  let btnBorder = 'var(--card-border)';
                  let btnColor = 'var(--text-main)';

                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      btnBg = 'rgba(16, 185, 129, 0.12)';
                      btnBorder = '2px solid #10b981';
                      btnColor = '#10b981';
                    } else if (isUserSelection) {
                      btnBg = 'rgba(239, 68, 68, 0.12)';
                      btnBorder = '2px solid #ef4444';
                      btnColor = '#ef4444';
                    } else {
                      btnBg = 'rgba(255,255,255,0.01)';
                      btnColor = 'rgba(255,255,255,0.2)';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(opt, activeQuestion)}
                      disabled={isAnswered}
                      style={{
                        width: '100%',
                        background: btnBg,
                        border: btnBorder,
                        color: btnColor,
                        padding: '1rem 1.5rem',
                        borderRadius: '14px',
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        textAlign: 'left',
                        cursor: isAnswered ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                      className={!isAnswered ? 'hover-lift' : ''}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

            </div>
          );
        })()
      )}

      {/* 4. MODULE COMPLETION/FAILURE SCREEN */}
      {activeScreen === 'complete' && (
        (() => {
          const totalQ = selectedModule ? 10 : 20;
          const passingScore = selectedModule ? 7 : 15;
          const isChallenge = !selectedModule;
          const hasCleared = correctAnswersCount >= passingScore;

          return (
            <div className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '3.5rem 2rem',
              gap: '1.5rem',
              minHeight: '380px',
              position: 'relative'
            }}>
              
              <div style={{ fontSize: '4.5rem' }}>
                {hasCleared ? '🏆' : '💪'}
              </div>

              <div>
                <h2 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 800, 
                  color: hasCleared ? '#10b981' : '#ef4444',
                  marginBottom: '0.5rem'
                }}>
                  {hasCleared 
                    ? (isChallenge ? 'Parts of Speech Master! 🌟' : 'Module Cleared! 🎉') 
                    : 'Goal Not Met!'
                  }
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '450px', margin: '0 auto', lineHeight: '1.5' }}>
                  {hasCleared 
                    ? `Brilliant job! You scored ${correctAnswersCount} out of ${totalQ} questions correct.`
                    : `You scored ${correctAnswersCount} out of ${totalQ}. You need at least ${passingScore} correct answers to pass.`
                  }
                </p>
              </div>

              {/* Rewards */}
              {hasCleared && rewardsEarned.xp > 0 && (
                <div style={{
                  display: 'flex',
                  gap: '2rem',
                  margin: '0.5rem 0',
                  padding: '1rem 2.5rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  border: 'var(--card-border)'
                }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>+{rewardsEarned.xp} XP</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completion XP</div>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }} />
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>+{rewardsEarned.coins}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coins</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '380px' }}>
                <button 
                  onClick={() => {
                    setSelectedModule(null);
                    setActiveScreen('levels');
                  }}
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
                
                {!hasCleared && (
                  <button 
                    onClick={handleRetry}
                    style={{
                      flex: 1.5,
                      background: 'var(--accent-gradient)',
                      border: 'none',
                      color: 'white',
                      padding: '0.85rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-btn)',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px var(--accent-glow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <RotateCcw style={{ width: '16px', height: '16px' }} />
                    Retry Quiz
                  </button>
                )}

                {hasCleared && !isChallenge && (
                  <button 
                    onClick={() => {
                      setSelectedModule(null);
                      setActiveScreen('levels');
                    }}
                    style={{
                      flex: 1.5,
                      background: cyanGradient,
                      border: 'none',
                      color: 'white',
                      padding: '0.85rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-btn)',
                      cursor: 'pointer',
                      boxShadow: `0 4px 15px ${cyanGlow}`
                    }}
                  >
                    Next Topic ➡️
                  </button>
                )}
              </div>

            </div>
          );
        })()
      )}

    </div>
  );
};
