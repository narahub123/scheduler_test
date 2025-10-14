import { useEffect, useRef, useState } from "react";

export const MonthlyCalendar = () => {
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);

  let curYear = useRef(0);

  // 오늘 날짜 표시
  useEffect(() => {
    const today = new Date();

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    setYear(year);
    setMonth(month);
    curYear.current = year;
  }, []);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value);

    setYear(year);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = Number(e.target.value);

    setMonth(month);
  };

  const daysKor = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div>
      <div>
        <h3>달력</h3>
      </div>
      <div>
        <div>
          <select
            name="year"
            id="year"
            onChange={handleYearChange}
            value={year}
          >
            {Array.from({ length: 3 }).map((_, idx) => (
              <option value={curYear.current + idx} key={idx}>
                {curYear.current + idx}
              </option>
            ))}
          </select>
          <select
            name="month"
            id="month"
            onChange={handleMonthChange}
            value={month}
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <option value={idx + 1} key={idx}>
                {1 + idx}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          {Array.from({ length: new Date(year, month, 0).getDate() }).map(
            (_, i) => {
              const day = new Date(year, month - 1, i + 1).getDay();

              const color =
                day === 0 ? "text-red-500" : day === 6 ? "text-blue-500" : "";
              return (
                <div key={i} className="w-100 flex gap-4 justify-center">
                  <span className="flex justify-center">
                    <select name="symbol" id="symbol">
                      <option value=""></option>
                      <option value="*">*</option>
                      <option value="!">!</option>
                    </select>
                  </span>
                  <span className={`flex justify-center ${color}`}>
                    <p>{(i + 1).toString().padStart(2, "0")}</p>
                  </span>
                  <span className={`h-full flex justify-center ${color}`}>
                    <p>{daysKor[day]}</p>
                  </span>

                  <span className="flex-1">
                    <input type="text" className="w-full p-1 border" />
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
