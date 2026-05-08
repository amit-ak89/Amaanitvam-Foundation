import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiAward, FiUsers, FiCheckCircle } from 'react-icons/fi';

const features = [
  { icon: FiUsers, title: 'Easy Application', desc: 'Simple internship application process with resume upload.' },
  { icon: FiShield, title: 'Secure Certificates', desc: 'SHA256 verified certificates with QR code authentication.' },
  { icon: FiAward, title: 'Instant PDF', desc: 'Professional PDF certificates generated and emailed automatically.' },
  { icon: FiCheckCircle, title: 'Verify Anytime', desc: 'Anyone can verify certificate authenticity with a unique ID.' },
];

const HomePage = () => (
  <div className="min-h-screen bg-white dark:bg-gray-950">
    {/* Navbar */}
    <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-50">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg text-green-900"
          style={{ background: 'linear-gradient(135deg, #f0c040, #e6b800)' }}>A</div>
        <span className="font-bold text-green-800 text-lg">Amaanitvam Foundation</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/verify/demo" className="text-sm text-gray-600 hover:text-green-700 font-medium transition-colors">Verify Certificate</Link>
        <Link to="/apply" className="btn-primary text-sm py-2 px-4">Apply Now</Link>
        <Link to="/admin/login" className="btn-secondary text-sm py-2 px-4">Admin Login</Link>
      </div>
    </nav>

    {/* Hero */}
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 50%, #1a472a 100%)' }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-300 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
        <span className="inline-block bg-yellow-400/20 text-yellow-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-yellow-400/30">
          🌱 Empowering Youth · Building Futures
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Internship &amp; Certificate<br />
          <span className="text-yellow-400">Automation System</span>
        </h1>
        <p className="text-green-200 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Join Amaanitvam Foundation's internship program. Get hands-on experience and receive a
          blockchain-verified, tamper-proof certificate upon completion.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/apply"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg">
            Apply for Internship <FiArrowRight size={20} />
          </Link>
          <Link to="/verify/demo"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-all duration-200 text-lg">
            <FiShield size={20} /> Verify Certificate
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-14">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose Amaanitvam?</h2>
        <p className="text-gray-500 text-lg">A transparent, secure, and professional internship experience.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card text-center hover:shadow-md transition-shadow duration-200 group">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
              <Icon size={26} className="text-green-700" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
        <p className="text-gray-500 mb-8 text-lg">Applications are open. Join hundreds of interns who have grown with us.</p>
        <Link to="/apply" className="btn-primary text-base px-10 py-3.5 inline-flex items-center gap-2">
          Apply Now <FiArrowRight size={18} />
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
      <p>© 2026 Amaanitvam Foundation. All rights reserved.</p>
      <p className="mt-1">
        <Link to="/admin/login" className="hover:text-green-600 transition-colors">Admin Portal</Link>
        {' · '}
        <Link to="/verify/demo" className="hover:text-green-600 transition-colors">Verify Certificate</Link>
      </p>
    </footer>
  </div>
);

export default HomePage;
