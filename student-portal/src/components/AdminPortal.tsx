import React, { useState, useEffect } from 'react';
import { 
  Users, 
  School, 
  Award, 
  Trophy, 
  Download, 
  Search, 
  LogOut, 
  Lock, 
  Key, 
  AlertCircle 
} from 'lucide-react';
import { db, isFirebaseEnabled } from '../firebase/config';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { SCHOOL_MAPPING, getSchoolName } from '../data/schools';

interface StudentData {
  name: string;
  grade: string;
  school: string;
  mobileNumber: string;
  xp: number;
  coins: number;
  streak: number;
  completedGames?: string[];
  dailyActiveSeconds?: number;
}

export const AdminPortal: React.FC = () => {
  // Login State
  const [passcode, setPasscode] = useState('');
  const [dbPasscode, setDbPasscode] = useState('ProgrammerExcellenceAdmin'); // Fallback default
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Data State
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'schools' | 'students'>('overview');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load Firestore passcode
  useEffect(() => {
    const fetchPasscode = async () => {
      if (!isFirebaseEnabled || !db) return;
      try {
        const docRef = doc(db, 'config', 'admin');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const loadedPass = data.passcode || data.password;
          if (loadedPass) {
            setDbPasscode(loadedPass);
            console.log("🔒 Firestore admin passcode loaded successfully!");
          }
        }
      } catch (err) {
        console.error("Error loading passcode from Firestore:", err);
      }
    };
    fetchPasscode();
  }, []);

  // Fetch all students
  const fetchStudentsData = async () => {
    if (!isFirebaseEnabled || !db) {
      // Fallback local mock data for admin dashboard testing
      const mockStudents: StudentData[] = [
        { name: 'Aditya Kumar', grade: 'Grade 8', school: 'exscl-01', mobileNumber: '9876543211', xp: 4500, coins: 140, streak: 8, completedGames: ['word-rush', 'grammar-galaxy'] },
        { name: 'Sneha Patel', grade: 'Grade 7', school: 'exscl-02', mobileNumber: '9123456780', xp: 3800, coins: 90, streak: 5, completedGames: ['grammar-galaxy'] },
        { name: 'Vikram Singh', grade: 'Grade 9', school: 'exscl-05', mobileNumber: '9988776655', xp: 3500, coins: 110, streak: 6, completedGames: ['escape-room'] },
        { name: 'Priya Sharma', grade: 'Grade 6', school: 'exscl-03', mobileNumber: '9000111222', xp: 3200, coins: 85, streak: 4, completedGames: ['phonics-matcher'] },
        { name: 'Rahul Verma', grade: 'Grade 8', school: 'exscl-06', mobileNumber: '9440055661', xp: 2900, coins: 70, streak: 3, completedGames: [] },
        { name: 'Ananya Rao', grade: 'Grade 7', school: 'exscl-01', mobileNumber: '9550011223', xp: 2700, coins: 65, streak: 3, completedGames: ['word-rush'] },
        { name: 'Karan Malhotra', grade: 'Grade 9', school: 'exscl-04', mobileNumber: '9661122334', xp: 2500, coins: 60, streak: 2, completedGames: ['english-chess'] },
        { name: 'Tanvi Joshi', grade: 'Grade 6', school: 'exscl-07', mobileNumber: '9772233445', xp: 2300, coins: 55, streak: 2, completedGames: [] },
        { name: 'Kunal Deshmukh', grade: 'Grade 8', school: 'exscl-08', mobileNumber: '9883344556', xp: 2100, coins: 50, streak: 1, completedGames: [] },
        { name: 'Riddhi Sen', grade: 'Grade 7', school: 'exscl-09', mobileNumber: '9994455667', xp: 2000, coins: 45, streak: 1, completedGames: [] }
      ];
      setStudents(mockStudents);
      return;
    }

    setLoading(true);
    try {
      const q = query(collection(db, 'students'), orderBy('xp', 'desc'));
      const querySnapshot = await getDocs(q);
      const list: StudentData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          name: data.name || 'Anonymous',
          grade: data.grade || 'Grade 7',
          school: data.school || 'exscl-01',
          mobileNumber: data.mobileNumber || doc.id,
          xp: data.xp || 0,
          coins: data.coins || 0,
          streak: data.streak || 0,
          completedGames: data.completedGames || [],
          dailyActiveSeconds: data.dailyActiveSeconds || 0
        });
      });
      setStudents(list);
    } catch (err) {
      console.error("Error fetching students list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchStudentsData();
    }
  }, [isLoggedIn]);

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (passcode.trim() === dbPasscode) {
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid Passcode! Please try again.');
    }
  };

  // Logout handler and path cleanup
  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.hash = '';
    if (window.location.search.includes('admin=true')) {
      window.history.pushState({}, '', window.location.pathname);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  // CSV Exporter helper
  const exportToCSV = (filename: string, headers: string[], rows: string[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all students
  const handleDownloadAll = () => {
    const headers = ['Rank', 'Name', 'Mobile Number', 'School Code', 'School Name', 'Grade', 'XP', 'Coins', 'Streak', 'Completed Games Count'];
    const rows = filteredStudents.map((s, idx) => [
      (idx + 1).toString(),
      s.name,
      s.mobileNumber,
      s.school,
      getSchoolName(s.school),
      s.grade,
      s.xp.toString(),
      s.coins.toString(),
      s.streak.toString(),
      (s.completedGames?.length || 0).toString()
    ]);
    exportToCSV('all_students_report.csv', headers, rows);
  };

  // Download specific school students
  const handleDownloadSchool = (schoolCode: string) => {
    const schoolStudents = students.filter(s => s.school === schoolCode);
    const schoolName = getSchoolName(schoolCode);
    const headers = ['Rank', 'Name', 'Mobile Number', 'Grade', 'XP', 'Coins', 'Streak', 'Completed Games Count'];
    const rows = schoolStudents.map((s, idx) => [
      (idx + 1).toString(),
      s.name,
      s.mobileNumber,
      s.grade,
      s.xp.toString(),
      s.coins.toString(),
      s.streak.toString(),
      (s.completedGames?.length || 0).toString()
    ]);
    exportToCSV(`${schoolName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_students.csv`, headers, rows);
  };

  // Switch to Student Directory filtered by chosen school
  const handleSchoolClick = (schoolCode: string) => {
    setSchoolFilter(schoolCode);
    setGradeFilter('all');
    setSearchTerm('');
    setActiveTab('students');
  };

  // Calculations for Overview Tab
  const totalStudents = students.length;
  const totalXP = students.reduce((acc, s) => acc + s.xp, 0);
  const averageXP = totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0;
  
  // Calculate active schools
  const activeSchoolsList = Array.from(new Set(students.map(s => s.school))) as string[];
  const totalActiveSchools = activeSchoolsList.length;

  // Schoolwise breakdown mapping
  const schoolBreakdown = activeSchoolsList.map(schoolCode => {
    const schoolStudents = students.filter(s => s.school === schoolCode);
    const count = schoolStudents.length;
    const xpSum = schoolStudents.reduce((acc, s) => acc + s.xp, 0);
    const avgXp = count > 0 ? Math.round(xpSum / count) : 0;
    return {
      code: schoolCode,
      name: getSchoolName(schoolCode),
      studentsCount: count,
      totalXp: xpSum,
      avgXp: avgXp
    };
  }).sort((a, b) => b.totalXp - a.totalXp);

  // Student directory filters
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.mobileNumber.includes(searchTerm);
    const matchesSchool = schoolFilter === 'all' || s.school === schoolFilter;
    const matchesGrade = gradeFilter === 'all' || s.grade === gradeFilter;
    return matchesSearch && matchesSchool && matchesGrade;
  });

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 15%, #1e1b4b 0%, #09090e 85%)',
        fontFamily: "'Outfit', sans-serif",
        color: '#f3f4f6',
        padding: '1.5rem'
      }}>
        <div className="glass-card" style={{
          maxWidth: '420px',
          width: '100%',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            color: '#06b6d4',
            marginBottom: '1.5rem'
          }}>
            <Lock style={{ width: '28px', height: '28px' }} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Admin Portal</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 2rem 0' }}>
            Enter your admin passcode to access reports, download data, and inspect settings.
          </p>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative', textAlign: 'left' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
                Admin Passcode
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Key style={{ position: 'absolute', left: '14px', width: '18px', height: '18px', color: '#64748b' }} />
                <input 
                  type="password"
                  placeholder="••••••••••••"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.95rem',
                    transition: 'border 0.2s',
                  }}
                  className="input-focus-accent"
                />
              </div>
            </div>

            {loginError && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                background: 'rgba(239, 68, 68, 0.08)', 
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#f87171',
                fontSize: '0.8rem',
                textAlign: 'left'
              }}>
                <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                border: 'none',
                color: '#fff',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)',
                transition: 'all 0.2s'
              }}
              className="hover-lift"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 15%, #1e1b4b 0%, #09090e 85%)',
      fontFamily: "'Outfit', sans-serif",
      color: '#f3f4f6',
      padding: isMobile ? '1rem' : '2rem 3rem'
    }}>
      
      {/* Top Header */}
      <header style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? '1rem' : '0.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trophy style={{ color: '#06b6d4', width: '28px', height: '28px' }} />
          <div>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, margin: 0 }}>Excellence Voices Pro</h1>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Admin Management Panel</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'flex-end', gap: '1rem' }}>
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f3f4f6',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              width: isMobile ? '100%' : 'auto',
              justifyContent: 'center'
            }}
            className="hover-lift"
          >
            <LogOut style={{ width: '16px', height: '16px' }} />
            Log Out
          </button>
        </div>
      </header>

      {/* Tabs Switcher Navigation */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: '0.5rem', 
        background: 'rgba(255, 255, 255, 0.03)', 
        padding: '4px', 
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        width: isMobile ? '100%' : 'fit-content',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 800,
            background: activeTab === 'overview' ? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' : 'transparent',
            color: activeTab === 'overview' ? '#fff' : '#94a3b8',
            transition: 'all 0.2s',
            textAlign: isMobile ? 'left' : 'center',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          📊 Dashboard Overview
        </button>
        <button
          onClick={() => setActiveTab('schools')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 800,
            background: activeTab === 'schools' ? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' : 'transparent',
            color: activeTab === 'schools' ? '#fff' : '#94a3b8',
            transition: 'all 0.2s',
            textAlign: isMobile ? 'left' : 'center',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          🏫 School Analytics
        </button>
        <button
          onClick={() => setActiveTab('students')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 800,
            background: activeTab === 'students' ? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' : 'transparent',
            color: activeTab === 'students' ? '#fff' : '#94a3b8',
            transition: 'all 0.2s',
            textAlign: isMobile ? 'left' : 'center',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          👤 Student Directory
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: '#94a3b8', fontSize: '1rem', fontWeight: 600 }}>
          Fetching system data...
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div 
                  className="glass-card hover-lift" 
                  onClick={() => {
                    setSchoolFilter('all');
                    setGradeFilter('all');
                    setSearchTerm('');
                    setActiveTab('students');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                    <Users style={{ width: '22px', height: '22px' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Total Students</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '2px 0 0 0' }}>{totalStudents}</h3>
                  </div>
                </div>

                <div 
                  className="glass-card hover-lift" 
                  onClick={() => setActiveTab('schools')}
                  style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                    <School style={{ width: '22px', height: '22px' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Active Schools</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '2px 0 0 0' }}>{totalActiveSchools}</h3>
                  </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
                    <Award style={{ width: '22px', height: '22px' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Collective XP</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '2px 0 0 0' }}>{totalXP}</h3>
                  </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <Trophy style={{ width: '22px', height: '22px' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Average Student XP</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '2px 0 0 0' }}>{averageXP}</h3>
                  </div>
                </div>
              </div>

              {/* Quick Exports Card */}
              <div className="glass-card" style={{ padding: isMobile ? '1.25rem 1rem' : '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Platform Data Exports</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1.5rem 0' }}>
                  Download high-level student performance analytics and registrations in clean CSV formats suitable for spreadsheet tools.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={handleDownloadAll}
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                      border: 'none',
                      color: '#fff',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)',
                      transition: 'all 0.2s',
                      width: isMobile ? '100%' : 'auto',
                      justifyContent: 'center'
                    }}
                    className="hover-lift"
                  >
                    <Download style={{ width: '16px', height: '16px' }} />
                    Download All Students CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHOOLS ANALYTICS */}
          {activeTab === 'schools' && (
            <div className="glass-card" style={{ padding: isMobile ? '1.25rem 1rem' : '2rem' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center', 
                gap: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)', 
                paddingBottom: '1rem', 
                marginBottom: '1.5rem' 
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>School Breakdown Statistics</h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Sorted by Total Collective XP</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontWeight: 700 }}>
                      <th style={{ padding: '12px 16px' }}>School Name</th>
                      <th style={{ padding: '12px 16px' }}>School Code</th>
                      <th style={{ padding: '12px 16px' }}>Total Registered</th>
                      <th style={{ padding: '12px 16px' }}>Total Collective XP</th>
                      <th style={{ padding: '12px 16px' }}>Average XP / Student</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolBreakdown.map((s, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                        <td 
                          onClick={() => handleSchoolClick(s.code)}
                          style={{ 
                            padding: '14px 16px', 
                            fontWeight: 700, 
                            color: '#06b6d4', 
                            cursor: 'pointer',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#06b6d4'}
                          title="Click to view students in this school"
                        >
                          🔍 {s.name}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#94a3b8', fontFamily: 'monospace' }}>{s.code}</td>
                        <td 
                          onClick={() => handleSchoolClick(s.code)}
                          style={{ padding: '14px 16px', fontWeight: 600, cursor: 'pointer' }}
                          title="Click to view students in this school"
                        >
                          {s.studentsCount} Students
                        </td>
                        <td style={{ padding: '14px 16px', color: '#06b6d4', fontWeight: 700 }}>{s.totalXp} XP</td>
                        <td style={{ padding: '14px 16px', color: '#8b5cf6', fontWeight: 700 }}>{s.avgXp} XP</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleDownloadSchool(s.code)}
                            style={{
                              background: 'rgba(6, 182, 212, 0.08)',
                              border: '1px solid rgba(6, 182, 212, 0.2)',
                              color: '#06b6d4',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.2s'
                            }}
                            className="hover-lift"
                          >
                            <Download style={{ width: '12px', height: '12px' }} />
                            Download CSV
                          </button>
                        </td>
                      </tr>
                    ))}
                    {schoolBreakdown.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                          No school data found. Ensure students have registered.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: STUDENT DIRECTORY */}
          {activeTab === 'students' && (
            <div className="glass-card" style={{ padding: isMobile ? '1.25rem 1rem' : '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Search & Filter Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {/* Search field */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search style={{ position: 'absolute', left: '12px', width: '16px', height: '16px', color: '#64748b' }} />
                  <input 
                    type="text"
                    placeholder="Search by student name or mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                {/* School Filter */}
                <select
                  value={schoolFilter}
                  onChange={(e) => setSchoolFilter(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all" style={{ background: '#0f0f16', color: '#fff' }}>All Schools</option>
                  {Object.entries(SCHOOL_MAPPING).map(([code, name]) => (
                    <option key={code} value={code} style={{ background: '#0f0f16', color: '#fff' }}>{name}</option>
                  ))}
                </select>

                {/* Grade Filter */}
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all" style={{ background: '#0f0f16', color: '#fff' }}>All Grades</option>
                  <option value="Grade 5" style={{ background: '#0f0f16', color: '#fff' }}>Grade 5</option>
                  <option value="Grade 6" style={{ background: '#0f0f16', color: '#fff' }}>Grade 6</option>
                  <option value="Grade 7" style={{ background: '#0f0f16', color: '#fff' }}>Grade 7</option>
                  <option value="Grade 8" style={{ background: '#0f0f16', color: '#fff' }}>Grade 8</option>
                  <option value="Grade 9" style={{ background: '#0f0f16', color: '#fff' }}>Grade 9</option>
                </select>

                {/* Reset button */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSchoolFilter('all');
                    setGradeFilter('all');
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#f3f4f6',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Clear Filters
                </button>
              </div>

              {/* View Mode Toggle and Info */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '1.25rem'
              }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students
                </span>
                
                <div style={{ 
                  display: 'flex', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  padding: '2px', 
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: viewMode === 'list' ? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' : 'transparent',
                      color: viewMode === 'list' ? '#fff' : '#94a3b8',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                  >
                    📋 List View
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: viewMode === 'grid' ? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' : 'transparent',
                      color: viewMode === 'grid' ? '#fff' : '#94a3b8',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                  >
                    🎴 Grid View
                  </button>
                </div>
              </div>

              {/* Student View Options */}
              {viewMode === 'list' ? (
                /* Student List Table */
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontWeight: 700 }}>
                        <th style={{ padding: '12px' }}>Rank</th>
                        <th style={{ padding: '12px' }}>Name</th>
                        <th style={{ padding: '12px' }}>Mobile Number</th>
                        <th style={{ padding: '12px' }}>School Name</th>
                        <th style={{ padding: '12px' }}>Grade</th>
                        <th style={{ padding: '12px' }}>XP Level</th>
                        <th style={{ padding: '12px' }}>Coins</th>
                        <th style={{ padding: '12px' }}>Streak</th>
                        <th style={{ padding: '12px' }}>Daily Speaking Time</th>
                        <th style={{ padding: '12px' }}>Completed Games</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: '#94a3b8' }}>#{idx + 1}</td>
                          <td style={{ padding: '12px', fontWeight: 700 }}>{s.name}</td>
                          <td style={{ padding: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>{s.mobileNumber}</td>
                          <td style={{ padding: '12px', color: '#94a3b8' }}>{getSchoolName(s.school)}</td>
                          <td style={{ padding: '12px' }}>{s.grade}</td>
                          <td style={{ padding: '12px', color: '#06b6d4', fontWeight: 700 }}>{s.xp} XP</td>
                          <td style={{ padding: '12px', color: '#f59e0b', fontWeight: 700 }}>{s.coins}</td>
                          <td style={{ padding: '12px', color: '#f97316', fontWeight: 700 }}>{s.streak} Days</td>
                          <td style={{ padding: '12px', color: '#10b981', fontWeight: 600 }}>
                            {Math.floor((s.dailyActiveSeconds || 0) / 60)} Mins
                          </td>
                          <td style={{ padding: '12px', color: '#8b5cf6', fontWeight: 700 }}>
                            {s.completedGames?.length || 0} Games
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={10} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                            No students matching filters found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Student Cards Grid */
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '1.25rem',
                  marginTop: '0.5rem'
                }}>
                  {filteredStudents.map((s, idx) => (
                    <div 
                      key={idx}
                      className="glass-card hover-lift"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem',
                        padding: '1.5rem 1.25rem',
                        position: 'relative',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      {/* Rank Indicator Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        fontSize: '0.72rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        fontWeight: 800,
                        color: '#94a3b8'
                      }}>
                        #{idx + 1}
                      </div>

                      {/* Name & Grade/School */}
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 4px 0', paddingRight: '2.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.name}
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.grade} • {getSchoolName(s.school)}
                        </span>
                      </div>

                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                      {/* Info list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>Mobile:</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.mobileNumber}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>XP Level:</span>
                          <span style={{ color: '#06b6d4', fontWeight: 800 }}>{s.xp} XP</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>Coins:</span>
                          <span style={{ color: '#f59e0b', fontWeight: 700 }}>{s.coins}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>Streak:</span>
                          <span style={{ color: '#f97316', fontWeight: 700 }}>{s.streak} Days 🔥</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>Speaking:</span>
                          <span style={{ color: '#10b981', fontWeight: 700 }}>{Math.floor((s.dailyActiveSeconds || 0) / 60)} Mins</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>Completed Games:</span>
                          <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{s.completedGames?.length || 0} Games 🎮</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredStudents.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                      No students matching filters found.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
