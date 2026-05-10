"use client";

import { authClient } from "@/lib/auth/client";
import { NeonAuthUIProvider } from "@neondatabase/auth/react"; // Controlla il nome esatto del pacchetto


export default function NeonAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider authClient={authClient} emailOTP>
      {children}
    </NeonAuthUIProvider>
  );
}