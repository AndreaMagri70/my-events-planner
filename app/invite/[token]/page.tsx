import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/server";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RSVPButton } from "@/components/rsvp-button";
import Link from "next/link";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const invite = await prisma.invite.findUnique({
    where: { token },
    include: {
      event: { include: { user: true } },
    },
  });

  if (!invite) notFound();

  const event = invite.event;
  const session = await getSession();
  const currentUser = session?.data?.user;

  // Recupera RSVP esistente se l'utente è loggato
  const existingRsvp = currentUser
    ? await prisma.rSVP.findUnique({
        where: { userId_eventId: { userId: currentUser.id, eventId: event.id } },
      })
    : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">

          {/* Header */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">You're invited to</p>
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="text-sm text-muted-foreground">
              Hosted by <span className="font-medium text-foreground">{event.user?.name || "Unknown"}</span>
            </p>
          </div>

          <Separator />

          {/* Event Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CalendarDays className="h-4 w-4 mt-0.5 text-primary" />
              <p className="text-sm">
                {event.date.toLocaleDateString("it-IT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-primary" />
              <p className="text-sm">{event.location || "Online / To be decided"}</p>
            </div>

            {event.maxAttendees && (
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 mt-0.5 text-primary" />
                <p className="text-sm">{event.maxAttendees} people max</p>
              </div>
            )}
          </div>

          <Separator />

          {/* RSVP */}
          {currentUser ? (
            <RSVPButton
              eventId={event.id}
              initialStatus={existingRsvp?.status ?? null}
            />
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">
                Sign in to confirm your attendance.
              </p>
              <Button asChild className="w-full">
                {/* Dopo il login torna su questo link */}
                <Link href={`/sign-in?redirect=/invite/${token}`}>
                  Sign in to RSVP
                </Link>
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}