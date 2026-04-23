import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getMe, updateProfile } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await getMe();
      setProfile(data.data);
      const backendProfile = data.data.profile || {};
      setFormData({
        firmName: backendProfile.firmName || '',
        billPrefix: backendProfile.billPrefix || '',
        addressLine1: backendProfile.addressLine1 || '',
        bankName: backendProfile.bankName || '',
        accountNumber: backendProfile.accountNumber || '',
        ifscCode: backendProfile.ifscCode || '',
        bankAccountHolderName: backendProfile.bankHolderName || '',
        branchName: backendProfile.branchName || '',
      });
    } catch(e) { console.error(e); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      await refreshUser();
      localStorage.setItem('profileComplete', 'true');
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch(e) {
      setMsg('Failed to update');
    }
  };

  if(!profile) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="card" style={{maxWidth: 800}}>
        {msg && <div style={{color: 'var(--accent)', marginBottom: 16}}>{msg}</div>}
        <form onSubmit={handleSave}>
          <h3 style={{marginBottom: 16, color: 'var(--text-muted)'}}>Firm Details</h3>
          <div className="grid">
             <div className="input-group">
                <label>Firm Name</label>
                <input value={formData.firmName} onChange={e => setFormData({...formData, firmName: e.target.value})} />
             </div>
             <div className="input-group">
                <label>Bill Prefix (e.g. NPC)</label>
                <input value={formData.billPrefix} onChange={e => setFormData({...formData, billPrefix: e.target.value})} />
             </div>
          </div>
          <div className="input-group">
             <label>Address</label>
             <input value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} />
          </div>

          <h3 style={{marginTop: 32, marginBottom: 16, color: 'var(--text-muted)'}}>Bank Details</h3>
          <div className="grid">
            <div className="input-group">
               <label>Bank Name</label>
               <input value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} />
            </div>
            <div className="input-group">
               <label>Account Number</label>
               <input value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} />
            </div>
            <div className="input-group">
               <label>IFSC Code</label>
               <input value={formData.ifscCode} onChange={e => setFormData({...formData, ifscCode: e.target.value})} />
            </div>
            <div className="input-group">
               <label>Holder Name</label>
               <input value={formData.bankAccountHolderName || ''} onChange={e => setFormData({...formData, bankAccountHolderName: e.target.value})} />
            </div>
            <div className="input-group">
               <label>Branch Name</label>
               <input value={formData.branchName || ''} onChange={e => setFormData({...formData, branchName: e.target.value})} />
            </div>
          </div>
          <div style={{marginTop: 24, textAlign: 'right'}}>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
