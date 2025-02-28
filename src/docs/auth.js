/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication routes
 */

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: User sign-in
 *     tags: [Authentication]
 *     description: Allows users to log in using their email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *       403:
 *         description: User not found
 *       401:
 *         description: Incorrect password
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User sign-up
 *     tags: [Authentication]
 *     description: Allows users to create a new account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or missing fields
 *       500:
 *         description: Internal Server Error
 */
