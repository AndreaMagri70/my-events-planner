import { DashboardContent } from "@/components/dashboard-content"
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession()

  // Se non c'è sessione o c'è un errore, manda al login
  if (!session?.data) {
    redirect("/login")
  }

  return <DashboardContent userId={session.data.user.id} />
}