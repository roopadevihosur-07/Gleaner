'use client';

export default function Footer() {
  return (
    <footer style={{
      background: '#0e1012',
      borderTop: '1px solid #1c1f24',
      padding: '48px 24px',
      marginTop: '96px'
    }}>
      <div style={{ maxWidth: '1344px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: '#566171', fontSize: '14px' }}>Gleaner — Disruption-to-Dispatch Agent for Food Banks</p>
        <p style={{ color: '#566171', fontSize: '12px', marginTop: '8px' }}>
          Built with Claude AI, Google Maps, and FastAPI | Data-driven. Auditable. Human-approved.
        </p>
      </div>
    </footer>
  );
}
