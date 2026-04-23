const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  clientId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  caId:             { type: mongoose.Schema.Types.ObjectId, ref: 'CAProfile', required: true },
  billNumber:       { type: String, required: true },
  servicesSnapshot: { type: Array, required: true },  // frozen copy at generation time
  totalAmount:      { type: Number, required: true },
  tdsAmount:        { type: Number, required: true },
  netPayable:       { type: Number, required: true },
  generatedAt:      { type: Date, default: Date.now },
}, { timestamps: true });

BillSchema.index({ caId: 1, generatedAt: -1 });

module.exports = mongoose.model('Bill', BillSchema);
