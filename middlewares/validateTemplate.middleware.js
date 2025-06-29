const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const valid = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (valid.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF/DOC/DOCX allowed'));
  }
});

module.exports = upload;
