const ICON_R = 22;
const CENTER = { x: 300, y: 150 };
const RECT_W = 64;
const RECT_H = 32;
const RECT_LEFT = CENTER.x - RECT_W / 2;
const RECT_RIGHT = CENTER.x + RECT_W / 2;

const NODES = [
    { src: "/images/aws.svg", x: 110, y: 40, side: "left" },
    { src: "/images/netlify.svg", x: 75, y: 115, side: "left" },
    { src: "/images/mongodb.svg", x: 75, y: 185, side: "left" },
    { src: "/images/clerk.png", x: 110, y: 260, side: "left" },
    { src: "/images/twilio.png", x: 490, y: 40, side: "right" },
    { src: "/images/placid.png", x: 525, y: 115, side: "right" },
    { src: "/images/replit.svg", x: 525, y: 185, side: "right" },
    { src: "/images/sentry.png", x: 490, y: 260, side: "right" }
];

function IntegrationFlow() {
    return (
        <svg viewBox="0 0 600 300" className="mx-auto w-full max-w-2xl" fill="none">
            <defs>
                {NODES.map(({ side }, i) => {
                    const delay = `${i * 0.5}s`;
                    return (
                        <linearGradient key={i} id={`shimmer-${i}`} gradientUnits="userSpaceOnUse" x1={side === "left" ? "0%" : "100%"} x2={side === "left" ? "100%" : "0%"}>
                            <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0.45" />
                            <stop offset="40%" stopColor="var(--color-border)" stopOpacity="0.45">
                                <animate attributeName="offset" values="-0.3;1" dur="6s" begin={delay} repeatCount="indefinite" />
                            </stop>
                            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.6">
                                <animate attributeName="offset" values="-0.15;1.15" dur="6s" begin={delay} repeatCount="indefinite" />
                            </stop>
                            <stop offset="60%" stopColor="var(--color-border)" stopOpacity="0.45">
                                <animate attributeName="offset" values="0;1.3" dur="6s" begin={delay} repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" stopColor="var(--color-border)" stopOpacity="0.45" />
                        </linearGradient>
                    );
                })}
            </defs>

            {NODES.map(({ src, x, y, side }, i) => {
                const d = side === "left" ? `M ${x + ICON_R} ${y} C ${x + ICON_R + 80} ${y}, ${RECT_LEFT - 80} ${CENTER.y}, ${RECT_LEFT} ${CENTER.y}` : `M ${x - ICON_R} ${y} C ${x - ICON_R - 80} ${y}, ${RECT_RIGHT + 80} ${CENTER.y}, ${RECT_RIGHT} ${CENTER.y}`;

                return (
                    <g key={i}>
                        <path d={d} stroke={`url(#shimmer-${i})`} strokeWidth={1.5} />
                        <circle cx={x} cy={y} r={ICON_R} fill="var(--color-background)" stroke="var(--color-border)" strokeWidth={1} />
                        <image href={src} x={x - 10} y={y - 10} width={20} height={20} />
                    </g>
                );
            })}

            <rect x={RECT_LEFT} y={CENTER.y - RECT_H / 2} width={RECT_W} height={RECT_H} rx={6} fill="var(--color-foreground)" />
            <text x={CENTER.x - 1.5} y={CENTER.y + 5.5} textAnchor="middle" fontSize={16} fontStyle="italic" fontWeight={800} letterSpacing="-0.025em" fill="var(--color-background)">
                SJILY
            </text>
        </svg>
    );
}

export default IntegrationFlow;
