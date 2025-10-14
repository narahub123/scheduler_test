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
};

export const Bullet: FC<Props> = ({
  itemId,
  log,
  options,
  setNode,
  onChange,
  onTypeChange,
  onSplit,
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
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (composingRef.current) return;
    onChange(itemId, e.currentTarget.textContent ?? "");
  };

  const handleLoggingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(itemId, e.target.value as LoggingType);
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
