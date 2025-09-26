import 'dotenv/config';
import mongoose from 'mongoose';

const simularApiParsing = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        const waachatDb = mongoose.connection.useDb('quickcart');
        const waachatCollection = waachatDb.collection('waachat');

        const allDocuments = await waachatCollection.find({}).toArray();
        console.log(`📊 Total documentos: ${allDocuments.length}`);

        const formattedMessages = [];

        allDocuments.forEach((message, index) => {
            console.log(`\n📄 PROCESANDO MENSAJE ${index + 1}:`);
            console.log(`ID: ${message._id}`);

            // Variables para extraer
            let messageContactId = '';
            let contactName = '';
            let messageText = '';
            let direction = '';
            let timestamp = '';
            let messageId = '';

            // Buscar en las claves del objeto - PARSING PARA ESTRUCTURA MALFORMADA
            Object.keys(message).forEach(key => {
                console.log(`🔑 Procesando clave: "${key}"`);

                // Para mensajes del cliente (direction: in)
                if (key.includes('contact_wa_id')) {
                    const match = key.match(/"contact_wa_id":\s*([^,}]+)/)
                    if (match) messageContactId = match[1].replace(/"/g, '').trim()
                }
                if (key.includes('contact_name')) {
                    const match = key.match(/"contact_name":\s*([^,}]+)/)
                    if (match) contactName = match[1].replace(/"/g, '').trim()
                }
                if (key.includes('message_text')) {
                    const match = key.match(/"message_text":\s*([^,}]+)/)
                    if (match) messageText = match[1].replace(/"/g, '').trim()
                }
                if (key.includes('direction')) {
                    const match = key.match(/"direction":\s*([^,}]+)/)
                    if (match) direction = match[1].replace(/"/g, '').trim()
                }
                if (key.includes('timestamp')) {
                    const match = key.match(/"timestamp":\s*([^,}]+)/)
                    if (match) timestamp = match[1].replace(/"/g, '').trim()
                }
                if (key.includes('message_id')) {
                    const match = key.match(/"message_id":\s*([^,}]+)/)
                    if (match) messageId = match[1].replace(/"/g, '').trim()
                }

                // Para mensajes de la IA (from, bot_reply, wa_message_id) - ESTRUCTURA MALFORMADA
                if (key.includes('from')) {
                    const match = key.match(/"from":\s*([^,}]+)/)
                    if (match) {
                        messageContactId = match[1].replace(/"/g, '').trim()
                        direction = 'out'
                    }
                }
                if (key.includes('bot_reply')) {
                    // Extraer el texto del bot_reply de la clave malformada - PARSING COMPLETO
                    const match = key.match(/"bot_reply":\s*"([^"]+)"/)
                    if (match) {
                        messageText = match[1].trim()
                        console.log(`🎯 bot_reply con comillas: "${messageText}"`)
                    } else {
                        // Si no encuentra comillas, buscar hasta el final de la clave
                        const match2 = key.match(/"bot_reply":\s*([^,}]+)/)
                        if (match2) {
                            messageText = match2[1].trim()
                            console.log(`🎯 bot_reply sin comillas: "${messageText}"`)
                        }
                    }
                }

                // Buscar claves que continúan el mensaje de bot_reply (sin comillas ni estructura JSON)
                if (key && 
                    !key.includes('"') && 
                    !key.includes(':') && 
                    !key.includes('_') && 
                    !key.includes('raw_data') &&
                    !key.includes('timestamp') &&
                    !key.includes('wa_message_id') &&
                    key.length > 20 &&
                    key !== '_id') {
                    // Es probable que sea la continuación del mensaje
                    if (messageText && messageText.length > 0) {
                        console.log(`🔗 Concatenando: "${key}"`)
                        messageText += ' ' + key.trim()
                        console.log(`🔗 Resultado: "${messageText}"`)
                    }
                }

                // Buscar en raw_data_iaData_output también - PARSING COMPLETO
                if (key.includes('raw_data_iaData_output')) {
                    const match = key.match(/"raw_data_iaData_output":\s*"([^"]+)"/)
                    if (match) {
                        messageText = match[1].trim()
                        console.log(`🎯 raw_data_iaData_output con comillas: "${messageText}"`)
                    } else {
                        // Si no encuentra comillas, buscar hasta el final de la clave
                        const match2 = key.match(/"raw_data_iaData_output":\s*([^,}]+)/)
                        if (match2) {
                            messageText = match2[1].trim()
                            console.log(`🎯 raw_data_iaData_output sin comillas: "${messageText}"`)
                        }
                    }
                }

                // Buscar en el valor del objeto también (para mensajes completos)
                if (message[key] && typeof message[key] === 'string' && message[key].length > 10) {
                    if (key.includes('bot_reply') || key.includes('raw_data_iaData_output')) {
                        messageText = message[key]
                        console.log(`🎯 Valor del objeto: "${messageText}"`)
                    }
                }
                if (key.includes('wa_message_id')) {
                    const match = key.match(/"wa_message_id":\s*([^,}]+)/)
                    if (match) messageId = match[1].replace(/"/g, '').trim()
                }

                // Para timestamps de la IA
                if (key.includes('timestamp') && key.includes('2025-')) {
                    const match = key.match(/"timestamp":\s*([^"]+)/)
                    if (match) timestamp = match[1].replace(/"/g, '').trim()
                }
            });

            console.log(`\n📋 RESULTADO FINAL:`);
            console.log(`  - Contact ID: "${messageContactId}"`);
            console.log(`  - Contact Name: "${contactName}"`);
            console.log(`  - Message Text: "${messageText}" (${messageText.length} caracteres)`);
            console.log(`  - Direction: "${direction}"`);
            console.log(`  - Timestamp: "${timestamp}"`);
            console.log(`  - Message ID: "${messageId}"`);

            // Solo incluir si tiene contact_wa_id
            if (messageContactId) {
                formattedMessages.push({
                    _id: message._id,
                    direction: direction || 'in',
                    contact_name: contactName || 'Cliente',
                    contact_wa_id: messageContactId,
                    message_text: messageText && messageText !== 'null' ? messageText : 'Mensaje sin texto',
                    timestamp: timestamp || new Date().toISOString(),
                    message_id: messageId || `msg_${Date.now()}`,
                    sent_by_admin: direction === 'out',
                    created_at: new Date().toISOString()
                });
                console.log(`✅ Mensaje incluido`);
            } else {
                console.log(`❌ Mensaje excluido (sin contact_wa_id)`);
            }
            console.log('---');
        });

        console.log(`\n📊 TOTAL MENSAJES PROCESADOS: ${formattedMessages.length}`);
        formattedMessages.forEach((msg, index) => {
            console.log(`${index + 1}. "${msg.message_text}" (${msg.message_text.length} chars) - ${msg.direction}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

simularApiParsing();
