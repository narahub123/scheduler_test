import { formatKoreanDate } from "../utils";

export type LoggingType =
  | "task"
  | "completed"
  | "migrated"
  | "scheduled"
  | "irrelevant"
  | "event"
  | "memo";

export const RapidLoggingPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full flex justify-center">
        <h2 className="p-4 font-bold text-xl">빠른 기록</h2>
      </div>
      <div className="w-full h-full flex flex-col items-center">
        <div>
          <h2>{formatKoreanDate(new Date())}</h2>
        </div>
        <div className="w-60"></div>
      </div>
    </div>
  );
};
