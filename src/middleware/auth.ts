import { FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export const verifyToken = async (req: any, reply: FastifyReply) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Token is required" });
    }
    const token = authHeader.split(" ")[0];

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    req.user = decoded;
    
    return true;
  } catch (error) {
    return reply
      .status(403)
      .send({ message: "Invalid or expired token", error });
  }
};
