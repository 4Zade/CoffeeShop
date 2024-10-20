import express from "express";
import transactionController from "../../controllers/transactionsController";
import { CARD_VALIDATOR } from "../../validations/cardValidator";

import "./transactions.docs";

const router = express.Router();

router.post("/purchase", CARD_VALIDATOR, transactionController.makeTransaction);
router.get("/transactions", transactionController.getTransactions);

export default router;
