const express = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./users.routes');
const subjectRoutes = require('./subjects.routes');
const questionRoutes = require('./questions.routes');
const quizRoutes = require('./quizzes.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/subjects', subjectRoutes);
router.use('/questions', questionRoutes);
router.use('/quizzes', quizRoutes);

module.exports = router;
