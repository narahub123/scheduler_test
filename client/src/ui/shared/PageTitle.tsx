import type { FC } from "react";

interface PageTitleProps {
  text: string;
}

export const PageTitle: FC<PageTitleProps> = ({ text }) => {
  return (
    <div className="w-full flex justify-center">
      <h2 className="p-4 font-bold text-xl">{text}</h2>
    </div>
  );
};
