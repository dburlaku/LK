"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Phone, Mail, User, KeyRound, LogOut, ArrowLeft } from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { mockCompanyProfile } from "@/lib/mock-data";

export default function ProfilePage() {
  const router = useRouter();
  const profile = mockCompanyProfile;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: "error", text: "Заполните все поля" });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "Новый пароль должен содержать минимум 6 символов",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Пароли не совпадают" });
      return;
    }
    if (oldPassword !== "IgoraDriveBest") {
      setPasswordMessage({ type: "error", text: "Неверный текущий пароль" });
      return;
    }

    setPasswordMessage({ type: "success", text: "Пароль успешно изменён (демо)" });
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl px-4 py-8 md:px-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">Профиль компании</h1>
        </div>

        {/* Company Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5" />
              Контактная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Название компании</p>
                <p className="text-sm font-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ИНН</p>
                <p className="text-sm font-medium">{profile.inn}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> ФИО представителя
                </p>
                <p className="text-sm font-medium">{profile.representative}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Контактный телефон
                </p>
                <p className="text-sm font-medium">{profile.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email
              </p>
              <p className="text-sm font-medium">{profile.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Curator */}
        <Card className="mb-6 border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Ваш куратор
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">ФИО</p>
                <p className="text-sm font-medium">Иванова Мария Александровна</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Телефон
                </p>
                <p className="text-sm font-medium">+7 (812) 600-00-01</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email
                </p>
                <p className="text-sm font-medium">v.mikhailova@drive-igora.ru</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-5 w-5" />
              Сменить пароль
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old-password">Текущий пароль</Label>
                <Input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Введите текущий пароль"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Новый пароль</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Минимум 6 символов"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Подтверждение</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите пароль"
                  />
                </div>
              </div>
              {passwordMessage && (
                <div
                  className={`rounded-md p-3 text-sm ${
                    passwordMessage.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}
              <Button type="submit">Сменить пароль</Button>
            </form>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => router.push("/")}
        >
          <LogOut className="h-4 w-4" />
          Выйти из системы
        </Button>
      </main>
    </div>
  );
}
