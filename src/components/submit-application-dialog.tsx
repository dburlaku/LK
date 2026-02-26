"use client";

import { useState } from "react";
import { Plus, FileSpreadsheet, Download, Upload } from "lucide-react";
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
import type { Quota } from "@/lib/mock-data";

function SingleApplicationForm({ quotas }: { quotas: Quota[] }) {
  const [needVehicle, setNeedVehicle] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>ФИО Сотрудника *</Label>
          <Input placeholder="Иванов Иван Иванович" />
        </div>
        <div className="space-y-2">
          <Label>Паспортные данные *</Label>
          <Input placeholder="0000 000000" />
          <p className="text-xs text-muted-foreground">Серия и номер через пробел</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Тип аккредитации *</Label>
          <Select>
            <SelectTrigger className="w-full">
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
        </div>
        <div className="space-y-2">
          <Label>Должность</Label>
          <Input />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Телефон *</Label>
          <Input placeholder="+7" />
        </div>
        <div className="space-y-2">
          <Label>E-mail</Label>
          <Input type="email" />
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
              <Input />
            </div>
            <div className="space-y-2">
              <Label>Модель</Label>
              <Input />
            </div>
            <div className="space-y-2">
              <Label>Гос. номер</Label>
              <Input placeholder="А000АА" />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline">Отмена</Button>
        <Button>Отправить заявку</Button>
      </div>
    </div>
  );
}

function MultipleApplicationForm({ quotas }: { quotas: Quota[] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4 space-y-4">
        <p className="font-medium">Добавить сотрудника</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Input placeholder="ФИО *" />
          </div>
          <div className="space-y-2">
            <Input placeholder="Паспорт *" />
            <p className="text-xs text-muted-foreground text-right">10 цифр</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="+7" />
          <Input placeholder="Email" />
        </div>
        <div className="flex items-center justify-between">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Организатор" />
            </SelectTrigger>
            <SelectContent>
              {quotas.map((q) => (
                <SelectItem key={q.type} value={q.type}>
                  {q.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Добавить
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline">Отмена</Button>
        <Button>Отправить все</Button>
      </div>
    </div>
  );
}

function ImportXlsForm() {
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
        <Button variant="outline">
          <Download className="mr-1.5 h-4 w-4" />
          Скачать шаблон
        </Button>
        <Button>
          <Upload className="mr-1.5 h-4 w-4" />
          Загрузить файл
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Для демонстрации нажмите &quot;Загрузить файл&quot; (имитация)
      </p>
    </div>
  );
}

export default function SubmitApplicationDialog({
  open,
  onOpenChange,
  quotas,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotas: Quota[];
}) {
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
            <SingleApplicationForm quotas={quotas} />
          </TabsContent>

          <TabsContent value="multiple" className="mt-4">
            <MultipleApplicationForm quotas={quotas} />
          </TabsContent>

          <TabsContent value="import" className="mt-4">
            <ImportXlsForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
