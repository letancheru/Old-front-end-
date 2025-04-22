import { Poppins } from "next/font/google";
import "./globals.css";
import * as React from "react";
import Providers from "@/providers";
import { Metadata } from "next";
import Header from "@/components/modules/website/header";
import Footer from "@/components/modules/website/footer";
import MobileBottom from "@/components/modules/custom/MobileBottom";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Initialize Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// SEO GLOBAL
export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}`),
  applicationName: "Elelan Ecommerce",
  keywords: ["ecommerce", "shopping", "online store", "elelan"],
  authors: [{ name: "Elelan Ecommerce", url: "https://elelanmarket.com" }],
  publisher: "Elelan",

  alternates: {
    canonical: "/",
    languages: {
      en: "en",
    },
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      noimageindex: true,
    },
  },



  icons: {
    icon: "/assets/images/logo.svg",
    shortcut: "/assets/images/logo.svg",
    apple: "/assets/images/logo.svg",
  },

  twitter: {
    card: "summary_large_image",
    title: "Elelan Ecommerce",
    description: "Your one-stop shop for all your needs",
    siteId: "ElelanEcommerce",
    creator: "Elelan",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/assets/images/og.png`,
      },
    ],
  },

  openGraph: {
    title: "Elelan Ecommerce",
    description: "Your one-stop shop for all your needs",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/assets/images/og.png`,
      },
    ],
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    siteName: "Elelan Ecommerce",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen ${poppins.className}`}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <MobileBottom />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
