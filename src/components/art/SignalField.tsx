import { Pausable } from './Pausable';

// DevScript hero: circuit traces with data packets running along them.
// Each packet is the same path drawn with a short dash; animating the dash
// offset slides it along. pathLength="600" makes every path "600 long", so
// one dash pattern fits all of them. No JS runs per frame.
const TRACES = [
  'M0 46 H150 V96 H330 V62 H470 V30 H640',
  'M0 150 H96 V118 H262 V170 H446 V122 H640',
  'M60 0 V24 H214 V200',
  'M402 200 V150 H560 V80 H640',
  'M520 0 V40 H600 V200',
];
const NODES: [number, number][] = [
  [150, 96], [330, 62], [470, 30], [96, 118], [262, 170], [446, 122],
  [214, 24], [402, 150], [560, 80], [600, 40],
];

export function SignalField() {
  return (
    <Pausable className="hero">
      <svg className="hero-art signal" viewBox="0 0 640 200" role="presentation">
        {TRACES.map((d) => (
          <path key={d} className="trace" d={d} />
        ))}
        {TRACES.map((d, i) => (
          <path
            key={`p${d}`}
            className="packet"
            d={d}
            pathLength={600}
            style={{ '--d': `${3.2 + i * 0.9}s`, '--delay': `${i * -1.3}s` } as React.CSSProperties}
          />
        ))}
        {NODES.map(([x, y]) => (
          <circle key={`${x}-${y}`} className="node" cx={x} cy={y} r={3.5} />
        ))}
      </svg>
    </Pausable>
  );
}
