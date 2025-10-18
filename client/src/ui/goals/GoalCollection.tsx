import type { FC } from "react";
import { GoalTitle } from "./GoalTitle";
import { BulletList } from "../shared";

export const GoalCollection: FC = () => {
  return (
    <div className="w-full p-4">
      <GoalTitle text="목표 컬렉션" />
      <BulletList />
    </div>
  );
};
