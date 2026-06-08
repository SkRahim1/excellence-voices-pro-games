import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';

export const OnboardingForm: React.FC = () => {
  const { registerStudent } = useUserStore();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Grade 7');
  const [school, setSchool] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !school.trim() || !mobileNumber.trim()) {
      alert("Please fill in all details!");
      return;
    }
    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number!");
      return;
    }
    registerStudent({ name, grade, school, mobileNumber });
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
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Create Profile</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Enter your details to unlock the Excellence Voices student hub.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
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
            School Name
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Delhi Public School"
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
            }}
            className="input-focus-accent"
          />

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
      </div>
    </div>
  );
};
