import type { FC } from "react";

interface GoalTitleProps {
  text: string;
}

export const GoalTitle: FC<GoalTitleProps> = ({ text }) => {
  return (
    <div className="w-full flex justify-center">
      <h3 className="p-2 font-bold text-lg">{text}</h3>
    </div>
  );
};
