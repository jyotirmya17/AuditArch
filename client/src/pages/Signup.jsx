import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, updateProfile } from '../api/auth.api';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '', 
    password: '', 
    firmName: '', 
    designation: 'Chartered Accountants',
    addressLine1: '', 
    bankAccountHolderName: '', 
    accountNumber: '', 
    bankName: '', 
    ifscCode: '', 
    billPrefix: 'CA',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStep1 = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await signup({ email: formData.email, password: formData.password });
      localStorage.setItem('token', data.token);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Identity setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const profile = {
        firmName: formData.firmName,
        designation: formData.designation,
        addressLine1: formData.addressLine1,
        bankAccountHolderName: formData.bankAccountHolderName || formData.firmName,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        ifscCode: formData.ifscCode,
        billPrefix: formData.billPrefix
      };
      await updateProfile(profile);
      window.location.href = '/dashboard';
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        setError(`${serverErrors[0].field}: ${serverErrors[0].message}`);
      } else {
        setError(err.response?.data?.message || 'Profile setup failed. Check all fields.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="signup-container">
        {/* Left Side: Static Branding */}
        <div className="signup-left">
          <Link to="/" style={{ textDecoration: 'none', fontSize: 24, fontWeight: 800, color: 'var(--primary)', fontFamily: 'Manrope', display: 'block', marginBottom: 80 }}>
            AuditArch
          </Link>
          
          <div style={{ maxWidth: 400 }}>
             <span className="badge" style={{ marginBottom: 24, fontSize: 11, letterSpacing: '1.5px', background: 'rgba(76, 64, 230, 0.08)' }}>
               {step === 1 ? 'STEP 01: IDENTITY' : 'STEP 02: PROTOCOL'}
             </span>
             <h1 style={{ fontSize: 52, lineHeight: 1.1, marginBottom: 24, color: '#0f172a' }}>
               {step === 1 ? 'Building Your AuditArch Identity' : 'Defining Your Professional Practice'}<span style={{color: 'var(--primary)'}}>.</span>
             </h1>
             <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6, marginBottom: 48 }}>
               {step === 1 
                 ? 'Start your AuditArch journey by securing your professional identity. We provide the infrastructure; you bring the expertise.' 
                 : 'Transition your practice from simple ledger entries to a masterwork of professional precision. We secure your base.'}
             </p>
             
             <div className="grid grid-2">
                <div className="feature-mini-card" style={{ marginTop: 0, padding: '24px 20px', ...(step === 1 ? { background: 'rgba(76, 64, 230, 0.08)' } : {}) }}>
                   <div style={{ fontSize: 20, marginBottom: 12 }}>🛡️</div>
                   <h4 style={{ fontSize: 13, marginBottom: 4 }}>Identity Secure</h4>
                   <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Multi-phase crypto-protection for your login.</p>
                </div>
                <div className="feature-mini-card" style={{ marginTop: 0, padding: '24px 20px', ...(step === 2 ? { background: 'rgba(76, 64, 230, 0.08)' } : {}) }}>
                   <div style={{ fontSize: 20, marginBottom: 12 }}>🔒</div>
                   <h4 style={{ fontSize: 13, marginBottom: 4 }}>Firm Encrypted</h4>
                   <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>AES-256 grade protection for your ledger.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Dynamic Form Step */}
        <div className="signup-right">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 40 }}>
             <div style={{ width: 40, height: 40, borderRadius: '50%', background: step === 2 ? 'var(--primary)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step === 2 ? 'white' : 'inherit', fontSize: 12, fontWeight: 800 }}>
               {step}/2
             </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleStep1} className="setup-card">
              {error && <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: 12, borderRadius: 12, marginBottom: 24, fontSize: 14 }}>{error}</div>}
              
              <div className="section-label">
                 <h3 style={{ fontSize: 22 }}>Step 1: Practitioner Credentials</h3>
              </div>
              
              <div className="grid" style={{ gap: 20, marginBottom: 40 }}>
                 <div className="input-group">
                    <label>OFFICE EMAIL</label>
                    <input className="input-pill" type="email" required placeholder="name@firm.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                 </div>
                 <div className="input-group">
                    <label>ACCESS PASSWORD</label>
                    <input className="input-pill" type="password" required placeholder="•••••••• (Min 8 chars)" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                 </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: 16, fontSize: 16, justifyContent: 'center' }}>
                {loading ? 'Securing Credentials...' : 'Sign Up & Continue →'}
              </button>
              
              <p style={{ marginTop: 32, fontSize: 14, textAlign: 'center', color: 'var(--text-muted)' }}>
                 Already using AuditArch? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="setup-card">
              {error && <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: 12, borderRadius: 12, marginBottom: 24, fontSize: 14 }}>{error}</div>}
              
              <div className="section-label">
                 <h3 style={{ fontSize: 22 }}>Step 2: Firm Protocol</h3>
              </div>
              
              <div className="grid grid-2" style={{ gap: 20, marginBottom: 40 }}>
                 <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>REGISTERED DISCIPLINE NAME</label>
                    <input className="input-pill" type="text" required placeholder="e.g. Sterling & Associates CA" value={formData.firmName} onChange={e => setFormData({...formData, firmName: e.target.value})} />
                 </div>
                 <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>FIRM BASE ADDRESS</label>
                    <input className="input-pill" type="text" required placeholder="Full registered office address" value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} />
                 </div>
                 
                 <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: 10 }}>
                   <label>LEDGER BILLING ENGINE</label>
                   <input className="input-pill" type="text" required placeholder="Bank Name" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} />
                 </div>
                 <div className="input-group">
                    <label>ACCOUNT NO</label>
                    <input className="input-pill" type="text" required placeholder="•••• 4242" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} />
                 </div>
                 <div className="input-group">
                    <label>IFSC CODE</label>
                    <input className="input-pill" type="text" required placeholder="GBLT0001234" value={formData.ifscCode} onChange={e => setFormData({...formData, ifscCode: e.target.value})} />
                 </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: 16, fontSize: 16, justifyContent: 'center' }}>
                {loading ? 'Establishing Protocol...' : 'Complete Firm Setup →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
