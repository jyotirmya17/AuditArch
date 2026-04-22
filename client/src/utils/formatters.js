export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

export const toWords = (amount) => {
  if (amount === 0) return 'Zero';
  
  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const formatThreeDigits = (num) => {
    let str = '';
    if (num >= 100) {
      str += single[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    if (num >= 10 && num < 20) {
      str += double[num - 10];
    } else {
      str += tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + single[num % 10] : '');
    }
    return str.trim();
  };

  let num = Math.floor(amount);
  let res = '';
  
  if (num >= 10000000) {
    res += formatThreeDigits(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  if (num >= 100000) {
    res += formatThreeDigits(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  if (num >= 1000) {
    res += formatThreeDigits(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  res += formatThreeDigits(num);
  
  return res.trim();
};
