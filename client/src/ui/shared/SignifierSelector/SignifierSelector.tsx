import type { FC } from "react";
import type { SignifierOpitionType, SignifierType } from "./types";

interface SignifierSelectorProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  signifier: SignifierType;
  options: SignifierOpitionType[];
}

export const SignifierSelector: FC<SignifierSelectorProps> = ({
  signifier,
  options,
  onChange,
}) => {
  return (
    <select
      name="signifier"
      id="signifier"
      onChange={onChange}
      value={signifier}
      className="appearance-none outline-0"
    >
      {options.map((option) => {
        const { value, title, symbol } = option;
        return (
          <option value={value} key={value} title={title}>
            {symbol}
          </option>
        );
      })}
    </select>
  );
};
