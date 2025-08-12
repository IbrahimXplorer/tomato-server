import { FastifyReply, FastifyRequest } from "fastify";
import { Customer, DeliveryPartner } from "../../models";

export const updateUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { userId } = (req as any).user;
    const payload = (req as any).data;

    const user =
      (await Customer.findById(userId)) ||
      (await DeliveryPartner.findById(userId));

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    let model: any;
    if ((user as any).role === "Customer") {
      model = Customer;
    } else if ((user as any).role === "DeliveryPartner") {
      model = DeliveryPartner;
    } else {
      return reply.status(400).send({ message: "Invalid role" });
    }

    const updatedUser = await model.findByIdAndUpdate(
      userId,
      { $set: payload },
      { new: true, runValidators: true }
    );

    return reply.status(200).send({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};
