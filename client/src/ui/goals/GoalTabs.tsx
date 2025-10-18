import { NavLink } from "react-router-dom";

export const GoalTabs = () => {
  const goalTabs = [
    {
      text: "목표 컬렉션",
      path: "collection",
    },
    {
      text: "5, 4, 3, 2, 1",
      path: "54321",
    },
    {
      text: "목표 나누기",
      path: "short-goals",
    },
    {
      text: "브레인 스토밍",
      path: "brainstorming",
    },
  ];
  return (
    <div className="w-full flex justify-around">
      {goalTabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `p-2 flex-1 text-center ${
              isActive ? "text-blue-400 font-bold bg-blue-100" : ""
            }`
          }
        >
          {tab.text}
        </NavLink>
      ))}
    </div>
  );
};
