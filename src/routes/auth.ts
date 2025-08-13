import { FastifyInstance } from "fastify";
import {
  getUser,
  loginDeliveryPartner,
  refreshToken,
  sendOtp,
  updateUser,
  verifyOtpLogin,
} from "../controllers";
import { verifyToken } from "../middleware/auth";

export const authRoute = async (fastify: FastifyInstance) => {
  fastify.post("/customer/send-otp", sendOtp);
  fastify.post("/customer/verify-otp", verifyOtpLogin);
  fastify.post("/refresh", refreshToken);
  fastify.post("/login/delivery-partner", loginDeliveryPartner);
  fastify.get("/user", { preHandler: [verifyToken] }, getUser);
  fastify.patch("/user", { preHandler: [verifyToken] }, updateUser);
};
