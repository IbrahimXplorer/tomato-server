import fastify from "fastify";
import "dotenv/config";
import { connectDb } from "./configs";
import { appRoute } from "./routes";
import fastifySocketIO from "fastify-socket.io";
import { admin, buildAdminRouter } from "./configs/setup";

const app = fastify();

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL as string;

const startServer = async () => {
  try {
    await connectDb(MONGO_URL);

    //register socket
    app.register(fastifySocketIO, {
      cors: {
        origin: "*",
      },
      pingInterval: 10000,
      pingTimeout: 5000,
      transports: ["websocket"],
    });

    await app.register(appRoute, { prefix: "/api" });

    await buildAdminRouter(app)

    await app.listen({ port: +PORT, host: "0.0.0.0" });

    app.ready().then(() => {
      app.io.on("connection", (socket) => {
        console.log("A user connected");
        socket.on("joinRoom", (orderId) => {
          socket.join(orderId);
          console.log(`User Joined room ${orderId}`);
        });
        socket.on("disconnect", () => {
          console.log("User Disconnected");
        });
      });
    });

    console.log(`🚀 Grocery app running at http://localhost:${PORT}${admin.options.rootPath}`);
  } catch (error) {
    app.log.error(error);

    process.exit(1);
  }
};

startServer();
