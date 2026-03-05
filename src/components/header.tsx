"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Header({ showBack }: { showBack?: boolean }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/events" className="flex items-center gap-2 font-semibold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/LK/logo-accreditation-center.svg" alt="IGORA DRIVE Accreditation Center" className="h-8" />
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
          <Link
            href="/profile"
            className="hidden sm:inline-block text-sm text-muted-foreground border rounded-md px-3 py-1 hover:bg-muted transition-colors cursor-pointer"
          >
            ООО &quot;ГигаСтрой&quot; · ИНН 7812345678
          </Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/LK/logo-igora-pink.png" alt="Игора Драйв" className="h-8" />
        </div>
      </div>
    </header>
  );
}
