"use client";

import { useState } from "react";
import { Pencil, AlertTriangle, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Application, Quota, AccreditationType } from "@/lib/mock-data";
import {
  validateFullName,
  validatePassport,
  validatePosition,
  validatePhone,
  validateLatinField,
  validatePlate,
  formatPhone,
  extractPhoneDigits,
  PHONE_COUNTRIES,
  type PhoneCountry,
} from "@/lib/validation";
import type { NewApplicationData } from "@/components/submit-application-dialog";

function statusBadgeVariant(status: string) {
  switch (status) {
    case "Аккредитация выдана":
      return "outline" as const;
    case "Заявка согласована":
      return "secondary" as const;
    case "Заявка отправлена":
    case "Заявка отправлена на согласование":
      return "default" as const;
    case "Отклонена":
      return "destructive" as const;
    default:
      return "destructive" as const;
  }
}

function FieldHint({ text }: { text: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="inline h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function ApplicationDetailDialog({
  application,
  open,
  onOpenChange,
  onUpdate,
  onResubmit,
  quotas,
}: {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (updated: Application) => void;
  onResubmit?: (app: NewApplicationData) => void;
  quotas?: Quota[];
}) {
  const [editing, setEditing] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState("");
  const [passport, setPassport] = useState("");
  const [position, setPosition] = useState("");
  const [type, setType] = useState("");
  const [phoneFormatted, setPhoneFormatted] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>(PHONE_COUNTRIES[0]);
  const [email, setEmail] = useState("");
  const [needVehicle, setNeedVehicle] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  if (!application) return null;

  const startEditing = () => {
    setFullName(application.fullName);
    setPassport(application.passport);
    setPosition(application.position);
    setType(application.type);
    // Try to parse existing phone
    const rawDigits = extractPhoneDigits(application.phone);
    // Detect country by code prefix
    let country = PHONE_COUNTRIES[0];
    if (application.phone.startsWith("+375")) {
      country = PHONE_COUNTRIES.find((c) => c.name === "Беларусь") || PHONE_COUNTRIES[0];
    } else if (application.phone.startsWith("+998")) {
      country = PHONE_COUNTRIES.find((c) => c.name === "Узбекистан") || PHONE_COUNTRIES[0];
    }
    setPhoneCountry(country);
    // Strip country code digits
    const codeDigits = extractPhoneDigits(country.code);
    const localDigits = rawDigits.startsWith(codeDigits) ? rawDigits.slice(codeDigits.length) : rawDigits;
    setPhoneFormatted(formatPhone(localDigits, country));
    setEmail(application.email);
    setNeedVehicle(!!application.vehicle);
    setBrand(application.vehicle?.brand ?? "");
    setModel(application.vehicle?.model ?? "");
    setPlate(application.vehicle?.plate ?? "");
    setErrors({});
    setEditing(true);
  };

  const validateForm = (): boolean => {
    const e: Record<string, string | null> = {};
    e.fullName = validateFullName(fullName);
    e.passport = validatePassport(passport);
    e.position = validatePosition(position);
    e.type = !type ? "Выберите тип" : null;
    e.phone = validatePhone(extractPhoneDigits(phoneFormatted), phoneCountry);
    if (needVehicle) {
      e.brand = validateLatinField(brand, "Марка");
      e.model = validateLatinField(model, "Модель");
      e.plate = validatePlate(plate);
    }
    setErrors(e);
    return !Object.values(e).some((v) => v !== null);
  };

  const handleSaveClick = () => {
    if (!validateForm()) return;
    setConfirmSave(true);
  };

  const handleConfirmSave = () => {
    const phoneDigits = extractPhoneDigits(phoneFormatted);
    const fullPhone = `${phoneCountry.code} ${formatPhone(phoneDigits, phoneCountry)}`;
    const now = new Date();
    const dateStr = now.toLocaleString("ru-RU");

    const updated: Application = {
      ...application,
      fullName: fullName.trim(),
      passport: passport.trim(),
      position: position.trim(),
      type: type as AccreditationType,
      phone: fullPhone,
      email: email.trim(),
      vehicle: needVehicle ? { brand: brand.trim(), model: model.trim(), plate: plate.trim() } : null,
      vehiclePass: needVehicle ? plate.trim() : null,
      status: "Заявка отправлена на согласование",
      updatedAt: now.toLocaleDateString("ru-RU"),
      statusHistory: [
        { status: "Заявка отправлена на согласование", date: dateStr },
        ...application.statusHistory,
      ],
    };

    onUpdate?.(updated);
    setEditing(false);
    setConfirmSave(false);
    onOpenChange(false);
  };

  const handleResubmit = () => {
    if (!validateForm()) return;
    const phoneDigits = extractPhoneDigits(phoneFormatted);
    const fullPhone = `${phoneCountry.code} ${formatPhone(phoneDigits, phoneCountry)}`;

    onResubmit?.({
      fullName: fullName.trim(),
      passport: passport.trim(),
      type: type as AccreditationType,
      position: position.trim(),
      phone: fullPhone,
      email: email.trim(),
      vehicle: needVehicle ? { brand: brand.trim(), model: model.trim(), plate: plate.trim() } : null,
    });

    setEditing(false);
    onOpenChange(false);
  };

  const isRejected = application.status === "Отклонена";
  const canEdit = application.status !== "Отозвана" && application.status !== "Аккредитация выдана";
  const availableQuotas = quotas ?? [];

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) setEditing(false);
          onOpenChange(v);
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl">{application.fullName}</DialogTitle>
                <p className="text-sm text-muted-foreground">{application.position}</p>
              </div>
              <Badge variant={statusBadgeVariant(application.status)}>
                {application.status}
              </Badge>
            </div>
          </DialogHeader>

          {/* Rejection reason banner */}
          {isRejected && application.rejectionReason && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Причина отклонения</p>
                <p className="text-sm text-red-700">{application.rejectionReason}</p>
              </div>
            </div>
          )}

          {!editing ? (
            /* ─── Read-only view ─── */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Тип аккредитации</p>
                  <p className="text-sm font-medium">{application.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Паспортные данные</p>
                  <p className="text-sm font-medium">{application.passport}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Телефон</p>
                  <p className="text-sm font-medium">{application.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">E-mail</p>
                  <p className="text-sm font-medium">{application.email}</p>
                </div>
              </div>

              {application.vehicle && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 text-sm font-medium">Разрешение на въезд и стоянку (РВСТ)</p>
                    <div className="grid grid-cols-3 gap-4 rounded-md border p-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Марка</p>
                        <p className="text-sm font-medium">{application.vehicle.brand}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Модель</p>
                        <p className="text-sm font-medium">{application.vehicle.model}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Гос. номер</p>
                        <p className="text-sm font-medium">{application.vehicle.plate}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />
              <div>
                <p className="mb-3 text-sm font-medium">История изменений статуса</p>
                <div className="space-y-3">
                  {application.statusHistory.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${entry.status === "Отклонена" ? "bg-red-500" : "bg-foreground"}`} />
                        <span className="text-sm">{entry.status}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{entry.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ─── Edit mode ─── */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ФИО * <FieldHint text="Только кириллица" /></Label>
                  <Input
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: null })); }}
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Паспорт * <FieldHint text="Только цифры, 10 цифр" /></Label>
                  <Input
                    value={passport}
                    onChange={(e) => { setPassport(e.target.value); setErrors((p) => ({ ...p, passport: null })); }}
                    className={errors.passport ? "border-red-500" : ""}
                  />
                  {errors.passport && <p className="text-xs text-red-500">{errors.passport}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Тип аккредитации *</Label>
                  <Select value={type} onValueChange={(v) => { setType(v); setErrors((p) => ({ ...p, type: null })); }}>
                    <SelectTrigger className={`w-full ${errors.type ? "border-red-500" : ""}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableQuotas.length > 0
                        ? availableQuotas.map((q) => (
                            <SelectItem key={q.type} value={q.type}>{q.type}</SelectItem>
                          ))
                        : (["Организатор", "Технический персонал", "Пресса"] as const).map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Должность <FieldHint text="Только кириллица" /></Label>
                  <Input
                    value={position}
                    onChange={(e) => { setPosition(e.target.value); setErrors((p) => ({ ...p, position: null })); }}
                    className={errors.position ? "border-red-500" : ""}
                  />
                  {errors.position && <p className="text-xs text-red-500">{errors.position}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Телефон *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={`${phoneCountry.code}-${phoneCountry.name}`}
                      onValueChange={(v) => {
                        const [code, name] = v.split("-");
                        const found = PHONE_COUNTRIES.find((c) => c.code === code && c.name === name);
                        if (found) { setPhoneCountry(found); setPhoneFormatted(""); }
                      }}
                    >
                      <SelectTrigger className="w-[110px] shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PHONE_COUNTRIES.map((c) => (
                          <SelectItem key={`${c.code}-${c.name}`} value={`${c.code}-${c.name}`}>{c.flag} {c.code}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={phoneCountry.mask.replace(/#/g, "0")}
                      value={phoneFormatted}
                      onChange={(e) => {
                        setPhoneFormatted(formatPhone(extractPhoneDigits(e.target.value), phoneCountry));
                        setErrors((p) => ({ ...p, phone: null }));
                      }}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="edit-vehicle" checked={needVehicle} onCheckedChange={(v) => setNeedVehicle(v === true)} />
                  <Label htmlFor="edit-vehicle" className="cursor-pointer">РВСТ</Label>
                </div>
                {needVehicle && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Марка <FieldHint text="Латиница" /></Label>
                      <Input value={brand} onChange={(e) => setBrand(e.target.value)} className={errors.brand ? "border-red-500" : ""} />
                      {errors.brand && <p className="text-xs text-red-500">{errors.brand}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Модель <FieldHint text="Латиница" /></Label>
                      <Input value={model} onChange={(e) => setModel(e.target.value)} className={errors.model ? "border-red-500" : ""} />
                      {errors.model && <p className="text-xs text-red-500">{errors.model}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Гос. номер <FieldHint text="А000АА 00" /></Label>
                      <Input placeholder="А000АА 00" value={plate} onChange={(e) => setPlate(e.target.value)} className={errors.plate ? "border-red-500" : ""} />
                      {errors.plate && <p className="text-xs text-red-500">{errors.plate}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-2 flex justify-between gap-2">
            {!editing ? (
              <>
                <div>
                  {canEdit && (
                    <Button variant="outline" onClick={startEditing}>
                      <Pencil className="mr-1.5 h-4 w-4" />
                      Редактировать
                    </Button>
                  )}
                  {isRejected && (
                    <Button
                      className="ml-2"
                      onClick={() => {
                        startEditing();
                      }}
                    >
                      Исправить и отправить
                    </Button>
                  )}
                </div>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Закрыть</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditing(false)}>Отмена</Button>
                <Button onClick={isRejected ? handleResubmit : handleSaveClick}>
                  {isRejected ? "Отправить повторно" : "Сохранить"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save confirmation dialog */}
      <AlertDialog open={confirmSave} onOpenChange={setConfirmSave}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение изменений</AlertDialogTitle>
            <AlertDialogDescription>
              При сохранении изменений статус заявки изменится на{" "}
              <strong>&laquo;Заявка отправлена на согласование&raquo;</strong>.
              Заявка будет повторно рассмотрена куратором.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>
              Сохранить и отправить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
