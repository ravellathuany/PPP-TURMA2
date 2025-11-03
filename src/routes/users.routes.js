const express = require('express');
const controller = require('../controllers/users.controller');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/students', authMiddleware, requireRole(['teacher']), controller.listStudents);

module.exports = router;
