import mongoose from "mongoose";

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
    console.log('🔍 [DB DEBUG] Iniciando conexión a la base de datos...')
    
    if (cached.conn) {
        console.log('✅ [DB DEBUG] Usando conexión existente a la base de datos')
        return cached.conn
    } 

    if (!cached.promise) {
        console.log('🔍 [DB DEBUG] Creando nueva conexión a MongoDB...')
        console.log('🔍 [DB DEBUG] URI de conexión:', process.env.MONGODB_URI ? 'URI configurada' : '❌ URI NO CONFIGURADA')
        
        const opts = {
            bufferCommands:false
        }

        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}`,opts).then( mongoose => {
            console.log('✅ [DB DEBUG] Conexión a MongoDB establecida exitosamente')
            return mongoose
        }).catch(error => {
            console.log('❌ [DB DEBUG] Error al conectar a MongoDB:', error.message)
            throw error
        })

    } 

    cached.conn = await cached.promise
    console.log('✅ [DB DEBUG] Conexión a la base de datos lista')
    return cached.conn

}

export default connectDB