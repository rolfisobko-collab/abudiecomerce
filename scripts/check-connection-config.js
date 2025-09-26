require('dotenv').config();

console.log('🔍 [CONFIG DEBUG] Verificando configuración de conexión...');
console.log('🔍 [CONFIG DEBUG] MONGODB_URI configurada:', process.env.MONGODB_URI ? 'SÍ' : 'NO');

if (process.env.MONGODB_URI) {
  console.log('🔍 [CONFIG DEBUG] URI completa:', process.env.MONGODB_URI);
  
  // Extraer información de la URI sin mostrar credenciales
  const uri = process.env.MONGODB_URI;
  if (uri.includes('mongodb.net')) {
    console.log('☁️ [CONFIG DEBUG] Conectando a MongoDB Atlas (nube)');
  } else if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
    console.log('🏠 [CONFIG DEBUG] Conectando a MongoDB local');
  } else {
    console.log('❓ [CONFIG DEBUG] Tipo de conexión desconocido');
  }
  
  // Extraer nombre de la base de datos
  const dbMatch = uri.match(/\/([^?]+)/);
  if (dbMatch) {
    console.log('📊 [CONFIG DEBUG] Base de datos:', dbMatch[1]);
  }
} else {
  console.log('❌ [CONFIG DEBUG] No hay URI configurada');
}

console.log('🔍 [CONFIG DEBUG] Variables de entorno disponibles:');
Object.keys(process.env).forEach(key => {
  if (key.includes('MONGO') || key.includes('DB') || key.includes('ATLAS')) {
    console.log(`  ${key}: ${process.env[key] ? 'Configurada' : 'No configurada'}`);
  }
});
