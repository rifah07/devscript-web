import { site, type Scene } from '@/site/config';

// Hand-drawn SVG landscapes behind the page for the themes that have one.
// Every scene renders; CSS shows the one matching <html data-theme>, so the
// right picture is there on first paint, before any JavaScript runs.
// Motion is CSS only and stops under prefers-reduced-motion.
export function Scenery() {
  const scenes = new Set(site.themes.map((t) => t.scene).filter(Boolean) as Scene[]);
  if (!scenes.size) return null;
  return (
    <div className="scenery" aria-hidden="true">
      {scenes.has('meadow') && <Meadow />}
      {scenes.has('moonlit') && <Moonlit />}
      {scenes.has('earth') && <Earth />}
    </div>
  );
}

// Paper grain on top of every scene, so flat vector shapes feel painted
function Grain({ id }: { id: string }) {
  return (
    <>
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} className="grain" />
    </>
  );
}

function Meadow() {
  return (
    <svg className="scene scene-meadow" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="m-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe6ee" />
          <stop offset="0.55" stopColor="#eef2e2" />
          <stop offset="1" stopColor="#f7ecd9" />
        </linearGradient>
        <radialGradient id="m-sun">
          <stop offset="0" stopColor="#fff8df" />
          <stop offset="1" stopColor="#fff8df" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="m-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6eef0" />
          <stop offset="1" stopColor="#a9d3d6" />
        </linearGradient>
      </defs>

      <rect width="1600" height="1000" fill="url(#m-sky)" />
      <circle cx="1250" cy="230" r="260" fill="url(#m-sun)" />

      <g className="clouds">
        <Cloud x={180} y={170} s={1} />
        <Cloud x={760} y={110} s={0.7} />
        <Cloud x={1320} y={300} s={0.85} />
      </g>

      {/* hills, far to near: each a little greener and less hazy */}
      <path d="M0 600 C 220 520 420 560 620 590 S 1020 520 1240 560 1500 600 1600 580 V1000 H0Z" fill="#cfe0bd" />
      <path d="M0 680 C 260 610 520 660 760 690 S 1180 620 1400 650 1600 700 1600 700 V1000 H0Z" fill="#b2d09e" />

      {/* the river winds down from the far hills, on the right where the page doesn't cover it */}
      <g transform="translate(330 0)">
        <path
          className="river"
          d="M930 600 C 900 650 980 690 940 740 S 820 820 880 880 1040 950 990 1000 H1180 C 1210 950 1060 900 1040 860 S 1120 760 1060 720 980 650 990 600Z"
          fill="url(#m-water)"
        />
        <path className="shimmer" d="M960 660 C 950 700 990 720 965 760 S 900 830 940 880 1060 940 1050 990" />
      </g>

      <path d="M0 780 C 300 720 560 760 800 800 S 1260 760 1600 800 V1000 H0Z" fill="#93bd84" opacity="0.92" />

      <ellipse cx="420" cy="880" rx="210" ry="46" fill="url(#m-water)" />
      <g className="ripples">
        <ellipse cx="420" cy="880" rx="60" ry="12" />
        <ellipse cx="420" cy="880" rx="60" ry="12" />
      </g>

      <g className="trees">
        <Tree x={140} y={800} h={190} />
        <Tree x={250} y={815} h={140} />
        <Pine x={1500} y={790} h={220} />
        <Pine x={1570} y={805} h={170} />
        <Tree x={1170} y={800} h={200} />
        <Pine x={640} y={700} h={110} />
        <Pine x={690} y={705} h={80} />
      </g>

      <Grain id="m-grain" />
    </svg>
  );
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.85">
      <ellipse cx="0" cy="0" rx="110" ry="34" />
      <ellipse cx="-50" cy="-18" rx="60" ry="40" />
      <ellipse cx="40" cy="-28" rx="70" ry="48" />
    </g>
  );
}

// A round deciduous tree: layered blobs, darker underneath
function Tree({ x, y, h }: { x: number; y: number; h: number }) {
  const r = h * 0.32;
  return (
    <g className="sway" style={{ transformOrigin: `${x}px ${y}px` }}>
      <path d={`M${x - 5} ${y} L${x - 3} ${y - h * 0.55} L${x + 3} ${y - h * 0.55} L${x + 5} ${y}Z`} fill="#6d5a45" />
      <circle cx={x - r * 0.45} cy={y - h * 0.6} r={r * 0.8} fill="#5d8f58" />
      <circle cx={x + r * 0.5} cy={y - h * 0.62} r={r * 0.75} fill="#6a9c63" />
      <circle cx={x} cy={y - h * 0.82} r={r} fill="#7aab70" />
    </g>
  );
}

