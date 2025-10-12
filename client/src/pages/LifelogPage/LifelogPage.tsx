import { useState } from "react";
import { Button } from "../../ui";

type LogType =
  | "none"
  | "todo"
  | "work"
  | "exercise"
  | "meal"
  | "rest"
  | "study";

export const LifelogPage = () => {
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [logType, setLogType] = useState<LogType>("none");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  console.log(startAt, endAt, logType, title, description);

  // 시작 시각 핸들러
  const handleStartAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startAt = e.target.value;

    setStartAt(startAt);
  };

  // 종료 시각 핸들러
  const handleEndAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endAt = e.target.value;

    setEndAt(endAt);
  };

  // 타입 핸들러
  const handleLogTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const logType = e.target.value as LogType;

    setLogType(logType);
  };

  // 제목 핸들러
  const handleTitlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;

    setTitle(title);
  };

  // 로그 핸들러
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const description = e.target.value;

    setDescription(description);
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full flex justify-center">
        <h2 className="p-4 font-bold text-xl">라이프 로그</h2>
      </div>
      <div className="w-full h-full flex flex-col items-center">
        {/* 캘린더로 표시? */}
        <div>라이프 로그</div>
        <div className="border p-2">
          <div>
            <h2>라이프 로그 작성</h2>
          </div>
          <div className="space-x-2 flex">
            <label htmlFor="startAt">시작 시간</label>
            <input
              type="time"
              name="startAt"
              id="startAt"
              onChange={handleStartAtChange}
              value={startAt}
            />
          </div>
          <div className="space-x-2">
            <label htmlFor="startAt">종료 시간</label>
            <input
              type="time"
              name="startAt"
              id="startAt"
              onChange={handleEndAtChange}
              value={endAt}
            />
          </div>
          <div className="space-x-2">
            <label htmlFor="type">타입</label>
            <select
              name="type"
              id="type"
              onChange={handleLogTypeChange}
              value={logType}
            >
              <option value="none">미지정</option>
              <option value="todo">할 일</option>
              <option value="exercise">운동</option>
              <option value="meal">식사</option>
              <option value="rest">휴식</option>
              <option value="study">공부</option>
            </select>
          </div>
          <div className="space-x-2">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              name="title"
              id="title"
              className="border"
              onChange={handleTitlChange}
              value={title}
            />
          </div>
          <div>
            <div>
              <label htmlFor="description">로그</label>
            </div>
            <div>
              <textarea
                name="description"
                id="description"
                className="border w-full"
                onChange={handleDescriptionChange}
                value={description}
              ></textarea>
            </div>
          </div>
          <Button className="w-full btn-primary">저장</Button>
        </div>
      </div>
    </div>
  );
};
