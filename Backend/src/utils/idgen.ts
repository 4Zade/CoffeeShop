import User from "../models/userModel";
import Product from "../models/productModel";

export async function generateUserId() {
  const id = Math.floor(10000000 + Math.random() * 90000000).toString();

  const existingUser = await User.findOne({ id: id });

  if (existingUser) {
    return generateUserId();
  }

  return id;
}

export async function generateProductId() {
  const id = Math.floor(Math.random() * 100000);

  const matchingProduct = await Product.findOne({ id });

  if (matchingProduct) {
    return generateProductId();
  }

  return id;
}
