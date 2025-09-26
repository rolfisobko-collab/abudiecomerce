import { NextResponse } from "next/server";

// Mapeo de rutas a permisos
const ROUTE_PERMISSIONS = {
  '/seller': 'addProduct',
  '/seller/product-list': 'productList',
  '/seller/categories': 'categories',
  '/seller/brands': 'brands',
  '/seller/orders': 'orders',
  '/seller/payment-methods': 'paymentMethods',
  '/seller/communications': 'communications',
  '/seller/admin-users': 'adminUsers',
  // '/seller/whatsapp': 'whatsapp' // WhatsApp accesible para todos los admins
};

export function middleware(req) {
  console.log('🔍 [MIDDLEWARE DEBUG] Ruta:', req.nextUrl.pathname);
  
  // Solo proteger rutas de seller con sistema separado
  if (req.nextUrl.pathname.startsWith('/seller')) {
    const adminSession = req.cookies.get('admin-session');
    console.log('🔍 [MIDDLEWARE DEBUG] Admin session:', adminSession ? 'Presente' : 'Ausente');
    
    if (!adminSession || adminSession.value !== 'authenticated') {
      console.log('❌ [MIDDLEWARE DEBUG] Acceso denegado a', req.nextUrl.pathname, '- redirigiendo a admin-login');
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
    
    // Excepción para WhatsApp - accesible para todos los admins
    if (req.nextUrl.pathname === '/seller/whatsapp') {
      console.log('✅ [MIDDLEWARE DEBUG] WhatsApp accesible para todos los admins');
      return NextResponse.next();
    }
    
    // Verificar permisos específicos para otras rutas
    const userPermissions = req.cookies.get('admin-permissions');
    if (userPermissions) {
      try {
        const permissions = JSON.parse(userPermissions.value);
        const requiredPermission = ROUTE_PERMISSIONS[req.nextUrl.pathname];
        
        if (requiredPermission && !permissions[requiredPermission]) {
          console.log('❌ [MIDDLEWARE DEBUG] Sin permiso para:', req.nextUrl.pathname, 'Permiso requerido:', requiredPermission);
          return NextResponse.redirect(new URL('/seller?error=no-permission', req.url));
        }
      } catch (error) {
        console.log('❌ [MIDDLEWARE DEBUG] Error al parsear permisos:', error);
      }
    }
    
    console.log('✅ [MIDDLEWARE DEBUG] Acceso autorizado a', req.nextUrl.pathname);
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