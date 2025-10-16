import type { FormatYmdOptions } from "../types";

type ChineseDateTimeFormatPart = {
  type: Intl.DateTimeFormatPartTypes | "relatedYear" | "yearName";
  value: string;
};

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

// 해당 날짜가 올해의 몇 번째인지 계산하기
export const calcNthDate = (target: Date): number => {
  const year = target.getFullYear();
  const month = target.getMonth();
  const date = target.getDate();
  return Array.from({ length: month + 1 })
    .map((_, index) => index + 1)
    .reduce((acc, cur) => {
      if (cur === month + 1) {
        return acc + date;
      }

      const day = new Date(year, cur, 0).getDate();
      return acc + day;
    }, 0);
};

// 해당 날짜가 몇번째 주인지 계산
export const calcNthWeek = (target: Date) => {
  const year = target.getFullYear();
  const firstSat = 7 - new Date(year, 0, 1).getDay();

  const nthDate = calcNthDate(target);

  return Math.ceil((nthDate - firstSat) / 7) + 1;
};

// 해당 주 첫 번째 일
export const calcFirstDateOfWeek = (target: Date) => {
  const cp = new Date(target);
  return new Date(cp.setDate(cp.getDate() - cp.getDay()));
};

/** Gregorian → (중국식 음력) 월/일 추출. 한국(서울) 기준.
 *  주의: 윤달 여부를 알기 어렵고, 한국 천문연구원 기준과 드물게 1일 오차가 날 수 있습니다.
 */
/** Gregorian → 중국식 음력(대략치). 간지/월/일을 parts에서 안전하게 꺼냄 */
export function toLunarRough(date: Date) {
  const fmt = new Intl.DateTimeFormat("ko-u-ca-chinese", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  // 실제로 chinese 달력으로 포맷되는지 점검
  const { calendar, timeZone } = fmt.resolvedOptions();
  if (calendar !== "chinese") {
    // 런타임이 chinese 달력을 지원하지 않는 상황(예: Node 소형 ICU)
    return {
      sexagenaryYear: null,
      month: null,
      day: null,
      _reason: "no-chinese-calendar" as const,
      calendar,
      timeZone,
    };
  }

  const parts = fmt.formatToParts(date) as ChineseDateTimeFormatPart[];

  const first = (t: ChineseDateTimeFormatPart["type"]) =>
    parts.find((p) => p.type === t)?.value ?? null;

  const monthStr = first("month");
  const dayStr = first("day");

  let sexagenaryYear = first("yearName") ?? first("year");
  if (!sexagenaryYear) {
    // month/day를 함께 요청하면 간지(yearName)가 누락되는 런타임이 있어 추가 조회
    const yearOnlyParts = new Intl.DateTimeFormat("ko-u-ca-chinese", {
      timeZone: "Asia/Seoul",
      year: "numeric",
    }).formatToParts(date) as ChineseDateTimeFormatPart[];
    sexagenaryYear =
      yearOnlyParts.find((p) => p.type === "yearName")?.value ??
      yearOnlyParts.find((p) => p.type === "year")?.value ??
      null;
  }

  const relatedGregorianYear = first("relatedYear");

  const month = monthStr ? Number(monthStr) : null;
  const day = dayStr ? Number(dayStr) : null;

  return { sexagenaryYear, relatedGregorianYear, month, day };
}
