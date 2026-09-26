import React, { useState } from 'react';
import { RepoScanResult } from '../types';
import { Terminal, Check, AlertTriangle, RefreshCw, X, Shield, Code, Sparkles, FolderGit2 } from 'lucide-react';

interface RepoScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteScan?: (repoName: string) => void;
}

export const RepoScanModal: React.FC<RepoScanModalProps> = ({ isOpen, onClose, onCompleteScan }) => {
  const [selectedRepo, setSelectedRepo] = useState('acme-web-app');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [completedResult, setCompletedResult] = useState<RepoScanResult | null>(null);

  if (!isOpen) return null;

  const handleStartScan = () => {
    setIsScanning(true);
    setScanStep(1);
    setScanLogs(['⚡ Initializing StackKeeper AST parser for repository ' + selectedRepo + '...']);
    setCompletedResult(null);

    setTimeout(() => {
      setScanStep(2);
      setScanLogs(prev => [...prev, '📁 Scanning 142 source files across /src, /server, and /.mcp...']);
    }, 800);

    setTimeout(() => {
      setScanStep(3);
      setScanLogs(prev => [
        ...prev,
        '🔍 Found mcp.json and claude_desktop_config.json',
        '⚠️ Detected potential unrevoked secret key in .env.local.backup (Line 14)',
        '⚠️ Flagged call to deprecated endpoint OpenWeatherMap v2.5 in src/services/weather.ts'
      ]);
    }, 1800);

    setTimeout(() => {
      setIsScanning(false);
      setScanStep(4);
      setScanLogs(prev => [...prev, '✔ Scan completed successfully! Inventory synchronized.']);
      
      const result: RepoScanResult = {
        repoName: selectedRepo,
        branch: 'main',
        scannedAt: 'Just now',
        totalFilesScanned: 142,
        detectedApisCount: 4,
        detectedMcpsCount: 2,
        hiddenKeysFound: [
          { file: '.env.local.backup', line: 14, provider: 'OpenAI', type: 'Unrevoked test API key (sk-proj-...)' }
        ],
        deprecatedCalls: [
          { file: 'src/services/weather.ts', apiName: 'OpenWeatherMap v2.5', warningMessage: 'Deprecated structure will sunset Sept 2026.' }
        ],
        mcpConfigFilesFound: ['.mcp/config.json', 'claude_desktop_config.json']
      };

      setCompletedResult(result);
      if (onCompleteScan) onCompleteScan(selectedRepo);
    }, 2600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Codebase Dependency Auto-Scanner</h3>
              <p className="text-[11px] font-mono text-zinc-400">Detect API calls, MCP configs & hidden secrets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Repo Selector */}
        <div className="mt-4 font-mono text-xs space-y-2">
          <label className="block text-zinc-400 text-[11px] font-semibold">Select Target Repository</label>
          <div className="flex space-x-2">
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              disabled={isScanning}
              className="flex-1 px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
            >
              <option value="acme-web-app">github.com/acme-org/acme-web-app (main)</option>
              <option value="ai-agent-core">github.com/acme-org/ai-agent-core (main)</option>
              <option value="billing-service">github.com/acme-org/billing-service (main)</option>
            </select>

            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:opacity-95 text-white font-bold transition-all shadow-lg flex items-center space-x-1.5 disabled:opacity-50"
              id="start-repo-scan-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Scan Repo'}</span>
            </button>
          </div>
        </div>

        {/* Terminal Logs Window */}
        <div className="mt-4 p-4 rounded-xl bg-zinc-900/90 border border-white/10 font-mono text-xs text-zinc-300 space-y-2 min-h-[160px] max-h-[220px] overflow-y-auto">
          {scanLogs.length === 0 ? (
            <div className="text-zinc-500 text-center py-8">
              Click <span className="text-amber-400 font-bold">"Scan Repo"</span> to launch auto-detection scanner for API calls & MCP servers.
            </div>
          ) : (
            scanLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed text-[11px]">
                {log}
              </div>
            ))
          )}
        </div>

        {/* Scan Results Summary */}
        {completedResult && (
          <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-amber-500/30 space-y-3 font-mono text-xs animate-fade-in">
            <div className="flex items-center justify-between text-amber-300 font-bold border-b border-white/10 pb-2">
              <span>Scan Results for {completedResult.repoName}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded">
                142 Files Scanned
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-zinc-950 border border-white/5">
                <span className="text-zinc-500">Detected APIs:</span>
                <span className="float-right font-bold text-white">{completedResult.detectedApisCount}</span>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-white/5">
                <span className="text-zinc-500">Detected MCP Servers:</span>
                <span className="float-right font-bold text-purple-400">{completedResult.detectedMcpsCount}</span>
              </div>
            </div>

            {completedResult.hiddenKeysFound.length > 0 && (
              <div className="p-2.5 rounded bg-rose-950/20 border border-rose-500/30 space-y-1">
                <div className="text-rose-300 font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Hidden Credential Detected!</span>
                </div>
                {completedResult.hiddenKeysFound.map((k, i) => (
                  <p key={i} className="text-rose-200 text-[10px]">
                    ● {k.file}:{k.line} — {k.type} ({k.provider})
                  </p>
                ))}
              </div>
            )}

            <p className="text-[10px] text-zinc-400">
              ✔ Found MCP configs: {completedResult.mcpConfigFilesFound.join(', ')}
            </p>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white font-mono text-xs">
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
