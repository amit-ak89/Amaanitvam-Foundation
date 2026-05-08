import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { FiUpload, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const roles = ['Web Developer', 'Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Data Analyst', 'Content Writer', 'Social Media Manager', 'Graphic Designer', 'Mobile App Developer', 'DevOps Engineer'];

const ApplyPage = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', college: '',
    skills: '', role: '', linkedin: '', github: '', coverLetter: '',
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error('Please upload your resume');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'skills' ? v : v));
      // Convert skills string to array
      fd.set('skills', form.skills.split(',').map(s => s.trim()).filter(Boolean));
      fd.append('resume', resume);
      await API.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card max-w-md w-full text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
        <p className="text-gray-500 mb-6">We'll review your application and get back to you via email within 3-5 business days.</p>
        <Link to="/" className="btn-primary inline-block">Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-700 mb-6 transition-colors text-sm font-medium">
          <FiArrowLeft size={16} /> Back to Home
        </Link>

        <div className="card">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl text-green-900 mx-auto mb-3"
              style={{ background: 'linear-gradient(135deg, #f0c040, #e6b800)' }}>A</div>
            <h1 className="text-2xl font-bold text-gray-900">Internship Application</h1>
            <p className="text-gray-500 text-sm mt-1">Amaanitvam Foundation · 2026</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Arjun Sharma" className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="arjun@example.com" className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="9876543210" className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">College / University *</label>
                <input name="college" value={form.college} onChange={handleChange} required placeholder="IIT Delhi" className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Internship Role *</label>
              <select name="role" value={form.role} onChange={handleChange} required className="input">
                <option value="">Select a role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skills (comma separated) *</label>
              <input name="skills" value={form.skills} onChange={handleChange} required placeholder="React, Node.js, MongoDB" className="input" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">LinkedIn Profile</label>
                <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">GitHub Profile</label>
                <input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Letter</label>
              <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} rows={4}
                placeholder="Tell us why you want to intern at Amaanitvam Foundation..." className="input resize-none" />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resume (PDF/DOC) *</label>
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                ${resume ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-green-400 hover:bg-green-50'}`}>
                <FiUpload size={24} className={resume ? 'text-green-600' : 'text-gray-400'} />
                <p className={`text-sm mt-2 font-medium ${resume ? 'text-green-700' : 'text-gray-500'}`}>
                  {resume ? resume.name : 'Click to upload resume'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (max 5MB)</p>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setResume(e.target.files[0])} />
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
