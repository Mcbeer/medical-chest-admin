import { compareSync } from "bcrypt";
import { serialize } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  user: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies.token;
    const secret = new TextEncoder().encode(env.JSONWEBTOKEN_SECRET);

    if (!token) {
      throw new Error("No access token available");
    }

    const parsed = await jwtVerify(token, secret);

    if (typeof parsed === "string") {
      throw new Error("Thats strange");
    }

    return ctx.prisma.user.findFirst({
      where: {
        id: parsed.payload.id as string,
      },
    });
  }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(4).max(128),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const secret = new TextEncoder().encode(env.JSONWEBTOKEN_SECRET);
      // Find the user in DB
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (user === null || !user.password) {
        throw new Error("We cannot login with that...");
      }

      if (!compareSync(input.password, user.password)) {
        throw new Error("Password didn't match");
      }

      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + 60 * 60; // one hour

      // Lasts for 1 hour
      const token = await new SignJWT({
        id: user.id,
        name: user.name,
        username: user.username,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .setExpirationTime(exp)
        .sign(secret);

      // Lasts for 7 days
      const refreshToken = await new SignJWT({
        id: user.id,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .setExpirationTime(exp)
        .sign(secret);

      const serializedToken = serialize("token", token, {
        maxAge: 3600 * 3,
        path: "/",
      });

      const serializedRefreshToken = serialize("refresh_token", refreshToken, {
        maxAge: 86400 * 7,
        path: "/",
      });

      ctx.res.setHeader("Set-Cookie", [
        serializedToken,
        serializedRefreshToken,
      ]);

      return true;
    }),
});
