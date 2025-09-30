import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const checkDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Verificando base de datos...');
    
    // Listar todas las colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Colecciones encontradas:', collections.map(c => c.name));
    
    // Verificar colección de productos
    const productCollections = collections.filter(c => c.name.includes('product'));
    console.log('📦 Colecciones de productos:', productCollections.map(c => c.name));
    
    // Buscar en todas las colecciones que contengan 'product'
    for (const collection of productCollections) {
      const Product = mongoose.model('product', new mongoose.Schema({}, { strict: false }), collection.name);
      const count = await Product.countDocuments();
      console.log(`📊 ${collection.name}: ${count} documentos`);
      
      if (count > 0) {
        const sample = await Product.findOne();
        console.log(`📄 Ejemplo de documento en ${collection.name}:`, {
          name: sample.name,
          minQuantity: sample.minQuantity,
          minWholesaleQuantity: sample.minWholesaleQuantity,
          brand: sample.brand
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

// Ejecutar verificación
checkDatabase();





