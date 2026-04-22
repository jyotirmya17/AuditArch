import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getAllBills, generateBill } from '../api/bills.api';
import { formatCurrency } from '../utils/formatters';

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    const results = bills.filter(bill => 
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.clientId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBills(results);
  }, [searchTerm, bills]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const { data } = await getAllBills();
      setBills(data.data || []);
      setFilteredBills(data.data || []);
    } catch (e) {
      console.error(e);
      toast.error('Archive Sync Failure: Could not retrieve historical records.');
    } finally {
      setLoading(true); // Artificial delay or just move to false
      setLoading(false);
    }
  };

  const handleDownload = async (clientId, billNumber) => {
    try {
      setDownloadingId(billNumber);
      const res = await generateBill(clientId, { billNumber });
      
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${billNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Bill retrieved successfully.');
    } catch (e) {
      console.error(e);
      toast.error('Retrieval Failure: PDF engine could not satisfy the request.');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout isBlurred={true}>
        <div style={{ height: 'calc(100vh - 100px)', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div className="loading-spinner" style={{ width: 40, height: 40, border: '3px solid rgba(76, 64, 230, 0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div style={{ fontFamily: 'Manrope', fontSize: 13, letterSpacing: '2px', color: 'var(--text-muted)', fontWeight: 700 }}>SYNCHRONIZING ARCHIVE ENGINE...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="ledger-view">
        <div className="ledger-header">
          <div className="breadcrumb">Professional Archives</div>
          <h1 className="managing-stat">
            Your <span>Billing</span> Protocol History
          </h1>
          <p className="ledger-subtitle">
            Access and manage every architectural transaction logged on the AuditArch platform.
          </p>
        </div>

        {/* Global Stats */}
        <div className="kpi-row" style={{ marginTop: 0, marginBottom: 48 }}>
          <div className="kpi-card">
            <div className="kpi-label">Total Bills Inscribed</div>
            <div className="kpi-value">{bills.length}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Cumulative Volume</div>
            <div className="kpi-value">{formatCurrency(bills.reduce((acc, b) => acc + b.totalAmount, 0))}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Average Invoice</div>
            <div className="kpi-value">{formatCurrency(bills.length ? bills.reduce((acc, b) => acc + b.totalAmount, 0) / bills.length : 0)}</div>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Master Ledger Index</h3>
            <div style={{ position: 'relative', width: '320px' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
              <input 
                className="protocol-input" 
                style={{ paddingLeft: 44, borderRadius: 99 }}
                placeholder="Search Client or Bill ID..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="protocol-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 32 }}>BILL NUMBER</th>
                <th>CLIENT IDENTITY</th>
                <th>GENERATED ON</th>
                <th style={{ textAlign: 'right' }}>VOLUME</th>
                <th style={{ textAlign: 'right', paddingRight: 32 }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
                     <div style={{ fontSize: 32, marginBottom: 16 }}>📭</div>
                     <div>No matching protocols found in the archive.</div>
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill._id} className="protocol-row" style={{ cursor: 'default' }}>
                    <td style={{ paddingLeft: 32, fontWeight: 800, color: 'var(--primary)' }}>
                      {bill.billNumber}
                    </td>
                    <td>
                      <div 
                        style={{ fontWeight: 800, cursor: 'pointer', color: 'var(--text-main)' }}
                        onClick={() => navigate(`/clients/${bill.clientId?._id}`)}
                      >
                        {bill.clientId?.name || 'Unknown Entity'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        {bill.clientId?.address}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#64748b' }}>
                      {formatDate(bill.generatedAt)}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: 16 }}>
                      {formatCurrency(bill.totalAmount)}
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: 32 }}>
                      <button 
                        className="btn-outline" 
                        style={{ padding: '8px 16px', fontSize: 12 }}
                        disabled={downloadingId === bill.billNumber}
                        onClick={() => handleDownload(bill.clientId?._id, bill.billNumber)}
                      >
                        {downloadingId === bill.billNumber ? 'Syncing...' : '📄 Download'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
