const cloudinary = require('../utils/cloudinary');
const User = require('../models/user.model');

exports.uploadResume = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'resumes',
        public_id: `resume_${req.user.id}`,
        overwrite: true
      },
      async (error, result) => {
        if (error) return res.status(500).json({ msg: 'Upload failed', error });

        const user = await User.findByIdAndUpdate(
          req.user.id,
          { resume: result.secure_url },
          { new: true }
        );

        res.status(200).json({ msg: 'Resume uploaded', resumeUrl: user.resume });
      }
    );

    req.file.stream.pipe(result);
  } catch (err) {
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
};

exports.getResume = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ resumeUrl: user.resume });
};
