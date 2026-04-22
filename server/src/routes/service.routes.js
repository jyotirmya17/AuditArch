const router   = require('express').Router();
const ctrl     = require('../controllers/service.controller');
const { protect }            = require('../middlewares/auth.middleware');
const validate               = require('../middlewares/validate.middleware');
const { addServiceSchema }   = require('../validators/service.validator');

router.use(protect);

router.get('/:clientId',      ctrl.getServices);
router.post('/:clientId',     validate(addServiceSchema), ctrl.addService);
router.delete('/:serviceId',  ctrl.deleteService);

module.exports = router;
