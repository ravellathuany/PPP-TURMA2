const express = require('express');
const controller = require('../controllers/questions.controller');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { uploadQuestionImage } = require('../middleware/upload');

const router = express.Router();

router.get('/', authMiddleware, controller.list);
router.get('/:id', authMiddleware, controller.getById);
// Allow optional image only on creation via multipart/form-data
router.post('/', authMiddleware, requireRole(['teacher']), uploadQuestionImage.single('image'), controller.add);
router.delete('/:id', authMiddleware, requireRole(['teacher']), controller.remove);

module.exports = router;
