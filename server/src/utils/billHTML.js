const path = require('path');
const fs   = require('fs');
const { formatCurrency, toWords } = require('./formatters');

const generateBillHTML = ({ ca, client, services, billNumber, 
                             date, totalAmount, tdsAmount, netPayable,
                             appliedTdsRate, overrides = {} }) => {

  // Resolve overrides — UI edits take priority over DB values
  const firmName      = overrides.companyName    || ca.firmName;
  const firmAddress   = overrides.companyAddress  || `${ca.addressLine1}, ${ca.city || ''}`;
  const clientName    = overrides.clientName      || client.name;
  const clientAddr    = overrides.clientAddress    || `${client.addressLine1}, ${client.city}`;
  const bankName      = overrides.bankName        || ca.bankName;
  const accountNumber = overrides.accountNumber   || ca.accountNumber;
  const branchName    = overrides.branchName      || ca.branchName || '';
  const ifscCode      = overrides.ifscCode        || ca.ifscCode;
  const tdsRate       = appliedTdsRate !== undefined ? appliedTdsRate : 10;



  // CA Logo embedding — read file from client/public/ca-logo.jpg and base64 encode it
  let caLogoHTML = '';
  try {
    const caLogoPath = path.resolve(__dirname, '..', '..', '..', 'client', 'public', 'ca-logo.jpg');
    if (fs.existsSync(caLogoPath)) {
      const caLogoBase64 = fs.readFileSync(caLogoPath).toString('base64');
      caLogoHTML = `<img src="data:image/jpeg;base64,${caLogoBase64}" style="width: 80px; height: 80px; object-fit: contain; flex-shrink: 0;" />`;
    }
  } catch (e) {
    // CA Logo not found — skip silently
  }

  // Split services
  const professionalFeeServices = services.filter(s => s.type !== 'Out of Pocket Expense');
  const outOfPocketServices = services.filter(s => s.type === 'Out of Pocket Expense');

  const profRows = professionalFeeServices.map((s, i) => `
    <tr>
      <td style="text-align: center;">${i + 1}.</td>
      <td>${s.particulars}${s.subNote ? `<br/><small>&nbsp;&nbsp;&nbsp;( ${s.subNote} )</small>` : ''}</td>
      <td style="text-align: center;">${s.financialYear || '2024-25'}</td>
      <td style="text-align: right;">${s.amount.toFixed(2)}</td>
    </tr>
  `).join('');

  const opeRows = outOfPocketServices.map((s, i) => `
    <tr>
      <td style="text-align: center;">${i + 1}.</td>
      <td>${s.particulars}${s.subNote ? `<br/><small>&nbsp;&nbsp;&nbsp;( ${s.subNote} )</small>` : ''}</td>
      <td style="text-align: center;">${s.financialYear || '2024-25'}</td>
      <td style="text-align: right;">${s.amount.toFixed(2)}</td>
    </tr>
  `).join('');

  const opeSection = outOfPocketServices.length > 0 ? `
    <tr>
       <td colspan="4" style="padding: 10px 8px; border-bottom: none;">
          <u><b>Out of Pocket Expenses</b></u>
       </td>
    </tr>
    ${opeRows}
  ` : '';

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8"/>
    <style>
      @page { size: A4; margin: 0; }
      body {
        font-family: "Times New Roman", Times, serif;
        font-size: 14px; color: #000;
        margin: 0; padding: 50px 60px; background: #fff;
      }
      .logo-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
      .header { text-align: center; margin-bottom: 40px; position: relative; }
      .firm-name { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
      .addr { font-size: 14px; line-height: 1.4; margin-top: 8px; }
      
      .meta-row {
        display: flex; justify-content: flex-end; margin-bottom: 24px;
        text-align: right;
      }
      .meta-labels { font-weight: normal; margin-right: 48px; }

      .client-row { display: flex; align-items: flex-start; margin-bottom: 8px; }
      .client-label { min-width: 100px; font-weight: normal; }
      .client-value { font-weight: bold; }

      table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
      th, td { border: 1px solid #000; padding: 6px 10px; vertical-align: top; }
      th { font-weight: bold; text-align: center; background: #fff; }
      
      .total-section td { border-top: 2px solid #000; }
      .net-payable-row td { border-bottom: 2px solid #000; }
      .rupees-box { border: 1px solid #000; padding: 8px 12px; margin-top: -1px; border-top: none; }
      
      .footer-note { margin-top: 32px; font-size: 14px; font-weight: bold; text-align: left; }
      .payee-details { margin-top: 24px; font-size: 14px; line-height: 1.5; text-transform: uppercase; text-align: left; }
      .payee-label { text-decoration: underline; font-weight: bold; margin-bottom: 8px; }
    </style>
  </head>
  <body>
    <div class="logo-row">
      ${caLogoHTML}
    </div>

    <div class="header">
      <div class="firm-name">[ ${firmName.toUpperCase()} ]</div>
      <div class="addr">
        [ ${firmAddress} ]
      </div>
    </div>

    <div class="meta-row">
       <div class="meta-labels">
          Date<br/>
          Bill No
       </div>
       <div style="font-weight: bold; min-width: 120px;">
          [ ${date} ]<br/>
          [ ${billNumber} ]
       </div>
    </div>

    <div class="client-row">
       <div class="client-label">Firm Name</div>
       <div class="client-value">[ ${clientName} ]</div>
    </div>
    <div class="client-row">
       <div class="client-label">Address</div>
       <div class="client-value">[ ${clientAddr} ]</div>
    </div>

    <div style="margin-bottom: 24px;"></div>

    <table>
      <thead>
        <tr>
          <th style="width: 8%;">Sr. No.</th>
          <th style="width: 62%;">Particulars</th>
          <th style="width: 10%;">F.Y.</th>
          <th style="width: 20%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${profRows}
        ${opeSection}
        <tr class="total-section">
          <td colspan="3" style="text-align: right; font-weight: bold;">Total</td>
          <td style="text-align: right; font-weight: bold;">${totalAmount.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: left;">Less: TDS (${tdsRate}% on Fees)</td>
          <td style="text-align: right;">${tdsAmount.toFixed(2)}</td>
        </tr>
        <tr class="net-payable-row">
           <td colspan="2" style="border-bottom: 1px solid #000;"></td>
           <td style="text-align: left; font-weight: bold; background: #fff;">NET PAYABLE</td>
           <td style="text-align: right; font-weight: bold;">${netPayable.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="rupees-box">
       Rupees : - [ ${toWords(netPayable).toUpperCase()} ONLY ]
    </div>

    <div class="footer-note">
      *Please pay Account payee cheque in favour of "${firmName}" OR "NEFT in under mentioned bank details*
    </div>

    <div class="payee-details">
      <div class="payee-label">PAYEE DETAILS</div>
      <div>${firmName}</div>
      <div>ACCOUNT NO: ${accountNumber}</div>
      <div>${bankName}</div>
      <div>${branchName}</div>
      <div>IFSC: ${ifscCode}</div>
    </div>
  </body>
  </html>`;
};

module.exports = { generateBillHTML };
