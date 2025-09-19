import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  FaChartLine, 
  FaUsers, 
  FaShoppingCart, 
  FaStar, 
  FaDollarSign,
  FaEye,
  FaTrendingUp,
  FaTrendingDown,
  FaProductHunt
} from 'react-icons/fa';

const CEODashboard = () => {
  const { products, userData } = useAppContext();
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    averageRating: 0,
    topCategories: [],
    topProducts: [],
    priceAnalysis: {},
    stockAnalysis: {},
    recentActivity: []
  });

  useEffect(() => {
    if (products.length === 0) return;

    // Calcular métricas
    const totalProducts = products.length;
    
    // Calcular ingresos estimados (precio promedio * cantidad estimada vendida)
    const totalRevenue = products.reduce((sum, product) => {
      const estimatedSales = (product.totalRatings || 0) * 2; // Estimación: 2 ventas por rating
      return sum + (product.offerPrice * estimatedSales);
    }, 0);

    // Rating promedio
    const averageRating = products.reduce((sum, product) => sum + (product.averageRating || 0), 0) / totalProducts;

    // Top categorías
    const categoryCount = {};
    products.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // Top productos por rating
    const topProducts = [...products]
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 5);

    // Análisis de precios
    const priceRanges = {
      '0-100': products.filter(p => p.offerPrice <= 100).length,
      '100-300': products.filter(p => p.offerPrice > 100 && p.offerPrice <= 300).length,
      '300-500': products.filter(p => p.offerPrice > 300 && p.offerPrice <= 500).length,
      '500+': products.filter(p => p.offerPrice > 500).length
    };

    // Análisis de stock
    const stockAnalysis = {
      inStock: products.filter(p => (p.stock || 100) > 0).length,
      lowStock: products.filter(p => (p.stock || 100) <= 10).length,
      outOfStock: products.filter(p => (p.stock || 100) === 0).length
    };

    setAnalytics({
      totalProducts,
      totalRevenue,
      averageRating,
      topCategories,
      topProducts,
      priceAnalysis: priceRanges,
      stockAnalysis,
      recentActivity: []
    });
  }, [products]);

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <FaTrendingUp className="mr-1" /> : <FaTrendingDown className="mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Ejecutivo</h1>
          <p className="text-gray-600 mt-2">Análisis completo del rendimiento de la tienda</p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Productos"
            value={analytics.totalProducts.toLocaleString()}
            icon={FaProductHunt}
            color="blue"
          />
          <StatCard
            title="Ingresos Estimados"
            value={`$${analytics.totalRevenue.toLocaleString()}`}
            icon={FaDollarSign}
            color="green"
          />
          <StatCard
            title="Rating Promedio"
            value={analytics.averageRating.toFixed(1)}
            icon={FaStar}
            color="yellow"
          />
          <StatCard
            title="Productos en Stock"
            value={analytics.stockAnalysis.inStock}
            icon={FaShoppingCart}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Categorías */}
          <ChartCard title="Top Categorías">
            <div className="space-y-3">
              {analytics.topCategories.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Categoría {index + 1}
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / analytics.totalProducts) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Análisis de Precios */}
          <ChartCard title="Distribución de Precios">
            <div className="space-y-4">
              {Object.entries(analytics.priceAnalysis).map(([range, count]) => (
                <div key={range} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">${range}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(count / analytics.totalProducts) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Top Productos */}
          <ChartCard title="Productos Mejor Calificados">
            <div className="space-y-3">
              {analytics.topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${product.offerPrice} • {product.totalRatings || 0} reseñas
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {product.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Análisis de Stock */}
          <ChartCard title="Estado del Inventario">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">En Stock</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {analytics.stockAnalysis.inStock}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Stock Bajo</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">
                  {analytics.stockAnalysis.lowStock}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Sin Stock</span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {analytics.stockAnalysis.outOfStock}
                </span>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Insights y Recomendaciones */}
        <div className="mt-8">
          <ChartCard title="Insights y Recomendaciones">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📈 Oportunidad de Crecimiento</h4>
                <p className="text-sm text-blue-800">
                  Tienes {analytics.stockAnalysis.lowStock} productos con stock bajo. Considera reponer inventario para maximizar ventas.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">⭐ Calidad del Catálogo</h4>
                <p className="text-sm text-green-800">
                  Tu rating promedio de {analytics.averageRating.toFixed(1)} estrellas indica una buena calidad de productos.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">💰 Optimización de Precios</h4>
                <p className="text-sm text-purple-800">
                  Considera ajustar precios en productos con pocas reseñas para mejorar la competitividad.
                </p>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default CEODashboard;
