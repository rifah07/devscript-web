import { Pausable } from './Pausable';

// Misk masthead: an eight-pointed star (khatam) from Islamic geometry. Two
// squares, one turned 45°, draw themselves once; an outer ring turns very
// slowly, and a few motes of light drift upward like lamp dust.
const MOTES = [
  { left: '18%', top: '70%', d: '11s', delay: '0s', dx: '8px' },
  { left: '74%', top: '64%', d: '13s', delay: '-4s', dx: '-10px' },
  { left: '48%', top: '82%', d: '10s', delay: '-7s', dx: '4px' },
  { left: '32%', top: '40%', d: '14s', delay: '-2s', dx: '-6px' },
  { left: '66%', top: '30%', d: '12s', delay: '-9s', dx: '6px' },
];

export function Khatam() {
  return (
    <Pausable className="khatam">
      <svg viewBox="-50 -50 100 100" role="presentation">
        <g className="slow-turn">
          <circle className="line" r={46} style={{ strokeDasharray: '2 4' }} />
        </g>
        <rect className="line" x={-30} y={-30} width={60} height={60} />
        <rect className="line" x={-30} y={-30} width={60} height={60} transform="rotate(45)" style={{ '--delay': '0.4s' } as React.CSSProperties} />
        <circle className="line" r={19} style={{ '--delay': '1s' } as React.CSSProperties} />
        <rect className="line" x={-13.4} y={-13.4} width={26.8} height={26.8} transform="rotate(22.5)" style={{ '--delay': '1.4s' } as React.CSSProperties} />
      </svg>
      {MOTES.map((m) => (
        <span
          key={m.left + m.top}
          className="mote"
          style={{ left: m.left, top: m.top, '--d': m.d, '--delay': m.delay, '--dx': m.dx } as React.CSSProperties}
        />
      ))}
    </Pausable>
  );
}
