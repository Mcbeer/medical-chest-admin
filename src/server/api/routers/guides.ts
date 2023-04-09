import { randomUUID } from "crypto";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const guideSchema = z.object({
  id: z.string().min(1),
  groupNumber: z.number(),
  groupName: z.string(),
  name: z.string(),
  form: z.string(),
  effect: z.string(),
  dosage: z.string(),
  sideEffects: z.string(),
  validity: z.string(),
  storage: z.string(),
  remarks: z.string(),
  lang: z.string(),
});

export const guidesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.guide.findMany()),
  addGuides: publicProcedure
    .input(z.array(guideSchema))
    .mutation(async ({ input, ctx }) => {
      // Deleting all guides we have at the moment
      await ctx.prisma.guide.deleteMany();

      // Rework this to be a batch insert instead, but since we use
      // sqlite, we can't for now
      for (const guide of input) {
        const { id, ...rest } = guide;

        await ctx.prisma.guide.create({
          data: {
            ...rest,
            id: randomUUID(),
            guideNumber: id,
          },
        });
      }

      return true;
    }),
});
