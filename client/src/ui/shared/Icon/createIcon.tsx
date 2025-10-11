import React, { createContext, useContext, useId } from "react";
import type { BaseIconProps, IconCmp } from "./types";

/**
 * 레지스트리를 인자로 받아 **타입이 바인딩된 Icon/Provider를 생성**합니다.
 *
 * 왜 필요한가?
 * 1) **타입 안전(name 제한)**: 넘겨 받은 `registry`의 키를 `keyof REG`로 추론해
 *    `name` 프로퍼티를 해당 키 유니온으로 **컴파일 타임에 제한**합니다.
 *    → 레지스트리에 없는 문자열을 쓰면 **즉시 타입 에러**가 납니다.
 *
 * 2) **편의성(Context 주입)**: 반환되는 `IconProvider`가 `registry`를 Context로 공급하므로
 *    매번 아이콘을 쓸 때마다 `registry`를 prop으로 넘길 필요가 없습니다.
 *
 * 3) **표시 전용 어댑터**: 반환되는 `Icon`은 클릭/키보드 등 **상호작용을 금지**하고,
 *    `size(number|string)` 처리, `currentColor` 상속, `<title>` 연결 등 **표시 전용 규칙**을 공통 적용합니다.
 *
 * 4) **교체 용이성**: 아이콘 세트를 바꾸고 싶다면 `createIcon(다른Registry)`만 호출하면
 *    나머지 사용 코드는 그대로입니다(레지스트리 교체로 전체 전환).
 *
 * @example
 *   // 1) 레지스트리 정의
 *   const registry = { check: Check, x: X } as const;
 *   // 2) 바운드된 Icon/Provider 생성
 *   const { Icon, IconProvider } = createIcon(registry);
 *   // 3) 사용: name은 "check" | "x" 로 제한됨
 *   <IconProvider>
 *     <Icon name="check" aria-hidden />
 *     // <Icon name="close" /> // ❌ 컴파일 에러
 *   </IconProvider>
 */
export const createIcon = <REG extends Record<string, IconCmp>>(
  registry: REG
) => {
  type IconName = keyof REG & string;
  type IconProps = BaseIconProps<IconName>;

  const Ctx = createContext(registry);

  const Icon = ({
    name,
    size = 20,
    color = "currentColor",
    strokeWidth,
    className,
    style,
    decorative = true,
    title,
    ...rest
  }: IconProps) => {
    const REG = useContext(Ctx);
    const Cmp = REG[name];
    if (!Cmp) {
      if (import.meta.env.NODE_ENV !== "production") {
        console.warn(`[Icon] unknown icon: ${name}`);
      }
      return <span aria-hidden="true" />;
    }

    const ariaLabel = (rest as any)["aria-label"] as string | undefined;
    if (
      !decorative &&
      !(ariaLabel || title) &&
      import.meta.env.NODE_ENV !== "production"
    ) {
      console.warn(`[Icon] non-decorative "${name}" needs aria-label or title`);
    }

    // 런타임 상호작용 차단용 안전 제거
    const {
      role,
      tabIndex,
      onClick,
      onKeyDown,
      onKeyUp,
      onKeyPress,
      onMouseDown,
      onMouseUp,
      onPointerDown,
      onPointerUp,
      onTouchStart,
      onTouchEnd,
      ...safeRest
    } = rest as Record<string, unknown>;

    const titleId = useId();
    const labelled = !decorative && (ariaLabel || title);

    // Tailwind 기본 클래스: 아이콘은 텍스트 색을 상속, 인터랙션 차단
    const base = "inline-flex align-middle pointer-events-none select-none";
    const cls = className ? `${base} ${className}` : base;

    // 숫자 size면 width/height props, 문자열이면 style로 적용
    const sizeNum = typeof size === "number" ? size : undefined;
    const sizeStyle =
      typeof size === "string" ? { width: size, height: size } : undefined;

    return (
      <Cmp
        width={sizeNum}
        height={sizeNum}
        color={color}
        strokeWidth={strokeWidth}
        className={cls}
        role={labelled ? "img" : undefined}
        aria-hidden={decorative ? true : undefined}
        aria-labelledby={title ? titleId : undefined}
        aria-label={ariaLabel}
        focusable={false}
        style={{ ...sizeStyle, ...style }}
        {...(safeRest as any)}
      >
        {title ? <title id={titleId}>{title}</title> : null}
      </Cmp>
    );
  };

  const IconProvider = ({ children }: { children: React.ReactNode }) => (
    <Ctx.Provider value={registry}>{children}</Ctx.Provider>
  );

  return { Icon, IconProvider };
};

export type { IconCmp };
