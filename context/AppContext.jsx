'use client'
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Configurar timeout global para Axios
axios.defaults.timeout = 30000; // 30 segundos

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const router = useRouter()

    const { data: session, status } = useSession()
    const user = session?.user

    // Función para obtener el token de NextAuth
    const getToken = async () => {
        try {
            if (!session) {
                console.log('No hay sesión activa')
                return null
            }
            
            // Para NextAuth con JWT, simplemente retornamos un indicador de autenticación
            // ya que las APIs del servidor usan getServerSession
            return 'authenticated'
        } catch (error) {
            console.error('Error getting token:', error)
            return null
        }
    }

    const [products, setProducts] = useState([])
    
    // Log cuando cambian los productos
    useEffect(() => {
        console.log('🔍 [CONTEXT DEBUG] Estado de productos actualizado:', products.length)
    }, [products])
    const [categories, setCategories] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false) // No se usa para admin, solo para compatibilidad
    const [cartItems, setCartItems] = useState({})
    const [isLoadingProducts, setIsLoadingProducts] = useState(true)

    const fetchProductData = async (forceRefresh = false) => {
        try {
            console.log('🔍 [CONTEXT DEBUG] fetchProductData iniciado')
            console.log('🔍 [CONTEXT DEBUG] forceRefresh:', forceRefresh)
            setIsLoadingProducts(true)
            
            // TEMPORALMENTE DESHABILITADO: Siempre ir a la API
            console.log('🔍 [CONTEXT DEBUG] Saltando localStorage, yendo directo a API')
            
            // Si no hay cache válido, cargar desde la API
            await fetchProductDataFromAPI()

        } catch (error) {
            console.error('Error loading products:', error)
            toast.error('Error al cargar productos')
            setIsLoadingProducts(false)
        }
    }

    const fetchProductDataFromAPI = async () => {
        try {
            console.log('🔍 [CONTEXT DEBUG] fetchProductDataFromAPI iniciado')
            console.log('🌐 Cargando productos desde Atlas (API)')
            const {data} = await axios.get('/api/product/list', {
                timeout: 30000 // 30 segundos timeout para Atlas
            })

            if (data.success) {
                // Optimización: procesar productos en lotes para mejor rendimiento
                const productsWithImagesAndMinQuantity = data.products
                    .map(product => ({
                        ...product,
                        // Mapear minWholesaleQuantity a minQuantity para compatibilidad
                        minQuantity: product.minWholesaleQuantity && product.minWholesaleQuantity > 0 ? product.minWholesaleQuantity : 1,
                        // Si no tiene imágenes válidas, usar el placeholder
                        image: (product.image && product.image.length > 0 && product.image[0] && 
                               product.image[0] !== '') 
                               ? product.image 
                               : ['/placeholder-product.jpeg']
                    }))
                
                console.log('🔍 [CONTEXT DEBUG] Productos procesados:', productsWithImagesAndMinQuantity.length)
                console.log('🔍 [CONTEXT DEBUG] Primer producto procesado:', productsWithImagesAndMinQuantity[0])
                setProducts(productsWithImagesAndMinQuantity)
                console.log('🔍 [CONTEXT DEBUG] setProducts ejecutado')
                
                // Guardar en localStorage de forma asíncrona para no bloquear UI
                if (typeof window !== 'undefined') {
                    setTimeout(() => {
                        localStorage.setItem('quickcart_products', JSON.stringify(productsWithImagesAndMinQuantity))
                        localStorage.setItem('quickcart_products_timestamp', Date.now().toString())
                        console.log('💾 Productos guardados en localStorage (Atlas)')
                    }, 0)
                }
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Error fetching products from Atlas API:', error)
            toast.error('Error al cargar productos desde Atlas')
        } finally {
            console.log('🔍 [CONTEXT DEBUG] fetchProductDataFromAPI terminado')
            setIsLoadingProducts(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const {data} = await axios.get('/api/categories')
            if (data.success) {
                setCategories(data.categories)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const fetchUserData = async () => {
        try {
            console.log('🔍 [FRONTEND DEBUG] Iniciando fetchUserData...')
            console.log('🔍 [FRONTEND DEBUG] Usuario de NextAuth:', user ? { id: user.id, email: user.email, role: user.role } : 'No hay usuario')

            if (!user) {
                console.log('❌ [FRONTEND DEBUG] No hay usuario autenticado')
                return
            }

            // No necesitamos verificar rol de admin aquí ya que es separado

            console.log('🔍 [FRONTEND DEBUG] Haciendo petición a /api/user/data...')
            const { data } = await axios.get('/api/user/data')
            console.log('🔍 [FRONTEND DEBUG] Respuesta del servidor:', data)

            if (data.success) {
                console.log('✅ [FRONTEND DEBUG] Usuario encontrado exitosamente en la base de datos')
                setUserData(data.user)
                setCartItems(data.user.cartItems)
            } else {
                console.log('❌ [FRONTEND DEBUG] Error del servidor:', data.message)
                toast.error(data.message)
            }

        } catch (error) {
            console.log('❌ [FRONTEND DEBUG] Error en fetchUserData:', error.message)
            console.log('🔍 [FRONTEND DEBUG] Error completo:', error)
            toast.error(error.message)
        }
    }

    const addToCart = async (itemId) => {

        if (!user) {
            return toast('Please login',{
                icon: '⚠️',
              })
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        if (user) {
            try {
                await axios.post('/api/cart/update', {cartData})
                toast.success('Item added to cart')
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
        if (user) {
            try {
                await axios.post('/api/cart/update', {cartData})
                toast.success('Cart Updated')
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0 && itemInfo) {
                // Usar precio mayorista si la cantidad es >= minQuantity, sino usar precio minorista
                const minQty = itemInfo.minQuantity && itemInfo.minQuantity > 0 ? itemInfo.minQuantity : 1;
                const price = cartItems[items] >= minQty ? itemInfo.offerPrice : itemInfo.price;
                totalAmount += price * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    // Función para generar URL de carrito compartible
    const generateCartShareUrl = () => {
        const cartEntries = Object.entries(cartItems).filter(([id, quantity]) => quantity > 0);
        if (cartEntries.length === 0) return null;
        
        const productsParam = cartEntries.map(([id, quantity]) => `${id}:${quantity}`).join(',');
        return `${window.location.origin}/cart?products=${encodeURIComponent(productsParam)}`;
    }

    // Función para obtener el nombre de la categoría por ID
    const getCategoryName = (categoryId) => {
        if (!categoryId || !categories.length) return 'Sin categoría';
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.name : 'Sin categoría';
    };

    // Función para actualizar un producto específico (para ratings)
    const updateProductRating = (productId, newRating, newTotalRatings) => {
        setProducts(prevProducts => 
            prevProducts.map(product => 
                product._id === productId 
                    ? { ...product, averageRating: newRating, totalRatings: newTotalRatings }
                    : product
            )
        );
    };

    useEffect(() => {
        console.log('🔍 [CONTEXT DEBUG] useEffect ejecutado - cargando productos y categorías')
        console.log('🔍 [CONTEXT DEBUG] Estado inicial - productos:', products.length, 'cargando:', isLoadingProducts)
        
        // Llamar a las funciones de carga inmediatamente
        const loadData = async () => {
            try {
                console.log('🔍 [CONTEXT DEBUG] Iniciando carga de datos...')
                await fetchProductData()
                await fetchCategories()
                console.log('🔍 [CONTEXT DEBUG] Datos cargados exitosamente')
            } catch (error) {
                console.error('🔍 [CONTEXT DEBUG] Error cargando datos:', error)
            }
        }
        
        loadData()
    }, [])

    useEffect(() => {
        console.log('🔍 [FRONTEND DEBUG] useEffect ejecutado - usuario cambió:', user ? { id: user.id, email: user.email, role: user.role } : 'No hay usuario')
        if (user) {
            console.log('🔍 [FRONTEND DEBUG] Usuario detectado, llamando fetchUserData...')
            fetchUserData()
        } else {
            console.log('🔍 [FRONTEND DEBUG] No hay usuario, limpiando datos...')
            setUserData(false)
            setIsSeller(false)
            setCartItems({})
        }
    }, [user])

    const value = {
        user, signOut, getToken,
        router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        categories, fetchCategories,
        getCategoryName,
        updateProductRating,
        isLoadingProducts,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,
        generateCartShareUrl
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}