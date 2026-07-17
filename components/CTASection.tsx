'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section style={{ maxWidth: '1344px', margin: '0 auto', padding: '96px 24px', borderTop: '1px solid #1c1f24' }}>
      <div style={{
        background: '#15171b',
        border: '1px solid #1c1f24',
        borderRadius: '24px',
        padding: '60px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
          Ready to See Gleaner in Action?
        </h2>
        <p style={{ fontSize: '16px', color: '#a0aaba', maxWidth: '800px', margin: '0 auto 32px auto', lineHeight: 1.8 }}>
          Launch the live demo. Simulate a real disruption and watch Gleaner orchestrate a recovery plan in seconds.
          No learning curve—just AI-powered supply chain intelligence.
        </p>
        <Link href="/app" className="btn-primary" style={{ display: 'inline-block' }}>
          Launch Gleaner →
        </Link>
      </div>
    </section>
  );
}
