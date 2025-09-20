'use client'
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdVisibility, 
  MdVisibilityOff,
  MdSave,
  MdCancel,
  MdPerson,
  MdEmail,
  MdLock,
  MdAdminPanelSettings
} from 'react-icons/md';

const AdminUsers = () => {
  const { router, user } = useAppContext()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    permissions: {
      addProduct: true,
      productList: true,
      categories: true,
      brands: true,
      orders: true,
      paymentMethods: true,
      communications: true,
      adminUsers: false
    }
  })

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin-users', {
        withCredentials: true
      })
      if (data.success) {
        setUsers(data.users)
        setLoading(false)
      } else {
        toast.error(data.message)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error)
      if (error.response?.status === 401) {
        toast.error('No autorizado. Por favor, inicia sesión como admin.')
        setLoading(false)
      } else {
        toast.error('Error al cargar usuarios')
        setLoading(false)
      }
    }
  }

  const handleCreate = async () => {
    try {
      // Validación en el frontend
      if (!formData.username || !formData.name || !formData.password) {
        toast.error('Por favor completa todos los campos requeridos')
        return
      }
      
      const { data } = await axios.post('/api/admin-users', formData, {
        withCredentials: true
      })
      if (data.success) {
        toast.success('Usuario creado exitosamente')
        setShowCreateModal(false)
        resetForm()
        fetchUsers()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('❌ [ERROR] Error completo:', error)
      console.error('❌ [ERROR] Response data:', error.response?.data)
      toast.error(error.response?.data?.message || 'Error al crear usuario')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      name: user.name,
      password: '',
      permissions: user.permissions
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    try {
      const updateData = { ...formData }
      if (!updateData.password) {
        delete updateData.password
      }
      
      const { data } = await axios.put(`/api/admin-users/${editingUser._id}`, updateData, {
        withCredentials: true
      })
      if (data.success) {
        toast.success('Usuario actualizado exitosamente')
        setShowEditModal(false)
        setEditingUser(null)
        resetForm()
        fetchUsers()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Error al actualizar usuario')
      console.error('Error:', error)
    }
  }

  const handleDelete = async (userId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const { data } = await axios.delete(`/api/admin-users/${userId}`, {
          withCredentials: true
        })
        if (data.success) {
          toast.success('Usuario eliminado exitosamente')
          fetchUsers()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error('Error al eliminar usuario')
        console.error('Error:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      password: '',
      permissions: {
        addProduct: true,
        productList: true,
        categories: true,
        brands: true,
        orders: true,
        paymentMethods: true,
        communications: true,
        adminUsers: false
      }
    })
  }

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }))
  }


  useEffect(() => {
    if (user) {
      fetchUsers()
    }
  }, [user])

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="w-full md:p-10 p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-lg font-medium">Gestión de Usuarios Admin</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 flex items-center gap-2"
          >
            <MdAdd size={16} />
            Nuevo Usuario
          </button>
        </div>

        {/* Tabla de usuarios */}
        <div className="flex flex-col items-center max-w-6xl w-full rounded-md bg-white border border-gray-500/20 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-gray-900 text-sm text-left bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[120px]">Usuario</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[150px]">Nombre Completo</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[100px]">Estado</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[120px]">Último Login</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[120px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {users.map((user, index) => (
                  <tr key={index} className="border-t border-gray-500/20 hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center space-x-3 whitespace-nowrap">
                      <div className="bg-gray-500/10 rounded-full p-2">
                        <MdPerson className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="font-medium">{user.username}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="flex items-center gap-1 px-2 py-1 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 transition-colors"
                        >
                          <MdEdit size={14} />
                          <span className="hidden md:block">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                        >
                          <MdDelete size={14} />
                          <span className="hidden md:block">Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Creación */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Crear Nuevo Usuario Admin</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de Usuario
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                      placeholder="usuario_admin"
                    />
                    <p className="text-xs text-gray-500 mt-1">Solo letras, números y guiones bajos</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                      placeholder="Ingresa el nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                      </button>
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permisos
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(formData.permissions).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handlePermissionChange(key)}
                            className="rounded border-gray-300 text-[#feecaf] focus:ring-[#feecaf]"
                          />
                          <span className="text-sm text-gray-700">
                            {key === 'addProduct' && 'Agregar Productos'}
                            {key === 'productList' && 'Lista de Productos'}
                            {key === 'categories' && 'Categorías'}
                            {key === 'brands' && 'Marcas'}
                            {key === 'orders' && 'Pedidos'}
                            {key === 'paymentMethods' && 'Métodos de Pago'}
                            {key === 'communications' && 'Comunicaciones'}
                            {key === 'adminUsers' && 'Usuarios Admin'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
                  >
                    <MdCancel size={16} />
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 flex items-center gap-2"
                  >
                    <MdSave size={16} />
                    Crear Usuario
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edición */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Editar Usuario Admin</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de Usuario
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Solo letras, números y guiones bajos</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña (opcional)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                        placeholder="Dejar vacío para mantener la actual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                      </button>
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permisos
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(formData.permissions).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handlePermissionChange(key)}
                            className="rounded border-gray-300 text-[#feecaf] focus:ring-[#feecaf]"
                          />
                          <span className="text-sm text-gray-700">
                            {key === 'addProduct' && 'Agregar Productos'}
                            {key === 'productList' && 'Lista de Productos'}
                            {key === 'categories' && 'Categorías'}
                            {key === 'brands' && 'Marcas'}
                            {key === 'orders' && 'Pedidos'}
                            {key === 'paymentMethods' && 'Métodos de Pago'}
                            {key === 'communications' && 'Comunicaciones'}
                            {key === 'adminUsers' && 'Usuarios Admin'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingUser(null)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
                  >
                    <MdCancel size={16} />
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 flex items-center gap-2"
                  >
                    <MdSave size={16} />
                    Actualizar Usuario
                  </button>
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

export default AdminUsers;