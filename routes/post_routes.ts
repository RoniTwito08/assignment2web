import express from "express";
import PostControllers from "../controllers/post_controller";
import { authMiddleware } from "../controllers/user_controllers";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: API for managing posts
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - userId
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the post
 *           example: "60d0fe4f5311236168a109ca"
 *         userId:
 *           type: string
 *           description: The ID of the user who created the post
 *           example: "60d0fe4f5311236168a109cb"
 *         content:
 *           type: string
 *           description: The content of the post
 *           example: "This is a sample post."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was created
 *           example: "2024-01-08T12:34:56Z"
 */

/**
 * @swagger
 * /api/post/createPost:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is my first post!"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Post"
 *       400:
 *         description: Missing content or unauthorized user
 *       500:
 *         description: Internal server error
 */
router.post("/createPost", authMiddleware, PostControllers.createPost);

/**
 * @swagger
 * /api/post/getPosts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Post"
 *       404:
 *         description: No posts found
 *       500:
 *         description: Internal server error
 */
router.get("/getPosts", PostControllers.getPosts);

/**
 * @swagger
 * /api/post/getPostById/{postId}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the post
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 post:
 *                   $ref: "#/components/schemas/Post"
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.get("/getPostById/:postId", PostControllers.getPostById);

/**
 * @swagger
 * /api/post/getPostByUserId:
 *   get:
 *     summary: Get all posts by a specific user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Post"
 *       404:
 *         description: No posts found for this user
 *       500:
 *         description: Internal server error
 */
router.get("/getPostByUserId", authMiddleware, PostControllers.getPostByUserId);

/**
 * @swagger
 * /api/post/updatePostById/{postId}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated post content"
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: "#/components/schemas/Post"
 *       403:
 *         description: Unauthorized to update this post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.put("/updatePostById/:postId", authMiddleware, PostControllers.updatePostById);

/**
 * @swagger
 * /api/post/deletePostById/{postId}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the post
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       403:
 *         description: Unauthorized to delete this post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deletePostById/:postId", authMiddleware, PostControllers.deletePostById);

export default router;
