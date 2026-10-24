import { Pausable } from './Pausable';

// Misk masthead: a mihrab arch with a hanging lamp (qandeel). The arches draw
// themselves once, the lamp glows, and a few motes of light drift up from it.
const MOTES = [
  { left: '44%', top: '62%', d: '11s', delay: '0s', dx: '8px' },
  { left: '56%', top: '58%', d: '13s', delay: '-4s', dx: '-10px' },
  { left: '50%', top: '70%', d: '10s', delay: '-7s', dx: '4px' },
  { left: '40%', top: '48%', d: '14s', delay: '-2s', dx: '-6px' },
  { left: '60%', top: '44%', d: '12s', delay: '-9s', dx: '6px' },
];

export function Mihrab() {
  return (
    <Pausable className="mihrab">
      <svg viewBox="-50 -50 100 100" role="presentation">
        <path className="line" d="M -30 46 V -4 C -30 -24 -14 -34 0 -48 C 14 -34 30 -24 30 -4 V 46 Z" />
        <path
          className="line"
          d="M -22 46 V 0 C -22 -16 -10 -24 0 -36 C 10 -24 22 -16 22 0 V 46"
          style={{ '--delay': '0.4s' } as React.CSSProperties}
        />
        <path className="line" d="M -38 46 H 38" style={{ '--delay': '0.8s' } as React.CSSProperties} />
        <path
          className="line"
          d="M 0 -36 V -16 M -3 -16 H 3 L 4.5 -12 C 9 -9 9 1 0 4 C -9 1 -9 -9 -4.5 -12 Z M -4.5 -12 H 4.5 M 0 4 V 8"
          style={{ '--delay': '1.2s' } as React.CSSProperties}
        />
        <circle className="glow halo" cy={-4} r={9} />
        <circle className="glow" cy={-4} r={2} />
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
