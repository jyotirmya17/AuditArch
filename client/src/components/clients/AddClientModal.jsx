import { useState } from 'react';
import ReactDOM from 'react-dom';
import { createClient } from '../../api/clients.api';

export default function AddClientModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await createClient({ name, address });
      setName('');
      setAddress('');
      onSuccess(data.data);
      onClose();
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.message || 'Protocol failure. Check inputs.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className={`modal-portal-wrapper ${isOpen ? 'active' : ''}`}>
      <div className="modal-portal-backdrop" onClick={onClose}></div>
      <div className="modal-portal-card protocol-modal">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2 className="protocol-title">Establish Client Protocol</h2>
        <p className="protocol-subtitle">Register a new entity into the architectural ledger.</p>

        {error && <div className="error-alert-inline" style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
          <div className="input-group">
            <label className="protocol-label">ENTITY NAME</label>
            <input 
              className="protocol-input" 
              required 
              placeholder="e.g. Acme Corporation Pvt. Ltd." 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>
          
          <div className="input-group">
            <label className="protocol-label">REGISTERED ADDRESS</label>
            <input 
              className="protocol-input" 
              required 
              placeholder="Full address for compliance" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
            />
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 48 }}>
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
              {loading ? 'Synchronizing...' : 'Authorize Client →'}
            </button>
          </div>
        </form>

        <div className="precision-footer" style={{ marginTop: 32 }}>
          <span className="precision-dot">●</span> Precision Guaranteed by AuditArch v1.3
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
