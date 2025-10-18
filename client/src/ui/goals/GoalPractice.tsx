import { BulletList } from "../shared";
import { GoalTitle } from "./GoalTitle";

export const GoalPractice = () => {
  return (
    <div className="w-full p-4 space-y-4">
      <GoalTitle text="5, 4, 3, 2, 1 연습" />
      <BulletList header={"5년"} />
      <hr />
      <BulletList header={"4개월"} />
      <hr />
      <BulletList header={"3주"} />
      <hr />
      <BulletList header={"2일"} />
      <hr />
      <BulletList header={"1시간"} />
    </div>
  );
};
