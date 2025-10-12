import { useState } from "react";

type NoteType =
  | "none"
  | "struggle"
  | "study"
  | "book"
  | "money"
  | "exercise"
  | "lifelog"
  | "work";

export const NotePage = () => {
  const [noteType, setNoteType] = useState<NoteType>("none");

  const handleNoteTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const noteType = e.target.value as NoteType;

    setNoteType(noteType);
  };

  console.log(noteType);
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full flex justify-center">
        <h2 className="p-4 font-bold text-xl">노트 페이지</h2>
      </div>
      <div className="space-y-2 p-2">
        <div className="flex flex-col items-center">
          <h2>노트 작성</h2>
          <div>
            {/* 타입 설정 */}
            <div className="space-x-2">
              <label htmlFor="noteType">타입</label>
              <select
                name="noteType"
                id="noteType"
                onChange={handleNoteTypeChange}
                value={noteType}
              >
                <option value="none">미지정</option>
                <option value="struggle">고민</option>
                <option value="study">공부</option>
                <option value="book">독서</option>
                <option value="money">경제</option>
                <option value="exercise">운동</option>
                <option value="lifelog">생활</option>
                <option value="work">일</option>
              </select>
            </div>
            {/* 타입에 따른 템플릿 */}
          </div>
        </div>
      </div>
    </div>
  );
};
