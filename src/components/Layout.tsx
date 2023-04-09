/* eslint-disable @typescript-eslint/no-misused-promises */
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { FC, PropsWithChildren } from "react";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { status, data } = useSession();
  console.log(data, status);

  if (status === "unauthenticated") {
    return (
      <>
        <div>Du er ikke logget ind</div>
        <Link href="/api/auth/signin">Log ind her</Link>
      </>
    );
  }

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
  const { data: session } = useSession();
  return (
    <section className="flex items-center justify-between bg-brand pl-4 pr-4 pt-2 pb-2">
      <h1 className="text-2xl text-white">Medical Chest - Administration</h1>

      <div className="flex items-center justify-center rounded-sm border border-brand p-2 pr-4 pl-4 text-white">
        Logget ind som: {session?.user?.name}
      </div>
    </section>
  );
};
