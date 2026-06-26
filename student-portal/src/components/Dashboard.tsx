import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { Flame, Star, Coins, Play, CheckCircle, Settings } from 'lucide-react';
import { getSchoolName } from '../data/schools';
import { db, isFirebaseEnabled } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
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
    riyanStoryLevelIndex,
    speakScoreHighScore,
    idiomMatchLevelIndex,
    timeTransformerLevelIndex
  } = useUserStore();

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<any[]>([]);
  const [leaderboardTab, setLeaderboardTab] = useState<'school' | 'global'>('school');
  const [loading, setLoading] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showNewGamesPopup, setShowNewGamesPopup] = useState<boolean>(false);

  const isNewGame = (gameId: string): boolean => {
    const newGameIds = ['speak-score', 'idiom-match', 'time-transformer'];
    if (!newGameIds.includes(gameId)) return false;
    
    // 7 days from release date (2026-06-26)
    const releaseDate = new Date('2026-06-26T00:00:00').getTime();
    const currentDate = new Date().getTime();
    const diffDays = (currentDate - releaseDate) / (1000 * 60 * 60 * 24);
    
    return diffDays >= 0 && diffDays <= 7;
  };

  useEffect(() => {
    const releaseDate = new Date('2026-06-26T00:00:00').getTime();
    const currentDate = new Date().getTime();
    const diffDays = (currentDate - releaseDate) / (1000 * 60 * 60 * 24);
    
    if (diffDays >= 0 && diffDays <= 5) {
      const dismissed = localStorage.getItem('excellence-voices-new-games-popup-dismissed');
      if (!dismissed) {
        setShowNewGamesPopup(true);
      }
    }
  }, []);

  const handleDismissPopup = () => {
    localStorage.setItem('excellence-voices-new-games-popup-dismissed', 'true');
    setShowNewGamesPopup(false);
  };

  const handlePlayGameFromPopup = (gameId: string) => {
    localStorage.setItem('excellence-voices-new-games-popup-dismissed', 'true');
    setShowNewGamesPopup(false);
    onSelectGame(gameId);
  };

  useEffect(() => {
    let active = true;
    const fetchLeaderboard = async () => {
      const fallbackSchool = [
        { name: 'Sneha', grade: grade || 'Grade 7', school: school || 'exscl-02', xp: 2200, isSelf: false },
        { name: 'Amit', grade: grade || 'Grade 7', school: school || 'exscl-02', xp: 1800, isSelf: false },
        { name: 'Rohan', grade: grade || 'Grade 7', school: school || 'exscl-02', xp: 1500, isSelf: false },
        { name: `${name} (You)`, grade: grade || 'Grade 7', school: school || 'exscl-02', xp: xp, isSelf: true }
      ];

      const getFallbackGlobal = () => {
        const list = [
          { name: 'Aditya', grade: 'Grade 8', school: 'exscl-01', xp: 4500, isSelf: false },
          { name: 'Sneha', grade: grade || 'Grade 7', school: 'exscl-02', xp: 3800, isSelf: false },
          { name: 'Vikram', grade: 'Grade 9', school: 'exscl-05', xp: 3500, isSelf: false },
          { name: 'Priya', grade: 'Grade 6', school: 'exscl-03', xp: 3200, isSelf: false },
          { name: 'Rahul', grade: 'Grade 8', school: 'exscl-06', xp: 2900, isSelf: false },
          { name: 'Ananya', grade: 'Grade 7', school: 'exscl-01', xp: 2700, isSelf: false },
          { name: 'Karan', grade: 'Grade 9', school: 'exscl-04', xp: 2500, isSelf: false },
          { name: 'Tanvi', grade: 'Grade 6', school: 'exscl-07', xp: 2300, isSelf: false },
          { name: 'Kunal', grade: 'Grade 8', school: 'exscl-08', xp: 2100, isSelf: false },
          { name: 'Riddhi', grade: 'Grade 7', school: 'exscl-09', xp: 2000, isSelf: false },
          { name: 'Amit', grade: grade || 'Grade 7', school: 'exscl-02', xp: 1800, isSelf: false },
          { name: 'Rohan', grade: grade || 'Grade 7', school: 'exscl-02', xp: 1500, isSelf: false },
          { name: 'Siddharth', grade: 'Grade 9', school: 'exscl-10', xp: 1700, isSelf: false },
          { name: 'Meera', grade: 'Grade 8', school: 'exscl-11', xp: 1600, isSelf: false },
          { name: 'Dev', grade: 'Grade 6', school: 'exscl-12', xp: 1400, isSelf: false },
          { name: 'Riya', grade: 'Grade 7', school: 'exscl-13', xp: 1300, isSelf: false },
          { name: 'Arjun', grade: 'Grade 9', school: 'exscl-14', xp: 1200, isSelf: false },
          { name: 'Ishita', grade: 'Grade 8', school: 'exscl-15', xp: 1100, isSelf: false },
          { name: 'Yash', grade: 'Grade 7', school: 'exscl-16', xp: 950, isSelf: false },
          { name: 'Nisha', grade: 'Grade 6', school: 'exscl-17', xp: 800, isSelf: false }
        ];

        // Ensure user is present in fallback global
        if (!list.some(p => p.name.includes('(You)') || p.isSelf)) {
          list.push({
            name: `${name} (You)`,
            grade: grade || 'Grade 7',
            school: school || 'exscl-02',
            xp: xp,
            isSelf: true
          });
        }
        return list.sort((a, b) => b.xp - a.xp);
      };

      if (!isFirebaseEnabled || !db) {
        if (active) {
          setLeaderboard(fallbackSchool.sort((a, b) => b.xp - a.xp));
          setGlobalLeaderboard(getFallbackGlobal());
        }
        return;
      }

      setLoading(true);
      try {
        // Fetch School Leaderboard
        let schoolPlayers: any[] = [];
        if (school) {
          const qSchool = query(collection(db, 'students'), where('school', '==', school));
          const querySnapshot = await getDocs(qSchool);
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const isSelf = data.name === name || data.mobileNumber === useUserStore.getState().mobileNumber;
            schoolPlayers.push({
              name: isSelf ? `${name} (You)` : data.name,
              grade: data.grade || 'Grade 7',
              school: data.school || school,
              xp: data.xp || 0,
              isSelf
            });
          });
        }

        if (!schoolPlayers.some(p => p.isSelf)) {
          schoolPlayers.push({
            name: `${name} (You)`,
            grade: grade || 'Grade 7',
            school: school || 'exscl-02',
            xp: xp,
            isSelf: true
          });
        }
        schoolPlayers.sort((a, b) => b.xp - a.xp);

        // Fill school if needed
        const baseMocks = [
          { name: 'Sneha', grade: grade || 'Grade 7', school: school || 'exscl-02', xp: 2200 },
          { name: 'Amit', grade: grade || 'Grade 7', school: school || 'exscl-02', xp: 1800 },
          { name: 'Rohan', grade: grade || 'Grade 7', school: school || 'exscl-02', xp: 1500 },
        ];
        let mockIndex = 0;
        while (schoolPlayers.length < 4 && mockIndex < baseMocks.length) {
          const mock = baseMocks[mockIndex++];
          if (!schoolPlayers.some(p => p.name === mock.name)) {
            schoolPlayers.push({ ...mock, isSelf: false });
          }
        }
        schoolPlayers.sort((a, b) => b.xp - a.xp);

        // Fetch Global Leaderboard (limiting queries is good, but we can query top 50 in firestore using limit)
        const qGlobal = query(collection(db, 'students'), orderBy('xp', 'desc'), limit(50));
        const globalSnapshot = await getDocs(qGlobal);
        const globalPlayers: any[] = [];
        globalSnapshot.forEach((doc) => {
          const data = doc.data();
          const isSelf = data.name === name || data.mobileNumber === useUserStore.getState().mobileNumber;
          globalPlayers.push({
            name: isSelf ? `${name} (You)` : data.name,
            grade: data.grade || 'Grade 7',
            school: data.school || 'exscl-02',
            xp: data.xp || 0,
            isSelf
          });
        });

        // Ensure user is present in global list
        if (!globalPlayers.some(p => p.isSelf)) {
          globalPlayers.push({
            name: `${name} (You)`,
            grade: grade || 'Grade 7',
            school: school || 'exscl-02',
            xp: xp,
            isSelf: true
          });
        }
        globalPlayers.sort((a, b) => b.xp - a.xp);

        // Fill global if fewer than 20
        const globalMocks = getFallbackGlobal();
        let gMockIndex = 0;
        while (globalPlayers.length < 20 && gMockIndex < globalMocks.length) {
          const mock = globalMocks[gMockIndex++];
          if (!globalPlayers.some(p => p.name.replace(' (You)', '') === mock.name.replace(' (You)', ''))) {
            globalPlayers.push({ ...mock, isSelf: false });
          }
        }
        globalPlayers.sort((a, b) => b.xp - a.xp);

        if (active) {
          setLeaderboard(schoolPlayers);
          setGlobalLeaderboard(globalPlayers);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        if (active) {
          setLeaderboard(fallbackSchool.sort((a, b) => b.xp - a.xp));
          setGlobalLeaderboard(getFallbackGlobal());
        }
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
    {
      id: 'speak-score',
      title: 'Speak & Score 🎤',
      desc: 'Improve your pronunciation and speaking confidence! Read sentences aloud and get real-time feedback on Accuracy, Pronunciation, and Fluency.',
      duration: 'Adaptive',
      difficulty: 'Beginner / Intermediate / Advanced',
      xpReward: 100,
      iconColor: 'from-emerald-400 to-green-600',
    },
    {
      id: 'idiom-match',
      title: 'Idiom Match 🧩',
      desc: 'Master 50+ common English idioms! Learn their meanings and solve matching puzzles across 10 interactive levels.',
      duration: '50 Mins',
      difficulty: 'Easy / Medium',
      xpReward: 120,
      iconColor: 'from-amber-500 to-yellow-600',
    },
    {
      id: 'time-transformer',
      title: 'Time Expression Transformer 🔮',
      desc: 'Master advanced verb tenses by speaking sentences transformed with targeted time words across 11 levels.',
      duration: '60 Mins',
      difficulty: 'Difficult',
      xpReward: 120,
      iconColor: 'from-fuchsia-600 to-pink-600',
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
              const currentLeaderboard = leaderboardTab === 'school' ? leaderboard : globalLeaderboard;
              const playersWithRank = currentLeaderboard.map((p, idx) => ({ ...p, rank: idx + 1 }));
              const selfIndex = playersWithRank.findIndex(p => p.isSelf);
              const selfRank = selfIndex >= 0 ? selfIndex + 1 : 1;
              const selfPlayer = selfIndex >= 0 ? playersWithRank[selfIndex] : { name: name, grade: grade, school: school, xp: xp, isSelf: true, rank: 1 };

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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderBottom: '1px solid var(--border-divider)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                        🏆 {leaderboardTab === 'school' ? (getSchoolName(school) || 'School') : 'All Schools'} Standings
                      </h3>
                      <button 
                        onClick={() => setShowLeaderboardModal(true)}
                        style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--accent-cyan)', 
                          fontWeight: 800, 
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          background: 'rgba(6, 182, 212, 0.08)',
                          border: '1px solid rgba(6, 182, 212, 0.2)',
                          padding: '3px 8px',
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

                    {/* Tab Switcher */}
                    <div style={{ 
                      display: 'flex', 
                      background: theme === 'kids' ? '#f0f9ff' : 'rgba(255, 255, 255, 0.04)', 
                      borderRadius: '8px', 
                      padding: '2px', 
                      border: theme === 'kids' ? '1px solid #bae6fd' : '1px solid rgba(255, 255, 255, 0.06)',
                      width: 'fit-content'
                    }}>
                      <button
                        onClick={() => setLeaderboardTab('school')}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          background: leaderboardTab === 'school' 
                            ? (theme === 'kids' ? '#0284c7' : 'var(--accent-gradient)') 
                            : 'transparent',
                          color: leaderboardTab === 'school' 
                            ? '#ffffff' 
                            : (theme === 'kids' ? '#0369a1' : 'var(--text-muted)'),
                          boxShadow: leaderboardTab === 'school' && theme !== 'kids' ? '0 2px 8px var(--accent-glow)' : 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        🏫 My School
                      </button>
                      <button
                        onClick={() => setLeaderboardTab('global')}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          background: leaderboardTab === 'global' 
                            ? (theme === 'kids' ? '#0284c7' : 'var(--accent-gradient)') 
                            : 'transparent',
                          color: leaderboardTab === 'global' 
                            ? '#ffffff' 
                            : (theme === 'kids' ? '#0369a1' : 'var(--text-muted)'),
                          boxShadow: leaderboardTab === 'global' && theme !== 'kids' ? '0 2px 8px var(--accent-glow)' : 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        🌍 Global (Top 20)
                      </button>
                    </div>
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
                    {game.id === 'grammar-galaxy' ? '🌌' : game.id === 'word-rush' ? '⚡' : game.id === 'phrasal-verbs' ? '🗺️' : game.id === 'modal-mind' ? '🧠' : game.id === 'what-yes-or-no' ? '💬' : game.id === 'modal-time-fusion' ? '🔮' : game.id === 'english-chess' ? '♟️' : game.id === 'escape-room' ? '🔐' : game.id === 'speak-score' ? '🎤' : game.id === 'idiom-match' ? '🧩' : game.id === 'time-transformer' ? '🔮' : '🔊'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {game.title}
                      {isCompleted && (
                        <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981', fill: '#10b981' }} />
                      )}
                      {isNewGame(game.id) && (
                        <span style={{
                          background: 'linear-gradient(to right, #f43f5e, #be185d)',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '50px',
                          fontWeight: 800,
                          letterSpacing: '0.05em',
                          animation: 'pulse 1.5s infinite ease-in-out',
                          boxShadow: '0 2px 8px rgba(244, 63, 94, 0.4)'
                        }}>
                          NEW 🚀
                        </span>
                      )}
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', maxWidth: '100%' }}>
                      {game.desc}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: 600, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--text-muted)' }}>⏱️ {game.duration}</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>⭐ +{game.xpReward} XP</span>
                      <span style={{ color: '#eab308' }}>🏆 {game.difficulty}</span>
                      {['grammar-galaxy', 'modal-mind', 'what-yes-or-no', 'modal-time-fusion', 'time-transformer'].includes(game.id) && (
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

                    {game.id === 'speak-score' && speakScoreHighScore > 0 && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                          🏆 High Score: {speakScoreHighScore}%
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

                    {game.id === 'idiom-match' && idiomMatchLevelIndex > 0 && idiomMatchLevelIndex < 10 && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>
                          <span>Level Progress</span>
                          <span>Level {idiomMatchLevelIndex + 1} of 10 ({Math.round((idiomMatchLevelIndex / 10) * 100)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${(idiomMatchLevelIndex / 10) * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                        </div>
                      </div>
                    )}

                    {game.id === 'time-transformer' && timeTransformerLevelIndex > 0 && timeTransformerLevelIndex < 11 && (
                      <div style={{ marginTop: '0.75rem', width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>
                          <span>Level Progress</span>
                          <span>Level {timeTransformerLevelIndex + 1} of 11 ({Math.round((timeTransformerLevelIndex / 11) * 100)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${(timeTransformerLevelIndex / 11) * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
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
                  (game.id === 'riyan-story' && riyanStoryLevelIndex > 0 && riyanStoryLevelIndex < 5) ||
                  (game.id === 'idiom-match' && idiomMatchLevelIndex > 0 && idiomMatchLevelIndex < 10) ||
                  (game.id === 'time-transformer' && timeTransformerLevelIndex > 0 && timeTransformerLevelIndex < 11)) && !isCompleted ? (
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
          schoolLeaderboard={leaderboard} 
          globalLeaderboard={globalLeaderboard}
          initialTab={leaderboardTab}
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

      {showNewGamesPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1.5rem',
          boxSizing: 'border-box'
        }}>
          <div className="glass-card" style={{
            maxWidth: '650px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid var(--accent-cyan)',
            borderRadius: '24px',
            padding: '2rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: '0 20px 50px rgba(6, 182, 212, 0.25)',
            position: 'relative',
            color: '#ffffff',
            boxSizing: 'border-box'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'var(--accent-gradient)',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 800,
                padding: '0.3rem 0.8rem',
                borderRadius: '50px',
                display: 'inline-block',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>
                🎉 Update Released!
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, background: 'linear-gradient(to right, #06b6d4, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Three New English Games!
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                We have added three brand-new interactive speaking and match games to help you build confidence and master English!
              </p>
            </div>

            {/* Games Showcase */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Game 1: Speak & Score */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }} 
              className="hover-lift"
              onClick={() => handlePlayGameFromPopup('speak-score')}
              >
                <div style={{ fontSize: '2rem', background: 'rgba(16, 185, 129, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
                  🎤
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Speak & Score
                    <span style={{ fontSize: '0.65rem', background: '#10b981', color: 'white', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>NEW</span>
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0 0', lineHeight: '1.3' }}>
                    Practice reading sentences aloud and get immediate AI evaluation on your Accuracy, Pronunciation, and Fluency!
                  </p>
                </div>
              </div>

              {/* Game 2: Idiom Match */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }} 
              className="hover-lift"
              onClick={() => handlePlayGameFromPopup('idiom-match')}
              >
                <div style={{ fontSize: '2rem', background: 'rgba(245, 158, 11, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
                  🧩
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Idiom Match
                    <span style={{ fontSize: '0.65rem', background: '#f59e0b', color: 'white', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>NEW</span>
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0 0', lineHeight: '1.3' }}>
                    Learn 50+ common English idioms with voice guidelines, then test your knowledge with interactive matching puzzles.
                  </p>
                </div>
              </div>

              {/* Game 3: Time Expression Transformer */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }} 
              className="hover-lift"
              onClick={() => handlePlayGameFromPopup('time-transformer')}
              >
                <div style={{ fontSize: '2rem', background: 'rgba(168, 85, 247, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', flexShrink: 0 }}>
                  🔮
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Time Expression Transformer
                    <span style={{ fontSize: '0.65rem', background: '#a855f7', color: 'white', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>NEW</span>
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0 0', lineHeight: '1.3' }}>
                    Transform base simple present sentences to match advanced time expressions in 11 progressive speech challenges!
                  </p>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                onClick={handleDismissPopup}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                className="hover-lift"
              >
                Explore Later
              </button>
              <button 
                onClick={handleDismissPopup}
                style={{
                  flex: 1.5,
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 800,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 15px var(--accent-glow)',
                  transition: 'all 0.2s'
                }}
                className="hover-lift"
              >
                Let's Play! 🚀
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