function Pine({ x, y, h }: { x: number; y: number; h: number }) {
  const w = h * 0.36;
  return (
    <g className="sway" style={{ transformOrigin: `${x}px ${y}px` }}>
      <rect x={x - 3} y={y - h * 0.15} width="6" height={h * 0.15} fill="#6d5a45" />
      <path d={`M${x} ${y - h} L${x + w} ${y - h * 0.15} H${x - w}Z`} fill="#4f7d4f" />
      <path d={`M${x} ${y - h} L${x + w * 0.35} ${y - h * 0.15} H${x - w}Z`} fill="#5f8f5c" />
    </g>
  );
}

// Same stars on the server and in the browser: a tiny seeded generator
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

function Moonlit() {
  const rand = seeded(7);
  const stars = Array.from({ length: 110 }, () => ({
    x: rand() * 1600,
    y: rand() * 560,
    r: rand() < 0.9 ? 0.6 + rand() * 1.1 : 1.8 + rand(),
    delay: rand() * 6,
  }));
  return (
    <svg className="scene scene-moonlit" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="n-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060b1f" />
          <stop offset="0.55" stopColor="#10224f" />
          <stop offset="0.68" stopColor="#24427a" />
        </linearGradient>
        <radialGradient id="n-glow">
          <stop offset="0" stopColor="#f6e7b0" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f6e7b0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="n-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#173a6e" />
          <stop offset="1" stopColor="#060f26" />
        </linearGradient>
      </defs>

      <rect width="1600" height="1000" fill="url(#n-sky)" />

      <g className="stars" fill="#f3f1e6">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x.toFixed(1)}
            cy={s.y.toFixed(1)}
            r={s.r.toFixed(2)}
            style={{ animationDelay: `${s.delay.toFixed(2)}s` }}
          />
        ))}
      </g>
      <line className="shooting-star" x1="300" y1="120" x2="420" y2="170" />

      <circle className="moon-glow" cx="1330" cy="230" r="230" fill="url(#n-glow)" />
      <circle cx="1330" cy="230" r="70" fill="#f6e7b0" />
      <circle cx="1308" cy="214" r="12" fill="#e8d596" />
      <circle cx="1355" cy="252" r="8" fill="#e8d596" />

      {/* distant islands on the horizon */}
      <path
        d="M0 682 C 120 650 240 640 330 670 S 480 660 540 682Z M1240 682 C 1320 640 1440 630 1600 660 V682Z"
        fill="#0b1838"
      />

      <rect y="680" width="1600" height="320" fill="url(#n-sea)" />

      {/* the moon's path on the water */}
      <g className="moonpath" stroke="#f6e7b0" strokeLinecap="round">
        {Array.from({ length: 14 }, (_, i) => {
          const y = 700 + i * 20;
          const w = 30 + i * 9;
          return (
            <line
              key={i}
              x1={1330 - w / 2}
              x2={1330 + w / 2}
              y1={y}
              y2={y}
              strokeWidth={1.5 + i * 0.15}
              style={{ animationDelay: `${(i % 5) * 0.6}s` }}
            />
          );
        })}
      </g>

      <g className="waves" fill="none" stroke="#5f86c0" strokeOpacity="0.35" strokeWidth="2">
        <path d="M-200 760 q 50 -12 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0" />
        <path d="M-200 850 q 60 -14 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0" />
        <path d="M-200 950 q 70 -16 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0" />
      </g>

      <Grain id="n-grain" />
    </svg>
  );
}

// DevScript's Earth: sand-coloured paper with slow topographic contour lines
function Earth() {
  const rings = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg className="scene scene-earth" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <rect width="1600" height="1000" fill="#efe4d2" />
      <g className="contours" fill="none" stroke="#b9946d" strokeWidth="1.4">
        {rings.map((i) => (
          <path
            key={`a${i}`}
            d={`M${1250 - i * 55} 260 C ${1250 - i * 55} ${150 - i * 40}, ${1450 + i * 50} ${120 - i * 35}, ${1480 + i * 52} 260 S ${1380 + i * 45} ${470 + i * 40}, ${1260 - i * 50} ${420 + i * 36} S ${1250 - i * 55} 330, ${1250 - i * 55} 260Z`}
            opacity={0.55 - i * 0.06}
          />
        ))}
        {rings.map((i) => (
          <path
            key={`b${i}`}
            d={`M${120 - i * 40} 820 C ${160 - i * 40} ${700 - i * 38}, ${420 + i * 45} ${690 - i * 40}, ${470 + i * 50} 820 S ${330 + i * 40} ${990 + i * 30}, ${180 - i * 40} ${960 + i * 30} S ${120 - i * 40} 880, ${120 - i * 40} 820Z`}
            opacity={0.5 - i * 0.06}
          />
        ))}
      </g>
      <g fill="#6f7f45" opacity="0.35">
        <circle cx="300" cy="230" r="3" />
        <circle cx="318" cy="244" r="2" />
        <circle cx="1100" cy="760" r="3" />
        <circle cx="1122" cy="748" r="2" />
      </g>
      <Grain id="e-grain" />
    </svg>
  );
}
