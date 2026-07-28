function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20.5c1.7-3.6 4.5-5.5 7.5-5.5s5.8 1.9 7.5 5.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 5c0 8.3 6.7 15 15 15l2-4-5-2-1.5 2C11.5 14.5 9.5 12.5 8 10.5L10 9 8 4z" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
      <path d="M21 3l-6 6" strokeLinecap="round" />
      <path d="M21 3l-1.5 5-2.5-2.5z" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleHairIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 4c-3 1-4.5 4-4 8 .3 2.5 1.7 5 4 7" strokeLinecap="round" />
      <circle cx="12" cy="10" r="4" />
      <path d="M18 6l.8 1.6L20 8l-1.2.6L18 10l-.6-1.4L16 8l1.4-.4z" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 6.5c-1.8-1.2-4.3-1.5-7.5-1v13c3.2-.5 5.7-.2 7.5 1 1.8-1.2 4.3-1.5 7.5-1v-13c-3.2-.5-5.7-.2-7.5 1z" strokeLinejoin="round" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FaqIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 5h16v10H9l-4 4v-4H4z" strokeLinejoin="round" />
      <path d="M10 9.5c0-1 .9-1.8 2-1.8s2 .8 2 1.8c0 1-1.2 1.3-1.9 2.1" strokeLinecap="round" />
      <circle cx="12" cy="14.3" r="0.4" fill="currentColor" />
    </svg>
  );
}

export const ABOUT_SECTIONS = [
  { id: "about-us", label: "About Us", Icon: ProfileIcon },
  { id: "contact-us", label: "Contact Us", Icon: PhoneIcon },
  { id: "our-vision", label: "Our Vision", Icon: EyeIcon },
  { id: "our-mission", label: "Our Mission", Icon: TargetIcon },
  { id: "meet-the-founder", label: "Meet the Founder", Icon: SparkleHairIcon, href: "/about/founder" },
  { id: "our-journey", label: "Our Journey", Icon: BookIcon, href: "/about/journey" },
  { id: "quality-promise", label: "Quality Promise", Icon: ShieldCheckIcon },
  { id: "faqs", label: "FAQs", Icon: FaqIcon },
] as const;
