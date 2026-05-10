"use client";

import Link from "next/link";
import { UserButton } from "@neondatabase/auth/react";
import { useEffect, useState } from "react";

export function NavbarActions() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Finché non è montato lato client, non renderizziamo il UserButton
  // Questo evita l'errore "Cannot read properties of undefined (reading 'useSession')"
  if (!mounted) {
    return (
      <nav className="flex items-center gap-4">
        <Link href="/dashboard" className="text-sm text-muted-foreground">
          Dashboard
        </Link>
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" /> {/* Placeholder */}
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      <Link href="/dashboard" className="text-sm text-muted-foreground">
        Dashboard
      </Link>
      <UserButton size="icon" />
    </nav>
  );
}
