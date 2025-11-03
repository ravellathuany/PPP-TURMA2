const quizService = require('../services/quiz.service');

module.exports = {
  create: (req, res) => {
    try {
      const studentId = req.user.id;
      const result = quizService.createQuiz({ studentId, subjectIds: req.body.subjectIds });
      res.status(201).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  },
  finalize: (req, res) => {
    try {
      const studentId = req.user.id;
      const { answers } = req.body;
      const result = quizService.finalizeQuiz({ quizId: req.params.id, answers, studentId });
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  },
  myQuizzes: (req, res) => {
    try {
      const studentId = req.user.id;
      const result = quizService.listMyQuizzes(studentId);
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  },
  statsPerSubject: (req, res) => {
    try {
      const studentId = req.user.id;
      const result = quizService.statsPerSubject(studentId);
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  },
  statsOverall: (req, res) => {
    try {
      const studentId = req.user.id;
      const result = quizService.statsOverall(studentId);
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  },
  answeredQuestions: (req, res) => {
    try {
      const studentId = req.user.id;
      const result = quizService.listAnsweredQuestionIds(studentId);
      res.json({ answeredQuestionIds: result });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  }
};
