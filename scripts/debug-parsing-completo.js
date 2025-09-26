import 'dotenv/config';
import mongoose from 'mongoose';

const debugParsingCompleto = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        const waachatDb = mongoose.connection.useDb('quickcart');
        const waachatCollection = waachatDb.collection('waachat');

        console.log('🔍 Usando base de datos: quickcart');
        console.log('🔍 Colección: waachat');

        const allDocuments = await waachatCollection.find({}).toArray();
        console.log(`📊 Total documentos en waachat: ${allDocuments.length}`);

        console.log('\n🔍 ========== PARSING COMPLETO DE CADA MENSAJE ==========');

        allDocuments.forEach((doc, index) => {
            console.log(`\n📄 MENSAJE ${index + 1}:`);
            console.log(`ID: ${doc._id}`);

            // Variables para extraer
            let contactId = '';
            let contactName = '';
            let messageText = '';
            let direction = '';
            let timestamp = '';
            let messageId = '';

            // Buscar en las claves del objeto - PARSING COMPLETO
            Object.keys(doc).forEach(key => {
                console.log(`\n🔑 CLAVE: ${key}`);
                console.log(`📝 VALOR: ${doc[key]}`);

                // Para mensajes del cliente (direction: in)
                if (key.includes('contact_wa_id')) {
                    const match = key.match(/"contact_wa_id":\s*([^,}]+)/)
                    if (match) contactId = match[1].replace(/"/g, '').trim()
                    console.log(`🎯 contact_wa_id extraído: "${contactId}"`)
                }
                if (key.includes('contact_name')) {
                    const match = key.match(/"contact_name":\s*([^,}]+)/)
                    if (match) contactName = match[1].replace(/"/g, '').trim()
                    console.log(`🎯 contact_name extraído: "${contactName}"`)
                }
                if (key.includes('message_text')) {
                    const match = key.match(/"message_text":\s*([^,}]+)/)
                    if (match) messageText = match[1].replace(/"/g, '').trim()
                    console.log(`🎯 message_text extraído: "${messageText}" (${messageText.length} chars)`)
                }
                if (key.includes('direction')) {
                    const match = key.match(/"direction":\s*([^,}]+)/)
                    if (match) direction = match[1].replace(/"/g, '').trim()
                    console.log(`🎯 direction extraído: "${direction}"`)
                }
                if (key.includes('timestamp')) {
                    const match = key.match(/"timestamp":\s*([^,}]+)/)
                    if (match) timestamp = match[1].replace(/"/g, '').trim()
                    console.log(`🎯 timestamp extraído: "${timestamp}"`)
                }
                if (key.includes('message_id')) {
                    const match = key.match(/"message_id":\s*([^,}]+)/)
                    if (match) messageId = match[1].replace(/"/g, '').trim()
                    console.log(`🎯 message_id extraído: "${messageId}"`)
                }

                // Para mensajes de la IA (from, bot_reply, wa_message_id) - PARSING COMPLETO
                if (key.includes('from')) {
                    const match = key.match(/"from":\s*([^,}]+)/)
                    if (match) {
                        contactId = match[1].replace(/"/g, '').trim()
                        direction = 'out'
                        console.log(`🎯 from extraído: "${contactId}"`)
                    }
                }
                if (key.includes('bot_reply')) {
                    // Extraer el texto del bot_reply de la clave malformada - PARSING COMPLETO
                    const match = key.match(/"bot_reply":\s*"([^"]+)"/)
                    if (match) {
                        messageText = match[1].trim()
                        console.log(`🎯 bot_reply con comillas extraído: "${messageText}" (${messageText.length} chars)`)
                    } else {
                        // Si no encuentra comillas, buscar hasta el final de la clave
                        const match2 = key.match(/"bot_reply":\s*([^,}]+)/)
                        if (match2) {
                            messageText = match2[1].trim()
                            console.log(`🎯 bot_reply sin comillas extraído: "${messageText}" (${messageText.length} chars)`)
                        }
                    }
                }

                // Buscar en raw_data_iaData_output también - PARSING COMPLETO
                if (key.includes('raw_data_iaData_output')) {
                    const match = key.match(/"raw_data_iaData_output":\s*"([^"]+)"/)
                    if (match) {
                        messageText = match[1].trim()
                        console.log(`🎯 raw_data_iaData_output con comillas extraído: "${messageText}" (${messageText.length} chars)`)
                    } else {
                        // Si no encuentra comillas, buscar hasta el final de la clave
                        const match2 = key.match(/"raw_data_iaData_output":\s*([^,}]+)/)
                        if (match2) {
                            messageText = match2[1].trim()
                            console.log(`🎯 raw_data_iaData_output sin comillas extraído: "${messageText}" (${messageText.length} chars)`)
                        }
                    }
                }

                // Buscar en el valor del objeto también (para mensajes completos)
                if (doc[key] && typeof doc[key] === 'string' && doc[key].length > 10) {
                    if (key.includes('bot_reply') || key.includes('raw_data_iaData_output')) {
                        messageText = doc[key]
                        console.log(`🎯 Valor del objeto extraído: "${messageText}" (${messageText.length} chars)`)
                    }
                }
                if (key.includes('wa_message_id')) {
                    const match = key.match(/"wa_message_id":\s*([^,}]+)/)
                    if (match) messageId = match[1].replace(/"/g, '').trim()
                    console.log(`🎯 wa_message_id extraído: "${messageId}"`)
                }

                // Para timestamps de la IA
                if (key.includes('timestamp') && key.includes('2025-')) {
                    const match = key.match(/"timestamp":\s*([^"]+)/)
                    if (match) timestamp = match[1].replace(/"/g, '').trim()
                    console.log(`🎯 timestamp IA extraído: "${timestamp}"`)
                }
            });

            console.log(`\n📋 RESULTADO FINAL DEL PARSING:`);
            console.log(`  - Contact ID: "${contactId}"`);
            console.log(`  - Contact Name: "${contactName}"`);
            console.log(`  - Message Text: "${messageText}" (${messageText.length} caracteres)`);
            console.log(`  - Direction: "${direction}"`);
            console.log(`  - Timestamp: "${timestamp}"`);
            console.log(`  - Message ID: "${messageId}"`);
            console.log('---');
        });

    } catch (error) {
        console.error('❌ Error al hacer parsing completo:', error);
    } finally {
        await mongoose.disconnect();
    }
};

debugParsingCompleto();
