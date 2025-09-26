const axios = require('axios');

async function testAdminAPIs() {
    console.log('🔍 [TEST DEBUG] Probando APIs de admin...');
    
    try {
        // Probar API de admin-users
        console.log('🔍 [TEST DEBUG] Probando /api/admin-users...');
        const adminUsersResponse = await axios.get('http://localhost:3000/api/admin-users');
        console.log('✅ [TEST DEBUG] Admin-users response:', adminUsersResponse.data);
    } catch (error) {
        console.error('❌ [TEST DEBUG] Error en admin-users:', error.response?.data || error.message);
    }
    
    try {
        // Probar API de payment-methods
        console.log('🔍 [TEST DEBUG] Probando /api/payment-methods...');
        const paymentMethodsResponse = await axios.get('http://localhost:3000/api/payment-methods');
        console.log('✅ [TEST DEBUG] Payment-methods response:', paymentMethodsResponse.data);
    } catch (error) {
        console.error('❌ [TEST DEBUG] Error en payment-methods:', error.response?.data || error.message);
    }
}

testAdminAPIs();
