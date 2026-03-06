import { Link } from 'react-router-dom';
import { Shield, Activity, Lock, Server, Cpu, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../shared/utils';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-brand-purple selection:text-white overflow-hidden">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-purple/20 blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-purple to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">OCsafe<span className="text-brand-purple-light">.</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/signin" className="text-sm font-bold text-gray-300 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/signup" className="text-sm font-bold bg-white text-slate-900 hover:bg-gray-100 px-5 py-2.5 rounded-full transition-all flex items-center gap-2">
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-purple-light text-sm font-bold mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-brand-purple animate-ping"></span>
            Enterprise Security Agent 2.0 Live
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-8">
            Next-Gen Endpoint <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-purple-400 to-blue-500">
              Intelligence Platform
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            Deploy our lightweight OS agent to monitor, analyze, and secure your entire fleet in real-time. Unmatched visibility. Zero compromise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold rounded-2xl shadow-xl shadow-brand-purple/25 transition-all flex items-center justify-center gap-2 text-lg group">
              Start Free Trial
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center text-lg">
              Explore Features
            </a>
          </div>
        </section>

        {/* Abstract Dashboard Preview */}
        <section className="px-6 max-w-6xl mx-auto mb-32">
          <div className="relative rounded-[2.5rem] bg-slate-900 border border-white/10 p-2 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0"></div>
            <div className="relative z-10 bg-slate-950 rounded-[2rem] border border-white/5 p-8 flex flex-col md:flex-row gap-8">
              {/* Fake Sidebar */}
              <div className="w-full md:w-64 space-y-3">
                <div className="h-4 w-24 bg-white/10 rounded-full mb-8"></div>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-10 w-full bg-white/5 rounded-xl flex items-center px-4">
                    <div className="w-5 h-5 bg-white/10 rounded mr-3"></div>
                    <div className="h-2 w-20 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
              {/* Fake Content area */}
              <div className="flex-1 space-y-6">
                <div className="flex gap-4">
                  <div className="h-32 flex-1 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-6 flex flex-col justify-end">
                    <div className="h-3 w-16 bg-purple-400/50 rounded-full mb-2"></div>
                    <div className="text-3xl font-black text-white">98/100</div>
                  </div>
                  <div className="h-32 flex-1 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-6 flex flex-col justify-end">
                    <div className="h-3 w-16 bg-blue-400/50 rounded-full mb-2"></div>
                    <div className="text-3xl font-black text-white">42 Nodes</div>
                  </div>
                  <div className="h-32 flex-1 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl p-6 flex flex-col justify-end">
                    <div className="h-3 w-16 bg-green-400/50 rounded-full mb-2"></div>
                    <div className="text-3xl font-black text-white">Secure</div>
                  </div>
                </div>
                <div className="h-48 w-full bg-white/5 rounded-2xl border border-white/5 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-4 w-32 bg-white/10 rounded-full"></div>
                    <div className="h-4 w-16 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-purple" style={{ width: `${Math.random() * 60 + 20}%`}}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 max-w-7xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Complete Threat Visibility</h2>
            <p className="text-gray-400 text-lg font-medium">Built for scale. Designed for speed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Activity />, title: 'Real-Time Telemetry', desc: 'Sub-second updates on CPU, RAM, Disk, and Network traffic from every endpoint.' },
              { icon: <Lock />, title: 'Ransomware Detection', desc: 'AI-driven heuristic analysis flags suspicious processes before they encrypt data.' },
              { icon: <Server />, title: 'Central Command', desc: 'Isolate compromised devices or enforce policies globally from a single dashboard.' },
              { icon: <Cpu />, title: 'Micro-Agent', desc: 'Our Python-based agent uses <1% CPU and <30MB RAM. Completely silent.' },
              { icon: <Shield />, title: 'Compliance Ready', desc: 'Track firewall status, antivirus signatures, and pending OS updates automatically.' },
              { icon: <Globe />, title: 'Hybrid Fleet Support', desc: 'Deploy across Windows, Linux, and macOS servers seamlessly.' },
            ].map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-purple-light mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 max-w-5xl mx-auto mb-32">
          <div className="bg-gradient-to-r from-brand-purple to-blue-700 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to secure your fleet?</h2>
              <p className="text-xl text-white/80 font-medium mb-10 max-w-2xl mx-auto">
                Join thousands of enterprises protecting their endpoints with OCSafe Cyberguard.
              </p>
              <Link to="/signup" className="inline-flex px-8 py-4 bg-white text-slate-900 font-black rounded-full hover:scale-105 transition-transform text-lg shadow-2xl">
                Get Started for Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-gray-500 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            <span className="font-bold text-gray-400">OCSafe Cyberguard</span>
            <span className="text-sm">&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
