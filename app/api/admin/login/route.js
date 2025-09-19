import { NextResponse } from "next/server";
import { verifyAdminCredentials, createAdminSession } from "@/lib/adminAuth";

export async function POST(request) {
    try {
        console.log('🔍 [ADMIN LOGIN API DEBUG] Iniciando proceso de login admin...');
        
        const { username, password } = await request.json();
        console.log('🔍 [ADMIN LOGIN API DEBUG] Datos recibidos:', { username });

        if (!username || !password) {
            console.log('❌ [ADMIN LOGIN API DEBUG] Datos faltantes');
            return NextResponse.json({ success: false, message: "Usuario y contraseña son requeridos" });
        }

        console.log('🔍 [ADMIN LOGIN API DEBUG] Verificando credenciales...');
        const isValid = await verifyAdminCredentials(username, password);

        if (isValid) {
            console.log('✅ [ADMIN LOGIN API DEBUG] Credenciales válidas, creando sesión...');
            return createAdminSession();
        } else {
            console.log('❌ [ADMIN LOGIN API DEBUG] Credenciales inválidas');
            return NextResponse.json({ success: false, message: "Credenciales incorrectas" });
        }

    } catch (error) {
        console.log('❌ [ADMIN LOGIN API DEBUG] Error en el proceso:', error.message);
        return NextResponse.json({ success: false, message: error.message });
    }
}
