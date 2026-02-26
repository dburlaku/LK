export type AccreditationType = "Организатор" | "Технический персонал" | "Пресса";

export type ApplicationStatus =
  | "Заявка отправлена"
  | "Заявка согласована"
  | "Аккредитация выдана"
  | "Отозвана";

export type EventStatus = "Актуальное" | "Прошедшее";

export interface Quota {
  type: AccreditationType;
  current: number;
  max: number;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  status: EventStatus;
  quotas: Quota[];
}

export interface VehicleInfo {
  brand: string;
  model: string;
  plate: string;
}

export interface StatusHistoryEntry {
  status: string;
  date: string;
}

export interface Application {
  id: string;
  eventId: string;
  fullName: string;
  position: string;
  type: AccreditationType;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  vehiclePass: string | null;
  passport: string;
  phone: string;
  email: string;
  vehicle: VehicleInfo | null;
  statusHistory: StatusHistoryEntry[];
}

export const mockEvents: Event[] = [
  {
    id: "1",
    name: "Фестиваль Еда и Напитки",
    date: "01.07.2025",
    status: "Актуальное",
    quotas: [
      { type: "Технический персонал", current: 0, max: 10 },
    ],
  },
  {
    id: "2",
    name: "Международный форум Технологии Будущего",
    date: "15.06.2025",
    status: "Актуальное",
    quotas: [
      { type: "Организатор", current: 2, max: 5 },
      { type: "Технический персонал", current: 15, max: 20 },
      { type: "Пресса", current: 1, max: 10 },
    ],
  },
  {
    id: "3",
    name: "Конференция StartUp 2024",
    date: "20.11.2024",
    status: "Прошедшее",
    quotas: [
      { type: "Организатор", current: 3, max: 5 },
      { type: "Технический персонал", current: 10, max: 10 },
    ],
  },
];

function makeApp(
  id: string,
  eventId: string,
  fullName: string,
  position: string,
  type: AccreditationType,
  status: ApplicationStatus,
  vehiclePass: string | null,
  vehicle: VehicleInfo | null,
): Application {
  const history: StatusHistoryEntry[] = [
    { status: "Заявка отправлена", date: "20.05.2025, 10:00:00" },
  ];
  if (status !== "Заявка отправлена") {
    history.unshift({ status: "Заявка согласована", date: "21.05.2025, 14:00:00" });
  }
  if (status === "Аккредитация выдана") {
    history.unshift({ status: "Аккредитация выдана", date: "01.06.2025, 09:00:00" });
  }
  return {
    id,
    eventId,
    fullName,
    position,
    type,
    status,
    submittedAt: "20.05.2025 10:00",
    updatedAt: "01.06.2025",
    vehiclePass,
    passport: "0000 000000",
    phone: "+7 (900) 000-00-00",
    email: "email@example.com",
    vehicle,
    statusHistory: history,
  };
}

const car: VehicleInfo = { brand: "Toyota", model: "Camry", plate: "A000AA77" };

export const mockApplications: Application[] = [
  makeApp("a1", "2", "Петрова Анна Сергеевна", "Менеджер", "Организатор", "Заявка отправлена", null, null),
  makeApp("a2", "2", "Смирнов Алексей", "Координатор", "Организатор", "Аккредитация выдана", null, null),
  makeApp("a3", "2", "Иванов Иван Иванович", "Инженер", "Технический персонал", "Аккредитация выдана", "А000АА77", car),
  makeApp("a4", "2", "Сидоров Петр", "Электрик", "Технический персонал", "Заявка согласована", null, null),
  makeApp("a5", "2", "Кузнецова Мария", "Звукорежиссер", "Технический персонал", "Аккредитация выдана", null, null),
  makeApp("a6", "2", "Попов Дмитрий", "Осветитель", "Технический персонал", "Аккредитация выдана", null, null),
  makeApp("a7", "2", "Васильева Елена", "Администратор", "Технический персонал", "Заявка согласована", null, null),
  makeApp("a8", "2", "Соколов Артем", "Грузчик", "Технический персонал", "Заявка отправлена", null, null),
  makeApp("a9", "2", "Михайлов Олег", "Водитель", "Технический персонал", "Аккредитация выдана", "А000АА77", car),
  makeApp("a10", "2", "Новикова Ирина", "Официант", "Технический персонал", "Заявка согласована", null, null),
  makeApp("a11", "2", "Федоров Андрей", "Техник сцены", "Технический персонал", "Аккредитация выдана", null, null),
  makeApp("a12", "2", "Морозов Максим", "Стропальщик", "Технический персонал", "Заявка отправлена", null, null),
  makeApp("a13", "2", "Волкова Ольга", "Кассир", "Технический персонал", "Заявка согласована", null, null),
  makeApp("a14", "2", "Лебедев Павел", "Охранник", "Технический персонал", "Аккредитация выдана", "А000АА77", car),
  makeApp("a15", "2", "Алексеев Денис", "Монтажник", "Технический персонал", "Аккредитация выдана", null, null),
  makeApp("a16", "2", "Степанова Наталья", "Журналист РБК", "Пресса", "Аккредитация выдана", null, null),
  makeApp("a17", "2", "Семенов Сергей", "Сантехник", "Технический персонал", "Заявка отправлена", null, null),
  makeApp("a18", "2", "Егорова Татьяна", "Уборщица", "Технический персонал", "Заявка согласована", null, null),
];

export function getEventById(id: string): Event | undefined {
  return mockEvents.find((e) => e.id === id);
}

export function getApplicationsByEventId(eventId: string): Application[] {
  return mockApplications.filter((a) => a.eventId === eventId);
}
