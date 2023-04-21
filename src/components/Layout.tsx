import type { FC, PropsWithChildren } from "react";
import { api } from "../utils/api";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="grid h-screen grid-rows-layout overflow-hidden">
      <Topbar />

      <section className="h-full overflow-hidden pr-4 pl-4 pb-8 pt-8">
        {children}
      </section>
    </main>
  );
};

const Topbar = () => {
  const { data: userData } = api.auth.user.useQuery();
  return (
    <section className="flex items-center justify-between bg-brand pl-4 pr-4 pt-2 pb-2">
      <h1 className="text-2xl text-white">Medical Chest - Administration</h1>

      <div className="flex items-center justify-center rounded-sm border border-brand p-2 pr-4 pl-4 text-white">
        Logget ind som: {userData?.name}
      </div>
    </section>
  );
};
