import type { BulletType } from "../../../pages";
import type { LogItem } from "../../future-log";
import type { SignifierType } from "../SignifierSelector";

export type BulletListApi = {
  // DOM 노드 관리
  getNode: (id: string) => HTMLDivElement | null;
  setNode: (id: string, el: HTMLDivElement | null) => void;

  // 필드 변경
  changeText: (id: string, text: string) => void;
  changeType: (id: string, t: BulletType) => void;
  changeSignifier: (id: string, s: SignifierType) => void;

  // 편집 동작
  split: (id: string) => void; // Enter(분할)
  mergePrev: (id: string) => void; // Backspace at start(위와 병합)
  movePrev: (id: string, column: number) => void; // ↑ 이동(열 유지)
  moveNext: (id: string, column: number) => void; // ↓ 이동(열 유지)
  indentDelta: (id: string, delta: 1 | -1) => void; // Tab/Shift+Tab

  // 포커스/캐럿
  setCaret: (id: string, index: number) => void;

  // 리스트 교체
  replaceAll: (next: LogItem[]) => void;
};
