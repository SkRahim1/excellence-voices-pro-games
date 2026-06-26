import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  ChevronRight, 
  Lock, 
  Flame, 
  Sparkles,
  Mic,
  Square,
  AlertTriangle,
  Award
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useSpeech } from '../hooks/useSpeech';
import { timeTransformerLevels, TimeTransformerLevel, Challenge } from '../data/timeTransformerData';

// Helper for Levenshtein Distance
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

interface AlignedWord {
  word: string;
  status: 'correct' | 'mispronounced' | 'missed';
  spoken?: string;
  similarity: number;
}

// DP-based alignment
function alignWords(targetWords: string[], spokenWords: string[]): AlignedWord[] {
  const n = targetWords.length;
  const m = spokenWords.length;
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));
  const parent: [number, number][][] = Array(n + 1).fill(0).map(() => Array(m + 1).fill(null));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const wTarget = targetWords[i - 1].toLowerCase().replace(/[^a-z0-9]/g, '');
      const wSpoken = spokenWords[j - 1].toLowerCase().replace(/[^a-z0-9]/g, '');
      let matchScore = 0;
      let type: 'correct' | 'mispronounced' | 'none' = 'none';

      if (wTarget === wSpoken) {
        matchScore = 2;
        type = 'correct';
      } else {
        const dist = levenshteinDistance(wTarget, wSpoken);
        const maxLen = Math.max(wTarget.length, wSpoken.length);
        const sim = maxLen > 0 ? 1 - dist / maxLen : 0;
        if (sim >= 0.55) {
          matchScore = 1;
          type = 'mispronounced';
        }
      }

      const scoreMatch = dp[i - 1][j - 1] + matchScore;
      const scoreSkipTarget = dp[i - 1][j];
      const scoreSkipSpoken = dp[i][j - 1];

      if (scoreMatch >= scoreSkipTarget && scoreMatch >= scoreSkipSpoken && type !== 'none') {
        dp[i][j] = scoreMatch;
        parent[i][j] = [i - 1, j - 1];
      } else if (scoreSkipTarget >= scoreSkipSpoken) {
        dp[i][j] = scoreSkipTarget;
        parent[i][j] = [i - 1, j];
      } else {
        dp[i][j] = scoreSkipSpoken;
        parent[i][j] = [i, j - 1];
      }
    }
  }

  let i = n;
  let j = m;
  const result: AlignedWord[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const p = parent[i][j];
      if (p && p[0] === i - 1 && p[1] === j - 1) {
        const wTarget = targetWords[i - 1].toLowerCase().replace(/[^a-z0-9]/g, '');
        const wSpoken = spokenWords[j - 1].toLowerCase().replace(/[^a-z0-9]/g, '');
        const isExact = wTarget === wSpoken;
        const dist = levenshteinDistance(wTarget, wSpoken);
        const maxLen = Math.max(wTarget.length, wSpoken.length);
        const similarity = isExact ? 1.0 : (maxLen > 0 ? 1 - dist / maxLen : 0);
        
        result.push({
          word: targetWords[i - 1],
          status: isExact ? 'correct' : 'mispronounced',
          spoken: spokenWords[j - 1],
          similarity
        });
        i--;
        j--;
      } else if (p && p[0] === i - 1 && p[1] === j) {
        result.push({
          word: targetWords[i - 1],
          status: 'missed',
          similarity: 0
        });
        i--;
      } else {
        j--;
      }
    } else if (i > 0) {
      result.push({
        word: targetWords[i - 1],
        status: 'missed',
        similarity: 0
      });
      i--;
    } else {
      j--;
    }
  }

  return result.reverse();
}

interface TimeTransformerProps {
  onBackToDashboard: () => void;
}

