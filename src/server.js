const app = require('./app');
const { seed } = require('./db/seed');

const PORT = process.env.PORT || 3000;

// Seed default subjects on startup (idempotent)
seed();

app.listen(PORT, () => {
  console.log(`EduQuiz API running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/docs`);
});
