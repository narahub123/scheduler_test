import { useState } from "react";
import type { LoggingType } from "../../../pages/RapidLoggingPage/RapidLoggingPage";

export const Bullet = () => {
  const [loggingType, setLoggingType] = useState<LoggingType>("task");

  const handleLoggingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const loggingType = e.target.value as LoggingType;

    setLoggingType(loggingType);
  };
  return (
    <div className="flex justify-start">
      <select
        onChange={handleLoggingTypeChange}
        value={loggingType}
        className="appearance-none outline-0 inline-block h-6"
      >
        <option value="task" title="할 일">
          •
        </option>
        <option value="completed" title="완료된 일">
          ✘
        </option>
        <option value="migrated" title="이동된 일">
          {">"}
        </option>
        <option value="scheduled" title="예정된 일">
          {"<"}
        </option>
        <option value="irrelevant" title="무관한 일">
          •
        </option>
        <option value="event" title="이벤트">
          ⚬
        </option>
        <option value="memo" title="메모">
          -
        </option>
      </select>
      <div
        contentEditable="true"
        role="textbox"
        aria-multiline="true"
        className="min-h-4 w-full break-words whitespace-pre-wrap outline-0"
      ></div>
    </div>
  );
};
