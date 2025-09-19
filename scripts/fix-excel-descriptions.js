const mongoose = require('mongoose');

// Conectar a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcart');
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

// Schema del producto
const productSchema = new mongoose.Schema({
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
});

const Product = mongoose.models.product || mongoose.model('product', productSchema);

// Función para corregir descripciones
const fixExcelDescriptions = async () => {
    try {
        console.log('🔍 Buscando productos con descripción "Producto importado desde Excel"...');
        
        // Buscar productos con esa descripción
        const productsWithExcelDesc = await Product.find({
            description: { $regex: /producto importado desde excel/i }
        });
        
        console.log(`📊 Encontrados ${productsWithExcelDesc.length} productos con descripción de Excel`);
        
        if (productsWithExcelDesc.length === 0) {
            console.log('✅ No hay productos con descripción de Excel que corregir');
            return;
        }
        
        // Mostrar algunos ejemplos
        console.log('\n📋 Ejemplos de productos encontrados:');
        productsWithExcelDesc.slice(0, 5).forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - "${product.description}"`);
        });
        
        // Actualizar descripciones
        console.log('\n🔄 Actualizando descripciones...');
        
        const updatePromises = productsWithExcelDesc.map(async (product) => {
            // Crear una descripción más apropiada basada en el nombre del producto
            let newDescription = '';
            
            if (product.name.toLowerCase().includes('iphone') || product.name.toLowerCase().includes('apple')) {
                newDescription = 'Smartphone de última generación con tecnología avanzada y diseño premium.';
            } else if (product.name.toLowerCase().includes('samsung')) {
                newDescription = 'Dispositivo Samsung con características innovadoras y rendimiento excepcional.';
            } else if (product.name.toLowerCase().includes('laptop') || product.name.toLowerCase().includes('notebook')) {
                newDescription = 'Laptop de alto rendimiento ideal para trabajo y entretenimiento.';
            } else if (product.name.toLowerCase().includes('auricular') || product.name.toLowerCase().includes('headphone')) {
                newDescription = 'Auriculares de alta calidad con excelente sonido y comodidad.';
            } else if (product.name.toLowerCase().includes('cámara') || product.name.toLowerCase().includes('camera')) {
                newDescription = 'Cámara profesional con características avanzadas para capturar momentos únicos.';
            } else if (product.name.toLowerCase().includes('tablet')) {
                newDescription = 'Tablet versátil perfecta para trabajo, estudio y entretenimiento.';
            } else if (product.name.toLowerCase().includes('smartwatch') || product.name.toLowerCase().includes('reloj')) {
                newDescription = 'Reloj inteligente con múltiples funciones y diseño moderno.';
            } else if (product.name.toLowerCase().includes('altavoz') || product.name.toLowerCase().includes('speaker')) {
                newDescription = 'Altavoz de alta fidelidad con sonido potente y calidad premium.';
            } else if (product.name.toLowerCase().includes('control') || product.name.toLowerCase().includes('gamepad')) {
                newDescription = 'Control de juego ergonómico con precisión y comodidad para gaming.';
            } else if (product.name.toLowerCase().includes('proyector')) {
                newDescription = 'Proyector de alta definición ideal para presentaciones y entretenimiento.';
            } else {
                // Descripción genérica para productos no categorizados
                newDescription = 'Producto de tecnología de alta calidad con características innovadoras.';
            }
            
            return Product.findByIdAndUpdate(
                product._id,
                { description: newDescription },
                { new: true }
            );
        });
        
        const updatedProducts = await Promise.all(updatePromises);
        
        console.log(`✅ Actualizados ${updatedProducts.length} productos exitosamente`);
        
        // Mostrar algunos ejemplos de los cambios
        console.log('\n📋 Ejemplos de productos actualizados:');
        updatedProducts.slice(0, 5).forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   Nueva descripción: "${product.description}"`);
        });
        
    } catch (error) {
        console.error('❌ Error actualizando productos:', error);
    }
};

// Función principal
const main = async () => {
    try {
        await connectDB();
        await fixExcelDescriptions();
        console.log('\n🎉 Proceso completado exitosamente');
    } catch (error) {
        console.error('❌ Error en el proceso:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
        process.exit(0);
    }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { fixExcelDescriptions };
