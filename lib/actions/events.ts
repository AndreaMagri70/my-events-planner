"use server";

import { redirect } from "next/navigation";
import { getSession } from "../auth/server";
import { prisma } from "../prisma";

function parseCreateEvent(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 3 || title.length > 120) {
    throw new Error("Title must be between 3 and 120 characters.");
  }

  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const eventDateRaw = formData.get("eventDate");

  return {
    title,
    description: description.length ? description.slice(0, 2000) : "",
    location: location.length ? location.slice(0, 200) : "",
    date: eventDateRaw ? new Date(String(eventDateRaw)) : new Date(),
  };
}

export async function createEventAction(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  const user = session?.data?.user;

  // 1. Controllo autenticazione — return invece di throw
  if (!user || !user.email) {
    return { error: "Devi essere loggato per creare un evento." };
  }

  // 2. Parsing e validazione — catturiamo l'errore di parseCreateEvent
  let input;
  try {
    input = parseCreateEvent(formData);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Dati non validi." };
  }

  // 3. Sincronizzazione utente (upsert)
  const dbUser = await prisma.user.upsert({
    where: { email: user.email },
    update: { name: user.name },
    create: {
      email: user.email,
      name: user.name ?? "Utente Neon",
      id: user.id,
    },
  });

  // 4. Creazione evento
  let created;
  try {
    created = await prisma.event.create({
      data: {
        title: input.title,
        description: input.description,
        location: input.location,
        date: input.date,
        userId: dbUser.id,
        isPublic: true,
      },
    });
  } catch (error) {
    console.error("Errore creazione evento:", error);
    return { error: "Errore durante la creazione dell'evento." };
  }

  redirect(`/events/${created.id}`);
}