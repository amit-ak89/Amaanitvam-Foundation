import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { FiAward, FiDownload, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [completedApps, setCompletedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [certsRes, appsRes] = await Promise.all([
        API.get('/certificates'),
        API.get('/applications?status=completed&limit=100'),
      ]);
      setCertificates(certsRes.data.certificates);
      setCompletedApps(appsRes.data.applications.filter(a => !a.certificateId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleGenerate = async (appId, appName) => {
    setGenerating(appId);
    try {
      await API.post(`/certificates/generate/${appId}`);
      toast.success(`Certificate generated & emailed to ${appName}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(null);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—';

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-500 text-sm mt-0.5">{certificates.length} certificates generated</p>
        </div>

        {completedApps.length > 0 && (
          <div className="card border-l-4 border-yellow-400">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FiRefreshCw size={16} className="text-yellow-500" />
              Pending Certificate Generation ({completedApps.length})
            </h2>
            <div className="space-y-2">
              {completedApps.map(app => (
                <div key={app._id} className="flex items-center justify-between bg-yellow-50 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{app.fullName}</p>
                    <p className="text-gray-500 text-xs">{app.email} · {app.role}</p>
                  </div>
                  <button onClick={() => handleGenerate(app._id, app.fullName)}
                    disabled={generating === app._id}
                    className="btn-primary py-1.5 px-4 text-sm flex items-center gap-1.5">
                    {generating === app._id
                      ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <FiAward size={14} />}
                    {generating === app._id ? 'Generating...' : 'Generate & Email'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">All Certificates</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Certificate ID', 'Intern Name', 'Role', 'Duration', 'Issue Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
                ) : certificates.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">No certificates generated yet</td></tr>
                ) : certificates.map((cert) => (
                  <tr key={cert._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-green-700 font-semibold">{cert.certificateId}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{cert.internName}</td>
                    <td className="py-3 px-4 text-gray-600">{cert.role}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(cert.startDate)} – {formatDate(cert.endDate)}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(cert.issueDate)}</td>
                    <td className="py-3 px-4">
                      {cert.isValid
                        ? <span className="badge-selected flex items-center gap-1 w-fit"><FiCheckCircle size={11} /> Valid</span>
                        : <span className="badge-rejected">Revoked</span>}
                    </td>
                    <td className="py-3 px-4">
                      <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/certificates/download/${cert.certificateId}`}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors">
                        <FiDownload size={13} /> Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CertificatesPage;
