export function CutFlower({
  className,
  color = "#C03A2B",
  petals = 12,
}: {
  className?: string;
  color?: string;
  petals?: number;
}) {
  const rays = Array.from({ length: petals }, (_, i) => {
    const angle = (i / petals) * Math.PI * 2;
    const inner = 72;
    const outer = 226;
    const mid = (inner + outer) / 2;
    return {
      x1: 256 + Math.cos(angle) * inner,
      y1: 256 + Math.sin(angle) * inner,
      x2: 256 + Math.cos(angle) * outer,
      y2: 256 + Math.sin(angle) * outer,
      mx: 256 + Math.cos(angle) * mid,
      my: 256 + Math.sin(angle) * mid,
      key: i,
    };
  });

  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <circle
        cx="256"
        cy="256"
        r="244"
        fill="none"
        stroke={color}
        strokeWidth="5"
        opacity="0.5"
      />
      <circle
        cx="256"
        cy="256"
        r="196"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.35"
      />
      {rays.map((r) => (
        <g key={r.key} stroke={color}>
          <line
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx={r.mx} cy={r.my} r="15" fill={color} stroke="none" />
          <circle cx={r.x2} cy={r.y2} r="7" fill={color} stroke="none" />
        </g>
      ))}
      <circle cx="256" cy="256" r="58" fill={color} />
      <circle cx="256" cy="256" r="30" fill="#FAF4E6" />
      <circle cx="256" cy="256" r="12" fill={color} />
    </svg>
  );
}
