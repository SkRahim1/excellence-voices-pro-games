import React, { useState, useEffect, useRef } from 'react';
import { useUserStore } from '../store/userStore';
import { ESCAPE_ROOM_CHALLENGES, EscapeRoomChallenge } from '../data/escapeRoomChallenges';
import { ArrowLeft, Key, Star, Timer } from 'lucide-react';

interface EscapeRoomEnglishProps {
  onBackToDashboard: () => void;
}

// Room metadata
const ROOM_META = [
  { id: 1, name: 'Vocabulary Vault', icon: '🔑', desc: 'Search the room to match vocabulary meanings and collect the Golden Key.', keyName: 'Golden Key', color: 'rgba(234, 179, 8, 0.15)', borderColor: 'rgba(234, 179, 8, 0.4)', textColor: '#eab308' },
  { id: 2, name: 'Grammar Gallery', icon: '🛡️', desc: 'Repair grammatical errors and fill in the missing verbs to earn the Silver Key.', keyName: 'Silver Key', color: 'rgba(148, 163, 184, 0.15)', borderColor: 'rgba(148, 163, 184, 0.4)', textColor: '#94a3b8' },
  { id: 3, name: 'Reading Detective Room', icon: '🔎', desc: 'Use reading comprehension clues and solve riddles to acquire the Magic Key.', keyName: 'Magic Key', color: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.4)', textColor: '#a855f7' },
  { id: 4, name: 'Sentence Workshop', icon: '⚙️', desc: 'Unscramble mixed-up syntax blocks to activate the mechanism and claim the Crystal Key.', keyName: 'Crystal Key', color: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.4)', textColor: '#06b6d4' },
  { id: 5, name: 'Mystery Escape Chamber', icon: '🔒', desc: 'Solve the final clues to reveal the 4-digit code. Type it into the keypad to escape!', keyName: 'Escape Trophy', color: 'rgba(244, 63, 94, 0.15)', borderColor: 'rgba(244, 63, 94, 0.4)', textColor: '#f43f5e' },
];

