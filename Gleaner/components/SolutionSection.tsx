'use client';

export default function SolutionSection() {
  const steps = [
    { num: '1', icon: '◎', title: 'Sense', desc: 'A supply shock is detected' },
    { num: '2', icon: '▤', title: 'Analyze', desc: 'Calculate the gap & impact' },
    { num: '3', icon: '$', title: 'Fill', desc: 'Find cheapest vendor' },
    { num: '4', icon: '⟿', title: 'Replan', desc: 'Optimize routes' },
    { num: '5', icon: '✓', title: 'Approve', desc: 'Human reviews plan' },
    { num: '6', icon: '✦', title: 'Impact', desc: 'Meals protected' },
  ];

  return (
    <section id="solution" style={{ maxWidth: '1344px', margin: '0 auto', padding: '96px 24px', borderTop: '1px solid #1c1f24' }}>
      <h2 style={{ fontSize: '44px', fontWeight: 700, letterSpacing: '-0.88px', marginBottom: '48px', textAlign: 'center', color: 'white' }}>
        How Gleaner Works
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '48px' }}>
        {steps.map((step, i) => (
          <div key={i} style={{
            background: '#15171b',
            border: '1px solid #1c1f24',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: '#007afc',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontWeight: 700,
              fontSize: '18px'
            }}>
              {step.num}
            </div>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>{step.icon}</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
              {step.title}
            </h3>
            <p style={{ fontSize: '13px', color: '#8b96aa', lineHeight: 1.6 }}>{step.desc}</p>
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
          What Happens in the Demo
        </h3>
        <p style={{ fontSize: '16px', color: '#a0aaba', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
          Click "Simulate Issue" to trigger a real disruption. Watch Gleaner's agent work in real-time:
          live metrics updating, routes visualized on Google Maps, agent reasoning shown step-by-step,
          and impact scored in the one metric everyone understands: meals protected.
        </p>
      </div>
    </section>
  );
}
