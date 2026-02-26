// ─── Regex patterns ──────────────────────────────────────

const CYRILLIC_NAME = /^[А-Яа-яЁё\s\-]+$/;
const PASSPORT_PATTERN = /^\d{4}\s?\d{6}$/;
const LATIN_ALPHANUM = /^[A-Za-z0-9\s\-]+$/;
const RU_PLATE = /^[АВЕКМНОРСТУХавекмнорстух]\d{3}[АВЕКМНОРСТУХавекмнорстух]{2}\s?\d{2,3}$/;

// ─── Phone countries ─────────────────────────────────────

export interface PhoneCountry {
  code: string;
  name: string;
  flag: string;
  mask: string;
  maxDigits: number;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "+7", name: "Россия", flag: "\u{1F1F7}\u{1F1FA}", mask: "(###) ###-##-##", maxDigits: 10 },
  { code: "+375", name: "Беларусь", flag: "\u{1F1E7}\u{1F1FE}", mask: "(##) ###-##-##", maxDigits: 9 },
  { code: "+7", name: "Казахстан", flag: "\u{1F1F0}\u{1F1FF}", mask: "(###) ###-##-##", maxDigits: 10 },
  { code: "+998", name: "Узбекистан", flag: "\u{1F1FA}\u{1F1FF}", mask: "(##) ###-##-##", maxDigits: 9 },
];

// ─── Validation functions ────────────────────────────────

export function validateFullName(v: string): string | null {
  if (!v.trim()) return "Обязательное поле";
  if (!CYRILLIC_NAME.test(v.trim())) return "Только кириллица, пробелы и дефис";
  const parts = v.trim().split(/\s+/);
  if (parts.length < 2) return "Введите фамилию и имя";
  return null;
}

export function validatePassport(v: string): string | null {
  if (!v.trim()) return "Обязательное поле";
  if (/[А-Яа-яЁё]/.test(v)) return "Кириллица не допускается";
  if (!PASSPORT_PATTERN.test(v.trim())) return "Формат: 0000 000000 (серия и номер)";
  return null;
}

export function validatePosition(v: string): string | null {
  if (!v.trim()) return null; // optional field
  if (!CYRILLIC_NAME.test(v.trim())) return "Только кириллица, пробелы и дефис";
  return null;
}

export function validatePhone(digits: string, country: PhoneCountry): string | null {
  if (!digits) return "Обязательное поле";
  if (digits.length < country.maxDigits) return `Введите ${country.maxDigits} цифр`;
  return null;
}

export function formatPhone(raw: string, country: PhoneCountry): string {
  const digits = raw.replace(/\D/g, "").slice(0, country.maxDigits);
  let result = "";
  let di = 0;
  for (const ch of country.mask) {
    if (di >= digits.length) break;
    if (ch === "#") {
      result += digits[di];
      di++;
    } else {
      result += ch;
    }
  }
  return result;
}

export function extractPhoneDigits(formatted: string): string {
  return formatted.replace(/\D/g, "");
}

export function validateLatinField(v: string, fieldName: string): string | null {
  if (!v.trim()) return null;
  if (!LATIN_ALPHANUM.test(v.trim())) return `${fieldName}: только латиница и цифры`;
  return null;
}

export function validatePlate(v: string): string | null {
  if (!v.trim()) return "Обязательное поле";
  if (!RU_PLATE.test(v.trim())) return "Формат: А000АА 00 (российский гос. номер)";
  return null;
}
