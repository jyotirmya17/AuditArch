// TDS @ 10% applies ONLY to professional fees.
// Out of Pocket Expenses (entryType: 'ope') are excluded from TDS.

const TDS_RATE = 0.10;

const calculateTDS = (services) => {
  const profTotal = services
    .filter(s => s.entryType === 'professional')
    .reduce((sum, s) => sum + s.amount, 0);

  const opeTotal = services
    .filter(s => s.entryType === 'ope')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalAmount = profTotal + opeTotal;
  const tdsAmount   = Math.round(profTotal * TDS_RATE * 100) / 100;
  const netPayable  = totalAmount - tdsAmount;

  return { profTotal, opeTotal, totalAmount, tdsAmount, netPayable };
};

module.exports = { calculateTDS, TDS_RATE };
