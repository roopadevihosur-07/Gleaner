'use client';

export default function FeaturesSection() {
  const features = [
    { icon: '⚙️', title: 'Genuine Agentic Planning', desc: 'Claude (reasoning) decides what to ask. Tools (math) answer auditably. No hallucination.' },
    { icon: '🔗', title: 'Unified Procurement + Distribution', desc: 'Closes the loop between the two halves of the same shock—no hand-off delays.' },
    { icon: '⚡', title: 'Seconds, Not Days', desc: 'From shock signal to approved plan in under 30 seconds. Perishables stay fresh.' },
    { icon: '📍', title: 'Real-Time Issue Detection', desc: 'Live issues feed pulls from maps and tracking systems. Critical disruptions auto-trigger.' },
    { icon: '👥', title: 'Human-in-the-Loop', desc: 'Gleaner proposes; humans approve. Tools that make people better, not tools that replace them.' },
    { icon: '🍜', title: 'Everything Scored in Meals', desc: 'Not miles, not dollars. Real food to real people. Everyone speaks meals.' },
  ];

  const metrics = [
    { number: '30s', label: 'Time to Plan' },
    { number: '11K+', label: 'Meals Protected / Event' },
    { number: '$9.9K', label: 'Avg Cost Saved' },
    { number: '116→79', label: 'Miles Optimized' },
  ];

  return (
    <section id="features" style={{ maxWidth: '1344px', margin: '0 auto', padding: '96px 24px', borderTop: '1px solid #1c1f24' }}>
      <h2 style={{ fontSize: '44px', fontWeight: 700, letterSpacing: '-0.88px', marginBottom: '48px', textAlign: 'center', color: 'white' }}>
        Key Capabilities
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '60px' }}>
        {features.map((feature, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px' }}>
            <div style={{ fontSize: '40px' }}>{feature.icon}</div>
            <div>
              <h3 style={{ fontWeight: 700, color: 'white', marginBottom: '8px', fontSize: '16px' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#8b96aa', lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
        {metrics.map((metric, i) => (
          <div key={i} style={{
            background: '#15171b',
            border: '1px solid #1c1f24',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#007afc', marginBottom: '8px' }}>
              {metric.number}
            </div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.84px', color: '#566171' }}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
