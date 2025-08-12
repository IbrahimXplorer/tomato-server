import { FastifyRequest, FastifyReply } from "fastify";
import { isValidPhone } from "../utils/phone";
import { sendTwilioOTP, verifyTwilioOtp } from "../service/twilio";
import { Customer, DeliveryPartner } from "../models";
import { generateToken, verifyRefreshToken } from "../helpers/tokenHelper";
import jwt, { JwtPayload } from "jsonwebtoken";

export const sendOtp = async (
  req: FastifyRequest<{ Body: { phone: string } }>,
  reply: FastifyReply
) => {
  try {
    const { phone } = req.body;

    if (!phone || !isValidPhone(phone)) {
      return reply.status(400).send({ message: "Invalid phone number" });
    }

    await sendTwilioOTP(phone);

    return reply.status(200).send({ message: "OTP sent" });
  } catch (error) {
    console.error("sendOtp error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const refreshToken = async (
  req: FastifyRequest<{ Body: { refreshToken: string } }>,
  reply: FastifyReply
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return reply.status(400).send({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    const payload = decoded as JwtPayload & {
      role: string;
      userId?: string;
    };

    let user = null;
    if (payload.role === "Customer") {
      user = await Customer.findOne({ id: payload.userId });
    } else if (payload.role === "DeliveryPartner") {
      user = await DeliveryPartner.findOne({ id: payload.userId });
    }

    if (!user) {
      return reply.status(403).send({ message: "User not found" });
    }

    const verifiedUser = verifyRefreshToken(refreshToken) as {
      _id: string;
      role: string;
    };

    const { _id, role } = verifiedUser;
    const newTokens = generateToken({ _id, role });

    return reply.status(200).send({
      message: "Token refreshed",
      ...newTokens,
    });
  } catch (error) {
    console.error("refreshToken error:", error);
    return reply
      .status(401)
      .send({ message: "Invalid or expired refresh token" });
  }
};

export const verifyOtpLogin = async (
  req: FastifyRequest<{ Body: { phone: string; code: string } }>,
  reply: FastifyReply
) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code || !isValidPhone(phone)) {
      return reply.status(400).send({ message: "Invalid phone or code" });
    }

    const verification = await verifyTwilioOtp(phone, code);

    if (verification.status !== "approved") {
      return reply.status(400).send({ message: "Invalid OTP" });
    }

    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = await Customer.create({ phone });
    }

    const { accessToken, refreshToken } = generateToken({
      _id: customer._id.toString(),
      role: customer.get("role"),
    });

    return reply.status(200).send({
      message: "Login successful",
      customer: {
        id: customer._id,
        phone: customer.phone,
        role: customer.get("role"),
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("verifyOtpLogin error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const loginDeliveryPartner = async (
  req: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return reply.status(400).send({ message: "Email is required" });
    }
    if (!password) {
      return reply.status(400).send({ message: "Password is required" });
    }

    const deliveryPartner = await DeliveryPartner.findOne({ email }).exec();

    if (!deliveryPartner) {
      return reply.status(404).send({ message: "Delivery partner not found" });
    }
    if (password !== deliveryPartner.password) {
      return reply.status(400).send({ message: "Password did not match" });
    }

    const { accessToken, refreshToken } = generateToken({
      _id: deliveryPartner.id,
      role: deliveryPartner.get("role"),
    });

    return reply.status(200).send({
      message: "Login successful",
      deliveryPartner,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("loginDeliveryPartner error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const getUser = async (
  req: FastifyRequest<{
    Body: { userId: string; role: "Customer" | "DeliveryPartner" };
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId, role } = req.body;

    let user = null;
    if (role === "Customer") {
      user = await Customer.findOne({ id: userId });
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findOne({ id: userId });
    }

    if (!user) {
      return reply.status(403).send({ message: "User not found" });
    }

    return reply.status(200).send({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("getUser error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};
