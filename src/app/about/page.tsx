import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AccordionItem from "@/components/product/AccordionItem";
import BackButton from "@/components/ui/BackButton";
import { HeartIcon } from "@/components/ui/decor";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { withBasePath } from "@/lib/asset-path";

const LOGO_IMAGE = withBasePath("/arborn.webp");
const ABOUT_US_IMAGE = withBasePath("/images/about-us.png");

export const metadata: Metadata = {
  title: "About Arborn",
  description: "Comfort, style and the story behind Arborn nightwear.",
};

const INSTAGRAM_URL = "https://www.instagram.com/arborn__/?hl=en";

const FAQS = [
  { q: "What sizes are available?", a: "We offer sizes S to XXL across most styles. Check the size chart on each product page for exact measurements." },
  { q: "How long does delivery take?", a: "Orders are usually delivered within 4-7 business days, depending on your location." },
  { q: "How can I place an order?", a: "Browse our collection, pick your size and colour, then checkout — or message us on WhatsApp and we'll place it for you." },
  { q: "Can I return or exchange?", a: "Yes, unused items in their original packaging can be returned or exchanged within 7 days of delivery." },
  { q: "Is cash on delivery available?", a: "Yes, Cash on Delivery is available on all orders." },
  { q: "How do I contact support?", a: "Reach us anytime on WhatsApp, Instagram, or by email at hello@arborn.com." },
];

function SectionHeading({ children, showHeart = true }: { children: React.ReactNode; showHeart?: boolean }) {
  return (
    <h2 className="flex items-center gap-2 font-serif text-lg font-semibold tracking-wide text-foreground uppercase sm:text-xl">
      {showHeart && <HeartIcon filled className="h-3.5 w-3.5 shrink-0 text-accent" />}
      {children}
    </h2>
  );
}

