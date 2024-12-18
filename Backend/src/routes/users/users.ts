import express from "express";
import userControllers from "../../controllers/userControllers";
import cartController from "../../controllers/cartController";
import { isAdmin } from "../../middlewares/checkRoles";
import requireAuth from "../../middlewares/authMiddleware";
import { DISCOUNT_VALIDATOR } from "../../validations/discountValidator";
import "./users.docs";
import userValidarots from "../../validations/userValidators";

const router = express.Router();

router.get("/cart", requireAuth, cartController.getCart);
router.post("/cart/:productId", requireAuth, cartController.addToCart);
router.delete("/cart/clear", requireAuth, cartController.clearCart);
router.delete("/cart/:productId", requireAuth, cartController.removeFromCart);

router.post("/contacts", userValidarots.contacts, userControllers.contact);

router.post("/admins/:email", isAdmin, userControllers.addAdmin);
router.delete("/admins/:email", isAdmin, userControllers.removeAdmin);
router.get(`/admins`, isAdmin, userControllers.getAdmins);

router.get(`/discounts`,isAdmin, userControllers.getDiscountCodes);
router.post(`/discounts`, isAdmin , DISCOUNT_VALIDATOR, userControllers.addDiscount);
router.delete(`/discounts/:code`, isAdmin , userControllers.deleteDiscount);
router.patch(`/discounts/:code`, isAdmin, DISCOUNT_VALIDATOR, userControllers.editDiscount);
router.get(`/discounts/:code`, requireAuth, userControllers.checkDiscount);

router.get("/", userControllers.getUsers);
router.get("/:email", userControllers.getUser);
router.patch("/", requireAuth, userValidarots.editUser, userControllers.updateUser);

export default router;
