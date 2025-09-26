import mongoose from 'mongoose'

const whatsAppMessageSchema = new mongoose.Schema({
  direction: {
    type: String,
    enum: ['in', 'out'],
    required: true
  },
  messaging_product: {
    type: String,
    default: 'whatsapp'
  },
  phone_number_id: {
    type: String,
    required: false
  },
  display_phone_number: {
    type: String,
    required: false
  },
  contact_name: {
    type: String,
    required: false
  },
  contact_wa_id: {
    type: String,
    required: true
  },
  message_id: {
    type: String,
    required: false
  },
  message_from: {
    type: String,
    required: false
  },
  message_text: {
    type: String,
    required: false
  },
  timestamp: {
    type: Number,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  sent_by_admin: {
    type: Boolean,
    default: false
  },
  // Campos adicionales para mensajes entrantes
  contact_input: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

// Índices para mejorar el rendimiento
whatsAppMessageSchema.index({ contact_wa_id: 1, timestamp: -1 })
whatsAppMessageSchema.index({ direction: 1 })
whatsAppMessageSchema.index({ timestamp: -1 })

const WhatsAppMessage = mongoose.models.WhatsAppMessage || mongoose.model('WhatsAppMessage', whatsAppMessageSchema)

export default WhatsAppMessage
