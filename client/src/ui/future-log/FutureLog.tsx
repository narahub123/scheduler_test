import { type FC } from "react";

import { dailyLogOptions } from "../../data";
import type { BulletType } from "../../pages";
import {
  Bullet,
  BulletProvider,
  dailyLogSignifierOptions,
  useBulletEngine,
  type SignifierType,
} from "../shared";

export type LogItem = {
  id: string;
  type: BulletType;
  signifier: SignifierType;
  text: string;
  indent: number;
};

const makeId = () => Math.random().toString(36).slice(2, 9); // 예시용. nanoid 권장.

export const FutureLog: FC<{ month: number; className?: string }> = ({
  month,
  className,
}) => {
  const { api, logs } = useBulletEngine({
    defaultValue: [
      { id: makeId(), type: "task", text: "", indent: 0, signifier: "" },
    ],
    maxIndent: 6,
    makeId,
  });

  return (
    <div className={["p-2 flex flex-col", className].filter(Boolean).join(" ")}>
      <div>
        <p>{month}월</p>
      </div>
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
