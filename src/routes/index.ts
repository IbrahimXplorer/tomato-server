import { FastifyInstance } from "fastify";
import { authRoute } from "./auth/auth";
import { productRoute } from "./product";

export const appRoute = async (fastify: FastifyInstance) => {
  await fastify.register(authRoute, { prefix: "/auth" });
  await fastify.register(productRoute, { prefix: "/product" });
};
