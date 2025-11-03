const path = require('path');
const fs = require('fs');
const questionService = require('../services/question.service');

module.exports = {
  list: (req, res) => {
    try {
      const { subjectId } = req.query;
      const result = questionService.listQuestions({ subjectId });
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  },
  getById: (req, res) => {
    try {
      const q = questionService.getQuestionById(req.params.id);
      res.json(q);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  },
  add: (req, res) => {
    try {
      const createdBy = req.user?.id;
      const payload = { ...req.body, createdBy };
      if (req.file) {
        payload.imageUrl = `/uploads/questions/${req.file.filename}`;
      }
      // In multipart, arrays may come as single values; ensure options is array if multiple occurrences
      if (payload.options && !Array.isArray(payload.options)) {
        // try to parse as JSON array if string; otherwise wrap into single-element array
        if (typeof payload.options === 'string') {
          try {
            const parsed = JSON.parse(payload.options);
            payload.options = parsed;
          } catch (_) {
            payload.options = [payload.options];
          }
        }
      }
      const q = questionService.addQuestion(payload);
      res.status(201).json(q);
    } catch (err) {
      // Cleanup uploaded file on validation error
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  },
  remove: (req, res) => {
    try {
      // Best-effort: delete attached image if exists
      try {
        const q = questionService.getQuestionById(req.params.id);
        if (q.imageUrl) {
          const root = path.join(__dirname, '..', '..');
          const rel = q.imageUrl.replace(/^\/+/, '');
          const abs = path.join(root, rel);
          fs.unlink(abs, () => {});
        }
      } catch (_) {}
      questionService.removeQuestion(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  }
};
