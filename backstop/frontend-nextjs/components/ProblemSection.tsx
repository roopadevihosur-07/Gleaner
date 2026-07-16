'use client';

export default function ProblemSection() {
  const problems = [
    {
      icon: '⚡',
      title: 'Disruptions Hit Fast',
      desc: 'Federal cuts or supply shortfalls happen without warning. A single load delay ripples across 10+ agencies in minutes.',
    },
    {
      icon: '⏱️',
      title: 'No Time to Respond',
      desc: "Today's recovery takes hours or days across two teams, two tools, two separate scrambles—while food spoils.",
    },
    {
      icon: '💔',
      title: 'Real People Miss Meals',
      desc: '11,300 lbs of protein short = 9,417 meals at risk across vulnerable communities. Every hour matters.',
    },
  ];

  return (
    <section id="problem" style={{ maxWidth: '1344px', margin: '0 auto', padding: '96px 24px', borderTop: '1px solid #1c1f24' }}>
      <h2 style={{ fontSize: '44px', fontWeight: 700, letterSpacing: '-0.88px', marginBottom: '48px', textAlign: 'center', color: 'white' }}>
        The Crisis Food Banks Face
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '48px' }}>
        {problems.map((problem, i) => (
          <div key={i} style={{
            background: '#15171b',
            border: '1px solid #1c1f24',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{problem.icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>{problem.title}</h3>
            <p style={{ fontSize: '14px', color: '#8b96aa', lineHeight: 1.6 }}>{problem.desc}</p>
          </div>
        ))}
      </div>

      <div style={{
        background: '#15171b',
        border: '1px solid #1c1f24',
        borderRadius: '24px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
          Today's Workflow Doesn't Scale
        </h3>
        <p style={{ fontSize: '16px', color: '#a0aaba', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
          Procurement scrambles to fill the gap. Distribution scrambles to deliver it. No coordination. No speed. Two separate days become one crisis.
        </p>
      </div>
    </section>
  );
}
