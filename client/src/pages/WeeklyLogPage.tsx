import { WeeklyLog } from "../ui";
import { calcFirstDateOfWeek, calcNthWeek } from "../utils";

export const WeeklyLogPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full flex justify-center">
        <h2 className="p-4 font-bold text-xl">위클리 로그 페이지</h2>
      </div>
      <div className="px-2">{`${calcNthWeek(new Date())}주`}</div>
      <div className="px-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <WeeklyLog
            key={`weekly_${index}`}
            index={index}
            date={calcFirstDateOfWeek(new Date())}
          />
        ))}
      </div>
    </div>
  );
};
