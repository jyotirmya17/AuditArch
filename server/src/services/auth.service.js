const jwt       = require('jsonwebtoken');
const config    = require('../config/config');
const User      = require('../models/User.model');
const CAProfile = require('../models/CAProfile.model');

const signup = async ({ email, password, profile }) => {
  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  // Create User
  const user = await User.create({ email, password });

  try {
    // If profile data exists, create CAProfile
    if (profile) {
      await CAProfile.create({
        firmName:       profile.firmName,
        designation:    profile.designation || 'Chartered Accountants',
        addressLine1:   profile.addressLine1,
        bankHolderName: profile.bankAccountHolderName || profile.bankHolderName || profile.firmName,
        accountNumber:  profile.accountNumber,
        bankName:       profile.bankName,
        branchName:     profile.branchName || 'Main Branch',
        ifscCode:       profile.ifscCode,
        billPrefix:     profile.billPrefix || 'CA',
        userId: user._id,
      });
    }

    const token = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    return { token, user: { id: user._id, email: user.email } };
  } catch (err) {
    // Cleanup user if profile creation fails (Manual rollback for standalone DBs)
    await User.findByIdAndDelete(user._id);
    throw err;
  }
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  const err  = new Error('Invalid email or password');
  err.statusCode = 401;
  if (!user) throw err;
  const valid = await user.comparePassword(password);
  if (!valid) throw err;
  const token = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  return { token, user: { id: user._id, email: user.email } };
};

const getProfile = async (userId) => {
  const profile = await CAProfile.findOne({ userId });
  const user = await User.findById(userId);
  return { email: user.email, profile };
};

const updateProfile = async (userId, data) => {
  const profile = await CAProfile.findOneAndUpdate(
    { userId },
    { ...data, userId },
    { new: true, upsert: true, runValidators: true }
  );
  return profile;
};

module.exports = { signup, login, getProfile, updateProfile };
