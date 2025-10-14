import { useState } from "react";
import { formatDateYMD } from "../utils";
import { Button } from "../ui";

// 실제로는 타입에 대한 규칙을 생성해서 적용해야 함 주의
type TodoType = "none" | "schedule" | "workout" | "home" | "work";

export const TodoPage = () => {
  const [todoType, setTodoType] = useState<TodoType>("none");
  const [date, setDate] = useState(formatDateYMD(new Date()));
  const [text, setText] = useState("");

  // 할 일 종류 변경 핸들러
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as TodoType; // 타입 가드 필요

    setTodoType(type);
  };

  // 날짜 변경 핸들러
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;

    setDate(date);
  };

  // 할 일 텍스트 변경 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    setText(text);
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full flex justify-center">
        <h2 className="p-4 font-bold text-xl">할 일 목록</h2>
      </div>
      <div className="w-full h-full flex flex-col items-center">
        <div>
          <div>
            <h2>할 일 목록</h2>
          </div>
          <div>목록</div>
        </div>
        <div className="space-y-2 border p-2">
          <div className="flex justify-center">
            <h2 className="font-bold">할 일 작성</h2>
          </div>
          <div className="space-y-2">
            {/* 할 일 종류 선택 */}
            <div className="space-x-2">
              <label htmlFor="type">종류</label>
              <select
                name="type"
                id="type"
                onChange={handleTypeChange}
                value={todoType}
              >
                <option value="none">미지정</option>
                <option value="schedule">스케줄</option>
                <option value="workout">운동</option>
                <option value="home">집안일</option>
                <option value="work">일</option>
              </select>
            </div>
            {/* 날짜 지정 */}
            <div className="space-x-2">
              <label htmlFor="date">날짜</label>
              <input
                type="date"
                name="date"
                id="date"
                onChange={handleDateChange}
                value={date}
              />
            </div>
            {/* 할 일 작성 */}
            <div>
              <input
                type="text"
                placeholder="할 일을 작성해주세요"
                value={text}
                onChange={handleTextChange}
                className="border p-2"
              />
            </div>
            <Button className="btn-primary w-full">등록</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
