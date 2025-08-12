import { FastifyRequest, FastifyReply } from "fastify";
import { isValidPhone } from "../utils/phone";
import { sendTwilioOTP, verifyTwilioOtp } from "../service/twilio";
import { Customer } from "../models";
import { generateToken, verifyRefreshToken } from "../helpers/tokenHelper";

export const sendOtp = async (
  req: FastifyRequest<{ Body: { phone: string } }>,
  reply: FastifyReply
) => {
  const { phone } = req.body;

  if (!phone || !isValidPhone(phone)) {
    return reply.status(400).send({ message: "Invalid phone number" });
  }

  await sendTwilioOTP(phone);

  return reply.status(200).send({ message: "OTP sent" });
};

export const refreshToken = async (
  req: FastifyRequest<{ Body: { refreshToken: string } }>,
  reply: FastifyReply
) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return reply.status(400).send({ message: "Refresh token is required" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken) as any;

    const { _id, role } = decoded;

    const newTokens = generateToken({ _id, role });

    return reply.status(200).send({
      message: "Token refreshed",
      ...newTokens,
    });
  } catch (err) {
    return reply
      .status(401)
      .send({ message: "Invalid or expired refresh token" });
  }
};

export const verifyOtpLogin = async (
  req: FastifyRequest<{ Body: { phone: string; code: string } }>,
  reply: FastifyReply
) => {
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
};
            