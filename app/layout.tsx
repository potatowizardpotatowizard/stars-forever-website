import type { Metadata } from "next";
import { Archivo, Figtree, Fragment_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CodeRain from "@/components/CodeRain";
import ConstellationTrail from "@/components/ConstellationTrail";
import GoodFriday from "@/components/GoodFriday";
import LetterFall from "@/components/LetterFall";
import MotionMagic from "@/components/MotionMagic";
import ShootingStar from "@/components/ShootingStar";
import StarCursor from "@/components/StarCursor";
import VerseSummon from "@/components/VerseSummon";
import WarpScroll from "@/components/WarpScroll";
import TapeIntro from "@/components/TapeIntro";
import WarpNavigator from "@/components/WarpNavigator";
import { SITE_NAME, SITE_DESCRIPTION } from "@/content/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://stars-forever.vercel.app",
  ),
  title: {
    default: `${SITE_NAME}: a ministry for creators, artists, and entrepreneurs`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: "/brand/og-purple-star.jpg", width: 1920, height: 1072 }],
  },
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stars-forever.vercel.app",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://stars-forever.vercel.app"}/brand/icon-512.png`,
  email: "auzi@starsforever.co",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${figtree.variable} ${fragmentMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <a
          href="#main"
          className="meta-label sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-soot focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <TapeIntro />
        <ShootingStar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WarpNavigator />
        <ConstellationTrail />
        <StarCursor />
        <WarpScroll />
        <VerseSummon />
        <MotionMagic />
        <GoodFriday />
        <CodeRain />
        <LetterFall />
        <Analytics />
      </body>
    </html>
  );
}
