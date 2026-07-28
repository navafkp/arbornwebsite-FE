import Link from "next/link";
import { ABOUT_SECTIONS } from "@/components/about/aboutSections";

export default function AboutUsIconGrid() {
  return (
    <section className="mt-6 sm:mt-8">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        <span className="h-px flex-1 bg-accent/40" />
        <h2 className="shrink-0 px-2 font-serif text-xl font-bold tracking-[0.15em] text-accent uppercase sm:text-2xl">
          About Us
        </h2>
        <span className="h-px flex-1 bg-accent/40" />
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      </div>

      <div className="mt-6 grid grid-cols-4 gap-x-2 gap-y-6">
        {ABOUT_SECTIONS.map(({ id, label, Icon }) => (
          <Link key={id} href={`/about#${id}`} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-[67px] w-[67px] items-center justify-center rounded-full bg-accent-soft/60 text-accent sm:h-[73.9px] sm:w-[73.9px]">
              <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
            </span>
            <span className="text-xs leading-tight font-medium text-foreground sm:text-sm">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
