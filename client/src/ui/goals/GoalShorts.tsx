import { BulletList } from "../shared";
import { GoalTitle } from "./GoalTitle";

export const GoalShorts = () => {
  return (
    <div className="w-full p-4">
      <GoalTitle text="목표 나누기" />
      <div className="flex justify-center gap-4">
        <label htmlFor="long">장기 목표</label>
        <select name="long" id="long">
          <option value="goal1">요리 배우기</option>
          <option value="goal2">코딩 공부하기</option>
          <option value="goal3">앱 배우기</option>
          <option value="goal4">네트워크 배우기</option>
          <option value="goal5">운동하기</option>
        </select>
      </div>
      <BulletList header={"가능한 단기 목표"} />
    </div>
  );
};
