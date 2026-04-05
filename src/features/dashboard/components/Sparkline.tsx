interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showEndDot?: boolean;
  endLabel?: string;
}

export function Sparkline({
  data,
  width = 280,
  height = 80,
  color = "var(--color-accent)",
  showEndDot = true,
  endLabel,
}: SparklineProps) {
  if (data.length < 2) return null;

  const padX = 8;
  const padTop = 16;
  const padBottom = 4;
  const plotW = width - padX * 2;
  const plotH = height - padTop - padBottom;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * plotW;
    const y = padTop + plotH - ((v - min) / range) * plotH;
    return { x, y };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const last = points[points.length - 1];

  // Build area fill path (line → bottom-right → bottom-left)
  const areaPath = [
    `M ${points[0].x},${points[0].y}`,
    ...points.slice(1).map((p) => `L ${p.x},${p.y}`),
    `L ${last.x},${height}`,
    `L ${points[0].x},${height}`,
    "Z",
  ].join(" ");

  const gradientId = `spark-grad-${color.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width='100%'
      height={height}
      preserveAspectRatio='none'
      className='block'
      aria-hidden='true'>
      <defs>
        <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor={color} stopOpacity={0.18} />
          <stop offset='100%' stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Line */}
      <polyline
        points={polyline}
        fill='none'
        stroke={color}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />

      {/* End dot */}
      {showEndDot && (
        <>
          {/* Outer glow */}
          <circle cx={last.x} cy={last.y} r={5} fill={color} opacity={0.2} />
          {/* Inner dot */}
          <circle cx={last.x} cy={last.y} r={2.5} fill={color} />
        </>
      )}

      {/* End label */}
      {endLabel && (
        <text
          x={last.x - 4}
          y={last.y - 10}
          fill={color}
          fontSize={9}
          fontWeight={700}
          textAnchor='end'
          fontFamily='var(--font-sans)'>
          {endLabel}
        </text>
      )}
    </svg>
  );
}
