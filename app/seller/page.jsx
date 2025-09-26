'use client'
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {


  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [minWholesaleQuantity, setMinWholesaleQuantity] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

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

    const formData = new FormData()

    formData.append('name',name)
    formData.append('description',description)
    formData.append('category',category)
    formData.append('brand',brand)
    formData.append('price',price)
    formData.append('offerPrice',offerPrice)
    formData.append('minWholesaleQuantity',minWholesaleQuantity)


    for (let i = 0; i < files.length; i++) {
      formData.append('images',files[i])
    }

    try {

      const { data } = await axios.post('/api/product/add',formData)

      if (data.success) {
        toast.success(data.message)
        setFiles([]);
        setName('');
        setDescription('');
        setCategory(categories.length > 0 ? categories[0]._id : '');
        setBrand(brands.length > 0 ? brands[0]._id : '');
        setPrice('');
        setOfferPrice('');
        setMinWholesaleQuantity('');
      } else {
        toast.error(data.message);
      }

      
    } catch (error) {
      toast.error(error.message)
    }


  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Imagen del Producto <span className="text-sm text-gray-500">(opcional)</span></p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : "/upload_area.png"}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

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
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Descripción del Producto
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Escribir aquí"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
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
        <button type="submit" className="px-8 py-2.5 bg-[#feecaf] text-black font-medium rounded">
          AGREGAR
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;