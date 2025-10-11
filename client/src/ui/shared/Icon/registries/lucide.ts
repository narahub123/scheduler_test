import { Home, Search, User, X, Loader2 } from "lucide-react";

export const lucideRegistry = {
  home: Home,
  search: Search,
  user: User,
  close: X,
  spinner: Loader2,
} as const;

export type LucideName = keyof typeof lucideRegistry;