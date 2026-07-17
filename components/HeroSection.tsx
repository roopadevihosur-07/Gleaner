'use client';

import Link from 'next/link';
import FlowDiagram from './FlowDiagram';

export default function HeroSection() {
  return (
    <section style={{ maxWidth: '1344px', margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
      <div style={{
        display: 'inline-block',
        backgroundColor: '#0062ca',
        color: 'white',
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.84px',
        padding: '6px 12px',
        borderRadius: '4px',
        marginBottom: '24px'
      }}>
        AI-POWERED SUPPLY CHAIN ORCHESTRATION
      </div>

      <h1 style={{
        fontSize: '68px',
        fontWeight: 700,
        letterSpacing: '-1.36px',
        lineHeight: 1,
        marginBottom: '20px',
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: 'white'
      }}>
        Gleaner
      </h1>

      <p style={{
        fontSize: '20px',
        color: '#a0aaba',
        maxWidth: '720px',
        margin: '0 auto 40px auto',
        lineHeight: 1.6
      }}>
        Turn supply shocks into coordinated recovery plans in seconds—every option scored in meals.
      </p>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '96px' }}>
        <Link href="/app" className="btn-primary">
          Launch Gleaner →
        </Link>
        <button
          onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
          className="btn-secondary"
        >
          Learn More
        </button>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        height: '480px',
        background: 'linear-gradient(135deg, #1c1f24 0%, #23262d 100%)',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 100px 50px rgba(0, 122, 252, 0.1)',
        padding: '40px 20px',
        border: '1px solid #1c1f24',
        overflow: 'hidden'
      }}>
        <FlowDiagram />
      </div>
    </section>
  );
}
