import { createIcon } from "./createIcon";
// ✅ 원하는 벤더 레지스트리 한 줄만 바꾸면 됨
import { reactIconsRegistry } from "./registries";

export * from "./createIcon";
export * from "./registries";
export * from "./types";

export const { Icon, IconProvider } = createIcon(reactIconsRegistry);
export type IconName = keyof typeof reactIconsRegistry;
