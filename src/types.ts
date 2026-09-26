export type IntegrationType = 'rest_api' | 'mcp_server' | 'graphql' | 'webhook';
export type IntegrationStatus = 'healthy' | 'degraded' | 'down' | 'deprecated' | 'unreachable';
export type TransportType = 'stdio' | 'sse' | 'http_bearer' | 'api_key' | 'oauth2';

export interface McpTool {
  name: string;
  description: string;
  parametersCount: number;
  accessScope: string;
}

export interface ApiIntegration {
  id: string;
  name: string;
  provider: string;
  type: IntegrationType;
  endpoint: string;
  transport: TransportType;
  status: IntegrationStatus;
  keyLocation: string;
  lastRotated: string;
  expiresAt: string;
  owner: string;
  ownerEmail: string;
  repos: string[];
  environment: 'production' | 'staging' | 'development';
  monthlyCost: number;
  freeTierLimit: string;
  currentUsagePercent: number;
  rateLimitRpm: number;
  latencyMs: number;
  lastHealthCheck: string;
  mcpTools?: McpTool[];
  mcpServerVersion?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Engineering Lead' | 'Developer' | 'Viewer';
  avatarUrl: string;
  workspace: string;
  plan: 'Free' | 'Pro' | 'Team';
  apiKey?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userEmail: string;
  action: 'CREATED' | 'ROTATED' | 'SCANNED' | 'TESTED' | 'REVOKED' | 'ALERT_TRIGGERED';
  targetName: string;
  targetType: IntegrationType;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface RepoScanResult {
  repoName: string;
  branch: string;
  scannedAt: string;
  totalFilesScanned: number;
  detectedApisCount: number;
  detectedMcpsCount: number;
  hiddenKeysFound: {
    file: string;
    line: number;
    provider: string;
    type: string;
  }[];
  deprecatedCalls: {
    file: string;
    apiName: string;
    warningMessage: string;
  }[];
  mcpConfigFilesFound: string[];
}

export interface AnalyticsMetric {
  time: string;
  latencyMs: number;
  requestsPerMin: number;
  errorsCount: number;
  costRate: number;
}

export interface DailyRequestMetric {
  dayIndex: number;
  date: string;
  fullDate: string;
  totalRequests: number;
  restApiRequests: number;
  mcpRequests: number;
  graphqlRequests: number;
  errorRequests: number;
  activeDependenciesCount: number;
  avgLatencyMs: number;
  topDependency: string;
}

export interface DependencyUsage30d {
  id: string;
  name: string;
  provider: string;
  type: IntegrationType;
  totalRequests30d: number;
  dailyAvgRequests: number;
  peakRps: number;
  avgLatencyMs: number;
  cost30d: number;
  quotaPercent: number;
  growthPercent: number;
  color: string;
}
