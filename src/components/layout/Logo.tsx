import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex flex-col items-center leading-none ${className ?? ""}`}
      aria-label="Arborn home"
    >
      <span className="font-serif text-2xl tracking-[0.18em] text-black">ARBORN</span>
      <span className="mt-0.5 text-[9px] tracking-[0.4em] text-[var(--muted)]">
        NIGHTWEAR
      </span>
    </Link>
  );
}
