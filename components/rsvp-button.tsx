"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { upsertRSVP } from "@/app/actions/rsvp";
import { RSVPStatus } from "@/generated/prisma/client";

const statusConfig: Record<RSVPStatus, { label: string; className: string }> = {
  GOING: {
    label: "✅ Going",
    className: "bg-green-600 hover:bg-green-700 text-white",
  },
  NOT_GOING: {
    label: "❌ Not Going",
    className: "bg-red-500 hover:bg-red-600 text-white",
  },
  MAYBE: {
    label: "🤔 Maybe",
    className: "bg-yellow-500 hover:bg-yellow-600 text-white",
  },
};

interface RSVPButtonProps {
  eventId: string;
  initialStatus: RSVPStatus | null;
}

export function RSVPButton({ eventId, initialStatus }: RSVPButtonProps) {
  const [status, setStatus] = useState<RSVPStatus | null>(initialStatus);
  const [loading, setLoading] = useState(false);

  async function handleRSVP(newStatus: RSVPStatus) {
    setLoading(true);
    await upsertRSVP(eventId, newStatus);
    setStatus(newStatus);
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      {status ? (
        // Mostra lo stato attuale + opzione di cambiarlo
        <div className="space-y-2">
          <div className={`w-full text-center py-3 rounded-md font-semibold text-sm ${statusConfig[status].className}`}>
            {statusConfig[status].label}
          </div>
          <p className="text-xs text-center text-muted-foreground">Change your response:</p>
          <div className="flex gap-2">
            {(Object.keys(statusConfig) as RSVPStatus[])
              .filter((s) => s !== status)
              .map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  disabled={loading}
                  onClick={() => handleRSVP(s)}
                >
                  {statusConfig[s].label}
                </Button>
              ))}
          </div>
        </div>
      ) : (
        // Nessun RSVP ancora
        <div className="space-y-2">
          <p className="text-sm text-center text-muted-foreground font-medium">Will you attend?</p>
          <div className="flex gap-2">
            {(Object.keys(statusConfig) as RSVPStatus[]).map((s) => (
              <Button
                key={s}
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                disabled={loading}
                onClick={() => handleRSVP(s)}
              >
                {statusConfig[s].label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}