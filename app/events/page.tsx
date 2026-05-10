import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { PaginationControls } from "@/components/pagination-controls";

const PAGE_SIZE = 12;

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams ?? {};
  const currentPage = Math.max(1, Number(page) || 1);

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      orderBy: { date: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        rsvps: { select: { status: true } },
      },
    }),
    prisma.event.count(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Events</h1>
          <p className="text-sm text-muted-foreground">
            {total} event{total !== 1 ? "s" : ""} available
          </p>
        </div>
        <Button asChild>
          <Link href="/events/new">Create Event</Link>
        </Button>
      </div>

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
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const going = event.rsvps.filter((r) => r.status === "GOING").length;
              const maybe = event.rsvps.filter((r) => r.status === "MAYBE").length;
              const notGoing = event.rsvps.filter((r) => r.status === "NOT_GOING").length;

              return (
                <Card key={event.id} className="flex flex-col justify-between border-1 border-solid border-white!">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                      <Button size="sm" asChild>
                        <Link href={`/events/${event.id}`}>View</Link>
                      </Button>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        {event.date
                          ? new Date(event.date).toLocaleString("it-IT")
                          : "No date set"}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0" />
                          {event.location}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">✅ {going}</Badge>
                      <Badge variant="secondary">🤔 {maybe}</Badge>
                      <Badge variant="secondary">❌ {notGoing}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <PaginationControls currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}