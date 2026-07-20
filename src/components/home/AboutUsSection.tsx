import Link from "next/link";
import { HeartIcon } from "@/components/ui/decor";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const INSTAGRAM_URL = "#";

const FAQS = [
  "How do I choose the right size?",
  "What is the delivery time?",
  "Do you offer Cash on Delivery?",
  "How do I return or exchange?",
];

// Placeholder art for sections without real photography yet — swap these
// for actual images whenever they're available.
function PlaceholderArt({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-accent-soft to-[#f3e6da] ${className}`}>
      <HeartIcon filled className="h-8 w-8 text-accent/40" />
    </div>
  );
}

export default function AboutUsSection() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6 md:px-8 lg:px-12">
      <div className="grid gap-4">
        <div className="rounded-3xl bg-accent-soft/60 p-4 sm:p-5">
          <div>
            <h3 className="flex items-center gap-1.5 font-serif text-xl">
              Our Story
              <HeartIcon filled className="h-4 w-4 text-accent" />
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Arborn was born from a simple belief — every woman deserves to feel beautiful and
              comfortable, even in her quietest moments.
            </p>
            <Link href="#" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
              Read our story
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-[0_8px_20px_rgba(91,53,61,0.06)] sm:p-5">
          <PlaceholderArt className="hidden h-20 w-20 shrink-0 rounded-2xl sm:flex" />
          <div className="flex-1">
            <h3 className="flex items-center gap-1.5 font-serif text-xl">
              Our Mission
              <HeartIcon filled className="h-4 w-4 text-accent" />
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              To bring premium, stylish and comfortable nightwear to every woman across India at
              honest prices.
            </p>
          </div>
          <PlaceholderArt className="hidden h-20 w-28 shrink-0 rounded-2xl md:flex" />
        </div>

        <div className="grid grid-cols-1 items-center gap-4 rounded-3xl bg-[#fdf8f2] p-4 sm:grid-cols-[1fr_auto] sm:p-5">
          <div>
            <h3 className="flex items-center gap-1.5 font-serif text-xl">
              Our Vision
              <HeartIcon filled className="h-4 w-4 text-accent" />
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              To become India&rsquo;s most loved nightwear brand, trusted for quality, comfort and
              customer happiness.
            </p>
          </div>
          <PlaceholderArt className="h-24 w-full rounded-2xl sm:w-40" />
        </div>

        {/* Temporarily disabled — re-enable by removing `false &&` below. */}
        {false && (
          <div className="rounded-3xl bg-accent-soft/60 p-4 sm:p-5">
            <h3 className="flex items-center gap-1.5 font-serif text-xl">
              We&rsquo;re Here For You
              <HeartIcon filled className="h-4 w-4 text-accent" />
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Have a question or need help? Our team is always happy to assist you.
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
              <a
                href={buildWhatsAppLink("Hi Arborn! I have a question.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#25D366]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3a9 9 0 00-7.6 13.8L3 21l4.4-1.4A9 9 0 1012 3z" strokeLinejoin="round" />
                  <path d="M8.5 9c0 4 2.5 6.5 6.5 6.5.6 0 1-.4.9-1l-.2-1a.9.9 0 00-.7-.7l-1.5-.3a.9.9 0 00-.9.3l-.3.4c-1-.5-1.8-1.3-2.3-2.3l.4-.3a.9.9 0 00.3-.9L10.4 8.5a.9.9 0 00-.7-.7l-1-.2c-.6-.1-1.2.4-1.2 1z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                WhatsApp
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-accent"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
              <a href="mailto:hello@arborn.com" className="flex items-center gap-1.5 text-black/70">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Email Us
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Temporarily disabled — re-enable by removing `false &&` below. */}
      {false && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Frequently Asked Questions</h2>
            <Link href="/contact" className="flex items-center gap-1 text-xs font-medium text-accent">
              View all
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {FAQS.map((q) => (
              <span key={q} className="rounded-full border border-black/10 px-3.5 py-2 text-xs text-[var(--muted)]">
                {q}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
