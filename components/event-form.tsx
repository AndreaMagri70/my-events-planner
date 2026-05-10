"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEventAction } from "@/lib/actions/events";
import Link from "next/link";

export function EventForm() {
  const [state, formAction, isPending] = useActionState(createEventAction, null);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <Label htmlFor="title">Event Name</Label>
                <Input id="title" name="title" required placeholder="Team dinner..." />
              </Field>

              <Field>
                <Label htmlFor="description">Event Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event..."
                />
              </Field>

              <Field>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Optional location for your event..."
                />
              </Field>

              <Field>
                <Label htmlFor="eventDate">Event Date and time</Label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="datetime-local"
                />
                <FieldDescription>You can add this later!</FieldDescription>
              </Field>

              {/* Errore dalla Server Action */}
              {state?.error && (
                <p className="text-sm text-red-500">{state.error}</p>
              )}

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Event"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}