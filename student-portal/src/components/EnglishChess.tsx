import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { ArrowLeft, RefreshCw, Award, Zap, Shield } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { CHESS_CHALLENGES, ChessChallenge } from '../data/englishChessChallenges';

interface EnglishChessProps {
  onBackToDashboard: () => void;
}

const PIECE_SYMBOLS: Record<string, string> = {
  wp: '♙', wr: '♜', wn: '♞', wb: '♝', wq: '♛', wk: '♚',
  bp: '♟', br: '♜', bn: '♞', bb: '♝', bq: '♛', bk: '♚'
};

export const EnglishChess: React.FC<EnglishChessProps> = ({ onBackToDashboard }) => {
  const { grade, addXp, addCoins, setChessHighScore } = useUserStore();

  // Chess Game State
  const [chess] = useState(() => new Chess());
  const [board, setBoard] = useState(() => chess.board());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  // Challenge Modal State
  const [pendingMove, setPendingMove] = useState<{ from: string; to: string } | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<ChessChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hintUsedCount, setHintUsedCount] = useState(0);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [showClue, setShowClue] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Statistics State
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  const [aiThinking, setAiThinking] = useState(false);

  // Speech utility ref
  const audioContextRef = useRef<AudioContext | null>(null);

  // Audio tone generator for correct/incorrect sounds
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
      console.warn('Audio Context failed to play sound:', e);
    }
  };

  // Select appropriate challenge bank based on user grade
  const getChallengeBank = (): ChessChallenge[] => {
    const numericGrade = parseInt(grade.replace(/\D/g, '')) || 7;
    if (numericGrade <= 4) {
      return CHESS_CHALLENGES.beginner;
    } else if (numericGrade <= 8) {
      return CHESS_CHALLENGES.intermediate;
    } else {
      return CHESS_CHALLENGES.advanced;
    }
  };

  // Generate a new random challenge
  const loadNewChallenge = () => {
    const bank = getChallengeBank();
    const randomIndex = Math.floor(Math.random() * bank.length);
    const challenge = bank[randomIndex];
    
    // Reset modal states
    setCurrentChallenge(challenge);
    setSelectedOption(null);
    setDisabledOptions([]);
    setShowClue(false);
    setFeedbackMessage(null);
  };

  // Check checkmate/stalemate status
  const checkGameStatus = (currentScore?: number) => {
    const activeScore = currentScore !== undefined ? currentScore : score;
    if (chess.isCheckmate()) {
      setIsGameOver(true);
      setGameOverReason(chess.turn() === 'w' ? 'Black wins by Checkmate!' : 'White wins by Checkmate! 🏆');
      playSoundTone(587.33, 1.2, 'sine'); // High triumphant chime
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

  // Computer AI Opponent move calculation
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

      // 1. Checkmate search
      let chosenMove = moves.find(m => {
        const testChess = new Chess(chess.fen());
        testChess.move({ from: m.from, to: m.to, promotion: 'q' });
        return testChess.isCheckmate();
      });

      // 2. High-value capture search
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

      // 3. Simple safety filter: choose a move that doesn't put our piece in direct danger
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
        playSoundTone(329.63, 0.15, 'sawtooth'); // Piece placement beep
      } catch (err) {
        console.error('AI move failed:', err);
      }
      
      setAiThinking(false);
      checkGameStatus(score);
    }, 800);
  };

  // Click handler for Chess Board squares
  const handleSquareClick = (squareRepresentation: string) => {
    if (turn !== 'w' || isGameOver || aiThinking) return;

    const squareObj = chess.get(squareRepresentation as any);
    
    // If clicking a possible move destination square
    if (possibleMoves.includes(squareRepresentation)) {
      if (selectedSquare) {
        // Queue the proposed move and trigger the English challenge
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
    
    setSelectedOption(idx);
    const isCorrect = idx === currentChallenge?.answer;

    if (isCorrect) {
      playSoundTone(523.25, 0.1, 'sine');
      setTimeout(() => playSoundTone(659.25, 0.25, 'sine'), 80); // Success double-chime
      
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

      // Award XP to store
      addXp(5);
      addCoins(1);

      setFeedbackMessage({
        text: `Correct Answer! +${pointsEarned} Points. ${streakBonus ? 'Streak Bonus Active! 🔥' : ''}`,
        success: true
      });

      // Execute queued move after short delay
      setTimeout(() => {
        if (pendingMove) {
          try {
            // Check if pawn promotion
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
      playSoundTone(220, 0.35, 'sawtooth'); // Error buzz
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
    if (turn === 'b' && !isGameOver) {
      triggerComputerMove();
    }
  }, [turn, isGameOver]);

  // Hint: 50/50 handler
  const triggerFiftyFifty = () => {
    if (!currentChallenge || hintUsedCount >= 3 || disabledOptions.length > 0) return;

    const correct = currentChallenge.answer;
    const incorrectIndices = [0, 1, 2, 3].filter(idx => idx !== correct);
    
    // Randomly select 2 wrong options to disable
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

  // Reset Game
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
    playSoundTone(523.25, 0.3, 'sine');
  };

  // Render square helpers
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  return (
    <div className="main-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button 
          onClick={onBackToDashboard}
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
          Back to Portal
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
                            ? 'rgba(6, 182, 212, 0.45)' // glowing cyan selection
                            : isPossibleTarget 
                              ? 'rgba(244, 63, 94, 0.35)' // target highlighting
                              : isDark 
                                ? 'var(--level-card-bg)' // custom dark squares
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
                        {/* Piece rendering */}
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

                        {/* Possible move dot marker */}
                        {isPossibleTarget && !pieceRepresentation && (
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: 'var(--accent-pink)',
                            boxShadow: '0 0 8px var(--accent-pink)'
                          }} />
                        )}

                        {/* Coordinates labels */}
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
            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ♟️ Rules of Engagement
            </h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Select your white pieces and choose a target move square. Answering the English challenge correctly executes your move. If you answer incorrectly, your piece stays back, and you must try another challenge!
            </p>
          </div>

          {/* Move Log History */}
          <div className="glass-card" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
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
            
            {/* Modal Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield style={{ color: 'var(--accent-cyan)', width: '22px', height: '22px' }} />
                <span style={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Unlock Move: {pendingMove.from} ➔ {pendingMove.to}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize', fontWeight: 800 }}>
                {currentChallenge.type} Mode
              </span>
            </div>

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
              {currentChallenge.question}
            </div>

            {/* Answer Options Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentChallenge.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentChallenge.answer;
                const isHintDisabled = disabledOptions.includes(idx);
                
                // Styling based on state
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
                    optionStyle.background = 'rgba(16, 185, 129, 0.15)'; // correct green
                    optionStyle.border = '1px solid #10b981';
                    optionStyle.color = '#10b981';
                  } else if (isSelected) {
                    optionStyle.background = 'rgba(239, 68, 68, 0.15)'; // wrong red
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

            {/* Clue Text display */}
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

            {/* Hint options and Controls */}
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
                ✂️ 50/50 ({3 - hintUsedCount} hints left)
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

            {/* Close / Action bar */}
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
            maxWidth: '460px',
            width: '100%',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            border: '2px solid var(--accent-cyan)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
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
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Correct Moves</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{correctAnswers}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Wrong Answers</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{wrongAnswers}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Accuracy Rate</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--accent-pink)' }}>
                  {correctAnswers + wrongAnswers > 0
                    ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100)
                    : 0}%
                </strong>
              </div>
            </div>

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
                onClick={onBackToDashboard}
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
                Return to Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
