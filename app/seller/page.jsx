'use client'
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";
import MarkdownEditor from "@/components/MarkdownEditor";

const AddProduct = () => {


  const [files, setFiles] = useState([null, null, null, null]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [minWholesaleQuantity, setMinWholesaleQuantity] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // Especificaciones del producto
  const [specifications, setSpecifications] = useState({
    brand: 'Genérica',
    color: 'Múltiple',
    warranty: 'Sin garantía',
    material: 'N/A',
    weight: 'N/A',
    dimensions: 'N/A',
    origin: 'N/A'
  });

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      if (data.success) {
        setCategories(data.categories);
        if (data.categories.length > 0 && !category) {
          setCategory(data.categories[0]._id);
        }
      }
    } catch (error) {
      console.log('Error al cargar categorías:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data } = await axios.get('/api/brands');
      if (data.success) {
        setBrands(data.brands);
        if (data.brands.length > 0 && !brand) {
          setBrand(data.brands[0]._id);
        }
      }
    } catch (error) {
      console.log('Error al cargar marcas:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevenir múltiples envíos
    if (isCreating) {
      return;
    }

    setIsCreating(true);

    const formData = new FormData()

    formData.append('name',name)
    formData.append('description',description)
    formData.append('category',category)
    formData.append('brand',brand)
    formData.append('price',price)
    formData.append('offerPrice',offerPrice)
    formData.append('minWholesaleQuantity',minWholesaleQuantity)
    formData.append('specifications', JSON.stringify(specifications))


    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        formData.append('images',files[i])
      }
    }

    try {

      const { data } = await axios.post('/api/product/add',formData)

      if (data.success) {
        toast.success(data.message)
        setFiles([null, null, null, null]);
        setName('');
        setDescription('');
        setCategory(categories.length > 0 ? categories[0]._id : '');
        setBrand(brands.length > 0 ? brands[0]._id : '');
        setPrice('');
        setOfferPrice('');
        setMinWholesaleQuantity('');
        setSpecifications({
          brand: 'Genérica',
          color: 'Múltiple',
          warranty: 'Sin garantía',
          material: 'N/A',
          weight: 'N/A',
          dimensions: 'N/A',
          origin: 'N/A'
        });
      } else {
        toast.error(data.message);
      }

      
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsCreating(false);
    }


  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Imágenes del Producto <span className="text-sm text-gray-500">(opcional)</span></p>
          <div className="mt-2">
            <ImageUpload 
              files={files}
              setFiles={setFiles}
              maxFiles={4}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Nombre del Producto
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Escribir aquí"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <MarkdownEditor
            value={description}
            onChange={setDescription}
            placeholder="Escribe la descripción del producto usando Markdown..."
            height={300}
          />
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Categoría
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="brand">
              Marca
            </label>
            <select
              id="brand"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setBrand(e.target.value)}
              value={brand}
            >
              <option value="">Seleccionar marca</option>
              {brands.map((brandItem) => (
                <option key={brandItem._id} value={brandItem._id}>
                  {brandItem.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Precio del Producto
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Precio de Oferta
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="min-wholesale-quantity">
              Cantidad Mínima para Precio Mayorista
            </label>
            <input
              id="min-wholesale-quantity"
              type="number"
              placeholder="1"
              min="1"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setMinWholesaleQuantity(e.target.value)}
              value={minWholesaleQuantity}
              required
            />
          </div>
        </div>
        
        {/* Especificaciones del Producto */}
        <div className="flex flex-col gap-4 mt-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800">Especificaciones del Producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="spec-brand">
                Marca del Producto
              </label>
              <input
                id="spec-brand"
                type="text"
                placeholder="Marca"
                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setSpecifications({...specifications, brand: e.target.value})}
                value={specifications.brand}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="spec-color">
                Color
              </label>
              <input
                id="spec-color"
                type="text"
                placeholder="Color"
                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setSpecifications({...specifications, color: e.target.value})}
                value={specifications.color}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="spec-warranty">
                Garantía
              </label>
              <input
                id="spec-warranty"
                type="text"
                placeholder="Garantía"
                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setSpecifications({...specifications, warranty: e.target.value})}
                value={specifications.warranty}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="spec-material">
                Material
              </label>
              <input
                id="spec-material"
                type="text"
                placeholder="Material"
                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setSpecifications({...specifications, material: e.target.value})}
                value={specifications.material}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="spec-weight">
                Peso
              </label>
              <input
                id="spec-weight"
                type="text"
                placeholder="Peso"
                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setSpecifications({...specifications, weight: e.target.value})}
                value={specifications.weight}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="spec-dimensions">
                Dimensiones
              </label>
              <input
                id="spec-dimensions"
                type="text"
                placeholder="Dimensiones"
                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setSpecifications({...specifications, dimensions: e.target.value})}
                value={specifications.dimensions}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="spec-origin">
                Origen
              </label>
              <input
                id="spec-origin"
                type="text"
                placeholder="Origen"
                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setSpecifications({...specifications, origin: e.target.value})}
                value={specifications.origin}
              />
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={isCreating}
          className={`px-8 py-2.5 font-medium rounded flex items-center justify-center gap-2 transition-all ${
            isCreating 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-[#feecaf] text-black hover:bg-[#feecaf]/80'
          }`}
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              Creando producto...
            </>
          ) : (
            'AGREGAR'
          )}
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;