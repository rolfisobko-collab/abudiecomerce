'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import { MdEdit, MdDelete, MdSave, MdCancel, MdUpload, MdDownload, MdSearch, MdFilterList, MdChevronLeft, MdChevronRight } from 'react-icons/md';

const ProductList = () => {
  const { router, user } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  // Removido viewMode - solo vista clásica
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editFiles, setEditFiles] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [excelData, setExcelData] = useState([])
  const [showImportModal, setShowImportModal] = useState(false)
  const [importing, setImporting] = useState(false)
  
  // Nuevos estados para búsqueda, filtros y paginación
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const fetchSellerProduct = async () => {
    console.log('🔍 [PRODUCT LIST DEBUG] Iniciando fetchSellerProduct...')
    try {
      console.log('🔍 [PRODUCT LIST DEBUG] Haciendo petición a /api/product/seller-list...')
      const { data } = await axios.get('/api/product/seller-list', {
        withCredentials: true
      })
      console.log('🔍 [PRODUCT LIST DEBUG] Respuesta recibida:', data)
      if (data.success) {
        console.log('🔍 [PRODUCT LIST DEBUG] Éxito, productos:', data.products.length)
        setProducts(data.products)
        setLoading(false)
      } else {
        console.log('🔍 [PRODUCT LIST DEBUG] Error en respuesta:', data.message)
        if (data.redirect) {
          router.push(data.redirect)
        } else {
          toast.error(data.message)
        }
        setLoading(false)
      }
    } catch (error) {
      console.log('🔍 [PRODUCT LIST DEBUG] Error en catch:', error.message)
      if (error.response?.data?.redirect) {
        router.push(error.response.data.redirect)
      } else {
        toast.error(error.message)
      }
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product._id)
    setEditForm({
      name: product.name,
      category: product.category,
      brand: product.brand || '',
      price: product.price,
      offerPrice: product.offerPrice,
      minWholesaleQuantity: product.minWholesaleQuantity !== undefined ? product.minWholesaleQuantity : '',
      description: product.description,
      image: product.image.join(', ')
    })
    setEditFiles([]) // Resetear archivos de edición
  }

  const handleSave = async (productId) => {
    try {
      let updateData = { ...editForm }
      
      // Si hay archivos nuevos, subirlos primero
      if (editFiles.length > 0) {
        const formData = new FormData()
        editFiles.forEach(file => {
          formData.append('images', file)
        })
        
        // Subir imágenes nuevas
        const uploadResponse = await axios.post('/api/product/upload-images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        if (uploadResponse.data.success) {
          // Combinar imágenes existentes con las nuevas
          const existingImages = editForm.image ? editForm.image.split(',').map(url => url.trim()).filter(url => url) : []
          updateData.image = [...existingImages, ...uploadResponse.data.images].join(', ')
        }
      }
      
      const response = await axios.put(`/api/product/update/${productId}`, updateData)
      if (response.data.success) {
        toast.success('Producto actualizado exitosamente')
        setEditingProduct(null)
        setEditForm({})
        setEditFiles([])
        // Recargar productos para obtener las imágenes actualizadas
        fetchSellerProduct()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Error al actualizar el producto')
      console.error('Error:', error)
    }
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setEditForm({})
    setEditFiles([])
  }

  const handleDelete = async (productId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await axios.delete(`/api/product/delete/${productId}`, {
          withCredentials: true
        })
        if (response.data.success) {
          toast.success('Producto eliminado exitosamente')
          fetchSellerProduct() // Recargar productos
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error('Error al eliminar el producto')
      }
    }
  }

  // Funciones removidas - solo edición por modal

  // Funciones para importación de Excel
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          
          // Procesar los datos según el formato especificado
          const processedData = jsonData.slice(1).map((row, index) => {
            if (row.length >= 6) {
              // Procesar minWholesaleQuantity correctamente - SIMPLIFICADO
              let minWholesaleQuantity = 1
              if (row[4] && row[4] !== '') {
                const parsed = parseInt(row[4])
                if (!isNaN(parsed) && parsed > 0) {
                  minWholesaleQuantity = parsed
                }
              }
              
              return {
                id: `temp_${index}`,
                code: row[0] || '', // Columna A - Código del producto
                name: row[1] || '', // Columna B - Nombre del producto
                price: row[2] || 0, // Columna C - Precio
                offerPrice: row[3] || 0, // Columna D - Precio mayorista
                minWholesaleQuantity: minWholesaleQuantity, // Columna E - Cantidad mínima
                category: row[5] || 'Sin categoría', // Columna F - Categoría
                brand: row[6] || 'Sin marca', // Columna G - Marca
                description: row[7] || 'Producto importado desde Excel', // Columna H - Descripción
                image: '' // Sin imagen, se usará placeholder por defecto
              }
            }
            return null
          }).filter(item => item !== null)
          
          setExcelData(processedData)
          setShowImportModal(true)
          toast.success(`Archivo cargado: ${processedData.length} productos encontrados`)
        } catch (error) {
          toast.error('Error al procesar el archivo Excel')
          console.error('Error:', error)
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  })

  const handleImportProducts = async () => {
    setImporting(true)
    try {
      // Verificar si hay productos duplicados
      const duplicateProducts = []
      for (const product of excelData) {
        const existingProduct = products.find(p => 
          p.name.toLowerCase() === product.name.toLowerCase() || 
          p.code === product.code
        )
        if (existingProduct) {
          duplicateProducts.push({
          name: product.name,
            existing: existingProduct.name
          })
        }
      }

      // Si hay duplicados, preguntar al usuario
      if (duplicateProducts.length > 0) {
        const duplicateNames = duplicateProducts.map(p => p.name).join(', ')
        const confirmMessage = `Se encontraron ${duplicateProducts.length} productos que ya existen: ${duplicateNames}. ¿Deseas actualizar estos productos existentes?`
        
        if (!confirm(confirmMessage)) {
          setImporting(false)
          return
        }
      }

      // Preparar datos para importación - SIMPLIFICADO
      const productsToImport = excelData.map(product => ({
        name: product.name,
        code: product.code || '',
        category: product.category,
        brand: product.brand || 'Sin marca',
        price: parseFloat(product.price) || 0,
        offerPrice: parseFloat(product.offerPrice) || 0,
        minWholesaleQuantity: product.minWholesaleQuantity, // Ya está procesado correctamente arriba
        description: product.description || '',
        image: product.image || '' // Vacío para que use placeholder por defecto
      }))

      // Enviar a la API de importación
      const { data } = await axios.post('/api/product/import', {
        products: productsToImport
      }, {
        withCredentials: true
      })
      
      if (data.success) {
        toast.success(data.message)
      setShowImportModal(false)
      setExcelData([])
      fetchSellerProduct() // Recargar productos
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Error al importar productos')
      console.error('Error:', error)
    } finally {
      setImporting(false)
    }
  }

  // Funciones para selección múltiple
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([])
      setSelectAll(false)
    } else {
      const allProductIds = getPaginatedProducts().map(product => product._id)
      setSelectedProducts(allProductIds)
      setSelectAll(true)
    }
  }


  const exportSelectedProducts = () => {
    const productsToExport = selectedProducts.length > 0 
      ? products.filter(product => selectedProducts.includes(product._id))
      : getPaginatedProducts()

    if (productsToExport.length === 0) {
      toast.error('No hay productos para exportar')
      return
    }

    const exportData = productsToExport.map(product => ({
      'Código': product.code || '',
      'Nombre': product.name,
      'Precio': product.price,
      'Precio Mayorista': product.offerPrice,
      'Cantidad Mínima': product.minWholesaleQuantity || 1,
      'Categoría': product.categoryName || product.category,
      'Marca': product.brandName || product.brand,
      'Descripción': product.description
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Productos Exportados')
    
    const fileName = selectedProducts.length > 0 
      ? `productos_seleccionados_${new Date().toISOString().split('T')[0]}.xlsx`
      : `productos_filtrados_${new Date().toISOString().split('T')[0]}.xlsx`
    
    XLSX.writeFile(wb, fileName)
    toast.success(`${productsToExport.length} productos exportados exitosamente`)
  }

  const downloadTemplate = () => {
    // Crear plantilla vacía con ejemplos
    const templateData = [
      ['Código', 'Nombre', 'Precio', 'Precio Mayorista', 'Cantidad Mínima Mayorista', 'Categoría', 'Marca', 'Descripción'],
      ['', 'iPhone 15 Pro', '1200', '1100', '5', 'Smartphones', 'Apple', 'iPhone 15 Pro 256GB'],
      ['', 'Samsung Galaxy S24', '1000', '900', '3', 'Smartphones', 'Samsung', 'Samsung Galaxy S24 128GB'],
      ['', 'MacBook Air M2', '1500', '1350', '2', 'Laptops', 'Apple', 'MacBook Air M2 13 pulgadas'],
      ['', 'AirPods Pro', '250', '220', '10', 'Auriculares', 'Apple', 'AirPods Pro 2da generación'],
      ['', 'iPad Air', '600', '550', '5', 'Tablets', 'Apple', 'iPad Air 10.9 pulgadas']
    ]
    
    const ws = XLSX.utils.aoa_to_sheet(templateData)
    
    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 15 }, // Código
      { wch: 20 }, // Nombre
      { wch: 12 }, // Precio
      { wch: 15 }, // Precio Mayorista
      { wch: 20 }, // Cantidad Mínima Mayorista
      { wch: 15 }, // Categoría
      { wch: 15 }, // Marca
      { wch: 30 }  // Descripción
    ]
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla Productos')
    XLSX.writeFile(wb, 'plantilla_productos_abudicell.xlsx')
    toast.success('Plantilla descargada exitosamente')
  }

  const exportToExcel = () => {
    // Usar productos filtrados en lugar de todos los productos
    const productsToExport = getFilteredProducts()
    
    const exportData = productsToExport.map(product => [
      product._id, // Columna A - Código del producto
      product.name, // Columna B - Nombre del producto
      product.price, // Columna C - Precio
      product.offerPrice, // Columna D - Precio mayorista
      product.minWholesaleQuantity || 1, // Columna E - Cantidad mínima
      product.categoryName || product.category, // Columna F - Categoría
      product.brandName || product.brand || 'Sin marca', // Columna G - Marca
      product.description // Columna H - Descripción
    ])
    
    const ws = XLSX.utils.aoa_to_sheet([
      ['Código', 'Nombre', 'Precio', 'Precio Mayorista', 'Cantidad Mínima Mayorista', 'Categoría', 'Marca', 'Descripción'],
      ...exportData
    ])
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Productos')
    XLSX.writeFile(wb, `productos_filtrados_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success(`${productsToExport.length} productos exportados exitosamente`)
  }

  // Función para obtener categorías únicas
  const getUniqueCategories = (products) => {
    const uniqueCategories = [...new Set(products.map(product => product.categoryName || product.category))];
    return uniqueCategories.sort();
  };

  // Función para filtrar productos
  const getFilteredProducts = () => {
    let filtered = products;

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.categoryName || product.category).toLowerCase().includes(query) ||
        product.price.toString().includes(query) ||
        product.offerPrice.toString().includes(query)
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product => (product.categoryName || product.category) === selectedCategory);
    }

    return filtered;
  };

  // Función para obtener productos paginados
  const getPaginatedProducts = () => {
    const filtered = getFilteredProducts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchSellerProduct();
    fetchBrands();
  }, [])

  const fetchBrands = async () => {
    try {
      const { data } = await axios.get('/api/brands')
      if (data.success) {
        setBrands(data.brands)
      }
    } catch (error) {
      console.log('Error al cargar marcas:', error)
    }
  }

  // Actualizar categorías cuando cambien los productos
  useEffect(() => {
    if (products.length > 0) {
      setCategories(getUniqueCategories(products));
    }
  }, [products])

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory])

  // Función removida - solo edición por modal

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="w-full md:p-10 p-4">
        {/* Header con controles */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-lg font-medium">Gestión de Productos</h2>

          {/* Botones de importar y exportar */}
          <div className="flex items-center gap-2">
            <button
              onClick={downloadTemplate}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <MdDownload size={16} />
              Descargar Plantilla
            </button>
            <button
              onClick={exportToExcel}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <MdUpload size={16} />
              Exportar Filtrados
            </button>
            {selectedProducts.length > 0 && (
              <button
                onClick={exportSelectedProducts}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <MdUpload size={16} />
                Exportar Seleccionados ({selectedProducts.length})
              </button>
            )}
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3 py-2 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 flex items-center gap-2"
            >
              <MdDownload size={16} />
              Importar Excel
            </button>
          </div>
        </div>

        {/* Búsqueda y Filtros */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos por nombre, descripción, categoría o precio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Filtro por categoría */}
            <div className="md:w-64">
              <div className="relative">
                <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botón limpiar filtros */}
            {(searchQuery || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Información de resultados */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              Mostrando {getPaginatedProducts().length} de {getFilteredProducts().length} productos
              {getFilteredProducts().length !== products.length && (
                <span className="ml-2 text-blue-600">
                  (filtrados de {products.length} total)
                </span>
              )}
            </div>
            <div>
              Página {currentPage} de {Math.ceil(getFilteredProducts().length / itemsPerPage) || 1}
            </div>
          </div>
        </div>

        {/* Vista de Productos */}
        <div className="flex flex-col items-center max-w-6xl w-full rounded-md bg-white border border-gray-500/20 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-gray-900 text-sm text-left bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[50px]">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#feecaf] focus:ring-[#feecaf]"
                    />
                  </th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[200px]">Producto</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[120px]">Categoría</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[100px]">Marca</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[100px]">Precio</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[120px]">Precio Mayorista</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[140px]">Cant. Mín. Mayorista</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[120px]">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
                {getPaginatedProducts().map((product, index) => (
                  <tr key={index} className="border-t border-gray-500/20 hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="rounded border-gray-300 text-[#feecaf] focus:ring-[#feecaf]"
                      />
                    </td>
                    <td className="px-4 py-3 flex items-center space-x-3 whitespace-nowrap">
                      <div className="bg-gray-500/10 rounded p-2 w-20 h-20 flex items-center justify-center overflow-hidden">
                        {product.image && product.image[0] ? (
                      <Image
                        src={product.image[0]}
                        alt="product Image"
                            className="w-full h-full object-cover rounded"
                            width={80}
                            height={80}
                          />
                        ) : (
                          <Image
                            src="/placeholder-product.jpeg"
                            alt="product Image"
                            className="w-full h-full object-cover rounded"
                            width={80}
                            height={80}
                          />
                        )}
                    </div>
                      <span className="font-medium">
                      {product.name}
                    </span>
                  </td>
                    <td className="px-4 py-3 whitespace-nowrap">{product.categoryName || product.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{product.brandName || product.brand || 'Sin marca'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">${product.price}</td>
                    <td className="px-4 py-3 whitespace-nowrap">${product.offerPrice}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{product.minWholesaleQuantity !== undefined ? product.minWholesaleQuantity : 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="flex items-center gap-1 px-2 py-1 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 transition-colors"
                        >
                          <MdEdit size={14} />
                          <span className="hidden md:block">Editar</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                        >
                          <MdDelete size={14} />
                          <span className="hidden md:block">Eliminar</span>
                        </button>
                        <button 
                          onClick={() => router.push(`/product/${product._id}`)}
                          className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
                        >
                          <span className="hidden md:block">Ver</span>
                      <Image
                        className="h-3.5"
                        src={assets.redirect_icon}
                        alt="redirect_icon"
                      />
                    </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Paginación */}
        {getFilteredProducts().length > itemsPerPage && (
          <div className="flex items-center justify-between mt-6 px-4">
            <div className="text-sm text-gray-600">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, getFilteredProducts().length)} de {getFilteredProducts().length} productos
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdChevronLeft size={16} />
                Anterior
              </button>
              
              {/* Números de página */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.ceil(getFilteredProducts().length / itemsPerPage) }, (_, i) => i + 1)
                  .filter(page => {
                    const totalPages = Math.ceil(getFilteredProducts().length / itemsPerPage);
                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2 py-1 text-gray-500">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'bg-[#feecaf] text-black'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
        </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(getFilteredProducts().length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(getFilteredProducts().length / itemsPerPage)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <MdChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Modal de Edición */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Editar Producto</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Producto
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marca
                    </label>
                    <select
                      value={editForm.brand || ''}
                      onChange={(e) => setEditForm({...editForm, brand: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                    >
                      <option value="">Seleccionar marca</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio
                      </label>
                      <input
                        type="number"
                        value={editForm.price || ''}
                        onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Mayorista
                      </label>
                      <input
                        type="number"
                        value={editForm.offerPrice || ''}
                        onChange={(e) => setEditForm({...editForm, offerPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cantidad Mínima para Precio Mayorista
                      </label>
                      <input
                        type="number"
                        value={editForm.minWholesaleQuantity !== undefined ? editForm.minWholesaleQuantity : ''}
                        onChange={(e) => setEditForm({...editForm, minWholesaleQuantity: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imágenes del Producto <span className="text-sm text-gray-500">(opcional)</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {[...Array(4)].map((_, index) => (
                        <label key={index} htmlFor={`editImage${index}`}>
                          <input 
                            onChange={(e) => {
                              const updatedFiles = [...editFiles];
                              updatedFiles[index] = e.target.files[0];
                              setEditFiles(updatedFiles);
                            }} 
                            type="file" 
                            id={`editImage${index}`} 
                            hidden 
                          />
                          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#feecaf] transition-colors">
                            {editFiles[index] ? (
                              <img 
                                src={URL.createObjectURL(editFiles[index])} 
                                alt="Preview" 
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="text-center">
                                <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-xs text-gray-500">Agregar</span>
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                    {editForm.image && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Imágenes actuales:</p>
                        <div className="flex flex-wrap gap-2">
                          {editForm.image.split(',').map((url, index) => (
                            url.trim() && (
                              <div key={index} className="relative">
                                <img 
                                  src={url.trim()} 
                                  alt={`Imagen ${index + 1}`} 
                                  className="w-16 h-16 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const urls = editForm.image.split(',').filter((_, i) => i !== index);
                                    setEditForm({...editForm, image: urls.join(', ')});
                                  }}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
                  >
                    <MdCancel size={16} />
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleSave(editingProduct)}
                    className="px-4 py-2 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 flex items-center gap-2"
                  >
                    <MdSave size={16} />
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Importación de Excel */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Importar Productos desde Excel</h3>
                
                {/* Zona de Drop */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-[#feecaf] bg-[#feecaf]/10' 
                      : 'border-gray-300 hover:border-[#feecaf] hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <MdUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra un archivo Excel aquí'}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    o haz click para seleccionar un archivo
                  </p>
                  <p className="text-xs text-gray-500">
                    Formatos soportados: .xlsx, .xls, .csv
                  </p>
                </div>

                {/* Formato esperado */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Formato esperado del archivo Excel:</h4>
                  <div className="text-sm text-yellow-800">
                    <p><strong>Columna A:</strong> Código del producto</p>
                    <p><strong>Columna B:</strong> Nombre del producto</p>
                    <p><strong>Columna C:</strong> Precio</p>
                    <p><strong>Columna D:</strong> Precio mayorista</p>
                    <p><strong>Columna E:</strong> Cantidad mínima para precio mayorista</p>
                    <p><strong>Columna F:</strong> Categoría</p>
                    <p><strong>Columna G:</strong> Marca</p>
                    <p><strong>Columna H:</strong> Descripción</p>
                    <p className="mt-2 text-xs">La primera fila debe contener los encabezados. Los datos deben empezar desde la fila 2.</p>
                  </div>
                </div>

                {/* Vista previa de datos */}
                {excelData.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Vista previa de datos ({excelData.length} productos):</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto max-h-60">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left font-medium text-gray-900">Código</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-900">Nombre</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-900">Precio</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-900">Precio Mayorista</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-900">Cant. Mín. Mayorista</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-900">Categoría</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-900">Marca</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {excelData.slice(0, 10).map((item, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 text-gray-600">{item.code}</td>
                                <td className="px-3 py-2 text-gray-600">{item.name}</td>
                                <td className="px-3 py-2 text-gray-600">${item.price}</td>
                                <td className="px-3 py-2 text-gray-600">${item.offerPrice}</td>
                                <td className="px-3 py-2 text-gray-600">{item.minWholesaleQuantity}</td>
                                <td className="px-3 py-2 text-gray-600">{item.category}</td>
                                <td className="px-3 py-2 text-gray-600">{item.brand}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {excelData.length > 10 && (
                          <div className="px-3 py-2 text-sm text-gray-500 bg-gray-50">
                            ... y {excelData.length - 10} productos más
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowImportModal(false)
                      setExcelData([])
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
                  >
                    <MdCancel size={16} />
                    Cancelar
                  </button>
                  {excelData.length > 0 && (
                    <button
                      onClick={handleImportProducts}
                      disabled={importing}
                      className="px-4 py-2 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 flex items-center gap-2 disabled:opacity-50"
                    >
                      {importing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                          Importando...
                        </>
                      ) : (
                        <>
                          <MdSave size={16} />
                          Importar {excelData.length} Productos
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;