import "dotenv/config";
import fastifySession from "@fastify/session";
import MongoDBStore from "connect-mongodb-session";
import { Admin } from "../models";

const store = MongoDBStore(fastifySession);

export const sessionStore = new store({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

sessionStore.on("error", (err) => {
  console.log("Session store error", err);
});

export const authenticate = async (email: string, password: string) => {
  //uncomment if admin does'nt exist or first time admin login
//   if (email && password) {
//     if (email === "khan.ask.ibrahim@gmail.com" && password === "123456") {
//       return Promise.resolve({ email, password });
//     } else {
//       return null;
//     }
//   }

  //uncomment if admin exists
  if (email && password) {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return null;
    }

    if (admin.password === password) {
      return Promise.resolve({ email, password });
    } else {
      return null;
    }
  }

  return null;
};
