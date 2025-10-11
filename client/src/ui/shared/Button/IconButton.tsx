import type { FC } from "react";
import {
  createIcon,
  lucideRegistry,
  reactIconsRegistry,
  type LucideName,
  type ReactIconsName,
} from "../Icon";
import { Button } from "./Button";

type IconVendor =
  | { vendor: "lucide"; name: LucideName }
  | { vendor: "react"; name: ReactIconsName };

type IconButtonProps = IconVendor & {
  label: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

// 바운드된 Icon
const { Icon: LucideIcon } = createIcon(lucideRegistry);
const { Icon: ReactIcon } = createIcon(reactIconsRegistry);

export const IconButton: FC<IconButtonProps> = ({
  vendor,
  name,
  label,
  ...rest
}) => {
  return (
    <Button title={label} {...rest}>
      {vendor === "lucide" ? (
        <LucideIcon name={name} />
      ) : (
        <ReactIcon name={name} />
      )}
    </Button>
  );
};
