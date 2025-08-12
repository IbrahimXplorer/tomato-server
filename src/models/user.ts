import mongoose from "mongoose";

// Common Role Enums
const ROLES = {
  CUSTOMER: "Customer",
  ADMIN: "Admin",
  DELIVERY_PARTNER: "DeliveryPartner",
};

// Base User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      default: ROLES.CUSTOMER,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

// Customer Schema
const customerSchema = new mongoose.Schema(
  {
    ...userSchema.obj,
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^(01)[0-9]{9}$/, "Invalid Bangladeshi phone number"],
    },
    liveLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Delivery Partner Schema
const deliveryPartnerSchema = new mongoose.Schema(
  {
    ...userSchema.obj,
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^(01)[0-9]{9}$/, "Invalid phone number"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Invalid email"],
    },
    password: {
      type: String,
      required: true,
    },
    liveLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    address: {
      type: String,
      trim: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    role: {
      type: String,
      enum: [ROLES.DELIVERY_PARTNER],
      default: ROLES.DELIVERY_PARTNER,
    },
  },
  { timestamps: true }
);

// Admin Schema
const adminSchema = new mongoose.Schema(
  {
    ...userSchema.obj,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Invalid email"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [ROLES.ADMIN],
      default: ROLES.ADMIN,
    },
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
export const Admin = mongoose.model("Admin", adminSchema);
export const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  deliveryPartnerSchema
);
