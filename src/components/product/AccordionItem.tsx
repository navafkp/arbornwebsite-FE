import type { ReactNode } from "react";

export default function AccordionItem({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group border-b border-black/8 py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
        {title}
        <svg
          className="h-4 w-4 shrink-0 text-black/50 transition-transform duration-200 group-open:rotate-45"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </summary>
      <div className="pt-3 text-sm leading-relaxed text-[var(--muted)]">{children}</div>
    </details>
  );
}
