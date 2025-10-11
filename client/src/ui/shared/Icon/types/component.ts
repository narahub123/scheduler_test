import React from "react";

/** 서드파티 아이콘 컴포넌트 시그니처(원문 그대로) */
export type IconCmp = React.ComponentType<{
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}>;

/** 상호작용 금지(원문 그대로) */
export type DisallowInteractiveProps = {
  onClick?: never;
  onKeyDown?: never;
  onKeyUp?: never;
  onKeyPress?: never;
  onMouseDown?: never;
  onMouseUp?: never;
  onPointerDown?: never;
  onPointerUp?: never;
  onTouchStart?: never;
  onTouchEnd?: never;
  role?: never;
  tabIndex?: never;
};

/** BaseIconProps 제네릭(원문 그대로) */
export type BaseIconProps<Name extends string> = DisallowInteractiveProps & {
  name: Name;
  /** 숫자(px) 또는 문자열("1em" 등) */
  size?: number | string;
  color?: string; // 기본 currentColor
  strokeWidth?: number;
  className?: string; // Tailwind 클래스
  style?: React.CSSProperties;

  /** 장식용 여부(기본 true). false면 aria-label 또는 title 필수 */
  decorative?: boolean;
  "aria-label"?: string;
  title?: string;
};
