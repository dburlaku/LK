import { mockEvents } from "@/lib/mock-data";
import EventDetailClient from "./client";

export function generateStaticParams() {
  return mockEvents.map((e) => ({ id: e.id }));
}

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <EventDetailClient id={params.id} />;
}
