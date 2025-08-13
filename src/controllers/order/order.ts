import { FastifyReply } from "fastify";
import { Customer, DeliveryPartner } from "../../models";
import Order from "../../models/order";

export const createOrder = async (req: any, reply: FastifyReply) => {
  try {
    const { userId } = req.user;
    const { items, branch, totalPrice } = req.body;

    const customer = Customer.findById(userId);

    if (!customer) {
      return reply.status(404).send({ messge: "Customer not found" });
    }
    const branchData = Customer.findById(branch);

    if (!branchData) {
      return reply.status(404).send({ messge: "Branch not found" });
    }

    const newOrder = new Order({
      customer,
      items: items.map((item) => ({
        id: item.id,
        item: item.item,
        count: item.count,
      })),
      branch,
      totalPrice,
      deliveryLocation: {
        latitude: customer.liveLocation.latitude,
        longitude: customer.liveLocation.longitude,
        address: customer.address || "No address available",
      },
      pickupLocation: {
        latitude: branchData.liveLocation.latitude,
        longitude: branchData.liveLocation.longitude,
        address: branchData.address || "No address available",
      },
    });
    const savedOrder = newOrder.save();

    return reply
      .status(201)
      .send({ message: "Order created successfully", Order: savedOrder });
  } catch (error) {
    return reply.status(500).send({
      message: "Failed to create an order",
      error,
    });
  }
};

export const confirmOrder = async (req: any, reply: FastifyReply) => {
  try {
    const { userId } = req.user;
    const { orderId } = req.params;
    const { deliveryPersonLocation } = req.body;

    const deliveryPerson = await DeliveryPartner.findById(userId);

    if (!deliveryPerson) {
      return reply.status(404).send({ message: "Delivery person not found!" });
    }
    const order = await Order.findById(orderId);

    if (!order) {
      return reply.status(404).send({ message: "order  not found!" });
    }

    if (order.status !== "available") {
      return reply
        .status(400)
        .send({ message: "Order confirmed by other delivery man" });
    }

    order.status = "confirmed";

    order.deliveryPartner = userId;

    order.deliveryPersonLocation = {
      latitude: deliveryPersonLocation?.latitude,
      longitude: deliveryPersonLocation?.longitude,
      address: deliveryPersonLocation.address || "No address available",
    };

    req.server.io.to(orderId).emit("orderConfirmed", order);

    order.save();

    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({
      message: "Failed to confirm order",
      error,
    });
  }
};

export const updateOrder = async (req: any, reply: FastifyReply) => {
  try {
    const { status, deliveryPersonLocation } = req.body;
    const { userId } = req.user;
    const { orderId } = req.params;

    const deliveryPerson = await DeliveryPartner.findById(userId);

    if (!deliveryPerson) {
      return reply.status(404).send({ message: "Delivery person not found!" });
    }
    const order = await Order.findById(orderId);

    if (!order) {
      return reply.status(404).send({ message: "order  not found!" });
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return reply.status(400).send({ message: "order cannot be updated" });
    }
    if (order.deliveryPartner !== userId) {
      return reply.status(403).send({ message: "Unauthorized" });
    }

    order.status = status;
    order.deliveryPersonLocation = deliveryPersonLocation;
    order.save();

    req.server.io.to(orderId).emit("orderTrackingUpdates", order);

    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({
      message: "Failed to update order",
      error,
    });
  }
};

export const getOrders = async (req: any, reply: FastifyReply) => {
  try {
    const { status, customerId, deliveryPartnerId, branchId } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (customerId) {
      query.customer = customerId;
    }
    if (deliveryPartnerId) {
      query.deliveryPartner = deliveryPartnerId;
      query.branch = branchId;
    }

    const orders = Order.find(query).populate(
      "customer branch items.item deliveryPartner"
    );
    return reply
      .status(200)
      .send({ message: "Orders retrived successfully", data: orders });
  } catch (error) {
    return reply.status(500).send({
      message: "Failed to retrive orders",
      error,
    });
  }
};

export const getOrderById = async (req: any, reply: FastifyReply) => {
  try {
    const { orderId } = req.query;

    const order = Order.findById(orderId).populate(
      "customer branch items.item deliveryPartner"
    );
    return reply
      .status(200)
      .send({ message: "Order retrived successfully", data: order });
  } catch (error) {
    return reply.status(500).send({
      message: "Failed to retrive order",
      error,
    });
  }
};
