import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { addService } from '../../api/services.api';

export default function AddServiceModal({ isOpen, onClose, onSuccess, clientId }) {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const nextYear = (new Date().getFullYear() + 1).toString().slice(-2);
  const defaultFY = `${currentYear}-${nextYear}`;
  
  const [particulars, setParticulars] = useState('');
  const [financialYear, setFinancialYear] = useState(defaultFY);
  const [amount, setAmount] = useState('');
  const [entryType, setEntryType] = useState('professional');
  const [subNote, setSubNote] = useState('');
  const [dateAdded, setDateAdded] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        particulars,
        financialYear,
        amount: Number(amount),
        entryType,
        dateAdded
      };
      
      if (entryType === 'professional') {
        payload.subNote = subNote;
      }

      console.log('Sending AddService payload:', payload);

      const { data } = await addService(clientId, payload);
      
      onSuccess(data.data);
      setParticulars('');
      setAmount('');
      setSubNote('');
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors?.length > 0) {
        toast.error(err.response.data.errors.map(e => `${e.field}: ${e.message}`).join(' | '));
      } else {
        toast.error(err.response?.data?.message || 'Ledger entry failed. Verify data protocol.');
      }
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className={`modal-portal-wrapper ${isAnimating ? 'active' : ''}`}>
      {/* 1. BACKDROP */}
      <div 
        className="modal-portal-backdrop" 
        onClick={onClose}
      />
      
      {/* 3. MODAL CARD (Portal) */}
      <div className="protocol-modal modal-portal-card">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2 className="protocol-title">Log Professional Service</h2>
        <p className="protocol-subtitle">Append a specialized transaction to the client's official ledger.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div className="input-group">
            <label className="protocol-label">SERVICE PARTICULARS</label>
            <input 
              className="protocol-input" 
              required 
              placeholder="e.g. Statutory Audit Implementation" 
              value={particulars} 
              onChange={e => setParticulars(e.target.value)} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label className="protocol-label">FINANCIAL YEAR</label>
              <input 
                className="protocol-input" 
                required 
                placeholder="24-25" 
                value={financialYear} 
                onChange={e => setFinancialYear(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label className="protocol-label">TRANSACTION DATE</label>
              <input 
                type="date"
                className="protocol-input" 
                required 
                value={dateAdded} 
                onChange={e => setDateAdded(e.target.value)} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label className="protocol-label">FEE AMOUNT (INR)</label>
              <input 
                type="number"
                className="protocol-input" 
                required 
                placeholder="0.00"
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label className="protocol-label">ENTRY PROTOCOL</label>
              <select 
                className="protocol-input" 
                value={entryType} 
                onChange={e => setEntryType(e.target.value)}
              >
                <option value="professional">Professional Fee (10% TDS)</option>
                <option value="ope">Out of Pocket Expense (No TDS)</option>
              </select>
            </div>
          </div>

          {entryType === 'professional' && (
            <div className="input-group">
              <label className="protocol-label">ARCHITECTURAL SUB-NOTE (OPTIONAL)</label>
              <textarea 
                className="protocol-input" 
                rows="3"
                placeholder="Internal compliance notes or specific scope details..." 
                value={subNote} 
                onChange={e => setSubNote(e.target.value)} 
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
            <button 
              type="button" 
              className="btn-outline" 
              style={{ flex: 1, padding: 16 }} 
              onClick={onClose}
              disabled={loading}
            >
              Discard Entry
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ flex: 2, padding: 16 }}
              disabled={loading}
            >
              {loading ? 'Committing...' : 'Commit to Ledger →'}
            </button>
          </div>
        </form>

        <div className="precision-footer">
          <span className="precision-dot">●</span> Precision Guaranteed by AuditArch v1.3
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
