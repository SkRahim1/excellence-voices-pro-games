import React from 'react';
import { getSchoolName } from '../data/schools';

interface CertificateProps {
  name: string;
  grade: string;
  school: string;
  certId: string;
  onReplay: () => void;
  onBackToDashboard: () => void;
  isPreview?: boolean;
  gameId?: 'grammar-galaxy' | 'modal-mind' | 'what-yes-or-no' | 'modal-time-fusion' | 'time-transformer';
}

interface GameCertMetadata {
  level: string;
  title: string;
  color: string;
  shadowColor: string;
  gradientStart: string;
  gradientEnd: string;
  details: string;
}

const gameMetadata: Record<'grammar-galaxy' | 'modal-mind' | 'what-yes-or-no' | 'modal-time-fusion' | 'time-transformer', GameCertMetadata> = {
  'grammar-galaxy': {
    level: 'Foundational Level (Easy)',
    title: 'Time Expression Master',
    color: '#10b981',
    shadowColor: 'rgba(16, 185, 129, 0.15)',
    gradientStart: '#10b981',
    gradientEnd: '#059669',
    details: 'Demonstrating outstanding skills in spoken sentence formation using key temporal and conditional structures, covering Everyday routines, Completed past actions, Future plans, Timelines, and imaginary outcomes.'
  },
  'modal-mind': {
    level: 'Medium Level 1',
    title: 'Modal Mind Master',
    color: '#8b5cf6',
    shadowColor: 'rgba(139, 92, 246, 0.15)',
    gradientStart: '#8b5cf6',
    gradientEnd: '#6d28d9',
    details: 'Demonstrating exceptional command over modal auxiliary verbs including capability, request, permission, obligation, and suggestion, applied across interactive real-world scenarios.'
  },
  'what-yes-or-no': {
    level: 'Medium Level 2',
    title: 'What Yes or No? Conversational Master',
    color: '#06b6d4',
    shadowColor: 'rgba(6, 182, 212, 0.15)',
    gradientStart: '#06b6d4',
    gradientEnd: '#0369a1',
    details: 'Demonstrating professional mastery in formulating and responding to conversational polar Yes/No questions, managing politeness registers, past/present/future tenses, and conditional clauses.'
  },
  'modal-time-fusion': {
    level: 'Advanced Level',
    title: 'Modal Time Fusion: Advanced Master',
    color: '#d946ef',
    shadowColor: 'rgba(217, 70, 239, 0.15)',
    gradientStart: '#d946ef',
    gradientEnd: '#be185d',
    details: 'Demonstrating supreme expertise in constructing complex English sentences using advanced double-blank syntax frames, merging modal verbs with conditional timelines, perfect tenses, and temporal adverbs.'
  },
  'time-transformer': {
    level: 'Difficult Level (Advanced)',
    title: 'Time Expression Transformer Master',
    color: '#f43f5e',
    shadowColor: 'rgba(244, 63, 94, 0.15)',
    gradientStart: '#f43f5e',
    gradientEnd: '#e11d48',
    details: 'Demonstrating supreme command over grammar rules and conversational flow by instantly transforming base structures to fit advanced time markers (like At 9 O\'clock, Already, By Tomorrow, and third conditionals) and delivering them with high oral accuracy.'
  }
};

const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, currentY);
};

