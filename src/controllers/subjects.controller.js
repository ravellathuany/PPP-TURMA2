const subjectService = require('../services/subject.service');

module.exports = {
  list: (req, res) => {
    try {
      res.json(subjectService.listSubjects());
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  },
  add: (req, res) => {
    try {
      const subject = subjectService.addSubject(req.body);
      res.status(201).json(subject);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  },
  remove: (req, res) => {
    try {
      subjectService.removeSubject(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  }
};
