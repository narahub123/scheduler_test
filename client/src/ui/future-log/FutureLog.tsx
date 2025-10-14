import { useRef, useState, type FC } from "react";
import { Bullet } from "../rapid-logging";
import { dailyLogOptions } from "../../data";
import type { LoggingType } from "../../pages";

export type LogItem = { id: string; type: LoggingType; text: string };

const makeId = () => Math.random().toString(36).slice(2, 9); // 예시용. nanoid 권장.

export const FutureLog: FC<{ month: number; className?: string }> = ({
  month,
  className,
}) => {
  const [logs, setLogs] = useState<LogItem[]>([
    { id: makeId(), type: "task", text: "" },
  ]);

  // 각 Bullet의 contentEditable div를 보관할 ref 맵
  const nodeMapRef = useRef<Record<string, HTMLDivElement | null>>({});

  const setNode = (id: string) => (el: HTMLDivElement | null) => {
    if (el) nodeMapRef.current[id] = el;
    else delete nodeMapRef.current[id];
  };

  const focusAtEnd = (el: HTMLDivElement | null) => {
    if (!el) return;
    const sel = window.getSelection();
    const range = document.createRange();
    // 가장 끝으로
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
    el.focus();
  };

  const handleChange = (id: string, text: string) => {
    setLogs((prev) => prev.map((it) => (it.id === id ? { ...it, text } : it)));
  };

  const handleTypeChange = (id: string, nextType: LoggingType) => {
    setLogs((prev) =>
      prev.map((it) => (it.id === id ? { ...it, type: nextType } : it))
    );
  };

  // Enter(=Split): 현재 항목 뒤에 새 Bullet 삽입 후 포커스 이동
  const handleSplit = (id: string) => {
    const el = nodeMapRef.current[id];
    let head = "",
      tail = "";

    if (el) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const r = sel.getRangeAt(0);
        const pos = r.startOffset;
        const full = el.textContent ?? "";
        // 단일 텍스트 노드 기준. (여러 노드면 별도 유틸 필요)
        head = full.slice(0, pos);
        tail = full.slice(pos);
      }
    }

    setLogs((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx < 0) return prev;

      const newItem: LogItem = { id: makeId(), type: "task", text: tail };

      const next = [...prev];
      next[idx] = { ...next[idx], text: head }; // 현재 행 = 커서 앞
      next.splice(idx + 1, 0, newItem); // 새 행 = 커서 뒤

      requestAnimationFrame(() => {
        // 새 행으로 포커스 이동 + 끝으로
        focusAtEnd(nodeMapRef.current[newItem.id] ?? null);
      });
      return next;
    });
  };

  return (
    <div className={["p-2 flex flex-col", className].filter(Boolean).join(" ")}>
      <div>
        <p>{month}월</p>
      </div>

      {logs.map((item) => (
        <Bullet
          key={item.id}
          itemId={item.id}
          log={item}
          options={dailyLogOptions}
          setNode={setNode(item.id)} // ✅ 각 Bullet의 div ref 등록
          onChange={handleChange} // ✅ 텍스트 변경
          onTypeChange={handleTypeChange} // ✅ 타입 변경
          onSplit={handleSplit} // ✅ Enter로 새 Bullet 추가
        />
      ))}
    </div>
  );
};
