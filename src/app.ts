import fastify from "fastify";
import "dotenv/config";
import { connectDb } from "./configs";
import { appRoute } from "./routes";

const app = fastify();

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL as string;

const startServer = async () => {
  try {
    await connectDb(MONGO_URL);

    await app.register(appRoute, { prefix: "/api" });

    await app.listen({ port: +PORT, host: "0.0.0.0" });

    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    app.log.error(error);

    process.exit(1);
  }
};

startServer();
