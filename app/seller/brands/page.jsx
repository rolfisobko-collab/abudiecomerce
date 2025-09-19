'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MdAdd, MdEdit, MdDelete, MdSave, MdCancel } from 'react-icons/md'

const BrandsPage = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)
  const [newBrand, setNewBrand] = useState({ name: '', description: '' })
  const [editForm, setEditForm] = useState({ name: '', description: '' })

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/brands')
      if (data.success) {
        setBrands(data.brands)
      }
    } catch (error) {
      toast.error('Error al cargar marcas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const handleAddBrand = async () => {
    if (!newBrand.name.trim()) {
      toast.error('El nombre de la marca es requerido')
      return
    }

    try {
      const { data } = await axios.post('/api/brands', newBrand)
      if (data.success) {
        toast.success('Marca creada exitosamente')
        setNewBrand({ name: '', description: '' })
        setShowAddModal(false)
        fetchBrands()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Error al crear marca')
    }
  }

  const handleEdit = (brand) => {
    setEditingBrand(brand._id)
    setEditForm({ name: brand.name, description: brand.description || '' })
  }

  const handleSave = async (brandId) => {
    if (!editForm.name.trim()) {
      toast.error('El nombre de la marca es requerido')
      return
    }

    try {
      const { data } = await axios.put(`/api/brands/${brandId}`, editForm)
      if (data.success) {
        toast.success('Marca actualizada exitosamente')
        setEditingBrand(null)
        fetchBrands()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Error al actualizar marca')
    }
  }

  const handleCancel = () => {
    setEditingBrand(null)
    setEditForm({ name: '', description: '' })
  }

  const handleDelete = async (brandId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      return
    }

    try {
      const { data } = await axios.delete(`/api/brands/${brandId}`)
      if (data.success) {
        toast.success('Marca eliminada exitosamente')
        fetchBrands()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Error al eliminar marca')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando marcas...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Marcas</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 transition-colors"
        >
          <MdAdd size={20} />
          Nueva Marca
        </button>
      </div>

      {/* Tabla de marcas */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brands.map((brand) => (
                <tr key={brand._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingBrand === brand._id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingBrand === brand._id ? (
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                        placeholder="Descripción (opcional)"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{brand.description || 'Sin descripción'}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(brand.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingBrand === brand._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(brand._id)}
                          className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <MdSave size={16} />
                          Guardar
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <MdCancel size={16} />
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="flex items-center gap-1 px-2 py-1 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 transition-colors"
                        >
                          <MdEdit size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <MdDelete size={16} />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para agregar marca */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nueva Marca</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Marca *
                </label>
                <input
                  type="text"
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                  placeholder="Ej: Samsung, Apple, Sony..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={newBrand.description}
                  onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none resize-none"
                  rows="3"
                  placeholder="Descripción de la marca..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddBrand}
                className="flex-1 px-4 py-2 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 transition-colors"
              >
                Crear Marca
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrandsPage

