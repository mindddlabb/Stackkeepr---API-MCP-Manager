import { ApiIntegration, AuditLog, RepoScanResult, UserProfile, AnalyticsMetric, DailyRequestMetric, DependencyUsage30d } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-101',
  name: 'Alex Rivera',
  email: 'alex@stackkeeper.dev',
  role: 'Engineering Lead',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  workspace: 'Acme AI Labs',
  plan: 'Pro',
  apiKey: 'sk_live_99a8b7c6d5e4f3a210_stk'
};

export const INITIAL_INTEGRATIONS: ApiIntegration[] = [
  {
    id: 'int-stripe-prod',
    name: 'Stripe Billing API',
    provider: 'Stripe',
    type: 'rest_api',
    endpoint: 'https://api.stripe.com/v1',
    transport: 'http_bearer',
    status: 'healthy',
    keyLocation: 'AWS Secrets Manager (/prod/stripe/key)',
    lastRotated: '2026-06-15',
    expiresAt: '2026-12-15',
    owner: 'Alex Rivera',
    ownerEmail: 'alex@stackkeeper.dev',
    repos: ['acme-billing-service', 'acme-web-app'],
    environment: 'production',
    monthlyCost: 142.50,
    freeTierLimit: 'N/A (Pay-as-you-go 2.9% + 30¢)',
    currentUsagePercent: 68,
    rateLimitRpm: 1000,
    latencyMs: 112,
    lastHealthCheck: '2 mins ago',
    notes: 'Handles primary checkout webhooks and customer subscriptions.'
  },
  {
    id: 'int-anthropic-mcp',
    name: 'PostgreSQL MCP Server',
    provider: 'Self-Hosted MCP',
    type: 'mcp_server',
    endpoint: 'npx -y @modelcontextprotocol/server-postgres',
    transport: 'stdio',
    status: 'healthy',
    keyLocation: 'Environment (PGDATABASE_URL in Vault)',
    lastRotated: '2026-07-01',
    expiresAt: '2027-01-01',
    owner: 'David Chen',
    ownerEmail: 'david@stackkeeper.dev',
    repos: ['ai-agent-core', 'internal-admin-cli'],
    environment: 'production',
    monthlyCost: 28.00,
    freeTierLimit: 'Self-hosted compute',
    currentUsagePercent: 42,
    rateLimitRpm: 500,
    latencyMs: 45,
    lastHealthCheck: 'Just now',
    mcpServerVersion: 'v1.4.2',
    mcpTools: [
      { name: 'query_db', description: 'Run read-only SQL queries against Postgres', parametersCount: 2, accessScope: 'read-only' },
      { name: 'get_table_schema', description: 'Inspect columns and indices for tables', parametersCount: 1, accessScope: 'read-only' },
      { name: 'explain_query', description: 'Get query execution plan details', parametersCount: 1, accessScope: 'read-only' }
    ],
    notes: 'Provides secure database context for Claude Desktop and internal coding agents.'
  },
  {
    id: 'int-openai-gpt4o',
    name: 'OpenAI Embeddings & Responses',
    provider: 'OpenAI',
    type: 'rest_api',
    endpoint: 'https://api.openai.com/v1',
    transport: 'api_key',
    status: 'healthy',
    keyLocation: '1Password Team Vault (AI-Service-Prod)',
    lastRotated: '2026-05-10',
    expiresAt: '2026-09-10',
    owner: 'Sarah Jenkins',
    ownerEmail: 'sarah@stackkeeper.dev',
    repos: ['ai-agent-core', 'search-indexer'],
    environment: 'production',
    monthlyCost: 389.20,
    freeTierLimit: '$500 Tier 4 quota',
    currentUsagePercent: 78,
    rateLimitRpm: 5000,
    latencyMs: 340,
    lastHealthCheck: '1 min ago',
    notes: 'Primary LLM fallback and vector embeddings generator.'
  },
  {
    id: 'int-brave-search-mcp',
    name: 'Brave Search MCP Server',
    provider: 'Brave Software',
    type: 'mcp_server',
    endpoint: 'https://mcp.brave.com/sse',
    transport: 'sse',
    status: 'degraded',
    keyLocation: 'Local .env.production (BRAVE_API_KEY)',
    lastRotated: '2026-02-11',
    expiresAt: '2026-08-20',
    owner: 'Alex Rivera',
    ownerEmail: 'alex@stackkeeper.dev',
    repos: ['research-agent', 'ai-agent-core'],
    environment: 'production',
    monthlyCost: 15.00,
    freeTierLimit: '2,000 queries/mo free',
    currentUsagePercent: 91,
    rateLimitRpm: 120,
    latencyMs: 780,
    lastHealthCheck: '5 mins ago',
    mcpServerVersion: 'v0.9.1',
    mcpTools: [
      { name: 'web_search', description: 'Execute web searches with Brave Index', parametersCount: 3, accessScope: 'network-outbound' },
      { name: 'local_search', description: 'Query geographic entities and POIs', parametersCount: 2, accessScope: 'network-outbound' }
    ],
    notes: 'Warning: Approaching monthly query quota limit!'
  },
  {
    id: 'int-resend-email',
    name: 'Resend Transactional Email',
    provider: 'Resend',
    type: 'rest_api',
    endpoint: 'https://api.resend.com',
    transport: 'api_key',
    status: 'healthy',
    keyLocation: 'Vercel Environment Variables (RESEND_API_KEY)',
    lastRotated: '2026-04-02',
    expiresAt: '2027-04-02',
    owner: 'Elena Rostova',
    ownerEmail: 'elena@stackkeeper.dev',
    repos: ['acme-web-app'],
    environment: 'production',
    monthlyCost: 20.00,
    freeTierLimit: '3,000 emails/mo',
    currentUsagePercent: 34,
    rateLimitRpm: 300,
    latencyMs: 88,
    lastHealthCheck: '4 mins ago',
    notes: 'Handles user welcome emails and password reset tokens.'
  },
  {
    id: 'int-github-mcp',
    name: 'GitHub Repository MCP Server',
    provider: 'GitHub',
    type: 'mcp_server',
    endpoint: 'npx -y @modelcontextprotocol/server-github',
    transport: 'stdio',
    status: 'healthy',
    keyLocation: 'GitHub Personal Access Token (GITHUB_TOKEN in Vault)',
    lastRotated: '2026-07-20',
    expiresAt: '2026-10-20',
    owner: 'David Chen',
    ownerEmail: 'david@stackkeeper.dev',
    repos: ['ai-agent-core', 'devops-automation'],
    environment: 'development',
    monthlyCost: 0.00,
    freeTierLimit: 'Unlimited (GitHub API quota applies)',
    currentUsagePercent: 15,
    rateLimitRpm: 5000,
    latencyMs: 190,
    lastHealthCheck: '3 mins ago',
    mcpServerVersion: 'v2.1.0',
    mcpTools: [
      { name: 'create_issue', description: 'Create issues in repository', parametersCount: 4, accessScope: 'repo:write' },
      { name: 'read_file', description: 'Read file content from default branch', parametersCount: 2, accessScope: 'repo:read' },
      { name: 'create_pull_request', description: 'Submit automated pull request', parametersCount: 5, accessScope: 'repo:write' }
    ],
    notes: 'Enables coding assistant to automate PR reviews and issue triage.'
  },
  {
    id: 'int-weather-legacy',
    name: 'OpenWeatherMap Legacy v2.5',
    provider: 'OpenWeather',
    type: 'rest_api',
    endpoint: 'https://api.openweathermap.org/data/2.5',
    transport: 'api_key',
    status: 'deprecated',
    keyLocation: 'Forgotten .env in old repo (OWM_KEY)',
    lastRotated: '2025-01-10',
    expiresAt: '2026-08-31',
    owner: 'Unknown (Ex-employee)',
    ownerEmail: 'dev-team@stackkeeper.dev',
    repos: ['legacy-mobile-app'],
    environment: 'development',
    monthlyCost: 45.00,
    freeTierLimit: 'Grandfathered Developer Tier',
    currentUsagePercent: 8,
    rateLimitRpm: 60,
    latencyMs: 610,
    lastHealthCheck: '12 mins ago',
    notes: 'API Endpoint sunset announced for end of Q3. Migrate to Weather One Call v3.0.'
  },
  {
    id: 'int-supabase-db',
    name: 'Supabase Realtime & Auth',
    provider: 'Supabase',
    type: 'graphql',
    endpoint: 'https://xyz.supabase.co/graphql/v1',
    transport: 'http_bearer',
    status: 'healthy',
    keyLocation: 'Doppler Secret Management',
    lastRotated: '2026-06-01',
    expiresAt: '2027-06-01',
    owner: 'Alex Rivera',
    ownerEmail: 'alex@stackkeeper.dev',
    repos: ['acme-web-app', 'mobile-client'],
    environment: 'production',
    monthlyCost: 25.00,
    freeTierLimit: '$25 Pro Tier included',
    currentUsagePercent: 52,
    rateLimitRpm: 2000,
    latencyMs: 72,
    lastHealthCheck: 'Just now',
    notes: 'GraphQL gateway for client mobile app subscriptions.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-09 23:45:12',
    user: 'Alex Rivera',
    userEmail: 'alex@stackkeeper.dev',
    action: 'TESTED',
    targetName: 'PostgreSQL MCP Server',
    targetType: 'mcp_server',
    details: 'Executed ping check and validated 3 MCP tools (query_db, get_table_schema, explain_query). Latency: 45ms.',
    status: 'success'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-09 22:10:05',
    user: 'System Bot',
    userEmail: 'bot@stackkeeper.dev',
    action: 'ALERT_TRIGGERED',
    targetName: 'OpenWeatherMap Legacy v2.5',
    targetType: 'rest_api',
    details: 'Flagged endpoint sunset warning: Vendor deprecation deadline is August 31, 2026.',
    status: 'warning'
  },
  {
    id: 'log-3',
    timestamp: '2026-08-09 19:30:00',
    user: 'Sarah Jenkins',
    userEmail: 'sarah@stackkeeper.dev',
    action: 'ROTATED',
    targetName: 'OpenAI Embeddings & Responses',
    targetType: 'rest_api',
    details: 'Rotated API Key metadata in 1Password Vault. Next rotation due in 90 days.',
    status: 'success'
  },
  {
    id: 'log-4',
    timestamp: '2026-08-09 15:12:44',
    user: 'David Chen',
    userEmail: 'david@stackkeeper.dev',
    action: 'SCANNED',
    targetName: 'Repository: ai-agent-core',
    targetType: 'mcp_server',
    details: 'Scanned main branch. Discovered 2 MCP servers (Postgres, GitHub) and 1 unrecorded API credential.',
    status: 'success'
  },
  {
    id: 'log-5',
    timestamp: '2026-08-08 11:05:20',
    user: 'Elena Rostova',
    userEmail: 'elena@stackkeeper.dev',
    action: 'CREATED',
    targetName: 'Resend Transactional Email',
    targetType: 'rest_api',
    details: 'Registered new Resend integration with Vercel key location metadata.',
    status: 'success'
  }
];

