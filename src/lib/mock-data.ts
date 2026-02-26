export type AccreditationType = "Организатор" | "Технический персонал" | "Пресса";

export type ApplicationStatus =
  | "Заявка отправлена"
  | "Заявка отправлена на согласование"
  | "Заявка согласована"
  | "Аккредитация выдана"
  | "Отклонена"
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
  rejectionReason?: string;
}

export interface CompanyProfile {
  name: string;
  inn: string;
  representative: string;
  phone: string;
  email: string;
}

export interface HelpArticle {
  question: string;
  answer: string;
}

export interface DocumentTemplate {
  name: string;
  description: string;
  filename: string;
}

export interface WorkingHoursEntry {
  days: string;
  hours: string;
}

export interface EventAccreditationInfo {
  centerName: string;
  location: string;
  workingHours: WorkingHoursEntry[];
  requirements: string[];
  badgeData: string;
  whoCanReceive: string[];
  parking: string[];
  documents: DocumentTemplate[];
}

// ─── Events ──────────────────────────────────────────────

export const mockEvents: Event[] = [
  {
    id: "3",
    name: 'Фестиваль «Мото Драйв» 2026',
    date: "6–7 июня 2026",
    status: "Актуальное",
    quotas: [
      { type: "Организатор", current: 1, max: 4 },
      { type: "Технический персонал", current: 5, max: 15 },
      { type: "Пресса", current: 0, max: 8 },
    ],
  },
  {
    id: "2",
    name: "GARAGE FEST Игора Драйв 2026",
    date: "18–19 июля 2026",
    status: "Актуальное",
    quotas: [
      { type: "Организатор", current: 2, max: 5 },
      { type: "Технический персонал", current: 12, max: 20 },
      { type: "Пресса", current: 1, max: 10 },
    ],
  },
  {
    id: "1",
    name: "GARAGE FEST Игора Драйв 2025",
    date: "2025",
    status: "Прошедшее",
    quotas: [
      { type: "Организатор", current: 5, max: 5 },
      { type: "Технический персонал", current: 10, max: 10 },
      { type: "Пресса", current: 3, max: 5 },
    ],
  },
];

// ─── Applications ────────────────────────────────────────

function makeApp(
  id: string,
  eventId: string,
  fullName: string,
  position: string,
  type: AccreditationType,
  status: ApplicationStatus,
  vehiclePass: string | null,
  vehicle: VehicleInfo | null,
  rejectionReason?: string,
): Application {
  const history: StatusHistoryEntry[] = [
    { status: "Заявка отправлена", date: "10.05.2026, 10:00:00" },
  ];
  if (
    status !== "Заявка отправлена" &&
    status !== "Заявка отправлена на согласование"
  ) {
    history.unshift({ status: "Заявка согласована", date: "12.05.2026, 14:00:00" });
  }
  if (status === "Аккредитация выдана") {
    history.unshift({ status: "Аккредитация выдана", date: "01.06.2026, 09:00:00" });
  }
  if (status === "Отклонена") {
    history.unshift({
      status: "Отклонена",
      date: "13.05.2026, 11:30:00",
    });
  }
  return {
    id,
    eventId,
    fullName,
    position,
    type,
    status,
    submittedAt: "10.05.2026 10:00",
    updatedAt: "01.06.2026",
    vehiclePass,
    passport: "4510 123456",
    phone: "+7 (900) 000-00-00",
    email: "email@example.com",
    vehicle,
    statusHistory: history,
    rejectionReason,
  };
}

const car: VehicleInfo = { brand: "Toyota", model: "Camry", plate: "A000AA 77" };

