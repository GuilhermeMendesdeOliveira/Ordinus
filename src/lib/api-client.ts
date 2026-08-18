const API_BASE_URL = import.meta.env['VITE_API_URL'] || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadTokens();
  }

  private loadTokens() {
    if (typeof window === 'undefined') return;
    this.accessToken = localStorage.getItem('ordinus_access_token');
    this.refreshToken = localStorage.getItem('ordinus_refresh_token');
  }

  private saveTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ordinus_access_token', accessToken);
      localStorage.setItem('ordinus_refresh_token', refreshToken);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ordinus_access_token');
      localStorage.removeItem('ordinus_refresh_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 - try to refresh token
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          // Retry the original request
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, { ...options, headers });
          return this.handleResponse<T>(retryResponse);
        }
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        data: null as T,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Erro de conexão com o servidor',
        },
      };
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (response.status === 204) {
      return { success: true, data: null as T };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null as T,
        error: data.error || {
          code: 'UNKNOWN_ERROR',
          message: 'Erro desconhecido',
        },
      };
    }

    return data;
  }

  private async tryRefreshToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      if (data.success && data.data) {
        this.saveTokens(data.data.access_token, data.data.refresh_token);
        return true;
      }

      this.clearTokens();
      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const result = await this.request<{ user: any; access_token: string; refresh_token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    if (result.success && result.data) {
      this.saveTokens(result.data.access_token, result.data.refresh_token);
    }

    return result;
  }

  async portalLogin(processNumber: string, cpfCnpj: string) {
    const result = await this.request<{ client: any; access_token: string; refresh_token: string }>(
      '/portal/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ process_number: processNumber, cpf_cnpj: cpfCnpj }),
      }
    );

    if (result.success && result.data) {
      this.saveTokens(result.data.access_token, result.data.refresh_token);
    }

    return result;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearTokens();
    }
  }

  async portalLogout() {
    try {
      await this.request('/portal/auth/logout', { method: 'POST' });
    } finally {
      this.clearTokens();
    }
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  async getPortalMe() {
    return this.request<any>('/portal/auth/me');
  }

  // Generic CRUD methods
  async get<T>(endpoint: string, params?: Record<string, string>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>(`${endpoint}${queryString}`);
  }

  async post<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async put<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async patch<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
