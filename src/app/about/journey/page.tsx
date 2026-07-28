import type { Metadata } from "next";
import Image from "next/image";
import BackButton from "@/components/ui/BackButton";
import { HeartIcon } from "@/components/ui/decor";
import { withBasePath } from "@/lib/asset-path";

export const metadata: Metadata = {
  title: "Journey to Arborn",
  description: "A story of passion, purpose and a dream that turned into Arborn.",
};

const ABOUT_US_IMAGE = withBasePath("/images/about-us.png");
const LOGO_IMAGE = withBasePath("/arborn.webp");

function GradCapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 9l10-4 10 4-10 4-10-4z" strokeLinejoin="round" />
      <path d="M6 11v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5" strokeLinecap="round" />
      <path d="M21 9v6" strokeLinecap="round" />
    </svg>
  );
}

function ComputerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M9 20h6M12 16v4" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" strokeLinecap="round" />
      <path
        d="M10.5 13.2s-3.2-1.9-3.2-4c0-1.2.9-2 1.9-2 .8 0 1.3.5 1.3.5s.5-.5 1.3-.5c1 0 1.9.8 1.9 2 0 2.1-3.2 4-3.2 4z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function CloudHeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 18a4 4 0 01-.5-7.97A5 5 0 0116.3 9 4.5 4.5 0 0117 18H7z" strokeLinejoin="round" />
      <path
        d="M12 15.5s-2.2-1.3-2.2-2.7c0-.8.6-1.3 1.3-1.3.5 0 .9.3.9.3s.4-.3.9-.3c.7 0 1.3.5 1.3 1.3 0 1.4-2.2 2.7-2.2 2.7z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function CodeLaptopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="14" height="10" rx="1.2" />
      <path d="M2 18h16" strokeLinecap="round" />
      <path d="M9 8l-1.5 2L9 12M13 8l1.5 2L13 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MediaPlaceholder({ Icon, className }: { Icon: React.ComponentType<{ className?: string }>; className?: string }) {
  return (
    <div className={`flex items-center justify-center overflow-hidden bg-gradient-to-br from-accent-soft to-[#f3e6da] text-accent/50 ${className}`}>
      <Icon className="h-6 w-6" />
    </div>
  );
}

type Visual =
  | { type: "icon"; Icon: React.ComponentType<{ className?: string }> }
  | { type: "image"; src: string }
  | { type: "placeholder"; Icon: React.ComponentType<{ className?: string }> };

type Step = {
  number: string;
  title: string;
  lead?: string;
  body?: string;
  visual?: Visual;
  visualSide: "left" | "right";
  cardSide: "left" | "right";
  heartAccent?: boolean;
  underlineAccent?: boolean;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Completed BCA",
    lead: "Built a strong foundation.",
    visual: { type: "icon", Icon: GradCapIcon },
    visualSide: "left",
    cardSide: "left",
  },
  {
    number: "02",
    title: "5 Years as a Developer",
    body: "Technology taught me to turn ideas into reality.",
    visual: { type: "placeholder", Icon: ComputerIcon },
    visualSide: "right",
    cardSide: "right",
  },
  {
    number: "03",
    title: "Loved Choosing Dresses",
    body: "It started with joy, seeing my loved ones smile.",
    visual: { type: "image", src: ABOUT_US_IMAGE },
    visualSide: "left",
    cardSide: "left",
    heartAccent: true,
  },
  {
    number: "04",
    title: "Comfort Matters",
    body: "Every woman deserves to feel beautiful and comfortable.",
    visual: { type: "placeholder", Icon: CloudHeartIcon },
    visualSide: "right",
    cardSide: "right",
  },
  {
    number: "05",
    title: "Found the Missing Gap",
    body: "Why isn’t nightwear both stylish and comfortable? That question changed everything.",
    visual: { type: "icon", Icon: SearchIcon },
    visualSide: "left",
    cardSide: "left",
    underlineAccent: true,
  },
  {
    number: "06",
    title: "Learning. Planning. Building.",
    body: "Researched the market, learned everything and brought my full-stack skills into my passion.",
    visual: { type: "placeholder", Icon: CodeLaptopIcon },
    visualSide: "right",
    cardSide: "right",
  },
];

