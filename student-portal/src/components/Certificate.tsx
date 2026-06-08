import React from 'react';

interface CertificateProps {
  name: string;
  grade: string;
  school: string;
  certId: string;
  onReplay: () => void;
  onBackToDashboard: () => void;
  isPreview?: boolean;
}

export const Certificate: React.FC<CertificateProps> = ({
  name,
  grade,
  school,
  certId,
  onReplay,
  onBackToDashboard,
  isPreview = false
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', width: '100%' }}>
      
      {/* Print Styles Override */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          html, body {
            background: #0f172a !important;
            color: #f8fafc !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 100%;
            width: 100%;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          main, header, nav, button, .print-hide, #header-nav, .dashboard-header {
            display: none !important;
          }
          #completion-certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0 !important;
            padding: 2.5rem !important;
            box-sizing: border-box;
            background: #0f172a !important;
            color: #f8fafc !important;
            border: 10px double #10b981 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 99999;
            box-shadow: none !important;
          }
        }
        @page {
          size: landscape;
          margin: 0;
        }
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,600;0,800;1,400&display=swap');
      `}} />

      <div className="glass-card animate-pulse-slow" style={{ textAlign: 'center', padding: '1.5rem', width: '100%' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: isPreview ? 'var(--accent-purple)' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {isPreview ? '🔒 Certificate Preview' : '🏆 Foundational Course Mastered!'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          {isPreview 
            ? 'Complete all 11 levels of time expressions to unlock your official verified certificate.' 
            : 'Fantastic effort! You completed all 11 levels of time expressions. Below is your official certificate.'
          }
        </p>
      </div>

      {/* Certificate Frame */}
      <div 
        id="completion-certificate-container"
        style={{
          width: '100%',
          maxWidth: '800px',
          background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)',
          border: isPreview ? '6px double #6b7280' : '6px double #10b981',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          boxShadow: isPreview ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(16, 185, 129, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          boxSizing: 'border-box',
          position: 'relative',
          textAlign: 'center',
          borderImage: isPreview 
            ? 'linear-gradient(to bottom right, #6b7280, #374151) 10'
            : 'linear-gradient(to bottom right, #10b981, #059669) 10'
        }}
      >
        {/* Corner Decorative Ornaments */}
        <div style={{ position: 'absolute', top: '15px', left: '15px', width: '30px', height: '30px', borderTop: isPreview ? '3px solid #6b7280' : '3px solid #10b981', borderLeft: isPreview ? '3px solid #6b7280' : '3px solid #10b981' }} />
        <div style={{ position: 'absolute', top: '15px', right: '15px', width: '30px', height: '30px', borderTop: isPreview ? '3px solid #6b7280' : '3px solid #10b981', borderRight: isPreview ? '3px solid #6b7280' : '3px solid #10b981' }} />
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '30px', height: '30px', borderBottom: isPreview ? '3px solid #6b7280' : '3px solid #10b981', borderLeft: isPreview ? '3px solid #6b7280' : '3px solid #10b981' }} />
        <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '30px', height: '30px', borderBottom: isPreview ? '3px solid #6b7280' : '3px solid #10b981', borderRight: isPreview ? '3px solid #6b7280' : '3px solid #10b981' }} />

        {/* Elegant Watermark Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          overflow: 'hidden',
          userSelect: 'none',
          zIndex: 1
        }}>
          <div style={{
            transform: 'rotate(-25deg)',
            fontSize: isPreview ? '5.5rem' : '6.5rem',
            fontWeight: 900,
            color: isPreview ? '#ef4444' : '#10b981',
            opacity: isPreview ? 0.08 : 0.03,
            whiteSpace: 'nowrap',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
            Excellence Voices
          </div>
        </div>

        {/* Top Preview Banner */}
        {isPreview && (
          <div style={{
            position: 'absolute',
            top: '20px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '0.35rem 0.9rem',
            borderRadius: '50px',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            zIndex: 10
          }}>
            🔒 Preview Copy (Locked)
          </div>
        )}

        {/* Certificate Content Wrapper */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%' }}>
          
          {/* Company Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.25rem' }}>
            <img 
              src="/logo.jpg" 
              alt="Excellence Logo" 
              style={{ 
                height: '100px', 
                borderRadius: '8px', 
                objectFit: 'contain', 
                border: '2px solid rgba(255, 255, 255, 0.1)',
                padding: '4px',
                background: '#ffffff',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
              }} 
            />
          </div>

          <div>
            <h1 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontWeight: 800, 
              fontSize: '2rem', 
              letterSpacing: '0.05em',
              background: isPreview
                ? 'linear-gradient(135deg, #9ca3af 0%, #d1d5db 50%, #4b5563 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              margin: 0
            }}>
              Excellence Voices
            </h1>
            <p style={{ 
              fontSize: '0.8rem', 
              color: 'var(--text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.3em',
              margin: '0.25rem 0 0 0',
              fontWeight: 700
            }}>
              Certificate of Achievement
            </p>
          </div>

          <div style={{ margin: '0.5rem 0' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
              This is proudly presented to
            </p>
            <h2 style={{ 
              fontFamily: "'Playfair Display', Georgia, serif", 
              fontSize: '2.2rem', 
              fontWeight: 700, 
              color: '#fff', 
              margin: '0.5rem 0',
              borderBottom: '1.5px solid rgba(255,255,255,0.1)',
              paddingBottom: '0.5rem',
              minWidth: '250px',
              display: 'inline-block'
            }}>
              {name || 'Karan'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Student of <strong style={{ color: '#fff' }}>{school || 'Delhi Public School'}</strong>, <strong style={{ color: '#fff' }}>{grade || 'Grade 7'}</strong>
            </p>
          </div>

          <div style={{ maxWidth: '600px', lineHeight: '1.6' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: 0 }}>
              for successfully completing the course curriculum and mastering the
            </p>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Time Expression Master: Foundational Level (Easy)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Demonstrating outstanding skills in spoken sentence formation using key temporal and conditional structures, covering Everyday routines, Completed past actions, Future plans, Timelines, and imaginary outcomes.
            </p>
          </div>

          {/* Seal and Signatures block */}
          <div className="cert-footer">
            
            {/* Verification & Date */}
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date: <strong>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: <strong>{certId}</strong></span>
            </div>

            {/* Gold Medal Seal */}
            <div style={{
              position: 'relative',
              width: '65px',
              height: '65px',
              background: isPreview 
                ? 'radial-gradient(circle, #d1d5db 0%, #9ca3af 100%)' 
                : 'radial-gradient(circle, #fcd34d 0%, #d97706 100%)',
              borderRadius: '50%',
              border: isPreview ? '2px solid #e5e7eb' : '2px solid #fbbf24',
              boxShadow: isPreview ? '0 4px 15px rgba(0, 0, 0, 0.2)' : '0 4px 15px rgba(217, 119, 6, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              color: isPreview ? '#4b5563' : '#78350f',
              fontWeight: 800
            }}>
              🏅
            </div>

            {/* Signature */}
            <div style={{ textAlign: 'right', minWidth: '150px' }}>
              <div style={{ 
                fontFamily: "'Great Vibes', cursive", 
                fontSize: '1.8rem', 
                color: isPreview ? '#9ca3af' : '#34d399',
                lineHeight: 1,
                marginBottom: '0.25rem',
                letterSpacing: '0.05em'
              }}>
                Excellence Voices
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', width: '100%', marginTop: '0.25rem' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginTop: '0.25rem' }}>
                Authorized Signatory
              </span>
            </div>

          </div>
        </div> {/* End Content Wrapper */}

      </div>

      {/* Action buttons (Print-hidden) */}
      <div className="print-hide" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '800px' }}>
        {isPreview ? (
          <>
            <button 
              onClick={onBackToDashboard}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                padding: '0.85rem 1.5rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer'
              }}
            >
              Back to Hub
            </button>
            <button 
              onClick={onReplay}
              style={{
                flexGrow: 1,
                background: 'var(--accent-gradient)',
                border: 'none',
                color: 'white',
                padding: '0.85rem 2rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                boxShadow: '0 4px 15px var(--accent-glow)'
              }}
            >
              Start Time Expression Master to Unlock 🚀
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => window.print()}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                padding: '0.85rem 1.5rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📥 Download Certificate (PDF)
            </button>
            <button 
              onClick={onReplay}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                padding: '0.85rem 1.5rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer'
              }}
            >
              🔄 Replay Course
            </button>
            <button 
              onClick={onBackToDashboard}
              style={{
                flexGrow: 1,
                background: 'var(--accent-gradient)',
                border: 'none',
                color: 'white',
                padding: '0.85rem 2rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                boxShadow: '0 4px 15px var(--accent-glow)'
              }}
            >
              Claim Rewards & Exit Hub 🚀
            </button>
          </>
        )}
      </div>

    </div>
  );
};
