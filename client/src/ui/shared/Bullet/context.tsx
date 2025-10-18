import { createContext, useContext } from "react";
import type { BulletListApi } from "./types";

const BulletContext = createContext<BulletListApi | null>(null);

export const useBulletApi = () => {
  const v = useContext(BulletContext);
  if (!v) throw new Error("BulletContext 미제공");
  return v;
};

export const BulletProvider: React.FC<{
  api: BulletListApi;
  children: React.ReactNode;
}> = ({ api, children }) => {
  return (
    <BulletContext.Provider value={api}>{children}</BulletContext.Provider>
  );
};
