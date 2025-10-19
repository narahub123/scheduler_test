import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

export type EditableTextHandle = {
  focusAtStart: () => void;
  focusAtEnd: () => void;
  getCaretOffset: () => number;
  setCaretOffset: (offset: number) => void;
  getNode: () => HTMLDivElement | null;
};

type Props = {
  /** 외부 상태 값(조합 중이 아닐 때만 DOM에 동기화) */
  value: string;

  /** Tailwind 등 클래스 */
  className?: string;

  /** 값 변경 (onInput/조합 종료/Shift+Enter 등) */
  onChange: (value: string) => void;

  /** Enter(조합 아님, Shift 미포함) → 새 줄/새 Bullet */
  onSplit?: () => void;

  /** Shift+Enter → 줄바꿈만 삽입 */
  onInsertLineBreak?: () => void;

  /** Backspace at start → 이전과 병합 */
  onMergePrev?: () => void;

  /** ArrowUp / ArrowLeft(시작 경계) → 이전 아이템으로 이동 */
  onMovePrev?: (column: number) => void;

  /** ArrowDown / ArrowRight(끝 경계) → 다음 아이템으로 이동 */
  onMoveNext?: (column: number) => void;

  /** Tab / Shift+Tab */
  onIndentDelta?: (delta: 1 | -1) => void;

  /** 외부에서 ref 수집이 필요하면 전달(선택) */
  setNodeRef?: (el: HTMLDivElement | null) => void;

  /** aria 멀티라인 여부 (기본 true) */
  ariaMultiline?: boolean;

  /** paste 시 plain-text 강제 (기본 true) */
  pasteAsPlainText?: boolean;
};

export const ContentEditable = forwardRef<EditableTextHandle, Props>(
  (
    {
      value,
      className,
      onChange,
      onSplit,
      onInsertLineBreak,
      onMergePrev,
      onMovePrev,
      onMoveNext,
      onIndentDelta,
      setNodeRef,
      ariaMultiline = true,
      pasteAsPlainText = true,
    },
    ref
  ) => {
    const composingRef = useRef(false);
    const divRef = useRef<HTMLDivElement | null>(null);

    // 외부 값 → DOM 동기화(IME 중에는 금지)
    useLayoutEffect(() => {
      const el = divRef.current;
      if (!el || composingRef.current) return;
      const current = el.textContent ?? "";
      const next = value ?? "";
      if (current !== next) el.textContent = next;
    }, [value]);

    const getCaretOffsetIn = (el: HTMLElement): number => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return (el.textContent ?? "").length;
      const r = sel.getRangeAt(0).cloneRange();
      const pre = document.createRange();
      pre.selectNodeContents(el);
      pre.setEnd(r.startContainer, r.startOffset);
      return (pre.toString() ?? "").length;
    };

    const setCaretOffsetIn = (el: HTMLElement, offset: number) => {
      const range = document.createRange();
      const sel = window.getSelection();
      let remaining = offset;

      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      let node: Node | null = walker.nextNode();
      while (node) {
        const len = (node.textContent ?? "").length;
        if (remaining <= len) {
          range.setStart(node, remaining);
          range.collapse(true);
          sel?.removeAllRanges();
          sel?.addRange(range);
          return;
        }
        remaining -= len;
        node = walker.nextNode();
      }
      // 끝으로
      range.selectNodeContents(el);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    };

    const getIsCaretAtLineStart = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return false;
      const r = sel.getRangeAt(0);
      if (!r.collapsed) return false;
      const pre = document.createRange();
      pre.selectNodeContents(divRef.current!);
      pre.setEnd(r.startContainer, r.startOffset);
      return (pre.toString() ?? "").length === 0;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (composingRef.current) return;

      // Tab
      if (e.key === "Tab") {
        if (onIndentDelta) {
          e.preventDefault();
          onIndentDelta(e.shiftKey ? -1 : +1);
        }
        return;
      }

      // Enter
      if (e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          if (onInsertLineBreak) {
            document.execCommand("insertText", false, "\n");
            onChange(divRef.current?.textContent ?? "");
          }
        } else {
          onSplit?.();
        }
        return;
      }

      // 위/아래
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const el = divRef.current;
        if (!el) return;
        const offset = getCaretOffsetIn(el);
        e.preventDefault();
        if (e.key === "ArrowUp") onMovePrev?.(offset);
        else onMoveNext?.(offset);
        return;
      }

      // 좌/우 경계 이동
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const el = divRef.current;
        if (!el) return;

        const fullLen = (el.textContent ?? "").length;
        const offset = getCaretOffsetIn(el);

        // 선택 범위 있으면 기본 동작 허용
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && !sel.getRangeAt(0).collapsed) return;

        if (e.key === "ArrowLeft" && offset === 0) {
          e.preventDefault();
          onMovePrev?.(Number.MAX_SAFE_INTEGER);
          return;
        }
        if (e.key === "ArrowRight" && offset === fullLen) {
          e.preventDefault();
          onMoveNext?.(0);
          return;
        }
      }

      // Backspace 병합
      if (e.key === "Backspace") {
        const atStart = getIsCaretAtLineStart();
        if (!atStart) return; // 기본 삭제 허용
        e.preventDefault();
        onMergePrev?.();
      }
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      if (composingRef.current) return;
      onChange(e.currentTarget.textContent ?? "");
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (!pasteAsPlainText) return;
      e.preventDefault();
      const t = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, t);
      onChange(divRef.current?.textContent ?? "");
    };

    // 외부에서 제어할 수 있는 메서드 노출
    useImperativeHandle(ref, () => ({
      focusAtStart: () => {
        const el = divRef.current;
        if (!el) return;
        el.focus();
        setCaretOffsetIn(el, 0);
      },
      focusAtEnd: () => {
        const el = divRef.current;
        if (!el) return;
        el.focus();
        const len = (el.textContent ?? "").length;
        setCaretOffsetIn(el, len);
      },
      getCaretOffset: () => {
        const el = divRef.current;
        if (!el) return 0;
        return getCaretOffsetIn(el);
      },
      setCaretOffset: (offset: number) => {
        const el = divRef.current;
        if (!el) return;
        setCaretOffsetIn(
          el,
          Math.max(0, Math.min(offset, (el.textContent ?? "").length))
        );
      },
      getNode: () => divRef.current,
    }));

    const assignRef = (el: HTMLDivElement | null) => {
      divRef.current = el;
      setNodeRef?.(el);
    };

    return (
      <div
        ref={assignRef}
        contentEditable
        role="textbox"
        aria-multiline={ariaMultiline}
        suppressContentEditableWarning
        className={className}
        onCompositionStart={() => (composingRef.current = true)}
        onCompositionEnd={(e) => {
          composingRef.current = false;
          onChange(e.currentTarget.textContent ?? "");
        }}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onPaste={handlePaste}
      />
    );
  }
);

ContentEditable.displayName = "ContentEditable";
