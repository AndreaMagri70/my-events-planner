"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateInviteLink } from "@/lib/actions/invite";
import { Copy, Check, Link } from "lucide-react";

export function InviteLinkBox({ eventId }: { eventId: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const inviteUrl = token
    ? `${window.location.origin}/invite/${token}`
    : null;

  async function handleGenerate() {
    setLoading(true);
    const t = await generateInviteLink(eventId);
    setToken(t);
    setLoading(false);
  }

  async function handleCopy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Link className="h-4 w-4 text-primary" />
        <p className="font-semibold text-sm">Invite Link</p>
      </div>

      <p className="text-xs text-muted-foreground">
        Share this link with guests so they can RSVP to your event.
      </p>

      {inviteUrl ? (
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded bg-muted px-3 py-2 text-xs">
            {inviteUrl}
          </code>
          <Button size="icon" variant="outline" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" disabled={loading} onClick={handleGenerate}>
          {loading ? "Generating..." : "Generate Link"}
        </Button>
      )}
    </div>
  );
}