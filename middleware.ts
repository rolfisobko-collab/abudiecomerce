import { NextResponse } from "next/server";

export function middleware(req) {
  console.log('🔍 [MIDDLEWARE DEBUG] Ruta:', req.nextUrl.pathname);
  
  // Solo proteger rutas de admin/seller con sistema separado
  if (req.nextUrl.pathname.startsWith('/seller')) {
    const adminSession = req.cookies.get('admin-session');
    console.log('🔍 [MIDDLEWARE DEBUG] Admin session:', adminSession ? 'Presente' : 'Ausente');
    
    if (!adminSession || adminSession.value !== 'authenticated') {
      console.log('❌ [MIDDLEWARE DEBUG] Acceso denegado a /seller - redirigiendo a admin-login');
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
    console.log('✅ [MIDDLEWARE DEBUG] Acceso autorizado a /seller');
  }
  
  // Permitir todo lo demás sin validación
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};