export const mockApplications: Application[] = [
  // Event 2 — GARAGE FEST 2026
  makeApp("a1", "2", "Петрова Анна Сергеевна", "Менеджер", "Организатор", "Заявка отправлена", null, null),
  makeApp("a2", "2", "Смирнов Алексей Дмитриевич", "Координатор", "Организатор", "Аккредитация выдана", null, null),
  makeApp("a3", "2", "Иванов Иван Иванович", "Инженер", "Технический персонал", "Аккредитация выдана", "A000AA 77", car),
  makeApp("a4", "2", "Сидоров Петр Васильевич", "Электрик", "Технический персонал", "Заявка согласована", null, null),
  makeApp("a5", "2", "Кузнецова Мария Олеговна", "Звукорежиссер", "Технический персонал", "Аккредитация выдана", null, null),
  makeApp("a6", "2", "Попов Дмитрий Андреевич", "Осветитель", "Технический персонал", "Аккредитация выдана", null, null),
  makeApp("a7", "2", "Васильева Елена Николаевна", "Администратор", "Технический персонал", "Заявка согласована", null, null),
  makeApp("a8", "2", "Соколов Артем Игоревич", "Грузчик", "Технический персонал", "Заявка отправлена", null, null),
  makeApp("a9", "2", "Михайлов Олег Сергеевич", "Водитель", "Технический персонал", "Аккредитация выдана", "B123BC 78", { brand: "Ford", model: "Transit", plate: "B123BC 78" }),
  makeApp("a10", "2", "Новикова Ирина Павловна", "Официант", "Технический персонал", "Отклонена", null, null, "Некорректные паспортные данные: серия не соответствует региону"),
  makeApp("a11", "2", "Федоров Андрей Викторович", "Техник сцены", "Технический персонал", "Аккредитация выдана", null, null),
  makeApp("a12", "2", "Морозов Максим Романович", "Стропальщик", "Технический персонал", "Заявка отправлена", null, null),
  makeApp("a13", "2", "Волкова Ольга Александровна", "Кассир", "Технический персонал", "Заявка согласована", null, null),
  makeApp("a14", "2", "Лебедев Павел Михайлович", "Охранник", "Технический персонал", "Аккредитация выдана", "C456CD 47", { brand: "Hyundai", model: "Solaris", plate: "C456CD 47" }),
  makeApp("a15", "2", "Алексеев Денис Юрьевич", "Монтажник", "Технический персонал", "Аккредитация выдана", null, null),
  makeApp("a16", "2", "Степанова Наталья Евгеньевна", "Журналист", "Пресса", "Аккредитация выдана", null, null),
  makeApp("a17", "2", "Семенов Сергей Владимирович", "Сантехник", "Технический персонал", "Отклонена", null, null, "Должность не соответствует типу аккредитации"),
  makeApp("a18", "2", "Егорова Татьяна Борисовна", "Уборщица", "Технический персонал", "Заявка согласована", null, null),

  // Event 3 — Мото Драйв 2026
  makeApp("b1", "3", "Козлов Виктор Петрович", "Монтажник", "Технический персонал", "Заявка отправлена", null, null),
  makeApp("b2", "3", "Белова Светлана Игоревна", "Координатор", "Организатор", "Заявка согласована", null, null),
  makeApp("b3", "3", "Орлов Антон Дмитриевич", "Фотограф", "Пресса", "Заявка отправлена", null, null),
  makeApp("b4", "3", "Горбунова Ирина Сергеевна", "Инженер звука", "Технический персонал", "Аккредитация выдана", null, null),
  makeApp("b5", "3", "Тихонов Роман Александрович", "Водитель", "Технический персонал", "Аккредитация выдана", "E789EE 78", { brand: "GAZelle", model: "Next", plate: "E789EE 78" }),

  // Event 1 — GARAGE FEST 2025 (past)
  makeApp("c1", "1", "Николаев Кирилл Дмитриевич", "Монтажник", "Технический персонал", "Аккредитация выдана", null, null),
  makeApp("c2", "1", "Панова Екатерина Сергеевна", "Координатор", "Организатор", "Аккредитация выдана", null, null),
  makeApp("c3", "1", "Жуков Артём Олегович", "Оператор", "Пресса", "Аккредитация выдана", null, null),
];

// ─── Company Profile ─────────────────────────────────────

export const mockCompanyProfile: CompanyProfile = {
  name: 'ООО "ГигаСтрой"',
  inn: "7812345678",
  representative: "Сидоров Иван Петрович",
  phone: "+7 (812) 555-00-00",
  email: "info@gigastroy.ru",
};

// ─── Help & Documents ────────────────────────────────────

