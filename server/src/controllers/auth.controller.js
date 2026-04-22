const AuthService = require('../services/auth.service');

const signup = async (req, res, next) => {
  try {
    const { token, user } = await AuthService.signup(req.validatedData);
    res.status(201).json({ success: true, token, user });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { token, user } = await AuthService.login(req.validatedData);
    res.json({ success: true, token, user });
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    const profile = await AuthService.getProfile(req.user._id);
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await AuthService.updateProfile(req.user._id, req.validatedData);
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

module.exports = { signup, login, getMe, updateProfile };
