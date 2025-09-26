import React from 'react'

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-[#feecaf] border-gray-200"></div>
                <p className="text-gray-600 text-lg">Cargando...</p>
            </div>
        </div>
    )
}

export default Loading