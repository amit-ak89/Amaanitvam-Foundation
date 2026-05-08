import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { FiSearch, FiEye, FiTrash2, FiFilter, FiExternalLink, FiX } from 'react-icons/fi';

const STATUSES = ['all', 'pending', 'selected', 'rejected', 'completed'];

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [modalApp, setModalApp] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      const { data } = await API.get(`/applications?${params}`);
      setApplications(data.applications);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const openModal = (app) => {
    setModalApp(app);
    setNewStatus(app.status);
    setReviewNote(app.reviewNote || '');
    setStartDate(app.startDate ? app.startDate.slice(0, 10) : '');
    setEndDate(app.endDate ? app.endDate.slice(0, 10) : '');
  };

  const closeModal = () => {
    setModalApp(null);
    setNewStatus('');
    setReviewNote('');
    setStartDate('');
    setEndDate('');
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return toast.error('Please select a status');
    setUpdating(true);
    try {
      const payload = { status: newStatus, reviewNote };
      if (startDate) payload.startDate = startDate;
      if (endDate) payload.endDate = endDate;

      await API.put(`/applications/${modalApp._id}/status`, payload);
      toast.success('Status updated successfully!');
      closeModal();
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await API.delete(`/applications/${id}`);
      toast.success('Application deleted');
      fetchApplications();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total applications</p>
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, college..."
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="input w-40"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Role', 'College', 'Status', 'Applied', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">No applications found</td></tr>
                ) : applications.map((app) => (
                  <tr key={app._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900">{app.fullName}</td>
                    <td className="py-3 px-4 text-gray-500">{app.email}</td>
                    <td className="py-3 px-4 text-gray-600">{app.role}</td>
                    <td className="py-3 px-4 text-gray-500 max-w-[140px] truncate">{app.college}</td>
                    <td className="py-3 px-4"><StatusBadge status={app.status} /></td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(app.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(app)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View & Update"
                        >
                          <FiEye size={15} />
                        </button>
                        {app.resumeUrl?.startsWith('http') && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="View Resume"
                          >
                            <FiExternalLink size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 10 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50"
                >Prev</button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * 10 >= total}
                  className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50"
                >Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {modalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{modalApp.fullName}</h2>
                <p className="text-gray-500 text-sm">{modalApp.email} · {modalApp.phone}</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiX size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">College</p>
                  <p className="text-gray-800 font-medium">{modalApp.college}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Role</p>
                  <p className="text-gray-800 font-medium">{modalApp.role}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">LinkedIn</p>
                  <p className="text-gray-800 font-medium truncate">{modalApp.linkedin || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">GitHub</p>
                  <p className="text-gray-800 font-medium truncate">{modalApp.github || '—'}</p>
                </div>
              </div>

              {/* Skills */}
              {modalApp.skills?.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {modalApp.skills.map(s => (
                      <span key={s} className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {modalApp.coverLetter && (
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Cover Letter</p>
                  <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-lg p-3">{modalApp.coverLetter}</p>
                </div>
              )}

              {/* Resume */}
              {modalApp.resumeUrl?.startsWith('http') && (
                <a
                  href={modalApp.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-4 py-2.5 rounded-lg transition-colors w-fit"
                >
                  <FiExternalLink size={15} /> View Resume
                </a>
              )}

              {/* Current Status */}
              <div className="flex items-center gap-2">
                <p className="text-gray-400 text-xs font-semibold uppercase">Current Status:</p>
                <StatusBadge status={modalApp.status} />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Update Status Form */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-800">Update Status</p>

                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="input"
                  >
                    <option value="pending">Pending</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {(newStatus === 'selected' || newStatus === 'completed') && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Review Note (optional)</label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Add a note..."
                    rows={2}
                    className="input resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleStatusUpdate}
                    disabled={updating}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {updating ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : 'Update Status'}
                  </button>
                  <button onClick={closeModal} className="btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ApplicationsPage;
