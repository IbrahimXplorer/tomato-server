import { FastifyRequest, FastifyReply } from "fastify";
import { Category } from "../../models";

export const getAllCategories = async (
  _req: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const categoryList = await Category.find();

    return reply.status(200).send({
      message: "Categories fetched successfully",
      data: categoryList,
    });
  } catch (err) {
    return reply.status(500).send({
      message: "An unexpected error occurred while fetching categories",
    });
  }
};
