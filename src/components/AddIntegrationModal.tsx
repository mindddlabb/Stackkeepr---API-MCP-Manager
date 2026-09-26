import React, { useState } from 'react';
import { ApiIntegration, IntegrationType, TransportType, McpTool } from '../types';
import { Server, Zap, Key, Plus, X, Sparkles, Code2, Globe } from 'lucide-react';

interface AddIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (integration: ApiIntegration) => void;
  currentUserEmail: string;
  currentUserName: string;
}

export const AddIntegrationModal: React.FC<AddIntegrationModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  currentUserEmail,
  currentUserName
}) => {
  const [type, setType] = useState<IntegrationType>('rest_api');
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [transport, setTransport] = useState<TransportType>('api_key');
  const [keyLocation, setKeyLocation] = useState('AWS Secrets Manager');
  const [environment, setEnvironment] = useState<'production' | 'staging' | 'development'>('production');
  const [monthlyCost, setMonthlyCost] = useState('0');
  const [repos, setRepos] = useState('acme-web-app');
  const [mcpToolsInput, setMcpToolsInput] = useState('query_db, get_schema');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reposList = repos.split(',').map(r => r.trim()).filter(Boolean);

    let tools: McpTool[] = [];
    if (type === 'mcp_server') {
      tools = mcpToolsInput.split(',').map((t, idx) => ({
        name: t.trim() || `tool_${idx + 1}`,
        description: `Exposed MCP capability ${t.trim()}`,
        parametersCount: 2,
        accessScope: 'read-only'
      }));
    }

    const newIntegration: ApiIntegration = {
      id: `int-${Date.now()}`,
      name: name || (type === 'mcp_server' ? 'Custom MCP Server' : 'New REST API'),
      provider: provider || 'Third-Party',
      type: type,
      endpoint: endpoint || (type === 'mcp_server' ? 'npx -y @modelcontextprotocol/server-custom' : 'https://api.example.com/v1'),
      transport: type === 'mcp_server' ? 'stdio' : transport,
      status: 'healthy',
      keyLocation: keyLocation || 'Environment Variable (.env)',
      lastRotated: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: currentUserName || 'Alex Rivera',
      ownerEmail: currentUserEmail || 'alex@stackkeeper.dev',
      repos: reposList.length ? reposList : ['main-repo'],
      environment: environment,
      monthlyCost: parseFloat(monthlyCost) || 0,
      freeTierLimit: 'Standard Tier',
      currentUsagePercent: 10,
      rateLimitRpm: 1000,
      latencyMs: 85,
      lastHealthCheck: 'Just now',
      mcpServerVersion: type === 'mcp_server' ? 'v1.0.0' : undefined,
      mcpTools: type === 'mcp_server' ? tools : undefined,
      notes: notes || 'Manually logged integration metadata.'
    };

    onAdd(newIntegration);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Add API or MCP Dependency</h3>
              <p className="text-[11px] font-mono text-zinc-400">Register metadata to track in StackKeeper</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 font-mono text-xs">
          
          {/* Dependency Type Switcher */}
          <div>
            <label className="block text-zinc-400 text-[11px] mb-1.5 font-semibold">Dependency Category</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => { setType('rest_api'); setTransport('api_key'); }}
                className={`py-2 px-1 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                  type === 'rest_api' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold' : 'bg-zinc-900 border-white/10 text-zinc-400'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span className="text-[10px]">REST API</span>
              </button>

              <button
                type="button"
                onClick={() => { setType('mcp_server'); setTransport('stdio'); }}
                className={`py-2 px-1 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                  type === 'mcp_server' ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-bold' : 'bg-zinc-900 border-white/10 text-zinc-400'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="text-[10px]">MCP Server</span>
              </button>

              <button
                type="button"
                onClick={() => { setType('graphql'); setTransport('http_bearer'); }}
                className={`py-2 px-1 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                  type === 'graphql' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-zinc-900 border-white/10 text-zinc-400'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="text-[10px]">GraphQL</span>
              </button>

              <button
                type="button"
                onClick={() => { setType('webhook'); setTransport('http_bearer'); }}
                className={`py-2 px-1 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                  type === 'webhook' ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-bold' : 'bg-zinc-900 border-white/10 text-zinc-400'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px]">Webhook</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Integration Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === 'mcp_server' ? 'e.g. Postgres MCP Server' : 'e.g. Stripe Payments'}
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Provider *</label>
              <input
                type="text"
                required
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Stripe, Self-Hosted, Anthropic"
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-[11px] mb-1">
              {type === 'mcp_server' ? 'MCP Command / SSE Endpoint' : 'Base Endpoint URL'}
            </label>
            <input
              type="text"
              required
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder={type === 'mcp_server' ? 'npx -y @modelcontextprotocol/server-...' : 'https://api.provider.com/v1'}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Credential Location (Metadata)</label>
              <select
                value={keyLocation}
                onChange={(e) => setKeyLocation(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="AWS Secrets Manager">AWS Secrets Manager</option>
                <option value="1Password Vault">1Password Team Vault</option>
                <option value="Doppler Secret Manager">Doppler Secret Manager</option>
                <option value="Vercel Environment Variables">Vercel Environment Variables</option>
                <option value="Local .env.production">Local .env.production</option>
                <option value="HashiCorp Vault">HashiCorp Vault</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Target Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Monthly Cost ($/mo)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={monthlyCost}
                onChange={(e) => setMonthlyCost(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Associated Repositories</label>
              <input
                type="text"
                value={repos}
                onChange={(e) => setRepos(e.target.value)}
                placeholder="repo-1, repo-2"
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {type === 'mcp_server' && (
            <div>
              <label className="block text-purple-300 text-[11px] mb-1">Exposed MCP Tools (comma-separated)</label>
              <input
                type="text"
                value={mcpToolsInput}
                onChange={(e) => setMcpToolsInput(e.target.value)}
                placeholder="query_db, get_table_schema, explain_query"
                className="w-full px-3 py-2 bg-purple-950/20 border border-purple-500/30 rounded-xl text-purple-200 placeholder-purple-600 focus:outline-none focus:border-purple-400"
              />
            </div>
          )}

          <div>
            <label className="block text-zinc-400 text-[11px] mb-1">Notes / Purpose</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Primary subscription payment gateway used in checkout service."
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition-colors flex items-center space-x-1.5"
              id="submit-add-integration-btn"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save Dependency</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