export const mockHelpArticles: HelpArticle[] = [
  {
    question: "Режим работы центра аккредитации",
    answer:
      "Информация о центре аккредитации доступна на странице каждого мероприятия — место, режим работы и парковка указаны индивидуально для каждого события.",
  },
  {
    question: "Как заказать предпечать бейджей в центре аккредитации?",
    answer:
      "Для заказа предпечати бейджей необходимо подать заявку не позднее чем за 5 рабочих дней до начала мероприятия. Отправьте список сотрудников (ФИО, должность, тип аккредитации) на email: v.mikhailova@drive-igora.ru с темой письма «Предпечать — [Название мероприятия]». Готовые бейджи можно забрать в центре аккредитации в день мероприятия.",
  },
  {
    question: "Как получить доверенность на получение бейджей за других лиц?",
    answer:
      "Скачайте шаблон доверенности в разделе «Документы» ниже. Заполните все поля, заверьте подписью и печатью организации. Предъявите оригинал доверенности и паспорт при получении бейджей в центре аккредитации.",
  },
  {
    question: "Какие статусы может иметь заявка?",
    answer:
      "Заявка отправлена — заявка создана и ожидает рассмотрения. Заявка отправлена на согласование — заявка отредактирована и отправлена повторно. Заявка согласована — заявка одобрена куратором. Аккредитация выдана — бейдж готов к получению. Отклонена — заявка отклонена с указанием причины (можно исправить и подать повторно). Отозвана — заявка отозвана подрядчиком.",
  },
  {
    question: "Что делать, если заявка отклонена?",
    answer:
      "Откройте карточку отклонённой заявки — причина отклонения будет выделена визуально. Нажмите «Исправить и отправить» — форма будет предзаполнена данными из отклонённой заявки, а поле с ошибкой подсвечено. Исправьте данные и отправьте заявку повторно. Старая заявка останется в истории со статусом «Отклонена».",
  },
  {
    question: "Как связаться с куратором?",
    answer:
      "Ваш куратор — Иванова Мария Александровна. Телефон: +7 (812) 600-00-01. Email: v.mikhailova@drive-igora.ru. Время работы: Пн–Пт, 9:00–18:00 (МСК).",
  },
];

export const mockDocuments: DocumentTemplate[] = [
  {
    name: "Доверенность на получение бейджей",
    description: "Шаблон доверенности для получения бейджей аккредитации за других лиц",
    filename: "doverennost_badge.docx",
  },
];

// ─── Event Accreditation Info ────────────────────────────

const eventAccreditationInfo: Record<string, EventAccreditationInfo> = {
  "2": {
    centerName: "Центр аккредитации GARAGE FEST 2026",
    location: "Ледовый дворец, курорт «Игора»",
    workingHours: [
      { days: "13 июля Понедельник – Среда", hours: "10:00 – 18:00" },
      { days: "Четверг – Пятница", hours: "09:00 – 20:00" },
      { days: "18 июля Суббота", hours: "09:00 – 18:00" },
      { days: "19 июля Воскресенье", hours: "09:00 – 16:00" },
    ],
    requirements: [
      "Предъявить паспорт",
      "Быть в списке утверждённых участников",
    ],
    badgeData: "ФИО / год рождения / команда / должность / уникальный QR-код",
    whoCanReceive: [
      "Лично аккредитуемый участник (при предъявлении паспорта)",
      "Менеджер команды (при получении на всю группу)",
    ],
    parking: [
      "Парковка у Ледового дворца — бесплатна только на 30 минут",
      "Если вы планируете остаться дольше, используйте парковку при въезде на курорт",
    ],
    documents: [
      {
        name: "Схема парковок",
        description: "Схема расположения парковок на территории курорта «Игора»",
        filename: "parking_scheme_garagefest2026.pdf",
      },
    ],
  },
  "3": {
    centerName: "Центр аккредитации «Мото Драйв» 2026",
    location: "Ледовый дворец, курорт «Игора»",
    workingHours: [
      { days: "5 июня Четверг", hours: "10:00 – 18:00" },
      { days: "6 июня Пятница", hours: "09:00 – 20:00" },
      { days: "7 июня Суббота", hours: "09:00 – 16:00" },
    ],
    requirements: [
      "Предъявить паспорт",
      "Быть в списке утверждённых участников",
    ],
    badgeData: "ФИО / год рождения / команда / должность / уникальный QR-код",
    whoCanReceive: [
      "Лично аккредитуемый участник (при предъявлении паспорта)",
      "Менеджер команды (при получении на всю группу)",
    ],
    parking: [
      "Парковка у Ледового дворца — бесплатна только на 30 минут",
      "Если вы планируете остаться дольше, используйте парковку при въезде на курорт",
    ],
    documents: [
      {
        name: "Схема парковок",
        description: "Схема расположения парковок на территории курорта «Игора»",
        filename: "parking_scheme_motodrive2026.pdf",
      },
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────

export function getEventById(id: string): Event | undefined {
  return mockEvents.find((e) => e.id === id);
}

export function getApplicationsByEventId(eventId: string): Application[] {
  return mockApplications.filter((a) => a.eventId === eventId);
}

export function getEventAccreditationInfo(eventId: string): EventAccreditationInfo | undefined {
  return eventAccreditationInfo[eventId];
}
