"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockEvents, type Event } from "@/lib/mock-data";

function EventCard({ event }: { event: Event }) {
  const isPast = event.status === "Прошедшее";

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{event.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {event.date}
            </div>
          </div>
          <Badge
            variant={isPast ? "secondary" : "outline"}
            className={
              isPast
                ? ""
                : "border-green-200 bg-green-50 text-green-700"
            }
          >
            {event.status}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          {event.quotas.map((q) => (
            <div key={q.type} className="text-muted-foreground">
              {q.type}:{" "}
              <span className="font-medium text-foreground">
                {q.current} / {q.max}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button asChild variant={isPast ? "outline" : "default"}>
            <Link href={`/events/${event.id}`}>
              {isPast ? "Посмотреть заявки" : "Перейти к заявкам"}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EventsPage() {
  const [tab, setTab] = useState<string>("active");

  const activeEvents = mockEvents.filter((e) => e.status === "Актуальное");
  const pastEvents = mockEvents.filter((e) => e.status === "Прошедшее");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl px-4 py-8 md:px-6">
        <h1 className="mb-6 text-3xl font-bold">Мероприятия</h1>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full max-w-md grid grid-cols-2">
            <TabsTrigger value="active">Актуальные</TabsTrigger>
            <TabsTrigger value="past">Прошедшие</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 space-y-4">
            {activeEvents.length === 0 ? (
              <p className="text-muted-foreground">Нет актуальных мероприятий</p>
            ) : (
              activeEvents.map((e) => <EventCard key={e.id} event={e} />)
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6 space-y-4">
            {pastEvents.length === 0 ? (
              <p className="text-muted-foreground">Нет прошедших мероприятий</p>
            ) : (
              pastEvents.map((e) => <EventCard key={e.id} event={e} />)
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
