// Indian financial year: April–March
// e.g. if month >= April 2025 → FY is 25-26
// Output format: NPC/25-26/001

const getCurrentFY = () => {
  const now   = new Date();
  const month = now.getMonth() + 1;
  const year  = now.getFullYear();
  if (month >= 4) {
    return `${String(year).slice(-2)}-${String(year + 1).slice(-2)}`;
  }
  return `${String(year - 1).slice(-2)}-${String(year).slice(-2)}`;
};

const generateBillNumber = (prefix, counter) => {
  return `${prefix}/${getCurrentFY()}/${String(counter).padStart(3, '0')}`;
};

module.exports = { generateBillNumber, getCurrentFY };
