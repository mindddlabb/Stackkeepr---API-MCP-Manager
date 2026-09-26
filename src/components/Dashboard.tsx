import React, { useState, useEffect } from 'react';
import { ApiIntegration, AuditLog, UserProfile, IntegrationType } from '../types';
import { MOCK_ANALYTICS } from '../data/mockData';
import { 
  Server, 
  Zap, 
  Key, 
  Activity, 
  Terminal, 
  DollarSign, 
  ShieldAlert, 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Clock, 
  Sparkles, 
  Code2, 
  Download, 
  Lock, 
  Sliders, 
  FileText,
  ChevronRight,
  TrendingUp,
  Cpu,
  BarChart3
} from 'lucide-react';
import { ThirtyDayMetricsChart } from './ThirtyDayMetricsChart';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardProps {
  user: UserProfile;
  integrations: ApiIntegration[];
  auditLogs: AuditLog[];
  subTab: string;
  setSubTab: (subTab: string) => void;
  onOpenAddModal: () => void;
  onOpenScanModal: () => void;
  onTestPing: (integration: ApiIntegration) => void;
  onDeleteIntegration: (id: string) => void;
  onRotateMetadata: (id: string) => void;
  onExportAuditLogs: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  integrations,
  auditLogs,
  subTab,
  setSubTab,
  onOpenAddModal,
  onOpenScanModal,
  onTestPing,
  onDeleteIntegration,
  onRotateMetadata,
  onExportAuditLogs
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedEnvFilter, setSelectedEnvFilter] = useState<string>('all');
  const [liveMetrics, setLiveMetrics] = useState(MOCK_ANALYTICS);
  const [mcpInspectorItem, setMcpInspectorItem] = useState<ApiIntegration | null>(null);
  const [show30dChartInInventory, setShow30dChartInInventory] = useState<boolean>(false);

  // Real-time ticker effect to update request metrics live
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => {
        const last = prev[prev.length - 1];
        const newReq = Math.floor(Math.random() * 200) + 500;
        const newLat = Math.floor(Math.random() * 40) + 110;
        const updated = [...prev.slice(1), { ...last, time: new Date().toLocaleTimeString().slice(0, 5), requestsPerMin: newReq, latencyMs: newLat }];
        return updated;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Filtered integrations list
  const filteredIntegrations = integrations.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.endpoint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypeFilter === 'all' || item.type === selectedTypeFilter;
    const matchesEnv = selectedEnvFilter === 'all' || item.environment === selectedEnvFilter;
    return matchesSearch && matchesType && matchesEnv;
  });

  // Calculate high level dashboard metrics
  const totalCount = integrations.length;
  const mcpCount = integrations.filter(i => i.type === 'mcp_server').length;
  const totalMonthlyCost = integrations.reduce((sum, i) => sum + i.monthlyCost, 0);
  const healthyCount = integrations.filter(i => i.status === 'healthy').length;
  const healthPercent = totalCount ? Math.round((healthyCount / totalCount) * 100) : 100;
  
  // Impending key expirations (within 60 days)
  const expiringKeys = integrations.filter(i => {
    const daysUntil = (new Date(i.expiresAt).getTime() - Date.now()) / (1000 * 3600 * 24);
    return daysUntil <= 60;
  });

  // Recharts color palette
  const COLORS = ['#8b5cf6', '#10b981', '#06b6d4', '#f59e0b', '#f43f5e'];

  const typeData = [
    { name: 'REST APIs', value: integrations.filter(i => i.type === 'rest_api').length },
    { name: 'MCP Servers', value: integrations.filter(i => i.type === 'mcp_server').length },
    { name: 'GraphQL', value: integrations.filter(i => i.type === 'graphql').length },
    { name: 'Webhooks', value: integrations.filter(i => i.type === 'webhook').length },
  ];

  const costByProvider = integrations.reduce((acc: { name: string; cost: number }[], item) => {
    const existing = acc.find(a => a.name === item.provider);
    if (existing) {
      existing.cost += item.monthlyCost;
    } else {
      acc.push({ name: item.provider, cost: item.monthlyCost });
    }
    return acc;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans selection:bg-indigo-500/30">
      
      {/* TOP STATS BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 font-mono">
        
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Dependencies</span>
            <Server className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalCount}</div>
          <div className="text-[10px] text-zinc-500">{mcpCount} MCP • {totalCount - mcpCount} APIs</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-purple-500/30 bg-purple-950/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-purple-300">
            <span>MCP Servers</span>
            <Zap className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-200">{mcpCount}</div>
          <div className="text-[10px] text-purple-400/80">Active Agent Tools</div>
        </div>

        {/* 30-Day Volume Quick Access Card */}
        <div 
          onClick={() => {
            if (subTab === 'inventory') {
              setShow30dChartInInventory(true);
            } else {
              setSubTab('analytics');
            }
          }}
          className="p-4 rounded-2xl bg-zinc-900/90 border border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-950/10 cursor-pointer space-y-1 transition-all group"
          title="Click to view 30-Day Recharts Bar Chart"
          id="stat-30d-volume-card"
        >
          <div className="flex items-center justify-between text-xs text-indigo-300">
            <span>30-Day Volume</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-white flex items-baseline gap-1">
            <span>16.1M</span>
            <span className="text-[10px] text-emerald-400 font-bold">+19%</span>
          </div>
          <div className="text-[10px] text-indigo-300/80 flex items-center justify-between">
            <span>View Bar Chart</span>
            <span>→</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Monthly Cost</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">${totalMonthlyCost.toFixed(2)}</div>
          <div className="text-[10px] text-zinc-500">Projected spend/mo</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span>Keys Expiring</span>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300">{expiringKeys.length}</div>
          <div className="text-[10px] text-amber-400/80">Vault rotation due</div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>Health Score</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{healthPercent}%</div>
          <div className="text-[10px] text-emerald-400/80">{healthyCount} of {totalCount} Healthy</div>
        </div>

      </div>

      {/* DASHBOARD SEARCH & CONTROL TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/90 p-3 rounded-2xl border border-white/10 font-mono text-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search API, provider, endpoint..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-zinc-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Types (REST & MCP)</option>
            <option value="rest_api">REST APIs</option>
            <option value="mcp_server">MCP Servers</option>
            <option value="graphql">GraphQL</option>
            <option value="webhook">Webhooks</option>
          </select>

          <select
            value={selectedEnvFilter}
            onChange={(e) => setSelectedEnvFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-zinc-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Environments</option>
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="development">Development</option>
          </select>

          <button
            onClick={onOpenScanModal}
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5 transition-colors"
            id="dash-scan-repo-btn"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Scan Repo</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1.5 transition-colors shadow-md"
            id="dash-add-modal-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dependency</span>
          </button>
        </div>

      </div>

      {/* SUBTAB CONTENT PANELS */}
      
      {/* TAB 1: INVENTORY & ENDPOINTS */}
      {subTab === 'inventory' && (
        <div className="space-y-6">
          {/* 30-Day API Volume & Dependency Usage Summary Bar */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 via-zinc-900/90 to-cyan-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">30-Day API & Dependency Traffic: 16.1M Total Calls</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    +19.2% MoM
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] font-sans">
                  4.92M MCP Agent Invocations • 536.6k Daily Request Average • 99.94% Reliability
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShow30dChartInInventory(!show30dChartInInventory)}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors flex items-center space-x-1.5 border border-white/10"
                id="toggle-inventory-30d-chart-btn"
              >
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>{show30dChartInInventory ? 'Hide 30D Chart ▲' : 'Show 30D Recharts Chart ▼'}</span>
              </button>
              <button
                onClick={() => setSubTab('analytics')}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors flex items-center space-x-1"
                id="inventory-view-full-analytics-btn"
              >
                <span>Full Analytics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Inline Recharts 30-Day Chart if expanded */}
          {show30dChartInInventory && (
            <div className="pt-1 pb-2 transition-all">
              <ThirtyDayMetricsChart integrations={integrations} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Server className="w-5 h-5 text-indigo-400" />
              <span>Registered Dependencies ({filteredIntegrations.length})</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              Showing {filteredIntegrations.length} of {integrations.length} total entries
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-zinc-700 transition-all space-y-3 relative group"
              >
                {/* Type Badge & Status Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.type === 'mcp_server' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <Zap className="w-3 h-3 mr-1" /> MCP SERVER
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        <Server className="w-3 h-3 mr-1" /> {item.type.toUpperCase()}
                      </span>
                    )}

                    <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                      {item.environment}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  {item.status === 'healthy' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      ● Healthy ({item.latencyMs}ms)
                    </span>
                  )}
                  {item.status === 'degraded' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                      ⚠️ Degraded ({item.latencyMs}ms)
                    </span>
                  )}
                  {item.status === 'deprecated' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                      🚫 Sunset Deprecated
                    </span>
                  )}
                </div>

                {/* Title & Endpoint */}
                <div>
                  <h4 className="font-bold text-white text-base leading-snug">{item.name}</h4>
                  <p className="text-xs text-zinc-400 font-mono truncate mt-0.5" title={item.endpoint}>
                    {item.endpoint}
                  </p>
                </div>

                {/* Key metadata & Owner */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/5 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-zinc-400">
                    <span>Vault Location:</span>
                    <span className="text-emerald-400 truncate max-w-[150px]">{item.keyLocation}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Owner / Repos:</span>
                    <span className="text-zinc-200">{item.owner} ({item.repos.length} repos)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Monthly Cost:</span>
                    <span className="text-indigo-300 font-bold">${item.monthlyCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* MCP Tools Pill (if MCP) */}
                {item.type === 'mcp_server' && item.mcpTools && (
                  <div className="pt-1">
                    <button
                      onClick={() => setMcpInspectorItem(item)}
                      className="w-full text-left p-2 rounded-lg bg-purple-950/20 border border-purple-500/30 text-purple-300 font-mono text-[11px] hover:bg-purple-900/30 transition-colors flex items-center justify-between"
                    >
                      <span>🧩 {item.mcpTools.length} MCP Tools Exposed</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Action Row */}
                <div className="pt-2 flex items-center justify-between border-t border-white/10 font-mono text-xs">
                  <button
                    onClick={() => onTestPing(item)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-indigo-300 transition-colors flex items-center space-x-1"
                    id={`test-ping-${item.id}`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Test Ping</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onRotateMetadata(item.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      title="Rotate Metadata"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <button
                      onClick={() => onDeleteIntegration(item.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Remove Dependency"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: REAL-TIME & 30-DAY ANALYTICS */}
      {subTab === 'analytics' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span>30-Day Request Volume & Real-Time Performance Analytics</span>
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Recharts time-series data, dependency usage rates, live throughput, and provider spend
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Live Telemetry Active
            </span>
          </div>

          {/* Featured 30-Day Recharts Bar Chart & Dependency Usage */}
          <ThirtyDayMetricsChart integrations={integrations} />

          {/* 24-Hour Real-Time Window Section */}
          <div className="pt-2">
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center gap-2 text-zinc-400">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Real-Time 24-Hour Telemetry & Cost Breakdown</span>
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Latency & Requests Curve */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-white">Requests Throughput & Latency (ms)</span>
                <span className="text-cyan-400">24-Hour Metric Window</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={liveMetrics}>
                    <XAxis dataKey="time" stroke="#71717a" fontSize={11} />
                    <YAxis stroke="#71717a" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} 
                    />
                    <Line type="monotone" dataKey="requestsPerMin" name="Requests/min" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="latencyMs" name="Avg Latency (ms)" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Cost by Provider Bar Chart */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-white">Monthly Spend by API Provider ($)</span>
                <span className="text-emerald-400">Cost Breakdown</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costByProvider}>
                    <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                    <YAxis stroke="#71717a" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} 
                    />
                    <Bar dataKey="cost" name="Cost ($/mo)" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
          </div>

          {/* Type Distribution Pie */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-2">
              <h4 className="font-bold text-white text-base">Dependency Architecture Mix</h4>
              <p className="text-xs text-zinc-400">
                StackKeeper tracks both traditional REST/GraphQL web services and local/remote MCP agent protocol tools.
              </p>
            </div>

            <div className="h-44 w-full col-span-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MCP GOVERNANCE */}
      {subTab === 'mcp' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span>Model Context Protocol (MCP) Server Registry</span>
              </h3>
              <p className="text-xs text-zinc-400 font-mono">Governance & tool scope permissions for connected AI agent servers</p>
            </div>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs shadow-lg transition-colors"
            >
              + Register New MCP Server
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.filter(i => i.type === 'mcp_server').map((mcp) => (
              <div key={mcp.id} className="p-6 rounded-2xl bg-zinc-900/90 border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <h4 className="font-bold text-white text-lg">{mcp.name}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {mcp.transport} transport
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-mono bg-zinc-950 p-2.5 rounded-xl border border-white/5 truncate">
                  {mcp.endpoint}
                </p>

                {mcp.mcpTools && (
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-purple-300 font-semibold">Exposed Tools & Scopes:</div>
                    <div className="space-y-1.5">
                      {mcp.mcpTools.map((t, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-between font-mono text-xs">
                          <div>
                            <span className="font-bold text-white">{t.name}</span>
                            <span className="text-[10px] text-zinc-500 ml-2">{t.description}</span>
                          </div>
                          <span className="text-[10px] bg-purple-950/60 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded">
                            {t.accessScope}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-white/10">
                  <span>Owner: {mcp.owner}</span>
                  <button
                    onClick={() => onTestPing(mcp)}
                    className="text-purple-300 hover:text-purple-100 underline font-semibold"
                  >
                    Test MCP Handshake →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CREDENTIAL VAULT */}
      {subTab === 'vault' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Key className="w-5 h-5 text-emerald-400" />
                <span>Zero-Storage Credential Metadata Vault</span>
              </h3>
              <p className="text-xs text-zinc-400 font-mono">Track key locations, expiration schedules, and rotation owners without storing secrets</p>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl overflow-hidden font-mono text-xs">
            <div className="p-4 border-b border-white/10 grid grid-cols-6 font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
              <div className="col-span-2">Dependency / Provider</div>
              <div>Secret Location</div>
              <div>Last Rotated</div>
              <div>Expiration Date</div>
              <div className="text-right">Rotation Owner</div>
            </div>

            <div className="divide-y divide-white/5">
              {integrations.map((item) => (
                <div key={item.id} className="p-4 grid grid-cols-6 items-center hover:bg-zinc-800/40 transition-colors">
                  <div className="col-span-2">
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-zinc-500">{item.provider}</div>
                  </div>
                  <div className="text-emerald-400 font-semibold">{item.keyLocation}</div>
                  <div className="text-zinc-400">{item.lastRotated}</div>
                  <div className="text-amber-300 font-bold">{item.expiresAt}</div>
                  <div className="text-right flex items-center justify-end space-x-2">
                    <span className="text-zinc-300">{item.owner}</span>
                    <button
                      onClick={() => onRotateMetadata(item.id)}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-indigo-600 text-zinc-200 text-[10px] transition-colors"
                    >
                      Rotate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REPO SCANNER */}
      {subTab === 'scanner' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Terminal className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Repository AST Auto-Scanner</h3>
                  <p className="text-xs text-zinc-400 font-mono">Scan GitHub/GitLab codebases for hidden credentials and MCP files</p>
                </div>
              </div>
              <button
                onClick={onOpenScanModal}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold font-mono text-xs shadow-lg transition-colors"
                id="launch-scanner-tab-btn"
              >
                Launch Repository Scanner
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              StackKeeper AST scanners inspect code imports, environment variables, and configuration files (`mcp.json`, `claude_desktop_config.json`) to identify untracked external APIs and security risks.
            </p>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT TRAIL */}
      {subTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Audit Logs & Security Governance</span>
              </h3>
              <p className="text-xs text-zinc-400 font-mono">Immutable activity history for workspace integrations</p>
            </div>
            <button
              onClick={onExportAuditLogs}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs border border-white/10 flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Audit Log</span>
            </button>
          </div>

          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl overflow-hidden font-mono text-xs">
            <div className="p-4 border-b border-white/10 grid grid-cols-5 font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
              <div>Timestamp</div>
              <div>User</div>
              <div>Action</div>
              <div>Target</div>
              <div className="text-right">Status</div>
            </div>

            <div className="divide-y divide-white/5">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 grid grid-cols-5 items-center hover:bg-zinc-800/40 transition-colors">
                  <div className="text-zinc-500">{log.timestamp}</div>
                  <div className="text-white font-semibold">{log.user}</div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {log.action}
                    </span>
                  </div>
                  <div className="text-zinc-300 truncate">{log.targetName}</div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold">{log.status.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MCP INSPECTOR MODAL POPUP */}
      {mcpInspectorItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-purple-500/40 rounded-2xl p-6 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-base">{mcpInspectorItem.name} Tools</h3>
              </div>
              <button onClick={() => setMcpInspectorItem(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2">
              <p className="text-zinc-400">Exposed MCP Tool Declarations:</p>
              {mcpInspectorItem.mcpTools?.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-900 border border-white/10 space-y-1">
                  <div className="flex justify-between font-bold text-purple-300">
                    <span>tool: {t.name}</span>
                    <span className="text-[10px] bg-purple-950 px-2 py-0.5 rounded text-purple-200">{t.accessScope}</span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">{t.description}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setMcpInspectorItem(null)} className="w-full py-2 bg-zinc-900 text-white rounded-xl">Close Inspector</button>
          </div>
        </div>
      )}

    </div>
  );
};
