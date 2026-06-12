import React, { useState, useEffect, useRef } from 'react';
import { useUserStore } from '../store/userStore';
import { RIYAN_STORY_LEVELS, StorySegment, StoryLevel } from '../data/riyanStoryLevels';
import { ArrowLeft, Play, Volume2 } from 'lucide-react';

interface RiyanStoryGameProps {
  onBackToDashboard: () => void;
}

// ---------------------------------------------------------------------
// ANIMATED SVG CHARACTER: RIYAN
// ---------------------------------------------------------------------
interface RiyanCharacterProps {
  action: 'idle' | 'walk' | 'lookAround' | 'shocked' | 'victory';
  expression: 'happy' | 'neutral' | 'shocked' | 'excited';
  talking: boolean;
}

const RiyanCharacter: React.FC<RiyanCharacterProps> = ({ action, expression, talking }) => {
  // Render Riyan with scalable vector graphics and CSS animation classes
  let animationClass = 'riyan-idle';
  if (action === 'walk') animationClass = 'riyan-walk';
  else if (action === 'shocked') animationClass = 'riyan-shiver';
  else if (action === 'victory') animationClass = 'riyan-bounce';
  else if (action === 'lookAround') animationClass = 'riyan-sway';

  return (
    <div className={`riyan-container ${animationClass}`} style={{ width: '120px', height: '150px', position: 'relative' }}>
      <style>{`
        @keyframes riyanBreathing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes riyanWalking {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes riyanBouncing {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scaleY(1.05) scaleX(0.95); }
        }
        @keyframes riyanShivering {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 2px); }
        }
        @keyframes riyanSwaying {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }
        @keyframes talkingMouth {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1.2); }
        }
        @keyframes legSwingLeft {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes legSwingRight {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-20deg); }
        }

        .riyan-idle { animation: riyanBreathing 2s infinite ease-in-out; }
        .riyan-walk { animation: riyanWalking 0.6s infinite ease-in-out; }
        .riyan-bounce { animation: riyanBouncing 0.5s infinite ease-in-out; }
        .riyan-shiver { animation: riyanShivering 0.15s infinite linear; }
        .riyan-sway { animation: riyanSwaying 1.8s infinite ease-in-out; }
        
        .talking-mouth {
          animation: talkingMouth 0.2s infinite ease-in-out;
          transform-origin: 50px 68px;
        }
        .left-leg-walk {
          animation: legSwingLeft 0.6s infinite ease-in-out;
          transform-origin: 40px 95px;
        }
        .right-leg-walk {
          animation: legSwingRight 0.6s infinite ease-in-out;
          transform-origin: 60px 95px;
        }
      `}</style>
      
      <svg viewBox="0 0 100 130" width="100%" height="100%">
        {/* Shadow */}
        <ellipse cx="50" cy="122" rx="35" ry="6" fill="rgba(0, 0, 0, 0.25)" />

        {/* Legs / Feet */}
        <g className={action === 'walk' ? 'left-leg-walk' : ''}>
          {/* Left Leg */}
          <rect x="36" y="90" width="10" height="25" fill="#1d4ed8" rx="4" />
          {/* Left Shoe */}
          <ellipse cx="38" cy="115" rx="8" ry="5" fill="#ef4444" />
        </g>

        <g className={action === 'walk' ? 'right-leg-walk' : ''}>
          {/* Right Leg */}
          <rect x="54" y="90" width="10" height="25" fill="#1d4ed8" rx="4" />
          {/* Right Shoe */}
          <ellipse cx="62" cy="115" rx="8" ry="5" fill="#ef4444" />
        </g>

        {/* Torso / Clothes */}
        <rect x="30" y="52" width="40" height="40" fill="#06b6d4" rx="8" />
        {/* Collar Details */}
        <path d="M 40,52 Q 50,60 60,52" fill="none" stroke="#0891b2" strokeWidth="3" />

        {/* Arms */}
        {/* Left Arm */}
        <rect x="22" y="55" width="8" height="28" fill="#ffd1b3" rx="4" transform="rotate(10 26 55)" />
        {/* Right Arm */}
        <rect x="70" y="55" width="8" height="28" fill="#ffd1b3" rx="4" transform="rotate(-10 74 55)" />

        {/* Neck */}
        <rect x="44" y="42" width="12" height="15" fill="#ffd1b3" />

        {/* Head */}
        <circle cx="50" cy="35" r="20" fill="#ffd1b3" />

        {/* Hair - Cute spikes */}
        <path d="M 30,28 Q 25,10 37,20 Q 42,6 50,22 Q 58,6 63,20 Q 75,10 70,28" fill="#663300" />
        <path d="M 30,28 C 30,18 70,18 70,28" fill="#663300" />

        {/* Eyes */}
        {expression === 'shocked' ? (
          <>
            {/* Shocked Eyes */}
            <circle cx="42" cy="33" r="4.5" fill="white" stroke="black" strokeWidth="1" />
            <circle cx="42" cy="33" r="1.5" fill="black" />
            <circle cx="58" cy="33" r="4.5" fill="white" stroke="black" strokeWidth="1" />
            <circle cx="58" cy="33" r="1.5" fill="black" />
          </>
        ) : expression === 'happy' || expression === 'excited' ? (
          <>
            {/* Happy Curved Eyes */}
            <path d="M 37,34 Q 42,29 47,34" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 53,34 Q 58,29 63,34" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Normal Eyes */}
            <circle cx="42" cy="33" r="3" fill="black" />
            <circle cx="42" cy="32" r="1" fill="white" />
            <circle cx="58" cy="33" r="3" fill="black" />
            <circle cx="58" cy="32" r="1" fill="white" />
          </>
        )}

        {/* Mouth */}
        {talking ? (
          <ellipse cx="50" cy="46" rx="4" ry="5" fill="black" className="talking-mouth" />
        ) : expression === 'shocked' ? (
          <circle cx="50" cy="47" r="5" fill="black" />
        ) : expression === 'happy' || expression === 'excited' ? (
          <path d="M 44,43 Q 50,51 56,43" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <path d="M 45,45 Q 50,47 55,45" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Blush cheeks */}
        {(expression === 'happy' || expression === 'excited') && (
          <>
            <circle cx="34" cy="39" r="3" fill="rgba(244, 63, 94, 0.4)" />
            <circle cx="66" cy="39" r="3" fill="rgba(244, 63, 94, 0.4)" />
          </>
        )}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------
// MAIN GAME SCREEN COMPONENT
// ---------------------------------------------------------------------
export const RiyanStoryGame: React.FC<RiyanStoryGameProps> = ({ onBackToDashboard }) => {
  const { riyanStoryLevelIndex, setRiyanStoryLevelIndex, addXp, addCoins, completeGame } = useUserStore();

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [showClue, setShowClue] = useState<boolean>(false);
  const [characterTalking, setCharacterTalking] = useState<boolean>(false);
  const [isNarrating, setIsNarrating] = useState<boolean>(true);

  // Audio tone synth context
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

  // Safe checks for level index bounds
  const currentLevelIndex = Math.min(4, Math.max(0, riyanStoryLevelIndex));
  const currentLevelData: StoryLevel = RIYAN_STORY_LEVELS[currentLevelIndex] || RIYAN_STORY_LEVELS[0];
  const segment: StorySegment = currentLevelData.segments[currentSegmentIndex];

  // Narration / Speech trigger
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (!isNarrating) return;

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const inVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN'));
      if (inVoice) {
        utterance.voice = inVoice;
      }
      utterance.rate = 0.95;

      utterance.onstart = () => {
        if (segment?.type === 'animation') {
          setCharacterTalking(true);
        }
      };
      utterance.onend = () => {
        setCharacterTalking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Trigger speech whenever segment loads
  useEffect(() => {
    if (!segment) return;

    if (segment.type === 'narrative' && segment.storyText) {
      speakText(segment.storyText);
    } else if (segment.type === 'animation' && segment.speechBubbleText) {
      speakText(`Riyan says: ${segment.speechBubbleText}`);
    } else if (segment.type === 'puzzle' && segment.question) {
      speakText(`Question: ${segment.question}`);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setCharacterTalking(false);
    };
  }, [currentSegmentIndex, riyanStoryLevelIndex, isNarrating]);

  // Handle option click in puzzle phase
  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null || !segment) return;

    setSelectedOption(idx);
    const isCorrect = idx === segment.answer;

    if (isCorrect) {
      playSound(523.25, 0.1, 'sine');
      setTimeout(() => playSound(659.25, 0.25, 'sine'), 80);

      setFeedbackMessage({
        text: segment.successMessage || 'Correct answer! Excellent!',
        success: true
      });

      // Immediate mini-rewards
      addXp(5);
      addCoins(1);

      // Auto-advance after small celebrate window
      setTimeout(() => {
        handleNextSegment();
      }, 3500);

    } else {
      playSound(220, 0.35, 'sawtooth');
      setFeedbackMessage({
        text: "Oops! That's not correct. Let's think and review Riyan's tip.",
        success: false
      });
    }
  };

  // Proceed segment in level
  const handleNextSegment = () => {
    // Reset puzzle states
    setSelectedOption(null);
    setFeedbackMessage(null);
    setShowClue(false);
    playSound(400, 0.05, 'sine');

    if (currentSegmentIndex < currentLevelData.segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
    } else {
      // Completed the level!
      handleLevelCompletion();
    }
  };

  // Level clearing sequence
  const handleLevelCompletion = () => {
    playSound(587.33, 0.6, 'sine');
    
    // XP and coins reward
    addXp(50);
    addCoins(5);

    const nextLevel = currentLevelIndex + 1;
    if (nextLevel < 5) {
      // Advance to next level
      setRiyanStoryLevelIndex(nextLevel);
      setCurrentSegmentIndex(0);
    } else {
      // Completed all 5 levels! Mark complete
      completeGame('riyan-story');
      // Show victory/completed screen by triggering next index
      setRiyanStoryLevelIndex(5);
    }
  };

  const handleRestartGame = () => {
    setRiyanStoryLevelIndex(0);
    setCurrentSegmentIndex(0);
    setSelectedOption(null);
    setFeedbackMessage(null);
    setShowClue(false);
  };

  // Toggle voice narration
  const handleToggleNarration = () => {
    const nextState = !isNarrating;
    setIsNarrating(nextState);
    if (!nextState && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setCharacterTalking(false);
    }
  };

  // ----------------------------------------------------
  // VICTORY SCREEN (All 5 levels completed)
  // ----------------------------------------------------
  if (riyanStoryLevelIndex >= 5) {
    return (
      <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>🏆🎉</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Amazing Adventure!
        </h2>
        <p style={{ color: 'var(--accent-cyan)', fontWeight: 800, marginTop: '0.25rem', fontSize: '1.1rem' }}>
          Riyan Mastered English Fluency! 👑
        </p>

        <div className="glass-card" style={{ padding: '1.5rem', margin: '1.5rem 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ fontSize: '2.5rem' }}>👦👑</div>
            <div>
              <h4 style={{ margin: 0, fontWeight: 800 }}>Riyan's Fluency Crown</h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Thanks to your help, Riyan has unlocked the Chamber of Fluency in the Castle of Voices!
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
            🎉 <strong>Escape Bonus Awarded:</strong> +50 XP and +5 Coins synced to your cloud student profile.
          </div>
        </div>

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
            Replay Adventure 🔄
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
  // VISUAL BACKGROUND SCENE BUILDERS
  // ----------------------------------------------------
  const getBackgroundStyles = (theme?: string): React.CSSProperties => {
    if (theme === 'bedroom') {
      return {
        background: 'linear-gradient(to bottom, #110e2e 0%, #291e52 50%, #442875 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)'
      };
    }
    if (theme === 'crossroad') {
      return {
        background: 'linear-gradient(to bottom, #122818 0%, #20472b 60%, #442a12 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      };
    }
    if (theme === 'bridge') {
      return {
        background: 'linear-gradient(to bottom, #083344 0%, #0e7490 70%, #7c2d12 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)'
      };
    }
    if (theme === 'castle-gate') {
      return {
        background: 'linear-gradient(to bottom, #090d16 0%, #1c2541 50%, #3a0ca3 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      };
    }
    if (theme === 'castle-hall') {
      return {
        background: 'linear-gradient(to bottom, #2d1b4e 0%, #581c87 50%, #ca8a04 100%)',
        border: '1px solid rgba(234, 179, 8, 0.3)'
      };
    }
    return { background: 'rgba(255,255,255,0.01)' };
  };

  const getBackgroundDecorations = (theme?: string) => {
    if (theme === 'bedroom') {
      return (
        <>
          {/* Window showing stars */}
          <div style={{ position: 'absolute', top: '15px', right: '30px', width: '60px', height: '80px', border: '3px solid #6b21a8', background: '#020014', borderRadius: '4px', display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.4rem', color: '#fff', position: 'absolute', top: '5px', left: '10px' }}>⭐</span>
            <span style={{ fontSize: '0.5rem', color: '#fff', position: 'absolute', top: '35px', right: '15px' }}>✨</span>
            <span style={{ fontSize: '0.3rem', color: '#fff', position: 'absolute', bottom: '15px', left: '20px' }}>⭐</span>
          </div>
          {/* Study desk */}
          <div style={{ position: 'absolute', bottom: '25px', right: '10px', width: '100px', height: '45px', background: '#b45309', borderRadius: '4px' }}>
            {/* Lamp */}
            <div style={{ position: 'absolute', top: '-15px', left: '20px', width: '12px', height: '15px', background: '#eab308', borderRadius: '50% 50% 0 0' }} />
            {/* Notebook */}
            <div style={{ position: 'absolute', top: '-5px', left: '45px', width: '25px', height: '8px', background: '#f8fafc', borderRadius: '2px', transform: 'rotate(-5deg)' }} />
          </div>
        </>
      );
    }
    if (theme === 'crossroad') {
      return (
        <>
          {/* Pines */}
          <span style={{ fontSize: '3rem', position: 'absolute', bottom: '20px', left: '15px', opacity: 0.6 }}>🌲</span>
          <span style={{ fontSize: '2.5rem', position: 'absolute', bottom: '25px', right: '25px', opacity: 0.5 }}>🌲</span>
          {/* Wooden signpost */}
          <div style={{ position: 'absolute', bottom: '25px', left: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '14px', background: '#b45309', borderRadius: '4px', fontSize: '0.5rem', color: 'white', fontWeight: 800, textAlign: 'center', lineHeight: '14px', transform: 'rotate(5deg)' }}>⬅️ Castle</div>
            <div style={{ width: '80px', height: '14px', background: '#78350f', borderRadius: '4px', fontSize: '0.5rem', color: 'white', fontWeight: 800, textAlign: 'center', lineHeight: '14px', marginTop: '2px', transform: 'rotate(-5deg)' }}>Woods ➡️</div>
            <div style={{ width: '8px', height: '60px', background: '#451a03' }} />
          </div>
        </>
      );
    }
    if (theme === 'bridge') {
      return (
        <>
          {/* Rushing river */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', overflow: 'hidden' }}>
            <span style={{ color: 'rgba(255,255,255,0.25)', animation: 'riyanBreathing 1s infinite' }}>〰️</span>
            <span style={{ color: 'rgba(255,255,255,0.25)', animation: 'riyanBreathing 1.2s infinite' }}>〰️</span>
            <span style={{ color: 'rgba(255,255,255,0.25)', animation: 'riyanBreathing 0.8s infinite' }}>〰️</span>
          </div>
          {/* Rope railings */}
          <div style={{ position: 'absolute', bottom: '35px', left: 0, right: 0, height: '30px', borderTop: '2px dashed #b45309', opacity: 0.6 }} />
          <span style={{ fontSize: '1.75rem', position: 'absolute', bottom: '25px', left: '10px' }}>🧚‍♀️</span>
        </>
      );
    }
    if (theme === 'castle-gate') {
      return (
        <>
          {/* Iron Gates */}
          <div style={{ position: 'absolute', bottom: '25px', left: '40px', width: '8px', height: '90px', background: '#334155', borderRadius: '4px' }} />
          <div style={{ position: 'absolute', bottom: '25px', right: '40px', width: '8px', height: '90px', background: '#334155', borderRadius: '4px' }} />
          {/* Gatekeeper Robot emoji */}
          <div style={{ position: 'absolute', bottom: '25px', right: '65px', fontSize: '3rem', animation: 'riyanBreathing 3s infinite ease-in-out' }}>🤖</div>
        </>
      );
    }
    if (theme === 'castle-hall') {
      return (
        <>
          {/* Floating Crown */}
          <div style={{ position: 'absolute', top: '25px', left: 'calc(50% - 25px)', fontSize: '3rem', animation: 'riyanBreathing 1.5s infinite ease-in-out' }}>👑</div>
          <span style={{ fontSize: '1.25rem', position: 'absolute', top: '70px', left: 'calc(50% - 12px)' }}>✨</span>
        </>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0.5rem clamp(0.5rem, 2vw, 1rem)' }}>
      
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          onClick={onBackToDashboard}
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
          Quit Story
        </button>

        {/* Audio Narration Toggle & Level Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handleToggleNarration}
            style={{
              background: isNarrating ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255,255,255,0.04)',
              border: isNarrating ? '1px solid rgba(6, 182, 212, 0.3)' : 'var(--card-border)',
              color: isNarrating ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-btn)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <Volume2 style={{ width: '14px', height: '14px' }} />
            <span>Voice: {isNarrating ? 'ON' : 'OFF'}</span>
          </button>

          <div className="glass-card" style={{ padding: '0.4rem 0.85rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-pink)', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
            📖 Level {currentLevelIndex + 1} of 5
          </div>
        </div>
      </div>

      {/* Main Title Card */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderLeft: '4px solid var(--accent-cyan)' }}>
        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interactive Storybook</span>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>How Riyan Learnt English</h3>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Focus: <strong>{currentLevelData.grammarFocus}</strong>
        </div>
      </div>

      {/* ----------------------------------------------------
          PHASE 1: NARRATIVE PHASE
          ---------------------------------------------------- */}
      {segment?.type === 'narrative' && (
        <div className="glass-card" style={{ padding: '2rem 1.5rem', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
          
          {/* Parallax style floating background elements */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.03, pointerEvents: 'none' }}>📖</div>

          {/* Book Header Icon */}
          <div style={{ display: 'flex', justifySelf: 'flex-start', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.75rem' }}>{segment.narratorEmoji || '📖'}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>Chapter {currentLevelIndex + 1} Storybook</span>
          </div>

          {/* Main Story Paragraph Block */}
          <div style={{
            fontSize: 'clamp(0.92rem, 4.5vw, 1.15rem)',
            lineHeight: '1.7',
            color: 'var(--text-main)',
            textAlign: 'left',
            fontWeight: 500,
            whiteSpace: 'pre-line',
            flex: 1
          }}>
            {segment.storyText}
          </div>

          {/* Bottom Actions */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
            <button
              onClick={handleNextSegment}
              style={{
                background: 'var(--accent-gradient)',
                border: 'none',
                color: 'white',
                padding: '0.7rem 2.25rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px var(--accent-glow)'
              }}
            >
              <span>Continue Scene</span>
              <Play style={{ width: '12px', height: '12px', fill: 'currentColor' }} />
            </button>
          </div>

        </div>
      )}

      {/* ----------------------------------------------------
          PHASE 2: ANIMATION SCREEN
          ---------------------------------------------------- */}
      {segment?.type === 'animation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Animated Cartoon Stage Viewport */}
          <div 
            className="glass-card" 
            style={{ 
              height: '240px', 
              position: 'relative', 
              overflow: 'hidden', 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'center', 
              paddingBottom: '25px',
              transition: 'all 0.3s ease',
              ...getBackgroundStyles(segment.backgroundTheme)
            }}
          >
            {/* Background details (furniture/sprite details) */}
            {getBackgroundDecorations(segment.backgroundTheme)}

            {/* Riyan Sprite Character */}
            <div style={{ 
              position: 'absolute', 
              left: segment.animationAction === 'walk' ? '120px' : '40px',
              bottom: '15px',
              transition: 'left 2.5s ease-in-out',
              zIndex: 10
            }}>
              <RiyanCharacter 
                action={segment.animationAction || 'idle'} 
                expression={segment.animationAction === 'shocked' ? 'shocked' : segment.animationAction === 'victory' ? 'excited' : 'happy'} 
                talking={characterTalking} 
              />
            </div>

            {/* Speach bubble */}
            {segment.speechBubbleText && (
              <div style={{
                position: 'absolute',
                left: '60px',
                top: '25px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid var(--accent-cyan)',
                padding: '0.65rem 0.85rem',
                borderRadius: '16px 16px 16px 0px',
                color: 'black',
                fontSize: '0.8rem',
                fontWeight: 700,
                maxWidth: '180px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 20,
                animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                💬 "{segment.speechBubbleText}"
              </div>
            )}
          </div>

          {/* Controller instruction panel */}
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', animation: 'riyanBreathing 2s infinite' }}>🤖</span>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                Watch the scene! Tap below to help Riyan solve his challenges.
              </p>
            </div>
            
            <button
              onClick={handleNextSegment}
              style={{
                background: 'var(--accent-gradient)',
                border: 'none',
                color: 'white',
                padding: '0.55rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                boxShadow: '0 4px 10px var(--accent-glow)'
              }}
            >
              Solve Puzzle ⚡
            </button>
          </div>

        </div>
      )}

      {/* ----------------------------------------------------
          PHASE 3: PUZZLE CHALLENGE PHASE
          ---------------------------------------------------- */}
      {segment?.type === 'puzzle' && (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          
          {/* Question Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-pink)', textTransform: 'uppercase' }}>
              Riyan's Puzzle Challenge
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
              {currentLevelData.grammarFocus}
            </span>
          </div>

          {/* Helper character guide */}
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.85rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
            <span style={{ fontSize: '1.5rem' }}>👦</span>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
              Riyan whispers: "I need to answer this correctly to continue my journey. Can you help me?"
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
            fontSize: 'clamp(0.92rem, 4.2vw, 1.1rem)',
            lineHeight: '1.5',
            color: 'var(--text-main)'
          }}>
            {segment.question}
          </div>

          {/* Options grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {segment.options?.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === segment.answer;

              let optStyle: React.CSSProperties = {
                width: '100%',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-btn)',
                border: 'var(--card-border)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.88rem',
                textAlign: 'left',
                cursor: selectedOption !== null ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
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
                  disabled={selectedOption !== null}
                  onClick={() => handleOptionSelect(idx)}
                  style={optStyle}
                  className={selectedOption === null ? 'hover-lift' : ''}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Notebook clue helper */}
          {selectedOption === null && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.25rem' }}>
              <button
                onClick={() => { setShowClue(true); playSound(350, 0.08, 'sine'); }}
                disabled={showClue}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textDecoration: 'underline',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <span>💡 Open Riyan's Notebook Clue</span>
              </button>
            </div>
          )}

          {/* Clue Text display */}
          {showClue && segment.clue && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(6,182,212,0.05)',
              border: '1px dashed rgba(6,182,212,0.3)',
              borderRadius: '8px',
              color: 'var(--accent-cyan)',
              fontSize: '0.75rem',
              fontWeight: 600,
              lineHeight: '1.4'
            }}>
              💡 <strong>Notebook Tip:</strong> {segment.clue}
            </div>
          )}

          {/* Feedback response panel */}
          {feedbackMessage && (
            <div style={{
              padding: '0.85rem',
              background: feedbackMessage.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: feedbackMessage.success ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
              color: feedbackMessage.success ? '#34d399' : '#f87171',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textAlign: 'center',
              animation: 'scaleIn 0.2s'
            }}>
              {feedbackMessage.text}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
