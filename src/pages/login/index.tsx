/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../utils/api";

const loginFormSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(4),
});

type LoginForm = z.infer<typeof loginFormSchema>;

const Login: NextPage = () => {
  const { mutateAsync } = api.auth.login.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const handleLogin = async (e: LoginForm) => {
    const result = await mutateAsync(e);

    console.log(result);
  };

  return (
    <section className="flex h-screen items-center justify-center bg-brand">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col items-center justify-center gap-4 rounded-md bg-white pr-8 pl-8 pb-14 pt-8"
      >
        <h1 className="text-2xl">Login</h1>
        <div className="grid grid-rows-2">
          <label className="text-sm">Brugernavn</label>
          <input
            className="rounded-sm bg-brand-opaque"
            {...register("username", { required: true })}
            type="text"
          />
        </div>
        <div className="grid grid-rows-2">
          <label className="text-sm">Password</label>
          <input
            className="rounded-sm bg-brand-opaque"
            {...register("password", { required: true })}
            type="password"
          />
        </div>

        {errors.username?.message && <span>This field is required</span>}

        <button type="submit">Sign in</button>
      </form>
      <Link href="/">Go to frontpage</Link>
    </section>
  );
};

export default Login;
