import Link from "next/link";
import { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/"
                className="flex items-center text-xl font-bold text-foreground"
              >
                Univer Blog
              </Link>
            </div>
            <div className="flex items-center">
               <Link
                href="https://univer.ai?from=blog"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors mr-6"
              >
                Try Univer
              </Link>
              <ModeToggle />
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      <footer className="bg-muted border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} <a href="https://univer.ai?from=blog" className="hover:underline">Univer</a> Blog. All rights reserved.
            </p>
            </div>
        </div>
      </footer>
    </div>
  );
}
