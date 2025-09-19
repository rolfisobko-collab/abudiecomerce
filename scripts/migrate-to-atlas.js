const mongoose = require('mongoose');

// Configuración de conexiones
const LOCAL_URI = 'mongodb://localhost:27017/quickcart';
const ATLAS_URI = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';

// Función para conectar a una base de datos
const connectDB = async (uri, name) => {
    try {
        const conn = await mongoose.createConnection(uri);
        console.log(`✅ Conectado a ${name}`);
        return conn;
    } catch (error) {
        console.error(`❌ Error conectando a ${name}:`, error.message);
        throw error;
    }
};

// Función para migrar una colección
const migrateCollection = async (localDB, atlasDB, collectionName, schema) => {
    try {
        console.log(`\n🔄 Migrando colección: ${collectionName}`);
        
        // Obtener datos de la base local
        const LocalModel = localDB.model(collectionName, schema);
        const localData = await LocalModel.find({});
        
        console.log(`📊 Encontrados ${localData.length} documentos en local`);
        
        if (localData.length === 0) {
            console.log(`⏭️  Colección ${collectionName} vacía, saltando...`);
            return;
        }
        
        // Limpiar colección en Atlas
        const AtlasModel = atlasDB.model(collectionName, schema);
        await AtlasModel.deleteMany({});
        console.log(`🧹 Colección ${collectionName} limpiada en Atlas`);
        
        // Insertar datos en lotes para mejor rendimiento
        const batchSize = 100;
        let inserted = 0;
        
        for (let i = 0; i < localData.length; i += batchSize) {
            const batch = localData.slice(i, i + batchSize);
            await AtlasModel.insertMany(batch, { ordered: false });
            inserted += batch.length;
            console.log(`📦 Insertados ${inserted}/${localData.length} documentos`);
        }
        
        console.log(`✅ Colección ${collectionName} migrada exitosamente`);
        
    } catch (error) {
        console.error(`❌ Error migrando ${collectionName}:`, error.message);
        throw error;
    }
};

// Función principal de migración
const migrateToAtlas = async () => {
    let localDB, atlasDB;
    
    try {
        console.log('🚀 Iniciando migración a MongoDB Atlas...\n');
        
        // Conectar a ambas bases de datos
        localDB = await connectDB(LOCAL_URI, 'Base de datos LOCAL');
        atlasDB = await connectDB(ATLAS_URI, 'MongoDB Atlas');
        
        // Definir esquemas para todas las colecciones
        const schemas = {
            products: new mongoose.Schema({
                userId: String,
                name: String,
                description: String,
                price: Number,
                offerPrice: Number,
                minWholesaleQuantity: Number,
                image: Array,
                category: String,
                brand: String,
                date: Number,
                averageRating: { type: Number, default: 0 },
                totalRatings: { type: Number, default: 0 },
                stock: { type: Number, default: 100 }
            }, { strict: false }),
            
            users: new mongoose.Schema({}, { strict: false }),
            orders: new mongoose.Schema({}, { strict: false }),
            categories: new mongoose.Schema({}, { strict: false }),
            brands: new mongoose.Schema({}, { strict: false }),
            ratings: new mongoose.Schema({}, { strict: false }),
            paymentmethods: new mongoose.Schema({}, { strict: false }),
            contactmessages: new mongoose.Schema({}, { strict: false }),
            adminusers: new mongoose.Schema({}, { strict: false }),
            addresses: new mongoose.Schema({}, { strict: false }),
            newsletters: new mongoose.Schema({}, { strict: false }),
            ctas: new mongoose.Schema({}, { strict: false })
        };
        
        // Migrar todas las colecciones
        const collections = Object.keys(schemas);
        for (const collectionName of collections) {
            await migrateCollection(localDB, atlasDB, collectionName, schemas[collectionName]);
        }
        
        console.log('\n🎉 ¡Migración completada exitosamente!');
        console.log('📊 Resumen:');
        
        // Verificar datos migrados
        for (const collectionName of collections) {
            const AtlasModel = atlasDB.model(collectionName, schemas[collectionName]);
            const count = await AtlasModel.countDocuments();
            console.log(`   ${collectionName}: ${count} documentos`);
        }
        
    } catch (error) {
        console.error('❌ Error durante la migración:', error.message);
        throw error;
    } finally {
        // Cerrar conexiones
        if (localDB) await localDB.close();
        if (atlasDB) await atlasDB.close();
        console.log('\n🔌 Conexiones cerradas');
    }
};

// Ejecutar migración
if (require.main === module) {
    migrateToAtlas()
        .then(() => {
            console.log('\n✅ Migración finalizada');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Migración falló:', error.message);
            process.exit(1);
        });
}

module.exports = { migrateToAtlas };
