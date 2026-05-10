import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { EventForm } from "@/components/event-form";

export default async function NewEventPage() {
  const session = await getSession();
  const currentUser = session?.data?.user;

  if (!currentUser) redirect("/auth/sign-in");

  return <EventForm />;
}