import React from 'react';
import { Shield, AlertTriangle, Eye, Flag, Scale, Mail, CheckCircle, Lock, Users } from 'lucide-react';

export default function ChildSafetyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">UGive</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full" />
        
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-white">Child Safety</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> & CSAE Policy</span>
          </h1>
          
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
            UGive is committed to providing a safe and secure environment for all users.
            We strictly prohibit any form of Child Sexual Abuse and Exploitation (CSAE) on our platform.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative pb-24">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          
          {/* Zero Tolerance Policy */}
          <PolicyCard
            icon={<AlertTriangle className="w-6 h-6" />}
            iconBg="bg-red-500/10 border-red-500/20"
            iconColor="text-red-400"
            title="Zero Tolerance Policy"
            badge={{ text: "Critical", color: "bg-red-500/10 text-red-400 border-red-500/20" }}
          >
            <p className="text-slate-300 leading-relaxed">
              UGive has a <span className="text-white font-medium">zero-tolerance policy</span> toward any content 
              that involves the sexual exploitation, abuse, or endangerment of minors. 
              Such content is not allowed under any circumstances.
            </p>
          </PolicyCard>

          {/* Content Moderation */}
          <PolicyCard
            icon={<Eye className="w-6 h-6" />}
            iconBg="bg-blue-500/10 border-blue-500/20"
            iconColor="text-blue-400"
            title="Content Moderation & Enforcement"
          >
            <ul className="space-y-4">
              <ListItem icon={<Lock className="w-4 h-4" />} color="text-blue-400">
                Automated and manual monitoring mechanisms are used to detect violations.
              </ListItem>
              <ListItem icon={<CheckCircle className="w-4 h-4" />} color="text-emerald-400">
                Any CSAE-related content is immediately removed.
              </ListItem>
              <ListItem icon={<AlertTriangle className="w-4 h-4" />} color="text-amber-400">
                Accounts involved in such violations are permanently suspended or banned.
              </ListItem>
            </ul>
          </PolicyCard>

          {/* Reporting & User Safety */}
          <PolicyCard
            icon={<Flag className="w-6 h-6" />}
            iconBg="bg-amber-500/10 border-amber-500/20"
            iconColor="text-amber-400"
            title="Reporting & User Safety"
          >
            <p className="text-slate-300 leading-relaxed mb-4">
              Users can report inappropriate or harmful content directly within the app or by 
              contacting our support team.
            </p>
            <p className="text-slate-300 leading-relaxed">
              All reports are reviewed promptly, and appropriate action is taken.
            </p>
          </PolicyCard>

          {/* Legal Compliance */}
          <PolicyCard
            icon={<Scale className="w-6 h-6" />}
            iconBg="bg-purple-500/10 border-purple-500/20"
            iconColor="text-purple-400"
            title="Legal Compliance & Cooperation"
          >
            <ul className="space-y-4">
              <ListItem icon={<CheckCircle className="w-4 h-4" />} color="text-purple-400">
                UGive complies with all applicable child protection laws and regulations.
              </ListItem>
              <ListItem icon={<Users className="w-4 h-4" />} color="text-purple-400">
                We fully cooperate with law enforcement agencies and authorities when required.
              </ListItem>
            </ul>
          </PolicyCard>

          {/* Contact Section */}
          <div className="relative mt-12">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-3xl" />
            <div className="relative bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-3">Contact</h2>
                  <p className="text-slate-400 mb-5">
                    For safety concerns or reporting issues, users can contact:
                  </p>
                  <a 
                    href="mailto:adasilva@simpleit4u.com.au" 
                    className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10"
                  >
                    <Mail className="w-4 h-4" />
                    adasilva@simpleit4u.com.au
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-sm text-slate-400">© {new Date().getFullYear()} UGive. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Committed to Safety</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Policy Card Component
function PolicyCard({ icon, iconBg, iconColor, title, badge, children }) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-800/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-slate-900/30 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-sm hover:border-slate-700/60 transition-colors duration-300">
        <div className="flex items-start gap-4 mb-5">
          <div className={`p-3 rounded-2xl border shrink-0 ${iconBg}`}>
            <span className={iconColor}>{icon}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap pt-2">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            {badge && (
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${badge.color}`}>
                {badge.text}
              </span>
            )}
          </div>
        </div>
        <div className="pl-0 md:pl-16">
          {children}
        </div>
      </div>
    </div>
  );
}

// List Item Component
function ListItem({ icon, color, children }) {
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-1 shrink-0 ${color}`}>{icon}</span>
      <span className="text-slate-300 leading-relaxed">{children}</span>
    </li>
  );
}
