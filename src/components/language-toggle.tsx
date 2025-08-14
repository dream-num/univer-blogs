"use client";

import * as React from "react";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";

const languages = [
  {
    code: "en",
    name: "English",
  },
  {
    code: "zh",
    name: "中文",
  },
];

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLang = pathname.startsWith("/zh") ? "zh" : "en";
  
  const switchLanguage = (langCode: string) => {
    if (langCode === "zh") {
      // Switch to Chinese
      if (pathname === "/") {
        router.push("/zh");
      } else if (pathname.startsWith("/posts/")) {
        router.push("/zh" + pathname);
      } else {
        router.push("/zh" + pathname);
      }
    } else {
      // Switch to English
      if (pathname === "/zh") {
        router.push("/");
      } else if (pathname.startsWith("/zh/")) {
        router.push(pathname.replace("/zh", ""));
      } else {
        router.push(pathname);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <Languages className="h-4 w-4" />
          <span className="sr-only">切换语言</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className="cursor-pointer"
          >
            <Check
              className={`mr-2 h-4 w-4 ${
                currentLang === lang.code ? "opacity-100" : "opacity-0"
              }`}
            />
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}