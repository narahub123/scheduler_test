import { BulletList } from "../shared";
import { GoalTitle } from "./GoalTitle";

export const BrainStorming = () => {
  return (
    <div className="w-full p-4">
      <GoalTitle text="브레인 스토밍" />
      <BulletList />
    </div>
  );
};
