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
 *    Баннер:   <Image src="/banner-igora-drive.jpg" alt="Игора Драйв Banner" ... />
 * ------------------------------------------------------------------ */

function LogoPlaceholder() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-16 w-16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="80" height="80" rx="16" fill="#18181b" />
      <rect x="4" y="4" width="72" height="72" rx="12" fill="none" stroke="#f97316" strokeWidth="2" />
      {/* Racing track oval */}
      <ellipse cx="40" cy="38" rx="22" ry="14" fill="none" stroke="#f97316" strokeWidth="2.5" />
      {/* Start/finish line */}
      <line x1="40" y1="24" x2="40" y2="52" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Speed lines */}
      <line x1="16" y1="30" x2="24" y2="30" stroke="#f97316" strokeWidth="1.5" opacity="0.6" />
      <line x1="14" y1="38" x2="22" y2="38" stroke="#f97316" strokeWidth="1.5" opacity="0.8" />
      <line x1="16" y1="46" x2="24" y2="46" stroke="#f97316" strokeWidth="1.5" opacity="0.6" />
      {/* Checkered pattern */}
      <rect x="32" y="56" width="4" height="4" fill="#f97316" opacity="0.5" />
      <rect x="40" y="56" width="4" height="4" fill="#f97316" opacity="0.5" />
      <rect x="36" y="60" width="4" height="4" fill="#f97316" opacity="0.5" />
      <rect x="44" y="60" width="4" height="4" fill="#f97316" opacity="0.5" />
      <text
        x="40"
        y="76"
        textAnchor="middle"
        fill="#f97316"
        fontSize="6"
        fontFamily="sans-serif"
        fontWeight="700"
      >
        ИД
      </text>
    </svg>
  );
}

function BannerPlaceholder() {
  return (
    <svg
      viewBox="0 0 800 220"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="50%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="220" rx="12" fill="url(#bannerGrad)" />

      {/* Decorative circles */}
      <circle cx="80" cy="110" r="120" fill="#f97316" opacity="0.05" />
      <circle cx="720" cy="110" r="100" fill="#f97316" opacity="0.05" />

      {/* Decorative lines */}
      <line x1="0" y1="180" x2="800" y2="180" stroke="#f97316" strokeWidth="0.5" opacity="0.2" />
      <line x1="0" y1="40" x2="800" y2="40" stroke="#f97316" strokeWidth="0.5" opacity="0.2" />

      {/* Road marks left */}
      <g opacity="0.3" transform="translate(50, 95)">
        <rect x="0" y="0" width="20" height="4" rx="2" fill="#f97316" />
        <rect x="28" y="0" width="20" height="4" rx="2" fill="#f97316" />
        <rect x="56" y="0" width="20" height="4" rx="2" fill="#f97316" />
      </g>

      {/* Road marks right */}
      <g opacity="0.3" transform="translate(700, 95)">
        <rect x="0" y="0" width="20" height="4" rx="2" fill="#f97316" />
        <rect x="28" y="0" width="20" height="4" rx="2" fill="#f97316" />
        <rect x="56" y="0" width="20" height="4" rx="2" fill="#f97316" />
      </g>

      {/* Checkered flag left */}
      <g opacity="0.15" transform="translate(60, 50)">
        <rect x="0" y="0" width="10" height="10" fill="#f97316" />
        <rect x="10" y="10" width="10" height="10" fill="#f97316" />
        <rect x="20" y="0" width="10" height="10" fill="#f97316" />
        <rect x="0" y="20" width="10" height="10" fill="#f97316" />
        <rect x="20" y="20" width="10" height="10" fill="#f97316" />
      </g>

      {/* Checkered flag right */}
      <g opacity="0.15" transform="translate(700, 50)">
        <rect x="0" y="0" width="10" height="10" fill="#f97316" />
        <rect x="10" y="10" width="10" height="10" fill="#f97316" />
        <rect x="20" y="0" width="10" height="10" fill="#f97316" />
        <rect x="0" y="20" width="10" height="10" fill="#f97316" />
        <rect x="20" y="20" width="10" height="10" fill="#f97316" />
      </g>

      {/* Event name */}
      <text
        x="400"
        y="100"
        textAnchor="middle"
        fill="url(#accentGrad)"
        fontSize="48"
        fontFamily="sans-serif"
        fontWeight="800"
        letterSpacing="2"
      >
        ИГОРА ДРАЙВ
      </text>

      {/* Subtitle */}
      <text
        x="400"
        y="140"
        textAnchor="middle"
        fill="#a1a1aa"
        fontSize="16"
        fontFamily="sans-serif"
        fontWeight="400"
        letterSpacing="4"
      >
        АККРЕДИТАЦИЯ ПОДРЯДЧИКОВ
      </text>

      {/* Location */}
      <text
        x="400"
        y="170"
        textAnchor="middle"
        fill="#71717a"
        fontSize="13"
        fontFamily="sans-serif"
        fontWeight="500"
      >
        2025 &bull; САНКТ-ПЕТЕРБУРГ
      </text>

      {/* Bottom accent line */}
      <rect x="300" y="200" width="200" height="3" rx="1.5" fill="url(#accentGrad)" opacity="0.6" />
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      {/* ——— Баннер мероприятия ——— */}
      <div className="w-full max-w-2xl mb-8 rounded-xl overflow-hidden shadow-lg">
        <BannerPlaceholder />
      </div>

      {/* ——— Карточка логина ——— */}
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          {/* Логотип компании */}
          <div className="flex justify-center mb-2">
            <LogoPlaceholder />
          </div>
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
  );
}
