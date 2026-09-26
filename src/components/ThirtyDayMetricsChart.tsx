import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend,
  Cell
} from 'recharts';
import { 
  DailyRequestMetric, 
  DependencyUsage30d, 
  ApiIntegration 
} from '../types';
import { 
  MOCK_DAILY_METRICS_30D, 
  MOCK_DEPENDENCY_USAGE_30D 
} from '../data/mockData';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Server, 
  Layers, 
  Download, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Info
} from 'lucide-react';

interface ThirtyDayMetricsChartProps {
  integrations?: ApiIntegration[];
  compact?: boolean;
}

type ViewMode = 'breakdown' | 'total' | 'dependencies' | 'errors';
type TimeWindow = '30d' | '14d' | '7d';

export const ThirtyDayMetricsChart: React.FC<ThirtyDayMetricsChartProps> = ({ 
  compact = false 
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('breakdown');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('30d');
  const [selectedDependencyId, setSelectedDependencyId] = useState<string | null>(null);

  // Filter daily metrics based on selected time window
  const filteredDailyData = useMemo(() => {
    if (timeWindow === '7d') {
      return MOCK_DAILY_METRICS_30D.slice(-7);
    }
    if (timeWindow === '14d') {
      return MOCK_DAILY_METRICS_30D.slice(-14);
    }
    return MOCK_DAILY_METRICS_30D;
  }, [timeWindow]);

  // Aggregate summary statistics
  const summary = useMemo(() => {
    const totalRequests = filteredDailyData.reduce((acc, d) => acc + d.totalRequests, 0);
    const totalMcp = filteredDailyData.reduce((acc, d) => acc + d.mcpRequests, 0);
    const totalRest = filteredDailyData.reduce((acc, d) => acc + d.restApiRequests, 0);
    const totalGraphql = filteredDailyData.reduce((acc, d) => acc + d.graphqlRequests, 0);
    const totalErrors = filteredDailyData.reduce((acc, d) => acc + d.errorRequests, 0);
    const avgDaily = Math.round(totalRequests / filteredDailyData.length);
    const peakDay = [...filteredDailyData].sort((a, b) => b.totalRequests - a.totalRequests)[0];
    const avgLatency = Math.round(filteredDailyData.reduce((acc, d) => acc + d.avgLatencyMs, 0) / filteredDailyData.length);
    const errorRate = ((totalErrors / totalRequests) * 100).toFixed(3);
    const mcpPercentage = ((totalMcp / totalRequests) * 100).toFixed(1);

    return {
      totalRequests,
      totalMcp,
      totalRest,
      totalGraphql,
      totalErrors,
      avgDaily,
      peakDay,
      avgLatency,
      errorRate,
      mcpPercentage
    };
  }, [filteredDailyData]);

  // Format large numbers (e.g. 520k, 1.2M)
  const formatCompactNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${Math.round(num / 1000)}k`;
    }
    return num.toString();
  };

  // Export 30-day dataset to CSV
  const handleExportDailyCsv = () => {
    const headers = 'Date,FullDate,TotalRequests,RestApiRequests,McpServerRequests,GraphQLRequests,ErrorRequests,ActiveDependencies,AvgLatencyMs,TopDependency\n';
    const rows = MOCK_DAILY_METRICS_30D.map(d => 
      `"${d.date}","${d.fullDate}",${d.totalRequests},${d.restApiRequests},${d.mcpRequests},${d.graphqlRequests},${d.errorRequests},${d.activeDependenciesCount},${d.avgLatencyMs},"${d.topDependency}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api_mcp_request_volume_last_30_days.csv`;
    a.click();
  };

  // Custom tooltips matching suga.app minimalist aesthetic
  const CustomDailyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as DailyRequestMetric;
      return (
        <div className="bg-zinc-950/95 border border-white/15 p-3.5 rounded-xl shadow-2xl backdrop-blur-md font-mono text-xs text-zinc-200 min-w-[240px] space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-white text-sm flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {dataPoint.date} ({dataPoint.fullDate})
            </span>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-sans">
              Day {dataPoint.dayIndex} of 30
            </span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-white font-bold">
              <span>Total Volume:</span>
              <span className="text-emerald-400">{dataPoint.totalRequests.toLocaleString()} reqs</span>
            </div>

            <div className="flex items-center justify-between text-zinc-300 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8b5cf6]"></span>
                REST API Volume:
              </span>
              <span>{dataPoint.restApiRequests.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-300 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#06b6d4]"></span>
                MCP Agent Server:
              </span>
              <span className="text-cyan-300 font-semibold">{dataPoint.mcpRequests.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-300 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
                GraphQL Gateway:
              </span>
              <span>{dataPoint.graphqlRequests.toLocaleString()}</span>
            </div>

            {dataPoint.errorRequests > 0 && (
              <div className="flex items-center justify-between text-rose-400 text-[11px] pt-1 border-t border-white/5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f43f5e]"></span>
                  Errors Logged:
                </span>
                <span>{dataPoint.errorRequests} reqs</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
            <span>Latency: <strong className="text-white">{dataPoint.avgLatencyMs}ms</strong></span>
            <span className="truncate max-w-[130px]" title={dataPoint.topDependency}>
              Top: <strong className="text-indigo-300">{dataPoint.topDependency}</strong>
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDependencyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dep = payload[0].payload as DependencyUsage30d;
      return (
        <div className="bg-zinc-950/95 border border-white/15 p-3.5 rounded-xl shadow-2xl backdrop-blur-md font-mono text-xs text-zinc-200 min-w-[240px] space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <div className="font-bold text-white text-sm">{dep.name}</div>
              <div className="text-[10px] text-zinc-400">{dep.provider} • {dep.type.toUpperCase()}</div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              +{dep.growthPercent}%
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">30-Day Request Volume:</span>
              <span className="text-white font-bold">{dep.totalRequests30d.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Daily Average:</span>
              <span className="text-zinc-200">{dep.dailyAvgRequests.toLocaleString()} req/day</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Avg Response Latency:</span>
              <span className="text-cyan-300">{dep.avgLatencyMs}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">30-Day Spend:</span>
              <span className="text-emerald-400 font-bold">${dep.cost30d.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Quota Limit Used:</span>
              <span className={dep.quotaPercent > 85 ? 'text-amber-400 font-bold' : 'text-zinc-300'}>
                {dep.quotaPercent}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-6 shadow-xl relative overflow-hidden suga-card">
      
      {/* Top Header & Interactive Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>API Request Volume & Dependency Metrics</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                  Last 30 Days
                </span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Recharts time-series visualization across REST APIs, MCP server invocations, and GraphQL endpoints
              </p>
            </div>
          </div>
        </div>

        {/* View mode pill buttons & timeframe controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          
          {/* Time window selector */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setTimeWindow('7d')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                timeWindow === '7d' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeWindow('14d')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                timeWindow === '14d' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              14D
            </button>
            <button
              onClick={() => setTimeWindow('30d')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                timeWindow === '30d' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              30D
            </button>
          </div>

          {/* Metric View Tabs */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('breakdown')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 ${
                viewMode === 'breakdown' 
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              id="chart-view-breakdown"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>By Protocol</span>
            </button>

            <button
              onClick={() => setViewMode('total')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 ${
                viewMode === 'total' 
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              id="chart-view-total"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Total Volume</span>
            </button>

            <button
              onClick={() => setViewMode('dependencies')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 ${
                viewMode === 'dependencies' 
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              id="chart-view-dependencies"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Top Dependencies</span>
            </button>

            <button
              onClick={() => setViewMode('errors')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 ${
                viewMode === 'errors' 
                  ? 'bg-rose-900/60 text-rose-200 border border-rose-500/30 font-semibold' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              id="chart-view-errors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Volume vs Errors</span>
            </button>
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportDailyCsv}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/10 flex items-center space-x-1 transition-colors"
            title="Export 30-day raw telemetry metrics to CSV"
            id="export-30d-metrics-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>

      </div>

      {/* 4 Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        
        {/* KPI 1: 30-Day Total Requests */}
        <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>30-Day Requests</span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center">
              +19.2% <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
            {formatCompactNumber(summary.totalRequests)}
          </div>
          <div className="text-[11px] text-zinc-500">
            {summary.totalRequests.toLocaleString()} total calls
          </div>
        </div>

        {/* KPI 2: Daily Average */}
        <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Daily Average</span>
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
            {formatCompactNumber(summary.avgDaily)}/day
          </div>
          <div className="text-[11px] text-zinc-500">
            Peak: {formatCompactNumber(summary.peakDay.totalRequests)} ({summary.peakDay.date})
          </div>
        </div>

        {/* KPI 3: MCP Agent Share */}
        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-purple-300">
            <span>MCP Agent Share</span>
            <Zap className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl lg:text-2xl font-extrabold text-purple-200 tracking-tight">
            {summary.mcpPercentage}%
          </div>
          <div className="text-[11px] text-purple-400/80">
            {formatCompactNumber(summary.totalMcp)} MCP calls (+48.3% MoM)
          </div>
        </div>

        {/* KPI 4: Reliability & Avg Latency */}
        <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Latency & Health</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl lg:text-2xl font-extrabold text-emerald-400 tracking-tight">
            {summary.avgLatency}ms
          </div>
          <div className="text-[11px] text-zinc-500">
            {summary.errorRate}% error rate ({summary.totalErrors.toLocaleString()} errs)
          </div>
        </div>

      </div>

      {/* Recharts Bar Chart Area */}
      <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 space-y-3">
        
        {/* Chart Context Header */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            {viewMode === 'breakdown' && (
              <>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#8b5cf6]"></span>
                  REST APIs
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#06b6d4]"></span>
                  MCP Servers
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#38bdf8]"></span>
                  GraphQL
                </span>
              </>
            )}

            {viewMode === 'total' && (
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]"></span>
                Total Daily Request Volume (All Protocols)
              </span>
            )}

            {viewMode === 'dependencies' && (
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#8b5cf6]"></span>
                Total 30-Day Requests by Registered Dependency
              </span>
            )}

            {viewMode === 'errors' && (
              <>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#8b5cf6]"></span>
                  Successful Volume
                </span>
                <span className="flex items-center gap-1.5 text-rose-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#f43f5e]"></span>
                  Error Count
                </span>
              </>
            )}
          </div>

          <span className="hidden sm:inline text-zinc-500">
            Interactive hover enabled • {filteredDailyData.length} data points
          </span>
        </div>

        {/* The Recharts Bar Chart Component */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'dependencies' ? (
              /* HORIZONTAL BAR CHART FOR DEPENDENCIES USAGE */
              <BarChart
                data={MOCK_DEPENDENCY_USAGE_30D}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis 
                  type="number"
                  stroke="#71717a" 
                  fontSize={11} 
                  fontFamily="'Geist Mono', monospace"
                  tickFormatter={formatCompactNumber}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={11} 
                  fontFamily="'Geist Mono', monospace"
                  tickLine={false}
                  width={130}
                />
                <Tooltip content={<CustomDependencyTooltip />} />
                <Bar 
                  dataKey="totalRequests30d" 
                  name="30-Day Volume"
                  radius={[0, 4, 4, 0]}
                >
                  {MOCK_DEPENDENCY_USAGE_30D.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : viewMode === 'total' ? (
              /* TOTAL REQUESTS BAR CHART */
              <BarChart
                data={filteredDailyData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#71717a" 
                  fontSize={11} 
                  fontFamily="'Geist Mono', monospace"
                  tickLine={false}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={11} 
                  fontFamily="'Geist Mono', monospace"
                  tickFormatter={formatCompactNumber}
                  tickLine={false}
                />
                <Tooltip content={<CustomDailyTooltip />} />
                <Bar 
                  dataKey="totalRequests" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                  name="Daily Requests"
                />
              </BarChart>
            ) : viewMode === 'errors' ? (
              /* DUAL BAR: VOLUME VS ERRORS */
              <BarChart
                data={filteredDailyData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#71717a" 
                  fontSize={11} 
                  fontFamily="'Geist Mono', monospace"
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#71717a" 
                  fontSize={11} 
                  fontFamily="'Geist Mono', monospace"
                  tickFormatter={formatCompactNumber}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#f43f5e" 
                  fontSize={11} 
                  fontFamily="'Geist Mono', monospace"
                  tickLine={false}
                />
                <Tooltip content={<CustomDailyTooltip />} />
                <Bar 
                  yAxisId="left"
                  dataKey="totalRequests" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]} 
                  name="Total Requests"
                />
                <Bar 
                  yAxisId="right"
                  dataKey="errorRequests" 
                  fill="#f43f5e" 
                  radius={[4, 4, 0, 0]} 
                  name="Errors"
                />
              </BarChart>
            ) : (
              /* DEFAULT: STACKED BAR CHART BY PROTOCOL (REST, MCP, GRAPHQL) */
              <BarChart
                data={filteredDailyData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#71717a" 
                  fontSize={11} 
                  fontFamily="'Geist Mono', monospace"
                  tickLine={false}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={11} 
                  fontFamily="'Geist Mono', monospace"
                  tickFormatter={formatCompactNumber}
                  tickLine={false}
                />
                <Tooltip content={<CustomDailyTooltip />} />
                <Bar 
                  dataKey="restApiRequests" 
                  stackId="protocol"
                  fill="#8b5cf6" 
                  name="REST APIs" 
                />
                <Bar 
                  dataKey="mcpRequests" 
                  stackId="protocol"
                  fill="#06b6d4" 
                  name="MCP Servers" 
                />
                <Bar 
                  dataKey="graphqlRequests" 
                  stackId="protocol"
                  fill="#38bdf8" 
                  radius={[4, 4, 0, 0]}
                  name="GraphQL" 
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

      </div>

      {/* Dependency Usage Breakdown Ranking Table */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-zinc-300">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            30-Day Dependency Usage Leaderboard
          </span>
          <span className="text-[11px] text-zinc-500">
            Ranked by request throughput & quota consumption
          </span>
        </div>

        <div className="bg-zinc-950/70 border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
          {MOCK_DEPENDENCY_USAGE_30D.map((dep, index) => {
            const percentageOfTotal = ((dep.totalRequests30d / summary.totalRequests) * 100).toFixed(1);
            return (
              <div 
                key={dep.id} 
                className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-zinc-800/40 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-[240px]">
                  <span className="text-zinc-600 font-bold w-4">#{index + 1}</span>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{dep.name}</span>
                      {dep.type === 'mcp_server' ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          MCP
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          {dep.type.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-500">{dep.provider}</div>
                  </div>
                </div>

                {/* Progress bar visual for 30-day volume */}
                <div className="flex-1 max-w-xs space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>{dep.totalRequests30d.toLocaleString()} requests</span>
                    <span>{percentageOfTotal}% share</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, Math.max(8, Number(percentageOfTotal) * 2.5))}%`,
                        backgroundColor: dep.color 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Metrics stats */}
                <div className="flex items-center justify-between md:justify-end gap-6 text-[11px] text-zinc-400">
                  <div>
                    <span className="text-zinc-500">Latency: </span>
                    <span className="text-zinc-200">{dep.avgLatencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Spend: </span>
                    <span className="text-emerald-400 font-semibold">${dep.cost30d.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Quota: </span>
                    <span className={dep.quotaPercent > 85 ? 'text-amber-400 font-bold' : 'text-zinc-200'}>
                      {dep.quotaPercent}%
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    dep.growthPercent >= 0 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {dep.growthPercent >= 0 ? `+${dep.growthPercent}%` : `${dep.growthPercent}%`}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
