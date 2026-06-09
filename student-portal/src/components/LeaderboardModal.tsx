import React from 'react';
import { X, Trophy, Medal, Award } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { getSchoolName } from '../data/schools';

interface LeaderboardPlayer {
  name: string;
  grade: string;
  xp: number;
  isSelf: boolean;
}

interface LeaderboardModalProps {
  onClose: () => void;
  leaderboard: LeaderboardPlayer[];
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose, leaderboard }) => {
  const { school, theme } = useUserStore();

  const playersWithRank = leaderboard.map((player, index) => ({
    ...player,
    rank: index + 1
  }));

  const top10 = playersWithRank.slice(0, 10);
  const selfIndex = playersWithRank.findIndex(p => p.isSelf);
  const isSelfInTop10 = selfIndex >= 0 && selfIndex < 10;
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
        maxHeight: '85vh',
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>School Standings</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Top 10 leaderboard for <strong>{getSchoolName(school) || 'your school'}</strong>
            </span>
          </div>
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
          {top10.map((player) => {
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
                  <div style={{ fontSize: '0.75rem', color: player.isSelf ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }}>
                    {player.grade}
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

          {/* If the current student is not in the top 10, append them at the bottom with a divider */}
          {!isSelfInTop10 && selfPlayer && (
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
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>
                    {selfPlayer.grade}
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
