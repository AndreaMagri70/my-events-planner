import { auth } from "@/lib/auth/server";

// Non passare 'req' a handler, chiamalo come funzione per ottenere GET e POST
export const { GET, POST } = auth.handler();
