import type { FC, ReactNode } from "react";
import type { LogItem } from "../future-log";
import { dailyLogOptions } from "../../data";
import { dailyLogSignifierOptions } from "./SignifierSelector";
import { useBulletEngine } from "./Bullet/useBulletEngine";
import { BulletProvider } from "./Bullet/context";
import { Bullet } from "./Bullet/Bullet";

type BulletListProps = {
  /** 비제어형 초기값 (목록별로 다르게 시작하고 싶을 때) */
  defaultValue?: LogItem[];
  /** 제어형 값/변경 콜백으로 외부 스토어와 연결하고 싶을 때 */
  value?: LogItem[];
  onChange?: (next: LogItem[]) => void;

  /** 엔진 정책 옵션 (필요한 것만 노출) */
  maxIndent?: number;
  minIndent?: number;
  makeId?: () => string;

  /** UI 옵션 */
  className?: string;
  header?: ReactNode;
  bulletOptions?: typeof dailyLogOptions;
  signifierOptions?: typeof dailyLogSignifierOptions;
};

export const BulletList: FC<BulletListProps> = ({
  defaultValue,
  value,
  onChange,
  maxIndent,
  minIndent,
  makeId,

  className,
  header,
  bulletOptions = dailyLogOptions,
  signifierOptions = dailyLogSignifierOptions,
}) => {
  // ✅ 엔진을 내부에서 생성(제어형/비제어형 둘 다 지원)
  const { api, logs } = useBulletEngine({
    defaultValue,
    value,
    onChange,
    maxIndent,
    minIndent,
    makeId,
  });

  return (
    <div className={className}>
      {header}
      <BulletProvider api={api}>
        {logs.map((item) => (
          <Bullet
            key={item.id}
            itemId={item.id}
            log={item}
            options={bulletOptions}
            signifierOptions={signifierOptions}
          />
        ))}
      </BulletProvider>
    </div>
  );
};
