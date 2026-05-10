// components/providers/client-side-provider.tsx
"use client";

import dynamic from "next/dynamic";

const NeonAuthProvider = dynamic(
  () => import("@/components/providers/neon-auth-provider"),
  { ssr: false }
);

export function ClientSideProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthProvider>
      {/* altri provider client-side qui */}
      {children}
    </NeonAuthProvider>
  );
}