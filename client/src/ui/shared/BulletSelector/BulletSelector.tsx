import type { FC } from "react";
import type { BulletType } from "../../../pages";
import type { BulletOptionType } from "../../../data";

interface BulletSelectorProps {
  handleLoggingTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  bullet: BulletType;
  options: BulletOptionType[];
}

export const BulletSelector: FC<BulletSelectorProps> = ({
  handleLoggingTypeChange,
  bullet,
  options = [],
}) => {
  return (
    <select
      onChange={handleLoggingTypeChange}
      value={bullet}
      className={`appearance-none outline-0 inline-block h-6 cursor-pointer ${
        bullet === "irrelevant" ? "line-through" : ""
      }`}
    >
      {options.map((option) => (
        <option value={option.value} title={option.title} key={option.value}>
          {option.symbol}
        </option>
      ))}
    </select>
  );
};
