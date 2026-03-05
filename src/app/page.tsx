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
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden" style={{ backgroundColor: "#9B3A6A" }}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white" />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-white/10" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-white/10" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/LK/logo-igora-pink.png" alt="Игора Драйв" className="h-48 w-48 rounded-2xl" />

          <p className="mt-8 text-white/80 text-lg tracking-widest uppercase">
            Аккредитация подрядчиков
          </p>

          <div className="mt-6 w-32 h-0.5 bg-white/40 rounded-full" />

          <p className="mt-6 text-white/50 text-sm">
            2026 &bull; Санкт-Петербург
          </p>
        </div>
      </div>

      {/* ——— Правая колонка: вход ——— */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-4 sm:p-8 bg-muted/40">
        <div className="w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/LK/logo-igora-pink.png" alt="Игора Драйв" className="h-20 w-20 rounded-xl" />
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
                <Button type="submit" className="w-full" style={{ backgroundColor: "#9B3A6A" }}>
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
