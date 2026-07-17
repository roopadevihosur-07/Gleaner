'use client';

export default function FlowDiagram() {
  return (
    <svg
      viewBox="0 0 1400 280"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '280px',
        display: 'block',
      }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="heroGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <style>{`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </defs>

      {/* Step 1: Signal */}
      <g style={{ animation: 'slideIn 0.8s ease-out 0s both' }}>
        <rect x="30" y="50" width="140" height="180" rx="16" fill="#1c1f24" stroke="#0062ca" strokeWidth="2.5" opacity="0.9"/>
        <circle cx="100" cy="85" r="36" fill="#23262d" stroke="#0062ca" strokeWidth="2.5" filter="url(#heroGlow)"/>
        <text x="100" y="102" fontSize="48" textAnchor="middle" fill="#0062ca">📍</text>
        <text x="100" y="175" fontSize="18" fontWeight="700" textAnchor="middle" fill="#ffffff" fontFamily="'Cera Pro', ui-sans-serif" letterSpacing="-0.02em">Signal</text>
        <text x="100" y="205" fontSize="14" fontWeight="400" textAnchor="middle" fill="#a0aaba" fontFamily="'Cera Pro', ui-sans-serif">Issue detected</text>
      </g>

      {/* Arrow 1 */}
      <g opacity="0.7" style={{ animation: 'slideIn 0.8s ease-out 0.15s both' }}>
        <line x1="190" y1="140" x2="250" y2="140" stroke="#007afc" strokeWidth="3.5" strokeLinecap="round"/>
        <polygon points="250,140 233,132 240,140 233,148" fill="#007afc"/>
      </g>

      {/* Step 2: Disruption */}
      <g style={{ animation: 'slideIn 0.8s ease-out 0.15s both' }}>
        <rect x="270" y="50" width="140" height="180" rx="16" fill="#1c1f24" stroke="#0062ca" strokeWidth="2.5" opacity="0.9"/>
        <circle cx="340" cy="85" r="36" fill="#23262d" stroke="#0062ca" strokeWidth="2.5" filter="url(#heroGlow)"/>
        <text x="340" y="102" fontSize="48" textAnchor="middle" fill="#0062ca">⚡</text>
        <text x="340" y="175" fontSize="18" fontWeight="700" textAnchor="middle" fill="#ffffff" fontFamily="'Cera Pro', ui-sans-serif" letterSpacing="-0.02em">Disruption</text>
        <text x="340" y="205" fontSize="14" fontWeight="400" textAnchor="middle" fill="#a0aaba" fontFamily="'Cera Pro', ui-sans-serif">Cut or delayed</text>
      </g>

      {/* Arrow 2 */}
      <g opacity="0.7" style={{ animation: 'slideIn 0.8s ease-out 0.3s both' }}>
        <line x1="430" y1="140" x2="490" y2="140" stroke="#007afc" strokeWidth="3.5" strokeLinecap="round"/>
        <polygon points="490,140 473,132 480,140 473,148" fill="#007afc"/>
      </g>

      {/* Step 3: Gleaner */}
      <g style={{ animation: 'slideIn 0.8s ease-out 0.3s both' }}>
        <rect x="510" y="50" width="140" height="180" rx="16" fill="#1c1f24" stroke="#007afc" strokeWidth="2.5" opacity="0.9"/>
        <circle cx="580" cy="85" r="36" fill="#23262d" stroke="#007afc" strokeWidth="2.5" filter="url(#heroGlow)"/>
        <text x="580" y="102" fontSize="48" textAnchor="middle" fill="#007afc">🧠</text>
        <text x="580" y="175" fontSize="18" fontWeight="700" textAnchor="middle" fill="#ffffff" fontFamily="'Cera Pro', ui-sans-serif" letterSpacing="-0.02em">Gleaner</text>
        <text x="580" y="205" fontSize="14" fontWeight="400" textAnchor="middle" fill="#a0aaba" fontFamily="'Cera Pro', ui-sans-serif">30 seconds</text>
      </g>

      {/* Arrow 3 */}
      <g opacity="0.7" style={{ animation: 'slideIn 0.8s ease-out 0.45s both' }}>
        <line x1="670" y1="140" x2="730" y2="140" stroke="#007afc" strokeWidth="3.5" strokeLinecap="round"/>
        <polygon points="730,140 713,132 720,140 713,148" fill="#007afc"/>
      </g>

      {/* Step 4: Delivery */}
      <g style={{ animation: 'slideIn 0.8s ease-out 0.45s both' }}>
        <rect x="750" y="50" width="140" height="180" rx="16" fill="#1c1f24" stroke="#228a56" strokeWidth="2.5" opacity="0.9"/>
        <circle cx="820" cy="85" r="36" fill="#23262d" stroke="#228a56" strokeWidth="2.5" filter="url(#heroGlow)"/>
        <text x="820" y="102" fontSize="48" textAnchor="middle" fill="#228a56">🚚</text>
        <text x="820" y="175" fontSize="18" fontWeight="700" textAnchor="middle" fill="#ffffff" fontFamily="'Cera Pro', ui-sans-serif" letterSpacing="-0.02em">Delivery</text>
        <text x="820" y="205" fontSize="14" fontWeight="400" textAnchor="middle" fill="#a0aaba" fontFamily="'Cera Pro', ui-sans-serif">Optimized</text>
      </g>

      {/* Arrow 4 */}
      <g opacity="0.7" style={{ animation: 'slideIn 0.8s ease-out 0.6s both' }}>
        <line x1="910" y1="140" x2="970" y2="140" stroke="#007afc" strokeWidth="3.5" strokeLinecap="round"/>
        <polygon points="970,140 953,132 960,140 953,148" fill="#007afc"/>
      </g>

      {/* Step 5: Impact */}
      <g style={{ animation: 'slideIn 0.8s ease-out 0.6s both' }}>
        <rect x="990" y="50" width="140" height="180" rx="16" fill="#1c1f24" stroke="#228a56" strokeWidth="2.5" opacity="0.9"/>
        <circle cx="1060" cy="85" r="36" fill="#23262d" stroke="#228a56" strokeWidth="2.5" filter="url(#heroGlow)"/>
        <text x="1060" y="102" fontSize="48" textAnchor="middle" fill="#228a56">🍜</text>
        <text x="1060" y="175" fontSize="18" fontWeight="700" textAnchor="middle" fill="#ffffff" fontFamily="'Cera Pro', ui-sans-serif" letterSpacing="-0.02em">Impact</text>
        <text x="1060" y="205" fontSize="14" fontWeight="400" textAnchor="middle" fill="#a0aaba" fontFamily="'Cera Pro', ui-sans-serif">11K meals</text>
      </g>

      {/* Arrow 5 */}
      <g opacity="0.7" style={{ animation: 'slideIn 0.8s ease-out 0.75s both' }}>
        <line x1="1150" y1="140" x2="1210" y2="140" stroke="#007afc" strokeWidth="3.5" strokeLinecap="round"/>
        <polygon points="1210,140 1193,132 1200,140 1193,148" fill="#007afc"/>
      </g>

      {/* Step 6: Approved */}
      <g style={{ animation: 'slideIn 0.8s ease-out 0.75s both' }}>
        <rect x="1230" y="50" width="140" height="180" rx="16" fill="#1c1f24" stroke="#228a56" strokeWidth="2.5" opacity="0.9"/>
        <circle cx="1300" cy="85" r="36" fill="#23262d" stroke="#228a56" strokeWidth="2.5" filter="url(#heroGlow)"/>
        <text x="1300" y="102" fontSize="48" textAnchor="middle" fill="#228a56">✓</text>
        <text x="1300" y="175" fontSize="18" fontWeight="700" textAnchor="middle" fill="#ffffff" fontFamily="'Cera Pro', ui-sans-serif" letterSpacing="-0.02em">Approved</text>
        <text x="1300" y="205" fontSize="14" fontWeight="400" textAnchor="middle" fill="#a0aaba" fontFamily="'Cera Pro', ui-sans-serif">Human OK</text>
      </g>

      {/* Pulsing data flow dots */}
      <circle cx="100" cy="140" r="5" fill="#007afc" opacity="0.6">
        <animate attributeName="r" values="5;10;5" dur="2.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="340" cy="140" r="5" fill="#007afc" opacity="0.6">
        <animate attributeName="r" values="5;10;5" dur="2.4s" repeatCount="indefinite" begin="0.4s"/>
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.4s" repeatCount="indefinite" begin="0.4s"/>
      </circle>
      <circle cx="580" cy="140" r="5" fill="#007afc" opacity="0.6">
        <animate attributeName="r" values="5;10;5" dur="2.4s" repeatCount="indefinite" begin="0.8s"/>
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.4s" repeatCount="indefinite" begin="0.8s"/>
      </circle>
      <circle cx="820" cy="140" r="5" fill="#007afc" opacity="0.6">
        <animate attributeName="r" values="5;10;5" dur="2.4s" repeatCount="indefinite" begin="1.2s"/>
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.4s" repeatCount="indefinite" begin="1.2s"/>
      </circle>
      <circle cx="1060" cy="140" r="5" fill="#007afc" opacity="0.6">
        <animate attributeName="r" values="5;10;5" dur="2.4s" repeatCount="indefinite" begin="1.6s"/>
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.4s" repeatCount="indefinite" begin="1.6s"/>
      </circle>
    </svg>
  );
}