export const MOCK_REPO_SCANS: RepoScanResult[] = [
  {
    repoName: 'acme-web-app',
    branch: 'main',
    scannedAt: '10 minutes ago',
    totalFilesScanned: 142,
    detectedApisCount: 4,
    detectedMcpsCount: 1,
    hiddenKeysFound: [
      { file: '.env.local.backup', line: 14, provider: 'OpenAI', type: 'Hardcoded API Key (sk-proj-...)' },
      { file: 'src/lib/legacyWeather.ts', line: 8, provider: 'OpenWeather', type: 'Embedded URL string parameter' }
    ],
    deprecatedCalls: [
      { file: 'src/services/weather.ts', apiName: 'OpenWeather v2.5', warningMessage: 'Deprecated query string structure will fail after Sept 2026.' }
    ],
    mcpConfigFilesFound: ['.mcp/config.json', 'claude_desktop_config.json']
  },
  {
    repoName: 'ai-agent-core',
    branch: 'main',
    scannedAt: '1 hour ago',
    totalFilesScanned: 88,
    detectedApisCount: 2,
    detectedMcpsCount: 3,
    hiddenKeysFound: [],
    deprecatedCalls: [],
    mcpConfigFilesFound: ['claude_desktop_config.json']
  }
];

export const MOCK_ANALYTICS: AnalyticsMetric[] = [
  { time: '00:00', latencyMs: 120, requestsPerMin: 420, errorsCount: 1, costRate: 12.4 },
  { time: '04:00', latencyMs: 115, requestsPerMin: 210, errorsCount: 0, costRate: 8.2 },
  { time: '08:00', latencyMs: 145, requestsPerMin: 890, errorsCount: 3, costRate: 24.1 },
  { time: '12:00', latencyMs: 190, requestsPerMin: 1450, errorsCount: 5, costRate: 42.0 },
  { time: '16:00', latencyMs: 165, requestsPerMin: 1210, errorsCount: 2, costRate: 35.8 },
  { time: '20:00', latencyMs: 130, requestsPerMin: 680, errorsCount: 1, costRate: 18.5 },
  { time: '24:00', latencyMs: 122, requestsPerMin: 490, errorsCount: 0, costRate: 14.1 }
];

