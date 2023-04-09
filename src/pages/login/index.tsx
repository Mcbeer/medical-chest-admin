/* eslint-disable @typescript-eslint/no-misused-promises */
import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";

const Login: NextPage = () => {
  const { data, status } = useSession();

  console.log(data, status);

  const handleLogin = async () => {
    await signIn().then(console.log);
  };

  return (
    <section className="flex h-screen items-center justify-center bg-brand">
      <div className="flex flex-col items-center justify-center gap-4 rounded-md bg-white pr-8 pl-8 pb-14 pt-8">
        <h1 className="text-2xl">Login</h1>
        <div className="grid grid-rows-2">
          <label className="text-sm">Brugernavn</label>
          <input className="rounded-sm bg-brand-opaque" type="text" />
        </div>
        <div className="grid grid-rows-2">
          <label className="text-sm">Password</label>
          <input className="rounded-sm bg-brand-opaque" type="password" />
        </div>

        <button onClick={handleLogin}>Sign in</button>
      </div>
    </section>
  );
};

export default Login;
