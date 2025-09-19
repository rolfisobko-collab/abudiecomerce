import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/adminAuth";

export async function POST(request) {
    try {
        console.log('🔍 [ADMIN LOGOUT API DEBUG] Cerrando sesión de admin...');
        return destroyAdminSession();
    } catch (error) {
        console.log('❌ [ADMIN LOGOUT API DEBUG] Error al cerrar sesión:', error.message);
        return NextResponse.json({ success: false, message: error.message });
    }
}
