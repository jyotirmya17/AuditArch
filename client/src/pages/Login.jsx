import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../api/auth.api';

export default function Login() {
  const [email, setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]    = useState('');
  const { login }            = useAuth();
  const navigate             = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      
      const isComplete = localStorage.getItem('profileComplete');
      if (isComplete === 'true') {
        navigate('/dashboard');
        return;
      }
      
      const { data } = await getMe();
      const profile = data?.data?.profile;
      const isProfileComplete = profile && profile.firmName && profile.bankHolderName;

      if (isProfileComplete) {
        localStorage.setItem('profileComplete', 'true');
        navigate('/dashboard');
      } else {
        navigate('/settings'); // go to profile form
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h1 className="auth-title">AuditArch</h1>
        {error && <div style={{color: 'var(--accent)', marginBottom: 16}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" style={{width: '100%', marginTop: 12}}>
            Sign In
          </button>
        </form>
        <p style={{marginTop: 24, textAlign: 'center', color: 'var(--text-muted)'}}>
          Don't have an account? <Link to="/signup" style={{color: 'var(--primary)'}}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
