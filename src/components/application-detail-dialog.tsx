"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Application } from "@/lib/mock-data";

function statusBadgeVariant(status: string) {
  switch (status) {
    case "Аккредитация выдана":
      return "outline" as const;
    case "Заявка согласована":
      return "secondary" as const;
    case "Заявка отправлена":
      return "default" as const;
    default:
      return "destructive" as const;
  }
}

export default function ApplicationDetailDialog({
  application,
  open,
  onOpenChange,
}: {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
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
                <p className="mb-2 text-sm font-medium">
                  Разрешение на въезд и стоянку (РВСТ)
                </p>
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
                    <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                    <span className="text-sm">{entry.status}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{entry.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2">
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
