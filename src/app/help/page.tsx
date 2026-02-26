"use client";

import { Phone, Mail, User, FileDown } from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mockHelpArticles, mockDocuments } from "@/lib/mock-data";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl px-4 py-8 md:px-6">
        <h1 className="mb-6 text-3xl font-bold">Справка</h1>

        {/* Curator Contact */}
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

        {/* FAQ */}
        <Card className="mb-6">
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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Документы</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Шаблоны доверенностей и другие типовые документы для скачивания.
            </p>
            <div className="space-y-3">
              {mockDocuments.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.description}
                    </p>
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
