const mongoose = require('mongoose');
require('dotenv').config();

// Definir el esquema de Brand
const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Brand = mongoose.model('Brand', BrandSchema);

const brands = [
  { name: 'Apple', description: 'Tecnología premium y dispositivos móviles' },
  { name: 'Samsung', description: 'Electrónicos y dispositivos móviles' },
  { name: 'Sony', description: 'Electrónicos, audio y videojuegos' },
  { name: 'LG', description: 'Electrodomésticos y electrónicos' },
  { name: 'Huawei', description: 'Tecnología y dispositivos móviles' },
  { name: 'Xiaomi', description: 'Tecnología accesible y dispositivos móviles' },
  { name: 'OnePlus', description: 'Smartphones premium' },
  { name: 'Google', description: 'Dispositivos Pixel y tecnología' },
  { name: 'Microsoft', description: 'Software y hardware' },
  { name: 'Dell', description: 'Computadoras y laptops' },
  { name: 'HP', description: 'Computadoras y impresoras' },
  { name: 'Lenovo', description: 'Computadoras y laptops' },
  { name: 'Asus', description: 'Computadoras y componentes' },
  { name: 'Acer', description: 'Computadoras y laptops' },
  { name: 'MSI', description: 'Gaming y computadoras' },
  { name: 'Razer', description: 'Gaming y periféricos' },
  { name: 'Logitech', description: 'Periféricos y accesorios' },
  { name: 'Corsair', description: 'Gaming y componentes' },
  { name: 'SteelSeries', description: 'Gaming y periféricos' },
  { name: 'HyperX', description: 'Gaming y audio' }
];

async function createBrands() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar marcas existentes
    await Brand.deleteMany({});
    console.log('🗑️ Marcas existentes eliminadas');

    // Crear nuevas marcas
    const createdBrands = await Brand.insertMany(brands);
    console.log(`✅ ${createdBrands.length} marcas creadas exitosamente`);

    // Mostrar las marcas creadas
    createdBrands.forEach(brand => {
      console.log(`- ${brand.name}: ${brand.description}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

createBrands();





