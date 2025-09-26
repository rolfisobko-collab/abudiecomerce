import 'dotenv/config';
import mongoose from 'mongoose';

const testConcatenacion = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        const waachatDb = mongoose.connection.useDb('quickcart');
        const waachatCollection = waachatDb.collection('waachat');

        const allDocuments = await waachatCollection.find({}).toArray();
        console.log(`📊 Total documentos: ${allDocuments.length}`);

        allDocuments.forEach((doc, index) => {
            console.log(`\n📄 MENSAJE ${index + 1}:`);
            console.log(`ID: ${doc._id}`);

            let messageText = '';
            let direction = '';
            let contactId = '';

            // Buscar bot_reply
            Object.keys(doc).forEach(key => {
                if (key.includes('bot_reply')) {
                    const match = key.match(/"bot_reply":\s*([^,}]+)/)
                    if (match) {
                        messageText = match[1].trim()
                        direction = 'out'
                        console.log(`🎯 bot_reply encontrado: "${messageText}"`)
                    }
                }
                if (key.includes('from')) {
                    const match = key.match(/"from":\s*([^,}]+)/)
                    if (match) {
                        contactId = match[1].replace(/"/g, '').trim()
                        direction = 'out'
                    }
                }
            });

            // Buscar claves que continúan el mensaje (sin estructura JSON)
            const continuationKeys = Object.keys(doc).filter(key => 
                key && 
                !key.includes('"') && 
                !key.includes(':') && 
                !key.includes('_') && 
                !key.includes('raw_data') &&
                !key.includes('timestamp') &&
                !key.includes('wa_message_id') &&
                key.length > 20 &&
                key !== '_id'
            );

            console.log(`🔍 Claves de continuación encontradas: ${continuationKeys.length}`);
            continuationKeys.forEach(key => {
                console.log(`  - "${key}"`);
                if (messageText && messageText.length > 0) {
                    messageText += ' ' + key.trim();
                }
            });

            console.log(`📝 MENSAJE FINAL: "${messageText}" (${messageText.length} caracteres)`);
            console.log(`📝 DIRECTION: ${direction}`);
            console.log(`📝 CONTACT ID: ${contactId}`);
            console.log('---');
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

testConcatenacion();
