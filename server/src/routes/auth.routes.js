const router   = require('express').Router();
const ctrl     = require('../controllers/auth.controller');
const { protect }                              = require('../middlewares/auth.middleware');
const validate                                 = require('../middlewares/validate.middleware');
const { signupSchema, loginSchema, profileSchema } = require('../validators/auth.validator');

router.post('/signup',  validate(signupSchema),  ctrl.signup);
router.post('/login',   validate(loginSchema),   ctrl.login);
router.get('/me',       protect,                 ctrl.getMe);
router.put('/profile',  protect, validate(profileSchema), ctrl.updateProfile);

module.exports = router;
