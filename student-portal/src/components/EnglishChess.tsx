import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { ArrowLeft, RefreshCw, Award, Zap, Shield, BookOpen, ChevronLeft, ChevronRight, Timer, Sparkles } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { CHESS_CHALLENGES, STORY_CHALLENGES, ChessChallenge, StoryChallenge } from '../data/englishChessChallenges';

interface EnglishChessProps {
  onBackToDashboard: () => void;
}

const PIECE_SYMBOLS: Record<string, string> = {
  wp: '♙', wr: '♜', wn: '♞', wb: '♝', wq: '♛', wk: '♚',
  bp: '♟', br: '♜', bn: '♞', bb: '♝', bq: '♛', bk: '♚'
};

export const EnglishChess: React.FC<EnglishChessProps> = ({ onBackToDashboard }) => {
  const { grade, addXp, addCoins, setChessHighScore } = useUserStore();

  // Mode Selection State
  // Modes: 'select' | 'tutorial' | 'classic' | 'vocab' | 'grammar' | 'scramble' | 'story' | 'quick'
  const [gameMode, setGameMode] = useState<'select' | 'tutorial' | 'classic' | 'vocab' | 'grammar' | 'scramble' | 'story' | 'quick'>('select');

  // Chess Game State
  const [chess] = useState(() => new Chess());
  const [board, setBoard] = useState(() => chess.board());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  // Challenge Modal State
  const [pendingMove, setPendingMove] = useState<{ from: string; to: string } | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<ChessChallenge | StoryChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hintUsedCount, setHintUsedCount] = useState(0);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [showClue, setShowClue] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Quick Chess Timer State
  const [quickTimer, setQuickTimer] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Story Mode State
  const [storyStep, setStoryStep] = useState(1);
  const [storyLog, setStoryLog] = useState<string[]>([]);

  // Tutorial Slideshow State
  const [tutorialSlide, setTutorialSlide] = useState(0);

  // Statistics State
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  const [aiThinking, setAiThinking] = useState(false);

  // Audio tone generator
  const audioContextRef = useRef<AudioContext | null>(null);
  const playSoundTone = (freq: number, duration: number, type: 'sine' | 'triangle' | 'sawtooth' = 'sine') => {
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
      console.warn('Audio Context failed:', e);
    }
  };

  // Determine difficulty level string based on grade
  const getDifficultyLevel = (): 'beginner' | 'intermediate' | 'advanced' => {
    const numericGrade = parseInt(grade.replace(/\D/g, '')) || 7;
    if (numericGrade <= 4) return 'beginner';
    if (numericGrade <= 8) return 'intermediate';
    return 'advanced';
  };

  // Filter and pick a challenge matching mode and level
  const loadNewChallenge = () => {
    const level = getDifficultyLevel();
    
    // Reset modal states
    setSelectedOption(null);
    setDisabledOptions([]);
    setShowClue(false);
    setFeedbackMessage(null);

    // 1. Story Mode
    if (gameMode === 'story') {
      const bank = STORY_CHALLENGES[level];
      // Loop templates if moves count exceeds 15
      const currentStepKey = ((storyStep - 1) % bank.length) + 1;
      const challenge = bank.find(c => c.step === currentStepKey) || bank[0];
      setCurrentChallenge(challenge);
      return;
    }

    // 2. Focused standard modes
    const bank = CHESS_CHALLENGES[level];
    let filteredBank = bank;

    if (gameMode === 'vocab') {
      filteredBank = bank.filter(c => ['meaning', 'synonym', 'antonym'].includes(c.type));
    } else if (gameMode === 'grammar') {
      filteredBank = bank.filter(c => ['grammar', 'correction', 'word-id', 'reading'].includes(c.type));
    } else if (gameMode === 'scramble') {
      filteredBank = bank.filter(c => c.type === 'scramble');
    }
    // 'quick' mode uses any random question from the entire bank

    if (filteredBank.length === 0) {
      filteredBank = bank; // fallback
    }

    const randomIndex = Math.floor(Math.random() * filteredBank.length);
    setCurrentChallenge(filteredBank[randomIndex]);

    // Initialize timer for Quick Mode
    if (gameMode === 'quick') {
      setQuickTimer(10);
    }
  };

  // Handle Quick Chess 10-second countdown
  useEffect(() => {
    if (gameMode === 'quick' && currentChallenge && selectedOption === null && !feedbackMessage && pendingMove) {
      timerRef.current = setInterval(() => {
        setQuickTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            // Trigger timeout failure
            playSoundTone(220, 0.35, 'sawtooth');
            setWrongAnswers(prevCount => prevCount + 1);
            setStreak(0);
            setSelectedOption(-1); // block options
            setFeedbackMessage({
              text: 'Time expired! Try a new challenge to unlock this move.',
              success: false
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameMode, currentChallenge, selectedOption, feedbackMessage, pendingMove]);

  // Check checkmate/stalemate status
  const checkGameStatus = (currentScore?: number) => {
    const activeScore = currentScore !== undefined ? currentScore : score;
    if (chess.isCheckmate()) {
      setIsGameOver(true);
      setGameOverReason(chess.turn() === 'w' ? 'Black wins by Checkmate!' : 'White wins by Checkmate! 🏆');
      playSoundTone(587.33, 1.2, 'sine');
      if (chess.turn() === 'b') {
        // Player won!
        addXp(100);
        addCoins(20);
        const finalScore = activeScore + 100;
        setScore(finalScore);
        setChessHighScore(finalScore);
      } else {
        setChessHighScore(activeScore);
      }
    } else if (chess.isDraw()) {
      setIsGameOver(true);
      let reason = 'Draw game!';
      if (chess.isStalemate()) reason = 'Draw by Stalemate!';
      else if (chess.isThreefoldRepetition()) reason = 'Draw by Repetition!';
      else if (chess.isInsufficientMaterial()) reason = 'Draw by Insufficient Material!';
      setGameOverReason(reason);
      playSoundTone(440, 0.8, 'triangle');
      addXp(50);
      addCoins(5);
      const finalScore = activeScore + 50;
      setScore(finalScore);
      setChessHighScore(finalScore);
    }
  };

  // AI Counter-move dispatcher
  const triggerComputerMove = () => {
    if (chess.isGameOver()) return;

    setAiThinking(true);
    setTimeout(() => {
      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) {
        setAiThinking(false);
        checkGameStatus(score);
        return;
      }

      // Heuristics:
      // 1. Checkmate search
      let chosenMove = moves.find(m => {
        const testChess = new Chess(chess.fen());
        testChess.move({ from: m.from, to: m.to, promotion: 'q' });
        return testChess.isCheckmate();
      });

      // 2. Capture high-value pieces
      if (!chosenMove) {
        const captures = moves.filter(m => m.captured);
        if (captures.length > 0) {
          const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
          captures.sort((a, b) => {
            const valA = pieceValues[a.captured || 'p'];
            const valB = pieceValues[b.captured || 'p'];
            return valB - valA;
          });
          chosenMove = captures[0];
        }
      }

      // 3. Fallback to random
      if (!chosenMove) {
        chosenMove = moves[Math.floor(Math.random() * moves.length)];
      }

      try {
        const promotionArg = (chosenMove.color === 'b' && chosenMove.piece === 'p' && chosenMove.to.endsWith('1')) ? 'q' : undefined;
        chess.move({
          from: chosenMove.from,
          to: chosenMove.to,
          promotion: promotionArg
        });
        setBoard(chess.board());
        setMoveHistory(chess.history());
        setTurn('w');
        playSoundTone(329.63, 0.15, 'sawtooth');
      } catch (err) {
        console.error('AI move failed:', err);
      }
      
      setAiThinking(false);
      checkGameStatus(score);
    }, 800);
  };

  // Click handler for Chess Board
  const handleSquareClick = (squareRepresentation: string) => {
    if (turn !== 'w' || isGameOver || aiThinking || gameMode === 'select' || gameMode === 'tutorial') return;

    const squareObj = chess.get(squareRepresentation as any);
    
    // Click target destination square
    if (possibleMoves.includes(squareRepresentation)) {
      if (selectedSquare) {
        // 1. If Classic Chess (No English Questions), execute immediately!
        if (gameMode === 'classic') {
          try {
            const moves = chess.moves({ square: selectedSquare as any, verbose: true });
            const mDetails = moves.find(m => m.to === squareRepresentation);
            const isPromotion = mDetails?.flags.includes('p');

            chess.move({
              from: selectedSquare,
              to: squareRepresentation,
              promotion: isPromotion ? 'q' : undefined
            });

            setBoard(chess.board());
            setMoveHistory(chess.history());
            setSelectedSquare(null);
            setPossibleMoves([]);
            setTurn('b');
            playSoundTone(523.25, 0.1, 'sine');
          } catch (err) {
            console.error('Move failed:', err);
          }
          return;
        }

        // 2. Challenge Modes: queue move and show popup challenge
        setPendingMove({ from: selectedSquare, to: squareRepresentation });
        loadNewChallenge();
      }
      return;
    }

    // Select White pieces
    if (squareObj && squareObj.color === 'w') {
      setSelectedSquare(squareRepresentation);
      const moves = chess.moves({ square: squareRepresentation as any, verbose: true });
      setPossibleMoves(moves.map(m => m.to));
      playSoundTone(440, 0.05, 'sine');
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  // Submit challenge answer
  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null || feedbackMessage) return;
    
    // Stop Quick mode timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setSelectedOption(idx);
    const isCorrect = idx === currentChallenge?.answer;

    if (isCorrect) {
      playSoundTone(523.25, 0.1, 'sine');
      setTimeout(() => playSoundTone(659.25, 0.25, 'sine'), 80);
      
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      // Calculate Points
      let pointsEarned = 10;
      let streakBonus = 0;
      if (streak >= 3) {
        streakBonus = 20;
        pointsEarned += 20;
      }
      setScore(prev => prev + pointsEarned);

      // Award XP
      addXp(5);
      addCoins(1);

      // Story mode log update
      if (gameMode === 'story' && currentChallenge) {
        const selectedText = currentChallenge.options[idx];
        setStoryLog(prev => [...prev, selectedText]);
        setStoryStep(prev => prev + 1);
      }

      setFeedbackMessage({
        text: `Correct Answer! +${pointsEarned} Points. ${streakBonus ? 'Streak Bonus Active! 🔥' : ''}`,
        success: true
      });

      // Execute queued move
      setTimeout(() => {
        if (pendingMove) {
          try {
            const moves = chess.moves({ square: pendingMove.from as any, verbose: true });
            const mDetails = moves.find(m => m.to === pendingMove.to);
            const isPromotion = mDetails?.flags.includes('p');

            chess.move({
              from: pendingMove.from,
              to: pendingMove.to,
              promotion: isPromotion ? 'q' : undefined
            });

            setBoard(chess.board());
            setMoveHistory(chess.history());
            setSelectedSquare(null);
            setPossibleMoves([]);
            setPendingMove(null);
            setCurrentChallenge(null);
            
            // Switch turn to AI opponent
            const nextScore = score + (streak + 1 >= 3 ? 30 : 10);
            setTurn('b');
            checkGameStatus(nextScore);
          } catch (err) {
            console.error('Player move failed:', err);
          }
        }
      }, 1500);

    } else {
      playSoundTone(220, 0.35, 'sawtooth');
      setWrongAnswers(prev => prev + 1);
      setStreak(0);
      setFeedbackMessage({
        text: 'Incorrect answer! Please try a new challenge to unlock this move.',
        success: false
      });
    }
  };

  // AI moves trigger hook
  useEffect(() => {
    if (turn === 'b' && !isGameOver && gameMode !== 'select' && gameMode !== 'tutorial') {
      triggerComputerMove();
    }
  }, [turn, isGameOver]);

  // Hint: 50/50 handler
  const triggerFiftyFifty = () => {
    if (!currentChallenge || hintUsedCount >= 3 || disabledOptions.length > 0) return;

    const correct = currentChallenge.answer;
    const incorrectIndices = [0, 1, 2, 3].filter(idx => idx !== correct);
    
    const disabled: number[] = [];
    while (disabled.length < 2) {
      const randIdx = Math.floor(Math.random() * incorrectIndices.length);
      const val = incorrectIndices[randIdx];
      if (!disabled.includes(val)) {
        disabled.push(val);
      }
    }

    setDisabledOptions(disabled);
    setHintUsedCount(prev => prev + 1);
    playSoundTone(350, 0.1, 'sine');
  };

  // Hint: Clue handler
  const triggerShowClue = () => {
    if (!currentChallenge || hintUsedCount >= 3 || showClue) return;
    setShowClue(true);
    setHintUsedCount(prev => prev + 1);
    playSoundTone(350, 0.1, 'sine');
  };

  // Reset/Restart Match
  const handleRestart = () => {
    chess.reset();
    setBoard(chess.board());
    setMoveHistory([]);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setTurn('w');
    setIsGameOver(false);
    setGameOverReason('');
    setScore(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setStreak(0);
    setHintUsedCount(0);
    setPendingMove(null);
    setCurrentChallenge(null);
    setStoryStep(1);
    setStoryLog([]);
    playSoundTone(523.25, 0.3, 'sine');
  };

  // Exit from match back to mode selector
  const handleExitToModes = () => {
    handleRestart();
    setGameMode('select');
  };

  // Tutorial Slideshow Data
  const tutorialSlides = [
    {
      title: 'Board & Objective 🏁',
      content: 'Chess is a game of strategy played on an 8x8 grid. The main objective is to attack the opponent\'s King in a way that it cannot escape capture. This final winning state is called Checkmate!',
      illustration: '♚ vs ♔'
    },
    {
      title: 'Pawns (♙) & Rooks (♜) 🛡️',
      content: 'Pawns move 1 square forward (or 2 on their first move) and capture 1 square diagonally. Rooks move in straight horizontal or vertical lines across any number of unoccupied squares.',
      illustration: '♙ (Forward/Diag) | ♜ (Straight Lines)'
    },
    {
      title: 'Knights (♞) & Bishops (♝) 🏇',
      content: 'Knights move in an "L" shape (2 squares one way, 1 square perpendicular) and are the only pieces that can jump over other pieces! Bishops move along diagonals of their matching square color.',
      illustration: '♞ (Jump/L-Shape) | ♝ (Diagonal Lines)'
    },
    {
      title: 'The Queen (♛) 👑',
      content: 'The Queen is your most powerful piece. She can move any number of squares in any direction: horizontally, vertically, or diagonally. Keep her safe to dominate the board!',
      illustration: '♛ (Any Direction / Straight / Diag)'
    },
    {
      title: 'The King (♚) 🛡️',
      content: 'The King is the most important piece. He moves only 1 square in any direction. If the King is threatened with capture, he is in Check, and you must move him to safety immediately.',
      illustration: '♚ (Most Critical / 1 Square Range)'
    },
    {
      title: 'English Chess Rules ♟️',
      content: 'In English Chess, you choose a legal chess move. Before the piece moves, you solve a grade-adaptive English challenge. Solving it correctly executes the move and awards points!',
      illustration: 'Select Move ➔ Solve Challenge ➔ Move Piece'
    }
  ];

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  // ----------------------------------------------------
  // RENDER SCREEN 1: MODE SELECTOR
  // ----------------------------------------------------
  if (gameMode === 'select') {
    return (
      <div className="main-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>♟️</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            English Chess Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Learn chess, play standard practice matches, or solve grammar quizzes to unlock your moves!
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Card: Learn Chess */}
          <div 
            onClick={() => { setGameMode('tutorial'); setTutorialSlide(0); playSoundTone(440, 0.05, 'sine'); }}
            className="glass-card hover-lift" 
            style={{ padding: '1.25rem', cursor: 'pointer', border: '1px dashed rgba(6, 182, 212, 0.4)', background: 'rgba(6, 182, 212, 0.02)' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📖</div>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.98rem' }}>How Chess Works</h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Tutorial: Read the rules of the board and learn how pawns, rooks, knights, and kings move.
            </p>
          </div>

          {/* Card: Classic Chess */}
          <div 
            onClick={() => { setGameMode('classic'); handleRestart(); }}
            className="glass-card hover-lift" 
            style={{ padding: '1.25rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚙️</div>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.98rem' }}>Classic Chess</h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Practice Mode: Play a standard chess game against the computer bot. No English challenges.
            </p>
          </div>

          {/* Card: Vocabulary Chess */}
          <div 
            onClick={() => { setGameMode('vocab'); handleRestart(); }}
            className="glass-card hover-lift" 
            style={{ padding: '1.25rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✍️</div>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.98rem' }}>Vocabulary Chess</h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Vocab Mode: Solve synonyms, antonyms, and dictionary meanings to execute your chess moves.
            </p>
          </div>

          {/* Card: Grammar Chess */}
          <div 
            onClick={() => { setGameMode('grammar'); handleRestart(); }}
            className="glass-card hover-lift" 
            style={{ padding: '1.25rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📝</div>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.98rem' }}>Grammar Chess</h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Grammar Mode: Answer tenses, parts of speech, prepositions, and sentence correction questions.
            </p>
          </div>

          {/* Card: Sentence Builder Chess */}
          <div 
            onClick={() => { setGameMode('scramble'); handleRestart(); }}
            className="glass-card hover-lift" 
            style={{ padding: '1.25rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🧩</div>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.98rem' }}>Sentence Builder</h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Scramble Mode: Arrange scattered words into correct grammatical sentences to unlock moves.
            </p>
          </div>

          {/* Card: Story Chess */}
          <div 
            onClick={() => { setGameMode('story'); handleRestart(); }}
            className="glass-card hover-lift" 
            style={{ padding: '1.25rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📚</div>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.98rem' }}>Story Chess</h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Narrative Mode: Choose the next sentence to build an interactive story as your match progresses.
            </p>
          </div>

          {/* Card: Quick Chess */}
          <div 
            onClick={() => { setGameMode('quick'); handleRestart(); }}
            className="glass-card hover-lift" 
            style={{ padding: '1.25rem', cursor: 'pointer', border: '1px solid rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.02)' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.98rem' }}>Quick Chess</h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Time Attack: Solve randomized English challenges under a strict, ticking 10-second timer!
            </p>
          </div>
        </div>

        <button 
          onClick={onBackToDashboard}
          style={{
            display: 'block',
            margin: '0 auto',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--text-main)',
            padding: '0.75rem 2rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-btn)',
            cursor: 'pointer'
          }}
        >
          Return to Portal
        </button>

      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER SCREEN 2: CHESS TUTORIAL
  // ----------------------------------------------------
  if (gameMode === 'tutorial') {
    const slide = tutorialSlides[tutorialSlide];
    return (
      <div className="main-container" style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-cyan)', width: '24px', height: '24px' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Chess Tutorial</h2>
        </div>

        <div className="glass-card animate-pulse-slow" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '300px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {slide.title}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Slide {tutorialSlide + 1} of {tutorialSlides.length}
            </span>
          </div>

          <div style={{
            fontSize: '1.8rem',
            background: 'rgba(255,255,255,0.02)',
            border: 'var(--card-border)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center',
            fontWeight: 800,
            color: 'var(--text-main)'
          }}>
            {slide.illustration}
          </div>

          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            {slide.content}
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              disabled={tutorialSlide === 0}
              onClick={() => { setTutorialSlide(prev => prev - 1); playSoundTone(350, 0.05, 'sine'); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: 'var(--radius-btn)',
                background: 'rgba(255,255,255,0.04)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                cursor: tutorialSlide === 0 ? 'not-allowed' : 'pointer',
                opacity: tutorialSlide === 0 ? 0.3 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                fontWeight: 700
              }}
            >
              <ChevronLeft style={{ width: '16px', height: '16px' }} />
              Previous
            </button>

            {tutorialSlide < tutorialSlides.length - 1 ? (
              <button
                onClick={() => { setTutorialSlide(prev => prev + 1); playSoundTone(440, 0.05, 'sine'); }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-btn)',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px var(--accent-glow)'
                }}
              >
                Next
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            ) : (
              <button
                onClick={() => { setGameMode('select'); playSoundTone(523.25, 0.1, 'sine'); }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-btn)',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px var(--accent-glow)'
                }}
              >
                Back to Modes 🚀
              </button>
            )}
          </div>
        </div>

      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER SCREEN 3: ACTIVE GAMEPLAY MATCH
  // ----------------------------------------------------
  return (
    <div className="main-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button 
          onClick={handleExitToModes}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: 'var(--card-border)',
            color: 'var(--text-main)',
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-btn)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Change Mode
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700 }}>
            <Award style={{ color: '#eab308', width: '18px', height: '18px' }} />
            <span>Score: {score}</span>
          </div>
          {streak >= 3 && (
            <div className="glass-card animate-pulse-slow" style={{ padding: '0.5rem 1.1rem', background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.4)', color: '#f97316', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 800 }}>
              <Zap style={{ fill: '#f97316', width: '18px', height: '18px' }} />
              <span>Streak: {streak} 🔥</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Board and Moves layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Board */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '420px',
            fontWeight: 700
          }}>
            <span>Opponent: English Chess Bot 🤖</span>
            <span style={{ color: turn === 'b' ? 'var(--accent-purple)' : 'var(--text-muted)' }}>
              {aiThinking ? 'Thinking...' : turn === 'b' ? 'Bot\'s Turn' : 'Your Turn (White)'}
            </span>
          </div>

          {/* Board Grid Wrapper */}
          <div style={{
            width: '100%',
            maxWidth: '420px',
            aspectRatio: '1',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.08)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            display: 'grid',
            gridTemplateRows: 'repeat(8, 1fr)'
          }}>
            {board.map((row, rIdx) => {
              const rankNum = 8 - rIdx;
              return (
                <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)' }}>
                  {row.map((square, cIdx) => {
                    const fileLetter = files[cIdx];
                    const squareName = `${fileLetter}${rankNum}`;
                    const isDark = (rIdx + cIdx) % 2 === 1;

                    // Compute highlights
                    const isSelected = selectedSquare === squareName;
                    const isPossibleTarget = possibleMoves.includes(squareName);

                    // Render Piece Symbols
                    let pieceRepresentation = '';
                    let isWhitePiece = false;
                    if (square) {
                      const code = `${square.color}${square.type}`;
                      pieceRepresentation = PIECE_SYMBOLS[code] || '';
                      isWhitePiece = square.color === 'w';
                    }

                    return (
                      <button
                        key={cIdx}
                        onClick={() => handleSquareClick(squareName)}
                        style={{
                          background: isSelected 
                            ? 'rgba(6, 182, 212, 0.45)' 
                            : isPossibleTarget 
                              ? 'rgba(244, 63, 94, 0.35)' 
                              : isDark 
                                ? 'var(--level-card-bg)' 
                                : 'rgba(255,255,255,0.02)',
                          border: isSelected
                            ? '2px solid var(--accent-cyan)'
                            : 'none',
                          outline: 'none',
                          cursor: (aiThinking || turn === 'b') ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          position: 'relative',
                          transition: 'all 0.15s ease',
                          padding: 0
                        }}
                      >
                        {pieceRepresentation && (
                          <span style={{
                            color: isWhitePiece ? '#ffffff' : '#1e1b4b',
                            textShadow: isWhitePiece 
                              ? '0 0 3px #06b6d4, 0 0 8px #06b6d4' 
                              : '0 0 3px #a21caf, 0 0 8px #a21caf',
                            userSelect: 'none',
                            transform: 'translateY(-2px)'
                          }}>
                            {pieceRepresentation}
                          </span>
                        )}

                        {isPossibleTarget && !pieceRepresentation && (
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: 'var(--accent-pink)',
                            boxShadow: '0 0 8px var(--accent-pink)'
                          }} />
                        )}

                        {cIdx === 0 && (
                          <span style={{ position: 'absolute', top: '2px', left: '4px', fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', fontWeight: 800 }}>
                            {rankNum}
                          </span>
                        )}
                        {rIdx === 7 && (
                          <span style={{ position: 'absolute', bottom: '2px', right: '4px', fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', fontWeight: 800 }}>
                            {fileLetter}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Move history and panel instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Rules Banner */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase' }}>
              ♟️ Mode: {gameMode === 'classic' ? 'Classic Practice ⚙️' : gameMode === 'vocab' ? 'Vocab Mode ✍️' : gameMode === 'grammar' ? 'Grammar Mode 📝' : gameMode === 'scramble' ? 'Scramble Mode 🧩' : gameMode === 'story' ? 'Story Builder 📚' : gameMode === 'quick' ? 'Quick 10s Timer ⚡' : ''}
            </h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {gameMode === 'classic' 
                ? 'Enjoy a normal game of chess against the bot with standard moves and validations. No questions asked!' 
                : gameMode === 'story'
                  ? 'Unfold a custom story as you play! Solve questions sequentially, and see the full narrative that you created when the match ends.'
                  : gameMode === 'quick'
                    ? 'Caution! A strict 10-second countdown runs on every move. Answer fast to execute!'
                    : 'Select a piece and click a red square to prompt your English challenge. Unlock moves by solving correctly.'}
            </p>
          </div>

          {/* Story log preview (only in Story mode) */}
          {gameMode === 'story' && storyLog.length > 0 && (
            <div className="glass-card animate-pulse-slow" style={{ padding: '1.25rem', maxHeight: '180px', overflowY: 'auto' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)' }}>
                <Sparkles style={{ width: '16px', height: '16px' }} /> Compiled Story
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.5', fontStyle: 'italic' }}>
                "{storyLog.join(' ')}"
              </p>
            </div>
          )}

          {/* Move Log History */}
          <div className="glass-card" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '200px' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontWeight: 800, fontSize: '0.95rem' }}>
              📝 Move Log
            </h4>
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              fontSize: '0.8rem', 
              color: 'var(--text-muted)',
              maxHeight: '180px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.4rem',
              paddingRight: '0.25rem'
            }}>
              {moveHistory.length === 0 ? (
                <span style={{ gridColumn: 'span 2', fontStyle: 'italic' }}>No moves played yet. Start by moving white!</span>
              ) : (
                moveHistory.map((move, idx) => {
                  if (idx % 2 === 0) {
                    const stepNum = Math.floor(idx / 2) + 1;
                    return (
                      <div key={idx} style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ fontWeight: 700 }}>{stepNum}. {move}</span>
                        <span>{moveHistory[idx + 1] || '...'}</span>
                      </div>
                    );
                  }
                  return null;
                })
              )}
            </div>
            
            <button
              onClick={handleRestart}
              style={{
                marginTop: '1rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-main)',
                padding: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <RefreshCw style={{ width: '14px', height: '14px' }} />
              Restart Match
            </button>
          </div>
        </div>
      </div>

      {/* 1. English Challenge Modal Popup */}
      {currentChallenge && pendingMove && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999999,
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            animation: 'scaleIn 0.3s ease'
          }}>
            
            {/* Modal Title with Timer for Quick mode */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield style={{ color: 'var(--accent-cyan)', width: '22px', height: '22px' }} />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Unlock Move: {pendingMove.from} ➔ {pendingMove.to}
                </span>
              </div>
              
              {gameMode === 'quick' ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.85rem',
                  color: quickTimer <= 3 ? '#ef4444' : 'var(--accent-cyan)',
                  fontWeight: 800,
                  background: 'rgba(255,255,255,0.05)',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}>
                  <Timer style={{ width: '15px', height: '15px' }} />
                  <span>{quickTimer}s</span>
                </div>
              ) : (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize', fontWeight: 800 }}>
                  {gameMode === 'story' ? 'story' : (currentChallenge as ChessChallenge).type} Mode
                </span>
              )}
            </div>

            {/* Prompt for Story Mode */}
            {gameMode === 'story' && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)', fontStyle: 'italic' }}>
                <strong>Story Context:</strong> "{(currentChallenge as StoryChallenge).prompt}"
              </div>
            )}

            {/* Question Text */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: 'var(--card-border)',
              padding: '1.25rem',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              lineHeight: '1.5',
              color: 'var(--text-main)'
            }}>
              {gameMode === 'story' ? 'Choose the next logical sentence to continue the story:' : (currentChallenge as ChessChallenge).question}
            </div>

            {/* Answer Options Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentChallenge.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentChallenge.answer;
                const isHintDisabled = disabledOptions.includes(idx);
                
                let optionStyle: React.CSSProperties = {
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-btn)',
                  border: 'var(--card-border)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  cursor: (selectedOption !== null || isHintDisabled) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isHintDisabled ? 0.3 : 1
                };

                if (selectedOption !== null) {
                  if (isCorrect) {
                    optionStyle.background = 'rgba(16, 185, 129, 0.15)';
                    optionStyle.border = '1px solid #10b981';
                    optionStyle.color = '#10b981';
                  } else if (isSelected) {
                    optionStyle.background = 'rgba(239, 68, 68, 0.15)';
                    optionStyle.border = '1px solid #ef4444';
                    optionStyle.color = '#ef4444';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null || isHintDisabled}
                    onClick={() => handleOptionSelect(idx)}
                    style={optionStyle}
                    className={selectedOption === null && !isHintDisabled ? 'hover-lift' : ''}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Clue Clue display */}
            {showClue && currentChallenge.clue && (
              <div style={{
                background: 'rgba(6, 182, 212, 0.05)',
                border: '1px dashed rgba(6, 182, 212, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--accent-cyan)',
                lineHeight: '1.4',
                fontWeight: 600
              }}>
                💡 Clue: {currentChallenge.clue}
              </div>
            )}

            {/* Feedback Message */}
            {feedbackMessage && (
              <div style={{
                background: feedbackMessage.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: feedbackMessage.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.85rem',
                borderRadius: '8px',
                color: feedbackMessage.success ? '#34d399' : '#f87171',
                fontSize: '0.88rem',
                fontWeight: 700,
                textAlign: 'center'
              }}>
                {feedbackMessage.text}
              </div>
            )}

            {/* Hint control buttons (Disabled in Quick mode to encourage speed) */}
            {gameMode !== 'quick' && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  disabled={selectedOption !== null || hintUsedCount >= 3 || disabledOptions.length > 0}
                  onClick={triggerFiftyFifty}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-btn)',
                    background: 'rgba(255,255,255,0.04)',
                    border: 'var(--card-border)',
                    color: 'var(--text-main)',
                    cursor: (selectedOption !== null || hintUsedCount >= 3 || disabledOptions.length > 0) ? 'not-allowed' : 'pointer',
                    opacity: (selectedOption !== null || hintUsedCount >= 3 || disabledOptions.length > 0) ? 0.5 : 1
                  }}
                >
                  ✂️ 50/50 ({3 - hintUsedCount} hints)
                </button>
                <button
                  type="button"
                  disabled={selectedOption !== null || hintUsedCount >= 3 || showClue}
                  onClick={triggerShowClue}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-btn)',
                    background: 'rgba(255,255,255,0.04)',
                    border: 'var(--card-border)',
                    color: 'var(--text-main)',
                    cursor: (selectedOption !== null || hintUsedCount >= 3 || showClue) ? 'not-allowed' : 'pointer',
                    opacity: (selectedOption !== null || hintUsedCount >= 3 || showClue) ? 0.5 : 1
                  }}
                >
                  💡 Show Clue
                </button>
              </div>
            )}

            {/* Bottom controls */}
            <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  setPendingMove(null);
                  setCurrentChallenge(null);
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-btn)',
                  cursor: 'pointer'
                }}
              >
                Cancel Move
              </button>
              
              {!feedbackMessage?.success && selectedOption !== null && (
                <button
                  type="button"
                  onClick={loadNewChallenge}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    background: 'var(--accent-gradient)',
                    border: 'none',
                    color: 'white',
                    borderRadius: 'var(--radius-btn)',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px var(--accent-glow)'
                  }}
                >
                  Try Another Question
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2. Game Over Modal Overlay Screen */}
      {isGameOver && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999999,
          padding: '1.5rem'
        }}>
          <div className="glass-card animate-pulse-slow" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            border: '2px solid var(--accent-cyan)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            
            <div>
              <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>🏆</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Match Concluded!</h2>
              <p style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginTop: '0.25rem', fontSize: '1.1rem' }}>
                {gameOverReason}
              </p>
            </div>

            {/* Performance Statistics Grid */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: 'var(--card-border)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              textAlign: 'left'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Score</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{score} Pts</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Moves Played</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{moveHistory.length}</strong>
              </div>
              
              {gameMode !== 'classic' && (
                <>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Correct Answers</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{correctAnswers}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Accuracy Rate</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--accent-pink)' }}>
                      {correctAnswers + wrongAnswers > 0
                        ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100)
                        : 0}%
                    </strong>
                  </div>
                </>
              )}
            </div>

            {/* Story output (Only in Story mode) */}
            {gameMode === 'story' && storyLog.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: 'var(--card-border)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 800, display: 'block', marginBottom: '0.4rem' }}>
                  📖 Your Created Story:
                </span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{storyLog.join(' ')}"
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={handleRestart}
                style={{
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  color: 'white',
                  padding: '0.9rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 'var(--radius-btn)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px var(--accent-glow)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Play Again 🔄
              </button>
              
              <button
                onClick={handleExitToModes}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-main)',
                  padding: '0.8rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  borderRadius: 'var(--radius-btn)',
                  cursor: 'pointer'
                }}
              >
                Change Game Mode
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
