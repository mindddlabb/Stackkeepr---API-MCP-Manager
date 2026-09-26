import React, { useState } from 'react';
import { 
  Server, 
  Key, 
  DollarSign, 
  Zap, 
  ShieldAlert, 
  Users, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  Terminal, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Code2, 
  Search,
  ExternalLink,
  Cpu,
  Layers,
  HelpCircle,
  Shield,
  Wifi,
  RefreshCw,
  Box,
  GitBranch,
  Database
} from 'lucide-react';

interface LandingPageProps {
  onOpenDashboard: () => void;
  onOpenAuth: () => void;
  onOpenScanDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenDashboard,
  onOpenAuth,
  onOpenScanDemo
}) => {
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [interactiveTab, setInteractiveTab] = useState<'apis' | 'mcps' | 'scanner'>('apis');

  const faqs = [
    {
      q: "Does StackKeeper store my actual API keys?",
      a: "No. We track metadata — where a credential lives (e.g. 1Password vault, AWS SSM, .env.production), who owns it, and when it expires — never the secret key itself. Your keys stay securely inside your existing secret vaults."
    },
    {
      q: "Does this work with MCP (Model Context Protocol) servers specifically, or just REST APIs?",
      a: "Both! StackKeeper treats MCP servers as first-class citizens alongside traditional REST and GraphQL APIs. We track MCP stdio/SSE transports, tools exposed, schema versions, and agent connection statuses."
    },
    {
      q: "Can it auto-detect what my code is already using?",
      a: "Yes — connect your GitHub or GitLab repositories, and StackKeeper automatically scans AST imports, SDK instantiations, and configuration files (like mcp.json or claude_desktop_config.json) to build your inventory."
    },
    {
      q: "What if I have custom integrations StackKeeper can't auto-detect?",
      a: "You can manually log any internal service, webhook, or custom API in seconds. Most engineering teams end up with a mix of auto-detected and manually logged entries."
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-white selection:text-black">
      
      {/* HERO SECTION (Suga.app exact style) */}
      <section className="relative pt-16 pb-24 md:pt-28 md:pb-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 suga-dot-bg">
        <div className="max-w-4xl space-y-8">
          
          {/* Main Headline in 84px Hierarchy */}
          <h1 className="text-hierarchy-84 text-white font-medium tracking-tight">
            Governance for agents, APIs, and platforms.
          </h1>

          {/* Subheadline in 18px Hierarchy */}
          <p className="text-hierarchy-18 text-zinc-400 font-normal leading-relaxed max-w-2xl">
            The best way to track your apps, APIs, and MCP servers. Run, secure, and monitor every integration at scale.
          </p>

          {/* CTAs matching suga.app buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenDashboard}
              className="bg-white text-black font-medium hover:bg-zinc-200 px-5 py-2.5 rounded-lg text-hierarchy-14 transition-all flex items-center space-x-1.5"
              id="hero-get-started-btn"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={onOpenScanDemo}
              className="bg-zinc-950/80 border border-zinc-800 text-zinc-300 font-mono text-hierarchy-14 px-4 py-2.5 rounded-lg hover:border-zinc-700 transition-all flex items-center space-x-2"
              id="hero-read-docs-btn"
            >
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span>Read the docs</span>
            </button>
          </div>

        </div>

        {/* HERO INTERACTIVE PREVIEW CANVAS (Suga.app dark node style) */}
        <div className="mt-16 relative mx-auto max-w-6xl rounded-xl border border-white/10 bg-zinc-950/90 shadow-2xl p-4 sm:p-6 backdrop-blur-xl suga-grid-bg">
          {/* Top Mac bar & switcher */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/10 gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <span className="ml-2 font-mono text-xs text-zinc-500 hidden sm:inline-block">stackkeeper.dev/live-node-mesh</span>
            </div>

            <div className="flex items-center space-x-1 bg-black p-1 rounded-lg border border-white/10 font-mono text-xs">
              <button 
                onClick={() => setInteractiveTab('apis')}
                className={`px-3 py-1 rounded transition-all ${interactiveTab === 'apis' ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                APIs (3 Active)
              </button>
              <button 
                onClick={() => setInteractiveTab('mcps')}
                className={`px-3 py-1 rounded transition-all ${interactiveTab === 'mcps' ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                MCP Servers (2 Connected)
              </button>
              <button 
                onClick={() => setInteractiveTab('scanner')}
                className={`px-3 py-1 rounded transition-all ${interactiveTab === 'scanner' ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Repo Scanner
              </button>
            </div>
          </div>

          {/* Interactive Hero Preview Content */}
          <div className="pt-4 font-mono text-xs">
            {interactiveTab === 'apis' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="font-semibold text-white">Stripe Billing API</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ● Healthy (112ms)
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500">Vault: AWS Secrets Manager</div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                      <span className="text-zinc-500">Monthly Spend:</span>
                      <span className="text-emerald-400 font-bold">$142.50 / mo</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="font-semibold text-white">OpenAI GPT-4o</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ● Healthy (340ms)
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500">Vault: 1Password Team</div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                      <span className="text-zinc-500">Monthly Spend:</span>
                      <span className="text-white font-bold">$389.20 / mo</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-rose-500/30 space-y-2">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="font-semibold text-rose-300">OpenWeather Legacy</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        ⚠️ Sunset Deprecated
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500">Vault: Untracked .env</div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                      <span className="text-rose-400">Action Needed:</span>
                      <span className="text-amber-300 font-bold">Migrate to v3.0</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900 border border-white/10 flex flex-wrap items-center justify-between text-zinc-300">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Real-time Health Check: 8 integrations monitored across 3 production repositories.</span>
                  </div>
                  <button 
                    onClick={onOpenDashboard} 
                    className="text-xs text-white hover:underline font-semibold mt-1 sm:mt-0"
                  >
                    Open Live Dashboard →
                  </button>
                </div>
              </div>
            )}

            {interactiveTab === 'mcps' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="font-bold text-white text-sm">PostgreSQL MCP Server</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300">
                        stdio transport
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] font-sans">Exposes 3 SQL safety tools to Claude Desktop & Agent CLI.</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded text-[10px] border border-white/5">tool: query_db</span>
                      <span className="bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded text-[10px] border border-white/5">tool: get_table_schema</span>
                      <span className="bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded text-[10px] border border-white/5">scope: read-only</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white text-sm">Brave Search MCP</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        SSE (91% Quota)
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] font-sans">Outbound web queries for autonomous researcher agent.</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded text-[10px] border border-white/5">tool: web_search</span>
                      <span className="bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded text-[10px] border border-white/5">tool: local_search</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {interactiveTab === 'scanner' && (
              <div className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Terminal className="w-4 h-4" />
                  <span>$ stackkeeper scan --repo github.com/acme/ai-agent-core</span>
                </div>
                <div className="text-zinc-400 pl-4 space-y-1 text-[11px]">
                  <p>✔ Scanned 142 files in 0.42 seconds.</p>
                  <p className="text-zinc-200">➜ Discovered 2 MCP config files (mcp.json, claude_desktop_config.json)</p>
                  <p className="text-amber-300">⚠️ Found 1 potential unrevoked API key in .env.local.backup (Line 14)</p>
                  <p className="text-emerald-400">✔ Inventory synchronized with StackKeeper Vault.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: PUSH TO SCAN WORKFLOW STATEMENT (Suga.app Screenshot 2 Exact Style) */}
      <section id="workflow" className="py-24 border-t border-white/10 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Dual-color headline in 56px scale */}
          <div className="max-w-5xl space-y-4">
            <h2 className="text-hierarchy-56 tracking-tight">
              <span className="text-white font-semibold">Push to scan. That's the whole workflow. </span>
              <span className="text-zinc-500 font-normal">Connect a repository. Every push builds your code into running, production-grade applications with fully tracked API keys and MCP tools.</span>
            </h2>
          </div>

          {/* Connected Node Visual Box */}
          <div className="mt-16 rounded-xl border border-white/10 bg-zinc-950 p-6 suga-grid-bg">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-zinc-500">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-white font-medium">
                  <Box className="w-4 h-4 text-white" />
                  <span>acme-corp</span>
                </div>
                <span>/</span>
                <span className="text-zinc-300">app</span>
                <span>/</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">production</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-400 font-semibold">Live Syncing</span>
              </div>
            </div>

            {/* Canvas Node Grid */}
            <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
              <div className="p-4 rounded-lg bg-black border border-white/10 space-y-3">
                <div className="flex items-center space-x-2 text-white font-semibold">
                  <Box className="w-4 h-4 text-emerald-400" />
                  <span>frontend</span>
                </div>
                <div className="text-zinc-500 text-[11px]">React + Vite SPA</div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                  <span className="text-zinc-500 font-sans">Keys: 2 public</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black border border-white/10 space-y-3">
                <div className="flex items-center space-x-2 text-white font-semibold">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>worker</span>
                </div>
                <div className="text-zinc-500 text-[11px]">Node.js Express Server</div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                  <span className="text-zinc-500 font-sans">Vault: AWS SSM</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black border border-white/10 space-y-3">
                <div className="flex items-center space-x-2 text-white font-semibold">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>postgres-mcp</span>
                </div>
                <div className="text-zinc-500 text-[11px]">stdio transport</div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                  <span className="text-zinc-500 font-sans">3 tools exposed</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black border border-white/10 space-y-3">
                <div className="flex items-center space-x-2 text-white font-semibold">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>payment-gateway</span>
                </div>
                <div className="text-zinc-500 text-[11px]">Stripe SDK v14</div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                  <span className="text-zinc-500 font-sans">Status: Healthy</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: MONITOR FREQUENTLY, WITHOUT THE STRESS (Suga.app Screenshot 3 Exact Style) */}
      <section className="py-24 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Title in 56px scale */}
            <div className="space-y-4">
              <h2 className="text-hierarchy-56 text-white tracking-tight">
                Monitor frequently, without the stress.
              </h2>
            </div>

            {/* Subtitle in 18px scale */}
            <div>
              <p className="text-hierarchy-18 text-zinc-400 font-normal leading-relaxed">
                Mistakes happen, so we made it easy to fix them. Health checks catch broken deploys and expired API keys before your app goes live. Draft credential changes first, and if something goes wrong instantly rollback.
              </p>
            </div>

          </div>

          {/* Deployment History & Node Grid Mockup */}
          <div className="mt-14 rounded-xl border border-white/10 bg-zinc-950 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 suga-grid-bg">
            {/* Left: Deployment History */}
            <div className="lg:col-span-1 border border-white/10 rounded-lg p-4 bg-black font-mono text-xs space-y-4">
              <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/10">
                <span className="font-semibold text-white">Deployment History</span>
                <span>4 entries</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-zinc-900 border border-emerald-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">✓ active</span>
                    <span className="text-zinc-500 text-[10px]">9 minutes ago</span>
                  </div>
                  <div className="text-white font-semibold italic">bump frontend to v2.1</div>
                  <div className="text-zinc-400 text-[10px]">4s • 6 services monitored</div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950 border border-white/5 space-y-1.5 opacity-80">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400">✓ completed</span>
                    <span className="text-zinc-500 text-[10px]">17 minutes ago</span>
                  </div>
                  <div className="text-zinc-300 font-medium italic">add redis session cache</div>
                  <div className="text-zinc-500 text-[10px]">4s • 6 services</div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950 border border-white/5 space-y-1.5 opacity-60">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400">✓ completed</span>
                    <span className="text-zinc-500 text-[10px]">24 minutes ago</span>
                  </div>
                  <div className="text-zinc-300 font-medium italic">add websocket server</div>
                  <div className="text-zinc-500 text-[10px]">3s • 5 services</div>
                </div>
              </div>
            </div>

            {/* Right: Service Nodes Map */}
            <div className="lg:col-span-2 border border-white/10 rounded-lg p-6 bg-black grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-lg bg-zinc-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">frontend</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-zinc-500 text-[11px] font-sans">Client SPA bundle</p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">worker</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-zinc-500 text-[11px] font-sans">Background agent task runner</p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">postgres</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-zinc-500 text-[11px] font-sans">Database 1GB Storage</p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">payment-gateway</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-zinc-500 text-[11px] font-sans">Stripe API proxy</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: DESIGNED TO SCALE (Suga.app Screenshot 4 Exact Style) */}
      <section className="py-24 border-t border-white/10 bg-black text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-hierarchy-56 text-white tracking-tight">
            Designed to scale.
          </h2>
          <p className="text-hierarchy-18 text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Grow your application as your requirements evolve. When you have viral moments or agent traffic spikes, our load-based tracking handles the load seamlessly.
          </p>

          {/* Minimalist Bar Graph Visualization */}
          <div className="pt-12 flex items-end justify-center gap-2 sm:gap-3 h-48 max-w-3xl mx-auto">
            {[35, 45, 60, 80, 95, 100, 95, 85, 75, 60, 50, 40, 35, 30, 28, 25, 28, 32, 40, 48, 45].map((height, i) => (
              <div 
                key={i} 
                className="w-3 sm:w-4 bg-gradient-to-t from-zinc-900 via-zinc-700 to-zinc-300 rounded-t-sm transition-all hover:bg-white"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: DEFENSE IN DEPTH (Suga.app Screenshot 5 Exact Style) */}
      <section id="features" className="py-24 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-4">
            <h2 className="text-hierarchy-56 text-white tracking-tight">
              Defense in depth.
            </h2>
            <p className="text-hierarchy-18 text-zinc-400 font-normal leading-relaxed">
              With StackKeeper every project is managed with security and key privacy as a first principle.
            </p>
          </div>

          {/* 6-Grid Minimal Hairline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            <div className="p-8 rounded-xl border border-white/10 bg-black space-y-4 hover:border-white/30 transition-all">
              <div className="p-2.5 rounded-lg bg-zinc-900 w-fit text-white">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-hierarchy-16 font-semibold text-white">Auto Key Expiry Alerts</h3>
              <p className="text-hierarchy-14 text-zinc-400 leading-relaxed font-sans">
                Certificates and secret tokens monitored with 90-day automatic rotation reminders.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-black space-y-4 hover:border-white/30 transition-all">
              <div className="p-2.5 rounded-lg bg-zinc-900 w-fit text-white">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-hierarchy-16 font-semibold text-white">Zero-Storage Vault</h3>
              <p className="text-hierarchy-14 text-zinc-400 leading-relaxed font-sans">
                Secret keys remain in your 1Password or AWS SSM vault. We only store location metadata.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-black space-y-4 hover:border-white/30 transition-all">
              <div className="p-2.5 rounded-lg bg-zinc-900 w-fit text-white">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-hierarchy-16 font-semibold text-white">MCP Tool Isolation</h3>
              <p className="text-hierarchy-14 text-zinc-400 leading-relaxed font-sans">
                Every agent tool permission runs in isolated scopes. Nothing crosses by accident.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-black space-y-4 hover:border-white/30 transition-all">
              <div className="p-2.5 rounded-lg bg-zinc-900 w-fit text-white">
                <Wifi className="w-5 h-5" />
              </div>
              <h3 className="text-hierarchy-16 font-semibold text-white">AST Repo Scanner</h3>
              <p className="text-hierarchy-14 text-zinc-400 leading-relaxed font-sans">
                Automatically scans code repositories for unrevoked secrets and forgotten config files.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-black space-y-4 hover:border-white/30 transition-all">
              <div className="p-2.5 rounded-lg bg-zinc-900 w-fit text-white">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-hierarchy-16 font-semibold text-white">Encrypted at rest</h3>
              <p className="text-hierarchy-14 text-zinc-400 leading-relaxed font-sans">
                Audit logs and metadata encrypted using AES-256 standard with strict key management.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-black space-y-4 hover:border-white/30 transition-all">
              <div className="p-2.5 rounded-lg bg-zinc-900 w-fit text-white">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-hierarchy-16 font-semibold text-white">Zero-downtime health pings</h3>
              <p className="text-hierarchy-14 text-zinc-400 leading-relaxed font-sans">
                Real-time API response checks verify endpoints are online without impacting production.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 6: BUILD WITH TOOLS YOU LOVE (Suga.app Screenshot 6 Exact Style) */}
      <section className="py-20 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="text-hierarchy-40 text-white tracking-tight font-medium max-w-sm">
              Build with the tools you already love.
            </h2>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-zinc-500 font-mono text-sm">
              <span className="hover:text-white transition-colors">Astro</span>
              <span className="hover:text-white transition-colors">Django</span>
              <span className="hover:text-white transition-colors">Fastify</span>
              <span className="hover:text-white transition-colors">Laravel</span>
              <span className="hover:text-white transition-colors">Next.js</span>
              <span className="hover:text-white transition-colors">Postgres</span>
              <span className="hover:text-white transition-colors">React</span>
              <span className="hover:text-white transition-colors">MySQL</span>
              <span className="hover:text-white transition-colors">Claude</span>
              <span className="hover:text-white transition-colors">OpenAI</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CHANGELOG TIMELINE (Suga.app Screenshot 7 Exact Style) */}
      <section id="changelog" className="py-24 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex items-center justify-between">
            <h2 className="text-hierarchy-40 text-white tracking-tight">
              Changelog
            </h2>
            <button 
              onClick={onOpenDashboard}
              className="px-4 py-2 rounded-lg border border-white/10 bg-zinc-950 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Timeline Line with dots */}
          <div className="relative pt-6">
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/10"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              
              <div className="space-y-4">
                <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-black"></div>
                <h3 className="text-hierarchy-16 font-semibold text-white">An MCP server for StackKeeper</h3>
                <p className="text-hierarchy-14 text-zinc-400 font-sans leading-relaxed">
                  StackKeeper now has its own MCP server. Connect an agent like Claude Code or Cursor to your inventory.
                </p>
                <div className="text-[11px] font-mono text-zinc-500">AUG 4, 2026</div>
              </div>

              <div className="space-y-4">
                <div className="w-3 h-3 rounded-full bg-amber-400 ring-4 ring-black"></div>
                <h3 className="text-hierarchy-16 font-semibold text-white">Automated AST Repo Scanner</h3>
                <p className="text-hierarchy-14 text-zinc-400 font-sans leading-relaxed">
                  Automatically parses code imports and config files to keep key inventory accurate.
                </p>
                <div className="text-[11px] font-mono text-zinc-500">JUL 24, 2026</div>
              </div>

              <div className="space-y-4">
                <div className="w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-black"></div>
                <h3 className="text-hierarchy-16 font-semibold text-white">Adding your first service</h3>
                <p className="text-hierarchy-14 text-zinc-400 font-sans leading-relaxed">
                  A new workspace opens to a clean canvas, with fast modal prompts to log your credentials.
                </p>
                <div className="text-[11px] font-mono text-zinc-500">JUL 23, 2026</div>
              </div>

              <div className="space-y-4">
                <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-black"></div>
                <h3 className="text-hierarchy-16 font-semibold text-white">Plan usage on the dashboard</h3>
                <p className="text-hierarchy-14 text-zinc-400 font-sans leading-relaxed">
                  There's now a usage card next to your projects on the dashboard so you can check limits at a glance.
                </p>
                <div className="text-[11px] font-mono text-zinc-500">JUL 22, 2026</div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-hierarchy-56 text-white tracking-tight">Start free. Scale with your team.</h2>
            
            {/* Billing cycle toggle */}
            <div className="pt-4 flex items-center justify-center">
              <div className="bg-zinc-950 p-1 rounded-lg border border-white/10 inline-flex items-center text-xs font-mono">
                <button
                  onClick={() => setPricingCycle('monthly')}
                  className={`px-4 py-2 rounded transition-all ${pricingCycle === 'monthly' ? 'bg-white text-black font-semibold' : 'text-zinc-400'}`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setPricingCycle('yearly')}
                  className={`px-4 py-2 rounded transition-all flex items-center space-x-1 ${pricingCycle === 'yearly' ? 'bg-white text-black font-semibold' : 'text-zinc-400'}`}
                >
                  <span>Yearly Billing</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded ml-1">Save 20%</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Free Tier */}
            <div className="p-8 rounded-xl bg-black border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-hierarchy-40 font-bold text-white">Free</h3>
                <p className="text-hierarchy-14 text-zinc-400">For solo developers getting started with key tracking.</p>
                <div className="text-hierarchy-40 font-bold text-white">$0</div>
                <ul className="space-y-3 pt-4 border-t border-white/10 text-hierarchy-14 font-mono text-zinc-300">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Up to 10 APIs & MCPs tracked</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>1 repo auto-scan</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Expiry & cost alerts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>1 team seat</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenAuth}
                className="w-full py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-hierarchy-14 font-medium transition-colors"
                id="pricing-free-cta"
              >
                Start Free →
              </button>
            </div>

            {/* Pro Tier (Featured) */}
            <div className="p-8 rounded-xl bg-black border-2 border-white flex flex-col justify-between space-y-6 relative shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-hierarchy-40 font-bold text-white">Pro</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-black font-semibold text-[10px] font-mono uppercase">Most Popular</span>
                </div>
                <p className="text-hierarchy-14 text-zinc-400">For growing developers and independent agent builders.</p>
                <div className="text-hierarchy-40 font-bold text-white">
                  {pricingCycle === 'monthly' ? '$12' : '$9.60'} <span className="text-xs font-normal text-zinc-400">/ mo</span>
                </div>
                <ul className="space-y-3 pt-4 border-t border-white/10 text-hierarchy-14 font-mono text-zinc-200">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span><strong>Unlimited</strong> APIs & MCPs tracked</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>10 repos auto-scan</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Expiry & cost alerts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Audit logs</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenAuth}
                className="w-full py-3 rounded-lg bg-white text-black font-semibold text-hierarchy-14 hover:bg-zinc-200 transition-all"
                id="pricing-pro-cta"
              >
                Upgrade to Pro →
              </button>
            </div>

            {/* Team Tier */}
            <div className="p-8 rounded-xl bg-black border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-hierarchy-40 font-bold text-white">Team</h3>
                <p className="text-hierarchy-14 text-zinc-400">For engineering organizations & agent fleets.</p>
                <div className="text-hierarchy-40 font-bold text-white">
                  {pricingCycle === 'monthly' ? '$9' : '$7.20'} <span className="text-xs font-normal text-zinc-400">/ user / mo</span>
                </div>
                <ul className="space-y-3 pt-4 border-t border-white/10 text-hierarchy-14 font-mono text-zinc-300">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span><strong>Unlimited</strong> APIs & MCPs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span><strong>Unlimited</strong> repos scan</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Audit logs & Webhooks</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>SSO & Granular permissions</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenAuth}
                className="w-full py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-hierarchy-14 font-medium transition-colors"
                id="pricing-team-cta"
              >
                Get Team Plan →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-hierarchy-40 font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl bg-black border border-white/10 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-white font-medium text-hierarchy-16 hover:bg-zinc-900/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openFaq === idx ? 'rotate-180 text-white' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-hierarchy-14 text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 border-t border-white/10 bg-black text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-hierarchy-56 text-white font-medium leading-tight">
            Ready to track every integration?
          </h2>
          <div className="pt-2">
            <button
              onClick={onOpenDashboard}
              className="bg-white text-black font-semibold text-hierarchy-14 px-8 py-3.5 rounded-lg hover:bg-zinc-200 transition-all inline-flex items-center space-x-2"
              id="footer-start-free-btn"
            >
              <span>Start free →</span>
            </button>
          </div>
          <div className="text-hierarchy-14 font-mono text-zinc-500 pt-8">
            © 2026 StackKeeper Inc. • Every API. Every MCP. One dashboard.
          </div>
        </div>
      </section>

    </div>
  );
};

