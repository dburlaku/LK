"use client";

import { MapPin, Clock, ShieldCheck, Users, ParkingCircle, FileDown, Mail } from "lucide-react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getEventById,
  getEventAccreditationInfo,
  mockHelpArticles,
  mockDocuments,
} from "@/lib/mock-data";

export default function MemoClient({ id }: { id: string }) {
  const event = getEventById(id);
  const accredInfo = getEventAccreditationInfo(id);

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack />
        <main className="container max-w-3xl px-4 py-8">
          <p className="text-muted-foreground">Мероприятие не найдено</p>
        </main>
      </div>
    );
  }

  if (!accredInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack />
        <main className="container max-w-3xl px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Памятка для участника мероприятия</h1>
          <p className="text-muted-foreground">Информация о центре аккредитации для данного мероприятия пока не опубликована.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack />
      <main className="container max-w-3xl px-4 py-8 md:px-6">
        <h1 className="text-2xl font-bold mb-1">Памятка для участника мероприятия</h1>
        <p className="text-muted-foreground mb-6">{event.name}</p>

        <Card className="border-blue-200 bg-blue-50/50">
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

        {/* FAQ */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Часто задаваемые вопросы</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {mockHelpArticles.map((article, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-sm">
                    {article.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {article.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Документы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDocuments.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 ml-4">
                    <FileDown className="mr-1.5 h-4 w-4" />
                    Скачать
                  </Button>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="rounded-lg border border-dashed p-4">
              <p className="text-sm font-medium mb-1">Заказ предпечати бейджей</p>
              <p className="text-sm text-muted-foreground mb-3">
                Для заказа предпечати отправьте список сотрудников на email:{" "}
                <span className="font-medium text-foreground">v.mikhailova@drive-igora.ru</span>{" "}
                с темой письма «Предпечать — [Название мероприятия]» не позднее чем за 5 рабочих дней до начала мероприятия.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:v.mikhailova@drive-igora.ru?subject=Предпечать">
                  <Mail className="mr-1.5 h-4 w-4" />
                  Написать на v.mikhailova@drive-igora.ru
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
