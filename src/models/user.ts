import mongoose from "mongoose";

//base schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Customer", "Admin", "Delivery Partner"],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

//customer schema
const customerSchema = new mongoose.Schema({
  ...userSchema.obj,
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: {
    type: String,
  },
});

//delivery Partner schema
const deliveryPartnerSchema = new mongoose.Schema({
  ...userSchema.obj,
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: {
    type: String,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  role: {
    type: String,
    enum: ["DeliveryPartner"],
    default: "DeliveryPartner",
  },
});

//admin schema
const adminSchema = new mongoose.Schema({
  ...userSchema.obj,

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin"],
    default: "Admin",
  },
});

export const Customer = mongoose.model("Customer", customerSchema);
export const Admin = mongoose.model("Admin", adminSchema);
export const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  deliveryPartnerSchema
);
