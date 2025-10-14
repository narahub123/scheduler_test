import type { LoggingType } from "../pages";

export interface BulletOptionType {
  value: LoggingType;
  title: string;
  symbol: string;
}

export const dailyLogOptions: BulletOptionType[] = [
  {
    value: "task",
    title: "할 일",
    symbol: "•",
  },
  {
    value: "completed",
    title: "완료된 일",
    symbol: "✘",
  },
  {
    value: "migrated",
    title: "이동된 일",
    symbol: ">",
  },
  {
    value: "scheduled",
    title: "예정된 일",
    symbol: "<",
  },
  {
    value: "irrelevant",
    title: "무관한 일",
    symbol: "•",
  },
  {
    value: "event",
    title: "이벤트",
    symbol: "⚬",
  },
  {
    value: "memo",
    title: "메모",
    symbol: "-",
  },
];
