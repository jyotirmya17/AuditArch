const router = require('express').Router();

router.use('/auth',     require('./auth.routes'));
router.use('/clients',  require('./client.routes'));
router.use('/services', require('./service.routes'));
router.use('/bills',    require('./bill.routes'));

module.exports = router;
