import { useId } from "react";

/** App-icon style mark: systemBlue squircle with a white V. */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4DA3FF" />
          <stop offset="1" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14.3" fill={`url(#${id})`} />
      <path
        d="M19 20 L32 45 L45 20"
        fill="none"
        stroke="#fff"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
