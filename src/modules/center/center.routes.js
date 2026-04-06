const express = require('express')
const router = express.Router()
const centerController = require('./center.controller');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware')

/**
 * @swagger
 * tags:
 *   name: Centers
 *   description: Quản lý cụm sân và sân con
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CourtCenter:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: Cụm sân Quận 1
 *         address:
 *           type: string
 *           example: 123 Nguyễn Huệ, Q.1, TP.HCM
 *         description:
 *           type: string
 *           example: Cụm sân hiện đại, có điều hòa
 *         imageUrl:
 *           type: string
 *           example: https://example.com/image.jpg
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Court:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: Sân A1
 *         pricePerHour:
 *           type: number
 *           example: 150000
 *         courtCenterId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /centers:
 *   get:
 *     summary: Lấy danh sách tất cả cụm sân
 *     tags: [Centers]
 *     security: []
 *     responses:
 *       200:
 *         description: Danh sách cụm sân
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CourtCenter'
 */
router.get('/', centerController.getCenters)

/**
 * @swagger
 * /centers/{centerId}/courts:
 *   get:
 *     summary: Lấy danh sách sân con theo cụm sân
 *     tags: [Centers]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: centerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của cụm sân
 *     responses:
 *       200:
 *         description: Danh sách sân con
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Court'
 *       400:
 *         description: centerId không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:centerId/courts', centerController.getCourts)

/**
 * @swagger
 * /centers:
 *   post:
 *     summary: Tạo cụm sân mới (ADMIN)
 *     tags: [Centers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Cụm sân Quận 1
 *               address:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: 123 Nguyễn Huệ, Q.1, TP.HCM
 *               description:
 *                 type: string
 *                 example: Cụm sân hiện đại, có điều hòa
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Tạo cụm sân thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CourtCenter'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền ADMIN
 *       409:
 *         description: Tên cụm sân đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', protect, authorizeRoles('ADMIN'), centerController.postCenter)

/**
 * @swagger
 * /centers/{centerId}/courts:
 *   post:
 *     summary: Thêm sân con vào cụm sân (ADMIN)
 *     tags: [Centers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: centerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của cụm sân
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - pricePerHour
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Sân A1
 *               pricePerHour:
 *                 type: number
 *                 minimum: 0
 *                 example: 150000
 *     responses:
 *       201:
 *         description: Thêm sân thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Court'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền ADMIN
 *       404:
 *         description: Cụm sân không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Tên sân đã tồn tại trong cụm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:centerId/courts', protect, authorizeRoles('ADMIN'), centerController.postCourt)

module.exports = router;
