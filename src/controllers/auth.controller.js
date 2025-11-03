const userService = require('../services/user.service');

module.exports = {
  register: async (req, res) => {
    try {
      const result = await userService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  },
  login: async (req, res) => {
    try {
      const result = await userService.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  }
};
