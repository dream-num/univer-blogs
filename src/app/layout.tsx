import type { Metadata } from "next";
import "./globals.css";
import { forwardingScript } from "@/lib/forwarding";

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.univer.ai"),
  title: "Univer Blog",
  description: "The Univer blog is now part of the documentation website.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: forwardingScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
