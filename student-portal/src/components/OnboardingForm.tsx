import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { isFirebaseEnabled } from '../firebase/config';
import { SCHOOL_MAPPING } from '../data/schools';

const isValidMobileNumber = (num: string): boolean => {
  // Must be exactly 10 digits starting with 6, 7, 8, or 9 (standard Indian mobile prefixes)
  if (!/^[6-9]\d{9}$/.test(num)) {
    return false;
  }
  // Prevent identical digits (e.g. 9999999999, 8888888888)
  if (/^(.)\1{9}$/.test(num)) {
    return false;
  }
  // Prevent common simple sequential sequences
  const sequentialPatterns = ['1234567890', '9876543210', '0123456789', '8765432109'];
  if (sequentialPatterns.includes(num)) {
    return false;
  }
  return true;
};

export const OnboardingForm: React.FC = () => {
  const { registerStudent, loginStudent } = useUserStore();
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Grade 7');
  const [school, setSchool] = useState('exscl-01');
  const [mobileNumber, setMobileNumber] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!name.trim() || !school.trim() || !mobileNumber.trim() || !passcode.trim()) {
      setErrorMessage("Please fill in all details!");
      return;
    }
    if (!isValidMobileNumber(mobileNumber)) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return;
    }
    if (passcode.trim().toLowerCase() !== 'excellencestudents') {
      setErrorMessage("Incorrect Access Passcode! Please ask your teacher for the correct code.");
      return;
    }
    registerStudent({ name, grade, school, mobileNumber });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!mobileNumber.trim()) {
      setErrorMessage("Please enter your mobile number!");
      return;
    }
    if (!isValidMobileNumber(mobileNumber)) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const success = await loginStudent(mobileNumber);
      if (!success) {
        setErrorMessage("No profile found for this mobile number. Please register instead.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '480px',
      margin: '2rem auto',
    }}>
      <div className="glass-card animate-pulse-slow" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚀</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
            {activeTab === 'register' ? 'Create Profile' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {activeTab === 'register'
              ? 'Enter your details to unlock the Excellence Voices student hub.'
              : 'Log in with your mobile number to restore your progress.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--btn-bg-ghost)',
          borderRadius: 'var(--radius-btn)',
          padding: '4px',
          marginBottom: '1.5rem',
          border: 'var(--card-border)',
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMessage(''); setPasscode(''); }}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: 'calc(var(--radius-btn) - 2px)',
              background: activeTab === 'register' ? 'var(--accent-gradient)' : 'transparent',
              border: 'none',
              color: activeTab === 'register' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMessage(''); setPasscode(''); }}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: 'calc(var(--radius-btn) - 2px)',
              background: activeTab === 'login' ? 'var(--accent-gradient)' : 'transparent',
              border: 'none',
              color: activeTab === 'login' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
          >
            Log In
          </button>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-btn)',
            padding: '0.75rem 1rem',
            color: '#ef4444',
            fontSize: '0.9rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        {activeTab === 'login' && !isFirebaseEnabled && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-btn)',
            padding: '0.75rem 1rem',
            color: '#d97706',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            ⚠️ Cloud Sync is currently disabled. Please Register to play using offline mode.
          </div>
        )}

        {activeTab === 'register' ? (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Full Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Karan Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-btn)',
                background: 'rgba(255,255,255,0.04)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none',
                marginBottom: '1.25rem',
              }}
              className="input-focus-accent"
            />

            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Class / Grade
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              style={{
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-btn)',
                background: 'rgba(255,255,255,0.04)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none',
                marginBottom: '1.25rem',
                cursor: 'pointer'
              }}
              className="input-focus-accent"
            >
              <option>Grade 5</option>
              <option>Grade 6</option>
              <option>Grade 7</option>
              <option>Grade 8</option>
              <option>Grade 9</option>
            </select>

            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              School Code
            </label>
            <select
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              style={{
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-btn)',
                background: 'rgba(255,255,255,0.04)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none',
                marginBottom: '1.25rem',
                cursor: 'pointer'
              }}
              className="input-focus-accent"
            >
              {Object.keys(SCHOOL_MAPPING).map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>

            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Parent's WhatsApp / Mobile Number
            </label>
            <input
              required
              type="tel"
              pattern="[0-9]{10}"
              placeholder="10-digit number (e.g. 9876543210)"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              style={{
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-btn)',
                background: 'rgba(255,255,255,0.04)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none',
                marginBottom: '1.25rem',
              }}
              className="input-focus-accent"
            />

            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Access Passcode
            </label>
            <input
              required
              type="password"
              placeholder="Enter school signup passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              style={{
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-btn)',
                background: 'rgba(255,255,255,0.04)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none',
                marginBottom: '1.75rem',
              }}
              className="input-focus-accent"
            />

            <button
              type="submit"
              style={{
                background: 'var(--accent-gradient)',
                border: 'none',
                color: 'white',
                padding: '0.9rem',
                fontWeight: 700,
                fontSize: '1.05rem',
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                boxShadow: '0 4px 15px var(--accent-glow)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Register Profile 🚀
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Parent's WhatsApp / Mobile Number
            </label>
            <input
              required
              type="tel"
              pattern="[0-9]{10}"
              placeholder="Enter your registered 10-digit number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              disabled={loading || !isFirebaseEnabled}
              style={{
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-btn)',
                background: 'rgba(255,255,255,0.04)',
                border: 'var(--card-border)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none',
                marginBottom: '1.75rem',
                opacity: (!isFirebaseEnabled) ? 0.5 : 1,
              }}
              className="input-focus-accent"
            />

            <button
              type="submit"
              disabled={loading || !isFirebaseEnabled}
              style={{
                background: 'var(--accent-gradient)',
                border: 'none',
                color: 'white',
                padding: '0.9rem',
                fontWeight: 700,
                fontSize: '1.05rem',
                borderRadius: 'var(--radius-btn)',
                cursor: (loading || !isFirebaseEnabled) ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px var(--accent-glow)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                opacity: (loading || !isFirebaseEnabled) ? 0.6 : 1,
                position: 'relative'
              }}
            >
              {loading ? 'Logging In...' : 'Log In 🚀'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
