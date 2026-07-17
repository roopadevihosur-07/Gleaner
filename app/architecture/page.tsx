'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ArchitecturePage() {
  return (
    <main style={{ backgroundColor: '#0e1012', minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      <Header />

      <section style={{ maxWidth: '1344px', margin: '0 auto', padding: '96px 24px', borderTop: '1px solid #1c1f24' }}>
        <h1 style={{ fontSize: '68px', fontWeight: 700, letterSpacing: '-1.36px', lineHeight: 1, marginBottom: '40px', textAlign: 'center', color: 'white' }}>
          System Architecture
        </h1>

        {/* 8-Step Timeline */}
        <div style={{ marginBottom: '96px' }}>
          <h2 style={{ fontSize: '44px', fontWeight: 700, letterSpacing: '-0.88px', marginBottom: '48px', textAlign: 'center', color: 'white' }}>
            The Gleaner Workflow
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
            {[
              { num: '1', title: 'Signal', desc: 'Supply disruption detected from live feed' },
              { num: '2', title: 'Analyze', desc: 'Claude AI calculates gap & impact' },
              { num: '3', title: 'Fill', desc: 'Search for optimal vendors' },
              { num: '4', title: 'Plan', desc: 'Optimize routes, minimize cost' },
              { num: '5', title: 'Review', desc: 'Human planner approves' },
              { num: '6', title: 'Execute', desc: 'Dispatch to fulfillment' },
              { num: '7', title: 'Monitor', desc: 'Track shipment in real-time' },
              { num: '8', title: 'Impact', desc: 'Measure meals protected' },
            ].map((step, i) => (
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
                  margin: '0 auto 16px',
                  fontWeight: 700,
                  fontSize: '18px'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#8b96aa', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Layer Architecture */}
        <div style={{ marginBottom: '96px', borderTop: '1px solid #1c1f24', paddingTop: '96px' }}>
          <h2 style={{ fontSize: '44px', fontWeight: 700, letterSpacing: '-0.88px', marginBottom: '48px', textAlign: 'center', color: 'white' }}>
            System Layers
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            {[
              {
                title: 'Presentation Layer',
                desc: 'Next.js 14 frontend with Tailwind CSS, interactive components, real-time dashboards, Google Maps visualization',
                icon: '🎨'
              },
              {
                title: 'API Layer',
                desc: 'FastAPI with WebSocket support, REST endpoints for state/disruption/agents, event streaming, authentication',
                icon: '⚙️'
              },
              {
                title: 'Agent Layer',
                desc: 'Claude AI orchestration, deterministic tool execution, supply chain planning algorithms, human-in-the-loop approval',
                icon: '🧠'
              },
              {
                title: 'Data Layer',
                desc: 'Supply chain state (agencies, vendors, inventory), MCP integration, CSV/Excel ingestion, audit logging',
                icon: '💾'
              }
            ].map((layer, i) => (
              <div key={i} style={{
                background: '#15171b',
                border: '1px solid #1c1f24',
                borderRadius: '24px',
                padding: '40px'
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '40px' }}>{layer.icon}</div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
                      {layer.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#a0aaba', lineHeight: 1.6, maxWidth: '600px' }}>
                      {layer.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Concepts */}
        <div style={{ borderTop: '1px solid #1c1f24', paddingTop: '96px' }}>
          <h2 style={{ fontSize: '44px', fontWeight: 700, letterSpacing: '-0.88px', marginBottom: '48px', textAlign: 'center', color: 'white' }}>
            Key Concepts
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              {
                title: 'Real-Time Detection',
                items: [
                  'Live feed monitoring',
                  'Webhook integration',
                  'MCP channel support',
                  'Instant disruption alerts'
                ]
              },
              {
                title: 'Intelligent Planning',
                items: [
                  'Claude AI reasoning',
                  'Deterministic tools (not hallucinations)',
                  'Multi-objective optimization',
                  'Route planning with constraints'
                ]
              },
              {
                title: 'Human Approval',
                items: [
                  'Always human review',
                  'Auditable decision logs',
                  'Plain-language plans',
                  'No autonomous execution'
                ]
              }
            ].map((concept, i) => (
              <div key={i} style={{
                background: '#15171b',
                border: '1px solid #1c1f24',
                borderRadius: '24px',
                padding: '32px'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
                  {concept.title}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {concept.items.map((item, j) => (
                    <li key={j} style={{ fontSize: '14px', color: '#a0aaba', marginBottom: '8px', paddingLeft: '20px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#228a56' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
