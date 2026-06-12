import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { Flame, Star, Coins, Play, CheckCircle, Settings } from 'lucide-react';
import { getSchoolName } from '../data/schools';
import { db, isFirebaseEnabled } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LeaderboardModal } from './LeaderboardModal';

interface DashboardProps {
  onSelectGame: (gameId: string) => void;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectGame, onOpenSettings }) => {
  const { 
    name, 
    grade, 
    school, 
    xp, 
    coins, 
    streak, 
    theme, 
    completedGames, 
    grammarGalaxyLevelIndex, 
    phrasalVerbLevelIndex,
    modalLevelIndex,
    whatYesOrNoLevelIndex,
    wordRushLevelIndex,
    phonicsLevelIndex,
    modalTimeFusionLevelIndex,
    dailyActiveSeconds,
    chessHighScore,
    escapeRoomHighScore,
    riyanStoryLevelIndex
  } = useUserStore();

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchLeaderboard = async () => {
      if (!isFirebaseEnabled || !db || !school) {
        // Fallback to static mock data if firebase is disabled
        const mockData = [
          { name: 'Sneha', grade: grade || 'Grade 7', xp: 2200, isSelf: false },
          { name: 'Amit', grade: grade || 'Grade 7', xp: 1800, isSelf: false },
          { name: 'Rohan', grade: grade || 'Grade 7', xp: 1500, isSelf: false },
          { name: `${name} (You)`, grade: grade || 'Grade 7', xp: xp, isSelf: true }
        ];
        if (active) setLeaderboard(mockData.sort((a, b) => b.xp - a.xp));
        return;
      }

      setLoading(true);
      try {
        const q = query(collection(db, 'students'), where('school', '==', school));
        const querySnapshot = await getDocs(q);
        const playersList: any[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const isSelf = data.name === name || data.mobileNumber === useUserStore.getState().mobileNumber;
          playersList.push({
            name: isSelf ? `${name} (You)` : data.name,
            grade: data.grade || 'Grade 7',
            xp: data.xp || 0,
            isSelf
          });
        });

        // Ensure current student is present if not found in db query
        if (!playersList.some(p => p.isSelf)) {
          playersList.push({
            name: `${name} (You)`,
            grade: grade || 'Grade 7',
            xp: xp,
            isSelf: true
          });
        }

        // Sort by XP descending
        playersList.sort((a, b) => b.xp - a.xp);

        // If there are fewer than 4 players, fill with realistic mock players
        const baseMocks = [
          { name: 'Sneha', grade: grade || 'Grade 7', xp: 2200 },
          { name: 'Amit', grade: grade || 'Grade 7', xp: 1800 },
          { name: 'Rohan', grade: grade || 'Grade 7', xp: 1500 },
        ];
        
        let mockIndex = 0;
        while (playersList.length < 4 && mockIndex < baseMocks.length) {
          const mock = baseMocks[mockIndex++];
          if (!playersList.some(p => p.name === mock.name)) {
            playersList.push({ ...mock, isSelf: false });
          }
        }
        playersList.sort((a, b) => b.xp - a.xp);

        if (active) setLeaderboard(playersList);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        const mockData = [
          { name: 'Sneha', grade: grade || 'Grade 7', xp: 2200, isSelf: false },
          { name: 'Amit', grade: grade || 'Grade 7', xp: 1800, isSelf: false },
          { name: 'Rohan', grade: grade || 'Grade 7', xp: 1500, isSelf: false },
          { name: `${name} (You)`, grade: grade || 'Grade 7', xp: xp, isSelf: true }
        ];
        if (active) setLeaderboard(mockData.sort((a, b) => b.xp - a.xp));
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLeaderboard();
    return () => {
      active = false;
    };
  }, [school, name, xp, grade]);

  const games = [
    {
      id: 'grammar-galaxy',
      title: 'Time Expression Master ⏳',
      desc: 'Rearrange scattered words into perfect sentences. Master direct statements, questions, and negation.',
      duration: '55 Mins',
      difficulty: 'Easy',
      xpReward: 100,
      iconColor: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'word-rush',
      title: 'Word Rush ⚡',
      desc: 'Beat the clock in this speed test! Fill in correct subject-verb agreements and conjugations.',
      duration: '60 Mins',
      difficulty: 'Fast-paced',
      xpReward: 80,
      iconColor: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'phonics-matcher',
      title: 'Phonics Matcher 🔊',
      desc: 'Listen to spoken sounds and match them with their written spelling. Perfect for voice calibration.',
      duration: '60 Mins',
      difficulty: 'Easy',
      xpReward: 50,
      iconColor: 'from-amber-400 to-orange-600',
    },
    {
      id: 'phrasal-verbs',
      title: 'Phrasal Verb Explorer 🗺️',
      desc: 'Master 50+ high-frequency phrasal verbs. Fill in active dialogue blanks and practice verbal speech.',
      duration: '55 Mins',
      difficulty: 'Medium',
      xpReward: 120,
      iconColor: 'from-emerald-400 to-teal-600',
    },
    {
      id: 'modal-mind',
      title: 'Modal Mind 🧠',
      desc: 'Master modal verbs of ability, permission, advice, obligation, and probability. Navigate study decks and solve quizzes.',
      duration: '55 Mins',
      difficulty: 'Medium',
      xpReward: 120,
      iconColor: 'from-indigo-500 to-purple-600',
    },
    {
      id: 'what-yes-or-no',
      title: 'What Yes or No? 💬',
      desc: 'Master Yes/No questions and answers using combinations of modals and timewords across 22 comprehensive levels.',
      duration: '110 Mins',
      difficulty: 'Medium',
      xpReward: 120,
      iconColor: 'from-pink-500 to-rose-600',
    },
    {
      id: 'modal-time-fusion',
      title: 'Modal Time Fusion 🔮',
      desc: 'Master advanced conversational grammar by combining modal verbs, tenses, and timelines in complex dialogue pairs.',
      duration: '110 Mins',
      difficulty: 'Difficult',
      xpReward: 120,
      iconColor: 'from-fuchsia-600 to-pink-600',
    },
    {
      id: 'english-chess',
      title: 'English Chess ♟️',
      desc: 'Play standard chess against a computer bot! Unlock your moves by solving English vocabulary, grammar, and sentence building challenges.',
      duration: 'Adaptive',
      difficulty: 'Beginner / Intermediate / Advanced',
      xpReward: 100,
      iconColor: 'from-blue-600 to-indigo-800',
    },
    {
      id: 'escape-room',
      title: 'Escape Room English 🔐',
      desc: 'Escape a mysterious learning castle! Search room items to solve vocabulary, grammar, reading riddles, and keypad lock code puzzles.',
      duration: '60 Mins',
      difficulty: 'Beginner / Intermediate / Advanced',
      xpReward: 120,
      iconColor: 'from-fuchsia-500 to-indigo-600',
    },
    {
      id: 'riyan-story',
      title: 'How Riyan Learnt English 📚',
      desc: 'Join Riyan on an interactive animated quest to master English fluency! Complete 5 chapters of stories, animations, and grammar puzzles.',
      duration: '50 Mins',
      difficulty: 'Beginner / Intermediate',
      xpReward: 120,
      iconColor: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Main Title Banner */}
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          letterSpacing: '0.02em',
          background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase'
        }}>
          Excellence Voices Pro Games
        </h1>
      </div>
      
      {/* Header bar */}
      <header className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            color: '#fff',
            boxShadow: '0 0 15px var(--accent-glow)'
          }}>
            {theme === 'teen' ? '👦' : '🦉'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{name} ({grade})</h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{getSchoolName(school)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700 }}>
            <Flame style={{ color: '#f97316', fill: '#f97316', width: '20px', height: '20px' }} />
            <span>{streak} Days</span>
          </div>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700 }}>
            <Star style={{ color: '#eab308', fill: '#eab308', width: '20px', height: '20px' }} />
            <span>{xp} XP</span>
          </div>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700 }}>
            <Coins style={{ color: '#f59e0b', fill: '#f59e0b', width: '20px', height: '20px' }} />
            <span>{coins} Coins</span>
          </div>
          <button 
            onClick={onOpenSettings}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'var(--card-border)',
              color: 'var(--text-main)',
              padding: '0.5rem 1.25rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-btn)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            className="hover-lift"
          >
            <Settings style={{ width: '16px', height: '16px' }} />
            Settings
          </button>
        </div>
      </header>

      {/* Top Hero Section: Practice Routine & Standings Podium */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
        
        {/* Practice Routine Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📅 Daily Practice Routine
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Complete 40 minutes of daily active speaking and play to lock in today's learning streak!
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="70" height="70" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="35" cy="35" r="28" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="35" 
                  cy="35" 
                  r="28" 
                  stroke="var(--accent-cyan)" 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray={176}
                  strokeDashoffset={176 - (176 * Math.min(100, Math.round((dailyActiveSeconds / 2400) * 100))) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', fontSize: '0.95rem', fontWeight: 800 }}>
                {Math.min(100, Math.round((dailyActiveSeconds / 2400) * 100))}%
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Streak: {streak} days 🔥
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Active Today: <strong>{Math.floor(dailyActiveSeconds / 60)} Mins</strong> of 40 Mins limit
              </div>
            </div>
          </div>
        </div>

        {/* Excellence Standings Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', gap: '1rem' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '120px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
              Loading Standings...
            </div>
          ) : (
            (() => {
              const playersWithRank = leaderboard.map((p, idx) => ({ ...p, rank: idx + 1 }));
              const selfIndex = playersWithRank.findIndex(p => p.isSelf);
              const selfRank = selfIndex >= 0 ? selfIndex + 1 : 1;
              const selfPlayer = selfIndex >= 0 ? playersWithRank[selfIndex] : { name: name, grade: grade, xp: xp, isSelf: true, rank: 1 };

              let dashboardPlayers: any[] = [];
              if (selfIndex <= 2 || selfIndex === -1) {
                dashboardPlayers = playersWithRank.slice(0, 4);
              } else {
                dashboardPlayers = [
                  ...playersWithRank.slice(0, 3),
                  selfPlayer
                ];
              }

              const podiumPositions = [
                { player: dashboardPlayers[1], rank: dashboardPlayers[1]?.rank || 2 },
                { player: dashboardPlayers[0], rank: dashboardPlayers[0]?.rank || 1 },
                { player: dashboardPlayers[2], rank: dashboardPlayers[2]?.rank || 3 },
                { player: dashboardPlayers[3], rank: dashboardPlayers[3]?.rank || 4 }
              ];

              return (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-divider)', paddingBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                      🏆 {getSchoolName(school) || 'School'} Standings
                    </h3>
                    <button 
                      onClick={() => setShowLeaderboardModal(true)}
                      style={{ 
                        fontSize: '0.78rem', 
                        color: 'var(--accent-cyan)', 
                        fontWeight: 800, 
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        background: 'rgba(6, 182, 212, 0.08)',
                        border: '1px solid rgba(6, 182, 212, 0.2)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Rank #{selfRank} of {playersWithRank.length} 🔍
                    </button>
                  </div>

                  {/* Horizontal Podium Layout */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', alignItems: 'end', marginTop: '0.25rem', minHeight: '120px' }}>
                    {podiumPositions.map((item, idx) => {
                      const rank = item.rank;
                      const player = item.player;
                      if (!player) return null;
                      const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '⚡';
                      const isSelf = player.isSelf;

                      const barHeight = rank === 1 ? '55px' : rank === 2 ? '42px' : rank === 3 ? '32px' : '22px';

                      return (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            textAlign: 'center',
                            cursor: 'pointer'
                          }}
                          onClick={() => setShowLeaderboardModal(true)}
                        >
                          {/* Name & Medal */}
                          <div style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: isSelf ? 800 : 600, 
                            color: isSelf ? 'var(--accent-cyan)' : 'var(--text-main)',
                            maxWidth: '75px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginBottom: '0.25rem'
                          }}>
                            {rankEmoji} {player.name.replace(' (You)', '')}
                          </div>

                          {/* XP value */}
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 700 }}>
                            {player.xp} XP
                          </div>

                          {/* Podium Pillar */}
                          <div style={{
                            width: '100%',
                            height: barHeight,
                            background: isSelf ? 'var(--accent-gradient)' : 'var(--level-card-bg)',
                            border: isSelf ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-divider)',
                            borderRadius: '8px 8px 0 0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isSelf ? '#fff' : 'var(--text-muted)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            boxShadow: isSelf ? '0 -4px 10px var(--accent-glow)' : 'none'
                          }}>
                            #{rank}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()
          )}
        </div>

      </div>

      {/* Roadmap & Games List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', marginTop: '0.5rem' }}>
        
        <div className="glass-card animate-pulse-slow" style={{ border: 'var(--border-width) var(--border-style) var(--accent-cyan)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📚 Excellence English Mastery Hub
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Welcome! Start playing interactive grammar challenges below. Earn XP, grow your daily streak, and unlock Certificates!
          </p>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🎮 Available Grammar Games
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {games.map((game) => {
            const isCompleted = completedGames.includes(game.id);
            return (
              <div 
                key={game.id}
                className="glass-card hover-lift game-card"
                onClick={() => onSelectGame(game.id)}
              >
                <div className="game-card-content">
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '16px',
                    background: 'var(--accent-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'white'
                  }}>
                    {game.id === 'grammar-galaxy' ? '🌌' : game.id === 'word-rush' ? '⚡' : game.id === 'phrasal-verbs' ? '🗺️' : game.id === 'modal-mind' ? '🧠' : game.id === 'what-yes-or-no' ? '💬' : game.id === 'modal-time-fusion' ? '🔮' : game.id === 'english-chess' ? '♟️' : game.id === 'escape-room' ? '🔐' : '🔊'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {game.title}
                      {isCompleted && (
                        <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981', fill: '#10b981' }} />
                      )}
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', maxWidth: '100%' }}>
                      {game.desc}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: 600, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--text-muted)' }}>⏱️ {game.duration}</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>⭐ +{game.xpReward} XP</span>
                      <span style={{ color: '#eab308' }}>🏆 {game.difficulty}</span>
                      {['grammar-galaxy', 'modal-mind', 'what-yes-or-no', 'modal-time-fusion'].includes(game.id) && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectGame(`view-certificate-${game.id}`);
                          }}
                          style={{
                            background: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid #10b981',
                            color: '#10b981',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.2s',
                            marginLeft: '0.25rem'
                          }}
                          className="hover-lift"
                        >
                          🎓 View Certificate
                        </button>
                      )}
                    </div>

                    {game.id === 'grammar-galaxy' && grammarGalaxyLevelIndex > 0 && !isCompleted && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>
                          <span>Hub Progress</span>
                          <span>Level {grammarGalaxyLevelIndex + 1} of 11 ({Math.round((grammarGalaxyLevelIndex / 11) * 100)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${(grammarGalaxyLevelIndex / 11) * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                        </div>
                      </div>
                    )}

                    {game.id === 'word-rush' && wordRushLevelIndex > 0 && !isCompleted && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>
                          <span>Level Progress</span>
                          <span>Level {wordRushLevelIndex + 1} of 12 ({Math.round((wordRushLevelIndex / 12) * 100)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${(wordRushLevelIndex / 12) * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                        </div>
                      </div>
                    )}

                    {game.id === 'phonics-matcher' && phonicsLevelIndex > 0 && !isCompleted && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>
                          <span>Level Progress</span>
                          <span>Level {phonicsLevelIndex + 1} of 12 ({Math.round((phonicsLevelIndex / 12) * 100)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${(phonicsLevelIndex / 12) * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                        </div>
                      </div>
                    )}

                    {game.id === 'phrasal-verbs' && phrasalVerbLevelIndex > 0 && !isCompleted && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>
                          <span>Level Progress</span>
                          <span>Level {phrasalVerbLevelIndex + 1} of 11 ({Math.round((phrasalVerbLevelIndex / 11) * 100)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${(phrasalVerbLevelIndex / 11) * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                        </div>
                      </div>
                    )}

                    {game.id === 'modal-mind' && modalLevelIndex > 0 && !isCompleted && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>
                          <span>Level Progress</span>
                          <span>Level {modalLevelIndex + 1} of 11 ({Math.round((modalLevelIndex / 11) * 100)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${(modalLevelIndex / 11) * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                        </div>
                      </div>
                    )}

                    {game.id === 'what-yes-or-no' && whatYesOrNoLevelIndex > 0 && !isCompleted && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>
                          <span>Level Progress</span>
                          <span>Level {whatYesOrNoLevelIndex + 1} of 22 ({Math.round((whatYesOrNoLevelIndex / 22) * 100)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${(whatYesOrNoLevelIndex / 22) * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                        </div>
                      </div>
                    )}

                    {game.id === 'modal-time-fusion' && modalTimeFusionLevelIndex > 0 && !isCompleted && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>
                          <span>Level Progress</span>
                          <span>Level {modalTimeFusionLevelIndex + 1} of 11 ({Math.round((modalTimeFusionLevelIndex / 11) * 100)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${(modalTimeFusionLevelIndex / 11) * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                        </div>
                      </div>
                    )}

                    {game.id === 'english-chess' && chessHighScore > 0 && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                          🏆 High Score: {chessHighScore} Pts
                        </div>
                      </div>
                    )}

                    {game.id === 'escape-room' && escapeRoomHighScore > 0 && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                          🏆 High Score: {escapeRoomHighScore} Pts
                        </div>
                      </div>
                    )}

                    {game.id === 'riyan-story' && riyanStoryLevelIndex > 0 && riyanStoryLevelIndex < 5 && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>
                          <span>Story Progress</span>
                          <span>Level {riyanStoryLevelIndex + 1} of 5 ({Math.round((riyanStoryLevelIndex / 5) * 100)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${(riyanStoryLevelIndex / 5) * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {((game.id === 'grammar-galaxy' && grammarGalaxyLevelIndex > 0) || 
                  (game.id === 'word-rush' && wordRushLevelIndex > 0) ||
                  (game.id === 'phonics-matcher' && phonicsLevelIndex > 0) ||
                  (game.id === 'phrasal-verbs' && phrasalVerbLevelIndex > 0) ||
                  (game.id === 'modal-mind' && modalLevelIndex > 0) ||
                  (game.id === 'what-yes-or-no' && whatYesOrNoLevelIndex > 0) ||
                  (game.id === 'modal-time-fusion' && modalTimeFusionLevelIndex > 0) ||
                  (game.id === 'riyan-story' && riyanStoryLevelIndex > 0 && riyanStoryLevelIndex < 5)) && !isCompleted ? (
                  <button className="game-card-resume-btn">
                    <Play style={{ width: '14px', height: '14px', fill: 'currentColor' }} />
                    Resume
                  </button>
                ) : (
                  <button className="game-card-btn">
                    <Play style={{ width: '16px', height: '16px', fill: 'currentColor', marginLeft: '2px' }} />
                    <span className="game-card-btn-text">Play Now</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {showLeaderboardModal && (
        <LeaderboardModal 
          onClose={() => setShowLeaderboardModal(false)} 
          leaderboard={leaderboard} 
        />
      )}

      {/* Renvix Technologies Branding Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '1.5rem 0 0.5rem 0', 
        borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
        marginTop: '1rem',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <span>A Product of </span>
        <a 
          href="https://renvixteach.in" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: 'var(--accent-cyan)', 
            fontWeight: 800, 
            textDecoration: 'none',
            borderBottom: '1px dashed var(--accent-cyan)',
            paddingBottom: '2px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-purple)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
        >
          Renvix Technologies
        </a>
      </footer>
    </div>
  );
};
