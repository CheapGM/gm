import type { Metadata } from "next";
import {
  Inter,
  Poppins,
  Space_Grotesk,
  Space_Mono,
  Orbitron,
  Bungee,
} from "next/font/google";
import { cx } from "class-variance-authority";
import { Header, Footer } from "@/ui/layouts/app-layout";
import Progress from "@/ui/components/page-progressbar";
import Providers from "@/lib/providers";
import { getMetaDataByName } from "@/utils/meta-data";

import "react-toastify/ReactToastify.min.css";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import Script from "next/script";
import { Toaster } from 'sonner';

export const metadata: Metadata = getMetaDataByName("home");

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-orbitron",
});

const bungee = Bungee({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-bungee",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GOOGLE_ANALYTICS_ID =
    process.env?.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? "";
  return (
    <html
      lang="en"
      className={cx(
        poppins.variable,
        spaceMono.variable,
        spaceGrotesk.variable,
        inter.variable,
        orbitron.variable,
        bungee.variable,
        "relative text-white bg-main-100 font-poppins"
      )}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
      </head>
      <body className="w-full h-full overflow-x-hidden">
        <div className="absolute -z-10 inset-0 bg-body" />
        <Providers>
          <Header />
          <div className="flex flex-col min-h-screen">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
        <Progress />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
