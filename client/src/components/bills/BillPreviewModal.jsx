import { useState, useEffect } from 'react';
import { formatCurrency, toWords } from '../../utils/formatters';
import { saveBill, getBillHistory } from '../../api/bills.api';

export default function BillPreviewModal({ client, services, ca, onClose, onConfirm, generating }) {
  // ca shape from /auth/me: { email, profile: { firmName, addressLine1, city, bankName, ... } }
  // client shape: { name, address }
  const p = ca?.profile || ca || {};

  const buildDraft = () => ({
    billNumber: `AUD/${new Date().getFullYear()}/001`,
    billDate: new Date().toISOString().split('T')[0],
    companyName: p.firmName || '',
    companyAddress: [p.addressLine1, p.addressLine2, p.city].filter(Boolean).join(', ') || '',
    clientName: client?.name || '',
    clientAddress: client?.address || '',
    services: services || [],
    tdsRate: 10,
    bankName: p.bankName || '',
    accountNumber: p.accountNumber || '',
    branchName: p.branchName || '',
    ifscCode: p.ifscCode || ''
  });

  const [draftBill, setDraftBill] = useState(buildDraft);

  // Re-sync if props arrive after initial mount (async fetch)
  useEffect(() => {
    setDraftBill(prev => ({
      ...buildDraft(),
      // Preserve any user edits for bill number and date
      billNumber: prev.billNumber,
      billDate: prev.billDate
    }));
  }, [ca, client, services]);

  const updateDraft = (field, value) => setDraftBill({ ...draftBill, [field]: value });
  
  const updateService = (id, field, value) => {
    updateDraft('services', draftBill.services.map(s => s._id === id ? { ...s, [field]: value } : s));
  };

  const professionalFeeServices = draftBill.services.filter(s => s.type !== 'Out of Pocket Expense');
  const outOfPocketServices = draftBill.services.filter(s => s.type === 'Out of Pocket Expense');

  const totalAmount = draftBill.services.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
  const tdsAmount = professionalFeeServices.reduce((acc, s) => acc + ((Number(s.amount) || 0) * (draftBill.tdsRate / 100)), 0);
  const netPayable = totalAmount - tdsAmount;

  const [isProcessing, setIsProcessing] = useState(false);

  const executePrint = (billNumber) => {
    const billPreview = document.getElementById('bill-preview');
    if (!billPreview) {
      alert('Bill preview not found');
      return;
    }
    
    // Sync React input values to DOM attributes so innerHTML captures them
    const inputs = billPreview.querySelectorAll('input');
    inputs.forEach(input => {
      input.setAttribute('value', input.value);
    });
    
    // Create hidden iframe for isolated printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow.document;
    
    // Write isolated HTML & CSS
    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <title>Bill-${billNumber || 'download'}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body {
              font-family: 'Times New Roman', serif;
              padding: 0; margin: 0; background: white; color: black;
            }
            .preview-container { padding: 20px; max-width: 800px; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
            td, th { border: 1px solid #000; padding: 5px 8px; }
            img { max-width: 80px; }
            /* Force inputs to look like plain text */
            input {
              border: none !important;
              background: transparent !important;
              outline: none !important;
              font-family: inherit !important;
              font-size: inherit !important;
              width: 100% !important;
              color: #000 !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          </style>
        </head>
        <body>
          <div class="preview-container">
            ${billPreview.innerHTML}
          </div>
        </body>
      </html>
    `);
    iframeDoc.close();
    
    // Trigger print
    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      // Cleanup iframe after print dialog closes
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 250);
  };

  const handleConfirmAndPrint = async () => {
    setIsProcessing(true);
    try {
      const historyRes = await getBillHistory(client._id);
      const history = historyRes.data.data || [];
      const currentTotal = totalAmount;

      const existingBill = history.find(b => b.totalAmount === currentTotal);

      if (existingBill) {
        setDraftBill(prev => ({
          ...prev,
          billNumber: existingBill.billNumber,
          billDate: new Date(existingBill.generatedAt).toISOString().split('T')[0]
        }));
        setTimeout(() => {
          executePrint(existingBill.billNumber);
        }, 100);
      } else {
        const res = await saveBill(client._id, draftBill);
        const newBill = res.data.data;
        setDraftBill(prev => ({
          ...prev,
          billNumber: newBill.billNumber
        }));
        setTimeout(() => {
          executePrint(newBill.billNumber);
        }, 100);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save or print the bill.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReprintLast = async () => {
    setIsProcessing(true);
    try {
      const historyRes = await getBillHistory(client._id);
      const history = historyRes.data.data || [];
      if (history.length === 0) {
        alert('No bills to reprint for this client.');
        return;
      }
      
      const lastBill = history[0];
      setDraftBill(prev => ({ 
        ...prev, 
        billNumber: lastBill.billNumber, 
        billDate: new Date(lastBill.generatedAt).toISOString().split('T')[0],
        services: lastBill.servicesSnapshot || prev.services,
        tdsRate: (lastBill.tdsAmount / lastBill.totalAmount) * 100 || 10
      }));
      
      setTimeout(() => {
        executePrint(lastBill.billNumber);
      }, 100);
    } catch (e) {
      console.error(e);
      alert('Failed to reprint the bill.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 40 }}>
      {/* LEFT EDITOR PANEL */}
      <div className="no-print" style={{ width: 340, background: '#f8faff', borderRadius: '24px 0 0 24px', height: '95vh', padding: 32, borderRight: '1px solid #e2e8f0', boxShadow: '0 0 40px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
         <h3 style={{ fontSize: 18, marginBottom: 24 }}>Document Defaults</h3>
         
         <div className="input-group" style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 800 }}>BILL NO.</label>
            <input className="input-pill" style={{ background: '#fff' }} value={draftBill.billNumber} onChange={e => updateDraft('billNumber', e.target.value)} />
         </div>

         <div className="input-group" style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontWeight: 800 }}>ISSUE DATE</label>
            <input type="date" className="input-pill" style={{ background: '#fff' }} value={draftBill.billDate} onChange={e => updateDraft('billDate', e.target.value)} />
         </div>

         <div style={{ padding: '16px', background: 'rgba(76,64,230,0.05)', borderRadius: 12, marginBottom: 24 }}>
            <h4 style={{ fontSize: 12, marginBottom: 12, color: 'var(--primary)', textTransform: 'uppercase' }}>Company Details</h4>
            <div className="input-group" style={{ marginBottom: 8 }}>
                <input className="input-pill" placeholder="Company Name" value={draftBill.companyName} onChange={e => updateDraft('companyName', e.target.value)} />
            </div>
            <div className="input-group">
                <input className="input-pill" placeholder="Company Address" value={draftBill.companyAddress} onChange={e => updateDraft('companyAddress', e.target.value)} />
            </div>
         </div>

         <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: 12, marginBottom: 24 }}>
            <h4 style={{ fontSize: 12, marginBottom: 12, color: '#166534', textTransform: 'uppercase' }}>Client Details</h4>
            <div className="input-group" style={{ marginBottom: 8 }}>
                <input className="input-pill" placeholder="Client Name" value={draftBill.clientName} onChange={e => updateDraft('clientName', e.target.value)} />
            </div>
            <div className="input-group">
                <input className="input-pill" placeholder="Client Address" value={draftBill.clientAddress} onChange={e => updateDraft('clientAddress', e.target.value)} />
            </div>
         </div>

         <div style={{ padding: '16px', background: '#fffbeb', borderRadius: 12, marginBottom: 24 }}>
            <h4 style={{ fontSize: 12, marginBottom: 12, color: '#b45309', textTransform: 'uppercase' }}>Tax Settings</h4>
            <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 700 }}>TDS %</label>
                <input type="number" className="input-pill" style={{ flex: 1 }} value={draftBill.tdsRate} onChange={e => updateDraft('tdsRate', Number(e.target.value))} />
            </div>
         </div>

         <div className="no-print" style={{ padding: '16px', background: '#fef2f2', borderRadius: 12, marginBottom: 40 }}>
            <h4 style={{ fontSize: 12, marginBottom: 12, color: '#b91c1c', textTransform: 'uppercase' }}>Bank Integrations</h4>
            <input className="input-pill" style={{ marginBottom: 8 }} placeholder="Bank Name" value={draftBill.bankName} onChange={e => updateDraft('bankName', e.target.value)} />
            <input className="input-pill" style={{ marginBottom: 8 }} placeholder="Account No" value={draftBill.accountNumber} onChange={e => updateDraft('accountNumber', e.target.value)} />
            <input className="input-pill" style={{ marginBottom: 8 }} placeholder="Branch Name" value={draftBill.branchName} onChange={e => updateDraft('branchName', e.target.value)} />
            <input className="input-pill" placeholder="IFSC Code" value={draftBill.ifscCode} onChange={e => updateDraft('ifscCode', e.target.value)} />
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="btn-primary no-print" onClick={handleConfirmAndPrint} disabled={isProcessing || generating} style={{ width: '100%', padding: 16 }}>
               {isProcessing || generating ? '🖋️ Generating...' : '📄 Confirm & Generate PDF'}
            </button>
            <button className="btn-outline no-print" onClick={handleReprintLast} disabled={isProcessing || generating} style={{ width: '100%' }}>
               🔄 Reprint Last Bill
            </button>
            <button className="btn-outline no-print" onClick={onClose} style={{ width: '100%' }} disabled={generating}>Cancel</button>
         </div>
      </div>

      {/* RIGHT PREVIEW PANEL */}
      <div id="bill-preview" style={{ flex: 1, maxWidth: '900px', background: '#fff', height: '95vh', overflowY: 'auto', padding: '60px 80px', borderRadius: '0 24px 24px 0', fontFamily: '"Times New Roman", serif', color: '#000', position: 'relative', boxShadow: '0 0 40px rgba(0,0,0,0.1)' }}>
         {/* CA logo top-left */}
         <div style={{ marginBottom: 16 }}>
            <img src="/ca-logo.jpg" alt="CA Logo" style={{ width: 80, height: 80, objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
         </div>
         
         <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>[ {draftBill.companyName.toUpperCase()} ]</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>
               [ {draftBill.companyAddress} ]
            </div>
         </div>

         <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32, textAlign: 'right' }}>
            <div style={{ marginRight: 40 }}>Date<br/>Bill No</div>
            <div style={{ fontWeight: 'bold', minWidth: 120 }}>
               [ {new Date(draftBill.billDate).toLocaleDateString('en-IN')} ]<br/>
               [ {draftBill.billNumber} ]
            </div>
         </div>

         {/* ALL LEFT ALIGNED */}
         <div style={{ marginBottom: 12, display: 'flex' }}>
            <div style={{ minWidth: 100 }}>Firm Name</div>
            <div style={{ fontWeight: 'bold' }}>[ {draftBill.clientName} ]</div>
         </div>
         <div style={{ marginBottom: 32, display: 'flex' }}>
            <div style={{ minWidth: 100 }}>Address</div>
            <div style={{ fontWeight: 'bold' }}>[ {draftBill.clientAddress} ]</div>
         </div>

         <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
            <thead>
               <tr>
                  <th style={{ border: '1px solid #000', padding: 8, width: '8%' }}>Sr. No.</th>
                  <th style={{ border: '1px solid #000', padding: 8, width: '62%', textAlign: 'left' }}>Particulars</th>
                  <th style={{ border: '1px solid #000', padding: 8, width: '10%' }}>F.Y.</th>
                  <th style={{ border: '1px solid #000', padding: 8, width: '20%', textAlign: 'right' }}>Amount</th>
               </tr>
            </thead>
            <tbody>
               {professionalFeeServices.map((s, i) => (
                  <tr key={s._id}>
                     <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{i + 1}.</td>
                     <td style={{ border: '1px solid #000', padding: 8 }}>
                        <input value={s.particulars} onChange={e => updateService(s._id, 'particulars', e.target.value)} style={{ width: '100%', border: '1px dashed #cbd5e1', background: 'transparent', outline: 'none', padding: '4px', fontFamily: 'inherit', fontSize: 'inherit' }} />
                     </td>
                     <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>
                        <input value={s.financialYear || '24-25'} onChange={e => updateService(s._id, 'financialYear', e.target.value)} style={{ width: '100%', border: '1px dashed #cbd5e1', background: 'transparent', outline: 'none', textAlign: 'center', padding: '4px', fontFamily: 'inherit', fontSize: 'inherit' }} />
                     </td>
                     <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right' }}>
                        <input type="number" value={s.amount} onChange={e => updateService(s._id, 'amount', e.target.value)} style={{ width: '100%', border: '1px dashed #cbd5e1', background: 'transparent', outline: 'none', textAlign: 'right', padding: '4px', fontFamily: 'inherit', fontSize: 'inherit' }} />
                     </td>
                  </tr>
               ))}

               {outOfPocketServices.length > 0 && (
                  <>
                     <tr>
                        <td colSpan="4" style={{ padding: '20px 8px 8px', borderLeft: '1px solid #000', borderRight: '1px solid #000' }}>
                           <u><b>Out of Pocket Expenses</b></u>
                        </td>
                     </tr>
                     {outOfPocketServices.map((s, i) => (
                        <tr key={s._id}>
                           <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{i + 1}.</td>
                           <td style={{ border: '1px solid #000', padding: 8 }}>
                              <input value={s.particulars} onChange={e => updateService(s._id, 'particulars', e.target.value)} style={{ width: '100%', border: '1px dashed #cbd5e1', background: 'transparent', outline: 'none', padding: '4px', fontFamily: 'inherit', fontSize: 'inherit' }} />
                           </td>
                           <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>
                              <input value={s.financialYear || '24-25'} onChange={e => updateService(s._id, 'financialYear', e.target.value)} style={{ width: '100%', border: '1px dashed #cbd5e1', background: 'transparent', outline: 'none', textAlign: 'center', padding: '4px', fontFamily: 'inherit', fontSize: 'inherit' }} />
                           </td>
                           <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right' }}>
                              <input type="number" value={s.amount} onChange={e => updateService(s._id, 'amount', e.target.value)} style={{ width: '100%', border: '1px dashed #cbd5e1', background: 'transparent', outline: 'none', textAlign: 'right', padding: '4px', fontFamily: 'inherit', fontSize: 'inherit' }} />
                           </td>
                        </tr>
                     ))}
                  </>
               )}

               <tr style={{ fontWeight: 'bold' }}>
                  <td colSpan="3" style={{ border: '1px solid #000', padding: 8, textAlign: 'right', borderTop: '2px solid #000' }}>Total</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', borderTop: '2px solid #000' }}>{totalAmount.toFixed(2)}</td>
               </tr>
               <tr>
                  <td colSpan="3" style={{ border: '1px solid #000', padding: 8 }}>Less: TDS ({draftBill.tdsRate}% on Fees)</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right' }}>{tdsAmount.toFixed(2)}</td>
               </tr>
               <tr style={{ fontWeight: 'bold' }}>
                  <td colSpan="2" style={{ border: 'none' }}></td>
                  <td style={{ border: '1px solid #000', padding: 8, background: '#fff' }}>NET PAYABLE</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right' }}>{netPayable.toFixed(2)}</td>
               </tr>
            </tbody>
         </table>

         <div style={{ border: '1px solid #000', padding: 12, borderTop: 'none', fontWeight: 'bold' }}>
            Rupees : - [ {toWords(netPayable || 0).toUpperCase()} ONLY ]
         </div>

         {/* BOTTOM SECTION LEFT ALIGNED WITHOUT SIGNATURES */}
         <div style={{ marginTop: 40, fontWeight: 'bold', fontSize: 13, textAlign: 'left' }}>
            *Please pay Account payee cheque in favour of "{draftBill.companyName}" OR "NEFT in under mentioned bank details*
         </div>

         <div style={{ marginTop: 24, fontSize: 13, textTransform: 'uppercase', lineHeight: 1.6, textAlign: 'left' }}>
            <div style={{ textDecoration: 'underline', fontWeight: 'bold', marginBottom: 8 }}>PAYEE DETAILS</div>
            <div>{draftBill.companyName}</div>
            <div>ACCOUNT NO: {draftBill.accountNumber}</div>
            <div>{draftBill.bankName}</div>
            <div>{draftBill.branchName}</div>
            <div>IFSC: {draftBill.ifscCode}</div>
         </div>
      </div>
    </div>
  );
}
