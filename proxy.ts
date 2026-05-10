import { NextRequest, NextResponse } from 'next/server';

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Applica la protezione SOLO se il percorso inizia con /dashboard
    if (pathname.startsWith('/dashboard')) {
        const { auth } = await import("@/lib/auth/server");
        
        // Esegue il controllo di autenticazione
        return auth.middleware({ 
            loginUrl: "/auth/sign-in" 
        })(request);
    }

    // 2. Per tutte le altre rotte (Home, CSS, JS, immagini, etc.)
    // lascia passare la richiesta senza filtri
    return NextResponse.next();
}
