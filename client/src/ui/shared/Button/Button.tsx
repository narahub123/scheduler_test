import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

export type ReactButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export type ButtonProps = ReactButtonProps & {};

export const Button: FC<ButtonProps> = ({
  className: _className,
  ...buttonProps
}) => {
  const className = ["btn", _className].join(" ");
  return <button {...buttonProps} className={className} />;
};
