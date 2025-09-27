import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import AOSProvider from "./components/AOSProvider";
import HeaderContainer from "./components/HeaderContainer";
import FooterContainer from "./components/FooterContainer";
import "./globals.css";

import * as NextCache from "next/cache";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "VGC Consulting",
  description: "VGC Consulting website built with Next.js",
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

const noStoreCompat =
  // @ts-ignore
  (NextCache as any).noStore ??
  // @ts-ignore
  (NextCache as any).unstable_noStore ??
  (() => {});

async function fetchSettingsOnce() {
  noStoreCompat();

  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  const base = `${proto}://${host}`;

  const res = await fetch(`${base}/api/config`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Settings fetch failed: ${res.status}`);
  return res.json();
}

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSettingsOnce();

  return (
    <html lang="en">
      <head>
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100..700&display=swap" rel="stylesheet" />
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" rel="stylesheet" />
        <link href="/css/style.css" rel="stylesheet" />
        <link href="/images/fav.webp" rel="icon" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AOSProvider>
          <HeaderContainer initial={settings} />
          {children}
          <FooterContainer initial={settings} />
        </AOSProvider>

        <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" strategy="afterInteractive" />
        <Script src="https://code.jquery.com/jquery-3.7.1.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/js/bootstrap.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/classie/1.0.1/classie.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js" strategy="afterInteractive" />
        <Script src="/js/custom.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
