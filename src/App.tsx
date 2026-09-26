import React, { useState, useEffect } from 'react';
import { 
  ApiIntegration, 
  AuditLog, 
  UserProfile 
} from './types';
import { 
  getStoredIntegrations, 
  saveStoredIntegrations, 
  getStoredLogs, 
  saveStoredLogs, 
  getStoredUser, 
  saveStoredUser 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { AddIntegrationModal } from './components/AddIntegrationModal';
import { TestPingModal } from './components/TestPingModal';
import { RepoScanModal } from './components/RepoScanModal';
import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(getStoredUser());
  const [integrations, setIntegrations] = useState<ApiIntegration[]>(getStoredIntegrations());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getStoredLogs());
  
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard'>('landing');
  const [dashboardSubTab, setDashboardSubTab] = useState<string>('inventory');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [testPingTarget, setTestPingTarget] = useState<ApiIntegration | null>(null);
  const [repoScanModalOpen, setRepoScanModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync state changes to LocalStorage
  useEffect(() => {
    saveStoredIntegrations(integrations);
  }, [integrations]);

  useEffect(() => {
    saveStoredLogs(auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    if (user) {
      saveStoredUser(user);
    }
  }, [user]);

  // Apply dark mode CSS class to html/body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
  }, [isDarkMode]);

  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    showToast(`Welcome back, ${newUser.name}! Logged into ${newUser.workspace}.`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    showToast('Signed out of StackKeeper.', 'info');
  };

  const handleAddIntegration = (newIntegration: ApiIntegration) => {
    setIntegrations(prev => [newIntegration, ...prev]);
    
    // Add audit log entry
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: user ? user.name : 'Alex Rivera',
      userEmail: user ? user.email : 'alex@stackkeeper.dev',
      action: 'CREATED',
      targetName: newIntegration.name,
      targetType: newIntegration.type,
      details: `Registered new dependency metadata with location in ${newIntegration.keyLocation}.`,
      status: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    showToast(`Added ${newIntegration.name} to StackKeeper inventory!`, 'success');
  };

  const handleDeleteIntegration = (id: string) => {
    const item = integrations.find(i => i.id === id);
    if (!item) return;

    setIntegrations(prev => prev.filter(i => i.id !== id));

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: user ? user.name : 'Alex Rivera',
      userEmail: user ? user.email : 'alex@stackkeeper.dev',
      action: 'REVOKED',
      targetName: item.name,
      targetType: item.type,
      details: `Revoked and removed dependency from StackKeeper inventory.`,
      status: 'warning'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    showToast(`Removed ${item.name} from inventory.`, 'info');
  };

  const handleRotateMetadata = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nextExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          lastRotated: today,
          expiresAt: nextExpiry
        };
      }
      return item;
    }));

    const item = integrations.find(i => i.id === id);
    if (item) {
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: user ? user.name : 'Alex Rivera',
        userEmail: user ? user.email : 'alex@stackkeeper.dev',
        action: 'ROTATED',
        targetName: item.name,
        targetType: item.type,
        details: `Rotated credential metadata. Next expiration set to ${nextExpiry}.`,
        status: 'success'
      };
      setAuditLogs(prev => [newLog, ...prev]);
      showToast(`Rotated metadata for ${item.name}! Expiration reset to 90 days.`, 'success');
    }
  };

  const handleUpdateStatusAfterPing = (id: string, newStatus: 'healthy' | 'degraded' | 'down', newLatency: number) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          latencyMs: newLatency,
          lastHealthCheck: 'Just now'
        };
      }
      return item;
    }));

    const item = integrations.find(i => i.id === id);
    if (item) {
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: user ? user.name : 'Alex Rivera',
        userEmail: user ? user.email : 'alex@stackkeeper.dev',
        action: 'TESTED',
        targetName: item.name,
        targetType: item.type,
        details: `Executed ping test: status ${newStatus.toUpperCase()}, latency ${newLatency}ms.`,
        status: newStatus === 'healthy' ? 'success' : 'warning'
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  const handleExportAuditLogs = () => {
    const csvHeader = 'Timestamp,User,Email,Action,Target,Type,Details,Status\n';
    const csvRows = auditLogs.map(l => 
      `"${l.timestamp}","${l.user}","${l.userEmail}","${l.action}","${l.targetName}","${l.targetType}","${l.details}","${l.status}"`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stackkeeper_audit_logs_${Date.now()}.csv`;
    a.click();
    showToast('Exported audit logs to CSV file!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce-short">
          <div className="px-4 py-3 rounded-2xl bg-zinc-900 border border-white/20 text-white shadow-2xl flex items-center space-x-2.5 font-mono text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dashboardSubTab={dashboardSubTab}
        setDashboardSubTab={setDashboardSubTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenAddModal={() => setAddModalOpen(true)}
        onOpenScanModal={() => setRepoScanModalOpen(true)}
      />

      {/* Page Body View Router */}
      <main className="flex-1">
        {activeTab === 'landing' ? (
          <LandingPage
            onOpenDashboard={() => setActiveTab('dashboard')}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenScanDemo={() => setRepoScanModalOpen(true)}
          />
        ) : (
          <Dashboard
            user={user || {
              id: 'usr-guest',
              name: 'Guest Builder',
              email: 'guest@stackkeeper.dev',
              role: 'Engineering Lead',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
              workspace: 'Acme AI Labs',
              plan: 'Pro'
            }}
            integrations={integrations}
            auditLogs={auditLogs}
            subTab={dashboardSubTab}
            setSubTab={setDashboardSubTab}
            onOpenAddModal={() => setAddModalOpen(true)}
            onOpenScanModal={() => setRepoScanModalOpen(true)}
            onTestPing={(item) => setTestPingTarget(item)}
            onDeleteIntegration={handleDeleteIntegration}
            onRotateMetadata={handleRotateMetadata}
            onExportAuditLogs={handleExportAuditLogs}
          />
        )}
      </main>

      {/* MODALS */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AddIntegrationModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddIntegration}
        currentUserEmail={user?.email || 'alex@stackkeeper.dev'}
        currentUserName={user?.name || 'Alex Rivera'}
      />

      <TestPingModal
        integration={testPingTarget}
        onClose={() => setTestPingTarget(null)}
        onUpdateStatus={handleUpdateStatusAfterPing}
      />

      <RepoScanModal
        isOpen={repoScanModalOpen}
        onClose={() => setRepoScanModalOpen(false)}
        onCompleteScan={(repo) => showToast(`Scan completed for ${repo}!`, 'success')}
      />

    </div>
  );
}
