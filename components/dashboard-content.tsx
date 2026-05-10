import Link from "next/link";
import { Button } from "./ui/button";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "@/components/ui/badge";

export async function DashboardContent({ userId }: { userId: string }) {
  const rows = await prisma.event.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      date: true,
      location: true,
      rsvps: { select: { status: true } },
    },
  });

  const events = rows.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    location: e.location,
    rsvps: e.rsvps,
  }));


  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your Events</h1>
          <p className="text-sm text-muted-foreground">
            Track atendee responses and manage invite links.
          </p>
        </div>
        <Button asChild className="primary my-4">
          <Link href={"/events/new"}>Create Event</Link>
        </Button>
      </div> 

      {/* list of events */}

      {events.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No events yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create your first event to start collecting RSVPs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Card key={event.id} className="bg-zinc-500">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/events/${event.id}`}>View Event</Link>
                </Button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary" />
                  <Badge variant="secondary" />
                  <Badge variant="secondary" />
                </div>
                <p>
                {event.date 
                  ? new Date(event.date).toLocaleString() 
                  : "No date set"} 
                {event.location ? ` - ${event.location}` : ""}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}