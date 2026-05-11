const mongoose = require('mongoose');

const crackerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a cracker name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Firecrackers', 'Sparklers', 'Bombs', 'Decorative', 'Premium'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cracker', crackerSchema);
