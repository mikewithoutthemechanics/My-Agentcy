/**
 * My-Agentcy Frontend — API Service Layer
 * Connects React app to FastAPI backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.token = localStorage.getItem('my-agentcy-token')
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('my-agentcy-token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('my-agentcy-token')
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }))
      throw new Error(error.detail || 'API request failed')
    }

    return res.json()
  }

  get<T>(path: string) { return this.request<T>(path) }
  post<T>(path: string, body: unknown) { return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) }) }
  put<T>(path: string, body: unknown) { return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) }) }
  delete<T>(path: string) { return this.request<T>(path, { method: 'DELETE' }) }
}

export const api = new ApiClient(API_BASE)

// ── Task API ──────────────────────────────────────────

export interface Task {
  id: string
  title: string
  description: string
  task_type: string
  priority: number
  tier: string
  status: string
  brief: Record<string, unknown>
  requirements: string[]
  deadline?: string
  created_at: string
}

export const taskApi = {
  list: (status?: string) => api.get<{ tasks: Task[]; total: number }>(`/api/tasks${status ? `?status=${status}` : ''}`),
  get: (id: string) => api.get<Task>(`/api/tasks/${id}`),
  create: (task: Partial<Task>) => api.post<Task>('/api/tasks/', task),
  deliver: (id: string) => api.post(`/api/tasks/${id}/deliver`, {}),
  revise: (id: string, notes: string) => api.post(`/api/tasks/${id}/revise`, { notes }),
}

// ── Agent API ─────────────────────────────────────────

export interface Agent {
  id: string
  role: string
  status: string
  active_tasks: number
}

export const agentApi = {
  list: () => api.get<{ agents: Agent[] }>('/api/agents/'),
  get: (id: string) => api.get<Agent>(`/api/agents/${id}`),
  memory: (id: string) => api.get(`/api/agents/${id}/memory`),
}

// ── QA API ────────────────────────────────────────────

export const qaApi = {
  queue: () => api.get('/api/qa/queue'),
  approve: (id: string) => api.post(`/api/qa/${id}/approve`, {}),
  reject: (id: string, reason: string) => api.post(`/api/qa/${id}/reject`, { reason }),
  stats: () => api.get('/api/qa/stats'),
  rubrics: () => api.get('/api/qa/rubrics'),
}

// ── Billing API ───────────────────────────────────────

export const billingApi = {
  costs: () => api.get('/api/billing/costs'),
  taskCosts: (taskId: string) => api.get(`/api/billing/costs/task/${taskId}`),
  invoices: () => api.get('/api/billing/invoices'),
  generateInvoice: (orgId: string) => api.post('/api/billing/invoices/generate', { org_id: orgId }),
}

// ── Dashboard API ─────────────────────────────────────

export const dashboardApi = {
  overview: () => api.get('/api/dashboard/overview'),
  agentPerformance: () => api.get('/api/dashboard/agent-performance'),
  qaInsights: () => api.get('/api/dashboard/qa-insights'),
  costTrend: (days: number = 30) => api.get(`/api/dashboard/cost-trend?days=${days}`),
}

// ── Feedback API ──────────────────────────────────────

export const feedbackApi = {
  submit: (taskId: string, rating: number, feedback: string) =>
    api.post('/api/feedback/', { task_id: taskId, rating, feedback }),
  requestRevision: (taskId: string, notes: string) =>
    api.post('/api/feedback/revise', { task_id: taskId, notes }),
  summary: () => api.get('/api/feedback/summary'),
}
