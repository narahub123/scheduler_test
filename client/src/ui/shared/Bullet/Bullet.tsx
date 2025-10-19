import { useLayoutEffect, useRef, type FC } from "react";
import {
  BulletSelector,
  ContentEditable,
  SignifierSelector,
  useBulletApi,
  type EditableTextHandle,
  type SignifierOpitionType,
  type SignifierType,
} from "../../../ui";
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
    insertLineBreak,
  } = useBulletApi();

  const { type, text, indent, signifier } = log;

  // 필요 시 외부에서 제어
  const editableRef = useRef<EditableTextHandle | null>(null);

  // 외부에서 log.text가 바뀔 때만 DOM에 반영은 ContentEditable 내부에서 처리됨
  useLayoutEffect(() => {
    // 예: 특정 상황에서 끝으로 포커싱하고 싶으면
    // editableRef.current?.focusAtEnd();
  }, [text]);

  return (
    <div
      className="flex justify-start gap-2"
      style={{ paddingLeft: `${indent * 16}px` }}
    >
      <SignifierSelector
        signifier={signifier}
        options={signifierOptions}
        onChange={(e) =>
          changeSignifier(itemId, e.target.value as SignifierType)
        }
      />

      <BulletSelector
        bullet={type}
        options={options}
        handleLoggingTypeChange={(e) =>
          changeType(itemId, e.target.value as BulletType)
        }
      />

      <ContentEditable
        ref={editableRef}
        value={text ?? ""}
        className={`min-h-4 w-full break-words whitespace-pre-wrap outline-0 ${
          type === "irrelevant" ? "line-through text-gray-500 " : ""
        }`}
        // 노드 수집을 계속 쓰고 있다면 그대로 전달
        setNodeRef={(el) => setNode(itemId, el)}
        onChange={(v) => changeText(itemId, v)}
        onSplit={() => {
          const caret =
            editableRef.current?.getCaretOffset() ?? text?.length ?? 0;
          split(itemId, caret); // ✅ caret을 엔진에 전달
        }}
        onInsertLineBreak={() => {
          const caret =
            editableRef.current?.getCaretOffset() ?? text?.length ?? 0;
          insertLineBreak(itemId, caret);
        }}
        onMergePrev={() => mergePrev(itemId)}
        onMovePrev={(col) => movePrev(itemId, col)}
        onMoveNext={(col) => moveNext(itemId, col)}
        onIndentDelta={(delta) => indentDelta(itemId, delta)}
        pasteAsPlainText
      />
    </div>
  );
};
