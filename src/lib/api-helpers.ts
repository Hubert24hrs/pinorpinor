import { getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Returns the authenticated session or a 401 response.
 * Usage:
 *   const { session, error } = await requireAuth();
 *   if (error) return error;
 */
export async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, error: null };
}

/**
 * Computes age from a Date object.
 */
export function computeAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Returns true if the given birthDate represents someone 18+.
 */
export function isAdult(birthDate: Date): boolean {
  return computeAge(birthDate) >= 18;
}
