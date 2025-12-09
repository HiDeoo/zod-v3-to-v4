import { z } from "astro:content";

export const schema = z.object({
  email: z.string().email(),
});
