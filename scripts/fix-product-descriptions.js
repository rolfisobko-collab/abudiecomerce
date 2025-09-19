const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Schema del producto
const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  minWholesaleQuantity: { type: Number, required: true, min: 1 },
  image: { type: Array, required: false, default: [] },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  date: { type: Number, required: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  stock: { type: Number, default: 100 }
});

const Product = mongoose.model('product', productSchema);

// Función para generar descripción inteligente basada en el nombre del producto
const generateSmartDescription = (productName, brand, price, offerPrice) => {
  const name = productName.toLowerCase();
  const hasDiscount = offerPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - offerPrice) / price) * 100) : 0;
  
  let description = '';
  
  // iPhone
  if (name.includes('iphone')) {
    const model = name.match(/iphone\s+(\d+)/)?.[1] || '';
    const storage = name.match(/(\d+)gb/)?.[1] || '';
    const color = name.match(/(negro|blanco|azul|rosa|verde|dorado|gris|silver|gold|lila|desert|natural)/)?.[1] || '';
    
    description = `iPhone ${model} ${storage}GB`;
    if (color) description += ` en color ${color}`;
    description += '. ';
    
    if (name.includes('pro') || name.includes('promax')) {
      description += 'Modelo profesional con características avanzadas. ';
    }
    
    if (name.includes('lacrado') || name.includes('garantia')) {
      description += 'Producto sellado con garantía oficial. ';
    }
    
    if (name.includes('americano') || name.includes('chino')) {
      const region = name.includes('americano') ? 'americano' : 'chino';
      description += `Versión ${region} con compatibilidad total. `;
    }
  }
  
  // Samsung
  else if (name.includes('samsung')) {
    const model = name.match(/samsung\s+([a-z0-9]+)/i)?.[1] || '';
    const storage = name.match(/(\d+)gb/)?.[1] || '';
    const color = name.match(/(negro|blanco|azul|rosa|verde|gris|silver|gold|lila|navy)/)?.[1] || '';
    
    description = `Samsung ${model} ${storage}GB`;
    if (color) description += ` en color ${color}`;
    description += '. ';
    
    if (name.includes('ultra') || name.includes('pro')) {
      description += 'Modelo premium con características avanzadas. ';
    }
    
    if (name.includes('5g')) {
      description += 'Compatible con redes 5G para máxima velocidad. ';
    }
  }
  
  // Redmi/Xiaomi
  else if (name.includes('redmi') || name.includes('xiaomi')) {
    const model = name.match(/(redmi|xiaomi)\s+([a-z0-9\s]+)/i)?.[2] || '';
    const storage = name.match(/(\d+)gb/)?.[1] || '';
    const color = name.match(/(negro|blanco|azul|rosa|verde|dorado|gris|lila)/)?.[1] || '';
    
    description = `Redmi ${model} ${storage}GB`;
    if (color) description += ` en color ${color}`;
    description += '. ';
    
    if (name.includes('note') || name.includes('pro')) {
      description += 'Serie Note con excelente relación calidad-precio. ';
    }
  }
  
  // Tecno
  else if (name.includes('tecno')) {
    const model = name.match(/tecno\s+([a-z0-9\s]+)/i)?.[1] || '';
    const storage = name.match(/(\d+)gb/)?.[1] || '';
    const color = name.match(/(negro|blanco|azul|rosa|verde|dorado|gris)/)?.[1] || '';
    
    description = `Tecno ${model} ${storage}GB`;
    if (color) description += ` en color ${color}`;
    description += '. ';
    
    if (name.includes('spark')) {
      description += 'Serie Spark con tecnología avanzada. ';
    }
  }
  
  // Umidigi
  else if (name.includes('umidigi')) {
    const model = name.match(/umidigi\s+([a-z0-9\s]+)/i)?.[1] || '';
    const storage = name.match(/(\d+)gb/)?.[1] || '';
    const color = name.match(/(negro|blanco|azul|rosa|verde|dorado|gris)/)?.[1] || '';
    
    description = `Umidigi ${model} ${storage}GB`;
    if (color) description += ` en color ${color}`;
    description += '. ';
    
    if (name.includes('note')) {
      description += 'Serie Note con características premium. ';
    }
  }
  
  // Descripción genérica si no coincide con ninguna marca
  else {
    description = `${productName}. `;
  }
  
  // Agregar información de precio y descuento
  if (hasDiscount && discountPercent > 0) {
    description += `¡Oferta especial! Ahorra ${discountPercent}% con precio mayorista. `;
  }
  
  // Agregar información de garantía y calidad
  description += 'Producto original con garantía. Envío rápido y seguro.';
  
  return description;
};

const fixProductDescriptions = async () => {
  try {
    await connectDB();
    
    console.log('🔄 Iniciando corrección de descripciones de productos...');
    
    // Buscar productos con descripción genérica
    const productsToFix = await Product.find({
      description: 'Producto importado desde Excel'
    });
    
    console.log(`📊 Encontrados ${productsToFix.length} productos para corregir`);
    
    let fixed = 0;
    
    for (const product of productsToFix) {
      const newDescription = generateSmartDescription(
        product.name, 
        product.brand, 
        product.price, 
        product.offerPrice
      );
      
      await Product.findByIdAndUpdate(product._id, {
        description: newDescription
      });
      
      fixed++;
      console.log(`✅ Corregido: ${product.name}`);
      console.log(`   Nueva descripción: ${newDescription.substring(0, 100)}...`);
    }
    
    console.log(`🎉 Corrección completada! ${fixed} productos corregidos`);
    
    // Verificar que la corrección fue exitosa
    const remaining = await Product.countDocuments({
      description: 'Producto importado desde Excel'
    });
    
    console.log(`📈 Verificación:`);
    console.log(`   - Productos con descripción genérica restantes: ${remaining}`);
    
  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

fixProductDescriptions();
