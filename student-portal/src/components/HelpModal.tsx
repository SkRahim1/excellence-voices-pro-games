import React from 'react';
import { X, HelpCircle, BookOpen, Clock, Flame, Trophy, Award } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { getSchoolName } from '../data/schools';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const { school, theme } = useUserStore();

  const faqs = [
    {
      icon: <BookOpen style={{ color: 'var(--accent-cyan)' }} />,
      q: "What games are available?",
      a: "We feature 9 interactive learning games: Time Expression Master (tenses), Word Rush (speed S-V agreement), Phonics Matcher (spelling-sound), Phrasal Verb Explorer (daily idioms), Modal Mind (auxiliaries), What Yes or No? (conversational polar questions), Modal Time Fusion (advanced timeline matching), English Chess (grammar chess matches), and Escape Room English (riddles & safe unlocking)."
    },
    {
      icon: <Clock style={{ color: 'var(--accent-purple)' }} />,
      q: "Why is there a daily 40-minute limit?",
      a: "To help you build healthy screen-time habits and prevent fatigue, the portal locks automatically after 40 minutes of daily activity. Use this time focused to make the most of your learning!"
    },
    {
      icon: <Flame style={{ color: '#f97316' }} />,
      q: "How do I grow my daily streak?",
      a: "Practice on the portal daily for 40 minutes. Hitting the 40-minute mark auto-increments your streak by +1 day and awards you a massive +100 XP streak bonus!"
    },
    {
      icon: <Trophy style={{ color: '#eab308' }} />,
      q: "How does the Leaderboard work?",
      a: `It ranks you in real-time against classmates at ${getSchoolName(school) || 'your school'}. Sorting updates dynamically as you earn XP. Can you claim the 🥇 1st place?`
    },
    {
      icon: <Award style={{ color: '#10b981' }} />,
      q: "How do I get my official certificate?",
      a: "Complete all 11 levels of Time Expression Master. Once cleared, you will unlock a custom verified Certificate showing your details which you can print or download directly as a PDF."
    },
    {
      icon: <HelpCircle style={{ color: 'var(--accent-pink)' }} />,
      q: "Can I resume games or exit them on mobile?",
      a: "Yes! Your levels and high scores are saved in the cloud. You can resume any game from the dashboard. Pressing the browser or mobile back button will exit the current game and return you to the dashboard safely."
    }
  ];

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
        maxWidth: '600px',
        width: '100%',
        padding: '2.25rem 2rem',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <HelpCircle style={{ color: 'var(--accent-cyan)', width: '28px', height: '28px' }} />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Student Guide & FAQ</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Learn how to make the most of Excellence Voices Pro</span>
          </div>
        </div>

        {/* FAQs scroll area */}
        <div style={{ 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem',
          paddingRight: '0.5rem',
          maxHeight: '55vh'
        }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              background: 'rgba(255,255,255,0.02)',
              padding: '1rem',
              borderRadius: '12px',
              border: 'var(--card-border)'
            }}>
              <div style={{ marginTop: '3px' }}>{faq.icon}</div>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>{faq.q}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', textAlign: 'center' }}>
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
            Got it! 👍
          </button>
        </div>

      </div>
    </div>
  );
};
