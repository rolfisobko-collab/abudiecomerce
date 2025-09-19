import mongoose from "mongoose";

const PaymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['BANK_TRANSFER', 'CRYPTO']
  },
  category: {
    type: String,
    required: true,
    enum: ['CBU', 'PIX', 'TED', 'USDT_TRON', 'USDT_ETHEREUM', 'USDT_BSC', 'USDT_POLYGON', 'BTC', 'ETH', 'BNB']
  },
  country: {
    type: String,
    required: true,
    enum: ['AR', 'BR', 'PY', 'GLOBAL']
  },
  currency: {
    type: String,
    required: true,
    enum: ['ARS', 'BRL', 'PYG', 'USD', 'BTC', 'ETH', 'BNB']
  },
  name: {
    type: String,
    required: true
  },
  // Para transferencias bancarias
  bankName: {
    type: String,
    required: function() { return this.type === 'BANK_TRANSFER'; }
  },
  accountNumber: {
    type: String,
    required: function() { return this.type === 'BANK_TRANSFER'; }
  },
  accountHolder: {
    type: String,
    required: function() { return this.type === 'BANK_TRANSFER'; }
  },
  cbu: {
    type: String,
    required: function() { return this.category === 'CBU'; }
  },
  pix: {
    type: String,
    required: function() { return this.category === 'PIX'; }
  },
  // Para criptomonedas
  walletAddress: {
    type: String,
    required: function() { return this.type === 'CRYPTO'; }
  },
  network: {
    type: String,
    required: function() { return this.type === 'CRYPTO'; }
  },
  // Información adicional
  instructions: {
    type: String,
    required: true
  },
  minAmount: {
    type: Number,
    default: 0
  },
  maxAmount: {
    type: Number,
    default: 999999999
  },
  processingTime: {
    type: String,
    default: "Inmediato"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Eliminar el modelo existente si existe
if (mongoose.models.paymentmethod) {
  delete mongoose.models.paymentmethod;
}

export default mongoose.model("paymentmethod", PaymentMethodSchema);
