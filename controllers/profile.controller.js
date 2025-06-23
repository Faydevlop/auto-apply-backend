const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const cloudinary = require('../utils/cloudinary');
const path = require('path');


exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { fullName, email, emailAppPassword, preferences } = req.body;
  await User.findByIdAndUpdate(req.user.id, {
    fullName,
    email,
    emailAppPassword,
    preferences
  });
  res.json({ msg: 'Profile updated' });
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) return res.status(400).json({ msg: 'Old password incorrect' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ msg: 'Password updated' });
};




exports.uploadResume = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ msg: 'No file uploaded' });

    // DO NOT modify path, just use as is
    await User.findByIdAndUpdate(req.user.id, {
      resume: file.path,
      resumePublicId: file.filename,
    });

    res.json({ msg: 'Resume uploaded', url: file.path });
  } catch (err) {
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
};







exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.resume || !user.resumePublicId) {
      return res.status(404).json({ msg: 'No resume found to delete' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(user.resumePublicId, {
      resource_type: 'raw'
    });

    // Remove from DB
    user.resume = undefined;
    user.resumePublicId = undefined;
    await user.save();

    res.json({ msg: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed', error: err.message });
  }
};
