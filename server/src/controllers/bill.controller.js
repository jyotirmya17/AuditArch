const BillService = require('../services/bill.service');

const generateBill = async (req, res, next) => {
  try {
    const { pdfBuffer, billNumber } = await BillService.generateBill(
      req.user._id, req.params.clientId, req.body
    );
    const filename = billNumber.replace(/\//g, '-') + '.pdf';
    res.set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length':       pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('BILL GENERATION ERROR:', err.message);
    console.error('STACK:', err.stack);
    next(err);
  }
};

const getBillHistory = async (req, res, next) => {
  try {
    const bills = await BillService.getBillHistory(req.user._id, req.params.clientId);
    res.json({ success: true, data: bills });
  } catch (err) { next(err); }
};

const getAllBills = async (req, res, next) => {
  try {
    const bills = await BillService.getAllBills(req.user._id);
    res.json({ success: true, data: bills });
  } catch (err) { next(err); }
};

const saveBill = async (req, res, next) => {
  try {
    const bill = await BillService.saveBillRecord(
      req.user._id, req.params.clientId, req.body
    );
    res.json({ success: true, data: bill });
  } catch (err) { next(err); }
};

module.exports = { generateBill, getBillHistory, getAllBills, saveBill };
