const PDFDocument = require('pdfkit');
const { formatCurrency, formatDate, toWords } = require('./formatters');

const generatePDF = ({ ca, client, services, billNumber,
                       date, totalAmount, tdsAmount, netPayable }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const buffers = [];

    doc.on('data', chunk => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const profServices = services.filter(s => s.entryType === 'professional');
    const opeServices  = services.filter(s => s.entryType === 'ope');
    const pageWidth    = 515;

    // ── Header ──────────────────────────────────────
    doc.fontSize(14).font('Helvetica-Bold')
       .text(`[${ca.firmName}]`, { align: 'center' });
    doc.fontSize(11)
       .text(`(${ca.designation})`, { align: 'center' });
    doc.fontSize(9).font('Helvetica')
       .text(`[${ca.addressLine1}]`, { align: 'center' });
    if (ca.addressLine2) {
      doc.text(`[${ca.addressLine2}]`, { align: 'center' });
    }
    doc.moveDown(0.5);

    // ── Client Info ──────────────────────────────────
    const clientY = doc.y;
    doc.fontSize(9)
       .text(`Firm Name  [${client.name}]`, 40, clientY)
       .text(`Date [${date}]`, 0, clientY, { align: 'right' });
    doc.text(`Address    [${client.address}]`, 40)
       .text(`[${billNumber}]`, 0, doc.y - 13, { align: 'right' });
    doc.moveDown(0.8);

    // ── Table helper ─────────────────────────────────
    const drawRow = (srNo, particulars, fy, amount, isHeader, subNote) => {
      const y = doc.y;
      const rowH = subNote ? 28 : 18;

      if (isHeader) {
        doc.rect(40, y, pageWidth, rowH).fill('#f0f0f0').stroke();
        doc.fillColor('black');
      } else {
        doc.rect(40, y, pageWidth, rowH).stroke();
      }

      doc.fontSize(isHeader ? 8.5 : 8)
         .font(isHeader ? 'Helvetica-Bold' : 'Helvetica');

      doc.text(srNo,       45,  y + 5, { width: 25 });
      doc.text(particulars, 70, y + 5, { width: 280 });
      if (subNote) {
        doc.fontSize(7).text(`(${subNote})`, 70, y + 16, { width: 280 });
        doc.fontSize(8);
      }
      doc.text(fy,         360, y + 5, { width: 50 });
      doc.text(amount,     410, y + 5, { width: 140, align: 'right' });

      doc.y = y + rowH;
    };

    // Header row
    drawRow('Sr.No.', 'Particulars', 'F.Y.', 'Amount', true);

    // Professional services
    profServices.forEach((s, i) => {
      drawRow(
        `${i + 1}.`,
        s.particulars,
        s.financialYear || '',
        formatCurrency(s.amount),
        false,
        s.subNote || null
      );
    });

    // OPE section
    if (opeServices.length > 0) {
      const y = doc.y;
      doc.rect(40, y, pageWidth, 18).stroke();
      doc.fontSize(8).font('Helvetica-Bold')
         .text('Out of Pocket Expenses', 45, y + 5);
      doc.y = y + 18;

      opeServices.forEach((s, i) => {
        drawRow(`${i + 1}.`, s.particulars, '', formatCurrency(s.amount), false);
      });
    }

    // Total row
    const totalY = doc.y;
    doc.rect(40, totalY, pageWidth, 18).stroke();
    doc.fontSize(8).font('Helvetica-Bold')
       .text('Total', 360, totalY + 5)
       .text(formatCurrency(totalAmount), 410, totalY + 5,
             { width: 140, align: 'right' });
    doc.y = totalY + 18;

    // TDS row
    const tdsY = doc.y;
    doc.rect(40, tdsY, pageWidth, 18).stroke();
    doc.font('Helvetica')
       .text('Less: TDS', 45, tdsY + 5)
       .text(formatCurrency(tdsAmount), 410, tdsY + 5,
             { width: 140, align: 'right' });
    doc.y = tdsY + 18;

    // Net payable row
    const netY = doc.y;
    doc.rect(40, netY, pageWidth, 22).stroke();
    doc.fontSize(7)
       .text(`Rupees : - [ ${toWords(netPayable)} ]`, 45, netY + 5,
             { width: 200 });
    doc.fontSize(8).font('Helvetica-Bold')
       .text('NET PAYABLE', 340, netY + 7)
       .text(formatCurrency(netPayable), 410, netY + 7,
             { width: 140, align: 'right' });
    doc.y = netY + 28;

    // ── Footer ───────────────────────────────────────
    doc.moveDown(0.5);
    doc.fontSize(8).font('Helvetica-Bold')
       .text(`*Please pay Account payee cheque in favour of "${ca.firmName}" OR NEFT in under mentioned bank details*`);

    doc.moveDown(0.5);
    const payeeY = doc.y;

    doc.font('Helvetica-Bold').text('PAYEE DETAILS', 40, payeeY);
    doc.font('Helvetica')
       .text(ca.bankHolderName)
       .text(`ACCOUNT NO:-${ca.accountNumber}`)
       .text(ca.bankName)
       .text(ca.branchName)
       .text(`IFSC: ${ca.ifscCode}`);

    doc.end();
  });
};

module.exports = { generatePDF };
