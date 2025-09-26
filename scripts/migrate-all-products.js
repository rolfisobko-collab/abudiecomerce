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

const migrateAllProducts = async () => {
  try {
    await connectDB();
    
    console.log('🔄 Iniciando migración completa de productos...');
    
    // Buscar todos los productos
    const allProducts = await Product.find({});
    
    console.log(`📊 Encontrados ${allProducts.length} productos total`);
    
    let migrated = 0;
    
    for (const product of allProducts) {
      let updateData = {};
      
      // Si tiene minQuantity, copiarlo a minWholesaleQuantity
      if (product.minQuantity !== undefined) {
        updateData.minWholesaleQuantity = product.minQuantity;
        updateData.$unset = { minQuantity: 1 };
      } else if (product.minWholesaleQuantity === undefined || product.minWholesaleQuantity === null) {
        // Si no tiene ninguno, poner 1 por defecto
        updateData.minWholesaleQuantity = 1;
      }
      
      // Si tiene brand vacío o undefined, poner 'Sin marca'
      if (!product.brand || product.brand === '') {
        updateData.brand = 'Sin marca';
      }
      
      if (Object.keys(updateData).length > 0) {
        await Product.findByIdAndUpdate(product._id, updateData);
        migrated++;
        console.log(`✅ Migrado producto: ${product.name}`);
        console.log(`   - minWholesaleQuantity: ${updateData.minWholesaleQuantity || product.minWholesaleQuantity || 1}`);
        if (updateData.brand) {
          console.log(`   - brand: ${updateData.brand}`);
        }
      }
    }
    
    console.log(`🎉 Migración completada! ${migrated} productos migrados`);
    
    // Verificar que la migración fue exitosa
    const withMinQuantity = await Product.countDocuments({ minQuantity: { $exists: true } });
    const withMinWholesaleQuantity = await Product.countDocuments({ minWholesaleQuantity: { $exists: true, $ne: null } });
    const withoutBrand = await Product.countDocuments({ $or: [{ brand: { $exists: false } }, { brand: '' }, { brand: null }] });
    
    console.log(`📈 Verificación:`);
    console.log(`   - Productos con minQuantity (debería ser 0): ${withMinQuantity}`);
    console.log(`   - Productos con minWholesaleQuantity: ${withMinWholesaleQuantity}`);
    console.log(`   - Productos sin marca: ${withoutBrand}`);
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

// Ejecutar migración
migrateAllProducts();




