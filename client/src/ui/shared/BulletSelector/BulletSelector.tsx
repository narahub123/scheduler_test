import type { FC } from "react";
import type { LoggingType } from "../../../pages";
import type { BulletOptionType } from "../../../data";

interface BulletSelectorProps {
  handleLoggingTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loggingType: LoggingType;
  options: BulletOptionType[];
}

export const BulletSelector: FC<BulletSelectorProps> = ({
  handleLoggingTypeChange,
  loggingType,
  options = [],
}) => {
  return (
    <select
      onChange={handleLoggingTypeChange}
      value={loggingType}
      className="appearance-none outline-0 inline-block h-6"
    >
      {options.map((option) => (
        <option value={option.value} title={option.title} key={option.value}>
          {option.symbol}
        </option>
      ))}
    </select>
  );
};
