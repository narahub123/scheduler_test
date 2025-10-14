import { FutureLog } from "../ui";

export const FutureLogPage = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full flex justify-center">
        <h2 className="p-4 font-bold text-xl">먼슬리 로그 페이지</h2>
      </div>
      <div className="p-2">
        {Array.from({ length: 12 }).map((_, idx) => (
          <FutureLog month={idx + 1} className="border-b-2 last:border-b-0" />
        ))}
      </div>
    </div>
  );
};