export const Certificate: React.FC<CertificateProps> = ({
  name,
  grade,
  school,
  certId,
  onReplay,
  onBackToDashboard,
  isPreview = false,
  gameId = 'grammar-galaxy'
}) => {
  const meta = gameMetadata[gameId] || gameMetadata['grammar-galaxy'];
  const downloadCertificateAsImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/logo.jpg';

    const drawAndDownload = () => {
      // Draw background radial gradient
      const grad = ctx.createRadialGradient(800, 550, 50, 800, 550, 900);
      grad.addColorStop(0, '#111827');
      grad.addColorStop(1, '#030712');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1600, 1100);

      // Draw borders
      const borderColor = isPreview ? '#6b7280' : meta.color;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, 1540, 1040);
      ctx.lineWidth = 4;
      ctx.strokeRect(48, 48, 1504, 1004);

      // Draw Corner Ornaments (Lines)
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 6;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(70, 70); ctx.lineTo(130, 70);
      ctx.moveTo(70, 70); ctx.lineTo(70, 130);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(1530, 70); ctx.lineTo(1470, 70);
      ctx.moveTo(1530, 70); ctx.lineTo(1530, 130);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(70, 1030); ctx.lineTo(130, 1030);
      ctx.moveTo(70, 1030); ctx.lineTo(70, 970);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(1530, 1030); ctx.lineTo(1470, 1030);
      ctx.moveTo(1530, 1030); ctx.lineTo(1530, 970);
      ctx.stroke();

      // Draw Watermark
      ctx.save();
      ctx.translate(800, 550);
      ctx.rotate(-25 * Math.PI / 180);
      ctx.font = '900 110px sans-serif';
      ctx.fillStyle = isPreview ? '#ef4444' : meta.color;
      ctx.globalAlpha = isPreview ? 0.08 : 0.03;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('EXCELLENCE VOICES', 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1.0;

      // Draw logoImg in center if loaded
      try {
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          const logoHeight = 100;
          const logoWidth = (logoImg.naturalWidth / logoImg.naturalHeight) * logoHeight;
          
          // Draw white background card for logo
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(800 - logoWidth/2 - 10, 90, logoWidth + 20, logoHeight + 20, 12);
          } else {
            ctx.rect(800 - logoWidth/2 - 10, 90, logoWidth + 20, logoHeight + 20);
          }
          ctx.fill();

          ctx.drawImage(logoImg, 800 - logoWidth/2, 100, logoWidth, logoHeight);
        }
      } catch (e) {
        console.warn('Failed to draw logo on canvas', e);
      }

      // Draw "EXCELLENCE VOICES" Title
      const gradient = ctx.createLinearGradient(500, 0, 1100, 0);
      if (isPreview) {
        gradient.addColorStop(0, '#9ca3af');
        gradient.addColorStop(0.5, '#d1d5db');
        gradient.addColorStop(1, '#4b5563');
      } else {
        gradient.addColorStop(0, meta.gradientStart);
        gradient.addColorStop(0.5, '#ffffff'); // add a bright highlight in the center
        gradient.addColorStop(1, meta.gradientEnd);
      }
      ctx.fillStyle = gradient;
      ctx.textAlign = 'center';
      ctx.font = '800 52px "Playfair Display", serif';
      ctx.fillText('EXCELLENCE VOICES', 800, 270);

      // Certificate of Achievement
      ctx.fillStyle = '#94a3b8'; // text-muted
      ctx.font = 'bold 24px sans-serif';
      try {
        (ctx as any).letterSpacing = '6px';
      } catch (e) {}
      ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 800, 320);
      try {
        (ctx as any).letterSpacing = '0px';
      } catch (e) {}

      // This is proudly presented to
      ctx.font = 'italic 28px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('This is proudly presented to', 800, 390);

      // Student Name
      ctx.font = 'bold 64px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(name || 'Karan', 800, 480);

      // Line under name
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(500, 510);
      ctx.lineTo(1100, 510);
      ctx.stroke();

      // Student of ... Grade ...
      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#94a3b8';
      const schoolText = getSchoolName(school) || 'Delhi Public School';
      const gradeText = grade || 'Grade 7';
      ctx.fillText(`Student of ${schoolText}, ${gradeText}`, 800, 560);

      // for successfully completing ...
      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('for successfully completing the course curriculum and mastering the', 800, 630);

      // Course Name and Level
      ctx.font = 'bold 34px sans-serif';
      ctx.fillStyle = meta.color;
      ctx.fillText(`${meta.title.toUpperCase()}: ${meta.level.toUpperCase()}`, 800, 690);

      // Course details (dynamic wrap)
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#94a3b8';
      wrapText(ctx, meta.details, 800, 755, 1200, 32);

      // Footer divider line
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(150, 850);
      ctx.lineTo(1450, 850);
      ctx.stroke();

      // --- Left Footer: Date & ID ---
      ctx.textAlign = 'left';
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#94a3b8';
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillText(`Date: ${dateStr}`, 150, 910);
      ctx.fillText(`ID: ${certId}`, 150, 950);

      // --- Center Footer: Medal ---
      ctx.textAlign = 'center';
      ctx.font = '60px sans-serif';
      ctx.fillText('🏅', 800, 930);

      // --- Right Footer: Signature ---
      ctx.textAlign = 'right';
      ctx.font = 'italic 44px "Great Vibes", cursive';
      ctx.fillStyle = isPreview ? '#94a3b8' : meta.color;
      ctx.fillText('Excellence Voices', 1450, 910);
      
      // Signature line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(1200, 930);
      ctx.lineTo(1450, 930);
      ctx.stroke();

      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('AUTHORIZED SIGNATORY', 1450, 960);

      // Preview Banner watermark
      if (isPreview) {
        ctx.save();
        ctx.translate(800, 550);
        ctx.rotate(-45 * Math.PI / 180);
        ctx.font = 'bold 120px sans-serif';
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PREVIEW ONLY', 0, 0);
        ctx.restore();
      }

      // Download the image
      try {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `excellence_voices_certificate_${name.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.error('Failed to export canvas to image', e);
        window.print();
      }
    };

    logoImg.onload = () => {
      if (document.fonts) {
        document.fonts.ready.then(() => {
          drawAndDownload();
        }).catch(() => {
          drawAndDownload();
        });
      } else {
        setTimeout(drawAndDownload, 500);
      }
    };

    logoImg.onerror = () => {
      if (document.fonts) {
        document.fonts.ready.then(() => {
          drawAndDownload();
        }).catch(() => {
          drawAndDownload();
        });
      } else {
        setTimeout(drawAndDownload, 500);
      }
    };
  };

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
            border: 10px double ${meta.color} !important;
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: isPreview ? 'var(--accent-purple)' : meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {isPreview ? '🔒 Certificate Preview' : `🏆 ${meta.title} Cleared!`}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          {isPreview 
            ? `Complete all levels of ${meta.title} to unlock your official verified certificate.` 
            : `Fantastic effort! You completed all levels of ${meta.title}. Below is your official certificate.`
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
          border: isPreview ? '6px double #6b7280' : `6px double ${meta.color}`,
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          boxShadow: isPreview ? '0 10px 40px rgba(0, 0, 0, 0.4)' : `0 10px 40px ${meta.shadowColor}`,
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
            : `linear-gradient(to bottom right, ${meta.gradientStart}, ${meta.gradientEnd}) 10`
        }}
      >
        {/* Corner Decorative Ornaments */}
        <div style={{ position: 'absolute', top: '15px', left: '15px', width: '30px', height: '30px', borderTop: isPreview ? '3px solid #6b7280' : `3px solid ${meta.color}`, borderLeft: isPreview ? '3px solid #6b7280' : `3px solid ${meta.color}` }} />
        <div style={{ position: 'absolute', top: '15px', right: '15px', width: '30px', height: '30px', borderTop: isPreview ? '3px solid #6b7280' : `3px solid ${meta.color}`, borderRight: isPreview ? '3px solid #6b7280' : `3px solid ${meta.color}` }} />
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '30px', height: '30px', borderBottom: isPreview ? '3px solid #6b7280' : `3px solid ${meta.color}`, borderLeft: isPreview ? '3px solid #6b7280' : `3px solid ${meta.color}` }} />
        <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '30px', height: '30px', borderBottom: isPreview ? '3px solid #6b7280' : `3px solid ${meta.color}`, borderRight: isPreview ? '3px solid #6b7280' : `3px solid ${meta.color}` }} />

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
            color: isPreview ? '#ef4444' : meta.color,
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
                : `linear-gradient(135deg, ${meta.gradientStart} 0%, #ffffff 50%, ${meta.gradientEnd} 100%)`,
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
              Student of <strong style={{ color: '#fff' }}>{getSchoolName(school) || 'Delhi Public School'}</strong>, <strong style={{ color: '#fff' }}>{grade || 'Grade 7'}</strong>
            </p>
          </div>

          <div style={{ maxWidth: '600px', lineHeight: '1.6' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: 0 }}>
              for successfully completing the course curriculum and mastering the
            </p>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: meta.color, margin: '0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {meta.title}: {meta.level}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              {meta.details}
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
                color: isPreview ? '#9ca3af' : meta.color,
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
              Start {meta.title} to Unlock 🚀
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={downloadCertificateAsImage}
              style={{
                background: 'var(--accent-gradient)',
                border: 'none',
                color: 'white',
                padding: '0.85rem 1.5rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px var(--accent-glow)'
              }}
            >
              📥 Download Certificate (Image)
            </button>
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
              🖨️ Print PDF
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
