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
  let animationClass = 'riyan-idle';
  if (action === 'walk') animationClass = 'riyan-walk';
  else if (action === 'shocked') animationClass = 'riyan-shiver';
  else if (action === 'victory') animationClass = 'riyan-bounce';
  else if (action === 'lookAround') animationClass = 'riyan-sway';

  return (
    <div className={`riyan-container ${animationClass}`} style={{ width: '110px', height: '140px', position: 'relative' }}>
      <style>{`
        @keyframes riyanBreathing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes riyanWalking {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes riyanBouncing {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-16px) scaleY(1.08) scaleX(0.92); }
        }
        @keyframes riyanShivering {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-1.5px, 1px); }
          40% { transform: translate(1.5px, -1px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1.5px); }
        }
        @keyframes riyanSwaying {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-3deg); }
        }
        @keyframes talkingMouth {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.2); }
        }
        @keyframes leftLegSwing {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(24deg); }
        }
        @keyframes rightLegSwing {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-24deg); }
        }
        @keyframes handsRaise {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
        }

        .riyan-idle { animation: riyanBreathing 1.8s infinite ease-in-out; }
        .riyan-walk { animation: riyanWalking 0.5s infinite ease-in-out; }
        .riyan-bounce { animation: riyanBouncing 0.45s infinite ease-in-out; }
        .riyan-shiver { animation: riyanShivering 0.12s infinite linear; }
        .riyan-sway { animation: riyanSwaying 1.5s infinite ease-in-out; }
        
        .talking-mouth {
          animation: talkingMouth 0.18s infinite ease-in-out;
          transform-origin: 50px 46px;
        }
        .left-leg-anim {
          animation: leftLegSwing 0.5s infinite ease-in-out;
          transform-origin: 36px 90px;
        }
        .right-leg-anim {
          animation: rightLegSwing 0.5s infinite ease-in-out;
          transform-origin: 54px 90px;
        }
        .hands-victory-left {
          animation: handsRaise 0.45s infinite ease-in-out;
          transform-origin: 22px 55px;
        }
        .hands-victory-right {
          animation: handsRaise 0.45s infinite ease-in-out;
          transform-origin: 70px 55px;
        }
      `}</style>
      
      <svg viewBox="0 0 100 130" width="100%" height="100%">
        {/* Shadow */}
        <ellipse cx="50" cy="122" rx="30" ry="5" fill="rgba(0, 0, 0, 0.2)" />

        {/* Legs / Feet */}
        <g className={action === 'walk' ? 'left-leg-anim' : ''}>
          <rect x="34" y="88" width="10" height="24" fill="#1d4ed8" rx="4" />
          <ellipse cx="36" cy="113" rx="7" ry="4.5" fill="#ef4444" />
        </g>

        <g className={action === 'walk' ? 'right-leg-anim' : ''}>
          <rect x="52" y="88" width="10" height="24" fill="#1d4ed8" rx="4" />
          <ellipse cx="60" cy="113" rx="7" ry="4.5" fill="#ef4444" />
        </g>

        {/* Torso / Clothes */}
        <rect x="28" y="50" width="40" height="40" fill="#06b6d4" rx="8" />
        <path d="M 38,50 Q 50,58 62,50" fill="none" stroke="#0891b2" strokeWidth="3" />

        {/* Arms */}
        <g className={action === 'victory' ? 'hands-victory-left' : ''}>
          <rect x="20" y="53" width="8" height="26" fill="#ffd1b3" rx="4" transform="rotate(10 24 53)" />
        </g>
        <g className={action === 'victory' ? 'hands-victory-right' : ''}>
          <rect x="68" y="53" width="8" height="26" fill="#ffd1b3" rx="4" transform="rotate(-10 72 53)" />
        </g>

        {/* Neck */}
        <rect x="44" y="42" width="12" height="12" fill="#ffd1b3" />

        {/* Head */}
        <circle cx="50" cy="33" r="18" fill="#ffd1b3" />

        {/* Hair */}
        <path d="M 32,26 Q 26,8 38,18 Q 43,4 50,20 Q 57,4 62,18 Q 74,8 68,26" fill="#663300" />
        <path d="M 32,26 C 32,16 68,16 68,26" fill="#663300" />

        {/* Eyes */}
        {expression === 'shocked' ? (
          <>
            <circle cx="43" cy="31" r="4" fill="white" stroke="black" strokeWidth="1" />
            <circle cx="43" cy="31" r="1.5" fill="black" />
            <circle cx="57" cy="31" r="4" fill="white" stroke="black" strokeWidth="1" />
            <circle cx="57" cy="31" r="1.5" fill="black" />
          </>
        ) : expression === 'happy' || expression === 'excited' ? (
          <>
            <path d="M 38,32 Q 43,27 48,32" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 52,32 Q 57,27 62,32" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="43" cy="31" r="2.5" fill="black" />
            <circle cx="43" cy="30" r="0.8" fill="white" />
            <circle cx="57" cy="31" r="2.5" fill="black" />
            <circle cx="57" cy="30" r="0.8" fill="white" />
          </>
        )}

        {/* Mouth */}
        {talking ? (
          <ellipse cx="50" cy="44" rx="3.5" ry="4.5" fill="black" className="talking-mouth" />
        ) : expression === 'shocked' ? (
          <circle cx="50" cy="45" r="4" fill="black" />
        ) : expression === 'happy' || expression === 'excited' ? (
          <path d="M 44,41 Q 50,49 56,41" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <path d="M 45,43 Q 50,45 55,43" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Cheeks */}
        {(expression === 'happy' || expression === 'excited') && (
          <>
            <circle cx="34" cy="37" r="2.5" fill="rgba(244, 63, 94, 0.35)" />
            <circle cx="66" cy="37" r="2.5" fill="rgba(244, 63, 94, 0.35)" />
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

  // Animation Cutscene States: 'entry' | 'dialogue' | 'solved' | 'exit'
  const [cutsceneState, setCutsceneState] = useState<'entry' | 'dialogue' | 'solved' | 'exit'>('entry');
  const [riyanPosLeft, setRiyanPosLeft] = useState<number>(-120); // starts off-screen

  // Audio tone synth
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

  const currentLevelIndex = Math.min(4, Math.max(0, riyanStoryLevelIndex));
  const currentLevelData: StoryLevel = RIYAN_STORY_LEVELS[currentLevelIndex] || RIYAN_STORY_LEVELS[0];
  const segment: StorySegment = currentLevelData.segments[currentSegmentIndex];

  // Speech Narration handler
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

  // Trigger speech on segment change
  useEffect(() => {
    if (!segment) return;

    if (segment.type === 'narrative' && segment.storyText) {
      speakText(segment.storyText);
    } else if (segment.type === 'animation' && cutsceneState === 'dialogue' && segment.speechBubbleText) {
      speakText(`Riyan says: ${segment.speechBubbleText}`);
    } else if (segment.type === 'puzzle' && segment.question) {
      speakText(`Question: ${segment.question}`);
    }

    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setCharacterTalking(false);
    };
  }, [currentSegmentIndex, riyanStoryLevelIndex, cutsceneState, isNarrating]);

  // Automated Cutscene Timeline
  useEffect(() => {
    if (!segment) return;

    if (segment.type === 'animation') {
      // Step 1: ENTRY -> Riyan runs in from left while background scrolls
      setCutsceneState('entry');
      setRiyanPosLeft(-100);
      playSound(300, 0.1, 'sine');
      
      const entryTimer = setTimeout(() => {
        setRiyanPosLeft(45); // Stop in center-left
        setCutsceneState('dialogue');
      }, 1500);

      return () => clearTimeout(entryTimer);
    } else {
      setRiyanPosLeft(45);
    }
  }, [currentSegmentIndex, riyanStoryLevelIndex]);

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

      // Award XP and Coins
      addXp(5);
      addCoins(1);

      // Trigger exit cutscene after a small delay
      setTimeout(() => {
        // Step 3: SOLVED -> Riyan does victory bounce
        setCutsceneState('solved');
        
        setTimeout(() => {
          // Step 4: EXIT -> Riyan runs off screen to the right
          setCutsceneState('exit');
          setRiyanPosLeft(450); // Move off-screen right
          
          setTimeout(() => {
            handleNextSegment();
          }, 1800);
        }, 1500);
      }, 2000);

    } else {
      playSound(220, 0.35, 'sawtooth');
      setFeedbackMessage({
        text: "Oops! That's not correct. Review Riyan's notebook tip and try again!",
        success: false
      });
    }
  };

  const handleNextSegment = () => {
    setSelectedOption(null);
    setFeedbackMessage(null);
    setShowClue(false);
    playSound(400, 0.05, 'sine');

    if (currentSegmentIndex < currentLevelData.segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
    } else {
      handleLevelCompletion();
    }
  };

  const handleLevelCompletion = () => {
    playSound(587.33, 0.6, 'sine');
    addXp(50);
    addCoins(5);

    const nextLevel = currentLevelIndex + 1;
    if (nextLevel < 5) {
      setRiyanStoryLevelIndex(nextLevel);
      setCurrentSegmentIndex(0);
    } else {
      completeGame('riyan-story');
      setRiyanStoryLevelIndex(5);
    }
  };

  const handleRestartGame = () => {
    setRiyanStoryLevelIndex(0);
    setCurrentSegmentIndex(0);
    setSelectedOption(null);
    setFeedbackMessage(null);
    setShowClue(false);
    setCutsceneState('entry');
    setRiyanPosLeft(-100);
  };

  const handleToggleNarration = () => {
    const nextState = !isNarrating;
    setIsNarrating(nextState);
    if (!nextState && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setCharacterTalking(false);
    }
  };

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
  // PARALLAX BACKGROUND LAYERS DEFINITION
  // ----------------------------------------------------
  const getDistantLayerStyle = (theme?: string): React.CSSProperties => {
    if (theme === 'bedroom') return { background: 'linear-gradient(to bottom, #090214 0%, #150930 100%)' };
    if (theme === 'crossroad') return { background: 'linear-gradient(to bottom, #0d1e13 0%, #122818 100%)' };
    if (theme === 'bridge') return { background: 'linear-gradient(to bottom, #022d42 0%, #083344 100%)' };
    if (theme === 'castle-gate') return { background: 'linear-gradient(to bottom, #02040a 0%, #0c1220 100%)' };
    if (theme === 'castle-hall') return { background: 'linear-gradient(to bottom, #18092d 0%, #2a1149 100%)' };
    return { background: '#000' };
  };

  const isBgScrolling = cutsceneState === 'entry' || cutsceneState === 'exit';

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0.5rem clamp(0.5rem, 2vw, 1rem)' }}>
      
      {/* CSS Keyframes for Parallax scrolling */}
      <style>{`
        @keyframes scrollMidground {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollForeground {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scrolling-mid {
          animation: scrollMidground 12s linear infinite;
        }
        .scrolling-fore {
          animation: scrollForeground 4s linear infinite;
        }
      `}</style>

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
        <div className="glass-card" style={{ padding: '2rem 1.5rem', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.03, pointerEvents: 'none' }}>📖</div>

          <div style={{ display: 'flex', justifySelf: 'flex-start', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.75rem' }}>{segment.narratorEmoji || '📖'}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>Chapter {currentLevelIndex + 1} Storybook</span>
          </div>

          <div style={{
            fontSize: 'clamp(0.92rem, 4.5vw, 1.12rem)',
            lineHeight: '1.7',
            color: 'var(--text-main)',
            textAlign: 'left',
            fontWeight: 500,
            whiteSpace: 'pre-line',
            flex: 1
          }}>
            {segment.storyText}
          </div>

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
              <span>Play Animation</span>
              <Play style={{ width: '12px', height: '12px', fill: 'currentColor' }} />
            </button>
          </div>

        </div>
      )}

      {/* ----------------------------------------------------
          PHASE 2: ANIMATION CUTSCENE SCREEN
          ---------------------------------------------------- */}
      {segment?.type === 'animation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Parallax Cartoon Stage */}
          <div 
            className="glass-card" 
            style={{ 
              height: '240px', 
              position: 'relative', 
              overflow: 'hidden', 
              transition: 'all 0.3s ease',
              ...getDistantLayerStyle(segment.backgroundTheme)
            }}
          >
            {/* Layer 1: Distant Stars or Clouds */}
            {segment.backgroundTheme === 'bedroom' && (
              <div style={{ position: 'absolute', top: '20px', right: '40px', fontSize: '2.5rem', opacity: 0.2 }}>🌌</div>
            )}
            {(segment.backgroundTheme === 'crossroad' || segment.backgroundTheme === 'bridge') && (
              <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '40px', display: 'flex', justifyContent: 'space-around', opacity: 0.1, fontSize: '1.5rem' }}>
                <span>☁️</span><span>☁️</span>
              </div>
            )}

            {/* Layer 2: Midground scrolling elements (Tiled) */}
            <div 
              className={isBgScrolling ? 'scrolling-mid' : ''} 
              style={{ 
                position: 'absolute', 
                bottom: '40px', 
                left: 0, 
                width: '200%', 
                height: '100px', 
                display: 'flex', 
                gap: '80px',
                alignItems: 'flex-end',
                opacity: 0.3,
                pointerEvents: 'none'
              }}
            >
              {segment.backgroundTheme === 'bedroom' && (
                <>
                  <div style={{ width: '80px', height: '90px', border: '2px solid rgba(255,255,255,0.1)', background: '#040212', borderRadius: '4px' }} />
                  <div style={{ width: '80px', height: '90px', border: '2px solid rgba(255,255,255,0.1)', background: '#040212', borderRadius: '4px' }} />
                  <div style={{ width: '80px', height: '90px', border: '2px solid rgba(255,255,255,0.1)', background: '#040212', borderRadius: '4px' }} />
                  <div style={{ width: '80px', height: '90px', border: '2px solid rgba(255,255,255,0.1)', background: '#040212', borderRadius: '4px' }} />
                </>
              )}
              {segment.backgroundTheme === 'crossroad' && (
                <>
                  <span style={{ fontSize: '2.5rem' }}>🌲</span>
                  <span style={{ fontSize: '2.25rem' }}>🌲</span>
                  <span style={{ fontSize: '2.5rem' }}>🌲</span>
                  <span style={{ fontSize: '2.25rem' }}>🌲</span>
                  <span style={{ fontSize: '2.5rem' }}>🌲</span>
                  <span style={{ fontSize: '2.25rem' }}>🌲</span>
                </>
              )}
              {segment.backgroundTheme === 'bridge' && (
                <>
                  <span style={{ fontSize: '2rem' }}>🌿</span>
                  <span style={{ fontSize: '2rem' }}>🌿</span>
                  <span style={{ fontSize: '2rem' }}>🌿</span>
                  <span style={{ fontSize: '2rem' }}>🌿</span>
                </>
              )}
              {segment.backgroundTheme === 'castle-gate' && (
                <>
                  <div style={{ width: '30px', height: '110px', background: '#111827', border: '1px solid rgba(255,255,255,0.05)' }} />
                  <div style={{ width: '30px', height: '110px', background: '#111827', border: '1px solid rgba(255,255,255,0.05)' }} />
                  <div style={{ width: '30px', height: '110px', background: '#111827', border: '1px solid rgba(255,255,255,0.05)' }} />
                </>
              )}
              {segment.backgroundTheme === 'castle-hall' && (
                <>
                  <div style={{ width: '25px', height: '100px', background: '#b45309', opacity: 0.15 }} />
                  <div style={{ width: '25px', height: '100px', background: '#b45309', opacity: 0.15 }} />
                  <div style={{ width: '25px', height: '100px', background: '#b45309', opacity: 0.15 }} />
                </>
              )}
            </div>

            {/* Layer 3: Foreground elements (Tiled scrolling road/floor) */}
            <div 
              className={isBgScrolling ? 'scrolling-fore' : ''} 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '200%',
                height: '42px',
                display: 'flex',
                background: segment.backgroundTheme === 'bedroom' ? '#312e81' : segment.backgroundTheme === 'castle-hall' ? '#ca8a04' : '#451a03',
                borderTop: '2px solid rgba(255,255,255,0.15)',
                boxSizing: 'border-box'
              }}
            >
              {segment.backgroundTheme === 'bridge' ? (
                // Roaring River
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>〰️〰️〰️</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>〰️〰️〰️</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>〰️〰️〰️</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>〰️〰️〰️</span>
                </div>
              ) : (
                // Dirt or Tile markings
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', opacity: 0.15 }}>
                  <div style={{ width: '25px', height: '4px', background: 'white', borderRadius: '2px' }} />
                  <div style={{ width: '25px', height: '4px', background: 'white', borderRadius: '2px' }} />
                  <div style={{ width: '25px', height: '4px', background: 'white', borderRadius: '2px' }} />
                  <div style={{ width: '25px', height: '4px', background: 'white', borderRadius: '2px' }} />
                  <div style={{ width: '25px', height: '4px', background: 'white', borderRadius: '2px' }} />
                  <div style={{ width: '25px', height: '4px', background: 'white', borderRadius: '2px' }} />
                </div>
              )}
            </div>

            {/* Additional thematic sprites placed on stage */}
            {segment.backgroundTheme === 'bedroom' && (
              <div style={{ position: 'absolute', bottom: '38px', right: '15px', width: '90px', height: '40px', background: '#92400e', borderRadius: '4px 4px 0 0', border: '1px solid rgba(255,255,255,0.1)', zIndex: 5 }}>
                <div style={{ position: 'absolute', top: '-12px', left: '15px', width: '10px', height: '12px', background: '#f59e0b', borderRadius: '50% 50% 0 0' }} />
                <div style={{ position: 'absolute', top: '-5px', left: '35px', width: '20px', height: '6px', background: '#fff', borderRadius: '1px' }} />
              </div>
            )}
            {segment.backgroundTheme === 'crossroad' && (
              <div style={{ position: 'absolute', bottom: '38px', right: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5 }}>
                <div style={{ width: '65px', height: '12px', background: '#b45309', borderRadius: '2px', fontSize: '0.45rem', color: 'white', fontWeight: 800, textAlign: 'center', lineHeight: '12px', transform: 'rotate(4deg)' }}>⬅️ Castle</div>
                <div style={{ width: '65px', height: '12px', background: '#78350f', borderRadius: '2px', fontSize: '0.45rem', color: 'white', fontWeight: 800, textAlign: 'center', lineHeight: '12px', marginTop: '1px', transform: 'rotate(-4deg)' }}>Woods ➡️</div>
                <div style={{ width: '6px', height: '40px', background: '#451a03' }} />
              </div>
            )}
            {segment.backgroundTheme === 'bridge' && (
              <>
                <div style={{ position: 'absolute', bottom: '38px', left: 0, right: 0, height: '4px', background: '#78350f', zIndex: 6 }} />
                <span style={{ fontSize: '1.5rem', position: 'absolute', bottom: '35px', right: '35px', zIndex: 7 }}>🧚‍♀️</span>
              </>
            )}
            {segment.backgroundTheme === 'castle-gate' && (
              <>
                <div style={{ position: 'absolute', bottom: '38px', left: '30px', width: '8px', height: '70px', background: '#475569', zIndex: 5 }} />
                <div style={{ position: 'absolute', bottom: '38px', right: '30px', width: '8px', height: '70px', background: '#475569', zIndex: 5 }} />
                <div style={{ position: 'absolute', bottom: '38px', right: '50px', fontSize: '2.5rem', zIndex: 6 }}>🤖</div>
              </>
            )}
            {segment.backgroundTheme === 'castle-hall' && (
              <div style={{ position: 'absolute', top: '20px', left: 'calc(50% - 20px)', fontSize: '2.5rem', zIndex: 5, animation: 'riyanBreathing 1.5s infinite ease-in-out' }}>👑</div>
            )}

            {/* Riyan SVG Sprite Character */}
            <div 
              style={{ 
                position: 'absolute', 
                left: `${riyanPosLeft}px`,
                bottom: '15px',
                transition: 'left 1.5s ease-in-out',
                zIndex: 10
              }}
            >
              <RiyanCharacter 
                action={cutsceneState === 'entry' || cutsceneState === 'exit' ? 'walk' : cutsceneState === 'solved' ? 'victory' : segment.animationAction || 'idle'} 
                expression={cutsceneState === 'solved' ? 'excited' : segment.animationAction === 'shocked' ? 'shocked' : 'happy'} 
                talking={characterTalking} 
              />
            </div>

            {/* Speech bubble */}
            {segment.speechBubbleText && cutsceneState === 'dialogue' && (
              <div style={{
                position: 'absolute',
                left: '110px',
                top: '25px',
                background: 'white',
                border: '2px solid var(--accent-cyan)',
                padding: '0.55rem 0.8rem',
                borderRadius: '16px 16px 16px 0px',
                color: 'black',
                fontSize: '0.8rem',
                fontWeight: 700,
                maxWidth: '180px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                zIndex: 20,
                animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                💬 "{segment.speechBubbleText}"
              </div>
            )}
          </div>

          {/* Action trigger button */}
          <div className="glass-card" style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem' }}>🎬</span>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {cutsceneState === 'entry' ? 'Riyan is entering...' : cutsceneState === 'dialogue' ? 'Listen to Riyan\'s dialog!' : 'Riyan is moving forward!'}
              </p>
            </div>
            
            <button
              onClick={handleNextSegment}
              disabled={cutsceneState === 'entry' || cutsceneState === 'exit'}
              style={{
                background: 'var(--accent-gradient)',
                border: 'none',
                color: 'white',
                padding: '0.55rem 1.75rem',
                fontWeight: 800,
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                boxShadow: '0 4px 10px var(--accent-glow)',
                opacity: (cutsceneState === 'entry' || cutsceneState === 'exit') ? 0.5 : 1
              }}
            >
              Solve Challenge ⚡
            </button>
          </div>

        </div>
      )}

      {/* ----------------------------------------------------
          PHASE 3: PUZZLE CHALLENGE PHASE
          ---------------------------------------------------- */}
      {segment?.type === 'puzzle' && (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-pink)', textTransform: 'uppercase' }}>
              Help Riyan Solve It
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
              {currentLevelData.grammarFocus}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.85rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
            <span style={{ fontSize: '1.5rem' }}>👦</span>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
              Riyan: "Choose the correct spelling or sentence to help me progress!"
            </p>
          </div>

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
