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
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-medium">
        Entérate de nuestras ofertas y novedades
      </h1>
      <p className="md:text-base text-gray-500/80 pb-8">
        Mantente al día con nuestras últimas ofertas y productos exclusivos. 
        Recibe notificaciones sobre promociones especiales y nuevos lanzamientos.
      </p>
      <form onSubmit={handleSubmit} className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12">
        <input
          className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500 focus:ring-2 focus:ring-[#feecaf] focus:border-transparent"
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading}
          className="md:px-12 px-8 h-full text-black bg-[#feecaf] rounded-md rounded-l-none hover:bg-[#feecaf]/80 transition-colors disabled:opacity-50"
        >
          {loading ? 'Suscribiendo...' : 'Suscribirse'}
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
