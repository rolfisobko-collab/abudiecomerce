const fetch = require('node-fetch');

async function testWhatsAppAPI() {
  try {
    console.log('🔍 [TEST DEBUG] Probando API de WhatsApp...');
    
    // Probar API de chats
    console.log('\n📋 [TEST DEBUG] Probando /api/seller/whatsapp/chats');
    const chatsResponse = await fetch('http://localhost:3001/api/seller/whatsapp/chats');
    const chatsData = await chatsResponse.json();
    
    console.log('📊 [TEST DEBUG] Status:', chatsResponse.status);
    console.log('📊 [TEST DEBUG] Success:', chatsData.success);
    console.log('📊 [TEST DEBUG] Chats count:', chatsData.chats ? chatsData.chats.length : 0);
    
    if (chatsData.chats && chatsData.chats.length > 0) {
      console.log('📝 [TEST DEBUG] Primeros chats:');
      chatsData.chats.slice(0, 3).forEach((chat, index) => {
        console.log(`  ${index + 1}. ${chat.contact_name} (${chat.contact_wa_id})`);
        console.log(`     Último mensaje: ${chat.last_message}`);
        console.log(`     Timestamp: ${chat.last_timestamp}`);
        console.log(`     Dirección: ${chat.last_direction}`);
        console.log('');
      });
      
      // Probar API de mensajes con el primer chat
      const firstChat = chatsData.chats[0];
      console.log(`\n💬 [TEST DEBUG] Probando mensajes para ${firstChat.contact_name} (${firstChat.contact_wa_id})`);
      
      const messagesResponse = await fetch(`http://localhost:3001/api/seller/whatsapp/messages/${firstChat.contact_wa_id}`);
      const messagesData = await messagesResponse.json();
      
      console.log('📊 [TEST DEBUG] Messages Status:', messagesResponse.status);
      console.log('📊 [TEST DEBUG] Messages Success:', messagesData.success);
      console.log('📊 [TEST DEBUG] Messages count:', messagesData.messages ? messagesData.messages.length : 0);
      
      if (messagesData.messages && messagesData.messages.length > 0) {
        console.log('📝 [TEST DEBUG] Mensajes:');
        messagesData.messages.forEach((message, index) => {
          console.log(`  ${index + 1}. [${message.direction}] ${message.message_text}`);
          console.log(`     Timestamp: ${message.timestamp}`);
          console.log('');
        });
      }
    }
    
    // Probar desde el navegador simulando
    console.log('\n🌐 [TEST DEBUG] Simulando petición desde navegador...');
    const browserResponse = await fetch('http://localhost:3001/api/seller/whatsapp/chats', {
      headers: {
        'Cookie': 'admin-session=authenticated',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const browserData = await browserResponse.json();
    console.log('📊 [TEST DEBUG] Browser Status:', browserResponse.status);
    console.log('📊 [TEST DEBUG] Browser Success:', browserData.success);
    console.log('📊 [TEST DEBUG] Browser Chats:', browserData.chats ? browserData.chats.length : 0);
    
  } catch (error) {
    console.error('❌ [TEST DEBUG] Error:', error.message);
  }
}

testWhatsAppAPI();