function StepVisual({ visual }: { visual?: Visual }) {
  if (!visual) return null;
  if (visual.type === "icon") {
    return (
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft/70 text-accent">
        <visual.Icon className="h-6 w-6" />
      </span>
    );
  }
  if (visual.type === "image") {
    return (
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl">
        <Image src={visual.src} alt="" fill className="object-cover" />
      </div>
    );
  }
  return <MediaPlaceholder Icon={visual.Icon} className="h-20 w-24 shrink-0 rounded-2xl" />;
}

function StepCard({ step }: { step: Step }) {
  const isPill = step.visual?.type === "icon";
  return (
    <div
      className={`flex min-w-0 items-center gap-3 bg-white p-3 shadow-[0_8px_20px_rgba(91,53,61,0.06)] ${isPill ? "rounded-full pr-5" : "rounded-[26px]"
        }`}
    >
      {step.visualSide === "left" && <StepVisual visual={step.visual} />}
      <div className="min-w-0 flex-1">
        <p className="font-serif text-sm font-semibold text-accent">{step.title}</p>
        {step.lead && <p className="mt-0.5 text-xs font-semibold text-foreground">{step.lead}</p>}
        {step.body && <p className="mt-0.5 text-xs leading-snug text-[var(--muted)]">{step.body}</p>}
        {step.heartAccent && <HeartIcon filled className="mt-1.5 h-3.5 w-3.5 text-accent" />}
        {step.underlineAccent && (
          <svg viewBox="0 0 90 8" className="mt-0.5 h-2 w-20 text-accent/50">
            <path d="M2 5c8-5 16-5 22 0s16 5 22 0 16-5 22 0 16 5 20 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {step.visualSide === "right" && <StepVisual visual={step.visual} />}
    </div>
  );
}

function StepRow({ step }: { step: Step }) {
  const alignRight = step.cardSide === "right";
  return (
    <div className="relative py-4">
      <div className={`w-[83%] ${alignRight ? "ml-auto" : "mr-auto"}`}>
        <StepCard step={step} />
      </div>
      <span
        className={`absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white shadow-sm ${alignRight ? "left-[22%] -translate-x-1/2" : "left-[78%] -translate-x-1/2"
          }`}
      >
        {step.number}
      </span>
    </div>
  );
}

export default function JourneyPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-accent-soft to-[#f3e6da] px-5 pt-16 pb-8 sm:px-10">
        <BackButton className="absolute top-4 left-4 z-20 h-9 w-9 rounded-full bg-white/90 text-accent shadow-sm hover:bg-white" />

        <div>
          <p className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
            Comfort. Style. You.
            <HeartIcon filled className="h-3.5 w-3.5 text-accent" />
          </p>
          <p className="mt-3 text-sm font-semibold tracking-[0.2em] text-accent uppercase">Her Journey To</p>
          <p className="font-serif text-4xl leading-tight font-bold tracking-wide text-accent-dark uppercase sm:text-5xl">
            Arborn
          </p>
          <div className="mt-3 flex max-w-xs items-center gap-2 text-accent/40">
            <span className="h-px flex-1 bg-accent/30" />
            <HeartIcon filled className="h-3 w-3 shrink-0 text-accent" />
            <span className="h-px flex-1 bg-accent/30" />
          </div>
          <p className="mt-4 text-sm text-[var(--muted)] sm:text-base">
            A dream stitched with <span className="text-accent">love</span>, for{" "}
            <span className="text-accent">every woman</span>.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 100 700"
            preserveAspectRatio="none"
            className="absolute inset-0 z-0 h-full w-full text-accent"
          >
            <path
              d="M78,50 C78,70 22,85 22,100 C22,140 78,160 78,200 C78,240 22,260 22,300 C22,340 78,360 78,400 C78,440 22,460 22,500 L22,600 C22,640 78,660 78,700"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="1 7"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="22" cy="100" r="1.6" fill="currentColor" />
            <circle cx="78" cy="200" r="1.6" fill="currentColor" />
            <circle cx="22" cy="300" r="1.6" fill="currentColor" />
            <circle cx="78" cy="400" r="1.6" fill="currentColor" />
            <circle cx="22" cy="500" r="1.6" fill="currentColor" />
            <circle cx="22" cy="600" r="1.6" fill="currentColor" />
          </svg>

          <div className="relative z-10">
            {STEPS.map((step) => (
              <StepRow key={step.number} step={step} />
            ))}
          </div>

          <div className="relative z-10 mt-4 rounded-[26px] bg-white p-4 shadow-[0_8px_20px_rgba(91,53,61,0.06)]">
            <span className="absolute top-1/2 left-[22%] z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white shadow-sm">
              07
            </span>
            <p className="font-serif text-sm font-semibold text-accent">Arborn Was Born</p>
            <p className="mt-0.5 text-xs font-semibold text-foreground">A name with meaning.</p>
            <div className="mt-3 flex items-stretch gap-3">
              <div className="flex w-24 shrink-0 flex-col divide-y divide-accent/15 overflow-hidden rounded-2xl border border-accent/15 text-center">
                <div className="p-2">
                  <p className="font-serif text-lg font-bold text-accent">AR</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-[var(--muted)]">
                    Her grandfather&rsquo;s business name.
                  </p>
                </div>
                <div className="p-2">
                  <p className="font-serif text-lg font-bold text-accent">BORN</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-[var(--muted)]">
                    Proud to be born into his family.
                  </p>
                </div>
              </div>
              <div className="flex-1 text-xs leading-snug text-[var(--muted)]">
                <p>
                  A name built on love, family and purpose &mdash; together,{" "}
                  <strong className="text-accent">ARBORN</strong>.
                </p>
                <div className="mt-2 flex items-center gap-2 text-accent/30">
                  <span className="h-px flex-1 bg-accent/20" />
                  <HeartIcon filled className="h-2.5 w-2.5 shrink-0 text-accent" />
                  <span className="h-px flex-1 bg-accent/20" />
                </div>
                <p className="mt-2 text-accent">It even sounded like a global brand&hellip; why can&rsquo;t we become one? 😊</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-4 rounded-[26px] bg-white p-4 shadow-[0_8px_20px_rgba(91,53,61,0.06)]">
            <span className="absolute top-1/2 left-[78%] z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white shadow-sm">
              08
            </span>
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-serif text-sm font-semibold text-accent">Designed with Her Heart</p>
                <p className="mt-0.5 text-xs font-semibold text-foreground">One sketch. All hearts.</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Drawing has always been her favorite hobby. She sketched the Arborn logo herself.
                </p>
                <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
                  {["Family loved it.", "Team loved it.", "The very first sketch became our logo."].map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <HeartIcon filled className="h-2.5 w-2.5 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl bg-accent-soft/60 p-2 text-center">
                <Image src={LOGO_IMAGE} alt="Arborn" width={64} height={64} className="h-9 w-9 object-contain" />
                <p className="text-[9px] leading-tight text-[var(--muted)]">Comfort. Style. You.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-accent-dark p-5 text-white">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
              <HeartIcon filled className="h-5 w-5" />
            </span>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium">
                Today &amp; Always <HeartIcon filled className="h-3.5 w-3.5" />
              </p>
              <p className="mt-1 text-sm text-white/80">
                Every Arborn dress begins with a dream, stitched with love, made for you.
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Thank you for being part of our journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
