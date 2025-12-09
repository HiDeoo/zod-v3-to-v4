import { z } from "astro/zod";

export const schema = z.object({
  email: z.email(),
});
