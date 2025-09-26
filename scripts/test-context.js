// Script para probar si el contexto está funcionando correctamente
const testContext = () => {
    console.log('🔍 [CONTEXT TEST] Probando contexto...');
    
    // Simular el estado del contexto
    const mockProducts = [
        { id: 1, name: 'Producto 1', category: 'cat1', brand: 'brand1', offerPrice: 100 },
        { id: 2, name: 'Producto 2', category: 'cat2', brand: 'brand2', offerPrice: 200 },
        { id: 3, name: 'Producto 3', category: 'cat1', brand: 'brand1', offerPrice: 150 }
    ];
    
    const mockFilters = {
        categories: ['cat1'],
        brands: ['brand1']
    };
    
    // Simular la función applyFilters
    const applyFilters = (productList) => {
        let filtered = [...productList];
        
        console.log('🔍 [CONTEXT TEST] Productos originales:', productList.length);
        console.log('🔍 [CONTEXT TEST] Filtros activos:', mockFilters);
        
        // Filtro por categorías
        if (mockFilters.categories && mockFilters.categories.length > 0) {
            console.log('🔍 [CONTEXT TEST] Aplicando filtro de categorías:', mockFilters.categories);
            filtered = filtered.filter(product => 
                mockFilters.categories.includes(product.category)
            );
            console.log('🔍 [CONTEXT TEST] Después de filtro de categorías:', filtered.length);
        }
        
        // Filtro por marcas
        if (mockFilters.brands && mockFilters.brands.length > 0) {
            console.log('🔍 [CONTEXT TEST] Aplicando filtro de marcas:', mockFilters.brands);
            filtered = filtered.filter(product => 
                mockFilters.brands.includes(product.brand)
            );
            console.log('🔍 [CONTEXT TEST] Después de filtro de marcas:', filtered.length);
        }
        
        console.log('🔍 [CONTEXT TEST] Productos filtrados finales:', filtered.length);
        return filtered;
    };
    
    const result = applyFilters(mockProducts);
    console.log('🔍 [CONTEXT TEST] Resultado:', result);
    
    return result;
};

testContext();
