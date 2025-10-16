import type { FC } from "react";
import { days } from "../../data";
import { toLunarRough } from "../../utils";

interface WeeklyLogProps {
  index: number;
  date: Date;
}

export const WeeklyLog: FC<WeeklyLogProps> = ({ index, date }) => {
  const cp = new Date(date);
  const newDate = new Date(cp.setDate(cp.getDate() + index));
  const { sexagenaryYear, month, day } = toLunarRough(newDate);
  return (
    <div className="flex border-t last:border-b">
      <div
        className={`flex justify-center items-center flex-col p-8 font-bold ${
          index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""
        }`}
      >
        <p>{date.getDate() + index}</p>
        <p className="text-sm">{`${days[index]}요일`}</p>
        <p>{`${sexagenaryYear}.${month}.${day}`}</p>
      </div>
      <div className="border-l"></div>
    </div>
  );
};
