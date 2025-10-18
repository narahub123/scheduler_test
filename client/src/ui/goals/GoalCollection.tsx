import type { FC } from "react";
import { GoalTitle } from "./GoalTitle";

export const GoalCollection: FC = () => {
  return (
    <div className="w-full">
      <GoalTitle text="목표 컬렉션" />
    </div>
  );
};
