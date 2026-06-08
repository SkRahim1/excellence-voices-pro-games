import React from 'react';
import { useUserStore } from '../store/userStore';
import { Flame, Star, Coins, ShieldAlert } from 'lucide-react';

export const LockoutScreen: React.FC = () => {
  const { streak, xp, coins, school, name, theme } = useUserStore();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: theme === 'kids' 
        ? 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' 
        : 'radial-gradient(circle at center, #1e1b4b 0%, #09090e 85%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      padding: '2rem 1.5rem',
      color: 'var(--text-main)',
      overflowY: 'auto'
    }}>
      <div className="glass-card animate-pulse-slow" style={{
        maxWidth: '550px',
        width: '100%',
        textAlign: 'center',
        padding: '3rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.75rem',
        boxShadow: theme === 'kids'
          ? '0 20px 0px rgba(2, 132, 199, 0.15)'
          : '0 20px 50px rgba(6, 182, 212, 0.15)',
        border: theme === 'kids'
          ? '3px solid #7dd3fc'
          : '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        
        {/* Top Celebration Icon */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white',
            boxShadow: '0 8px 25px var(--accent-glow)'
          }}>
            ⏳
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-5px',
            right: '-5px',
            background: '#ef4444',
            border: '2px solid var(--text-main)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert style={{ width: '16px', height: '16px', color: 'white' }} />
          </div>
        </div>

        {/* Lockout Message */}
        <div>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 800, 
            letterSpacing: '0.02em',
            margin: 0,
            textTransform: 'uppercase',
            background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Daily Practice Limit Reached!
          </h1>
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.95rem', 
            marginTop: '0.5rem',
            fontWeight: 600
          }}>
            Awesome practice session today, {name}!
          </p>
        </div>

        {/* 100% Progress Ring Visualizer */}
        <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="65" cy="65" r="54" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="transparent" />
            <circle 
              cx="65" 
              cy="65" 
              r="54" 
              stroke="var(--accent-cyan)" 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={339}
              strokeDashoffset={0}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 4px var(--accent-glow))' }}
            />
          </svg>
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>40/40</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Mins Active</span>
          </div>
        </div>

        {/* Dynamic Streak & XP Standings Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1rem', 
          width: '100%',
          background: 'rgba(0,0,0,0.1)',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <Flame style={{ color: '#f97316', fill: '#f97316', width: '22px', height: '22px' }} />
            <strong style={{ fontSize: '1.1rem' }}>{streak} Days</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Streak</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <Star style={{ color: '#eab308', fill: '#eab308', width: '22px', height: '22px' }} />
            <strong style={{ fontSize: '1.1rem' }}>{xp} XP</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Points</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <Coins style={{ color: '#f59e0b', fill: '#f59e0b', width: '22px', height: '22px' }} />
            <strong style={{ fontSize: '1.1rem' }}>{coins}</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Coins</span>
          </div>
        </div>

        {/* Motivational Info Card */}
        <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-muted)' }}>
            💡 <strong>Why is this locked?</strong> To support your healthy study habits and prevent screen fatigue, the student portal limits daily practice to 40 minutes. Your daily learning streak is successfully saved! See you tomorrow for your next grammar challenge.
          </p>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
          Registered to: <strong>{school}</strong>
        </p>

      </div>
    </div>
  );
};
