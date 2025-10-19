import { useLayoutEffect, useRef, type FC } from "react";
import {
  BulletSelector,
  SignifierSelector,
  useBulletApi,
  type SignifierOpitionType,
  type SignifierType,
} from "..";
import type { BulletOptionType } from "../../../data";
import type { BulletType } from "../../../pages";
import type { LogItem } from "../../future-log";

type Props = {
  itemId: string;
  log: LogItem;
  options: BulletOptionType[];
  signifierOptions: SignifierOpitionType[];
};

export const Bullet: FC<Props> = ({
  itemId,
  log,
  options,
  signifierOptions,
}) => {
  const {
    changeSignifier,
    changeText,
    changeType,
    indentDelta,
    mergePrev,
    moveNext,
    movePrev,
    setNode,
    split,
  } = useBulletApi();
  const { type, text, indent, signifier } = log;
  const composingRef = useRef(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  // 부모가 ref를 수집하면서 내부에서도 참조
  const handleSetNode = (el: HTMLDivElement | null) => {
    divRef.current = el;
    setNode(itemId, el);
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

    // Tab: 들여쓰기/내어쓰기
    if (e.key === "Tab") {
      e.preventDefault();
      indentDelta(itemId, e.shiftKey ? -1 : +1);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        document.execCommand("insertText", false, "\n");
        changeText(itemId, e.currentTarget.textContent ?? "");
      } else {
        split(itemId); // 새 Bullet 추가
      }
    }

    // ↑/↓: 행 간 이동 (열 위치 유지)
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const el = divRef.current;
      if (!el) return;

      const offset = getCaretOffsetIn(el); // 현재 문자 오프셋

      e.preventDefault();
      if (e.key === "ArrowUp") movePrev(itemId, offset);
      else moveNext(itemId, offset);
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
        movePrev(itemId, Number.MAX_SAFE_INTEGER);
        return;
      }
      if (e.key === "ArrowRight" && offset === fullLen) {
        e.preventDefault();
        // 다음 Bullet의 "처음"으로 이동: column 0
        moveNext(itemId, 0);
        return;
      }
      // 중간 위치면 기본 동작 유지
    }

    // Backspace: 비어 있으면 위 항목과 병합
    if (e.key === "Backspace") {
      const isAtStart = getIsCaretAtLineStart();
      if (!isAtStart) return; // 맨 앞이 아니면 브라우저 기본 삭제 허용

      e.preventDefault();
      mergePrev(itemId); // 부모에 병합 요청
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (composingRef.current) return;
    changeText(itemId, e.currentTarget.textContent ?? "");
  };

  const handleLoggingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeType(itemId, e.target.value as BulletType);
  };

  const handleSignifierTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    changeSignifier(itemId, e.target.value as SignifierType);
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
    <div
      className="flex justify-start gap-2"
      style={{ paddingLeft: `${indent * 16}px` }}
    >
      <SignifierSelector
        signifier={signifier}
        options={signifierOptions}
        onChange={handleSignifierTypeChange}
      />
      <BulletSelector
        bullet={type}
        options={options}
        handleLoggingTypeChange={handleLoggingTypeChange}
      />
      <div
        ref={handleSetNode}
        contentEditable
        role="textbox"
        aria-multiline="true"
        suppressContentEditableWarning
        className={`min-h-4 w-full break-words whitespace-pre-wrap outline-0 ${
          type === "irrelevant" ? "line-through text-gray-500 " : ""
        }`}
        onCompositionStart={() => (composingRef.current = true)}
        onCompositionEnd={(e) => {
          composingRef.current = false;
          changeText(itemId, e.currentTarget.textContent ?? "");
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
