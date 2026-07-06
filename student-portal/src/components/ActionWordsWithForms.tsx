import React, { useState, useEffect, useRef } from 'react';
import { useUserStore } from '../store/userStore';
import { 
  ArrowLeft, 
  Volume2, 
  Mic, 
  Square, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Play, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { ACTION_WORD_LEVELS, ActionWord, ActionWordLevel, getActionWordExamples } from '../data/actionWords';
import { useSpeech } from '../hooks/useSpeech';

// Levenshtein Distance helper for fuzzy pronunciation match
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const d: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }
  return d[m][n];
}

const homophones: Record<string, string[]> = {
  'ate': ['eight', '8', 'at'],
  'read': ['red', 'reds', 'led', 'rid'],
  'write': ['right', 'rite', 'writes'],
  'wrote': ['rote', 'rot', 'road', 'roat'],
  'won': ['one', '1'],
  'come': ['came', 'com'],
  'came': ['come', 'cam'],
  'gone': ['goan', 'gan'],
  'drank': ['drunk', 'drink'],
  'drunk': ['drank', 'drink'],
  'run': ['ran'],
  'ran': ['run'],
  'walked': ['walk', 'walks'],
  'spoke': ['spoken', 'speak'],
  'spoken': ['spoke', 'speak'],
  'done': ['do', 'did'],
  'seen': ['see', 'saw'],
  'knew': ['know', 'new'],
  'known': ['knew', 'know', 'no'],
  'told': ['tell'],
  'heard': ['hear', 'herd'],
  'sung': ['sing', 'sang'],
  'sang': ['sing', 'sung'],
  'slept': ['sleep'],
  'woke': ['wake', 'woken'],
  'woken': ['woke', 'wake'],
  'stood': ['stand'],
  'swam': ['swim', 'swum'],
  'swum': ['swam', 'swim'],
  'flew': ['fly', 'flown'],
  'flown': ['flew', 'fly'],
  'drove': ['drive', 'driven'],
  'driven': ['drove', 'drive'],
  'rode': ['ride', 'ridden'],
  'ridden': ['rode', 'ride'],
  'climbed': ['climb'],
  'learnt': ['learn'],
  'taught': ['teach'],
  'sent': ['send'],
  'peeled': ['peel', 'pill'],
  'sown': ['sow', 'saw'],
  'sewed': ['sew'],
  'sewn': ['sew', 'sewed'],
  'spun': ['spin'],
  'dyed': ['dye', 'died'],
  'lost': ['lose'],
  'spent': ['spend'],
  'lent': ['lend'],
  'bent': ['bend'],
  'kept': ['keep'],
  'sold': ['sell']
};

function isWordMatch(target: string, spoken: string): boolean {
  if (!spoken) return false;
  const t = target.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const s = spoken.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  if (t === s) return true;
  
  if (homophones[t] && homophones[t].includes(s)) return true;

  const distance = levenshteinDistance(t, s);
  const maxLen = Math.max(t.length, s.length);
  const similarity = maxLen > 0 ? 1 - distance / maxLen : 0;
  return similarity >= 0.75;
}

interface ActionWordsWithFormsProps {
  onBackToDashboard: () => void;
}

