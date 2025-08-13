import mongoose from "mongoose";
import "dotenv/config.js";
import { Category, Product } from "./src/models";
import { categories, products } from "./seedData";

const seedDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);

    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoryDocs = await Category.insertMany(categories);

    const categoryMap = categoryDocs.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    const productWithCategoryIds = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    await Product.insertMany(productWithCategoryIds);
    console.log("Databse seeded succeffully");
  } catch (error) {
    console.log("Error seeding databse:", error);
 } finally {
  await mongoose.disconnect();
  console.log("MongoDB connection closed.");
}
};

seedDataBase()
