import { FastifyInstance } from "fastify";
import { authRoute } from "./auth";
import { productRoute } from "./product";
import { orderRoute } from "./order";

export const appRoute = async (fastify: FastifyInstance) => {
  await fastify.register(authRoute, { prefix: "/auth" });
  await fastify.register(productRoute, { prefix: "/product" });
  await fastify.register(orderRoute, { prefix: "/order" });
};
