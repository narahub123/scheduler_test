import { Outlet } from "react-router-dom";
import { GoalTabs, PageTitle } from "../ui";

export const GoalsPage = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <PageTitle text="목표 컬렉션" />
      <div className="w-full flex-1">
        <GoalTabs />
        <Outlet />
      </div>
    </div>
  );
};
