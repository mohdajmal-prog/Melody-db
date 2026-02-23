import mongoose from 'mongoose';

const BulkOrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentId: {
    type: String,
  },
  deliveryDate: {
    type: Date,
  },
  eventType: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  specialRequirements: {
    type: String,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BulkOrderSchema.index({ customerId: 1, status: 1 });
BulkOrderSchema.index({ farmerId: 1, status: 1 });
BulkOrderSchema.index({ createdAt: -1 });

export default mongoose.models.BulkOrder || mongoose.model('BulkOrder', BulkOrderSchema);