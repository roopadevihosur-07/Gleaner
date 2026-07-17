'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      background: '#0e1012',
      borderBottom: '1px solid #1c1f24',
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 0 100px 50px rgba(14, 16, 18, 0.5)'
    }}>
      <div style={{ maxWidth: '1344px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: '#23262d',
            borderRadius: '6px',
            fontSize: '22px'
          }}>
            🌾
          </div>
          <span style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>Gleaner</span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#problem" style={{ color: '#a0aaba', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = '#007afc'} onMouseOut={(e) => e.currentTarget.style.color = '#a0aaba'}>
            The Problem
          </a>
          <a href="#solution" style={{ color: '#a0aaba', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = '#007afc'} onMouseOut={(e) => e.currentTarget.style.color = '#a0aaba'}>
            How It Works
          </a>
          <a href="#features" style={{ color: '#a0aaba', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = '#007afc'} onMouseOut={(e) => e.currentTarget.style.color = '#a0aaba'}>
            Features
          </a>
          <Link href="/architecture" style={{ color: '#a0aaba', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#007afc'} onMouseOut={(e) => e.currentTarget.style.color = '#a0aaba'}>
            Architecture
          </Link>
          <Link href="/app" className="btn-primary" style={{ fontSize: '14px', padding: '10px 24px', display: 'inline-block' }}>
            Launch App →
          </Link>
        </nav>
      </div>
    </header>
  );
}
