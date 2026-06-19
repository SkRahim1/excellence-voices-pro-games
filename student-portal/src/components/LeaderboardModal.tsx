import React from 'react';
import { X, Trophy, Medal, Award } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { getSchoolName } from '../data/schools';

interface LeaderboardPlayer {
  name: string;
  grade: string;
  xp: number;
  isSelf: boolean;
  school?: string;
}

interface LeaderboardModalProps {
  onClose: () => void;
  schoolLeaderboard: LeaderboardPlayer[];
  globalLeaderboard: LeaderboardPlayer[];
  initialTab?: 'school' | 'global';
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ 
  onClose, 
  schoolLeaderboard, 
  globalLeaderboard, 
  initialTab = 'school' 
}) => {
  const { school, theme } = useUserStore();
  const [activeTab, setActiveTab] = React.useState<'school' | 'global'>(initialTab);

  const currentLeaderboard = activeTab === 'school' ? schoolLeaderboard : globalLeaderboard;

  const playersWithRank = currentLeaderboard.map((player, index) => ({
    ...player,
    rank: index + 1
  }));

  const limitCount = activeTab === 'school' ? 10 : 20;
  const displayPlayers = playersWithRank.slice(0, limitCount);
  const selfIndex = playersWithRank.findIndex(p => p.isSelf);
  const isSelfInDisplayList = selfIndex >= 0 && selfIndex < limitCount;
  const selfPlayer = selfIndex >= 0 ? playersWithRank[selfIndex] : null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999999,
      padding: '1.5rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '550px',
        width: '100%',
        padding: '2rem',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        position: 'relative',
        boxShadow: theme === 'kids'
          ? '0 20px 0px rgba(2, 132, 199, 0.15)'
          : '0 20px 50px rgba(0, 0, 0, 0.5)',
        border: theme === 'kids'
          ? '3px solid #7dd3fc'
          : '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          <X style={{ width: '22px', height: '22px' }} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <Trophy style={{ color: '#eab308', width: '28px', height: '28px' }} />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              {activeTab === 'school' ? 'School Standings' : 'All-School Standings'}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {activeTab === 'school' ? (
                <>Top 10 leaderboard for <strong>{getSchoolName(school) || 'your school'}</strong></>
              ) : (
                <>Top 20 leaderboard across <strong>all participating schools</strong></>
              )}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: theme === 'kids' ? '#f0f9ff' : 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: '12px',
          border: theme === 'kids' ? '2px solid #bae6fd' : '1px solid rgba(255, 255, 255, 0.08)',
          gap: '4px',
          marginTop: '-0.25rem',
          marginBottom: '0.25rem'
        }}>
          <button
            onClick={() => setActiveTab('school')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.88rem',
              transition: 'all 0.2s ease',
              background: activeTab === 'school'
                ? (theme === 'kids' ? '#0284c7' : 'var(--accent-gradient)')
                : 'transparent',
              color: activeTab === 'school'
                ? '#ffffff'
                : (theme === 'kids' ? '#0369a1' : 'var(--text-muted)'),
              boxShadow: activeTab === 'school' && theme !== 'kids'
                ? '0 4px 12px var(--accent-glow)'
                : 'none',
              outline: 'none'
            }}
          >
            🏫 My School
          </button>
          <button
            onClick={() => setActiveTab('global')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.88rem',
              transition: 'all 0.2s ease',
              background: activeTab === 'global'
                ? (theme === 'kids' ? '#0284c7' : 'var(--accent-gradient)')
                : 'transparent',
              color: activeTab === 'global'
                ? '#ffffff'
                : (theme === 'kids' ? '#0369a1' : 'var(--text-muted)'),
              boxShadow: activeTab === 'global' && theme !== 'kids'
                ? '0 4px 12px var(--accent-glow)'
                : 'none',
              outline: 'none'
            }}
          >
            🌍 All Schools (Top 20)
          </button>
        </div>

        {/* Leaderboard Table / List */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem',
          paddingRight: '0.25rem' 
        }}>
          {displayPlayers.map((player) => {
            const isGold = player.rank === 1;
            const isSilver = player.rank === 2;
            const isBronze = player.rank === 3;
            
            return (
              <div 
                key={player.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  background: player.isSelf 
                    ? 'var(--accent-gradient)' 
                    : 'rgba(255, 255, 255, 0.03)',
                  border: player.isSelf 
                    ? '1.5px solid var(--accent-cyan)' 
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: player.isSelf 
                    ? '0 4px 12px var(--accent-glow)' 
                    : 'none',
                  color: player.isSelf ? '#ffffff' : 'var(--text-main)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Rank indicator */}
                <div style={{ width: '45px', display: 'flex', alignItems: 'center', fontWeight: 800 }}>
                  {isGold ? (
                    <Medal style={{ color: '#fbbf24', width: '22px', height: '22px' }} />
                  ) : isSilver ? (
                    <Medal style={{ color: '#9ca3af', width: '22px', height: '22px' }} />
                  ) : isBronze ? (
                    <Medal style={{ color: '#b45309', width: '22px', height: '22px' }} />
                  ) : (
                    <span style={{ fontSize: '0.95rem', color: player.isSelf ? '#ffffff' : 'var(--text-muted)', marginLeft: '4px' }}>
                      #{player.rank}
                    </span>
                  )}
                </div>

                {/* Player details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    {player.name.replace(' (You)', '')} {player.isSelf && '🏆'}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    fontSize: '0.75rem', 
                    color: player.isSelf ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' 
                  }}>
                    <span>{player.grade}</span>
                    {activeTab === 'global' && player.school && (
                      <>
                        <span style={{ opacity: 0.5 }}>•</span>
                        <span style={{
                          background: player.isSelf ? 'rgba(255,255,255,0.2)' : 'rgba(255, 255, 255, 0.05)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 700
                        }}>
                          {getSchoolName(player.school)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* XP Count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 800 }}>
                  <Award style={{ width: '16px', height: '16px', color: player.isSelf ? '#ffffff' : 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '0.95rem' }}>{player.xp} XP</span>
                </div>
              </div>
            );
          })}

          {/* If the current student is not in the top display list, append them at the bottom with a divider */}
          {!isSelfInDisplayList && selfPlayer && (
            <>
              {/* Divider */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--text-muted)', 
                margin: '0.5rem 0',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                <span>• • •</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              </div>

              {/* Current student row */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  background: 'var(--accent-gradient)',
                  border: '1.5px solid var(--accent-cyan)',
                  boxShadow: '0 4px 12px var(--accent-glow)',
                  color: '#ffffff',
                }}
              >
                {/* Rank indicator */}
                <div style={{ width: '45px', display: 'flex', alignItems: 'center', fontWeight: 800 }}>
                  <span style={{ fontSize: '0.95rem', color: '#ffffff', marginLeft: '4px' }}>
                    #{selfPlayer.rank}
                  </span>
                </div>

                {/* Player details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    {selfPlayer.name.replace(' (You)', '')} 🏆
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    fontSize: '0.75rem', 
                    color: 'rgba(255,255,255,0.75)' 
                  }}>
                    <span>{selfPlayer.grade}</span>
                    {activeTab === 'global' && selfPlayer.school && (
                      <>
                        <span style={{ opacity: 0.5 }}>•</span>
                        <span style={{
                          background: 'rgba(255,255,255,0.2)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 700
                        }}>
                          {getSchoolName(selfPlayer.school)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* XP Count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 800 }}>
                  <Award style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                  <span style={{ fontSize: '0.95rem' }}>{selfPlayer.xp} XP</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
