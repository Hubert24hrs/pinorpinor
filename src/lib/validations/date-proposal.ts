import { z } from "zod";

export const dateProposalSchema = z.object({
  matchId: z.string().min(1),
  proposedTime: z.string().datetime(),
  locationName: z.string().min(1).max(200),
  locationNote: z.string().max(500).optional(),
});

export const dateResponseSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "RESCHEDULED", "CANCELLED"]),
  // For rescheduled — new proposed time / location
  proposedTime: z.string().datetime().optional(),
  locationName: z.string().max(200).optional(),
  locationNote: z.string().max(500).optional(),
});

export type DateProposalInput = z.infer<typeof dateProposalSchema>;
export type DateResponseInput = z.infer<typeof dateResponseSchema>;
