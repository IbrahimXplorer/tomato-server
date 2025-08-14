import "dotenv/config";
import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { dark, light, noSidebar } from "@adminjs/themes";
import AdminJSFastify from "@adminjs/fastify";
import {
  Admin,
  Branch,
  Category,
  Counter,
  Customer,
  DeliveryPartner,
  Product,
} from "../models";
import Order from "../models/order";
import { authenticate, sessionStore } from "./admin";

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Customer,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: DeliveryPartner,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Admin,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Branch,
    },
    {
      resource: Product,
    },
    {
      resource: Category,
    },
    {
      resource: Order,
    },
    {
      resource: Counter,
    },
  ],
  branding: {
    companyName: "Tomato",
    withMadeWithLove: false,
  },
  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
  rootPath: "/admin",
});

export const buildAdminRouter = async (app) => {
  try {
    await AdminJSFastify.buildAuthenticatedRouter(
      admin,
      {
        authenticate,
        cookiePassword: process.env.COOKIE_PASSWORD as string,
        cookieName: "adminjs",
      },
      app,
      {
        store: sessionStore as any,
        saveUninitialized: true,
        secret: process.env.COOKIE_PASSWORD,
        cookie: {
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
        },
      }
    );
  } catch (error) {
    console.log("error", error);
  }
};
