import { z } from "zod";

export const profileUpdateSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  tagline: z.string().max(100).optional(),
  height: z.string().max(20).optional(),
  ethnicity: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  relationshipIntent: z.enum(["CASUAL", "SERIOUS", "FRIENDS", "OPEN"]).optional(),
  dateTypes: z.array(z.string()).max(10).optional(),
  isAvailableToday: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  isDiscoverable: z.boolean().optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
