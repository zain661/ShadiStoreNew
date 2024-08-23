import mongoose from "mongoose";

// const addressSchema = new mongoose.Schema({
//   country: {
//     type: String,
//     required: true,
//   },
//   city: {
//     type: String,
//     required: true,
//   },
//   village: {
//     type: String,
//     required: true,
//   },
//   neighborhood: {
//     type: String,
//     required: false,
//   },
// });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
