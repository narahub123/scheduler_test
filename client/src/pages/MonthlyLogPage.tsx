import { Link, Outlet } from "react-router-dom";

export const MonthlyLogPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full flex justify-center">
        <h2 className="p-4 font-bold text-xl">먼슬리 로그 페이지</h2>
      </div>
      <div>
        <nav>
          <Link to="">달력</Link>
          <Link to="to-dos">할일</Link>
        </nav>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
