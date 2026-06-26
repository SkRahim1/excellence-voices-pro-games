import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Volume2, 
  ArrowLeft, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  AlertTriangle,
  Flame
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useSpeech } from '../hooks/useSpeech';
import { speakCategories, SpeakCategory, SpeakSentence } from '../data/speakScoreSentences';

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
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
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

// DP-based alignment of target vs spoken words
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
        j--; // Skip extra word spoken
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

interface SpeakScoreProps {
  onBackToDashboard: () => void;
}

export const SpeakScore: React.FC<SpeakScoreProps> = ({ onBackToDashboard }) => {
  const { xp, coins, streak, addXp, addCoins, speakScoreHighScore, setSpeakScoreHighScore, completeGame } = useUserStore();
  const { speak: tutorSpeak, cancel: tutorCancel } = useSpeech();

  // Navigation / View states
  const [selectedCategory, setSelectedCategory] = useState<SpeakCategory | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(-1);

  // Recognition / Recording States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(true);

  // Evaluation States
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [alignedWords, setAlignedWords] = useState<AlignedWord[]>([]);
  const [scores, setScores] = useState<{ accuracy: number; pronunciation: number; fluency: number; overall: number }>({
    accuracy: 0,
    pronunciation: 0,
    fluency: 0,
    overall: 0
  });

  // Rewards earned this round
  const [rewardsEarned, setRewardsEarned] = useState<{ xp: number; coins: number; isNewHighScore: boolean }>({
    xp: 0,
    coins: 0,
    isNewHighScore: false
  });

  // Refs & Timers
  const recognitionRef = useRef<any>(null);
  const recordingDurationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<any>(null);
  const [timerDisplay, setTimerDisplay] = useState<number>(0);

  // Check speech recognition support on mount
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

  const activeSentence: SpeakSentence | null = 
    selectedCategory && currentSentenceIndex >= 0 && currentSentenceIndex < selectedCategory.sentences.length
      ? selectedCategory.sentences[currentSentenceIndex]
      : null;

  // Synthesize sentence for training
  const handleListenTutor = () => {
    if (activeSentence) {
      tutorSpeak(activeSentence.text, 0.85);
    }
  };

  const startRecordingSession = () => {
    tutorCancel();
    setLiveTranscript('');
    setRecognitionError(null);
    setHasEvaluated(false);
    setTimerDisplay(0);
    recordingDurationRef.current = 0;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Tailored for Indian English speakers

      recognition.onstart = () => {
        setIsRecording(true);
        startTimeRef.current = Date.now();
        
        // Start duration timer
        timerIntervalRef.current = setInterval(() => {
          setTimerDisplay(prev => {
            if (prev >= 15) { // 15 seconds max speaking limit
              stopRecordingSession();
              return 15;
            }
            return prev + 1;
          });
        }, 1000);
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
          setRecognitionError('Microphone permission blocked. Please allow mic access in your browser settings.');
        } else if (event.error === 'no-speech') {
          setRecognitionError('No speech was detected. Please try reading aloud again.');
        } else {
          setRecognitionError(`Error: ${event.error}. Please try again.`);
        }
        stopRecordingSession();
      };

      recognition.onend = () => {
        setIsRecording(false);
        clearInterval(timerIntervalRef.current);
        
        // Automatically evaluate when recording stops naturally
        const endTime = Date.now();
        const duration = (endTime - startTimeRef.current) / 1000;
        evaluateSpeech(duration);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setRecognitionError('Failed to start microphone. Please try again.');
      setIsRecording(false);
    }
  };

  const stopRecordingSession = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
    clearInterval(timerIntervalRef.current);
  };

  const evaluateSpeech = (durationSeconds: number) => {
    if (!activeSentence) return;

    // Retrieve transcript
    const userSpokenText = liveTranscript || '';
    if (!userSpokenText.trim()) {
      // If empty transcript and no error was set, set a generic no speech detected
      if (!recognitionError) {
        setRecognitionError('No clear words were recognized. Speak clearly and try again!');
      }
      return;
    }

    // Split into words, cleaning punctuation
    const targetWords = activeSentence.text.split(/\s+/);
    const spokenWords = userSpokenText.split(/\s+/).map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);

    // Compute DP Alignment
    const alignment = alignWords(targetWords, spokenWords);
    setAlignedWords(alignment);

    // 1. Accuracy Score
    const correctCount = alignment.filter(w => w.status === 'correct').length;
    const accuracy = Math.round((correctCount / targetWords.length) * 100);

    // 2. Pronunciation Score
    const averageSimilarity = alignment.reduce((acc, w) => acc + w.similarity, 0) / targetWords.length;
    const pronunciation = Math.round(averageSimilarity * 100);

    // 3. Fluency Score
    // Optimal speech rate: ~130 words per minute (WPM).
    // Ideal time is words * (60 / 130) seconds = words * 0.46
    const idealDuration = targetWords.length * 0.46;
    
    let fluency = 100;
    const minIdeal = Math.max(1.5, idealDuration * 0.7);
    const maxIdeal = idealDuration * 1.5 + 1.5;

    if (durationSeconds > maxIdeal) {
      // Spoken too slowly or with long pauses
      fluency = Math.round(Math.max(50, 100 - ((durationSeconds - maxIdeal) / maxIdeal) * 50));
    } else if (durationSeconds < minIdeal) {
      // Spoken too fast (mumbled)
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

    // XP and Coin Calculations
    let xpGain = 0;
    let coinGain = 0;
    let newHigh = false;

    if (overall >= 70) {
      // Scaled reward based on sentence complexity
      xpGain = activeSentence.xpReward;
      if (overall >= 90) {
        xpGain += 10; // Bonus for exceptional pronunciation!
        coinGain = 3;
      } else if (overall >= 80) {
        coinGain = 2;
      } else {
        coinGain = 1;
      }
    }

    // High Score tracking
    if (overall > speakScoreHighScore) {
      setSpeakScoreHighScore(overall);
      newHigh = true;
    }

    // Update state to render results
    setRewardsEarned({
      xp: xpGain,
      coins: coinGain,
      isNewHighScore: newHigh
    });

    // Credit User Store
    if (xpGain > 0) addXp(xpGain);
    if (coinGain > 0) addCoins(coinGain);

    // If completed a full category or high score is substantial, unlock certificate status
    completeGame('speak-score');

    setHasEvaluated(true);
  };

  const handleNextSentence = () => {
    if (!selectedCategory) return;
    tutorCancel();
    
    if (currentSentenceIndex < selectedCategory.sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
      setHasEvaluated(false);
      setLiveTranscript('');
      setRecognitionError(null);
      setAlignedWords([]);
    } else {
      // Finished all sentences in category
      setSelectedCategory(null);
      setCurrentSentenceIndex(-1);
    }
  };

  const handleTryAgain = () => {
    tutorCancel();
    setHasEvaluated(false);
    setLiveTranscript('');
    setRecognitionError(null);
    setAlignedWords([]);
  };

  const getScoreRating = (score: number) => {
    if (score >= 95) return { title: 'Perfect! 🌟', color: '#10b981' };
    if (score >= 85) return { title: 'Excellent! 🎉', color: '#8b5cf6' };
    if (score >= 70) return { title: 'Good Job! 👍', color: '#06b6d4' };
    return { title: 'Keep Practicing! 💪', color: '#f59e0b' };
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
          onClick={selectedCategory ? () => { setSelectedCategory(null); setCurrentSentenceIndex(-1); } : onBackToDashboard}
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
          {selectedCategory ? 'Back to Categories' : 'Back to Dashboard'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {speakScoreHighScore > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
              🏆 Best: {speakScoreHighScore}%
            </div>
          )}
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
              Your browser does not support voice recognition. Please open this app in <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> to play Speak & Score.
            </p>
          </div>
        </div>
      )}

      {/* VIEW 1: CATEGORY SELECTION */}
      {!selectedCategory && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Speak & Score 🎤
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Choose a category, practice listening, and speak to evaluate your pronunciation!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.25rem'
          }}>
            {speakCategories.map((cat) => (
              <div 
                key={cat.id} 
                className="glass-card hover-lift"
                onClick={() => {
                  if (!hasSpeechSupport) return;
                  setSelectedCategory(cat);
                  setCurrentSentenceIndex(0);
                  setHasEvaluated(false);
                  setAlignedWords([]);
                  setLiveTranscript('');
                }}
                style={{
                  cursor: hasSpeechSupport ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  opacity: hasSpeechSupport ? 1 : 0.6,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: 'var(--accent-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{cat.name}</h3>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: cat.sentences[0].difficulty === 'Easy' ? '#10b981' : cat.sentences[0].difficulty === 'Medium' ? '#06b6d4' : '#ef4444',
                      background: cat.sentences[0].difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.1)' : cat.sentences[0].difficulty === 'Medium' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '50px',
                      textTransform: 'uppercase',
                      marginTop: '0.2rem',
                      display: 'inline-block'
                    }}>
                      {cat.sentences[0].difficulty}
                    </span>
                  </div>
                </div>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1 }}>
                  {cat.description}
                </p>

                <div style={{
                  borderTop: '1px solid var(--border-divider)',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600
                }}>
                  <span>📄 {cat.sentences.length} Sentences</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>Play Now →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: GAME ROOM */}
      {selectedCategory && activeSentence && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Progress Header */}
          <div className="glass-card" style={{
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                {selectedCategory.name}
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.1rem' }}>
                Practice Room
              </h3>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Sentence {currentSentenceIndex + 1} of {selectedCategory.sentences.length}
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
                  width: `${((currentSentenceIndex + 1) / selectedCategory.sentences.length) * 100}%`,
                  height: '100%',
                  background: 'var(--accent-gradient)'
                }} />
              </div>
            </div>
          </div>

          {/* Active Sentence Card */}
          <div className="glass-card animate-pulse-slow" style={{
            padding: '2.5rem 2rem',
            borderRadius: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
            minHeight: '260px',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {/* Target Sentence Display */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                📖 Read this sentence:
              </span>

              {!hasEvaluated ? (
                <h1 style={{
                  fontSize: '2.1rem',
                  fontWeight: 800,
                  lineHeight: 1.35,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-main)',
                  maxWidth: '700px',
                  margin: '0 auto'
                }}>
                  {activeSentence.text}
                </h1>
              ) : (
                /* Color Highlighted Evaluated Word Structure */
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '0.35rem 0.5rem',
                  maxWidth: '700px',
                  margin: '0 auto'
                }}>
                  {alignedWords.map((item, idx) => {
                    const isCorrect = item.status === 'correct';
                    const isMispronounced = item.status === 'mispronounced';
                    
                    return (
                      <span
                        key={idx}
                        style={{
                          fontSize: '2.1rem',
                          fontWeight: 800,
                          lineHeight: 1.35,
                          color: isCorrect ? '#10b981' : isMispronounced ? '#f59e0b' : '#ef4444',
                          borderBottom: isMispronounced ? '3px dotted #f59e0b' : 'none',
                          cursor: isMispronounced ? 'help' : 'default',
                          position: 'relative'
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

            {/* Audio Synthesis & Visualizers */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={handleListenTutor}
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
                  transition: 'all 0.2s'
                }}
                className="hover-lift"
              >
                <Volume2 style={{ width: '16px', height: '16px' }} />
                Listen Tutor 🔊
              </button>
            </div>
          </div>

          {/* Interactive Mic / Control Area */}
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
              {/* Mic Button and Waves */}
              <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
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
                  onClick={isRecording ? stopRecordingSession : startRecordingSession}
                  style={{
                    width: '80px',
                    height: '80px',
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
                  {isRecording ? (
                    <Square style={{ width: '28px', height: '28px', fill: 'white' }} />
                  ) : (
                    <Mic style={{ width: '32px', height: '32px' }} />
                  )}
                </button>
              </div>

              {/* Status and instruction labels */}
              <div style={{ textAlign: 'center' }}>
                {isRecording ? (
                  <>
                    <h4 style={{ color: '#ef4444', fontWeight: 800, animation: 'pulse 1.2s infinite' }}>
                      Listening...
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Speak now! Timer: {15 - timerDisplay}s remaining
                    </p>
                  </>
                ) : (
                  <>
                    <h4 style={{ fontWeight: 700 }}>
                      Click to Record 🎤
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Read clearly into your microphone exactly as it appears.
                    </p>
                  </>
                )}
              </div>

              {/* Live Transcript / Error feedback */}
              {isRecording && liveTranscript && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: '12px',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  maxWidth: '500px',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  marginTop: '0.5rem'
                }}>
                  "{liveTranscript}"
                </div>
              )}

              {recognitionError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '12px',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.82rem',
                  color: '#ef4444',
                  maxWidth: '550px',
                  textAlign: 'center',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertTriangle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  {recognitionError}
                </div>
              )}
            </div>
          ) : (
            /* EVALUATION / RESULTS PAGE */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Overall Score Banner */}
              <div className="glass-card" style={{
                padding: '2rem',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1rem',
                border: `2px solid ${getScoreRating(scores.overall).color}22`
              }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: `6px solid ${getScoreRating(scores.overall).color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: getScoreRating(scores.overall).color,
                  boxShadow: `0 0 15px ${getScoreRating(scores.overall).color}15`
                }}>
                  {scores.overall}%
                </div>

                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: getScoreRating(scores.overall).color }}>
                    {getScoreRating(scores.overall).title}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    You spoke {alignedWords.filter(w => w.status === 'correct').length} of {alignedWords.length} words correctly.
                  </p>
                </div>

                {/* Rewards widget */}
                {rewardsEarned.xp > 0 && (
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
                    {rewardsEarned.isNewHighScore && (
                      <>
                        <span style={{ width: '1px', height: '12px', background: 'var(--border-divider)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ec4899', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          🏆 NEW HIGH SCORE!
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Three Metrics Progress Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem'
              }}>
                {/* Accuracy metric */}
                <div className="glass-card" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981',
                    fontSize: '1.2rem'
                  }}>
                    ✅
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACCURACY</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{scores.accuracy}%</h3>
                    <div style={{ width: '100%', height: '4px', background: 'var(--progress-bg)', borderRadius: '2px', marginTop: '0.3rem', overflow: 'hidden' }}>
                      <div style={{ width: `${scores.accuracy}%`, height: '100%', background: '#10b981' }} />
                    </div>
                  </div>
                </div>

                {/* Pronunciation metric */}
                <div className="glass-card" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8b5cf6',
                    fontSize: '1.2rem'
                  }}>
                    🎯
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRONUNCIATION</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{scores.pronunciation}%</h3>
                    <div style={{ width: '100%', height: '4px', background: 'var(--progress-bg)', borderRadius: '2px', marginTop: '0.3rem', overflow: 'hidden' }}>
                      <div style={{ width: `${scores.pronunciation}%`, height: '100%', background: '#8b5cf6' }} />
                    </div>
                  </div>
                </div>

                {/* Fluency metric */}
                <div className="glass-card" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(6, 182, 212, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#06b6d4',
                    fontSize: '1.2rem'
                  }}>
                    ⏱️
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>FLUENCY</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{scores.fluency}%</h3>
                    <div style={{ width: '100%', height: '4px', background: 'var(--progress-bg)', borderRadius: '2px', marginTop: '0.3rem', overflow: 'hidden' }}>
                      <div style={{ width: `${scores.fluency}%`, height: '100%', background: '#06b6d4' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Spoken Text Display details */}
              <div className="glass-card" style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                fontSize: '0.9rem'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  Spoken Analysis
                </span>
                <p style={{ color: 'var(--text-muted)' }}>
                  We heard: <strong style={{ color: 'var(--text-main)' }}>"{liveTranscript}"</strong>
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontWeight: 700 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    Correct
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 700 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                    Mispronounced (Hover to check spoken)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontWeight: 700 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                    Missed
                  </span>
                </div>
              </div>

              {/* Play Control Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                width: '100%',
                marginTop: '0.5rem'
              }}>
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
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                  className="hover-lift"
                >
                  <RotateCcw style={{ width: '18px', height: '18px' }} />
                  Try Again
                </button>

                <button
                  onClick={handleNextSentence}
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
                  {currentSentenceIndex < selectedCategory.sentences.length - 1 ? (
                    <>
                      Next Sentence
                      <ArrowRight style={{ width: '18px', height: '18px' }} />
                    </>
                  ) : (
                    <>
                      Finish Category
                      <Check style={{ width: '18px', height: '18px' }} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
