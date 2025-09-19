'use client'
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { MdEdit, MdDelete, MdAdd, MdCategory } from 'react-icons/md';

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const fetchCategories = async () => {
    console.log('🔍 [CATEGORIES DEBUG] Iniciando fetchCategories...')
    try {
      console.log('🔍 [CATEGORIES DEBUG] Haciendo petición a /api/categories...')
      const { data } = await axios.get('/api/categories', {
        withCredentials: true
      })
      console.log('🔍 [CATEGORIES DEBUG] Respuesta recibida:', data)
      if (data.success) {
        console.log('🔍 [CATEGORIES DEBUG] Éxito, categorías:', data.categories.length)
        setCategories(data.categories)
        setLoading(false)
      } else {
        console.log('🔍 [CATEGORIES DEBUG] Error en respuesta:', data.message)
        toast.error(data.message)
        setLoading(false)
      }
    } catch (error) {
      console.log('🔍 [CATEGORIES DEBUG] Error en catch:', error.message)
      toast.error(error.message)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('El nombre de la categoría es requerido')
      return
    }

    try {
      if (editingCategory) {
        // Actualizar categoría existente
        const { data } = await axios.put(`/api/categories/${editingCategory._id}`, formData, {
          withCredentials: true
        })
        
        if (data.success) {
          toast.success('Categoría actualizada exitosamente')
          setShowModal(false)
          setEditingCategory(null)
          setFormData({ name: '', description: '' })
          fetchCategories()
        } else {
          toast.error(data.message)
        }
      } else {
        // Crear nueva categoría
        const { data } = await axios.post('/api/categories', formData, {
          withCredentials: true
        })
        
        if (data.success) {
          toast.success('Categoría creada exitosamente')
          setShowModal(false)
          setFormData({ name: '', description: '' })
          fetchCategories()
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar la solicitud')
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (categoryId) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        const { data } = await axios.delete(`/api/categories/${categoryId}`, {
          withCredentials: true
        })
        
        if (data.success) {
          toast.success('Categoría eliminada exitosamente')
          fetchCategories()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error al eliminar la categoría')
      }
    }
  }

  const openModal = () => {
    setEditingCategory(null)
    setFormData({ name: '', description: '' })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({ name: '', description: '' })
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
                  <p className="text-gray-600">Administra las categorías de productos</p>
                </div>
                <button
                  onClick={openModal}
                  className="bg-[#feecaf] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#feecaf]/80 transition-colors flex items-center gap-2"
                >
                  <MdAdd className="w-5 h-5" />
                  Nueva Categoría
                </button>
              </div>

              {/* Categories List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {categories.length === 0 ? (
                  <div className="text-center py-12">
                    <MdCategory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay categorías</h3>
                    <p className="text-gray-500 mb-4">Comienza creando tu primera categoría de productos</p>
                    <button
                      onClick={openModal}
                      className="bg-[#feecaf] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#feecaf]/80 transition-colors"
                    >
                      Crear Categoría
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
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
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                          <tr key={category._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <MdCategory className="w-5 h-5 text-[#feecaf] mr-3" />
                                <span className="text-sm font-medium text-gray-900">
                                  {category.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-500">
                                {category.description || 'Sin descripción'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(category.createdAt).toLocaleDateString('es-ES')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(category)}
                                  className="text-[#feecaf] hover:text-[#feecaf]/80 transition-colors"
                                >
                                  <MdEdit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(category._id)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <MdDelete className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold mb-4">
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la Categoría *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#feecaf] focus:border-transparent"
                      placeholder="Ej: Smartphones, Laptops, Accesorios..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#feecaf] focus:border-transparent"
                      placeholder="Descripción opcional de la categoría..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-[#feecaf] text-gray-900 py-2 px-4 rounded-lg hover:bg-[#feecaf]/80 transition-colors"
                    >
                      {editingCategory ? 'Actualizar' : 'Crear'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  )
}

export default Categories


