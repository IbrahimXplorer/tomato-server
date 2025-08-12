import { FastifyInstance } from "fastify";
import { getUser, loginDeliveryPartner, refreshToken, sendOtp, verifyOtpLogin } from "../../controllers";

export const authRoute = async (fastify: FastifyInstance) => {
  fastify.post("/customer/send-otp", sendOtp);
  fastify.post("/customer/verify-otp", verifyOtpLogin);
  fastify.post("/customer/refresh", refreshToken);
  fastify.post("/login/delivery-partner", loginDeliveryPartner);
  fastify.get("/user/:id", getUser);
};
