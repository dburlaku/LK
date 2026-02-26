import { mockEvents } from "@/lib/mock-data";
import MemoClient from "./client";

export function generateStaticParams() {
  return mockEvents.map((e) => ({ id: e.id }));
}

export default function MemoPage({
  params,
}: {
  params: { id: string };
}) {
  return <MemoClient id={params.id} />;
}
