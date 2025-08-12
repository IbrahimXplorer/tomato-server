import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import Product from "../../models/product";
import { buildPaginationMeta, parsePagination } from "../../utils/pagination";

type Params = { categoryId: string };
type Query = { page?: number; limit?: number };

export const getProductByCategoryId = async (
  req: FastifyRequest<{ Params: Params; Querystring: Query }>,
  reply: FastifyReply
) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return reply.code(400).send({ message: "Invalid categoryId." });
  }

  const pagination = parsePagination(req.query, { defaultLimit: 20, maxLimit: 100 });
  const filter = { category: categoryId };

  try {
    const [items, total] = await Promise.all([
      Product.find(filter)
        .select("-category")
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return reply.code(200).send({
      message: "Products fetched successfully",
      data: items,
      pagination: buildPaginationMeta(total, pagination),
    });
  } catch {
    return reply.code(500).send({
      message: "An unexpected error occurred while fetching products",
    });
  }
};
