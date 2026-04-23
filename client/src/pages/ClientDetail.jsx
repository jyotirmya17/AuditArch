import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import AddServiceModal from '../components/services/AddServiceModal';
import BillPreviewModal from '../components/bills/BillPreviewModal';
import { getServices } from '../api/services.api';
import { saveBill, generateBill, getBillHistory } from '../api/bills.api';
import { getClients, getCAProfile } from '../api/clients.api';
import { formatCurrency } from '../utils/formatters';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [services, setServices] = useState([]);
  const [bills, setBills] = useState([]);
  const [ca, setCa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [clientRes, servicesRes, billsRes, caRes] = await Promise.all([
        getClients(),
        getServices(id),
        getBillHistory(id),
        getCAProfile()
      ]);

      const currentClient = clientRes.data.data.find(c => c._id === id);
      setClient(currentClient);
      
      const sortedServices = servicesRes.data.data.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      setServices(sortedServices);
      
      setBills(billsRes.data.data || []);
      setCa(caRes.data.data);
    } catch (e) {
      console.error(e);
      toast.error('Protocol Failure: Technical synchronization error.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddServiceSuccess = (newService) => {
    setServices([newService, ...services]);
    toast.success('Ledger context updated successfully.');
  };

  const handleGenerateClick = () => {
    if (services.length === 0) {
      toast.error("Add services before generating a bill protocol.");
      return;
    }
    setIsBillModalOpen(true);
  };

  const handleConfirmGenerate = () => {
    setIsBillModalOpen(false);
    fetchInitialData();
  };

  const totalBilled = services.reduce((acc, s) => acc + s.amount, 0);

  if (loading) {
    return (
      <DashboardLayout isBlurred={loading}>
        <div style={{ height: 'calc(100vh - 100px)', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div className="loading-spinner" style={{ width: 40, height: 40, border: '3px solid rgba(76, 64, 230, 0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div style={{ fontFamily: 'Manrope', fontSize: 13, letterSpacing: '2px', color: 'var(--text-muted)', fontWeight: 700 }}>SYNCHRONIZING LEDGER GATEWAY...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isBlurred={isServiceModalOpen}>
      <div className="ledger-view">
        <div className="ledger-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="breadcrumb" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>Client Ledger / {client?.name}</div>
            <h1 className="client-title">{client?.name}</h1>
            <div style={{ display: 'flex', gap: 24, marginTop: 12, fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
              <span>📍 {client?.address}</span>
              <span className="badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #d1fae5' }}>● Active Account</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <button className="btn-outline" onClick={() => setIsServiceModalOpen(true)}>+ New Service</button>
            <button className="btn-primary" onClick={handleGenerateClick} disabled={generating}>
               📄 Generate Bill
            </button>
          </div>
        </div>

        <div className="kpi-row" style={{ marginTop: 40 }}>
          <div className="kpi-card">
            <div className="kpi-label">Ledger Total</div>
            <div className="kpi-value">{formatCurrency(totalBilled)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Service Entries</div>
            <div className="kpi-value">{services.length}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Bills Printed</div>
            <div className="kpi-value">{bills.length}</div>
          </div>
        </div>

        <div className="ledger-table-container" style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Transaction History</h3>
          </div>

          <table className="protocol-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>DATE</th>
                <th style={{ width: '45%' }}>PARTICULARS</th>
                <th style={{ width: '10%' }}>FY</th>
                <th style={{ width: '15%', textAlign: 'right' }}>TYPE</th>
                <th style={{ width: '15%', textAlign: 'right' }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
                     <div style={{ fontSize: 32, marginBottom: 16 }}>📂</div>
                     <div>No professional records found in the ledger.</div>
                  </td>
                </tr>
              ) : (
                services.map((s) => (
                  <tr key={s._id} className="protocol-row">
                    <td style={{ fontWeight: 700, color: '#64748b' }}>
                      {new Date(s.dateAdded).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                       <div style={{ fontWeight: 800 }}>{s.particulars}</div>
                       <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.subNote || 'Standard service protocol applied.'}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px' }}>{s.financialYear}</td>
                    <td style={{ textAlign: 'right', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                       <span style={{ color: s.entryType === 'ope' ? '#e11d48' : '#059669' }}>
                         {s.entryType === 'ope' ? 'Expense' : 'Service'}
                       </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: 15 }}>
                      {formatCurrency(s.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AddServiceModal 
          isOpen={isServiceModalOpen} 
          onClose={() => setIsServiceModalOpen(false)} 
          onSuccess={handleAddServiceSuccess}
          clientId={id}
        />
      </div>

      {isBillModalOpen && (
        <BillPreviewModal
          client={client}
          services={services}
          ca={ca}
          onClose={() => setIsBillModalOpen(false)}
          onConfirm={handleConfirmGenerate}
          generating={generating}
        />
      )}
    </DashboardLayout>
  );
}
