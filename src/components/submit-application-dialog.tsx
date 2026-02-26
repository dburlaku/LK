"use client";

import { useState } from "react";
import { Plus, FileSpreadsheet, Download, Upload, X } from "lucide-react";
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
import type { Quota, AccreditationType, VehicleInfo } from "@/lib/mock-data";

export interface NewApplicationData {
  fullName: string;
  passport: string;
  type: AccreditationType;
  position: string;
  phone: string;
  email: string;
  vehicle: VehicleInfo | null;
}

function SingleApplicationForm({
  quotas,
  onSubmit,
  onCancel,
}: {
  quotas: Quota[];
  onSubmit: (apps: NewApplicationData[]) => void;
  onCancel: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [passport, setPassport] = useState("");
  const [type, setType] = useState<string>("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [needVehicle, setNeedVehicle] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    if (!fullName.trim()) newErrors.fullName = true;
    if (!passport.trim()) newErrors.passport = true;
    if (!type) newErrors.type = true;
    if (!phone.trim()) newErrors.phone = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit([
      {
        fullName: fullName.trim(),
        passport: passport.trim(),
        type: type as AccreditationType,
        position: position.trim(),
        phone: phone.trim(),
        email: email.trim(),
        vehicle:
          needVehicle && (brand.trim() || model.trim() || plate.trim())
            ? { brand: brand.trim(), model: model.trim(), plate: plate.trim() }
            : null,
      },
    ]);

    // Reset form
    setFullName("");
    setPassport("");
    setType("");
    setPosition("");
    setPhone("");
    setEmail("");
    setNeedVehicle(false);
    setBrand("");
    setModel("");
    setPlate("");
    setErrors({});
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>ФИО Сотрудника *</Label>
          <Input
            placeholder="Иванов Иван Иванович"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setErrors((p) => ({ ...p, fullName: false }));
            }}
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500">Обязательное поле</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Паспортные данные *</Label>
          <Input
            placeholder="0000 000000"
            value={passport}
            onChange={(e) => {
              setPassport(e.target.value);
              setErrors((p) => ({ ...p, passport: false }));
            }}
            className={errors.passport ? "border-red-500" : ""}
          />
          <p className="text-xs text-muted-foreground">
            Серия и номер через пробел
          </p>
          {errors.passport && (
            <p className="text-xs text-red-500">Обязательное поле</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Тип аккредитации *</Label>
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v);
              setErrors((p) => ({ ...p, type: false }));
            }}
          >
            <SelectTrigger
              className={`w-full ${errors.type ? "border-red-500" : ""}`}
            >
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
          {errors.type && (
            <p className="text-xs text-red-500">Выберите тип</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Должность</Label>
          <Input value={position} onChange={(e) => setPosition(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Телефон *</Label>
          <Input
            placeholder="+7"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors((p) => ({ ...p, phone: false }));
            }}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">Обязательное поле</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>E-mail</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="vehicle"
            checked={needVehicle}
            onCheckedChange={(v) => setNeedVehicle(v === true)}
          />
          <Label htmlFor="vehicle" className="cursor-pointer">
            Требуется Разрешение на въезд и стоянку (РВСТ)
          </Label>
        </div>

        {needVehicle && (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Марка</Label>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Модель</Label>
              <Input value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Гос. номер</Label>
              <Input
                placeholder="А000АА"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button onClick={handleSubmit}>Отправить заявку</Button>
      </div>
    </div>
  );
}

interface MultiEntry {
  fullName: string;
  passport: string;
  phone: string;
  email: string;
  type: AccreditationType;
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
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<string>(quotas[0]?.type ?? "");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!fullName.trim() || !passport.trim()) {
      setError("ФИО и паспорт обязательны");
      return;
    }
    setEntries((prev) => [
      ...prev,
      {
        fullName: fullName.trim(),
        passport: passport.trim(),
        phone: phone.trim(),
        email: email.trim(),
        type: type as AccreditationType,
      },
    ]);
    setFullName("");
    setPassport("");
    setPhone("");
    setEmail("");
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
        vehicle: null,
      }))
    );
    setEntries([]);
    setError("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4 space-y-4">
        <p className="font-medium">Добавить сотрудника</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Input
              placeholder="ФИО *"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Паспорт *"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
            />
            <p className="text-xs text-muted-foreground text-right">
              10 цифр
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="+7"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Тип" />
            </SelectTrigger>
            <SelectContent>
              {quotas.map((q) => (
                <SelectItem key={q.type} value={q.type}>
                  {q.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Добавить
          </Button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {entries.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Добавлено: {entries.length}
          </p>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {entries.map((e, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded border px-3 py-2 text-sm"
              >
                <span>
                  {e.fullName}{" "}
                  <span className="text-muted-foreground">— {e.type}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleRemove(i)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button onClick={handleSubmitAll} disabled={entries.length === 0}>
          Отправить все ({entries.length})
        </Button>
      </div>
    </div>
  );
}

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
      {
        fullName: "Козлов Виктор Петрович",
        passport: "4510 123456",
        type: "Технический персонал",
        position: "Монтажник",
        phone: "+7 (901) 111-22-33",
        email: "kozlov@example.com",
        vehicle: null,
      },
      {
        fullName: "Белова Светлана Игоревна",
        passport: "4511 654321",
        type: "Организатор",
        position: "Координатор",
        phone: "+7 (902) 444-55-66",
        email: "belova@example.com",
        vehicle: null,
      },
      {
        fullName: "Орлов Антон Дмитриевич",
        passport: "4512 789012",
        type: "Пресса",
        position: "Фотограф",
        phone: "+7 (903) 777-88-99",
        email: "orlov@example.com",
        vehicle: null,
      },
    ];
    onSubmit(demoApps);
    setImported(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
      <div className="text-center">
        <p className="font-medium">Импорт из Excel</p>
        <p className="text-sm text-muted-foreground">
          Скачайте шаблон, заполните данные о сотрудниках и загрузите файл.
        </p>
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
        <p className="text-xs text-green-600 font-medium">
          Импортировано 3 заявки (демо)
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Для демонстрации нажмите &quot;Загрузить файл&quot; (имитация)
        </p>
      )}
    </div>
  );
}

export default function SubmitApplicationDialog({
  open,
  onOpenChange,
  quotas,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotas: Quota[];
  onSubmit: (apps: NewApplicationData[]) => void;
}) {
  const handleCancel = () => onOpenChange(false);

  const handleSubmit = (apps: NewApplicationData[]) => {
    onSubmit(apps);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Подача заявки на аккредитацию</DialogTitle>
          <DialogDescription>
            Добавьте сотрудников для аккредитации на мероприятие.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="single">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="single">Одна заявка</TabsTrigger>
            <TabsTrigger value="multiple">Несколько</TabsTrigger>
            <TabsTrigger value="import">Импорт XLS</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-4">
            <SingleApplicationForm
              quotas={quotas}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="multiple" className="mt-4">
            <MultipleApplicationForm
              quotas={quotas}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="import" className="mt-4">
            <ImportXlsForm onSubmit={handleSubmit} onCancel={handleCancel} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
