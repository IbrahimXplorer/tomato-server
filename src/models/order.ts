import mongoose from "mongoose";
import Counter from "./counter";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryPartner",
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  item: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      count: {
        type: String,
        required: true,
      },
    },
  ],
  deliveryLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String },
  },
  pickupLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String },
  },
  deliveryPersonLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String },
  },
  status: {
    type: String,
    enum: ["available,confirm", "arriving", "delivered", "cancel"],
    default: "available",
  },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

async function getNextSequenceValue(sequenceName: string) {
  const counter = await Counter.findOneAndUpdate(
    { name: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence_value;
}

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const nextSequence = await getNextSequenceValue("orderId");
    this.orderId = `ORDR${nextSequence.toString().padStart(5, "0")}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
