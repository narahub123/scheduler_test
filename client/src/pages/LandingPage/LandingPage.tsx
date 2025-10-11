import { Link } from "react-router-dom";
import { Button } from "../../ui";

const LandingPage = () => {
  return (
    // screen과 full의 차이 정리 할 것
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full flex justify-center">
        <h2 className="p-4 font-bold text-xl">렌딩 페이지</h2>
      </div>
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 ">
        <Link to="/todos">
          <Button className="min-w-[150px] btn-primary">투두 리스트</Button>
        </Link>
        <Link to="/timelines">
          <Button className="min-w-[150px] btn-accent text-white">일정</Button>
        </Link>
        <Link to="/memos">
          <Button className="min-w-[150px] btn-info text-white">메모</Button>
        </Link>
        <Link to="diaries">
          <Button className="min-w-[150px] btn-secondary">일기</Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
