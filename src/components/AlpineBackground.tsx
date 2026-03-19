"use client";

// Back mountain: upward trend — highest, more jagged on the right
const BACK: [number, number][] = [
  [-10, 280],
  [25, 258], [55, 272], [85, 245], [112, 260],
  [138, 232], [162, 248], [188, 215], [210, 230],
  [232, 200], [258, 218], [282, 185], [305, 200],
  [328, 170], [348, 155], [362, 142], [372, 130],
  [382, 118], [392, 108], [405, 122], [415, 112],
  [425, 125], [450, 128],
];

// Mid mountain: random ups and downs
const MID: [number, number][] = [
  [-10, 400],
  [20, 375], [55, 395], [90, 348], [120, 368],
  [155, 318], [185, 340], [215, 295], [240, 318],
  [268, 270], [292, 292], [320, 255], [345, 278],
  [372, 290], [400, 268], [430, 295], [450, 280],
];

// Front mountain: downward trend
const FRONT: [number, number][] = [
  [-10, 440],
  [25, 422], [55, 438], [85, 415], [112, 432],
  [140, 450], [168, 465], [195, 480], [218, 462],
  [242, 482], [265, 498], [290, 484], [315, 502],
  [340, 490], [368, 508], [395, 522], [420, 512],
  [450, 528],
];

const BOTTOM = 600;
const FRONT_FILL = "M-10 600 L-10 440 L25 422 L55 438 L85 415 L112 432 L140 450 L168 465 L195 480 L218 462 L242 482 L265 498 L290 484 L315 502 L340 490 L368 508 L395 522 L420 512 L450 528 L450 600 Z";

function toFillD(pts: [number, number][]): string {
  const start = `M${pts[0][0]} ${BOTTOM} L${pts[0][0]} ${pts[0][1]}`;
  const mid = pts.slice(1).map(([x, y]) => `L${x} ${y}`).join(" ");
  const last = pts[pts.length - 1];
  return `${start} ${mid} L${last[0]} ${BOTTOM} Z`;
}

function OutlineSegments({ pts, color, strokeWidth = 1.5, opacity = 0.6 }: {
  pts: [number, number][]; color: string; strokeWidth?: number; opacity?: number;
}) {
  return (
    <>
      {pts.slice(0, -1).map(([x1, y1], i) => {
        const [x2, y2] = pts[i + 1];
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} strokeLinecap="round" />;
      })}
    </>
  );
}

function SnowCap({ pts }: { pts: [number, number][] }) {
  const peak = [...pts].sort((a, b) => a[1] - b[1])[0];
  const [px, py] = peak;
  return (
    <polygon
      points={`${px},${py} ${px - 14},${py + 18} ${px + 14},${py + 18}`}
      fill="#EEF2F8"
      opacity={0.82}
    />
  );
}

