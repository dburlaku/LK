"use client";

import { useState, useMemo, useCallback } from "react";
import { Calendar, Plus, Search, ArrowUpDown, Car, AlertTriangle, MapPin, Clock, FileDown, ParkingCircle, ShieldCheck, Users } from "lucide-react";
import Header from "@/components/header";
import SubmitApplicationDialog, { type NewApplicationData } from "@/components/submit-application-dialog";
import ApplicationDetailDialog from "@/components/application-detail-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getEventById,
  getApplicationsByEventId,
  getEventAccreditationInfo,
  type Application,
} from "@/lib/mock-data";

type SortKey = "fullName" | "submittedAt" | "updatedAt";
type SortDir = "asc" | "desc";

function statusBadgeStyle(status: string) {
  switch (status) {
    case "Аккредитация выдана":
      return "bg-muted text-foreground border-transparent";
    case "Заявка согласована":
      return "bg-muted text-foreground border-transparent";
    case "Заявка отправлена":
      return "bg-green-50 text-green-700 border-green-200";
    case "Заявка отправлена на согласование":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Отклонена":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Отозвана":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "";
  }
}

export default function EventDetailClient({ id }: { id: string }) {
  const event = getEventById(id);
  const accredInfo = getEventAccreditationInfo(id);
  const [applications, setApplications] = useState<Application[]>(() =>
    getApplicationsByEventId(id)
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("fullName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [submitOpen, setSubmitOpen] = useState(false);
  const [detailApp, setDetailApp] = useState<Application | null>(null);
  const [revokeApp, setRevokeApp] = useState<Application | null>(null);

  const handleNewApplications = useCallback(
    (newApps: NewApplicationData[]) => {
      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const created: Application[] = newApps.map((app, i) => ({
        id: `new-${Date.now()}-${i}`,
        eventId: id,
        fullName: app.fullName,
        position: app.position,
        type: app.type,
        status: "Заявка отправлена" as const,
        submittedAt: dateStr,
        updatedAt: dateStr,
        vehiclePass: app.vehicle?.plate ?? null,
        passport: app.passport,
        phone: app.phone,
        email: app.email,
        vehicle: app.vehicle,
        statusHistory: [{ status: "Заявка отправлена", date: dateStr }],
      }));
      setApplications((prev) => [...created, ...prev]);
    },
    [id]
  );

  const handleUpdateApplication = useCallback((updated: Application) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    setDetailApp(null);
  }, []);

  const handleResubmit = useCallback(
    (appData: NewApplicationData) => {
      const now = new Date();
      const dateStr = now.toLocaleString("ru-RU");
      const newApp: Application = {
        id: `resub-${Date.now()}`,
        eventId: id,
        fullName: appData.fullName,
        position: appData.position,
        type: appData.type,
        status: "Заявка отправлена",
        submittedAt: dateStr,
        updatedAt: dateStr,
        vehiclePass: appData.vehicle?.plate ?? null,
        passport: appData.passport,
        phone: appData.phone,
        email: appData.email,
        vehicle: appData.vehicle,
        statusHistory: [{ status: "Заявка отправлена", date: dateStr }],
      };
      setApplications((prev) => [newApp, ...prev]);
      setDetailApp(null);
    },
    [id]
  );

  const handleRevoke = useCallback((appId: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: "Отозвана" as const,
              updatedAt: new Date().toLocaleDateString("ru-RU"),
              statusHistory: [
                { status: "Отозвана", date: new Date().toLocaleString("ru-RU") },
                ...a.statusHistory,
              ],
            }
          : a
      )
    );
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let list = [...applications];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.position.toLowerCase().includes(q) ||
          (a.vehiclePass && a.vehiclePass.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((a) => a.status === statusFilter);
    }

    if (typeFilter !== "all") {
      list = list.filter((a) => a.type === typeFilter);
    }

    list.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = va.localeCompare(vb, "ru");
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [applications, search, statusFilter, typeFilter, sortKey, sortDir]);

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack />
        <main className="container max-w-6xl px-4 py-8">
          <p className="text-muted-foreground">Мероприятие не найдено</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack />

      <main className="container max-w-6xl px-4 py-8 md:px-6">
        {/* Event header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Event logo placeholder */}
            <div className="shrink-0 h-16 w-16 rounded-lg border bg-muted flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="8" width="8" height="8" rx="1" fill="currentColor" opacity="0.2" />
                <rect x="12" y="8" width="8" height="8" rx="1" fill="currentColor" opacity="0.4" />
                <rect x="20" y="8" width="8" height="8" rx="1" fill="currentColor" opacity="0.2" />
                <rect x="4" y="16" width="8" height="8" rx="1" fill="currentColor" opacity="0.4" />
                <rect x="12" y="16" width="8" height="8" rx="1" fill="currentColor" opacity="0.2" />
                <rect x="20" y="16" width="8" height="8" rx="1" fill="currentColor" opacity="0.4" />
                <rect x="4" y="24" width="8" height="8" rx="1" fill="currentColor" opacity="0.2" />
                <rect x="12" y="24" width="8" height="8" rx="1" fill="currentColor" opacity="0.4" />
                <rect x="20" y="24" width="8" height="8" rx="1" fill="currentColor" opacity="0.2" />
                <path d="M34 12L42 20L34 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                <text x="16" y="42" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="sans-serif" fontWeight="700" opacity="0.4">LOGO</text>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{event.name}</h1>
              <div className="mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {event.date}
                </span>
                <Badge
                  variant="outline"
                  className={
                    event.status === "Актуальное"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : ""
                  }
                >
                  {event.status}
                </Badge>
              </div>
            </div>
          </div>
          {event.status === "Актуальное" && (
            <Button onClick={() => setSubmitOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Подать заявку
            </Button>
          )}
        </div>

        {/* Quotas */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {event.quotas.map((q) => (
            <div key={q.type} className="rounded-lg border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{q.type}</span>
                <span className="font-bold">
                  {q.current}/{q.max}
                </span>
              </div>
              <Progress
                value={(q.current / q.max) * 100}
                className="mt-2 h-2"
              />
            </div>
          ))}
        </div>

        {/* Accreditation center info */}
        {accredInfo && (
          <Card className="mt-6 border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                {accredInfo.centerName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">Место</p>
                  <p className="text-sm text-muted-foreground">{accredInfo.location}</p>
                </div>
              </div>

              {/* Working hours */}
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">Режим работы Центра</p>
                  <div className="mt-1 space-y-0.5">
                    {accredInfo.workingHours.map((wh, i) => (
                      <div key={i} className="flex items-baseline gap-2 text-sm text-muted-foreground">
                        <span>{wh.days}:</span>
                        <span className="font-medium text-foreground">{wh.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">Для получения аккредитации необходимо</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground list-disc list-inside">
                    {accredInfo.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Данные на аккредитации: {accredInfo.badgeData}
                  </p>
                </div>
              </div>

              {/* Who can receive */}
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">Кто может получить аккредитацию</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground list-disc list-inside">
                    {accredInfo.whoCanReceive.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Parking */}
              <div className="flex items-start gap-3">
                <ParkingCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">Информация о парковке</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground list-disc list-inside">
                    {accredInfo.parking.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                  {/* Parking scheme download */}
                  {accredInfo.documents.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {accredInfo.documents.map((doc, i) => (
                        <Button key={i} variant="outline" size="sm">
                          <FileDown className="mr-1.5 h-4 w-4" />
                          {doc.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Applications table */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">
            Заявки на аккредитацию
          </h2>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по ФИО, должности, номеру авто..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="Заявка отправлена">Отправлена</SelectItem>
                <SelectItem value="Заявка отправлена на согласование">На согласовании</SelectItem>
                <SelectItem value="Заявка согласована">Согласована</SelectItem>
                <SelectItem value="Аккредитация выдана">Аккредитация выд.</SelectItem>
                <SelectItem value="Отклонена">Отклонена</SelectItem>
                <SelectItem value="Отозвана">Отозвана</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="Организатор">Организатор</SelectItem>
                <SelectItem value="Технический персонал">Тех. персонал</SelectItem>
                <SelectItem value="Пресса">Пресса</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => toggleSort("fullName")}>
                      ФИО
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => toggleSort("submittedAt")}>
                      Дата подачи
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => toggleSort("updatedAt")}>
                      Дата изменения
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead>РВСТ</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Заявки не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((app) => (
                    <TableRow
                      key={app.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setDetailApp(app)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{app.fullName}</div>
                          <div className="text-xs text-muted-foreground">
                            {app.position}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{app.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className={statusBadgeStyle(app.status)}>
                            {app.status}
                          </Badge>
                          {app.status === "Отклонена" && app.rejectionReason && (
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertTriangle className="h-4 w-4 text-orange-500 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p className="text-xs">{app.rejectionReason}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{app.submittedAt}</TableCell>
                      <TableCell className="text-sm">{app.updatedAt}</TableCell>
                      <TableCell className="text-sm">
                        {app.vehiclePass ? (
                          <span className="flex items-center gap-1">
                            <Car className="h-3.5 w-3.5 text-muted-foreground" />
                            {app.vehiclePass}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">&mdash;</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {(app.status === "Заявка отправлена" ||
                          app.status === "Заявка отправлена на согласование" ||
                          app.status === "Заявка согласована") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRevokeApp(app);
                            }}
                          >
                            Отозвать
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Submit application dialog */}
      <SubmitApplicationDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        quotas={event.quotas}
        onSubmit={handleNewApplications}
      />

      {/* Application detail dialog */}
      <ApplicationDetailDialog
        application={detailApp}
        open={!!detailApp}
        onOpenChange={(open) => {
          if (!open) setDetailApp(null);
        }}
        onUpdate={handleUpdateApplication}
        onResubmit={handleResubmit}
        quotas={event.quotas}
      />

      {/* Revoke confirmation */}
      <AlertDialog
        open={!!revokeApp}
        onOpenChange={(open) => {
          if (!open) setRevokeApp(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Вы уверены, что хотите отозвать заявку?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Это действие необратимо. Статус заявки для сотрудника{" "}
              <strong>{revokeApp?.fullName}</strong> будет изменен на
              &quot;Отозвана&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (revokeApp) handleRevoke(revokeApp.id);
                setRevokeApp(null);
              }}
            >
              Отозвать заявку
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
