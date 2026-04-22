const router = require('express').Router();
const ctrl   = require('../controllers/bill.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/history/all',         ctrl.getAllBills);
router.get('/history/:clientId',   ctrl.getBillHistory);
router.post('/generate/:clientId', ctrl.generateBill);

module.exports = router;
