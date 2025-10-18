import { dailyLogOptions } from "../../data";
import {
  Bullet,
  BulletProvider,
  dailyLogSignifierOptions,
  useBulletEngine,
} from "../shared";
import { GoalTitle } from "./GoalTitle";

const makeId = () => Math.random().toString(36).slice(2, 9); // 예시용. nanoid 권장.

export const GoalShorts = () => {
  const { api, logs } = useBulletEngine({
    defaultValue: [
      { id: makeId(), type: "task", text: "", indent: 0, signifier: "" },
    ],
    maxIndent: 6,
    makeId,
  });
  return (
    <div className="w-full p-4">
      <GoalTitle text="목표 나누기" />
      <BulletProvider api={api}>
        {logs.map((item) => (
          <Bullet
            key={item.id}
            itemId={item.id}
            log={item}
            options={dailyLogOptions}
            signifierOptions={dailyLogSignifierOptions}
          />
        ))}
      </BulletProvider>
    </div>
  );
};
