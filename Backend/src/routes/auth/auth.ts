import express from "express";
import authControllers from "../../controllers/authControllers";
import requireAuth from "../../middlewares/authMiddleware";
import authValidator from "../../validations/authValidator";
import rateLimiters from "../../middlewares/rateLimiters";

import "./auth.docs";

const router = express.Router();

router.post("/register", authValidator.register, authControllers.register);
router.post("/login", authValidator.login, authControllers.login);
router.post("/logout", requireAuth, authControllers.logout);
router.get("/status", authControllers.status);
router.post("/verify/:token", authControllers.verifyEmail);
router.get("/resend-verify", rateLimiters.resendVerificationLimiter, authControllers.resendVerifyEmail);
router.post("/password/request-reset", rateLimiters.requestPasswordLimiter, authControllers.requestPasswordReset);
router.post("/password/reset/:token", authControllers.passwordReset);
router.post("/password/change", requireAuth, authControllers.changePassword);

export default router;