export const ActionWordsWithForms: React.FC<ActionWordsWithFormsProps> = ({ onBackToDashboard }) => {
  const { 
    addXp, 
    addCoins, 
    completeGame, 
    actionWordsLevelIndex, 
    setActionWordsLevelIndex 
  } = useUserStore();

  const { speak, cancel } = useSpeech();

  // Screen Routing: 'levels' | 'learn' | 'speak' | 'complete'
  const [activeScreen, setActiveScreen] = useState<'levels' | 'learn' | 'speak' | 'complete'>('levels');
  const [selectedLevel, setSelectedLevel] = useState<ActionWordLevel | null>(null);
  
  // Word Progression
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  
  // Speech Challenge State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [slotsChecked, setSlotsChecked] = useState<boolean>(false);
  const [slotsCorrect, setSlotsCorrect] = useState<boolean[]>([false, false, false, false, false]);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Auto scroll to top on screen transitions
  useEffect(() => {
    window.scrollTo(0, 0);
    cancel();
  }, [activeScreen, selectedLevel, currentWordIndex]);

  // Clean up recording and voice on unmount
  useEffect(() => {
    return () => {
      cancel();
      stopRecording();
    };
  }, []);

  const handleSelectLevel = (level: ActionWordLevel) => {
    if (level.levelNumber > actionWordsLevelIndex + 1) return; // Locked
    setSelectedLevel(level);
    setCurrentWordIndex(0);
    setActiveScreen('learn');
  };

  const handleSpeakForms = (word: ActionWord) => {
    cancel();
    speak(`Forms of ${word.base}: ${word.forms.join(', ')}`, 0.9);
  };

  const handleSpeakExample = (sentence: string) => {
    cancel();
    speak(sentence, 0.9);
  };

  const startRecording = () => {
    cancel();
    setLiveTranscript('');
    setRecognitionError(null);
    setSlotsChecked(false);
    setSlotsCorrect([false, false, false, false, false]);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionError('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-IN'; // Optimized for Indian English speakers

      rec.onstart = () => {
        setIsRecording(true);
        // Automatically stop recording after 10 seconds timeout
        timerRef.current = setTimeout(() => {
          stopRecording();
        }, 10000);
      };

      rec.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setLiveTranscript(transcript);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setRecognitionError('Microphone permission blocked. Please allow mic access in your browser settings.');
        } else if (event.error === 'no-speech') {
          setRecognitionError('No speech detected. Please speak clearly into your microphone.');
        } else {
          setRecognitionError('Could not recognize voice. Please try again.');
        }
        stopRecording();
      };

      rec.onend = () => {
        setIsRecording(false);
        clearTimeout(timerRef.current);
        evaluateSpeech();
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error(e);
      setRecognitionError('Failed to start microphone.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
    clearTimeout(timerRef.current);
  };

  const evaluateSpeech = () => {
    if (!selectedLevel) return;
    const activeWord = selectedLevel.words[currentWordIndex];
    const transcript = liveTranscript || '';
    if (!transcript.trim()) {
      if (!recognitionError) {
        setRecognitionError('No words recognized. Try again!');
      }
      return;
    }

    // Split spoken text into lowercase words
    const spokenWords = transcript.toLowerCase().split(/\s+/).filter(Boolean);
    const expectedForms = activeWord.forms;

    // Evaluate each form sequentially (ensuring correct order & completeness)
    let spokenPtr = 0;
    const results = [false, false, false, false, false];

    for (let i = 0; i < 5; i++) {
      const expectedForm = expectedForms[i].toLowerCase().trim();
      const expectedFormWords = expectedForm.split(/\s+/);
      
      let foundContiguousMatch = false;

      // Find contiguous words matching the expected form
      for (let j = spokenPtr; j <= spokenWords.length - expectedFormWords.length; j++) {
        let matchCount = 0;
        for (let k = 0; k < expectedFormWords.length; k++) {
          const targetWord = expectedFormWords[k];
          const spokenWord = spokenWords[j + k];
          if (isWordMatch(targetWord, spokenWord)) {
            matchCount++;
          }
        }
        if (matchCount === expectedFormWords.length) {
          foundContiguousMatch = true;
          spokenPtr = j + expectedFormWords.length; // Advance spoken pointer
          break;
        }
      }
      results[i] = foundContiguousMatch;
    }

    setSlotsCorrect(results);
    setSlotsChecked(true);

    // Award XP based on correct forms spoken
    const correctCount = results.filter(Boolean).length;
    if (correctCount > 0) {
      addXp(correctCount * 3); // 3 XP per correct form spoken
      if (correctCount === 5) {
        addCoins(1); // 1 bonus coin for perfect pronunciation
      }
    }
  };

  const handleNextWord = () => {
    if (currentWordIndex < 9) {
      setCurrentWordIndex(prev => prev + 1);
      setLiveTranscript('');
      setRecognitionError(null);
      setSlotsChecked(false);
      setSlotsCorrect([false, false, false, false, false]);
    } else {
      // Completed all 10 words!
      handleLevelCompletion();
    }
  };

  const handleLevelCompletion = () => {
    if (!selectedLevel) return;
    
    // Unlock next level in Zustand store - only on FIRST-TIME completion
    if (selectedLevel.levelNumber === actionWordsLevelIndex + 1) {
      addXp(50); // Completion rewards
      addCoins(5);
      setActionWordsLevelIndex(selectedLevel.levelNumber);
      if (selectedLevel.levelNumber >= 20) {
        completeGame('action-words');
      }
    }
    setActiveScreen('complete');
  };

  const handleNextLevel = () => {
    if (selectedLevel && selectedLevel.levelNumber < 20) {
      const nextLvl = ACTION_WORD_LEVELS[selectedLevel.levelNumber]; // index is levelNumber
      setSelectedLevel(nextLvl);
      setCurrentWordIndex(0);
      setLiveTranscript('');
      setRecognitionError(null);
      setSlotsChecked(false);
      setSlotsCorrect([false, false, false, false, false]);
      setActiveScreen('learn');
    } else {
      setActiveScreen('levels');
    }
  };

  // Styles
  const purpleGradient = 'linear-gradient(135deg, #a855f7, #6366f1)';
  const purpleGlow = 'rgba(168, 85, 247, 0.2)';

  return (
    <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. LEVEL SELECTOR MAP SCREEN */}
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
            <div style={{ fontSize: '1.1rem', color: '#a855f7', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>🗣️</span> VERB CONJUGATION MAP
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
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 60%)',
              pointerEvents: 'none'
            }} />
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 800, 
              marginBottom: '0.5rem',
              background: purpleGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Action Words & Forms 🗣️
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
              Master the five critical verb forms (V1, V2, V3, Continuous, Future) of 200 common action words. Study the grammar rules, listen to oral examples, and speak all five forms to clear levels!
            </p>
          </div>

          {/* 20 Levels Grid Map */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {ACTION_WORD_LEVELS.map((level, idx) => {
              const isCompleted = level.levelNumber <= actionWordsLevelIndex;
              const isActive = level.levelNumber === actionWordsLevelIndex + 1;
              const isLocked = level.levelNumber > actionWordsLevelIndex + 1;

              let cardBg = 'rgba(255, 255, 255, 0.03)';
              let borderStyle = 'var(--card-border)';
              let titleColor = 'var(--text-main)';

              if (isActive) {
                cardBg = 'rgba(168, 85, 247, 0.08)';
                borderStyle = '2px solid #a855f7';
                titleColor = '#a855f7';
              } else if (isCompleted) {
                cardBg = 'rgba(16, 185, 129, 0.04)';
                borderStyle = '1px solid rgba(16, 185, 129, 0.25)';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectLevel(level)}
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
                    boxShadow: isActive ? `0 0 15px ${purpleGlow}` : 'none'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: titleColor }}>
                        Level {level.levelNumber}
                      </span>
                      {isCompleted && <CheckCircle style={{ width: '18px', height: '18px', color: '#10b981' }} />}
                      {isActive && <Play style={{ width: '16px', height: '16px', color: '#a855f7', fill: 'currentColor' }} />}
                      {isLocked && <Lock style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />}
                    </div>
                    
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.4rem 0', color: 'var(--text-main)' }}>
                      {level.title}
                    </h5>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      Master forms of: {level.words.slice(0, 3).map(w => w.base).join(', ')}...
                    </p>
                  </div>

                  <div style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: isCompleted ? '#10b981' : isActive ? '#a855f7' : 'var(--text-muted)',
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
      )}

      {/* 2. LEARN PHASE (STUDY CARDS) SCREEN */}
      {activeScreen === 'learn' && selectedLevel && (
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
              Exit Level
            </button>

            <span style={{
              background: purpleGradient,
              color: 'white',
              padding: '0.35rem 0.75rem',
              borderRadius: '50px',
              fontSize: '0.8rem',
              fontWeight: 800,
              boxShadow: `0 0 10px ${purpleGlow}`
            }}>
              LEVEL {selectedLevel.levelNumber} - LEARN FORMULAS
            </span>

            <span className="glass-card" style={{ padding: '0.35rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
              Word {currentWordIndex + 1} of 10
            </span>
          </div>

          {/* Main Study Card */}
          {(() => {
            const wordObj = selectedLevel.words[currentWordIndex];
            const examples = getActionWordExamples(wordObj);
            const headers = ["Base (V1)", "Past (V2)", "Past Participle (V3)", "Continuous (V4)", "Future (V5)"];

            return (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem', position: 'relative' }}>
                
                {/* Word Banner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-divider)', paddingBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action Word</span>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'capitalize', color: '#fff' }}>
                      {wordObj.base}
                    </h2>
                  </div>
                  <button 
                    onClick={() => handleSpeakForms(wordObj)}
                    style={{
                      background: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.25)',
                      color: '#a855f7',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Listen to all forms"
                    className="hover-lift"
                  >
                    <Volume2 style={{ width: '20px', height: '20px' }} />
                  </button>
                </div>

                {/* Forms grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                  {wordObj.forms.map((form, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.05)', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        textAlign: 'center' 
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        {headers[idx]}
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'capitalize' }}>
                        {form}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Examples deck */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>Oral Context Sentences:</h4>
                  
                  {examples.map((ex, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.01)', 
                        borderLeft: '4px solid #a855f7', 
                        padding: '0.75rem 1rem', 
                        borderRadius: '4px',
                        fontSize: '0.9rem' 
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 800 }}>V{idx + 1}</span>
                        <span>{ex}</span>
                      </div>
                      <button 
                        onClick={() => handleSpeakExample(ex)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                        title="Listen sentence"
                      >
                        <Volume2 style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Study Navigation Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-divider)' }}>
                  <button
                    disabled={currentWordIndex === 0}
                    onClick={() => setCurrentWordIndex(p => p - 1)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: 'var(--card-border)',
                      color: 'var(--text-main)',
                      padding: '0.55rem 1.25rem',
                      borderRadius: 'var(--radius-btn)',
                      cursor: currentWordIndex === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      opacity: currentWordIndex === 0 ? 0.3 : 1
                    }}
                  >
                    <ChevronLeft style={{ width: '18px', height: '18px' }} />
                    Back
                  </button>

                  {currentWordIndex < 9 ? (
                    <button
                      onClick={() => setCurrentWordIndex(p => p + 1)}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: 'var(--card-border)',
                        color: 'var(--text-main)',
                        padding: '0.55rem 1.25rem',
                        borderRadius: 'var(--radius-btn)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      className="hover-lift"
                    >
                      Next
                      <ChevronRight style={{ width: '18px', height: '18px' }} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setCurrentWordIndex(0);
                        setActiveScreen('speak');
                      }}
                      style={{
                        background: purpleGradient,
                        color: 'white',
                        border: 'none',
                        padding: '0.55rem 1.5rem',
                        borderRadius: 'var(--radius-btn)',
                        cursor: 'pointer',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: `0 0 10px ${purpleGlow}`
                      }}
                      className="hover-lift"
                    >
                      <Mic style={{ width: '16px', height: '16px' }} />
                      Start Speaking Challenge 🚀
                    </button>
                  )}
                </div>

              </div>
            );
          })()}

        </div>
      )}

      {/* 3. SPEAK CHALLENGE PHASE SCREEN */}
      {activeScreen === 'speak' && selectedLevel && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Progression */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              onClick={() => {
                const confirmQuit = window.confirm("Are you sure you want to exit the challenge? Your progress on this level will be lost.");
                if (confirmQuit) {
                  setActiveScreen('levels');
                }
              }}
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
              Exit Challenge
            </button>

            <span style={{
              background: purpleGradient,
              color: 'white',
              padding: '0.35rem 0.75rem',
              borderRadius: '50px',
              fontSize: '0.8rem',
              fontWeight: 800,
              boxShadow: `0 0 10px ${purpleGlow}`
            }}>
              SPEAKING CHALLENGE
            </span>

            <span className="glass-card" style={{ padding: '0.35rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
              Challenge {currentWordIndex + 1} of 10
            </span>
          </div>

          {/* Active Speaking Panel */}
          {(() => {
            const wordObj = selectedLevel.words[currentWordIndex];
            const headers = ["V1 (Base)", "V2 (Past)", "V3 (Participle)", "V4 (Continuous)", "V5 (Future)"];

            return (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem', alignItems: 'center' }}>
                
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pronunciation Challenge</span>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>
                    Speak all 5 forms of: <strong style={{ color: '#a855f7', textTransform: 'capitalize' }}>{wordObj.base}</strong>
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                    Speak clearly in order: <strong style={{ color: 'var(--text-main)' }}>"{wordObj.forms.join(', ')}"</strong>
                  </p>
                </div>

                {/* 5 Slots indicator */}
                <div style={{ display: 'flex', width: '100%', maxWidth: '500px', gap: '0.5rem', justifyContent: 'center' }}>
                  {wordObj.forms.map((form, idx) => {
                    const isChecked = slotsChecked;
                    const isCorrect = slotsCorrect[idx];
                    
                    let slotBg = 'rgba(255,255,255,0.02)';
                    let slotBorder = '1px solid rgba(255,255,255,0.05)';
                    let slotColor = 'var(--text-muted)';
                    let icon = null;

                    if (isChecked) {
                      if (isCorrect) {
                        slotBg = 'rgba(16, 185, 129, 0.1)';
                        slotBorder = '2px solid #10b981';
                        slotColor = '#10b981';
                        icon = <CheckCircle style={{ width: '14px', height: '14px' }} />;
                      } else {
                        slotBg = 'rgba(239, 68, 68, 0.1)';
                        slotBorder = '2px solid #ef4444';
                        slotColor = '#ef4444';
                        icon = <XCircle style={{ width: '14px', height: '14px' }} />;
                      }
                    }

                    return (
                      <div 
                        key={idx}
                        style={{
                          flex: 1,
                          background: slotBg,
                          border: slotBorder,
                          color: slotColor,
                          padding: '0.75rem 0.5rem',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textAlign: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span style={{ fontSize: '0.62rem', opacity: 0.6 }}>{headers[idx]}</span>
                        <span style={{ textTransform: 'capitalize', fontSize: '0.9rem', color: isChecked && isCorrect ? '#10b981' : 'var(--text-main)' }}>{form}</span>
                        {icon}
                      </div>
                    );
                  })}
                </div>

                {/* Recorder Control */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                  <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isRecording && (
                      <>
                        <div style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.2)',
                          animation: 'pulse 1.5s infinite ease-in-out'
                        }} />
                        <div style={{
                          position: 'absolute',
                          width: '125%',
                          height: '125%',
                          borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.1)',
                          animation: 'pulse 1.8s infinite ease-in-out',
                          animationDelay: '0.3s'
                        }} />
                      </>
                    )}

                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: isRecording ? '#ef4444' : purpleGradient,
                        border: 'none',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: isRecording ? '0 0 20px rgba(239, 68, 68, 0.4)' : `0 8px 24px ${purpleGlow}`,
                        zIndex: 2,
                        transition: 'all 0.3s'
                      }}
                      className="hover-lift"
                    >
                      {isRecording ? (
                        <Square style={{ width: '28px', height: '28px', fill: 'white' }} />
                      ) : (
                        <Mic style={{ width: '32px', height: '32px' }} />
                      )}
                    </button>
                  </div>

                  <div style={{ textAlign: 'center', minHeight: '30px' }}>
                    {isRecording ? (
                      <h4 style={{ color: '#ef4444', fontWeight: 800, animation: 'pulse 1.2s infinite', margin: 0 }}>
                        Listening... Say: "{wordObj.forms.join(', ')}"
                      </h4>
                    ) : (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        {slotsChecked ? 'Tap to retry if slots are red.' : 'Tap the microphone to start speaking.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Speech Transcript Output */}
                {liveTranscript && (
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '500px', 
                    padding: '0.85rem 1rem', 
                    background: 'rgba(0,0,0,0.2)', 
                    border: '1px dashed rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.2rem', textTransform: 'uppercase' }}>Spoken Transcript</div>
                    <p style={{ fontStyle: 'italic', margin: 0, color: '#fff', fontWeight: 500 }}>"{liveTranscript}"</p>
                  </div>
                )}

                {/* Error Banner */}
                {recognitionError && (
                  <div className="glass-card" style={{ padding: '0.75rem 1rem', borderColor: 'rgba(239, 68, 68, 0.25)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: '0.82rem', borderRadius: '10px' }}>
                    ⚠️ {recognitionError}
                  </div>
                )}

                {/* Action Controls */}
                {slotsChecked && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '350px' }}>
                    <div style={{
                      textAlign: 'center',
                      fontSize: '0.92rem',
                      color: slotsCorrect.filter(Boolean).length === 5 ? '#10b981' : '#ef4444',
                      fontWeight: 800
                    }}>
                      {slotsCorrect.filter(Boolean).length === 5 
                        ? '🌟 Perfect! Correct order and pronunciation.'
                        : `Oops! Spoke ${slotsCorrect.filter(Boolean).length} of 5 correctly. Speak in order.`
                      }
                    </div>

                    <button
                      onClick={handleNextWord}
                      style={{
                        background: slotsCorrect.filter(Boolean).length === 5 ? 'linear-gradient(to right, #10b981, #059669)' : 'var(--accent-gradient)',
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
                        gap: '0.25rem'
                      }}
                      className="hover-lift"
                    >
                      {currentWordIndex < 9 ? 'Next Word ➡️' : 'Complete Level'}
                    </button>
                  </div>
                )}

              </div>
            );
          })()}

        </div>
      )}

      {/* 4. LEVEL CLEARED SCREEN */}
      {activeScreen === 'complete' && selectedLevel && (
        <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3.5rem 2rem',
          gap: '1.5rem',
          minHeight: '380px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '140%',
            height: '140%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ fontSize: '4.5rem', animation: 'bounce 1s infinite' }}>🏆</div>
          
          <div>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 800, 
              background: purpleGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              Level {selectedLevel.levelNumber} Cleared!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '450px', margin: '0 auto', lineHeight: '1.5' }}>
              Magnificent! You successfully analyzed, learned, and spoke all verb forms for the 10 action words in this curriculum.
            </p>
          </div>

          {/* Reward Badges */}
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
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>+50 XP</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completion XP</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>+5</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bonus Coins</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '380px' }}>
            <button 
              onClick={() => setActiveScreen('levels')}
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
            {selectedLevel.levelNumber < 20 ? (
              <button 
                onClick={handleNextLevel}
                style={{
                  flex: 1.5,
                  background: purpleGradient,
                  border: 'none',
                  color: 'white',
                  padding: '0.85rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-btn)',
                  cursor: 'pointer',
                  boxShadow: `0 4px 15px ${purpleGlow}`
                }}
              >
                Next Level ➡️
              </button>
            ) : (
              <button 
                onClick={() => setActiveScreen('levels')}
                style={{
                  flex: 1.5,
                  background: purpleGradient,
                  border: 'none',
                  color: 'white',
                  padding: '0.85rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-btn)',
                  cursor: 'pointer',
                  boxShadow: `0 4px 15px ${purpleGlow}`
                }}
              >
                Clear Map 🎉
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
