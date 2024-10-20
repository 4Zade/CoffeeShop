/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operations related to products, including creating, updating and deleting products.
 */

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sample Product
 *               description:
 *                 type: string
 *                 example: This is a description of the sample product.
 *               price:
 *                 type: number
 *                 format: decimal
 *                 example: 29.99
 *               image:
 *                 type: string
 *                 example: http://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 savedProduct:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Sample Product
 *                     description:
 *                       type: string
 *                       example: This is a description of the sample product.
 *                     price:
 *                       type: number
 *                       format: decimal
 *                       example: 29.99
 *                     image:
 *                       type: string
 *                       example: http://example.com/image.jpg
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
 * /api/v1/products/all:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Sample Product
 *                       description:
 *                         type: string
 *                         example: This is a description of the sample product.
 *                       price:
 *                         type: number
 *                         format: decimal
 *                         example: 29.99
 *                       image:
 *                         type: string
 *                         example: http://example.com/image.jpg
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
 * /api/v1/products:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Sample Product
 *                     description:
 *                       type: string
 *                       example: This is a description of the sample product.
 *                     price:
 *                       type: number
 *                       format: decimal
 *                       example: 29.99
 *                     image:
 *                       type: string
 *                       example: http://example.com/image.jpg
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
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
 * /api/v1/products:
 *   patch:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Updated Product Name
 *               description:
 *                 type: string
 *                 example: Updated product description.
 *               price:
 *                 type: number
 *                 format: decimal
 *                 example: 19.99
 *               image:
 *                 type: string
 *                 example: http://example.com/updated_image.jpg
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 result:
 *                   type: object
 *                   properties:
 *                     modifiedCount:
 *                       type: number
 *                       example: 1
 *                     acknowledged:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
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
 * /api/v1/products:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 deletedProduct:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
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
 * /api/v1/products/review:
 *   post:
 *     summary: Review a product (favorite/unfavorite)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product favorited or unfavorited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product favorited.
 *       404:
 *         description: Product or User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
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
