import React from 'react';
import { X, Sun, Moon, Palette, HelpCircle, RotateCcw } from 'lucide-react';
import { useUserStore } from '../store/userStore';

interface SettingsModalProps {
  onClose: () => void;
  onOpenHelp: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onOpenHelp }) => {
  const { 
    theme, 
    themeMode, 
    toggleTheme, 
    toggleThemeMode, 
    resetAll 
  } = useUserStore();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all game progress, XP, and coins? This cannot be undone.")) {
      resetAll();
      window.location.reload();
    }
  };

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
      zIndex: 999999,
      padding: '1.5rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '500px',
        width: '100%',
        padding: '2rem',
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

        {/* Modal Title */}
        <div style={{ borderBottom: '1px solid var(--border-divider)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚙️ App Settings
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customize your Excellence Voices Pro experience</span>
        </div>

        {/* Settings List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Theme Mode Option */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            border: 'var(--card-border)',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: 'var(--text-main)' }}>Interface Color</h4>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Switch between Dark and Light mode</p>
            </div>
            <button
              onClick={toggleThemeMode}
              style={{
                background: 'var(--accent-gradient)',
                border: 'none',
                color: '#fff',
                padding: '0.5rem 1rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px var(--accent-glow)',
                whiteSpace: 'nowrap'
              }}
              className="hover-lift"
            >
              {themeMode === 'light' ? (
                <>
                  <Moon style={{ width: '16px', height: '16px' }} />
                  Night Mode
                </>
              ) : (
                <>
                  <Sun style={{ width: '16px', height: '16px' }} />
                  White Mode
                </>
              )}
            </button>
          </div>

          {/* Theme Swap Option */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            border: 'var(--card-border)',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: 'var(--text-main)' }}>Visual Styling</h4>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Switch interface between Kids and Teen themes</p>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                padding: '0.5rem 1rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap'
              }}
              className="hover-lift"
            >
              <Palette style={{ width: '16px', height: '16px' }} />
              Theme Swap
            </button>
          </div>

          {/* Help & FAQ Option */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            border: 'var(--card-border)',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: 'var(--text-main)' }}>FAQ & Guide</h4>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Read game rules, scoring, and limits help</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenHelp();
              }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                padding: '0.5rem 1rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap'
              }}
              className="hover-lift"
            >
              <HelpCircle style={{ width: '16px', height: '16px' }} />
              Open Help
            </button>
          </div>

          {/* Reset All Data Option */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: '#ef4444' }}>Reset Progress</h4>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reset streak, coins, and levels (cannot be undone)</p>
            </div>
            <button
              onClick={handleReset}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                padding: '0.5rem 1rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap'
              }}
              className="hover-lift"
            >
              <RotateCcw style={{ width: '16px', height: '16px' }} />
              Reset All
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{ borderTop: '1px solid var(--border-divider)', marginTop: '1.5rem', paddingTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              background: 'var(--accent-gradient)',
              border: 'none',
              color: 'white',
              padding: '0.6rem 2.5rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-btn)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px var(--accent-glow)'
            }}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
