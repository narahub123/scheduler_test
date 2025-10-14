import type { FC } from "react";
import type { StruggleNoteType } from "../../types";
import { Button } from "../shared";

interface StruggleNoteProps {
  note: StruggleNoteType;
  setNote: (note: StruggleNoteType) => void;
}

export const StruggleNote: FC<StruggleNoteProps> = ({ note, setNote }) => {
  const { title, background, reason, solution } = note;

  const handleStruggleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const id = e.target.id;

    setNote({
      ...note,
      [id]: value,
    });
  };

  return (
    <div className="border p-2 space-y-2">
      <div className="flex justify-center">
        <h2 className="font-bold">고민 노트</h2>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            className="border p-2"
            value={title}
            name="title"
            id="title"
            onChange={handleStruggleContentChange}
          />
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="background">배경</label>
          <textarea
            className="border p-2 flex-1"
            value={background}
            name="background"
            id="background"
            onChange={handleStruggleContentChange}
          />
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="reason">원인</label>
          <textarea
            className="border p-2 flex-1"
            value={reason}
            name="reason"
            id="reason"
            onChange={handleStruggleContentChange}
          />
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="solution">해결</label>
          <textarea
            className="border p-2 flex-1"
            value={solution}
            name="solution"
            id="solution"
            onChange={handleStruggleContentChange}
          />
        </div>
        <Button className="w-full btn-primary">저장</Button>
      </div>
    </div>
  );
};
