import { useRef, useState, type FC } from "react";
import { Bullet } from "../rapid-logging";
import { dailyLogOptions } from "../../data";
import type { BulletType } from "../../pages";
import { dailyLogSignifierOptions, type SignifierType } from "../shared";

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
  const [logs, setLogs] = useState<LogItem[]>([
    { id: makeId(), type: "task", text: "", indent: 0, signifier: "" },
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

  const handleTypeChange = (id: string, nextType: BulletType) => {
    setLogs((prev) =>
      prev.map((it) => (it.id === id ? { ...it, type: nextType } : it))
    );
  };

  // Enter(=Split): 현재 항목 뒤에 새 Bullet 삽입 후 포커스 이동, 새 항목에 현재 indent 승계
  // Enter로 줄 나누기: 새 항목에 현재 indent 승계
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
        head = full.slice(0, pos);
        tail = full.slice(pos);
      }
    }

    setLogs((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx < 0) return prev;

      const base = prev[idx];
      const newItem: LogItem = {
        id: makeId(),
        signifier: "",
        type: base.type,
        text: tail,
        indent: base.indent,
      };

      const next = [...prev];
      next[idx] = { ...base, text: head };
      next.splice(idx + 1, 0, newItem);

      requestAnimationFrame(() => {
        focusAtEnd(nodeMapRef.current[newItem.id] ?? null);
      });
      return next;
    });
  };

  // 병합: 이전 줄 indent를 따르고 커서는 이전 줄의 병합 지점으로
  const onMergePrev = (id: string) => {
    setLogs((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx <= 0) return prev;

      const prevItem = prev[idx - 1];
      const curItem = prev[idx];

      const prevLen = (prevItem.text ?? "").length;
      const merged = (prevItem.text ?? "") + (curItem.text ?? "");

      const next = [...prev];
      next[idx - 1] = { ...prevItem, text: merged }; // indent 유지(= prevItem.indent)
      next.splice(idx, 1);

      requestAnimationFrame(() => {
        const el = nodeMapRef.current[prevItem.id] ?? null;
        if (el) setCaretByCharIndex(el, prevLen);
      });

      return next;
    });
  };

  // === 특정 문자 위치로 커서 놓기 ===
  const setCaretByCharIndex = (el: HTMLElement, index: number) => {
    const sel = window.getSelection();
    const range = document.createRange();

    // el 내부 텍스트 노드들을 순회하며 index 위치를 찾음
    let rest = index;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let foundNode: Text | null = null;
    while (walker.nextNode()) {
      const t = walker.currentNode as Text;
      const len = t.textContent?.length ?? 0;
      if (rest <= len) {
        foundNode = t;
        break;
      }
      rest -= len;
    }
    if (foundNode) {
      range.setStart(foundNode, Math.max(0, rest));
    } else {
      // 텍스트 노드가 없으면 끝으로
      range.selectNodeContents(el);
      range.collapse(false);
    }
    range.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(range);
    el.focus();
  };

  // === (추가) 위/아래 행으로 이동 ===
  const moveFocusToSibling = (
    fromId: string,
    dir: "prev" | "next",
    column: number
  ) => {
    setLogs((prev) => {
      const idx = prev.findIndex((it) => it.id === fromId);
      if (idx < 0) return prev;
      const toIdx = dir === "prev" ? idx - 1 : idx + 1;
      if (toIdx < 0 || toIdx >= prev.length) return prev;

      const toItem = prev[toIdx];
      const el = nodeMapRef.current[toItem.id] ?? null;
      if (el) {
        const len = (el.textContent ?? "").length;
        const col = Math.min(column, len);
        requestAnimationFrame(() => setCaretByCharIndex(el, col));
      }
      return prev; // 상태 변경 없음(포커스만 이동)
    });
  };

  // Bullet용 콜백으로 내려줄 함수
  const handleMovePrev = (id: string, column: number) =>
    moveFocusToSibling(id, "prev", column);
  const handleMoveNext = (id: string, column: number) =>
    moveFocusToSibling(id, "next", column);

  // 들여쓰기 단계 제한
  const MIN_INDENT = 0;
  const MAX_INDENT = 6;

  // 특정 항목의 indent 변경 (+1: 들여쓰기, -1: 내어쓰기)
  const handleIndentDelta = (id: string, delta: 1 | -1) => {
    setLogs((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              indent: Math.min(
                MAX_INDENT,
                Math.max(MIN_INDENT, it.indent + delta)
              ),
            }
          : it
      )
    );
  };

  // signifier 변경
  const handleSignifierChange = (id: string, nextType: SignifierType) => {
    setLogs((prev) =>
      prev.map((it) => (it.id === id ? { ...it, signifier: nextType } : it))
    );
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
          signifierOptions={dailyLogSignifierOptions}
          setNode={setNode(item.id)} // ✅ 각 Bullet의 div ref 등록
          onChange={handleChange} // ✅ 텍스트 변경
          onTypeChange={handleTypeChange} // ✅ 타입 변경
          onSignifierChange={handleSignifierChange}
          onSplit={handleSplit} // ✅ Enter로 새 Bullet 추가
          onMergePrev={onMergePrev}
          onMovePrev={handleMovePrev}
          onMoveNext={handleMoveNext}
          onIndentDelta={handleIndentDelta}
        />
      ))}
    </div>
  );
};