export const MOCK_DAILY_METRICS_30D: DailyRequestMetric[] = [
  { dayIndex: 1,  date: 'Aug 27', fullDate: '2026-08-27', totalRequests: 392400, restApiRequests: 245200, mcpRequests: 112100, graphqlRequests: 35100, errorRequests: 210, activeDependenciesCount: 7, avgLatencyMs: 118, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 2,  date: 'Aug 28', fullDate: '2026-08-28', totalRequests: 418200, restApiRequests: 258100, mcpRequests: 122400, graphqlRequests: 37700, errorRequests: 185, activeDependenciesCount: 7, avgLatencyMs: 114, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 3,  date: 'Aug 29', fullDate: '2026-08-29', totalRequests: 445100, restApiRequests: 269000, mcpRequests: 136200, graphqlRequests: 39900, errorRequests: 240, activeDependenciesCount: 8, avgLatencyMs: 122, topDependency: 'Stripe Billing API' },
  { dayIndex: 4,  date: 'Aug 30', fullDate: '2026-08-30', totalRequests: 362000, restApiRequests: 221000, mcpRequests: 108000, graphqlRequests: 33000, errorRequests: 145, activeDependenciesCount: 7, avgLatencyMs: 106, topDependency: 'Stripe Billing API' },
  { dayIndex: 5,  date: 'Aug 31', fullDate: '2026-08-31', totalRequests: 341500, restApiRequests: 209500, mcpRequests: 101200, graphqlRequests: 30800, errorRequests: 110, activeDependenciesCount: 7, avgLatencyMs: 102, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 6,  date: 'Sep 01', fullDate: '2026-09-01', totalRequests: 478900, restApiRequests: 288400, mcpRequests: 148500, graphqlRequests: 42000, errorRequests: 310, activeDependenciesCount: 8, avgLatencyMs: 125, topDependency: 'PostgreSQL MCP Server' },
  { dayIndex: 7,  date: 'Sep 02', fullDate: '2026-09-02', totalRequests: 504300, restApiRequests: 301200, mcpRequests: 157800, graphqlRequests: 45300, errorRequests: 280, activeDependenciesCount: 8, avgLatencyMs: 129, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 8,  date: 'Sep 03', fullDate: '2026-09-03', totalRequests: 521800, restApiRequests: 311000, mcpRequests: 164200, graphqlRequests: 46600, errorRequests: 340, activeDependenciesCount: 8, avgLatencyMs: 132, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 9,  date: 'Sep 04', fullDate: '2026-09-04', totalRequests: 538200, restApiRequests: 319500, mcpRequests: 171100, graphqlRequests: 47600, errorRequests: 295, activeDependenciesCount: 8, avgLatencyMs: 130, topDependency: 'PostgreSQL MCP Server' },
  { dayIndex: 10, date: 'Sep 05', fullDate: '2026-09-05', totalRequests: 495000, restApiRequests: 294000, mcpRequests: 158000, graphqlRequests: 43000, errorRequests: 230, activeDependenciesCount: 8, avgLatencyMs: 121, topDependency: 'Stripe Billing API' },
  { dayIndex: 11, date: 'Sep 06', fullDate: '2026-09-06', totalRequests: 374200, restApiRequests: 226000, mcpRequests: 115200, graphqlRequests: 33000, errorRequests: 130, activeDependenciesCount: 7, avgLatencyMs: 108, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 12, date: 'Sep 07', fullDate: '2026-09-07', totalRequests: 358900, restApiRequests: 216400, mcpRequests: 111300, graphqlRequests: 31200, errorRequests: 115, activeDependenciesCount: 7, avgLatencyMs: 105, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 13, date: 'Sep 08', fullDate: '2026-09-08', totalRequests: 512000, restApiRequests: 304000, mcpRequests: 161000, graphqlRequests: 47000, errorRequests: 275, activeDependenciesCount: 8, avgLatencyMs: 126, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 14, date: 'Sep 09', fullDate: '2026-09-09', totalRequests: 541300, restApiRequests: 320100, mcpRequests: 172900, graphqlRequests: 48300, errorRequests: 360, activeDependenciesCount: 8, avgLatencyMs: 134, topDependency: 'PostgreSQL MCP Server' },
  { dayIndex: 15, date: 'Sep 10', fullDate: '2026-09-10', totalRequests: 569800, restApiRequests: 334500, mcpRequests: 184300, graphqlRequests: 51000, errorRequests: 420, activeDependenciesCount: 8, avgLatencyMs: 138, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 16, date: 'Sep 11', fullDate: '2026-09-11', totalRequests: 588100, restApiRequests: 342000, mcpRequests: 193500, graphqlRequests: 52600, errorRequests: 390, activeDependenciesCount: 8, avgLatencyMs: 141, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 17, date: 'Sep 12', fullDate: '2026-09-12', totalRequests: 554600, restApiRequests: 324100, mcpRequests: 181200, graphqlRequests: 49300, errorRequests: 315, activeDependenciesCount: 8, avgLatencyMs: 131, topDependency: 'Stripe Billing API' },
  { dayIndex: 18, date: 'Sep 13', fullDate: '2026-09-13', totalRequests: 412500, restApiRequests: 247000, mcpRequests: 129000, graphqlRequests: 36500, errorRequests: 170, activeDependenciesCount: 7, avgLatencyMs: 111, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 19, date: 'Sep 14', fullDate: '2026-09-14', totalRequests: 389400, restApiRequests: 232000, mcpRequests: 122800, graphqlRequests: 34600, errorRequests: 140, activeDependenciesCount: 7, avgLatencyMs: 109, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 20, date: 'Sep 15', fullDate: '2026-09-15', totalRequests: 574200, restApiRequests: 337000, mcpRequests: 186200, graphqlRequests: 51000, errorRequests: 345, activeDependenciesCount: 8, avgLatencyMs: 135, topDependency: 'PostgreSQL MCP Server' },
  { dayIndex: 21, date: 'Sep 16', fullDate: '2026-09-16', totalRequests: 615000, restApiRequests: 358000, mcpRequests: 202000, graphqlRequests: 55000, errorRequests: 480, activeDependenciesCount: 8, avgLatencyMs: 144, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 22, date: 'Sep 17', fullDate: '2026-09-17', totalRequests: 648900, restApiRequests: 376200, mcpRequests: 214500, graphqlRequests: 58200, errorRequests: 520, activeDependenciesCount: 8, avgLatencyMs: 148, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 23, date: 'Sep 18', fullDate: '2026-09-18', totalRequests: 684200, restApiRequests: 395100, mcpRequests: 228400, graphqlRequests: 60700, errorRequests: 580, activeDependenciesCount: 8, avgLatencyMs: 152, topDependency: 'PostgreSQL MCP Server' },
  { dayIndex: 24, date: 'Sep 19', fullDate: '2026-09-19', totalRequests: 629000, restApiRequests: 366000, mcpRequests: 207000, graphqlRequests: 56000, errorRequests: 410, activeDependenciesCount: 8, avgLatencyMs: 139, topDependency: 'Stripe Billing API' },
  { dayIndex: 25, date: 'Sep 20', fullDate: '2026-09-20', totalRequests: 438100, restApiRequests: 261000, mcpRequests: 138500, graphqlRequests: 38600, errorRequests: 190, activeDependenciesCount: 7, avgLatencyMs: 115, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 26, date: 'Sep 21', fullDate: '2026-09-21', totalRequests: 410700, restApiRequests: 244500, mcpRequests: 130200, graphqlRequests: 36000, errorRequests: 155, activeDependenciesCount: 7, avgLatencyMs: 112, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 27, date: 'Sep 22', fullDate: '2026-09-22', totalRequests: 602300, restApiRequests: 351000, mcpRequests: 198000, graphqlRequests: 53300, errorRequests: 390, activeDependenciesCount: 8, avgLatencyMs: 137, topDependency: 'PostgreSQL MCP Server' },
  { dayIndex: 28, date: 'Sep 23', fullDate: '2026-09-23', totalRequests: 639800, restApiRequests: 371200, mcpRequests: 211600, graphqlRequests: 57000, errorRequests: 460, activeDependenciesCount: 8, avgLatencyMs: 142, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 29, date: 'Sep 24', fullDate: '2026-09-24', totalRequests: 668400, restApiRequests: 386000, mcpRequests: 223000, graphqlRequests: 59400, errorRequests: 510, activeDependenciesCount: 8, avgLatencyMs: 146, topDependency: 'OpenAI GPT-4o' },
  { dayIndex: 30, date: 'Sep 25', fullDate: '2026-09-25', totalRequests: 673900, restApiRequests: 389200, mcpRequests: 224800, graphqlRequests: 59900, errorRequests: 485, activeDependenciesCount: 8, avgLatencyMs: 145, topDependency: 'PostgreSQL MCP Server' }
];

