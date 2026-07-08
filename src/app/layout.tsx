import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { ShopProvider } from "@/lib/shop-context";
import { AuthProvider } from "@/lib/auth-context";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const DESCRIPTION =
  "Premium nightwear for everyday comfort. Explore Arborn's collection of night suits, cotton, satin and loungewear designed for you.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Arborn — Comfort You'll Love Coming Home To",
    template: "%s | Arborn",
  },
  description: DESCRIPTION,
  keywords: [
    "Arborn",
    "nightwear",
    "loungewear",
    "night suits",
    "pajamas",
    "women's sleepwear",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Arborn — Comfort You'll Love Coming Home To",
    description: DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Arborn — Comfort You'll Love Coming Home To",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <AuthProvider>
          <ShopProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileBottomNav />
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
