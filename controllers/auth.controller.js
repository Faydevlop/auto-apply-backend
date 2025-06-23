const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const generateOtp = require('../utils/generateOtp');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName: name,
      email,
      password: hashed,
      isVerified: false
    });

    // Send OTP
    const otp = generateOtp();
    const expiry = new Date(Date.now() + process.env.OTP_EXPIRY_MINUTES * 60000);
    user.otp = otp;
    user.otpExpires = expiry;
    await user.save();

    await sendEmail(email, 'Your OTP Code', `Use this code to verify your email: ${otp}`);

    res.status(201).json({
      msg: 'Registered successfully. OTP sent to email.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: false
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Register failed', error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

  res
  .cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  .status(200)
  .json({
    msg: 'Login successful',
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      resume : user.resume
    },
  });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed', error: err.message });
    console.log(err)
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });
    if (user.otpExpires < new Date()) return res.status(400).json({ msg: 'OTP expired' });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res
  .cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  .status(200)
  .json({
    msg: 'OTP verified successfully',
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
  } catch (err) {
    res.status(500).json({ msg: 'OTP verification failed', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
    console.log(req.body);
    
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Reset failed', error: err.message });
    console.log(err);
    
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token').status(200).json({ msg: 'Logged out' });
};

// Change Password if user knows old password
exports.changePassword = async (req, res) => {
  const { newPassword } = req.body;
  console.log(req.body);
  
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ msg: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to change password', error: err.message });
    console.log(err);
    
  }
};


// Send OTP for forgot password

exports.sendPasswordResetOtp = async (req, res) => {
  console.log(req.body, '/////////////');
  console.log(req.user, 'Authenticated user /////////////');
  
  try {
    // Get user ID from the authenticated token
    const userId = req.user.id;
    
    // Find the user by ID (more secure than email from request body)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const otp = generateOtp();
    const expiry = new Date(Date.now() + process.env.OTP_EXPIRY_MINUTES * 60000);
    user.otp = otp;
    user.otpExpires = expiry;
    await user.save();

    // Use the user's email from the database
    await sendEmail(user.email, 'Reset Your Password', `Use this code to reset your password: ${otp}`);
    res.status(200).json({ 
      msg: 'OTP sent to email',
      email: user.email // Optionally return the email (masked for security)
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to send OTP', error: err.message });
  }
};

exports.verifyCurrentPassword = async (req, res) => {
  const { currentPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Current password incorrect' });

    res.status(200).json({ msg: 'Current password verified' });
  } catch (err) {
    res.status(500).json({ msg: 'Password check failed', error: err.message });
  }
};

exports.verifyResetOtp = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id; // Get user ID from authenticated token

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if OTP exists and matches
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // Check if OTP has expired
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ msg: 'OTP expired' });
    }

    // OTP is valid - we don't clear it yet as we need it for password reset
    res.status(200).json({ 
      msg: 'OTP verified successfully',
      email: user.email // Return email for confirmation
    });

  } catch (err) {
    res.status(500).json({ 
      msg: 'OTP verification failed', 
      error: err.message 
    });
  }
};
