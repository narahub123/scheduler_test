import type { FormatYmdOptions } from "../types";

/** Date -> 'YYYY-MM-DD' (기본: 로컬 타임존) */
export const formatDateYMD = (
  date: Date,
  options: FormatYmdOptions = {}
): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new TypeError("formatDateYMD: 유효한 Date가 아닙니다.");
  }
  const { timeZone, sep = "-" } = options;

  // 타임존 지정이 없으면 로컬, 있으면 해당 타임존으로 파츠를 추출
  const fmt = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  });

  // 'en-CA'는 기본 형식이 YYYY-MM-DD지만, 안전하게 parts로 조합
  const parts = fmt.formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value ?? "";
  const m = parts.find((p) => p.type === "month")?.value ?? "";
  const d = parts.find((p) => p.type === "day")?.value ?? "";
  return [y, m, d].join(sep);
};

/** 오늘 기준 YYYY-MM-DD (기본: Asia/Seoul) */
export function todayYMD(
  options: Omit<FormatYmdOptions, "timeZone"> & { timeZone?: string } = {}
) {
  return formatDateYMD(new Date(), { timeZone: "Asia/Seoul", ...options });
}

// YYYY.MM.DD (day) 형식으로 변환 
export function formatKoreanDate(
  input: Date | string | number = new Date(),
  timeZone: string = "Asia/Seoul"
): string {
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) throw new Error("Invalid date");

  // ko-KR + weekday: 'short' => '월','화','수'...
  const fmt = new Intl.DateTimeFormat("ko-KR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  const parts = fmt.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const y = get("year"); // '2025'
  const m = get("month"); // '04'
  const d = get("day"); // '05'
  let w = get("weekday"); // '토' 또는 '토요일' (환경에 따라)
  // 혹시 '토요일'처럼 긴 형태면 '요일' 제거
  if (w.endsWith("요일")) w = w.slice(0, -2);

  return `${y}.${m}.${d} (${w})`;
}
