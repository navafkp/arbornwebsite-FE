export function BowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M12 12C8 8 4 8 3 12C4 16 8 16 12 12Z" strokeLinejoin="round" />
      <path d="M12 12C16 8 20 8 21 12C20 16 16 16 12 12Z" strokeLinejoin="round" />
      <circle cx="3" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="21" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
    </svg>
  );
}

export function HeartIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4 8 3.6 10 5 12 7c2-2 4-3.4 6.5-3 3.5.5 4.5 4 3 7-2.5 4.5-9.5 9-9.5 9z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloudShape({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 32" fill="currentColor">
      <ellipse cx="16" cy="20" rx="14" ry="10" />
      <ellipse cx="32" cy="14" rx="16" ry="12" />
      <ellipse cx="48" cy="20" rx="14" ry="10" />
      <rect x="8" y="18" width="48" height="12" rx="6" />
    </svg>
  );
}

export function FlowerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="6.5" r="3" />
      <circle cx="12" cy="17.5" r="3" />
      <circle cx="6.5" cy="12" r="3" />
      <circle cx="17.5" cy="12" r="3" />
    </svg>
  );
}

export function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M20 4C10 4 4 10 4 18v2h2c8 0 14-6 14-14V4z" strokeLinejoin="round" />
      <path d="M6 20C10 14 14 10 19 5" strokeLinecap="round" />
    </svg>
  );
}

function BranchBlossom({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const petalOffset = r * 0.85;
  return (
    <g>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx={cx}
          cy={cy - petalOffset}
          rx={r * 0.5}
          ry={r * 0.75}
          fill="#f2a9bd"
          opacity={0.75}
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.32} fill="#bd6e80" />
    </g>
  );
}

export function ShoppingBagIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none">
      <path
        d="M60,70 L140,70 L131,172 Q131,177 126,177 L74,177 Q69,177 69,172 Z"
        fill="#fbe4e6"
        stroke="#e8c9c0"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M100,71 L100,177" stroke="#e8c9c0" strokeWidth="1.2" opacity="0.5" />
      <path d="M74,155 L126,155" stroke="#e8c9c0" strokeWidth="1.2" opacity="0.4" />
      <path
        d="M83,70 C83,35 92,25 100,25 C108,25 117,35 117,70"
        stroke="#bd6e80"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M100,120s-8,6-8,12a8,8 0 0016,0c0-6-8-12-8-12z"
        fill="#bd6e80"
      />

      <path d="M35,188 Q45,150 55,112 Q58,96 50,80" stroke="#c4c9a8" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <ellipse cx="43" cy="140" rx="7" ry="3.5" fill="#c4c9a8" opacity="0.8" transform="rotate(-40 43 140)" />
      <ellipse cx="51" cy="120" rx="6" ry="3" fill="#c4c9a8" opacity="0.8" transform="rotate(-20 51 120)" />
      <BranchBlossom cx={48} cy={92} r={11} />
      <BranchBlossom cx={37} cy={72} r={7.5} />

      <path d="M165,188 Q155,150 145,112 Q142,96 150,80" stroke="#c4c9a8" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <ellipse cx="157" cy="140" rx="7" ry="3.5" fill="#c4c9a8" opacity="0.8" transform="rotate(40 157 140)" />
      <ellipse cx="149" cy="120" rx="6" ry="3" fill="#c4c9a8" opacity="0.8" transform="rotate(20 149 120)" />
      <BranchBlossom cx={152} cy={92} r={11} />
      <BranchBlossom cx={163} cy={72} r={7.5} />

      <path
        d="M172 55s-6.5-4-9-9c-2-4 0.5-8.5 4.5-8.5s5 4 5 4 1-4 5-4 6.5 4.5 4.5 8.5c-2.5 5-10 9-10 9z"
        fill="none"
        stroke="#bd6e80"
        strokeWidth="1.4"
      />
      <path
        d="M28 155s-5-3-7-7c-1.5-3 0.5-6.5 3.5-6.5s3.5 3 3.5 3 1-3 3.5-3 5 3.5 3.5 6.5c-2 4-7.5 7-7.5 7z"
        fill="#bd6e80"
      />
      <path d="M22 45l1.6 6.4L30 53l-6.4 1.6L22 61l-1.6-6.4L14 53l6.4-1.6z" fill="#bd6e80" opacity="0.7" />
    </svg>
  );
}

export function BunnyIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <ellipse cx="34" cy="24" rx="9" ry="22" fill="#fdf3ee" stroke="#e8c9c0" strokeWidth="1.5" />
      <ellipse cx="34" cy="26" rx="4" ry="15" fill="#f7d9d9" />
      <ellipse cx="64" cy="24" rx="9" ry="22" fill="#fdf3ee" stroke="#e8c9c0" strokeWidth="1.5" />
      <ellipse cx="64" cy="26" rx="4" ry="15" fill="#f7d9d9" />

      <circle cx="49" cy="58" r="30" fill="#fdf3ee" stroke="#e8c9c0" strokeWidth="1.5" />

      <circle cx="39" cy="55" r="2.4" fill="#4a3a35" />
      <circle cx="59" cy="55" r="2.4" fill="#4a3a35" />
      <ellipse cx="49" cy="63" rx="3" ry="2.2" fill="#e8a4a4" />
      <path
        d="M49 65c-2.5 2-6 2.4-8 1.2M49 65c2.5 2 6 2.4 8 1.2"
        stroke="#4a3a35"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      <circle cx="30" cy="63" r="4.5" fill="#f9c9c9" opacity="0.7" />
      <circle cx="68" cy="63" r="4.5" fill="#f9c9c9" opacity="0.7" />

      <path
        d="M40 78c1.5 3 5 5 9 5s7.5-2 9-5"
        stroke="#e8c9c0"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="49" cy="83" r="6" fill="#f2a9bd" />
      <path
        d="M45 81c-1.6-2.6-4.6-3.6-6.5-2.4-1.5 1-1.2 3.6.4 4.6 1.8 1.1 4.6-.3 6.1-2.2z"
        fill="#f2a9bd"
      />
      <path
        d="M53 81c1.6-2.6 4.6-3.6 6.5-2.4 1.5 1 1.2 3.6-.4 4.6-1.8 1.1-4.6-.3-6.1-2.2z"
        fill="#f2a9bd"
      />
    </svg>
  );
}
