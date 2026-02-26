"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  SVG-заглушки — замените на реальные изображения, когда будут готовы:
 *    Логотип:  <Image src="/logo-igora-drive.svg" alt="Игора Драйв" ... />
 * ------------------------------------------------------------------ */

function LogoPlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className ?? "h-16 w-16"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="80" height="80" rx="16" fill="#18181b" />
      <rect x="4" y="4" width="72" height="72" rx="12" fill="none" stroke="#f97316" strokeWidth="2" />
      <ellipse cx="40" cy="38" rx="22" ry="14" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <line x1="40" y1="24" x2="40" y2="52" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="16" y1="30" x2="24" y2="30" stroke="#f97316" strokeWidth="1.5" opacity="0.6" />
      <line x1="14" y1="38" x2="22" y2="38" stroke="#f97316" strokeWidth="1.5" opacity="0.8" />
      <line x1="16" y1="46" x2="24" y2="46" stroke="#f97316" strokeWidth="1.5" opacity="0.6" />
      <rect x="32" y="56" width="4" height="4" fill="#f97316" opacity="0.5" />
      <rect x="40" y="56" width="4" height="4" fill="#f97316" opacity="0.5" />
      <rect x="36" y="60" width="4" height="4" fill="#f97316" opacity="0.5" />
      <rect x="44" y="60" width="4" height="4" fill="#f97316" opacity="0.5" />
      <text x="40" y="76" textAnchor="middle" fill="#f97316" fontSize="6" fontFamily="sans-serif" fontWeight="700">
        ИД
      </text>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === "IDAccreditation" && password === "IgoraDriveBest") {
      router.push("/events");
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ——— Левая колонка: брендинг ——— */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-zinc-900 p-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-orange-500" />
          <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-orange-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-orange-500" />
        </div>

        {/* Decorative lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-orange-500/10" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-orange-500/10" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <LogoPlaceholder className="h-24 w-24" />

          <h1 className="mt-8 text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
            ИГОРА ДРАЙВ
          </h1>

          <p className="mt-3 text-zinc-400 text-lg tracking-widest uppercase">
            Аккредитация подрядчиков
          </p>

          <div className="mt-6 w-32 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 opacity-60 rounded-full" />

          <p className="mt-6 text-zinc-500 text-sm">
            2026 &bull; Санкт-Петербург
          </p>

          {/* Checkered pattern decoration */}
          <div className="mt-10 flex gap-1 opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`w-4 h-4 ${i % 2 === 0 ? "bg-orange-500" : "bg-transparent"}`} />
            ))}
          </div>
          <div className="flex gap-1 opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`w-4 h-4 ${i % 2 === 1 ? "bg-orange-500" : "bg-transparent"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ——— Правая колонка: вход ——— */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-4 sm:p-8 bg-muted/40">
        <div className="w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <LogoPlaceholder />
          </div>

          <Card className="shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                Система Аккредитации
              </CardTitle>
              <CardDescription>
                Вход в личный кабинет подрядчика
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login">Логин (ID)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login"
                      type="text"
                      placeholder="Введите ID"
                      className="pl-9"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Введите пароль"
                      className="pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {error && (
                  <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full">
                  Войти
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
