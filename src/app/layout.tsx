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
    default: "Univer Blog",
    template: `%s | Univer Blog`,
  },
  description: "Univer is a full-stack framework for creating, editing, and collaborating on spreadsheets, documents, and slides across web and server environments. Empower your workflow with server-driven productivity tools, real-time collaboration, and enterprise-grade integration. Deploy on-premise or in the cloud for secure, scalable document management.",
  keywords: "JavaScript sheet, Node sheet, JavaScript spreadsheet, Node.js spreadsheet, spreadsheet SDK, web spreadsheet editor, server-side spreadsheet, full-stack document editing, Univer, productivity tools, collaborative editor, online spreadsheet, self-hosted office suite, server-driven spreadsheet, self-hosted spreadsheet, js sheet, js spreadsheet",
  openGraph: {
    title: "Univer Blog",
    description: "Univer is a full-stack framework for creating, editing, and collaborating on spreadsheets, documents, and slides across web and server environments. Empower your workflow with server-driven productivity tools, real-time collaboration, and enterprise-grade integration. Deploy on-premise or in the cloud for secure, scalable document management.",
    url: siteUrl,
    siteName: "Univer Blog",
    images: [
      {
        url: `${siteUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Univer Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Univer Blog",
    description: "Univer is a full-stack framework for creating, editing, and collaborating on spreadsheets, documents, and slides across web and server environments. Empower your workflow with server-driven productivity tools, real-time collaboration, and enterprise-grade integration. Deploy on-premise or in the cloud for secure, scalable document management.",
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
          src="https://www.googletagmanager.com/gtag/js?id=G-NV1GG0YQ46"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NV1GG0YQ46');
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