export default function AlpineBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, #E8EEF5 0%, #EEF2F8 30%, #F5F0E8 70%, #FFFBF0 100%)",
      }} />

      <svg className="absolute bottom-0 w-full" viewBox="0 0 440 600"
        preserveAspectRatio="xMidYMax meet" fill="none" xmlns="http://www.w3.org/2000/svg">

        <defs>
          <clipPath id="frontClip">
            <path d={FRONT_FILL} />
          </clipPath>
          {/*
            Tree symbol — tip at (0,0), grows downward.
            Natural size: 16px wide, 26px tall.
            Use with <use href="#tree" transform="translate(X,Y) scale(0.5)" />
            where X,Y = treetop position. Scale 0.5 = ~8px wide, ~13px tall (original size).
          */}
          <symbol id="tree" overflow="visible">
            {/* upper triangle (narrower) */}
            <polygon points="0,0 -6,10 6,10" />
            {/* lower triangle (wider base) */}
            <polygon points="-2,8 -8,20 8,20" />
            {/* trunk */}
            <rect x="-1.5" y="20" width="3" height="6" />
          </symbol>
        </defs>

        {/* Sun glow */}
        <circle cx="380" cy="38" r="38" fill="#FDF8E8" opacity="0.45" />
        <circle cx="380" cy="38" r="26" fill="#FDF4D8" opacity="0.38" />

        {/* ── Back mountain — green ── */}
        <path d={toFillD(BACK)} fill="#8FB88A" opacity="0.28" />
        <SnowCap pts={BACK} />
        <OutlineSegments pts={BACK} color="#4A7A42" strokeWidth={1.4} opacity={0.55} />

        {/* ── Mid mountain — grey ── */}
        <path d={toFillD(MID)} fill="#B8C4B0" opacity="0.5" />
        <SnowCap pts={MID} />
        <OutlineSegments pts={MID} color="#7A8878" strokeWidth={1.5} opacity={0.55} />

        {/* ── Front mountain — red ── */}
        <path d={FRONT_FILL} fill="#C4A098" opacity="0.42" />
        <OutlineSegments pts={FRONT} color="#9A5848" strokeWidth={1.6} opacity={0.55} />

        {/* ── Valley meadow ── */}
        <path d="M-10 600 L-10 555 L30 545 L80 552 L130 540 L180 550 L230 538 L280 548 L330 536 L380 546 L420 540 L450 548 L450 600 Z"
          fill="#A8C49A" opacity="0.3" />

        {/* ── 7 green trees below the chalet — move by changing translate(x,y) ── */}
        <g fill="#4A7A42" opacity="0.6">
          <use href="#tree" transform="translate(10,536) scale(0.5)" />
          <use href="#tree" transform="translate(50,560) scale(0.5)" />
          <use href="#tree" transform="translate(100,570) scale(0.5)" />
          <use href="#tree" transform="translate(120,570) scale(0.5)" />
          <use href="#tree" transform="translate(110,560) scale(0.5)" />
          <use href="#tree" transform="translate(208,536) scale(0.5)" />
          <use href="#tree" transform="translate(248,536) scale(0.5)" />
          <use href="#tree" transform="translate(370,570) scale(0.5)" />
          <use href="#tree" transform="translate(380,570) scale(0.5)" />
          <use href="#tree" transform="translate(390,560) scale(0.5)" />
          <use href="#tree" transform="translate(390,580) scale(0.5)" />
          <use href="#tree" transform="translate(375,560) scale(0.5)" />
        </g>

        {/* ── 3 red trees left of chalet on red mountain — move by changing translate(x,y) ── */}
        <g fill="#7A3828" opacity="0.6" clipPath="url(#frontClip)">
          <use href="#tree" transform="translate(98,480) scale(0.5)" />
          <use href="#tree" transform="translate(112,440) scale(0.5)" />
          <use href="#tree" transform="translate(126,400) scale(0.5)" />
          <use href="#tree" transform="translate(130,506) scale(0.5)" />
          <use href="#tree" transform="translate(148,506) scale(0.5)" />
          <use href="#tree" transform="translate(168,502) scale(0.5)" />
          <use href="#tree" transform="translate(182,504) scale(0.5)" />
          <use href="#tree" transform="translate(196,506) scale(0.5)" />
          <use href="#tree" transform="translate(130,506) scale(0.5)" />
        </g>

        {/* ── Simple triangle chalet ── */}
        <g opacity="0.5">
          <polygon points="210,522 230,502 250,522" fill="#A89878" />
          <rect x="213" y="522" width="34" height="20" fill="#C4B89A" />
          <rect x="223" y="530" width="14" height="12" fill="#8A7860" />
        </g>
      </svg>

      {/* ── Goat emoji on highest peak — HTML overlay for emoji rendering ── */}
      <div
        className="absolute"
        style={{
          // peak is at SVG coords (392, 108) in a 440x600 viewBox
          // map to percentage positions
          left: `${(392 / 440) * 100}%`,
          top: `${(285 / 600) * 100}%`,
          fontSize: 16,
          transform: "translateX(-50%)",
          lineHeight: 1,
        }}
      >
        🐐
      </div>
    </div>
  );
}
