const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: Array,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    thumb: { type: String, required: true },
    fileNameThumb: String,
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: Array,
    fileNameImages: Array,
    color: {
      type: String,
      require: true,
    },
    ratings: [
      {
        star: { type: Number },
        posteBy: { type: mongoose.Types.ObjectId, ref: "User" },
        comment: { type: String },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
    varriantis: [
      {
        color: String,
        price: String,
        thumb: String,
        fileNameThumb: String,
        images: Array,
        fileNameImages: Array,
        quantity: { type: Number, default: 0 },
        sold: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
