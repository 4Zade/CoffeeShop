/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Operations related to transactions, including making a purchase and retrieving transaction history.
 */

/**
 * @swagger
 * /api/v1/purchase:
 *   post:
 *     summary: Make a purchase transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardNumber:
 *                 type: string
 *                 example: '1234-5678-9012-3456'
 *               expiryDate:
 *                 type: string
 *                 example: '12/23'
 *               cvv:
 *                 type: string
 *                 example: '123'
 *     responses:
 *       201:
 *         description: Transaction successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction successful
 *                 newTransaction:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 'tran_1A2B3C'
 *                     user_id:
 *                       type: string
 *                       example: 'user_1'
 *                     order_details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: number
 *                             example: 1
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                     total:
 *                       type: number
 *                       format: decimal
 *                       example: 59.99
 *       400:
 *         description: Transaction failed due to insufficient funds or empty cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart is empty
 *                 reason:
 *                   type: string
 *                   example: Insufficient funds
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while processing your request.
 */

/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Retrieve user transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transactions retrieved successfully
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 'tran_1A2B3C'
 *                       user_id:
 *                         type: string
 *                         example: 'user_1'
 *                       order_details:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productId:
 *                               type: number
 *                               example: 1
 *                             quantity:
 *                               type: number
 *                               example: 2
 *                       total:
 *                         type: number
 *                         format: decimal
 *                         example: 59.99
 *       404:
 *         description: No transactions found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No purchases made
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while processing your request.
 */
