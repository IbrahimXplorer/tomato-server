import { FastifyInstance } from "fastify";
import { getAllCategories } from "../controllers";

export const productRoute = async (fastify: FastifyInstance) => {
  fastify.get("/categories", getAllCategories);
};
