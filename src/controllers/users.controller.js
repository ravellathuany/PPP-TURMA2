const userService = require('../services/user.service');

module.exports = {
  listStudents: async (req, res) => {
    try {
      const result = userService.listStudents();
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  }
};
