export function BowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path
        d="M12 12c-1.5-2.5-4.5-4.5-7-3.5-2 .8-2 4.2 0 5 2.5 1 5.5-1 7-3.5z"
        strokeLinejoin="round"
      />
      <path
        d="M12 12c1.5-2.5 4.5-4.5 7-3.5 2 .8 2 4.2 0 5-2.5 1-5.5-1-7-3.5z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
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
