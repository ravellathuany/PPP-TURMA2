const express = require('express');
const controller = require('../controllers/quizzes.controller');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, controller.create);
router.post('/:id/finalize', authMiddleware, controller.finalize);
router.get('/me', authMiddleware, controller.myQuizzes);
router.get('/me/stats/subjects', authMiddleware, controller.statsPerSubject);
router.get('/me/stats/overall', authMiddleware, controller.statsOverall);
router.get('/me/answered-questions', authMiddleware, controller.answeredQuestions);

module.exports = router;
