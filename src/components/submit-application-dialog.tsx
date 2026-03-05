"use client";

import { useState, useCallback } from "react";
import { Plus, FileSpreadsheet, Download, Upload, X, HelpCircle, Car, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { Quota, AccreditationType, VehicleInfo } from "@/lib/mock-data";
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

export interface NewApplicationData {
  fullName: string;
  passport: string;
  type: AccreditationType;
  position: string;
  phone: string;
  email: string;
  vehicle: VehicleInfo | null;
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

function PhoneInput({
  country,
  onCountryChange,
  value,
  onChange,
  error,
}: {
  country: PhoneCountry;
  onCountryChange: (c: PhoneCountry) => void;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
}) {
  const handleChange = (raw: string) => {
    const digits = extractPhoneDigits(raw);
    const formatted = formatPhone(digits, country);
    onChange(formatted);
  };

  return (
    <div className="space-y-2">
      <Label>
        Телефон *
        <FieldHint text="Выберите страну и введите номер без кода" />
      </Label>
      <div className="flex gap-2">
        <Select
          value={`${country.code}-${country.name}`}
          onValueChange={(v) => {
            const [code, name] = v.split("-");
            const found = PHONE_COUNTRIES.find((c) => c.code === code && c.name === name);
            if (found) {
              onCountryChange(found);
              onChange("");
            }
          }}
        >
          <SelectTrigger className="w-[140px] shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PHONE_COUNTRIES.map((c) => (
              <SelectItem key={`${c.code}-${c.name}`} value={`${c.code}-${c.name}`}>
                {c.flag} {c.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder={country.mask.replace(/#/g, "0")}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={error ? "border-red-500" : ""}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function VehicleFields({
  brand,
  setBrand,
  model,
  setModel,
  plate,
  setPlate,
  errors,
}: {
  brand: string;
  setBrand: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  plate: string;
  setPlate: (v: string) => void;
  errors: Record<string, string | null>;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>
          Марка
          <FieldHint text="Только латиница и цифры" />
        </Label>
        <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Toyota" className={errors.brand ? "border-red-500" : ""} />
        {errors.brand && <p className="text-xs text-red-500">{errors.brand}</p>}
      </div>
      <div className="space-y-2">
        <Label>
          Модель
          <FieldHint text="Только латиница и цифры" />
        </Label>
        <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Camry" className={errors.model ? "border-red-500" : ""} />
        {errors.model && <p className="text-xs text-red-500">{errors.model}</p>}
      </div>
      <div className="space-y-2">
        <Label>
          Гос. номер *
          <FieldHint text="Российский формат: А000АА 00" />
        </Label>
        <Input
          placeholder="А000АА 00"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          className={errors.plate ? "border-red-500" : ""}
        />
        {errors.plate && <p className="text-xs text-red-500">{errors.plate}</p>}
      </div>
    </div>
  );
}

// ─── Single Application Form ─────────────────────────────

function SingleApplicationForm({
  quotas,
  onSubmit,
  onCancel,
  eventId,
}: {
  quotas: Quota[];
  onSubmit: (apps: NewApplicationData[]) => void;
  onCancel: () => void;
  eventId?: string;
}) {
  const [linkCopied, setLinkCopied] = useState(false);

  const copyFormLink = useCallback(() => {
    if (!eventId) return;
    const url = `${window.location.origin}/LK/events/${eventId}/`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }, [eventId]);
  const [fullName, setFullName] = useState("");
  const [passport, setPassport] = useState("");
  const [type, setType] = useState<string>("");
  const [position, setPosition] = useState("");
  const [phoneFormatted, setPhoneFormatted] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>(PHONE_COUNTRIES[0]);
  const [email, setEmail] = useState("");
  const [needVehicle, setNeedVehicle] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleSubmit = () => {
    const e: Record<string, string | null> = {};
    e.fullName = validateFullName(fullName);
    e.passport = validatePassport(passport);
    e.type = !type ? "Выберите тип" : null;
    e.position = validatePosition(position);
    e.phone = validatePhone(extractPhoneDigits(phoneFormatted), phoneCountry);
    if (needVehicle) {
      e.brand = validateLatinField(brand, "Марка");
      e.model = validateLatinField(model, "Модель");
      e.plate = validatePlate(plate);
    }

    const hasErrors = Object.values(e).some((v) => v !== null);
    setErrors(e);
    if (hasErrors) return;

    const phoneDigits = extractPhoneDigits(phoneFormatted);
    const fullPhone = `${phoneCountry.code} ${formatPhone(phoneDigits, phoneCountry)}`;

    onSubmit([
      {
        fullName: fullName.trim(),
        passport: passport.trim(),
        type: type as AccreditationType,
        position: position.trim(),
        phone: fullPhone,
        email: email.trim(),
        vehicle:
          needVehicle
            ? { brand: brand.trim(), model: model.trim(), plate: plate.trim() }
            : null,
      },
    ]);

    setFullName(""); setPassport(""); setType(""); setPosition("");
    setPhoneFormatted(""); setEmail(""); setNeedVehicle(false);
    setBrand(""); setModel(""); setPlate(""); setErrors({});
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            ФИО Сотрудника *
            <FieldHint text="Фамилия, имя и отчество кириллицей" />
          </Label>
          <Input
            placeholder="Иванов Иван Иванович"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: null })); }}
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
        </div>
        <div className="space-y-2">
          <Label>
            Паспортные данные *
            <FieldHint text="Серия и номер через пробел, только цифры (10 цифр)" />
          </Label>
          <Input
            placeholder="0000 000000"
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
          <Select
            value={type}
            onValueChange={(v) => { setType(v); setErrors((p) => ({ ...p, type: null })); }}
          >
            <SelectTrigger className={`w-full ${errors.type ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              {quotas.map((q) => (
                <SelectItem key={q.type} value={q.type}>
                  {q.type} ({q.current}/{q.max})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
        </div>
        <div className="space-y-2">
          <Label>
            Должность
            <FieldHint text="Только кириллица" />
          </Label>
          <Input
            value={position}
            onChange={(e) => { setPosition(e.target.value); setErrors((p) => ({ ...p, position: null })); }}
            className={errors.position ? "border-red-500" : ""}
          />
          {errors.position && <p className="text-xs text-red-500">{errors.position}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PhoneInput
          country={phoneCountry}
          onCountryChange={setPhoneCountry}
          value={phoneFormatted}
          onChange={(v) => { setPhoneFormatted(v); setErrors((p) => ({ ...p, phone: null })); }}
          error={errors.phone}
        />
        <div className="space-y-2">
          <Label>E-mail</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox id="vehicle" checked={needVehicle} onCheckedChange={(v) => setNeedVehicle(v === true)} />
          <Label htmlFor="vehicle" className="cursor-pointer">
            Требуется Разрешение на въезд и стоянку (РВСТ)
          </Label>
        </div>
        {needVehicle && (
          <VehicleFields brand={brand} setBrand={setBrand} model={model} setModel={setModel} plate={plate} setPlate={setPlate} errors={errors} />
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2">
        {eventId ? (
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={copyFormLink}>
            {linkCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {linkCopied ? "Скопировано" : "Скопировать ссылку"}
          </Button>
        ) : <div />}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Отмена</Button>
          <Button onClick={handleSubmit}>Отправить заявку</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Multiple Applications Form ──────────────────────────

interface MultiEntry {
  fullName: string;
  passport: string;
  phone: string;
  email: string;
  type: AccreditationType;
  vehicle: VehicleInfo | null;
}

function MultipleApplicationForm({
  quotas,
  onSubmit,
  onCancel,
}: {
  quotas: Quota[];
  onSubmit: (apps: NewApplicationData[]) => void;
  onCancel: () => void;
}) {
  const [entries, setEntries] = useState<MultiEntry[]>([]);
  const [fullName, setFullName] = useState("");
  const [passport, setPassport] = useState("");
  const [phoneFormatted, setPhoneFormatted] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>(PHONE_COUNTRIES[0]);
  const [email, setEmail] = useState("");
  const [type, setType] = useState<string>(quotas[0]?.type ?? "");
  const [needVehicle, setNeedVehicle] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const nameErr = validateFullName(fullName);
    const passErr = validatePassport(passport);
    if (nameErr || passErr) {
      setError(nameErr || passErr || "");
      return;
    }
    if (needVehicle) {
      const brandErr = validateLatinField(brand, "Марка");
      const modelErr = validateLatinField(model, "Модель");
      const plateErr = validatePlate(plate);
      if (brandErr || modelErr || plateErr) {
        setError(brandErr || modelErr || plateErr || "");
        return;
      }
    }

    const phoneDigits = extractPhoneDigits(phoneFormatted);
    const fullPhone = phoneDigits ? `${phoneCountry.code} ${formatPhone(phoneDigits, phoneCountry)}` : "";

    setEntries((prev) => [
      ...prev,
      {
        fullName: fullName.trim(),
        passport: passport.trim(),
        phone: fullPhone,
        email: email.trim(),
        type: type as AccreditationType,
        vehicle: needVehicle ? { brand: brand.trim(), model: model.trim(), plate: plate.trim() } : null,
      },
    ]);
    setFullName(""); setPassport(""); setPhoneFormatted(""); setEmail("");
    setNeedVehicle(false); setBrand(""); setModel(""); setPlate("");
    setError("");
  };

  const handleRemove = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAll = () => {
    if (entries.length === 0) {
      setError("Добавьте хотя бы одного сотрудника");
      return;
    }
    onSubmit(
      entries.map((e) => ({
        fullName: e.fullName,
        passport: e.passport,
        type: e.type,
        position: "",
        phone: e.phone,
        email: e.email,
        vehicle: e.vehicle,
      }))
    );
    setEntries([]);
    setError("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4 space-y-3">
        <p className="font-medium">Добавить сотрудника</p>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="ФИО *" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input placeholder="Паспорт (0000 000000) *" value={passport} onChange={(e) => setPassport(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex gap-2">
            <Select
              value={`${phoneCountry.code}-${phoneCountry.name}`}
              onValueChange={(v) => {
                const [code, name] = v.split("-");
                const found = PHONE_COUNTRIES.find((c) => c.code === code && c.name === name);
                if (found) { setPhoneCountry(found); setPhoneFormatted(""); }
              }}
            >
              <SelectTrigger className="w-[100px] shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PHONE_COUNTRIES.map((c) => (
                  <SelectItem key={`${c.code}-${c.name}`} value={`${c.code}-${c.name}`}>
                    {c.flag} {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={phoneCountry.mask.replace(/#/g, "0")}
              value={phoneFormatted}
              onChange={(e) => setPhoneFormatted(formatPhone(extractPhoneDigits(e.target.value), phoneCountry))}
            />
          </div>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex items-center justify-between">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Тип" />
            </SelectTrigger>
            <SelectContent>
              {quotas.map((q) => (
                <SelectItem key={q.type} value={q.type}>{q.type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Добавить
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="multi-vehicle" checked={needVehicle} onCheckedChange={(v) => setNeedVehicle(v === true)} />
          <Label htmlFor="multi-vehicle" className="cursor-pointer text-sm">РВСТ</Label>
        </div>
        {needVehicle && (
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="Марка (латиница)" value={brand} onChange={(e) => setBrand(e.target.value)} />
            <Input placeholder="Модель (латиница)" value={model} onChange={(e) => setModel(e.target.value)} />
            <Input placeholder="А000АА 00" value={plate} onChange={(e) => setPlate(e.target.value)} />
          </div>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {entries.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Добавлено: {entries.length}</p>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {entries.map((e, i) => (
              <div key={i} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                <span>
                  {e.fullName}{" "}
                  <span className="text-muted-foreground">— {e.type}</span>
                  {e.vehicle && (
                    <span className="text-muted-foreground ml-2">
                      <Car className="inline h-3 w-3" /> {e.vehicle.plate}
                    </span>
                  )}
                </span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleRemove(i)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Отмена</Button>
        <Button onClick={handleSubmitAll} disabled={entries.length === 0}>
          Отправить все ({entries.length})
        </Button>
      </div>
    </div>
  );
}

// ─── Import XLS Form ─────────────────────────────────────

function ImportXlsForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (apps: NewApplicationData[]) => void;
  onCancel: () => void;
}) {
  const [imported, setImported] = useState(false);

  const handleImport = () => {
    const demoApps: NewApplicationData[] = [
      { fullName: "Козлов Виктор Петрович", passport: "4510 123456", type: "Технический персонал", position: "Монтажник", phone: "+7 (901) 111-22-33", email: "kozlov@example.com", vehicle: null },
      { fullName: "Белова Светлана Игоревна", passport: "4511 654321", type: "Организатор", position: "Координатор", phone: "+7 (902) 444-55-66", email: "belova@example.com", vehicle: null },
      { fullName: "Орлов Антон Дмитриевич", passport: "4512 789012", type: "Пресса", position: "Фотограф", phone: "+7 (903) 777-88-99", email: "orlov@example.com", vehicle: null },
    ];
    onSubmit(demoApps);
    setImported(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
      <div className="text-center">
        <p className="font-medium">Импорт из Excel</p>
        <p className="text-sm text-muted-foreground">Скачайте шаблон, заполните данные и загрузите файл.</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel}>
          <Download className="mr-1.5 h-4 w-4" />
          Скачать шаблон
        </Button>
        <Button onClick={handleImport}>
          <Upload className="mr-1.5 h-4 w-4" />
          Загрузить файл
        </Button>
      </div>
      {imported ? (
        <p className="text-xs text-green-600 font-medium">Импортировано 3 заявки (демо)</p>
      ) : (
        <p className="text-xs text-muted-foreground">Для демонстрации нажмите &quot;Загрузить файл&quot; (имитация)</p>
      )}
    </div>
  );
}

// ─── Main Dialog ─────────────────────────────────────────

export default function SubmitApplicationDialog({
  open,
  onOpenChange,
  quotas,
  onSubmit,
  eventId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotas: Quota[];
  onSubmit: (apps: NewApplicationData[]) => void;
  eventId?: string;
}) {
  const handleCancel = () => onOpenChange(false);
  const handleSubmit = (apps: NewApplicationData[]) => {
    onSubmit(apps);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Подача заявки на аккредитацию</DialogTitle>
          <DialogDescription>Добавьте сотрудников для аккредитации на мероприятие.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="single">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="single">Одна заявка</TabsTrigger>
            <TabsTrigger value="multiple">Несколько</TabsTrigger>
            <TabsTrigger value="import">Импорт XLS</TabsTrigger>
          </TabsList>
          <TabsContent value="single" className="mt-4">
            <SingleApplicationForm quotas={quotas} onSubmit={handleSubmit} onCancel={handleCancel} eventId={eventId} />
          </TabsContent>
          <TabsContent value="multiple" className="mt-4">
            <MultipleApplicationForm quotas={quotas} onSubmit={handleSubmit} onCancel={handleCancel} />
          </TabsContent>
          <TabsContent value="import" className="mt-4">
            <ImportXlsForm onSubmit={handleSubmit} onCancel={handleCancel} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
