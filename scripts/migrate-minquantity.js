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

// Schema del producto (sin el modelo para evitar conflictos)
const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  minQuantity: { type: Number }, // Campo viejo
  minWholesaleQuantity: { type: Number }, // Campo nuevo
  image: { type: Array, required: false, default: [] },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  date: { type: Number, required: true }
});

const Product = mongoose.model('product', productSchema);

const migrateProducts = async () => {
  try {
    await connectDB();
    
    console.log('🔄 Iniciando migración de productos...');
    
    // Buscar todos los productos que tienen minQuantity pero no minWholesaleQuantity
    const productsToMigrate = await Product.find({
      minQuantity: { $exists: true },
      minWholesaleQuantity: { $exists: false }
    });
    
    console.log(`📊 Encontrados ${productsToMigrate.length} productos para migrar`);
    
    let migrated = 0;
    
    for (const product of productsToMigrate) {
      // Copiar minQuantity a minWholesaleQuantity
      await Product.findByIdAndUpdate(product._id, {
        $set: {
          minWholesaleQuantity: product.minQuantity
        },
        $unset: {
          minQuantity: 1
        }
      });
      
      migrated++;
      console.log(`✅ Migrado producto: ${product.name} (minQuantity: ${product.minQuantity} -> minWholesaleQuantity: ${product.minQuantity})`);
    }
    
    console.log(`🎉 Migración completada! ${migrated} productos migrados`);
    
    // Verificar que la migración fue exitosa
    const remainingOld = await Product.countDocuments({ minQuantity: { $exists: true } });
    const newField = await Product.countDocuments({ minWholesaleQuantity: { $exists: true } });
    
    console.log(`📈 Verificación:`);
    console.log(`   - Productos con minQuantity (debería ser 0): ${remainingOld}`);
    console.log(`   - Productos con minWholesaleQuantity: ${newField}`);
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

// Ejecutar migración
migrateProducts();





