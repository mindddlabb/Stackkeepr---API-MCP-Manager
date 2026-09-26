import React from 'react';
import { UserProfile } from '../types';
import { 
  Server, 
  ShieldAlert, 
  Key, 
  Zap, 
  Sun, 
  Moon, 
  User as UserIcon, 
  ChevronDown, 
  LogOut, 
  Sparkles,
  LayoutDashboard,
  Terminal,
  Activity,
  ArrowRight,
  Box
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile | null;
  activeTab: 'landing' | 'dashboard';
  setActiveTab: (tab: 'landing' | 'dashboard') => void;
  dashboardSubTab: string;
  setDashboardSubTab: (subTab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenAddModal: () => void;
  onOpenScanModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  dashboardSubTab,
  setDashboardSubTab,
  onOpenAuth,
  onLogout,
  isDarkMode,
  setIsDarkMode,
  onOpenAddModal,
  onOpenScanModal
}) => {
  const [workspaceOpen, setWorkspaceOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo - Suga.app style minimalist icon */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setActiveTab('landing')}
              className="flex items-center space-x-2.5 text-left group"
              id="brand-logo-btn"
            >
              {/* Suga-style geometric cube mark */}
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
                <Box className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-white">
                StackKeeper
              </span>
            </button>

            {/* If in dashboard and user logged in, show workspace selector */}
            {activeTab === 'dashboard' && user && (
              <div className="relative hidden md:block pl-4 border-l border-white/10">
                <button
                  onClick={() => setWorkspaceOpen(!workspaceOpen)}
                  className="flex items-center space-x-2 px-3 py-1 rounded-md bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
                  id="workspace-selector-btn"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{user.workspace}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {workspaceOpen && (
                  <div className="absolute top-full left-4 mt-2 w-52 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 text-xs font-mono">
                    <div className="px-3 py-1.5 text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Workspaces</div>
                    <button 
                      onClick={() => setWorkspaceOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800 text-white font-medium"
                    >
                      <span>{user.workspace}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Active</span>
                    </button>
                    <button 
                      onClick={() => setWorkspaceOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
                    >
                      + Create Workspace
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links - Suga.app exact items */}
          <nav className="hidden lg:flex items-center space-x-6 text-[14px] font-normal">
            {activeTab === 'landing' ? (
              <>
                <a href="#workflow" className="text-zinc-400 hover:text-white transition-colors">
                  Workflow
                </a>
                <a href="#features" className="text-zinc-400 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors">
                  Pricing
                </a>
                <a href="#changelog" className="text-zinc-400 hover:text-white transition-colors">
                  Changelog
                </a>
                <a href="#faq" className="text-zinc-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </>
            ) : (
              <div className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-lg border border-white/10 font-mono text-xs">
                <button
                  onClick={() => setDashboardSubTab('inventory')}
                  className={`px-3 py-1 rounded transition-all flex items-center space-x-1.5 ${
                    dashboardSubTab === 'inventory' 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  id="tab-inventory-btn"
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>Inventory</span>
                </button>
                <button
                  onClick={() => setDashboardSubTab('analytics')}
                  className={`px-3 py-1 rounded transition-all flex items-center space-x-1.5 ${
                    dashboardSubTab === 'analytics' 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  id="tab-analytics-btn"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => setDashboardSubTab('mcp')}
                  className={`px-3 py-1 rounded transition-all flex items-center space-x-1.5 ${
                    dashboardSubTab === 'mcp' 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  id="tab-mcp-btn"
                >
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>MCP Governance</span>
                </button>
                <button
                  onClick={() => setDashboardSubTab('vault')}
                  className={`px-3 py-1 rounded transition-all flex items-center space-x-1.5 ${
                    dashboardSubTab === 'vault' 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  id="tab-vault-btn"
                >
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Vault</span>
                </button>
                <button
                  onClick={() => setDashboardSubTab('scanner')}
                  className={`px-3 py-1 rounded transition-all flex items-center space-x-1.5 ${
                    dashboardSubTab === 'scanner' 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  id="tab-scanner-btn"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Repo Scan</span>
                </button>
              </div>
            )}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center space-x-4 text-[14px]">
            {/* Dark/Light toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Toggle Theme"
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-zinc-400 hover:text-white" /> : <Moon className="w-4 h-4 text-zinc-400 hover:text-black" />}
            </button>

            {/* Suga.app Sign In Link */}
            {!user && (
              <button
                onClick={onOpenAuth}
                className="text-zinc-300 hover:text-white transition-colors text-sm font-normal"
                id="sign-in-nav-btn"
              >
                Sign in
              </button>
            )}

            {/* Suga.app White Pill Button "Start free →" */}
            {activeTab === 'landing' ? (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="bg-white text-black hover:bg-zinc-200 font-medium px-4 py-1.5 rounded-lg text-[14px] transition-all flex items-center space-x-1"
                id="open-dashboard-cta-btn"
              >
                <span>Start free</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenScanModal}
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition-colors"
                  id="nav-quick-scan-btn"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick Scan</span>
                </button>
                <button
                  onClick={onOpenAddModal}
                  className="bg-white text-black hover:bg-zinc-200 font-medium px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center space-x-1"
                  id="nav-add-integration-btn"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Add API/MCP</span>
                </button>
              </div>
            )}

            {/* Auth User Badge if logged in */}
            {user && (
              <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
                <div className="flex items-center space-x-2 bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1">
                  <img src={user.avatarUrl} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-xs text-white font-medium">{user.name}</span>
                  <button 
                    onClick={onLogout}
                    className="p-1 text-zinc-400 hover:text-rose-400 transition-colors ml-1"
                    title="Sign Out"
                    id="user-logout-btn"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

