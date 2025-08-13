import { FastifyInstance } from "fastify";
import { getAllCategories, getProductByCategoryId } from "../controllers";

export const productRoute = async (fastify: FastifyInstance) => {
  fastify.get("/categories", getAllCategories);
  fastify.get("/products/:categoryId", getProductByCategoryId);
};
