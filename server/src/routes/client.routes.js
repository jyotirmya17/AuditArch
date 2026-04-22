const router   = require('express').Router();
const ctrl     = require('../controllers/client.controller');
const { protect }              = require('../middlewares/auth.middleware');
const validate                 = require('../middlewares/validate.middleware');
const { createClientSchema }   = require('../validators/client.validator');

router.use(protect);  // all client routes require auth

router.get('/',       ctrl.getClients);
router.get('/deleted', ctrl.getDeletedClients);
router.post('/',      validate(createClientSchema), ctrl.createClient);
router.delete('/:id', ctrl.deleteClient);
router.patch('/:id/restore', ctrl.restoreClient);
router.delete('/:id/permanent', ctrl.permanentDeleteClient);

module.exports = router;
