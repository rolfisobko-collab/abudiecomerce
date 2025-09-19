import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Por favor ingresa tu correo electrónico');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/newsletter/subscribe', { email });
      
      if (response.data.success) {
        toast.success(response.data.message);
        setEmail('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error al suscribirse:', error);
      toast.error('Error al suscribirse. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 pt-6 sm:pt-8 pb-10 sm:pb-14 px-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium max-w-4xl">
        Entérate de nuestras ofertas y novedades
      </h1>
      <p className="text-sm sm:text-base text-gray-500/80 pb-6 sm:pb-8 max-w-2xl">
        Mantente al día con nuestras últimas ofertas y productos exclusivos. 
        Recibe notificaciones sobre promociones especiales y nuevos lanzamientos.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between max-w-2xl w-full gap-3 sm:gap-0">
        <input
          className="border border-gray-500/30 rounded-md h-12 sm:h-14 border-r-0 sm:border-r-0 outline-none w-full rounded-r-none sm:rounded-r-none px-3 text-gray-500 focus:ring-2 focus:ring-[#feecaf] focus:border-transparent text-sm sm:text-base"
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading}
          className="px-6 sm:px-8 lg:px-12 h-12 sm:h-14 text-black bg-[#feecaf] rounded-md sm:rounded-l-none hover:bg-[#feecaf]/80 transition-colors disabled:opacity-50 text-sm sm:text-base font-medium"
        >
          {loading ? 'Suscribiendo...' : 'Suscribirse'}
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
