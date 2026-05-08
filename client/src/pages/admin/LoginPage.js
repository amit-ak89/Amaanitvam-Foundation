import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 text-white">
        <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-4xl text-green-900 mb-6"
          style={{ background: 'linear-gradient(135deg, #f0c040, #e6b800)' }}>A</div>
        <h1 className="text-4xl font-extrabold mb-3">Amaanitvam Foundation</h1>
        <p className="text-green-200 text-lg text-center max-w-sm">
          Internship & Secure Certificate Automation System
        </p>
        <div className="mt-10 space-y-3 w-full max-w-xs">
          {['Manage Applications', 'Generate Certificates', 'Track Analytics', 'Bulk Operations'].map(f => (
            <div key={f} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-sm font-medium">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required placeholder="admin@amaanitvam.org" className="input pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required placeholder="••••••••" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <p>Super Admin: admin@amaanitvam.org / Admin@123</p>
              <p>Volunteer: volunteer@amaanitvam.org / Admin@123</p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/" className="text-green-700 hover:underline font-medium">← Back to Website</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