export const MOCK_DEPENDENCY_USAGE_30D: DependencyUsage30d[] = [
  {
    id: 'int-openai-gpt4o',
    name: 'OpenAI Embeddings & Responses',
    provider: 'OpenAI',
    type: 'rest_api',
    totalRequests30d: 5420000,
    dailyAvgRequests: 180666,
    peakRps: 240,
    avgLatencyMs: 340,
    cost30d: 389.20,
    quotaPercent: 78,
    growthPercent: 24.5,
    color: '#8b5cf6'
  },
  {
    id: 'int-stripe-prod',
    name: 'Stripe Billing API',
    provider: 'Stripe',
    type: 'rest_api',
    totalRequests30d: 3850000,
    dailyAvgRequests: 128333,
    peakRps: 185,
    avgLatencyMs: 112,
    cost30d: 142.50,
    quotaPercent: 68,
    growthPercent: 12.3,
    color: '#10b981'
  },
  {
    id: 'int-anthropic-mcp',
    name: 'PostgreSQL MCP Server',
    provider: 'Self-Hosted MCP',
    type: 'mcp_server',
    totalRequests30d: 2980000,
    dailyAvgRequests: 99333,
    peakRps: 145,
    avgLatencyMs: 45,
    cost30d: 28.00,
    quotaPercent: 42,
    growthPercent: 45.8,
    color: '#06b6d4'
  },
  {
    id: 'int-supabase-db',
    name: 'Supabase Realtime & Auth',
    provider: 'Supabase',
    type: 'graphql',
    totalRequests30d: 1820000,
    dailyAvgRequests: 60666,
    peakRps: 92,
    avgLatencyMs: 72,
    cost30d: 25.00,
    quotaPercent: 52,
    growthPercent: 9.1,
    color: '#38bdf8'
  },
  {
    id: 'int-github-mcp',
    name: 'GitHub Repository MCP Server',
    provider: 'GitHub',
    type: 'mcp_server',
    totalRequests30d: 1120000,
    dailyAvgRequests: 37333,
    peakRps: 80,
    avgLatencyMs: 190,
    cost30d: 0.00,
    quotaPercent: 15,
    growthPercent: 62.4,
    color: '#a855f7'
  },
  {
    id: 'int-brave-search-mcp',
    name: 'Brave Search MCP Server',
    provider: 'Brave Software',
    type: 'mcp_server',
    totalRequests30d: 550000,
    dailyAvgRequests: 18333,
    peakRps: 35,
    avgLatencyMs: 780,
    cost30d: 15.00,
    quotaPercent: 91,
    growthPercent: 31.0,
    color: '#f59e0b'
  },
  {
    id: 'int-resend-email',
    name: 'Resend Transactional Email',
    provider: 'Resend',
    type: 'rest_api',
    totalRequests30d: 280000,
    dailyAvgRequests: 9333,
    peakRps: 22,
    avgLatencyMs: 88,
    cost30d: 20.00,
    quotaPercent: 34,
    growthPercent: 15.2,
    color: '#f43f5e'
  },
  {
    id: 'int-weather-legacy',
    name: 'OpenWeatherMap Legacy v2.5',
    provider: 'OpenWeather',
    type: 'rest_api',
    totalRequests30d: 95000,
    dailyAvgRequests: 3166,
    peakRps: 8,
    avgLatencyMs: 610,
    cost30d: 45.00,
    quotaPercent: 8,
    growthPercent: -34.0,
    color: '#71717a'
  }
];

const LOCAL_STORAGE_KEY_INTEGRATIONS = 'stackkeeper_integrations_v1';
const LOCAL_STORAGE_KEY_LOGS = 'stackkeeper_audit_logs_v1';
const LOCAL_STORAGE_KEY_USER = 'stackkeeper_user_v1';

export function getStoredIntegrations(): ApiIntegration[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_INTEGRATIONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse local storage integrations:', e);
  }
  return INITIAL_INTEGRATIONS;
}

export function saveStoredIntegrations(items: ApiIntegration[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_INTEGRATIONS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save integrations:', e);
  }
}

export function getStoredLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_LOGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse logs:', e);
  }
  return INITIAL_AUDIT_LOGS;
}

export function saveStoredLogs(logs: AuditLog[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs:', e);
  }
}

export function getStoredUser(): UserProfile {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse user profile:', e);
  }
  return INITIAL_USER;
}

export function saveStoredUser(user: UserProfile) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user:', e);
  }
}
