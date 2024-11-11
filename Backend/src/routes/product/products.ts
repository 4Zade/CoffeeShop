import express from "express";
import productController from "../../controllers/productControllers";
import requireAuth from "../../middlewares/authMiddleware";
import { isAdmin } from "../../middlewares/checkRoles";
import { PRODUCT_VALIDATOR } from "../../validations/productValidator";
import "./products.docs";

const router = express.Router();

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.delete("/:id", isAdmin, productController.deleteProduct);
router.get("/:category/:id", productController.getProduct);
router.get("/:category", productController.getProductByCategory);
router.patch("/:id",  PRODUCT_VALIDATOR, isAdmin, productController.patchProduct);
router.post("/review", requireAuth, productController.review);

export default router;
