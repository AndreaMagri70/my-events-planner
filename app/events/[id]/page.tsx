import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalendarDays, MapPin, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { RSVPButton } from "@/components/rsvp-button";
import { getSession } from "@/lib/auth/server";
import { InviteLinkBox } from "@/components/invite-link-box";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const currentUser = session?.data?.user;

  const [event, existingRsvp] = await Promise.all([
    prisma.event.findUnique({
      where: { id },
      include: { user: true },
    }),
    currentUser
      ? prisma.rSVP.findUnique({
          where: { userId_eventId: { userId: currentUser.id, eventId: id } },
        })
      : null,
  ]);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container max-w-5xl py-6">
        <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Event</Badge>
                {event.isPublic && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Public</Badge>}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                {event.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                Hosted by <span className="font-semibold text-foreground">{event.user?.name || "User"}</span>
              </p>
            </div>

            {/* Event Image Placeholder */}
            <div className="aspect-video w-full rounded-xl bg-muted flex items-center justify-center border-2 border-dashed">
              <span className="text-muted-foreground">Event Image Placeholder</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">About this event</h2>
              <p className="text-base leading-7 text-muted-foreground whitespace-pre-wrap">
                {event.description || "No description provided for this event."}
              </p>
            </div>
          </div>

          {/* Sidebar Info Card */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Date and time</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date.toLocaleDateString('it-IT', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {event.location || "Online / To be decided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">
                        {event.maxAttendees ? `${event.maxAttendees} people max` : "Unlimited space"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Invite Link — visibile solo all'organizzatore */}
                {currentUser?.id === event.userId && (
                  <InviteLinkBox eventId={id} />
                )}

                <div className="space-y-3">
                  {currentUser ? (
                    <RSVPButton
                      eventId={id}
                      initialStatus={existingRsvp?.status ?? null}
                    />
                  ) : (
                    <Button asChild className="w-full text-md font-semibold py-6">
                      <Link href="/sign-in">Sign in to RSVP</Link>
                    </Button>
                  )}
                  <p className="text-xs text-center text-muted-foreground">
                    By joining, you agree to the event guidelines.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}