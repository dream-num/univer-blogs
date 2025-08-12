import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Capalyze Blog",
    template: `%s | Capalyze Blog`,
  },
  description: "Capalyze Blog shares insights, tips, and case studies on turning scattered data into intelligent, data-driven decisions with AI-powered analysis.",
  keywords: "Capalyze Blog, Data Collection, Data Scraping, Data Analysis, Data Crawling, AI Agent, Data Visualization, Sentiment Analysis, Keyword Extraction, OLAP, E-commerce Analytics, Social Media Trends, Vacation Rental Optimization, Data Insights, Business Intelligence, AI Data Tools",
  openGraph: {
    title: "Capalyze Blog",
    description: "Capalyze Blog shares insights, tips, and case studies on turning scattered data into intelligent, data-driven decisions with AI-powered analysis.",
    url: siteUrl,
    siteName: "Capalyze Blog",
    images: [
      {
        url: `${siteUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Capalyze Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capalyze Blog",
    description: "Capalyze Blog shares insights, tips, and case studies on turning scattered data into intelligent, data-driven decisions with AI-powered analysis.",
    images: [`${siteUrl}/opengraph-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteUrl}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MRYQ5T9FHK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MRYQ5T9FHK');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
