const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname.split('.')[0];
    const extension = file.originalname.split('.').pop();
    return {
      folder: 'autoapply/resumes',
      public_id: `${req.user.id}_${originalName}.${extension}`,
      format: extension,
      resource_type: 'raw',
      allowed_formats: ['pdf', 'doc', 'docx'],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
