'use client'
import React, { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'

const MarkdownEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Escribe la descripción del producto en Markdown...',
  height = 300,
  preview = 'edit'
}) => {
  const [markdown, setMarkdown] = useState(value)


  const handleChange = (val) => {
    setMarkdown(val || '')
    if (onChange) {
      onChange(val || '')
    }
  }

  return (
    <div className="w-full">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción del Producto (Markdown)
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Puedes usar <strong>negrita</strong>, <em>cursiva</em>, listas, enlaces y más. 
          <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
            Ver guía de Markdown
          </a>
        </p>
        
      </div>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <MDEditor
          value={markdown}
          onChange={handleChange}
          height={height}
          preview={preview}
          data-color-mode="light"
          visibleDragBar={false}
          textareaProps={{
            placeholder: placeholder,
            style: {
              fontSize: 14,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            },
          }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <strong>💡 Consejos:</strong> Usa la barra de herramientas del editor para formatear.
        <br />
        <strong>Para alineación HTML:</strong> 
        <code>&lt;div style="text-align: center"&gt;texto&lt;/div&gt;</code> (centrar)
        <br />
        <code>&lt;div style="text-align: justify"&gt;texto&lt;/div&gt;</code> (justificar)
        <br />
        <code>&lt;div style="text-align: right"&gt;texto&lt;/div&gt;</code> (derecha)
      </div>
    </div>
  )
}

export default MarkdownEditor
