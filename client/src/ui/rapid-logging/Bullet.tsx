import { useLayoutEffect, useRef, type FC } from "react";
import { BulletSelector } from "../shared";
import type { BulletOptionType } from "../../data";
import type { LoggingType } from "../../pages";
import type { LogItem } from "../future-log";

type Props = {
  itemId: string;
  log: LogItem;
  options: BulletOptionType[];
  setNode: (el: HTMLDivElement | null) => void;
  onChange: (id: string, text: string) => void;
  onTypeChange: (id: string, t: LoggingType) => void;
  onSplit: (id: string) => void;
  onMergePrev: (id: string) => void;
  onMovePrev: (id: string, column: number) => void; // ↑ 이동
  onMoveNext: (id: string, column: number) => void; // ↓ 이동
};

export const Bullet: FC<Props> = ({
  itemId,
  log,
  options,
  setNode,
  onChange,
  onTypeChange,
  onSplit,
  onMergePrev,
  onMovePrev,
  onMoveNext,
}) => {
  const { type, text } = log; // ✅ text는 유지
  const composingRef = useRef(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  // 부모가 ref를 수집하면서 내부에서도 참조
  const handleSetNode = (el: HTMLDivElement | null) => {
    divRef.current = el;
    setNode(el);
  };

  // ✅ 외부에서 log.text가 바뀔 때만 DOM에 반영(IME 중엔 금지)
  useLayoutEffect(() => {
    const el = divRef.current;
    if (!el || composingRef.current) return;
    const current = el.textContent ?? "";
    const next = text ?? "";
    if (current !== next) {
      el.textContent = next;
    }
  }, [text]);

  // 엘리먼트 내부 오프셋 구하기(부모와 동일 유틸)
  const getCaretOffsetIn = (el: HTMLElement): number => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return (el.textContent ?? "").length;
    const r = sel.getRangeAt(0).cloneRange();
    const pre = document.createRange();
    pre.selectNodeContents(el);
    pre.setEnd(r.startContainer, r.startOffset);
    return (pre.toString() ?? "").length;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (composingRef.current) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        document.execCommand("insertText", false, "\n");
        onChange(itemId, e.currentTarget.textContent ?? "");
      } else {
        onSplit(itemId); // 새 Bullet 추가
      }
    }

    // ↑/↓: 행 간 이동 (열 위치 유지)
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const el = divRef.current;
      if (!el) return;

      const offset = getCaretOffsetIn(el); // 현재 문자 오프셋

      e.preventDefault();
      if (e.key === "ArrowUp") onMovePrev(itemId, offset);
      else onMoveNext(itemId, offset);
      return;
    }

    // ←/→: 경계에서만 이웃 Bullet로 이동
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const el = divRef.current;
      if (!el) return;

      const fullLen = (el.textContent ?? "").length;
      const offset = getCaretOffsetIn(el);

      // 범위 선택 중이면 기본 동작 허용
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.getRangeAt(0).collapsed) return;

      if (e.key === "ArrowLeft" && offset === 0) {
        e.preventDefault();
        // 이전 Bullet의 "끝"으로 이동: column을 아주 큰 값으로 전달
        onMovePrev(itemId, Number.MAX_SAFE_INTEGER);
        return;
      }
      if (e.key === "ArrowRight" && offset === fullLen) {
        e.preventDefault();
        // 다음 Bullet의 "처음"으로 이동: column 0
        onMoveNext(itemId, 0);
        return;
      }
      // 중간 위치면 기본 동작 유지
    }

    // Backspace: 비어 있으면 위 항목과 병합
    if (e.key === "Backspace") {
      const isAtStart = getIsCaretAtLineStart();
      if (!isAtStart) return; // 맨 앞이 아니면 브라우저 기본 삭제 허용

      e.preventDefault();
      onMergePrev(itemId); // 부모에 병합 요청
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (composingRef.current) return;
    onChange(itemId, e.currentTarget.textContent ?? "");
  };

  const handleLoggingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(itemId, e.target.value as LoggingType);
  };

  const getIsCaretAtLineStart = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const r = sel.getRangeAt(0);
    if (!r.collapsed) return false; // 범위 선택이면 병합 X
    // div 기준 "문자 오프셋 0"인지 확인
    const pre = document.createRange();
    pre.selectNodeContents(divRef.current!);
    pre.setEnd(r.startContainer, r.startOffset);
    return (pre.toString() ?? "").length === 0;
  };

  return (
    <div className="flex justify-start gap-2">
      <BulletSelector
        loggingType={type}
        options={options}
        handleLoggingTypeChange={handleLoggingTypeChange}
      />
      <div
        ref={handleSetNode}
        contentEditable
        role="textbox"
        aria-multiline="true"
        suppressContentEditableWarning
        className="min-h-4 w-full break-words whitespace-pre-wrap outline-0"
        onCompositionStart={() => (composingRef.current = true)}
        onCompositionEnd={(e) => {
          composingRef.current = false;
          onChange(itemId, e.currentTarget.textContent ?? "");
        }}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onPaste={(e) => {
          e.preventDefault();
          const t = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, t);
        }}
      />
    </div>
  );
};