// Placeholder art for sections without real photography yet — swap these
// for actual images whenever they're available.
function PlaceholderArt({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-accent-soft to-[#f3e6da] ${className}`}>
      <HeartIcon filled className="h-8 w-8 text-accent/40" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent-soft to-[#f3e6da]">
        <BackButton className="absolute top-4 left-4 z-20 h-9 w-9 rounded-full bg-white/90 text-accent shadow-sm hover:bg-white" />

        <div className="grid grid-cols-[1.2fr_1fr] items-stretch pt-16 sm:grid-cols-[1fr_1.4fr] sm:pt-0">
          <div className="flex flex-col justify-center gap-3 px-5 py-6 sm:px-10 sm:py-10">
            <p className="font-serif text-3xl leading-[1.05] font-semibold tracking-wide uppercase sm:text-5xl">
              <span className="block text-foreground">About</span>
              <span className="relative inline-block text-accent">
                Arborn
                <HeartIcon filled className="absolute -top-0.5 -right-4 h-3.5 w-3.5 sm:-right-5 sm:h-4 sm:w-4" />
              </span>
            </p>
            <p className="text-sm text-[var(--muted)] sm:text-base">
              More than nightwear,
              <br className="sm:hidden" /> it&rsquo;s about feeling like <span className="text-accent">you</span>.
            </p>
          </div>
          <div className="relative flex h-52 w-full items-center justify-center sm:h-80">
            <Image src={LOGO_IMAGE} alt="Arborn" width={200} height={200} className="h-24 w-24 object-contain opacity-80 sm:h-36 sm:w-36" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pt-8 pb-8 sm:px-6">
      <div className="grid gap-4">
        <section id="about-us" className="scroll-mt-24 grid overflow-hidden rounded-3xl bg-accent-soft/60 sm:grid-cols-[1fr_1.3fr]">
          <div className="p-4 sm:p-6">
            <SectionHeading>About Us</SectionHeading>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Arborn is a ladies nightwear brand created to bring comfort, confidence and beauty
              into every woman&rsquo;s daily life. Thoughtfully designed, premium quality fabrics
              and made with love.
            </p>
          </div>
          <div className="relative h-56 w-full sm:h-full">
            <Image src={ABOUT_US_IMAGE} alt="Arborn nightwear on display" fill className="object-cover" />
          </div>
        </section>

        <section id="meet-the-founder" className="scroll-mt-24 rounded-3xl bg-white p-4 shadow-[0_8px_20px_rgba(91,53,61,0.06)] sm:p-6">
          <SectionHeading>Meet the Founder</SectionHeading>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Hi, I&rsquo;m the heart behind Arborn. A dreamer, a believer and a woman who truly
            understands the need for comfortable and beautiful nightwear.
          </p>
          <Link href="/about/founder" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
            Read her story
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </section>

        <section id="our-journey" className="scroll-mt-24 rounded-3xl bg-[#fdf8f2] p-4 sm:p-6">
          <SectionHeading>Our Journey</SectionHeading>
          <p className="mt-2 text-sm text-[var(--muted)]">
            From a small idea to a growing brand, our journey is built on your love and trust.
          </p>
          <Link href="/about/journey" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
            See her full journey
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <section id="our-vision" className="scroll-mt-24 overflow-hidden rounded-3xl bg-white shadow-[0_8px_20px_rgba(91,53,61,0.06)]">
            <div className="p-4 sm:p-6">
              <SectionHeading>Our Vision</SectionHeading>
              <p className="mt-2 text-sm text-[var(--muted)]">
                To become every woman&rsquo;s first choice for nightwear by blending comfort,
                style and affordability.
              </p>
            </div>
            <PlaceholderArt className="h-28 w-full" />
          </section>

          <section id="our-mission" className="scroll-mt-24 overflow-hidden rounded-3xl bg-white shadow-[0_8px_20px_rgba(91,53,61,0.06)]">
            <div className="p-4 sm:p-6">
              <SectionHeading>Our Mission</SectionHeading>
              <p className="mt-2 text-sm text-[var(--muted)]">
                To make comfortable, beautiful and affordable nightwear accessible to every woman.
              </p>
            </div>
            <PlaceholderArt className="h-28 w-full" />
          </section>
        </div>

        <section id="quality-promise" className="scroll-mt-24 grid overflow-hidden rounded-3xl bg-accent-soft/60 sm:grid-cols-[1fr_1.3fr]">
          <div className="p-4 sm:p-6">
            <SectionHeading>Quality Promise</SectionHeading>
            <p className="mt-2 text-sm text-[var(--muted)]">
              We use carefully selected fabrics and strict quality checks to ensure you always get
              the best.
            </p>
          </div>
          <PlaceholderArt className="h-32 w-full sm:h-full" />
        </section>

        <section id="contact-us" className="scroll-mt-24 grid overflow-hidden rounded-3xl bg-white shadow-[0_8px_20px_rgba(91,53,61,0.06)] sm:grid-cols-[1fr_1.3fr]">
          <div className="p-4 sm:p-6">
          <SectionHeading>Contact Us</SectionHeading>
          <p className="mt-2 text-sm text-[var(--muted)]">We&rsquo;re here to help you!</p>
          <div className="mt-3 flex flex-col gap-2.5 text-sm font-medium">
            <a
              href={buildWhatsAppLink("Hi Arborn! I have a question.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#25D366]"
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
              className="flex items-center gap-2 text-accent"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              @arborn__
            </a>
            <a href="mailto:hello@arborn.com" className="flex items-center gap-2 text-black/70">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              hello@arborn.com
            </a>
          </div>
          </div>
          <PlaceholderArt className="h-32 w-full sm:h-full" />
        </section>

        <section id="faqs" className="scroll-mt-24 overflow-hidden rounded-3xl bg-[#fdf8f2] p-4 sm:p-6">
          <SectionHeading showHeart={false}>FAQs</SectionHeading>
          <div className="mt-2">
            {FAQS.map(({ q, a }) => (
              <AccordionItem key={q} title={q}>
                {a}
              </AccordionItem>
            ))}
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
