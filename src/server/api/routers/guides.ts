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
  getAll: publicProcedure.query(async ({ ctx }) => {
    const guides = await ctx.prisma.guide.findMany();

    return guides.sort((a, b) => compareIds(a.guideNumber, b.guideNumber));
  }),
  addGuides: publicProcedure
    .input(z.array(guideSchema))
    .mutation(async ({ input, ctx }) => {
      // Soft deleting all guides we have at the moment
      await ctx.prisma.guide.updateMany({
        data: {
          deletedAt: new Date().toISOString(),
        },
      });

      // Find out how to add guideNumber and lang as indexes, so we can use the built-in
      // version of upsert
      for (const { id, ...rest } of input) {
        const dbGuide = await ctx.prisma.guide.findFirst({
          where: {
            guideNumber: id,
            lang: rest.lang,
          },
        });

        if (dbGuide) {
          await ctx.prisma.guide.update({
            data: {
              ...rest,
              deletedAt: null,
            },
            where: {
              id: dbGuide.id,
            },
          });
        } else {
          await ctx.prisma.guide.create({
            data: {
              ...rest,
              id: randomUUID(),
              guideNumber: id,
            },
          });
        }
      }

      return true;
    }),
});

// This is incredibly slow, but it's "Good enough"
function compareIds(a: string, b: string) {
  const aParts = a.split(".").map(Number);
  const bParts = b.split(".").map(Number);
  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    const diff = (aParts?.[i] ?? 0) - (bParts?.[i] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return aParts.length - bParts.length;
}
