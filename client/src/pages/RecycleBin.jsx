import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getDeletedClients, restoreClient, permanentDeleteClient } from '../api/clients.api';
import toast from 'react-hot-toast';

export default function RecycleBin() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [acting, setActing] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeletedClients();
  }, []);

  const fetchDeletedClients = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getDeletedClients();
      setClients(data.data);
    } catch (e) {
      console.error(e);
      setError('Protocol Failure: Could not synchronize with the recycle bin.');
    } finally {
      setLoading(false);
    }
  };

  const icons = ['🏢', '🏭', '🏗️', '🏛️', '🏠', '🏬'];

  const handleRestore = async (id, e) => {
    e.stopPropagation();
    try {
      setActing(true);
      await restoreClient(id);
      setClients(clients.filter(c => c._id !== id));
      toast.success('Client successfully restored to Active Dashboard.');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Restoration Failed: Could not recover client.');
    } finally {
      setActing(false);
    }
  };

  const confirmDelete = (clientId, e) => {
    e.stopPropagation();
    setClientToDelete(clientId);
    setIsDeleteDialogOpen(true);
  };

  const executePermanentDelete = async () => {
    try {
      setActing(true);
      await permanentDeleteClient(clientToDelete);
      setClients(clients.filter(c => c._id !== clientToDelete));
      toast.success('Client and associated records PERMANENTLY deleted.');
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
    } catch (e) {
      console.error(e);
      toast.error('Deletion Failure: Unable to clear entity.');
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ height: 'calc(100vh - 100px)', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div className="loading-spinner" style={{ width: 40, height: 40, border: '3px solid rgba(76, 64, 230, 0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div style={{ fontFamily: 'Manrope', fontSize: 13, letterSpacing: '2px', color: 'var(--text-muted)', fontWeight: 700 }}>SYNCHRONIZING RECYCLE DATA...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
    <DashboardLayout>
      <div className="ledger-view">
        <div className="ledger-header" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ textAlign: 'left' }}>
            <h1 className="client-title" style={{ marginBottom: 8, fontSize: 36, display: 'flex', alignItems: 'center', gap: 12 }}>
               🗑️ Recycle Bin
            </h1>
            <p className="ledger-subtitle" style={{ margin: 0 }}>
              Manage deleted clients. You can restore them to your active dashboard or permanently delete their ledgers.
            </p>
          </div>
        </div>

        {error && (
          <div className="card" style={{ border: '1px solid #fee2e2', background: '#fef2f2', color: '#b91c1c', padding: '24px', borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
             <span style={{ fontSize: 24 }}>⚠️</span>
             <div style={{ flex: 1 }}>
               <h4 style={{ marginBottom: 4 }}>System Alert</h4>
               <p style={{ fontSize: 14, opacity: 0.8 }}>{error}</p>
             </div>
             <button className="btn-outline" onClick={fetchDeletedClients} style={{ fontSize: 12, padding: '8px 16px' }}>Retry Sync</button>
          </div>
        )}

        {clients.length > 0 ? (
          <div className="client-grid">
            {clients.map((c, idx) => (
              <div key={c._id} className="arch-card" style={{ border: '1px solid #fee2e2', background: '#fef2f2' }}>
                <div className="arch-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.8 }}>
                    <div className="arch-card-icon" style={{ background: 'white' }}>{icons[idx % icons.length]}</div>
                    <div className="client-id-label">Deleted Client #CA-{idx + 101}</div>
                  </div>
                </div>
                <h3 className="arch-card-name" style={{ color: '#0f172a' }}>{c.name}</h3>
                
                <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid #fecaca' }}>
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1, padding: '8px', fontSize: 13, background: '#059669', border: 'none' }}
                    onClick={(e) => handleRestore(c._id, e)}
                    disabled={acting}
                  >
                    ♻️ Restore
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ flex: 1, padding: '8px', fontSize: 13, borderColor: '#ef4444', color: '#ef4444' }}
                    onClick={(e) => confirmDelete(c._id, e)}
                    disabled={acting}
                  >
                    🗑️ Delete Permanently
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : !error && (
          <div className="card" style={{ textAlign: 'center', padding: '120px 40px', borderStyle: 'dashed', borderRadius: 24, background: 'rgba(76,64,230,0.02)' }}>
             <div style={{ fontSize: 48, marginBottom: 24 }}>🍃</div>
             <h2 style={{ color: '#0f172a', fontSize: 24, marginBottom: 12 }}>Recycle Bin is empty</h2>
             <p style={{ color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
               No deleted clients found. When you delete a client from the dashboard, they will appear here safely.
             </p>
          </div>
        )}
      </div>
    </DashboardLayout>

    {isDeleteDialogOpen && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
        <div style={{ background: 'white', padding: 32, borderRadius: 24, width: 400, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 20, marginBottom: 12, color: '#ef4444' }}>Permanent Deletion</h3>
            <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: 16, borderRadius: 12, marginBottom: 24 }}>
                <p style={{ color: '#b91c1c', fontSize: 14, margin: 0, fontWeight: 600 }}>
                  WARNING: This action cannot be undone.
                </p>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.5 }}>
              Are you sure you want to permanently delete this client? All of their generated ledgers, services, and associated bills will be permanently wiped from the database.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn-outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={acting}>Keep Client</button>
              <button className="btn-primary" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={executePermanentDelete} disabled={acting}>
                {acting ? 'Purging...' : 'Wipe Permanently'}
              </button>
            </div>
        </div>
      </div>
    )}
    </>
  );
}
