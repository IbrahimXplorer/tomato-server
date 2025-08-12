import { FastifyInstance } from "fastify";
import { authRoute } from "./auth/auth";

export const appRoute = async (fastify: FastifyInstance) => {
  await fastify.register(authRoute, { prefix: "/auth" });
};
