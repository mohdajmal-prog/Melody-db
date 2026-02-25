import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['mutton', 'chicken', 'milk', 'dairy', 'vegetables', 'nuts'],
    required: true,
  },
  weightRangeMin: {
    type: Number,
    required: true,
  },
  weightRangeMax: {
    type: Number,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Number,
    required: true,
    default: 0,
  },
  bulkAvailable: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  features: [{
    type: String,
  }],
  certifications: [{
    type: String,
  }],
  images: [{
    type: String,
  }],
  videoUrl: {
    type: String,
  },
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  tags: [{
    type: String,
  }],
  suitableFor: [{
    type: String,
    enum: ['wedding', 'marriage-hall', 'function-hall', 'birthday', 'corporate', 'festival', 'daily-use'],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.index({ farmerId: 1, category: 1 });
ProductSchema.index({ type: 1, breed: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ suitableFor: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);