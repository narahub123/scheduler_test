import type { FC } from "react";

interface FutureLogType {
  month: number;
  className?: string;
}

export const FutureLog: FC<FutureLogType> = ({
  month,
  className: _className,
}) => {
  const className = ["p-2 flex flex-col", _className].join(" ");
  return (
    <div className={className}>
      <div>
        <p>{month + "월"}</p>
      </div>
      {/* 불렛을 모든 컴포넌트에서 사용가능하게 만들 것  */}
      <div className="flex gap-1 items-center">
        <select name="symbol" id="symbol" className="appearance-none">
          <option value=""></option>
          <option value="task">•</option>
          <option value="event">⚬</option>
        </select>
        <input type="text" className="border p-1 flex-1" />
      </div>
    </div>
  );
};
