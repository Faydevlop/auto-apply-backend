const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname.split('.')[0];
  
    return {
      folder: 'autoapply/resumes',
      public_id: `${req.user.id}_${originalName}`, // no extension here
      resource_type: 'raw', // <- FIXED: force Cloudinary to treat this as a raw file like PDF
      allowed_formats: ['pdf', 'doc', 'docx'],
    };
  },
});


const upload = multer({ storage });

module.exports = upload;
