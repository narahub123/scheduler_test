import { FaHome, FaSearch, FaUser, FaTimes, FaSpinner } from "react-icons/fa";

// react-icons는 보통 size/color prop을 쓰지만, 우리 Icon은 width/height/color를 기대하므로
// 간단 어댑터로 시그니처만 맞춰줍니다.
import type { ComponentType } from "react";

function adapt(Comp: any): ComponentType<{
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  children?: React.ReactNode;
}> {
  return (props: any) => {
    const { width, height, color, className } = props;
    const size = width ?? height; // 둘 중 하나로 크기 결정
    // react-icons는 children을 무시하므로 title 주입이 필요하면 별도 처리(선택)
    return <Comp size={size} color={color} className={className} />;
  };
}

export const reactIconsRegistry = {
  home: adapt(FaHome),
  search: adapt(FaSearch),
  user: adapt(FaUser),
  close: adapt(FaTimes),
  spinner: adapt(FaSpinner),
} as const;

export type ReactIconsName = keyof typeof reactIconsRegistry;
