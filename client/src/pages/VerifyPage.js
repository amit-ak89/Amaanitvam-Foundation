import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { FiCheckCircle, FiXCircle, FiShield, FiArrowLeft } from 'react-icons/fi';

const VerifyPage = () => {
  const { certificateId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputId, setInputId] = useState(certificateId !== 'demo' ? certificateId : '');

  const verify = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await API.get(`/certificates/verify/${id}`);
      setResult(data);
    } catch (err) {
      setResult(err.response?.data || { valid: false, message: 'INVALID CERTIFICATE' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId && certificateId !== 'demo') verify(certificateId);
  }, [certificateId]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-700 mb-6 text-sm font-medium transition-colors">
          <FiArrowLeft size={16} /> Back to Home
        </Link>

        <div className="card">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <FiShield size={28} className="text-green-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Certificate Verification</h1>
            <p className="text-gray-500 text-sm mt-1">Enter a certificate ID to verify its authenticity</p>
          </div>

          <div className="flex gap-2 mb-6">
            <input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="e.g. CERT-AMAN-2026-A1B2C3"
              className="input flex-1"
              onKeyDown={(e) => e.key === 'Enter' && verify(inputId)}
            />
            <button onClick={() => verify(inputId)} disabled={loading || !inputId}
              className="btn-primary px-5 py-2.5 whitespace-nowrap">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> : 'Verify'}
            </button>
          </div>

          {result && (
            <div className={`rounded-xl p-6 border-2 ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                {result.valid
                  ? <FiCheckCircle size={32} className="text-green-600" />
                  : <FiXCircle size={32} className="text-red-600" />}
                <div>
                  <p className={`text-xl font-bold ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                  <p className="text-sm text-gray-500">Amaanitvam Foundation</p>
                </div>
              </div>

              {result.valid && result.certificate && (
                <div className="space-y-2 border-t border-green-200 pt-4">
                  {[
                    ['Certificate ID', result.certificate.certificateId],
                    ['Intern Name', result.certificate.internName],
                    ['Role', result.certificate.role],
                    ['Duration', `${formatDate(result.certificate.startDate)} – ${formatDate(result.certificate.endDate)}`],
                    ['Issue Date', formatDate(result.certificate.issueDate)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">{label}</span>
                      <span className="text-gray-900 font-semibold text-right">{value}</span>
                    </div>
                  ))}
                  <div className="mt-4 pt-3 border-t border-green-200">
                    <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/certificates/download/${result.certificate.certificateId}`}
                      target="_blank" rel="noreferrer"
                      className="btn-primary w-full text-center block text-sm py-2.5">
                      Download Certificate PDF
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
