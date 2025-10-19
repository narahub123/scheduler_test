import { useCallback, useMemo, useRef, useState } from "react";
import type { LogItem, SignifierType } from "../../../ui";
import type { BulletType } from "../../../pages";
import type { BulletListApi } from "./types";

// 엔진 옵션/반환 타입(새로 정의해도 도메인 타입은 재정의하지 않음)
export type UseBulletEngineOptions = {
  value?: LogItem[];
  defaultValue?: LogItem[];
  onChange?: (next: LogItem[]) => void;

  minIndent?: number; // 기본 0
  maxIndent?: number; // 기본 6

  // 새 항목 생성 시 승계 정책
  inherit?: {
    type?: boolean; // 기본 true
    signifier?: boolean; // 기본 true
    indent?: boolean; // 기본 true
  };

  makeId?: () => string; // 기본: Math.random() 기반
};

export const useBulletEngine = (opts: UseBulletEngineOptions = {}) => {
  const {
    value,
    defaultValue,
    onChange,
    minIndent = 0,
    maxIndent = 6,
    inherit = { type: true, signifier: true, indent: true },
    makeId = () => Math.random().toString(36).slice(2, 9),
  } = opts;

  // 제어형/비제어형
  const isControlled = value !== undefined;
  const [inner, setInner] = useState<LogItem[]>(
    () =>
      defaultValue ?? [
        { id: makeId(), type: "task", signifier: "", text: "", indent: 0 },
      ]
  );
  const logs = (isControlled ? value : inner) as LogItem[];

  const setLogs = useCallback(
    (updater: LogItem[] | ((prev: LogItem[]) => LogItem[])) => {
      const next =
        typeof updater === "function"
          ? (updater as (p: LogItem[]) => LogItem[])(logs)
          : updater;
      if (!isControlled) setInner(next);
      onChange?.(next);
    },
    [isControlled, logs, onChange]
  );

  // 각 Bullet의 contentEditable div를 보관할 ref 맵
  const nodeMapRef = useRef<Record<string, HTMLDivElement | null>>({});

  const getNode = useCallback(
    (id: string) => nodeMapRef.current[id] ?? null,
    []
  );
  const setNode = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) nodeMapRef.current[id] = el;
    else delete nodeMapRef.current[id];
  }, []);

  // === 특정 문자 위치로 커서 놓기 ===
  const setCaretByCharIndex = useCallback((el: HTMLElement, index: number) => {
    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();

    let rest = index;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let found: Text | null = null;
    while (walker.nextNode()) {
      const t = walker.currentNode as Text;
      const len = t.textContent?.length ?? 0;
      if (rest <= len) {
        found = t;
        break;
      }
      rest -= len;
    }
    if (found) {
      range.setStart(found, Math.max(0, rest));
    } else {
      range.selectNodeContents(el);
      range.collapse(false);
    }
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    (el as HTMLElement).focus();
  }, []);

  const setCaret = useCallback(
    (id: string, index: number) => {
      const el = getNode(id);
      if (!el) return;
      requestAnimationFrame(() => setCaretByCharIndex(el, index));
    },
    [getNode, setCaretByCharIndex]
  );

  // 편의 패치
  const patchItem = useCallback(
    (id: string, patch: Partial<LogItem>) => {
      setLogs((prev) =>
        prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
      );
    },
    [setLogs]
  );

  // === 필드 변경 ===
  const changeText = useCallback(
    (id: string, text: string) => patchItem(id, { text }),
    [patchItem]
  );
  const changeType = useCallback(
    (id: string, t: BulletType) => patchItem(id, { type: t }),
    [patchItem]
  );
  const changeSignifier = useCallback(
    (id: string, s: SignifierType) => patchItem(id, { signifier: s }),
    [patchItem]
  );

  // === 분할(Enter) ===
  const split = useCallback(
    (id: string, caret: number) => {
      const idx = logs.findIndex((it) => it.id === id);
      if (idx < 0) return;

      const base = logs[idx];
      const full = base.text ?? "";
      const pos = Math.max(0, Math.min(caret, full.length));

      const head = full.slice(0, pos);
      const tail = full.slice(pos);

      const nextItem: LogItem = {
        id: makeId(),
        text: tail,
        type: inherit.type ? base.type : base.type,
        signifier: inherit.signifier ? base.signifier : "",
        indent: inherit.indent ? base.indent : base.indent,
      };

      const next = [...logs];
      next[idx] = { ...base, text: head };
      next.splice(idx + 1, 0, nextItem);

      setLogs(next);
      requestAnimationFrame(() => setCaret(nextItem.id, 0));
    },
    [logs, setLogs, setCaret, makeId, inherit]
  );

  // 줄바꿈
  const insertLineBreak = useCallback(
    (id: string, caret: number) => {
      const idx = logs.findIndex((it) => it.id === id);
      if (idx < 0) return;
      const base = logs[idx];
      const s = base.text ?? "";
      const pos = Math.max(0, Math.min(caret, s.length));
      const next = s.slice(0, pos) + "\n" + s.slice(pos);
      setLogs((prev) =>
        prev.map((it) => (it.id === id ? { ...it, text: next } : it))
      );
      requestAnimationFrame(() => setCaret(id, pos + 1));
    },
    [logs, setLogs, setCaret]
  );

  // === 병합(위와) ===
  const mergePrev = useCallback(
    (id: string) => {
      const idx = logs.findIndex((it) => it.id === id);
      if (idx <= 0) return;

      const prevItem = logs[idx - 1];
      const curItem = logs[idx];

      const prevLen = (prevItem.text ?? "").length;
      const merged = (prevItem.text ?? "") + (curItem.text ?? "");

      const next = [...logs];
      next[idx - 1] = { ...prevItem, text: merged }; // indent는 prev 유지
      next.splice(idx, 1);

      setLogs(next);
      requestAnimationFrame(() => setCaret(prevItem.id, prevLen));
    },
    [logs, setCaret, setLogs]
  );

  // === 위/아래 이동(열 유지) ===
  const movePrev = useCallback(
    (id: string, column: number) => {
      const idx = logs.findIndex((it) => it.id === id);
      if (idx < 0 || idx - 1 < 0) return;
      const to = logs[idx - 1];
      const el = getNode(to.id);
      const len = el ? (el.textContent ?? "").length : 0;
      requestAnimationFrame(() => setCaret(to.id, Math.min(column, len)));
    },
    [getNode, logs, setCaret]
  );

  const moveNext = useCallback(
    (id: string, column: number) => {
      const idx = logs.findIndex((it) => it.id === id);
      if (idx < 0 || idx + 1 >= logs.length) return;
      const to = logs[idx + 1];
      const el = getNode(to.id);
      const len = el ? (el.textContent ?? "").length : 0;
      requestAnimationFrame(() => setCaret(to.id, Math.min(column, len)));
    },
    [getNode, logs, setCaret]
  );

  // === 들여쓰기 ===
  const indentDelta = useCallback(
    (id: string, delta: 1 | -1) => {
      setLogs((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                indent: Math.min(
                  maxIndent,
                  Math.max(minIndent, it.indent + delta)
                ),
              }
            : it
        )
      );
    },
    [maxIndent, minIndent, setLogs]
  );

  // === 리스트 교체 ===
  const replaceAll = useCallback((next: LogItem[]) => setLogs(next), [setLogs]);

  // API
  const api: BulletListApi = useMemo(
    () => ({
      getNode,
      setNode,
      changeText,
      changeType,
      changeSignifier,
      split,
      insertLineBreak,
      mergePrev,
      movePrev,
      moveNext,
      indentDelta,
      setCaret,
      replaceAll,
    }),
    [
      changeSignifier,
      changeText,
      changeType,
      getNode,
      indentDelta,
      mergePrev,
      moveNext,
      movePrev,
      replaceAll,
      setCaret,
      setNode,
      split,
      insertLineBreak,
    ]
  );

  return { api, logs, setLogs };
};
