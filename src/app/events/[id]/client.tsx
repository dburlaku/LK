"use client";

import { useState, useMemo } from "react";
import { Calendar, Plus, Search, ArrowUpDown, Car } from "lucide-react";
import Header from "@/components/header";
import SubmitApplicationDialog from "@/components/submit-application-dialog";
import ApplicationDetailDialog from "@/components/application-detail-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  getEventById,
  getApplicationsByEventId,
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
    case "Отозвана":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "";
  }
}

export default function EventDetailClient({ id }: { id: string }) {
  const event = getEventById(id);
  const allApplications = getApplicationsByEventId(id);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("fullName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [submitOpen, setSubmitOpen] = useState(false);
  const [detailApp, setDetailApp] = useState<Application | null>(null);
  const [revokeApp, setRevokeApp] = useState<Application | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let list = [...allApplications];

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
  }, [allApplications, search, statusFilter, typeFilter, sortKey, sortDir]);

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
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="Заявка отправлена">Заявка отправлена</SelectItem>
                <SelectItem value="Заявка согласована">Заявка согласована</SelectItem>
                <SelectItem value="Аккредитация выдана">Аккредитация выд.</SelectItem>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 gap-1"
                      onClick={() => toggleSort("fullName")}
                    >
                      ФИО
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 gap-1"
                      onClick={() => toggleSort("submittedAt")}
                    >
                      Дата подачи
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 gap-1"
                      onClick={() => toggleSort("updatedAt")}
                    >
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
                        <Badge
                          variant="outline"
                          className={statusBadgeStyle(app.status)}
                        >
                          {app.status}
                        </Badge>
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
      />

      {/* Application detail dialog */}
      <ApplicationDetailDialog
        application={detailApp}
        open={!!detailApp}
        onOpenChange={(open) => {
          if (!open) setDetailApp(null);
        }}
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
              onClick={() => setRevokeApp(null)}
            >
              Отозвать заявку
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