export const EscapeRoomEnglish: React.FC<EscapeRoomEnglishProps> = ({ onBackToDashboard }) => {
  const { grade, addXp, addCoins, escapeRoomHighScore, setEscapeRoomHighScore } = useUserStore();

  // Game States
  // States: 'intro' | 'playing' | 'room-transition' | 'escaped'
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'room-transition' | 'escaped'>('intro');
  const [currentRoom, setCurrentRoom] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [inventory, setInventory] = useState<string[]>([]);
  const [solvedObjects, setSolvedObjects] = useState<string[]>([]); // list of object names completed in the current room
  const [activeChallenge, setActiveChallenge] = useState<EscapeRoomChallenge | null>(null);
  
  // Clue digits discovered in Room 5
  const [discoveredDigits, setDiscoveredDigits] = useState<Record<string, string>>({});

  // Virtual Keypad State for Room 5
  const [keypadInput, setKeypadInput] = useState<string>('');
  const [showKeypad, setShowKeypad] = useState<boolean>(false);
  const [keypadFeedback, setKeypadFeedback] = useState<{ text: string; success: boolean } | null>(null);

  // Statistics
  const [stars, setStars] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Modal and Hints state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showClue, setShowClue] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [hintUsedCount, setHintUsedCount] = useState<number>(0);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);

  // Transition overlay message
  const [transitionMsg, setTransitionMsg] = useState<string>('');

  // Audio Tone Synth
  const audioContextRef = useRef<AudioContext | null>(null);
  const playSound = (freq: number, duration: number, type: 'sine' | 'triangle' | 'sawtooth' = 'sine') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  };

  // Timer hook
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (gameState === 'playing') {
      timerId = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [gameState]);

  // Determine difficulty level string based on student's grade
  const getDifficultyLevel = (): 'beginner' | 'intermediate' | 'advanced' => {
    const numericGrade = parseInt(grade.replace(/\D/g, '')) || 7;
    if (numericGrade <= 4) return 'beginner';
    if (numericGrade <= 8) return 'intermediate';
    return 'advanced';
  };

  const level = getDifficultyLevel();
  const roomMeta = ROOM_META[currentRoom - 1];

  // Get challenges for the current room
  const roomChallenges = ESCAPE_ROOM_CHALLENGES[level].filter(c => c.room === currentRoom);

  // Text-To-Speech (TTS) Narration
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attempt to load Indian English voice
      const voices = window.speechSynthesis.getVoices();
      const inVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN'));
      if (inVoice) {
        utterance.voice = inVoice;
      }
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Trigger TTS automatically when challenge loads (especially Room 3 passages)
  useEffect(() => {
    if (activeChallenge) {
      const speechPrompt = activeChallenge.room === 3
        ? `Detective Wordy says: Read the passage. ${activeChallenge.question}. Options are: ${activeChallenge.options.join(', ')}`
        : `Question: ${activeChallenge.question}`;
      speakText(speechPrompt);
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [activeChallenge]);

  // Object searching click handler
  const handleObjectClick = (challenge: EscapeRoomChallenge) => {
    if (solvedObjects.includes(challenge.hiddenIn)) return;

    // Reset challenge states
    setActiveChallenge(challenge);
    setSelectedOption(null);
    setDisabledOptions([]);
    setShowClue(false);
    setFeedbackMessage(null);
    playSound(440, 0.1, 'sine');
  };

  // Option submission check
  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null || !activeChallenge) return;

    setSelectedOption(idx);
    const isCorrect = idx === activeChallenge.answer;

    if (isCorrect) {
      playSound(523.25, 0.1, 'sine');
      setTimeout(() => playSound(659.25, 0.25, 'sine'), 80);

      setCorrectCount(prev => prev + 1);
      
      // Calculate stars earned (up to 3 per puzzle depending on hints)
      let starBonus = 3;
      if (hintUsedCount === 1) starBonus = 2;
      else if (hintUsedCount >= 2) starBonus = 1;
      setStars(prev => prev + starBonus);

      // Award small immediate XP
      addXp(5);
      addCoins(1);

      // Record room 5 discovery code digit
      if (currentRoom === 5 && activeChallenge.digitClue) {
        setDiscoveredDigits(prev => ({
          ...prev,
          [activeChallenge.hiddenIn]: activeChallenge.digitClue!
        }));
      }

      setFeedbackMessage({
        text: `Superb! You solved the puzzle and secured this object! +${starBonus} ⭐`,
        success: true
      });

      // Mark object as completed
      setTimeout(() => {
        setSolvedObjects(prev => [...prev, activeChallenge.hiddenIn]);
        setActiveChallenge(null);
        setHintUsedCount(0);
      }, 1800);

    } else {
      playSound(220, 0.35, 'sawtooth');
      setWrongCount(prev => prev + 1);
      setFeedbackMessage({
        text: 'Incorrect answer! Detective Wordy suggests reviewing the clue.',
        success: false
      });
    }
  };

  // Clue helper
  const triggerShowClue = () => {
    if (!activeChallenge || showClue) return;
    setShowClue(true);
    setHintUsedCount(prev => prev + 1);
    playSound(350, 0.1, 'sine');
    speakText(`Detective Wordy Hint: ${activeChallenge.clue}`);
  };

  // 50/50 helper
  const triggerFiftyFifty = () => {
    if (!activeChallenge || disabledOptions.length > 0) return;
    const correctIdx = activeChallenge.answer;
    const incorrect = [0, 1, 2, 3].filter(idx => idx !== correctIdx);
    const disabled: number[] = [];
    while (disabled.length < 2) {
      const rand = incorrect[Math.floor(Math.random() * incorrect.length)];
      if (!disabled.includes(rand)) disabled.push(rand);
    }
    setDisabledOptions(disabled);
    setHintUsedCount(prev => prev + 1);
    playSound(350, 0.1, 'sine');
  };

  // Proceeding to the next room sequence
  const handleProceedRoom = () => {
    if (solvedObjects.length < roomChallenges.length) return;

    playSound(587.33, 0.8, 'sine');
    
    // Add current key to inventory
    const keyAcquired = roomMeta.keyName;
    setInventory(prev => [...prev, keyAcquired]);

    // Small bonus reward per room completion
    addXp(20);
    addCoins(2);

    if (currentRoom < 5) {
      setTransitionMsg(`You unlocked the ${roomMeta.name}! Moving to Room ${currentRoom + 1}...`);
      setGameState('room-transition');
      
      setTimeout(() => {
        setCurrentRoom(prev => (prev + 1) as any);
        setSolvedObjects([]);
        setGameState('playing');
      }, 2500);
    } else {
      // Escape Room 5 triggers keypad unlock first
      setShowKeypad(true);
    }
  };

  // Escape keypad submit (Room 5 final lock check)
  const handleKeypadUnlock = () => {
    // Digits: Beginner: 5248, Intermediate: 9317, Advanced: 6195
    const correctCode = level === 'beginner' ? '5248' : level === 'intermediate' ? '9317' : '6195';

    if (keypadInput === correctCode) {
      playSound(783.99, 1.2, 'sine');
      setKeypadFeedback({ text: 'Access Granted! Escape hatch unlocked!', success: true });
      
      setTimeout(() => {
        // Trigger final victory!
        const finalScore = stars * 10 - Math.floor(timeElapsed / 15);
        const activeScore = finalScore > 0 ? finalScore : 50;

        addXp(50);
        addCoins(5);
        setEscapeRoomHighScore(activeScore);

        setGameState('escaped');
        setShowKeypad(false);
      }, 1500);
    } else {
      playSound(220, 0.45, 'sawtooth');
      setKeypadFeedback({ text: 'Access Denied! Incorrect secret code.', success: false });
      setKeypadInput('');
    }
  };

  // Clear or reset match
  const handleRestartGame = () => {
    setGameState('intro');
    setCurrentRoom(1);
    setInventory([]);
    setSolvedObjects([]);
    setActiveChallenge(null);
    setDiscoveredDigits({});
    setKeypadInput('');
    setShowKeypad(false);
    setKeypadFeedback(null);
    setStars(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTimeElapsed(0);
    setHintUsedCount(0);
  };

  // Keypad key input handler
  const handleKeypadPress = (val: string) => {
    if (keypadInput.length >= 4) return;
    setKeypadInput(prev => prev + val);
    playSound(440, 0.05, 'sine');
  };

  const handleKeypadClear = () => {
    setKeypadInput('');
    playSound(350, 0.05, 'sine');
  };

  // ----------------------------------------------------
  // SCREEN 1: INTRO SCREEN
  // ----------------------------------------------------
  if (gameState === 'intro') {
    return (
      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '1rem clamp(0.5rem, 3vw, 1.5rem)' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>🔐</div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 6vw, 1.9rem)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Escape Room English
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Escape the mysterious learning castle by solving English riddles!
          </p>
        </div>

        {/* Detective Wordy Welcomer card */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
          <div style={{ fontSize: '3rem' }}>🕵️‍♂️</div>
          <div>
            <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>Detective Wordy</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
              "Aha! Welcome, junior detective! We are locked inside this ancient castle. Search the items in each room, solve the English clues to earn keys, and crack the final safe code to escape!"
            </p>
          </div>
        </div>

        {/* Room Maps */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', fontWeight: 800, fontSize: '0.88rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Castle Rooms Roadmap
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ROOM_META.map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '1.25rem' }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>Room {r.id}: {r.name}</span>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.desc}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: r.textColor, background: r.color, border: `1px solid ${r.borderColor}`, padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {r.keyName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => { setGameState('playing'); playSound(523.25, 0.2, 'sine'); }}
            style={{
              background: 'var(--accent-gradient)',
              border: 'none',
              color: 'white',
              padding: '0.85rem',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: 'var(--radius-btn)',
              cursor: 'pointer',
              boxShadow: '0 4px 15px var(--accent-glow)'
            }}
          >
            Start Adventure 🚀
          </button>
          
          <button
            onClick={onBackToDashboard}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-muted)',
              padding: '0.75rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-btn)',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    );
  }

  // ----------------------------------------------------
  // SCREEN 2: ROOM ENTRY TRANSITION
  // ----------------------------------------------------
  if (gameState === 'room-transition') {
    return (
      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem', animation: 'pulse 1.5s infinite' }}>🚪✨</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>Door Unlocked!</h2>
        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', maxWidth: '380px', lineHeight: '1.5', fontStyle: 'italic' }}>
          "{transitionMsg}"
        </p>
      </div>
    );
  }

  // ----------------------------------------------------
  // SCREEN 4: ESCAPED / CONGRATULATIONS
  // ----------------------------------------------------
  if (gameState === 'escaped') {
    const accuracy = Math.round((correctCount / (correctCount + wrongCount || 1)) * 100);
    
    return (
      <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        
        <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>🏆🎉</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Congratulations!
        </h2>
        <p style={{ color: 'var(--accent-pink)', fontWeight: 800, marginTop: '0.25rem', fontSize: '1.05rem' }}>
          You Escaped the Castle! 🏰🔓
        </p>

        {/* Stats */}
        <div className="glass-card" style={{ padding: '1.25rem', margin: '1.5rem 0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', textAlign: 'left' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Stars Collected</span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{stars} ⭐</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Escape Time</span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Accuracy Rate</span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>{accuracy}%</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Escape High Score</span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--accent-purple)' }}>{escapeRoomHighScore > 0 ? escapeRoomHighScore : 0} Pts</strong>
          </div>
        </div>

        {/* Victory Character Message */}
        <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.03)' }}>
          <div style={{ fontSize: '2.5rem' }}>🕵️‍♂️</div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: '1.4', textAlign: 'left' }}>
            "Splendid work, detective! Your excellent English skills solved every room mechanism, cracked the keypad lock, and safely unlocked the exit. You are officially certified as an Escape Master!"
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={handleRestartGame}
            style={{
              background: 'var(--accent-gradient)',
              border: 'none',
              color: 'white',
              padding: '0.85rem',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: 'var(--radius-btn)',
              cursor: 'pointer',
              boxShadow: '0 4px 15px var(--accent-glow)'
            }}
          >
            Play Again 🔄
          </button>
          
          <button
            onClick={onBackToDashboard}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-main)',
              padding: '0.75rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              borderRadius: 'var(--radius-btn)',
              cursor: 'pointer'
            }}
          >
            Return to Dashboard
          </button>
        </div>

      </div>
    );
  }

  // ----------------------------------------------------
  // SCREEN 3: GAMEPLAY LOOP
  // ----------------------------------------------------
  const allSolved = solvedObjects.length === roomChallenges.length;

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0.5rem clamp(0.5rem, 2vw, 1rem)' }}>
      
      {/* Header controls and inventory */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          onClick={handleRestartGame}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: 'var(--card-border)',
            color: 'var(--text-main)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-btn)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <ArrowLeft style={{ width: '14px', height: '14px' }} />
          Quit Game
        </button>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <div className="glass-card" style={{ padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
            <Star style={{ color: '#eab308', fill: '#eab308', width: '14px', height: '14px' }} />
            <span>Stars: {stars}</span>
          </div>
          
          <div className="glass-card" style={{ padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
            <Timer style={{ width: '14px', height: '14px' }} />
            <span>Time: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s</span>
          </div>
        </div>
      </div>

      {/* Inventory Bar (Keys Collected) */}
      <div className="glass-card" style={{ padding: '0.65rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Inventory Keys:</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {inventory.length === 0 ? (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No keys acquired yet</span>
          ) : (
            inventory.map((key, idx) => {
              const matchesMeta = ROOM_META.find(r => r.keyName === key);
              return (
                <div key={idx} title={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.68rem',
                  background: matchesMeta ? matchesMeta.color : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${matchesMeta ? matchesMeta.borderColor : 'rgba(255,255,255,0.1)'}`,
                  color: matchesMeta ? matchesMeta.textColor : 'white',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontWeight: 700
                }}>
                  <Key style={{ width: '11px', height: '11px' }} />
                  <span>{key.split(' ')[0]}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detective Guidance Panel */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.85rem', alignItems: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '2.25rem', animation: 'bounce 2s infinite' }}>🕵️‍♂️</div>
        <div style={{ flex: 1 }}>
          <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>DETECTIVE WORDY</span>
          <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
            {allSolved 
              ? `Aha! You solved all challenges in this room and secured the ${roomMeta.keyName}! Tap the Door below to unlock it!`
              : `Search the room objects! Solve the puzzles in the ${roomMeta.name} to reveal hidden clues.`}
          </p>
        </div>
      </div>

      {/* Main Visual Room Box */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: `1px solid ${roomMeta.borderColor}`, background: `linear-gradient(185deg, rgba(255,255,255,0.02) 0%, ${roomMeta.color} 100%)`, position: 'relative' }}>
        
        {/* Room Header */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.2rem' }}>{roomMeta.icon}</span>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: roomMeta.textColor }}>
            Room {currentRoom}: {roomMeta.name}
          </h3>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            {roomMeta.desc}
          </span>
        </div>

        {/* 2x2 Interactive Objects Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          {roomChallenges.map((challenge) => {
            const isSolved = solvedObjects.includes(challenge.hiddenIn);
            
            // Map names to specific emojis
            const EMOJIS: Record<string, string> = {
              'Bookshelf': '📚', 'Wooden Chest': '📦', 'Wall Painting': '🖼️', 'Desk Drawer': '🗄️',
              'Broken Clock': '⏰', 'Display Case': '🏺', 'Armor Suit': '🛡️', 'Stone Fireplace': '🔥',
              'Writing Desk': '✍️', 'Filing Cabinet': '📂', 'Safe': '🔒',
              'Work Bench': '🛠️', 'Tool Box': '🧰', 'Wall Gear': '⚙️', 'Steam Pipe': '💨',
              'Control Desk': '🎛️', 'Wall Poster': '📜', 'Locked Cabinet': '🗄️', 'Server Rack': '🖥️'
            };
            const emojiIcon = EMOJIS[challenge.hiddenIn] || '📦';

            return (
              <button
                key={challenge.id}
                onClick={() => handleObjectClick(challenge)}
                disabled={isSolved}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: isSolved ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSolved ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                  color: isSolved ? '#10b981' : 'var(--text-main)',
                  cursor: isSolved ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  WebkitTapHighlightColor: 'transparent'
                }}
                className={isSolved ? '' : 'hover-lift'}
              >
                <span style={{ fontSize: '2rem' }}>{emojiIcon}</span>
                <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>{challenge.hiddenIn}</span>
                
                {isSolved ? (
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                    Secured ✅
                  </span>
                ) : (
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                    Search 🔍
                  </span>
                )}

                {/* Show Room 5 clue value once solved */}
                {isSolved && currentRoom === 5 && discoveredDigits[challenge.hiddenIn] && (
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(255,255,255,0.05)', color: 'white', padding: '2px 8px', borderRadius: '4px', marginTop: '0.2rem' }}>
                    {discoveredDigits[challenge.hiddenIn]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Room Escape Lock or Final Door Keypad Trigger */}
        {allSolved && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentRoom === 5 ? (
              <button
                onClick={() => { setShowKeypad(true); playSound(523.25, 0.1, 'sine'); }}
                style={{
                  width: '100%',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  color: 'white',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-btn)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px var(--accent-glow)'
                }}
              >
                <span>Open Keypad Safe Lock 🎛️</span>
              </button>
            ) : (
              <button
                onClick={handleProceedRoom}
                style={{
                  width: '100%',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  color: 'white',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-btn)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px var(--accent-glow)'
                }}
              >
                <Key style={{ width: '16px', height: '16px' }} />
                <span>Use Key to Unlock Door 🚪</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 1. Puzzle modal popup */}
      {activeChallenge && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '500px',
            width: '100%',
            padding: 'clamp(1rem, 5vw, 2rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.8rem, 4vw, 1.25rem)',
            position: 'relative',
            animation: 'scaleIn 0.3s ease'
          }}>
            
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: roomMeta.textColor, textTransform: 'uppercase' }}>
                Clue in: {activeChallenge.hiddenIn}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 800 }}>
                {activeChallenge.type} puzzle
              </span>
            </div>

            {/* Character Guide inside the modal */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.65rem 0.85rem', borderRadius: '8px', borderLeft: `3px solid ${roomMeta.textColor}` }}>
              <span style={{ fontSize: '1.75rem' }}>🕵️‍♂️</span>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                {selectedOption !== null 
                  ? (selectedOption === activeChallenge.answer ? "Aha! Splendid! That's correct!" : "Oops! That did not work. Try again, detective!") 
                  : `Clara notes: "Look closely at this question. Solve it to retrieve the clue!"`}
              </p>
            </div>

            {/* Question Text Box */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: 'var(--card-border)',
              padding: 'clamp(0.8rem, 3.5vw, 1.25rem)',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: 'clamp(0.92rem, 4.2vw, 1.12rem)',
              lineHeight: '1.45',
              color: 'var(--text-main)'
            }}>
              {activeChallenge.question}
            </div>

            {/* Options grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {activeChallenge.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === activeChallenge.answer;
                const isHintDisabled = disabledOptions.includes(idx);

                let optStyle: React.CSSProperties = {
                  width: '100%',
                  padding: 'clamp(0.65rem, 3.5vw, 0.95rem) clamp(0.85rem, 4.5vw, 1.35rem)',
                  borderRadius: 'var(--radius-btn)',
                  border: 'var(--card-border)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: 'clamp(0.82rem, 3.8vw, 0.98rem)',
                  textAlign: 'left',
                  cursor: (selectedOption !== null || isHintDisabled) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isHintDisabled ? 0.3 : 1,
                  WebkitTapHighlightColor: 'transparent'
                };

                if (selectedOption !== null) {
                  if (isCorrect) {
                    optStyle.background = 'rgba(16, 185, 129, 0.15)';
                    optStyle.border = '1px solid #10b981';
                    optStyle.color = '#10b981';
                  } else if (isSelected) {
                    optStyle.background = 'rgba(239, 68, 68, 0.15)';
                    optStyle.border = '1px solid #ef4444';
                    optStyle.color = '#ef4444';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null || isHintDisabled}
                    onClick={() => handleOptionSelect(idx)}
                    style={optStyle}
                    className={selectedOption === null && !isHintDisabled ? 'hover-lift' : ''}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Hints options */}
            {selectedOption === null && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button
                  onClick={triggerFiftyFifty}
                  disabled={disabledOptions.length > 0}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.25rem',
                    fontSize: 'clamp(0.7rem, 3.2vw, 0.78rem)',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-btn)',
                    background: 'rgba(255,255,255,0.04)',
                    border: 'var(--card-border)',
                    color: 'var(--text-main)',
                    cursor: disabledOptions.length > 0 ? 'not-allowed' : 'pointer',
                    opacity: disabledOptions.length > 0 ? 0.5 : 1,
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  ✂️ 50/50 Hint
                </button>
                <button
                  onClick={triggerShowClue}
                  disabled={showClue}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.25rem',
                    fontSize: 'clamp(0.7rem, 3.2vw, 0.78rem)',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-btn)',
                    background: 'rgba(255,255,255,0.04)',
                    border: 'var(--card-border)',
                    color: 'var(--text-main)',
                    cursor: showClue ? 'not-allowed' : 'pointer',
                    opacity: showClue ? 0.5 : 1,
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  💡 Detective Tip
                </button>
              </div>
            )}

            {/* Text tip output */}
            {showClue && (
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(6,182,212,0.05)', border: '1px dashed rgba(6,182,212,0.3)', borderRadius: '8px', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 600, lineHeight: '1.4' }}>
                💡 Tip: {activeChallenge.clue}
              </div>
            )}

            {/* Feedback message box */}
            {feedbackMessage && (
              <div style={{ padding: '0.85rem', background: feedbackMessage.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: feedbackMessage.success ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)', color: feedbackMessage.success ? '#34d399' : '#f87171', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, textAlign: 'center' }}>
                {feedbackMessage.text}
              </div>
            )}

            {/* Cancel/Next Controls */}
            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setActiveChallenge(null); setHintUsedCount(0); }}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '0.65rem 0.5rem',
                  fontWeight: 700,
                  fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-btn)',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                Leave Object
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. Keypad Lock Overlay Panel Modal (Room 5 final unlock) */}
      {showKeypad && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999999,
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '360px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            border: '2px solid var(--accent-pink)',
            animation: 'scaleIn 0.3s ease'
          }}>
            <div style={{ fontSize: '1.75rem' }}>🎛️</div>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-pink)' }}>
              Enter Escape Code
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Type the 4-digit numeric code discovered from Room 5 clues.
            </span>

            {/* Discovered Clues Grid Helper */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem', fontSize: '0.68rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '6px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>1. {discoveredDigits['Control Desk'] || 'Locked 🔒'}</div>
              <div>2. {discoveredDigits['Wall Poster'] || 'Locked 🔒'}</div>
              <div>3. {discoveredDigits['Locked Cabinet'] || 'Locked 🔒'}</div>
              <div>4. {discoveredDigits['Server Rack'] || 'Locked 🔒'}</div>
            </div>

            {/* Keypad Input display */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '0.5rem',
              color: 'var(--text-main)',
              fontFamily: 'monospace',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {keypadInput.padEnd(4, '_')}
            </div>

            {/* Keypad Buttons Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              maxWidth: '260px',
              margin: '0 auto'
            }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(val => (
                <button
                  key={val}
                  onClick={() => handleKeypadPress(val)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                  className="hover-lift"
                >
                  {val}
                </button>
              ))}
              <button
                onClick={handleKeypadClear}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                Clear
              </button>
              <button
                onClick={() => handleKeypadPress('0')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent'
                }}
                className="hover-lift"
              >
                0
              </button>
              <button
                onClick={handleKeypadUnlock}
                disabled={keypadInput.length < 4}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: keypadInput.length < 4 ? 'rgba(255,255,255,0.02)' : 'rgba(16, 185, 129, 0.15)',
                  border: keypadInput.length < 4 ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(16, 185, 129, 0.4)',
                  color: keypadInput.length < 4 ? '#555' : '#34d399',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: keypadInput.length < 4 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                OK
              </button>
            </div>

            {/* Keypad Feedback Messages */}
            {keypadFeedback && (
              <div style={{
                padding: '0.65rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: keypadFeedback.success ? '#34d399' : '#f87171',
                background: keypadFeedback.success ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${keypadFeedback.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                borderRadius: '6px'
              }}>
                {keypadFeedback.text}
              </div>
            )}

            {/* Back button */}
            <button
              onClick={() => { setShowKeypad(false); setKeypadInput(''); setKeypadFeedback(null); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                marginTop: '0.25rem'
              }}
            >
              Cancel Keypad
            </button>

          </div>
        </div>
      )}

    </div>
  );

  return null;
};