export const TimeTransformer: React.FC<TimeTransformerProps> = ({ onBackToDashboard }) => {
  const { 
    xp, 
    coins, 
    streak, 
    addXp, 
    addCoins, 
    timeTransformerLevelIndex, 
    setTimeTransformerLevelIndex, 
    completeGame 
  } = useUserStore();
  const { speak: tutorSpeak, cancel: tutorCancel } = useSpeech();

  // Screen routing states: 'levels' | 'explain' | 'game' | 'complete'
  const [activeScreen, setActiveScreen] = useState<'levels' | 'explain' | 'game' | 'complete'>('levels');
  const [selectedLevel, setSelectedLevel] = useState<TimeTransformerLevel | null>(null);

  // Play Phase States
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(true);

  // Evaluation States
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [alignedWords, setAlignedWords] = useState<AlignedWord[]>([]);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [jumbledWords, setJumbledWords] = useState<string[]>([]);
  const [scores, setScores] = useState<{ accuracy: number; pronunciation: number; fluency: number; overall: number }>({
    accuracy: 0,
    pronunciation: 0,
    fluency: 0,
    overall: 0
  });

  // Rewards earned this level
  const [rewardsEarned, setRewardsEarned] = useState<{ xp: number; coins: number; isFirstCompletion: boolean }>({
    xp: 0,
    coins: 0,
    isFirstCompletion: false
  });

  // Refs & Timers
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<any>(null);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecordingSession();
      tutorCancel();
    };
  }, [tutorCancel]);

  // Cancel voice on transitions
  useEffect(() => {
    tutorCancel();
  }, [activeScreen, challengeIndex, tutorCancel]);

  const activeChallenge: Challenge | null = 
    selectedLevel && challengeIndex >= 0 && challengeIndex < selectedLevel.challenges.length
      ? selectedLevel.challenges[challengeIndex]
      : null;

  // Helper to get jumbled words
  const generateJumbledWords = (expected: string, timeExpression: string) => {
    let cleanExpected = expected.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    const cleanTimeExpr = timeExpression.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();

    if (cleanExpected.toLowerCase().startsWith(cleanTimeExpr.toLowerCase())) {
      cleanExpected = cleanExpected.substring(cleanTimeExpr.length).trim();
    }

    const words = cleanExpected.split(/\s+/).filter(Boolean);
    return words.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (activeChallenge && selectedLevel) {
      const jumbled = generateJumbledWords(activeChallenge.expected, selectedLevel.timeExpression);
      setJumbledWords(jumbled);
      setAttemptsCount(0);
    }
  }, [activeChallenge, selectedLevel]);

  // Synthesize text for explanation
  const handleSpeakExplanation = () => {
    if (selectedLevel) {
      const text = `Time Expression: ${selectedLevel.timeExpression}. Explanation: ${selectedLevel.explanation}. Examples: ${selectedLevel.examples.join('. ')}`;
      tutorSpeak(text, 0.9);
    }
  };

  // Synthesize expected sentence
  const handleSpeakExpected = () => {
    if (activeChallenge) {
      tutorSpeak(activeChallenge.expected, 0.85);
    }
  };

  const startRecordingSession = () => {
    tutorCancel();
    setLiveTranscript('');
    setRecognitionError(null);
    setHasEvaluated(false);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        startTimeRef.current = Date.now();
        timerIntervalRef.current = setTimeout(() => {
          stopRecordingSession();
        }, 15000);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setLiveTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setRecognitionError('Microphone permission blocked.');
        } else if (event.error === 'no-speech') {
          setRecognitionError('No speech was detected. Speak clearly.');
        } else {
          setRecognitionError('Failed to capture audio.');
        }
        stopRecordingSession();
      };

      recognition.onend = () => {
        setIsRecording(false);
        clearTimeout(timerIntervalRef.current);
        const duration = (Date.now() - startTimeRef.current) / 1000;
        evaluateSpeech(duration);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setRecognitionError('Failed to start recording.');
      setIsRecording(false);
    }
  };

  const stopRecordingSession = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn(err);
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
    clearTimeout(timerIntervalRef.current);
  };

  const evaluateSpeech = (durationSeconds: number) => {
    if (!activeChallenge) return;

    const userSpokenText = liveTranscript || '';
    if (!userSpokenText.trim()) {
      if (!recognitionError) {
        setRecognitionError('No words recognized. Try again!');
      }
      return;
    }

    const targetWords = activeChallenge.expected.split(/\s+/);
    const spokenWords = userSpokenText.split(/\s+/).map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);

    const alignment = alignWords(targetWords, spokenWords);
    setAlignedWords(alignment);

    // 1. Accuracy
    const correctCount = alignment.filter(w => w.status === 'correct').length;
    const accuracy = Math.round((correctCount / targetWords.length) * 100);

    // 2. Pronunciation
    const averageSimilarity = alignment.reduce((acc, w) => acc + w.similarity, 0) / targetWords.length;
    const pronunciation = Math.round(averageSimilarity * 100);

    // 3. Fluency
    const idealDuration = targetWords.length * 0.46;
    let fluency = 100;
    const minIdeal = Math.max(1.5, idealDuration * 0.7);
    const maxIdeal = idealDuration * 1.5 + 1.5;

    if (durationSeconds > maxIdeal) {
      fluency = Math.round(Math.max(50, 100 - ((durationSeconds - maxIdeal) / maxIdeal) * 50));
    } else if (durationSeconds < minIdeal) {
      fluency = Math.round(Math.max(50, 100 - ((minIdeal - durationSeconds) / minIdeal) * 50));
    }

    // 4. Overall Score
    const overall = Math.round((accuracy + pronunciation + fluency) / 3);

    setScores({
      accuracy,
      pronunciation,
      fluency,
      overall
    });

    setHasEvaluated(true);
    if (overall < 80) {
      setAttemptsCount(prev => prev + 1);
    }
  };

  const handleNextChallenge = () => {
    if (!selectedLevel) return;
    tutorCancel();

    if (challengeIndex < selectedLevel.challenges.length - 1) {
      // Go to next challenge
      setChallengeIndex(prev => prev + 1);
      setHasEvaluated(false);
      setLiveTranscript('');
      setRecognitionError(null);
      setAlignedWords([]);
    } else {
      // Level cleared completely
      handleLevelCleared();
    }
  };

  const handleLevelCleared = () => {
    if (!selectedLevel) return;

    let xpGain = 100;
    let coinGain = 3;
    let isFirst = false;

    if (selectedLevel.levelNumber === timeTransformerLevelIndex + 1) {
      setTimeTransformerLevelIndex(selectedLevel.levelNumber);
      isFirst = true;
    }

    setRewardsEarned({
      xp: xpGain,
      coins: coinGain,
      isFirstCompletion: isFirst
    });

    addXp(xpGain);
    addCoins(coinGain);
    completeGame('time-transformer');
    setActiveScreen('complete');
  };

  const handleTryAgain = () => {
    tutorCancel();
    setHasEvaluated(false);
    setLiveTranscript('');
    setRecognitionError(null);
    setAlignedWords([]);
  };

  const handleSelectLevel = (level: TimeTransformerLevel) => {
    tutorCancel();
    setSelectedLevel(level);
    setChallengeIndex(0);
    setHasEvaluated(false);
    setLiveTranscript('');
    setRecognitionError(null);
    setAlignedWords([]);
    setActiveScreen('explain');
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
      {/* Game Header */}
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
                    const confirmExit = window.confirm("Progress in this level will be lost. Quit?");
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
            🔮 Level: {Math.min(11, timeTransformerLevelIndex + 1)} / 11
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

      {!hasSpeechSupport && (
        <div className="glass-card" style={{
          background: 'rgba(239, 68, 68, 0.08)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          padding: '1.25rem'
        }}>
          <AlertTriangle style={{ width: '28px', height: '28px', color: '#ef4444', flexShrink: 0 }} />
          <div>
            <h4 style={{ color: '#ef4444', fontWeight: 700 }}>Speech Recognition Not Supported</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Open in <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> to play.
            </p>
          </div>
        </div>
      )}

      {/* SCREEN 1: LEVEL SELECTOR */}
      {activeScreen === 'levels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Time Expression Transformer 🔮
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Transform sentence structures by matching verb tenses to time expressions! Complete 11 levels to unlock your Difficult Level Certificate.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            {timeTransformerLevels.map((lvl) => {
              const isUnlocked = lvl.levelNumber <= timeTransformerLevelIndex + 1;
              const isCompleted = lvl.levelNumber <= timeTransformerLevelIndex;

              return (
                <div 
                  key={lvl.levelNumber}
                  className={`glass-card ${isUnlocked ? 'hover-lift' : ''}`}
                  onClick={() => isUnlocked && handleSelectLevel(lvl)}
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
                      {lvl.timeExpression}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      🎙️ 2 Challenges
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
                          {isCompleted ? 'Review' : 'Play'} <ChevronRight style={{ width: '14px', height: '14px' }} />
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
          <div className="glass-card" style={{
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                Level {selectedLevel.levelNumber} Time Expression
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {selectedLevel.timeExpression}
              </h3>
            </div>
          </div>

          <div className="glass-card animate-pulse-slow" style={{
            padding: '2.5rem 2rem',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            minHeight: '260px',
            justifyContent: 'center',
            border: '2px solid rgba(139, 92, 246, 0.15)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                LEARN METHODOLOGY
              </span>
              <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {selectedLevel.explanation}
              </p>
            </div>

            <div style={{
              background: 'var(--btn-bg-ghost)',
              padding: '1.25rem 1.5rem',
              borderRadius: '16px',
              border: '1px solid var(--border-divider)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                CORRECT USAGE EXAMPLES
              </span>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem', color: 'var(--text-main)', textAlign: 'left' }}>
                {selectedLevel.examples.map((ex, idx) => (
                  <li key={idx}>"{ex}"</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleSpeakExplanation}
                style={{
                  background: 'rgba(139, 92, 246, 0.12)',
                  border: '1px solid var(--accent-purple)',
                  color: 'var(--accent-purple)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
                className="hover-lift"
              >
                <Volume2 style={{ width: '16px', height: '16px' }} />
                Listen Lesson 🔊
              </button>
            </div>
          </div>

          <button
            onClick={() => setActiveScreen('game')}
            style={{
              width: '100%',
              background: 'var(--accent-gradient)',
              border: 'none',
              color: 'white',
              padding: '0.9rem',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px var(--accent-glow)'
            }}
            className="hover-lift"
          >
            Start Challenges ⚡
            <ChevronRight style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      )}

      {/* SCREEN 3: CHALLENGE PHASE */}
      {activeScreen === 'game' && selectedLevel && activeChallenge && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Progress Banner */}
          <div className="glass-card" style={{
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                LEVEL {selectedLevel.levelNumber}: {selectedLevel.timeExpression}
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Challenge {challengeIndex + 1} of 2
              </h3>
            </div>
            
            <div style={{
              width: '80px',
              height: '6px',
              background: 'var(--progress-bg)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((challengeIndex + 1) / 2) * 100}%`,
                height: '100%',
                background: 'var(--accent-gradient)'
              }} />
            </div>
          </div>

          {/* Transformation Prompt Cards */}
          <div className="glass-card" style={{
            padding: '2rem 1.5rem',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            border: '1px solid var(--border-divider)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {selectedLevel.levelNumber === 1 ? (
                <div style={{ background: 'var(--btn-bg-ghost)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-divider)', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Guide Sentence (Read Aloud)
                  </span>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
                    "{activeChallenge.expected}"
                  </strong>
                </div>
              ) : (
                <>
                  <div style={{ background: 'var(--btn-bg-ghost)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-divider)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                      Original Sentence
                    </span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)', display: 'block' }}>
                      "{activeChallenge.sentence}"
                    </strong>
                  </div>
                  <div style={{ background: 'var(--btn-bg-ghost)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-divider)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                      Target Time Expression
                    </span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', display: 'block' }}>
                      {selectedLevel.timeExpression}
                    </strong>
                  </div>
                  <div style={{ background: 'var(--btn-bg-ghost)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-divider)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Jumbled Words (Rearrange in your head)
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {jumbledWords.map((word, idx) => (
                        <span 
                          key={idx} 
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-divider)',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: 'var(--text-main)'
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{
              textAlign: 'center',
              padding: '1.5rem 0 0.5rem 0',
              borderTop: '1px dashed var(--border-divider)'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                🎙️ Speak your transformed sentence:
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {selectedLevel.levelNumber === 1
                  ? 'Read the guide sentence aloud clearly.'
                  : 'Transform the original sentence using the target time expression at the start and speak the correct sentence.'}
              </p>

              {hasEvaluated && (
                /* Evaluated Word alignments */
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '0.35rem 0.5rem',
                  maxWidth: '700px',
                  margin: '0 auto',
                  padding: '1rem 0'
                }}>
                  {alignedWords.map((item, idx) => {
                    const isCorrect = item.status === 'correct';
                    const isMispronounced = item.status === 'mispronounced';
                    return (
                      <span
                        key={idx}
                        style={{
                          fontSize: '1.8rem',
                          fontWeight: 800,
                          color: isCorrect ? '#10b981' : isMispronounced ? '#f59e0b' : '#ef4444',
                          borderBottom: isMispronounced ? '3px dotted #f59e0b' : 'none',
                          cursor: isMispronounced ? 'help' : 'default',
                        }}
                        title={isMispronounced ? `Spoke: "${item.spoken || ''}"` : undefined}
                      >
                        {item.word}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Controls and Speech Recognition */}
          {!hasEvaluated ? (
            <div className="glass-card" style={{
              padding: '2rem',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem'
            }}>
              {/* Voice record button */}
              <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isRecording && (
                  <>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', animation: 'pulse 1.5s infinite ease-in-out' }} />
                    <div style={{ position: 'absolute', width: '125%', height: '125%', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', animation: 'pulse 1.8s infinite ease-in-out', animationDelay: '0.3s' }} />
                  </>
                )}
                <button
                  onClick={isRecording ? stopRecordingSession : startRecordingSession}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: isRecording ? '#ef4444' : 'var(--accent-gradient)',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isRecording ? '0 0 20px rgba(239, 68, 68, 0.4)' : '0 8px 24px rgba(6, 182, 212, 0.3)',
                    zIndex: 2,
                    transition: 'all 0.3s'
                  }}
                  className="hover-lift"
                >
                  {isRecording ? <Square style={{ width: '24px', height: '24px', fill: 'white' }} /> : <Mic style={{ width: '28px', height: '28px' }} />}
                </button>
              </div>

              <div style={{ textAlign: 'center' }}>
                {isRecording ? (
                  <>
                    <h4 style={{ color: '#ef4444', fontWeight: 800 }}>Listening...</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Speak transformed answer (15s limit)</p>
                  </>
                ) : (
                  <>
                    <h4 style={{ fontWeight: 700 }}>Click Mic to Answer 🎙️</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Speak the sentence starting with the Time Expression</p>
                  </>
                )}
              </div>

              {isRecording && liveTranscript && (
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-divider)', borderRadius: '12px', padding: '0.75rem 1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  "{liveTranscript}"
                </div>
              )}

              {recognitionError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '0.75rem 1.25rem', fontSize: '0.82rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle style={{ width: '16px', height: '16px' }} />
                  {recognitionError}
                </div>
              )}
            </div>
          ) : (
            /* Result Evaluation View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card" style={{
                padding: '1.75rem',
                borderRadius: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ background: 'var(--btn-bg-ghost)', padding: '0.75rem', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACCURACY</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{scores.accuracy}%</h3>
                </div>
                <div style={{ background: 'var(--btn-bg-ghost)', padding: '0.75rem', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRONUNCIATION</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8b5cf6' }}>{scores.pronunciation}%</h3>
                </div>
                <div style={{ background: 'var(--btn-bg-ghost)', padding: '0.75rem', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>FLUENCY</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#06b6d4' }}>{scores.fluency}%</h3>
                </div>
                <div style={{ background: 'var(--btn-bg-ghost)', padding: '0.75rem', borderRadius: '12px', border: `1px solid ${scores.overall >= 80 ? '#10b981' : '#ef4444'}55` }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>OVERALL</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: scores.overall >= 80 ? '#10b981' : '#ef4444' }}>{scores.overall}%</h3>
                </div>
              </div>

              {/* Feedback guidelines */}
              <div className="glass-card" style={{ padding: '1rem 1.5rem', borderRadius: '16px', fontSize: '0.85rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>
                  We heard: <strong style={{ color: 'var(--text-main)' }}>"{liveTranscript}"</strong>
                </p>
                {scores.overall < 80 && (
                  <p style={{ color: '#ef4444', fontWeight: 700, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    ⚠️ Need 80% overall score to pass challenge. Click Try Again.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleTryAgain}
                  style={{
                    flex: 1,
                    background: 'var(--btn-bg-ghost)',
                    border: '1px solid var(--border-divider)',
                    color: 'var(--text-main)',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                  className="hover-lift"
                >
                  Try Again
                </button>

                <button
                  onClick={handleSpeakExpected}
                  style={{
                    flex: 1,
                    background: 'rgba(6, 182, 212, 0.12)',
                    border: '1px solid var(--accent-cyan)',
                    color: 'var(--accent-cyan)',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                  className="hover-lift"
                >
                  Listen Answer 🔊
                </button>

                {(scores.overall >= 80 || attemptsCount >= 2) && (
                  <button
                    onClick={handleNextChallenge}
                    style={{
                      flex: 1.5,
                      background: 'var(--accent-gradient)',
                      border: 'none',
                      color: 'white',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem'
                    }}
                    className="hover-lift"
                  >
                    {attemptsCount >= 2 && scores.overall < 80 ? 'Continue Anyway' : 'Continue'}
                    <ChevronRight style={{ width: '18px', height: '18px' }} />
                  </button>
                )}
              </div>
            </div>
          )}
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
            gap: '1.25rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              fontSize: '2.5rem'
            }}>
              🏆
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
                Level Completed! 🎉
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                You successfully transformed all challenges for: <strong>{selectedLevel.timeExpression}</strong>!
              </p>
            </div>

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
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Sparkles style={{ width: '14px', height: '14px' }} />
                    LEVEL UNLOCKED!
                  </span>
                </>
              )}
            </div>

            {selectedLevel.levelNumber === 11 && (
              <div className="glass-card animate-pulse-slow" style={{
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '16px',
                padding: '1.25rem',
                marginTop: '1rem',
                maxWidth: '500px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <Award style={{ width: '48px', height: '48px', color: '#8b5cf6', flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ color: '#8b5cf6', fontWeight: 800, fontSize: '0.95rem' }}>Difficult Certificate Unlocked! 🎓</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                    Amazing! You have successfully completed all 11 levels. Go back to the dashboard to claim your official Time Expression Transformer Certificate!
                  </p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              width: '100%',
              maxWidth: '450px',
              marginTop: '1.25rem'
            }}>
              <button
                onClick={() => {
                  setChallengeIndex(0);
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
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="hover-lift"
              >
                Replay Level
              </button>

              {selectedLevel.levelNumber < 11 ? (
                <button
                  onClick={() => {
                    const next = timeTransformerLevels.find(l => l.levelNumber === selectedLevel.levelNumber + 1);
                    if (next) {
                      setSelectedLevel(next);
                      setChallengeIndex(0);
                      setHasEvaluated(false);
                      setAlignedWords([]);
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
