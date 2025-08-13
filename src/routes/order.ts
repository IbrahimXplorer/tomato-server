import { FastifyInstance, FastifyReply } from "fastify";
import {
  confirmOrder,
  createOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../controllers/order/order";
import { verifyToken } from "../middleware/auth";

export const orderRoute = async (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", async (req: any, reply: FastifyReply) => {
    const isAuthenticated = await verifyToken(req, reply);
    if (!isAuthenticated) {
      return reply.code(403).send({ message: "unauthorized" });
    }
  });

  fastify.post("/", createOrder);
  fastify.get("/", getOrders);
  fastify.patch("/:orderId/:status", updateOrder);
  fastify.post("/:orderId/:confirm", confirmOrder);
  fastify.get("/:orderId/", getOrderById);
};
