import type { Metadata } from "next";
import Image from "next/image";
import BackButton from "@/components/ui/BackButton";
import { HeartIcon, LeafIcon } from "@/components/ui/decor";
import { withBasePath } from "@/lib/asset-path";

export const metadata: Metadata = {
  title: "Meet the Founder",
  description: "The story and heart behind Arborn nightwear.",
};

const FOUNDER_IMAGE = withBasePath("/images/founder-arborn.png");

function DreamIcon({ className }: { className?: string }) {
  return <HeartIcon filled className={className} />;
}

function DesignIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 16h13l3-3h2v3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 16v3h18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8h6l3 5H6z" strokeLinejoin="round" />
      <circle cx="17" cy="8" r="1.4" />
      <path d="M9 8V6a2 2 0 012-2h2" strokeLinecap="round" />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="8" r="2.6" />
      <circle cx="16" cy="9" r="2.2" />
      <path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6" strokeLinecap="round" />
      <path d="M14.5 14.7c2 .2 3.6 1.7 4 4.3" strokeLinecap="round" />
    </svg>
  );
}

const VALUES = [
  { label: "Dream", body: "It started with a simple dream to create something special for every woman.", Icon: DreamIcon },
  { label: "Design", body: "Every piece is thoughtfully designed for comfort, style and confidence.", Icon: DesignIcon },
  { label: "Quality", body: "We choose the finest fabrics and care about every little detail.", Icon: LeafIcon },
  { label: "You", body: "You inspire us every day to do better and grow together.", Icon: PeopleIcon },
];

export default function FounderPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-accent-soft to-[#f3e6da] px-5 pt-16 pb-8 sm:px-10">
        <BackButton className="absolute top-4 left-4 z-20 h-9 w-9 rounded-full bg-white/90 text-accent shadow-sm hover:bg-white" />

        <p className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
          Comfort. Style. You.
          <HeartIcon filled className="h-3.5 w-3.5 text-accent" />
        </p>

        <p className="mt-4 flex items-center gap-1.5 font-script text-2xl text-accent">
          Meet our
          <HeartIcon filled className="h-4 w-4" />
        </p>
        <p className="font-serif text-4xl leading-tight font-bold tracking-wide text-accent-dark uppercase sm:text-5xl">
          Founder
        </p>
        <div className="mt-3 flex max-w-xs items-center gap-2 text-accent/40">
          <span className="h-px flex-1 bg-accent/30" />
          <HeartIcon filled className="h-3 w-3 shrink-0 text-accent" />
          <span className="h-px flex-1 bg-accent/30" />
        </div>

        <p className="mt-4 text-sm text-[var(--muted)] sm:text-base">
          A dream stitched with love, made for <span className="text-accent">you</span>.
        </p>

        <div className="mt-5 rounded-2xl bg-white/80 p-5">
          <span className="font-serif text-4xl leading-none text-accent/40">&ldquo;</span>
          <p className="mt-1 text-sm text-foreground">
            Hi, I&rsquo;m the heart behind Arborn. A dreamer, a believer and a woman who truly
            understands the need for comfortable and beautiful nightwear. Thank you for being a
            part of our story.
          </p>
          <div className="mt-3 flex items-center gap-2 text-accent/30">
            <span className="h-px flex-1 bg-accent/20" />
            <HeartIcon filled className="h-2.5 w-2.5 shrink-0 text-accent" />
            <span className="h-px flex-1 bg-accent/20" />
          </div>
          <p className="mt-2 font-script text-lg text-accent">With love, Founder</p>
        </div>

        <div className="relative mt-5 w-full overflow-hidden rounded-3xl">
          <Image
            src={FOUNDER_IMAGE}
            alt="Arborn founder"
            width={1086}
            height={1448}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="flex items-center justify-center gap-2 text-xs font-medium tracking-wide text-accent">
          <HeartIcon filled className="h-3 w-3" /> What we stand for <HeartIcon filled className="h-3 w-3" />
        </p>
        <p className="mt-1 text-center font-serif text-3xl font-bold text-accent-dark sm:text-4xl">
          Our Promise to You
        </p>
        <div className="mx-auto mt-3 flex max-w-[220px] items-center gap-2 text-accent/40">
          <span className="h-px flex-1 bg-accent/30" />
          <HeartIcon filled className="h-3 w-3 shrink-0 text-accent" />
          <span className="h-px flex-1 bg-accent/30" />
        </div>
        <p className="mt-3 text-center text-sm text-[var(--muted)]">
          Every step we take is for your comfort, confidence and happiness.
        </p>

        <div className="relative mt-8">
          <span
            aria-hidden
            className="absolute top-[43px] bottom-[43px] left-[43px] w-px border-l-2 border-dashed border-accent/25"
          />

          <div className="space-y-1">
            {VALUES.map(({ label, body, Icon }, index) => (
              <div key={label}>
                <div className="flex items-start gap-3">
                  <span className="relative z-10 flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-full bg-accent-soft/70 text-accent">
                    <Icon className="h-8 w-8" />
                  </span>
                  <div className="relative flex-1 rounded-2xl bg-white p-4 shadow-[0_8px_20px_rgba(91,53,61,0.06)]">
                    <span className="absolute -top-2 -left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent shadow-sm">
                      {index + 1}
                    </span>
                    <p className="font-serif text-lg font-semibold text-foreground">{label}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{body}</p>
                  </div>
                </div>

                {index < VALUES.length - 1 && (
                  <div className="flex w-[86px] justify-center py-1">
                    <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-accent/30 bg-white text-accent">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 4v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-3xl bg-accent-dark p-5 text-white">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
            <HeartIcon filled className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium">
              Arborn is more than a brand, it&rsquo;s a bond we share with you.
            </p>
            <p className="mt-1 text-sm font-semibold text-white/90">
              Thank you for being a part of our journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
