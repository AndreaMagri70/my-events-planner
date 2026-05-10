"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";

export async function generateInviteLink(eventId: string) {
  const session = await getSession();
  const userId = session?.data?.user?.id;

  if (!userId) throw new Error("Not authenticated");

  // Controlla che l'utente sia l'organizzatore dell'evento
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || event.userId !== userId) throw new Error("Unauthorized");

  // Se esiste già un invite per questo evento, lo riusa
  const existing = await prisma.invite.findFirst({
    where: { eventId, invitedById: userId },
  });
  if (existing) return existing.token;

  // Altrimenti ne crea uno nuovo
  const invite = await prisma.invite.create({
    data: {
      eventId,
      invitedById: userId,
    },
  });

  revalidatePath(`/events/${eventId}`);
  return invite.token;
}