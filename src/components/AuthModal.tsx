import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Lock, Key, Github, Mail, ShieldCheck, Check, Sparkles, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'presets'>('presets');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Engineering Lead' | 'Developer' | 'Admin'>('Engineering Lead');

  if (!isOpen) return null;

  const handlePresetLogin = (presetRole: 'lead' | 'dev' | 'security') => {
    let mockUser: UserProfile;
    if (presetRole === 'lead') {
      mockUser = {
        id: 'usr-lead-1',
        name: 'Alex Rivera',
        email: 'alex@stackkeeper.dev',
        role: 'Engineering Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        workspace: 'Acme AI Labs',
        plan: 'Pro',
        apiKey: 'sk_live_99a8b7c6d5e4f3a210_stk'
      };
    } else if (presetRole === 'dev') {
      mockUser = {
        id: 'usr-dev-2',
        name: 'David Chen',
        email: 'david@stackkeeper.dev',
        role: 'Developer',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        workspace: 'Acme AI Labs',
        plan: 'Free',
        apiKey: 'sk_live_1234567890abcdef_stk'
      };
    } else {
      mockUser = {
        id: 'usr-sec-3',
        name: 'Elena Rostova',
        email: 'elena@stackkeeper.dev',
        role: 'Admin',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        workspace: 'Acme AI Labs',
        plan: 'Team',
        apiKey: 'sk_live_sec_99887766554433_stk'
      };
    }
    onLoginSuccess(mockUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0] || 'StackKeeper Builder',
      email: email || 'builder@stackkeeper.dev',
      role: role,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      workspace: 'My Workspace',
      plan: 'Pro',
      apiKey: `sk_live_${Math.random().toString(36).substring(2)}`
    };
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">StackKeeper Authentication</h3>
              <p className="text-[11px] font-mono text-zinc-400">Secure SSO & API Governance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            id="close-auth-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode selector pills */}
        <div className="flex items-center p-1 bg-zinc-900 rounded-xl my-4 text-xs font-mono">
          <button
            onClick={() => setMode('presets')}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${mode === 'presets' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400'}`}
          >
            Quick Demo Accounts
          </button>
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${mode === 'signin' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${mode === 'signup' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400'}`}
          >
            Sign Up
          </button>
        </div>

        {mode === 'presets' ? (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              Select a pre-configured workspace persona to immediately experience full API & MCP management capabilities:
            </p>

            <button
              onClick={() => handlePresetLogin('lead')}
              className="w-full p-3 rounded-xl bg-zinc-900/90 border border-indigo-500/30 hover:border-indigo-500 hover:bg-zinc-900 text-left flex items-center justify-between group transition-all"
              id="preset-lead-btn"
            >
              <div className="flex items-center space-x-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" className="w-9 h-9 rounded-full object-cover" alt="Alex" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-indigo-300">Alex Rivera (Lead Eng)</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Acme AI Labs • Pro Plan</div>
                </div>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded font-mono">Full Access</span>
            </button>

            <button
              onClick={() => handlePresetLogin('dev')}
              className="w-full p-3 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-purple-500 hover:bg-zinc-900 text-left flex items-center justify-between group transition-all"
              id="preset-dev-btn"
            >
              <div className="flex items-center space-x-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" className="w-9 h-9 rounded-full object-cover" alt="David" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-purple-300">David Chen (Agent Engineer)</div>
                  <div className="text-[10px] text-zinc-400 font-mono">MCP Specialist • Free Plan</div>
                </div>
              </div>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded font-mono">MCP Admin</span>
            </button>

            <button
              onClick={() => handlePresetLogin('security')}
              className="w-full p-3 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-emerald-500 hover:bg-zinc-900 text-left flex items-center justify-between group transition-all"
              id="preset-sec-btn"
            >
              <div className="flex items-center space-x-3">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" className="w-9 h-9 rounded-full object-cover" alt="Elena" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300">Elena Rostova (Security Lead)</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Vault Governance • Team Plan</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded font-mono">Vault Lead</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block text-zinc-400 text-[11px] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors mt-2"
              id="auth-submit-btn"
            >
              {mode === 'signin' ? 'Sign In to Dashboard' : 'Create StackKeeper Account'}
            </button>

            <div className="relative py-2 text-center text-zinc-600 text-[10px]">
              <span className="bg-zinc-950 px-2 z-10 relative">or continue with OAuth</span>
              <div className="absolute top-1/2 left-0 w-full border-t border-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handlePresetLogin('lead')}
                className="py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl text-zinc-300 flex items-center justify-center space-x-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub SSO</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetLogin('dev')}
                className="py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl text-zinc-300 flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Google OAuth</span>
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-white/10 text-center text-[10px] text-zinc-500 font-mono">
          🔒 Zero Secret Policy • StackKeeper tracks metadata, never your raw API keys.
        </div>

      </div>
    </div>
  );
};
