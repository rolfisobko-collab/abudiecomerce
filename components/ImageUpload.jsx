'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'

const ImageUpload = ({ files, setFiles, maxFiles = 4 }) => {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // Asegurar que files sea un array con la longitud correcta
  const normalizedFiles = Array.isArray(files) ? files : []
  const paddedFiles = [...normalizedFiles]
  while (paddedFiles.length < maxFiles) {
    paddedFiles.push(null)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      const validFiles = newFiles.filter(file => file.type.startsWith('image/'))
      
      if (validFiles.length > 0) {
        const updatedFiles = [...normalizedFiles]
        let addedCount = 0
        
        for (let i = 0; i < maxFiles && addedCount < validFiles.length; i++) {
          if (!updatedFiles[i]) {
            updatedFiles[i] = validFiles[addedCount]
            addedCount++
          }
        }
        
        setFiles(updatedFiles)
      }
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files)
      const validFiles = newFiles.filter(file => file.type.startsWith('image/'))
      
      if (validFiles.length > 0) {
        const updatedFiles = [...normalizedFiles]
        let addedCount = 0
        
        for (let i = 0; i < maxFiles && addedCount < validFiles.length; i++) {
          if (!updatedFiles[i]) {
            updatedFiles[i] = validFiles[addedCount]
            addedCount++
          }
        }
        
        setFiles(updatedFiles)
      }
    }
  }

  const removeFile = (index) => {
    const updatedFiles = [...normalizedFiles]
    updatedFiles[index] = null
    setFiles(updatedFiles)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Área de drag & drop */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            <button
              type="button"
              onClick={openFileDialog}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Haz clic para seleccionar
            </button>
            {' '}o arrastra y suelta imágenes aquí
          </div>
          <p className="text-xs text-gray-500">
            Máximo {maxFiles} imágenes (JPG, PNG, GIF)
          </p>
        </div>
      </div>

      {/* Vista previa de imágenes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(maxFiles)].map((_, index) => (
          <div key={index} className="relative group">
            {paddedFiles[index] ? (
              <div className="relative">
                <Image
                  src={URL.createObjectURL(paddedFiles[index])}
                  alt={`Preview ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Vacío</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageUpload