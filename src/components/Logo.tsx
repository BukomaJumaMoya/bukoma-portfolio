export function LogoMark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * (72 / 70)} viewBox="0 0 70 72" className={className} aria-hidden="true">
      <g className="fill-pine">
        <rect x="0" y="0" width="6" height="72" />
        <rect x="8" y="0" width="46" height="16" rx="4" />
        <rect x="16" y="28" width="46" height="16" rx="4" />
        <rect x="24" y="56" width="46" height="16" rx="4" />
      </g>
    </svg>
  )
}
