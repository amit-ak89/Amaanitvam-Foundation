import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { FiUpload, FiDownload, FiCheckCircle, FiInfo } from 'react-icons/fi';

const BulkUploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a CSV file');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('csv', file);
      const { data } = await API.post('/certificates/bulk', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(data);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk generation failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadSample = () => {
    const csv = `fullName,email,role,startDate,endDate
Arjun Sharma,arjun@example.com,Web Developer,2026-01-01,2026-03-31
Priya Patel,priya@example.com,Data Analyst,2026-02-01,2026-04-30`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sample_bulk_upload.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bulk Certificate Generation</h1>
          <p className="text-gray-500 text-sm mt-0.5">Upload a CSV to generate and email certificates in bulk</p>
        </div>

        {/* Instructions */}
        <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <div className="flex gap-3">
            <FiInfo size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">CSV Format Required</p>
              <p className="text-xs text-blue-700 dark:text-blue-400 font-mono bg-blue-100 dark:bg-blue-900/40 rounded px-3 py-2">
                fullName, email, role, startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
              </p>
              <button onClick={downloadSample} className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-400 font-semibold hover:underline">
                <FiDownload size={13} /> Download Sample CSV
              </button>
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="card space-y-4">
          <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors
            ${file ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-700/30 hover:border-green-400 hover:bg-green-50'}`}>
            <FiUpload size={28} className={file ? 'text-green-600' : 'text-gray-400'} />
            <p className={`text-sm mt-2 font-semibold ${file ? 'text-green-700' : 'text-gray-500'}`}>
              {file ? file.name : 'Click to upload CSV file'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Only .csv files accepted</p>
            <input type="file" accept=".csv" className="hidden" onChange={(e) => { setFile(e.target.files[0]); setResult(null); }} />
          </label>

          <button onClick={handleUpload} disabled={loading || !file} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating Certificates...</>
            ) : (
              <><FiUpload size={16} /> Generate & Email All Certificates</>
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="card bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-4">
              <FiCheckCircle size={24} className="text-green-600" />
              <p className="font-bold text-green-800 dark:text-green-300">{result.message}</p>
            </div>
            <div className="space-y-2">
              {result.generated?.map((cert) => (
                <div key={cert._id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-4 py-2.5 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{cert.internName}</p>
                    <p className="text-gray-500 text-xs">{cert.internEmail}</p>
                  </div>
                  <span className="font-mono text-xs text-green-700 dark:text-green-400 font-semibold">{cert.certificateId}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BulkUploadPage;
