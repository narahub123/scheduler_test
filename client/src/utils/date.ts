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
