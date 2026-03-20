"use client";

// ═══════════════════════════════════════════
// Alpine Background — Mountain landscape
// Three layered ranges: green (back), grey (mid), red (front)
// Plus valley, trees, chalet, and a goat on the peak
// ═══════════════════════════════════════════

// ─── Mountain ridge coordinates [x, y] ───
// Back range: upward trend (bullish), highest peaks on the right
const BACK_RIDGE: [number, number][] = [
  [-10, 280], [25, 258], [55, 272], [85, 245], [112, 260],
  [138, 232], [162, 248], [188, 215], [210, 230], [232, 200],
  [258, 218], [282, 185], [305, 200], [328, 170], [348, 155],
  [362, 142], [372, 130], [382, 118], [392, 108], [405, 122],
  [415, 112], [425, 125], [450, 128],
];

// Mid range: volatile sideways movement
const MID_RIDGE: [number, number][] = [
  [-10, 400], [20, 375], [55, 395], [90, 348], [120, 368],
  [155, 318], [185, 340], [215, 295], [240, 318], [268, 270],
  [292, 292], [320, 255], [345, 278], [372, 290], [400, 268],
  [430, 295], [450, 280],
];

// Front range: downward trend (bearish)
const FRONT_RIDGE: [number, number][] = [
  [-10, 440], [25, 422], [55, 438], [85, 415], [112, 432],
  [140, 450], [168, 465], [195, 480], [218, 462], [242, 482],
  [265, 498], [290, 484], [315, 502], [340, 490], [368, 508],
  [395, 522], [420, 512], [450, 528],
];

const VIEWBOX_BOTTOM = 600;

// ─── Helpers ───

/** Convert ridge points to a filled SVG path (closed polygon down to bottom) */
function ridgeToFillPath(pts: [number, number][]): string {
  const first = pts[0];
  const last = pts[pts.length - 1];
  const lines = pts.map(([x, y]) => `L${x} ${y}`).join(" ");
  return `M${first[0]} ${VIEWBOX_BOTTOM} ${lines} L${last[0]} ${VIEWBOX_BOTTOM} Z`;
}

/** Find the highest point in a ridge for snow cap placement */
function findPeak(pts: [number, number][]): [number, number] {
  return [...pts].sort((a, b) => a[1] - b[1])[0];
}

// Precompute the front ridge fill path (also used for tree clipping)
const FRONT_FILL_PATH = ridgeToFillPath(FRONT_RIDGE);

// ─── Sub-components ───

function RidgeOutline({ pts, color, width = 1.5, opacity = 0.55 }: {
  pts: [number, number][]; color: string; width?: number; opacity?: number;
}) {
  return (
    <>
      {pts.slice(0, -1).map(([x1, y1], i) => {
        const [x2, y2] = pts[i + 1];
        return (
          <line key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth={width}
            strokeOpacity={opacity} strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

function SnowCap({ pts }: { pts: [number, number][] }) {
  const [px, py] = findPeak(pts);
  return (
    <polygon
      points={`${px},${py} ${px - 14},${py + 18} ${px + 14},${py + 18}`}
      fill="#EEF2F8" opacity={0.82}
    />
  );
}

function TreeCluster({ positions, fill, opacity = 0.6, clipId }: {
  positions: [number, number][];
  fill: string;
  opacity?: number;
  clipId?: string;
}) {
  return (
    <g fill={fill} opacity={opacity} clipPath={clipId ? `url(#${clipId})` : undefined}>
      {positions.map(([x, y], i) => (
        <use key={i} href="#tree" transform={`translate(${x},${y}) scale(0.5)`} />
      ))}
    </g>
  );
}

// ─── Tree positions ───
const VALLEY_TREES: [number, number][] = [
  [10, 536], [50, 560], [100, 570], [120, 570], [110, 560],
  [208, 536], [248, 536], [370, 570], [380, 570], [390, 560],
  [390, 580], [375, 560],
];

const MOUNTAIN_TREES: [number, number][] = [
  [98, 480], [112, 440], [126, 400], [130, 506], [148, 506],
  [168, 502], [182, 504], [196, 506],
];

// ─── Main Component ───
export default function AlpineBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, #E8EEF5 0%, #EEF2F8 30%, #F5F0E8 70%, #FFFBF0 100%)",
      }} />

      {/* Mountain landscape */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 440 600"
        preserveAspectRatio="xMidYMax meet"
        fill="none"
      >
        <defs>
          <clipPath id="frontClip">
            <path d={FRONT_FILL_PATH} />
          </clipPath>
          {/* Reusable tree symbol — 16×26px, tip at origin */}
          <symbol id="tree" overflow="visible">
            <polygon points="0,0 -6,10 6,10" />
            <polygon points="-2,8 -8,20 8,20" />
            <rect x="-1.5" y="20" width="3" height="6" />
          </symbol>
        </defs>

        {/* Sun */}
        <circle cx="380" cy="38" r="38" fill="#FDF8E8" opacity="0.45" />
        <circle cx="380" cy="38" r="26" fill="#FDF4D8" opacity="0.38" />

        {/* Back range (green, bullish) */}
        <path d={ridgeToFillPath(BACK_RIDGE)} fill="#8FB88A" opacity="0.28" />
        <SnowCap pts={BACK_RIDGE} />
        <RidgeOutline pts={BACK_RIDGE} color="#4A7A42" width={1.4} />

        {/* Mid range (grey, volatile) */}
        <path d={ridgeToFillPath(MID_RIDGE)} fill="#B8C4B0" opacity="0.5" />
        <SnowCap pts={MID_RIDGE} />
        <RidgeOutline pts={MID_RIDGE} color="#7A8878" />

        {/* Front range (red, bearish) */}
        <path d={FRONT_FILL_PATH} fill="#C4A098" opacity="0.42" />
        <RidgeOutline pts={FRONT_RIDGE} color="#9A5848" width={1.6} />

        {/* Valley meadow */}
        <path
          d="M-10 600 L-10 555 L30 545 L80 552 L130 540 L180 550 L230 538 L280 548 L330 536 L380 546 L420 540 L450 548 L450 600 Z"
          fill="#A8C49A" opacity="0.3"
        />

        {/* Valley trees */}
        <TreeCluster positions={VALLEY_TREES} fill="#4A7A42" />

        {/* Mountain trees (clipped to front range) */}
        <TreeCluster positions={MOUNTAIN_TREES} fill="#7A3828" clipId="frontClip" />

        {/* Chalet */}
        <g opacity="0.5">
          <polygon points="210,522 230,502 250,522" fill="#A89878" />
          <rect x="213" y="522" width="34" height="20" fill="#C4B89A" />
          <rect x="223" y="530" width="14" height="12" fill="#8A7860" />
        </g>
      </svg>

      {/* Goat on the highest peak */}
      <div className="absolute" style={{
        left: `${(392 / 440) * 100}%`,
        top: `${(285 / 600) * 100}%`,
        fontSize: 16,
        transform: "translateX(-50%)",
        lineHeight: 1,
      }}>
        🐐
      </div>
    </div>
  );
}