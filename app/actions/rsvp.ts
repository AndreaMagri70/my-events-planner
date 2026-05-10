"use server";

import { prisma } from "@/lib/prisma";
import { RSVPStatus } from "../../generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/server";

export async function upsertRSVP(eventId: string, status: RSVPStatus) {
  const session = await getSession();
  const userId = session?.data?.user?.id;

  if (!userId) throw new Error("Not authenticated");

  await prisma.rSVP.upsert({
    where: { userId_eventId: { userId, eventId } },
    update: { status },
    create: { userId, eventId, status },
  });

  revalidatePath(`/events/${eventId}`);
}