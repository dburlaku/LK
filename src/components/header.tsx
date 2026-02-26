"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Header({ showBack }: { showBack?: boolean }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/events" className="flex items-center gap-2 font-semibold">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 12l2 2 4-4" />
            </svg>
            AccredSystem
          </Link>
          {showBack && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Link
                href="/events"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                К списку мероприятий
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => router.push("/help")}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Справка</span>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Link
            href="/profile"
            className="hidden sm:inline-block text-sm text-muted-foreground border rounded-md px-3 py-1 hover:bg-muted transition-colors cursor-pointer"
          >
            ООО &quot;ГигаСтрой&quot;
          </Link>
        </div>
      </div>
    </header>
  );
}
