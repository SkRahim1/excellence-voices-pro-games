import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Star, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  MessageSquareHeart, 
  ArrowRight,
  RefreshCw,
  Award
} from 'lucide-react';
import { useUserStore } from '../store/userStore';

interface ResetAnnouncementSurveyModalProps {
  onClose?: () => void;
}

export const ResetAnnouncementSurveyModal: React.FC<ResetAnnouncementSurveyModalProps> = ({ onClose }) => {
  const { name, grade, completeFairnessResetAndSurvey } = useUserStore();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [favoriteGame, setFavoriteGame] = useState<string>('Grammar Galaxy');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [fairnessAgreed, setFairnessAgreed] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const gameOptions = [
    'Grammar Galaxy',
    'English Chess',
    'Escape Room English',
    'SpeakScore AI',
    'Word Rush',
    'Phrasal Verb Explorer',
    'Action Words',
    'Modal Mind',
    'Parts of Speech',
    'All Games'
  ];

  const ratingLabels: Record<number, { text: string; emoji: string }> = {
    5: { text: 'Amazing! Loving it', emoji: '😍' },
    4: { text: 'Good experience', emoji: '😀' },
    3: { text: 'Okay / Fair', emoji: '😐' },
    2: { text: 'Needs Improvement', emoji: '🙁' },
    1: { text: 'Disliked it', emoji: '😡' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fairnessAgreed) {
      alert('Please check the fairness acknowledgement to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      await completeFairnessResetAndSurvey({
        rating,
        favoriteGame,
        feedbackText: feedbackText.trim(),
        fairnessAgreed
      });
      setSubmitted(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      console.error('Error submitting survey:', err);
      if (onClose) onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      background: 'rgba(9, 9, 14, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      fontFamily: "'Outfit', sans-serif",
      color: '#f3f4f6'
    }}>
      <div className="glass-card" style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '24px',
        background: 'linear-gradient(145deg, rgba(23, 23, 38, 0.95) 0%, rgba(15, 15, 26, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(6, 182, 212, 0.15)',
        padding: '2rem 1.75rem',
        position: 'relative'
      }}>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
              marginBottom: '1.25rem'
            }}>
              <CheckCircle2 style={{ width: '40px', height: '40px', color: '#fff' }} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#10b981' }}>
              Feedback Received! 🎉
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
              Thank you, <strong>{name || 'Student'}</strong>! Your feedback helps us build a better platform. 
              Your score has been reset and you are ready for a fresh, fair start!
            </p>
          </div>
        ) : (
          <>
            {/* Header progress indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldAlert style={{ color: '#06b6d4', width: '24px', height: '24px' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#06b6d4' }}>
                  Platform System Notice
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>
                <span style={{ padding: '2px 8px', borderRadius: '12px', background: step === 1 ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.06)', color: step === 1 ? '#06b6d4' : '#94a3b8' }}>1. Notice</span>
                <span>•</span>
                <span style={{ padding: '2px 8px', borderRadius: '12px', background: step === 2 ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.06)', color: step === 2 ? '#8b5cf6' : '#94a3b8' }}>2. Survey</span>
              </div>
            </div>

            {/* STEP 1: FAIRNESS RESET ANNOUNCEMENT */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    color: '#f59e0b'
                  }}>
                    <RefreshCw style={{ width: '32px', height: '32px' }} />
                  </div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Important Fairness Update
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Welcome back, <strong>{name || 'Student'}</strong> ({grade})! Please read this brief update regarding overall ranks and points.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: '#e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Award style={{ width: '22px', height: '22px', color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#fbbf24', fontSize: '0.95rem' }}>Why are coins & ranks resetting to zero?</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#cbd5e1' }}>
                        Due to a system loophole, a small number of students earned points and leaderboard ranks that were not genuine. 
                        To guarantee <strong>100% fair competition</strong> for all students across every school, all coins, XP, high scores, and ranks have been reset to <strong>0</strong>.
                      </p>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(6, 182, 212, 0.08)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    color: '#38bdf8',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    <Sparkles style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                    <span>Fresh start! Play games today to claim your genuine #1 rank on the new leaderboard! 🚀</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                    border: 'none',
                    color: '#fff',
                    padding: '14px',
                    borderRadius: '14px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 6px 20px rgba(6, 182, 212, 0.3)',
                    marginTop: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                  className="hover-lift"
                >
                  <span>Continue to 1-Min Feedback Survey</span>
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
            )}

            {/* STEP 2: STUDENT FEEDBACK SURVEY */}
            {step === 2 && (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquareHeart style={{ color: '#8b5cf6', width: '24px', height: '24px' }} />
                    Student Feedback Survey
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                    Help us make Excellence Voices Pro better for you! Your thoughts go directly to our admin team.
                  </p>
                </div>

                {/* Rating Stars */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>
                    1. How would you rate your experience so far?
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= (hoverRating || rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            transition: 'transform 0.15s'
                          }}
                          className="hover-scale"
                        >
                          <Star 
                            style={{ 
                              width: '32px', 
                              height: '32px', 
                              color: active ? '#f59e0b' : '#475569',
                              fill: active ? '#f59e0b' : 'transparent',
                              transition: 'all 0.2s'
                            }} 
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b' }}>
                    {ratingLabels[hoverRating || rating]?.emoji} {ratingLabels[hoverRating || rating]?.text}
                  </span>
                </div>

                {/* Favorite Game Dropdown */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>
                    2. Which is your favorite game / module?
                  </label>
                  <select
                    value={favoriteGame}
                    onChange={(e) => setFavoriteGame(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {gameOptions.map((g) => (
                      <option key={g} value={g} style={{ background: '#12121c', color: '#fff' }}>
                        🎮 {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Open Feedback Textarea */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>
                    3. Suggestions or improvements (Optional):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what you love, any issues you faced, or new games you want..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: "'Outfit', sans-serif"
                    }}
                  />
                </div>

                {/* Fairness Acknowledgement Checkbox */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  background: 'rgba(6, 182, 212, 0.06)',
                  border: '1px solid rgba(6, 182, 212, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 12px'
                }}>
                  <input
                    type="checkbox"
                    id="fairnessCheck"
                    checked={fairnessAgreed}
                    onChange={(e) => setFairnessAgreed(e.target.checked)}
                    style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#06b6d4' }}
                  />
                  <label htmlFor="fairnessCheck" style={{ fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer', lineHeight: 1.4 }}>
                    I understand that all coins and ranks are reset to <strong>0</strong> to maintain 100% fair competition for everyone.
                  </label>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#94a3b8',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !fairnessAgreed}
                    style={{
                      flex: 1,
                      background: fairnessAgreed ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' : '#334155',
                      border: 'none',
                      color: '#fff',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: fairnessAgreed ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: fairnessAgreed ? '0 4px 16px rgba(16, 185, 129, 0.25)' : 'none',
                      opacity: isSubmitting ? 0.7 : 1,
                      transition: 'all 0.2s'
                    }}
                    className={fairnessAgreed ? 'hover-lift' : ''}
                  >
                    {isSubmitting ? (
                      <span>Saving & Resetting...</span>
                    ) : (
                      <>
                        <Send style={{ width: '16px', height: '16px' }} />
                        <span>Submit Feedback & Start Playing</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
};
