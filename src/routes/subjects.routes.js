const express = require('express');
const controller = require('../controllers/subjects.controller');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, controller.list);
router.post('/', authMiddleware, requireRole(['teacher']), controller.add);
router.delete('/:id', authMiddleware, requireRole(['teacher']), controller.remove);

module.exports = router;
