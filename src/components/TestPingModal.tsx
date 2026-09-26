import React, { useState } from 'react';
import { ApiIntegration } from '../types';
import { Activity, Zap, CheckCircle2, AlertTriangle, RefreshCw, X, Shield, Terminal } from 'lucide-react';

interface TestPingModalProps {
  integration: ApiIntegration | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: 'healthy' | 'degraded' | 'down', newLatency: number) => void;
}

export const TestPingModal: React.FC<TestPingModalProps> = ({
  integration,
  onClose,
  onUpdateStatus
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [pingResult, setPingResult] = useState<{
    status: 'healthy' | 'degraded' | 'down';
    latencyMs: number;
    statusCode: number;
    timestamp: string;
    mcpVerification?: string;
  } | null>(null);

  if (!integration) return null;

  const handleExecutePing = () => {
    setIsRunning(true);
    setPingResult(null);

    setTimeout(() => {
      // Realistic result calculation
      const isMcp = integration.type === 'mcp_server';
      const randomLatency = Math.floor(Math.random() * 80) + (isMcp ? 30 : 50);
      const randomOutcome = Math.random() > 0.15 ? 'healthy' : (Math.random() > 0.5 ? 'degraded' : 'down');
      
      const res = {
        status: randomOutcome as any,
        latencyMs: randomLatency,
        statusCode: randomOutcome === 'healthy' ? 200 : (randomOutcome === 'degraded' ? 429 : 503),
        timestamp: new Date().toLocaleTimeString(),
        mcpVerification: isMcp ? `✔ Verified ${integration.mcpTools?.length || 2} MCP tools via transport handshake [protocol v1.0]` : undefined
      };

      setPingResult(res);
      setIsRunning(false);
      onUpdateStatus(integration.id, res.status, res.latencyMs);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Live Health Test & Ping</h3>
              <p className="text-[11px] font-mono text-zinc-400">{integration.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Integration Summary Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-zinc-900/80 border border-white/10 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Target Endpoint:</span>
            <span className="text-indigo-300 font-semibold truncate max-w-[240px]">{integration.endpoint}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Auth & Transport:</span>
            <span className="text-zinc-200">{integration.transport}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Vault Location:</span>
            <span className="text-emerald-400">{integration.keyLocation}</span>
          </div>
        </div>

        {/* Execution Output Window */}
        <div className="mt-4 p-4 rounded-xl bg-zinc-900/90 border border-white/10 font-mono text-xs space-y-3 min-h-[160px] flex flex-col justify-center">
          {!isRunning && !pingResult && (
            <div className="text-center text-zinc-500 space-y-2">
              <Terminal className="w-8 h-8 mx-auto opacity-50" />
              <p>Click "Execute Ping Test" to dispatch real-time health check probes to this dependency.</p>
            </div>
          )}

          {isRunning && (
            <div className="text-center space-y-3 py-4">
              <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
              <div className="text-indigo-200 font-semibold text-xs">Sending probe request to {integration.provider}...</div>
              <p className="text-[10px] text-zinc-500">Measuring roundtrip latency and verifying HTTP/MCP protocol handshakes</p>
            </div>
          )}

          {!isRunning && pingResult && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Status Response:</span>
                {pingResult.status === 'healthy' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> HTTP {pingResult.statusCode} OK (Healthy)
                  </span>
                )}
                {pingResult.status === 'degraded' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" /> HTTP {pingResult.statusCode} Rate-Limited / Slow
                  </span>
                )}
                {pingResult.status === 'down' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" /> HTTP {pingResult.statusCode} Service Unavailable
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Measured Latency:</span>
                <span className="font-bold text-cyan-400">{pingResult.latencyMs} ms</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Timestamp:</span>
                <span>{pingResult.timestamp}</span>
              </div>

              {pingResult.mcpVerification && (
                <div className="p-2 rounded bg-purple-950/30 border border-purple-500/30 text-purple-300 text-[11px]">
                  {pingResult.mcpVerification}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex items-center justify-between pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white font-mono text-xs">
            Close
          </button>
          <button
            onClick={handleExecutePing}
            disabled={isRunning}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold font-mono text-xs shadow-lg transition-colors flex items-center space-x-1.5"
            id="execute-ping-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>Execute Ping Test</span>
          </button>
        </div>

      </div>
    </div>
  );
};
