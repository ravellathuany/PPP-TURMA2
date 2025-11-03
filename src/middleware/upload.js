const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsRoot = path.join(__dirname, '..', '..', 'uploads');
const questionsDir = path.join(uploadsRoot, 'questions');
fs.mkdirSync(questionsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, questionsDir);
  },
  filename: function (req, file, cb) {
    // Safe filename: timestamp + random + ext
    const ext = path.extname(file.originalname).toLowerCase();
    const base = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${base}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Tipo de arquivo inválido. Permitidos: jpg, jpeg, png, gif, webp'));
  }
  cb(null, true);
}

const uploadQuestionImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = { uploadQuestionImage, uploadsRoot };
