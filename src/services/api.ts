/**
 * API Service for 99Sellers Backend
 * Connects frontend to Express API running on port 3001
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Token management
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('99sellers_token');
};

const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('99sellers_token', token);
  }
};

const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('99sellers_token');
  }
};

// Base fetch wrapper with auth
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};

// Generic API response handler
const handleResponse = async <T>(response: Response): Promise<{ success: boolean; data?: T; error?: string }> => {
  if (response.ok) {
    const data = await response.json();
    return { success: true, data };
  } else {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    return { success: false, error: error.error || error.message || 'Request failed' };
  }
};

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetchWithAuth('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    const result = await handleResponse<{ token: string; userType: string }>(response);
    
    if (result.success && result.data?.token) {
      setToken(result.data.token);
    }
    
    return result;
  },

  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    contact?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }) => {
    const response = await fetchWithAuth('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    return handleResponse<{ message: string }>(response);
  },

  logout: () => {
    removeToken();
  },

  getToken,
  setToken,
  removeToken,
};

// ============================================
// PROPERTIES API
// ============================================
export interface Property {
  id: number;
  PType?: string;
  PStreetNum?: string;
  PStreetName?: string;
  PCity?: string;
  PState?: string;
  PZip?: string;
  PPrice?: string;
  PSqFt?: string;
  PYearBuilt?: string;
  PBeds?: string;
  PBaths?: string;
  PFloors?: string;
  PDescription?: string;
  PLat?: number;
  PLng?: number;
  // Extended fields
  hasAuction?: boolean;
  hasLoan?: boolean;
  equityRange?: string;
  leadScore?: number;
}

export const propertiesAPI = {
  getAll: async (filters?: { type?: string; city?: string }) => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.city) params.append('city', filters.city);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetchWithAuth(`/api/properties${query}`);
    
    return handleResponse<Property[]>(response);
  },

  getById: async (id: number) => {
    const response = await fetchWithAuth(`/api/properties/${id}`);
    return handleResponse<Property>(response);
  },

  getNearby: async (location: string) => {
    const response = await fetchWithAuth(`/api/nearby?location=${encodeURIComponent(location)}`);
    return handleResponse<Property[]>(response);
  },
};

// ============================================
// AUCTIONS API
// ============================================
export interface Auction {
  id: number;
  AAuctionID?: string;
  AAuctionDateTime?: string;
  AAuctionPlace?: string;
  AAuctionState?: string;
  AAuctionZip?: string;
  AAuctionDescription?: string;
  propertyId?: number;
}

export const auctionsAPI = {
  getLive: async () => {
    const response = await fetchWithAuth('/api/auctions');
    return handleResponse<Auction[]>(response);
  },
};

// ============================================
// PREMIUM API
// ============================================
export const premiumAPI = {
  getPropertiesWithEquity: async () => {
    const response = await fetchWithAuth('/api/premium/properties/equity');
    return handleResponse<Property[]>(response);
  },

  getAuctionLeads: async () => {
    const response = await fetchWithAuth('/api/premium/auctions/leads');
    return handleResponse<Auction[]>(response);
  },

  getOwnerLeads: async () => {
    const response = await fetchWithAuth('/api/premium/owners/leads');
    return handleResponse<any[]>(response);
  },

  getLoanLeads: async () => {
    const response = await fetchWithAuth('/api/premium/loans/leads');
    return handleResponse<any[]>(response);
  },
};

// ============================================
// SUBSCRIPTION API
// ============================================
export interface SubscriptionPlan {
  id: number;
  name: string;
  type: string;
  billingCycle: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  limits: Record<string, number>;
  trialDays: number;
  popular: boolean;
}

export interface SubscriptionStatus {
  id: number;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
  billingCycle: string;
  price: number;
  autoRenew: boolean;
  features: Record<string, any>;
  trial?: {
    trialType: string;
    startDate: string;
    endDate: string;
    daysRemaining: number;
    status: string;
  };
}

export const subscriptionAPI = {
  getPlans: async () => {
    const response = await fetchWithAuth('/api/subscription/plans');
    return handleResponse<SubscriptionPlan[]>(response);
  },

  getStatus: async () => {
    const response = await fetchWithAuth('/api/subscription/status');
    return handleResponse<SubscriptionStatus>(response);
  },

  startTrial: async () => {
    const response = await fetchWithAuth('/api/subscription/trial/start', {
      method: 'POST',
    });
    return handleResponse<{ message: string }>(response);
  },

  getTrialUsage: async () => {
    const response = await fetchWithAuth('/api/subscription/trial/usage');
    return handleResponse<any>(response);
  },

  create: async (planId: number, billingCycle: string) => {
    const response = await fetchWithAuth('/api/subscription/create', {
      method: 'POST',
      body: JSON.stringify({ planId, billingCycle }),
    });
    return handleResponse<{ message: string; subscriptionId: number }>(response);
  },

  cancel: async () => {
    const response = await fetchWithAuth('/api/subscription/cancel', {
      method: 'POST',
    });
    return handleResponse<{ message: string }>(response);
  },

  update: async (data: { planId?: number; billingCycle?: string; autoRenew?: boolean }) => {
    const response = await fetchWithAuth('/api/subscription/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(response);
  },

  getPaymentMethods: async () => {
    const response = await fetchWithAuth('/api/subscription/payment-methods');
    return handleResponse<any[]>(response);
  },

  addPaymentMethod: async (paymentMethodId: string) => {
    const response = await fetchWithAuth('/api/subscription/payment-methods', {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId }),
    });
    return handleResponse<{ message: string }>(response);
  },

  setDefaultPaymentMethod: async (paymentMethodId: string) => {
    const response = await fetchWithAuth('/api/subscription/payment-methods/default', {
      method: 'PUT',
      body: JSON.stringify({ paymentMethodId }),
    });
    return handleResponse<{ message: string }>(response);
  },
};

// ============================================
// ADMIN API
// ============================================
export const adminAPI = {
  // Users
  users: {
    getAll: async () => {
      const response = await fetchWithAuth('/api/admin/users');
      return handleResponse<any[]>(response);
    },
    getById: async (id: number) => {
      const response = await fetchWithAuth(`/api/admin/users/${id}`);
      return handleResponse<any>(response);
    },
    getStats: async () => {
      const response = await fetchWithAuth('/api/admin/users/stats');
      return handleResponse<any>(response);
    },
    create: async (data: any) => {
      const response = await fetchWithAuth('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return handleResponse<any>(response);
    },
    update: async (id: number, data: any) => {
      const response = await fetchWithAuth(`/api/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return handleResponse<any>(response);
    },
    delete: async (id: number) => {
      const response = await fetchWithAuth(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<{ message: string }>(response);
    },
    toggleStatus: async (id: number) => {
      const response = await fetchWithAuth(`/api/admin/users/${id}/toggle-status`, {
        method: 'PUT',
      });
      return handleResponse<any>(response);
    },
  },

  // Properties
  properties: {
    getAll: async () => {
      const response = await fetchWithAuth('/api/admin/properties');
      return handleResponse<Property[]>(response);
    },
    getStats: async () => {
      const response = await fetchWithAuth('/api/admin/properties/stats');
      return handleResponse<any>(response);
    },
    create: async (data: FormData) => {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/properties`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: data, // FormData for file upload
      });
      return handleResponse<any>(response);
    },
    update: async (id: number, data: any) => {
      const response = await fetchWithAuth(`/api/admin/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return handleResponse<any>(response);
    },
    delete: async (id: number) => {
      const response = await fetchWithAuth(`/api/admin/properties/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<{ message: string }>(response);
    },
  },

  // Auctions
  auctions: {
    getAll: async () => {
      const response = await fetchWithAuth('/api/admin/auctions');
      return handleResponse<Auction[]>(response);
    },
    getUpcoming: async () => {
      const response = await fetchWithAuth('/api/admin/auctions/upcoming');
      return handleResponse<Auction[]>(response);
    },
    create: async (data: FormData) => {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/auctions`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: data,
      });
      return handleResponse<any>(response);
    },
    update: async (id: number, data: any) => {
      const response = await fetchWithAuth(`/api/admin/auctions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return handleResponse<any>(response);
    },
    delete: async (id: number) => {
      const response = await fetchWithAuth(`/api/admin/auctions/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<{ message: string }>(response);
    },
  },

  // Owners
  owners: {
    getAll: async () => {
      const response = await fetchWithAuth('/api/admin/owners');
      return handleResponse<any[]>(response);
    },
    getStats: async () => {
      const response = await fetchWithAuth('/api/admin/owners/stats');
      return handleResponse<any>(response);
    },
    getById: async (id: number) => {
      const response = await fetchWithAuth(`/api/admin/owners/${id}`);
      return handleResponse<any>(response);
    },
    getByProperty: async (propertyId: number) => {
      const response = await fetchWithAuth(`/api/admin/owners/property/${propertyId}`);
      return handleResponse<any[]>(response);
    },
    create: async (data: any) => {
      const response = await fetchWithAuth('/api/admin/owners', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return handleResponse<any>(response);
    },
    update: async (id: number, data: any) => {
      const response = await fetchWithAuth(`/api/admin/owners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return handleResponse<any>(response);
    },
    delete: async (id: number) => {
      const response = await fetchWithAuth(`/api/admin/owners/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<{ message: string }>(response);
    },
  },

  // Loans
  loans: {
    getAll: async () => {
      const response = await fetchWithAuth('/api/admin/loans');
      return handleResponse<any[]>(response);
    },
    getStats: async () => {
      const response = await fetchWithAuth('/api/admin/loans/stats');
      return handleResponse<any>(response);
    },
    getById: async (id: number) => {
      const response = await fetchWithAuth(`/api/admin/loans/${id}`);
      return handleResponse<any>(response);
    },
    getByProperty: async (propertyId: number) => {
      const response = await fetchWithAuth(`/api/admin/loans/property/${propertyId}`);
      return handleResponse<any[]>(response);
    },
    create: async (data: any) => {
      const response = await fetchWithAuth('/api/admin/loans', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return handleResponse<any>(response);
    },
    update: async (id: number, data: any) => {
      const response = await fetchWithAuth(`/api/admin/loans/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return handleResponse<any>(response);
    },
    delete: async (id: number) => {
      const response = await fetchWithAuth(`/api/admin/loans/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<{ message: string }>(response);
    },
  },

  // Subscriptions
  subscriptions: {
    getAll: async () => {
      const response = await fetchWithAuth('/api/admin/subscriptions');
      return handleResponse<any>(response);
    },
    getStats: async () => {
      const response = await fetchWithAuth('/api/admin/subscriptions/stats');
      return handleResponse<any>(response);
    },
    cancel: async (id: number) => {
      const response = await fetchWithAuth(`/api/admin/subscriptions/${id}/cancel`, {
        method: 'PUT',
      });
      return handleResponse<any>(response);
    },
    update: async (id: number, data: any) => {
      const response = await fetchWithAuth(`/api/admin/subscriptions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return handleResponse<any>(response);
    },
  },

  // Crawler
  crawler: {
    getRuns: async () => {
      const response = await fetchWithAuth('/api/admin/crawler/runs');
      return handleResponse<any[]>(response);
    },
    getErrors: async () => {
      const response = await fetchWithAuth('/api/admin/crawler/errors');
      return handleResponse<any[]>(response);
    },
  },
};

// Export all APIs
export default {
  auth: authAPI,
  properties: propertiesAPI,
  auctions: auctionsAPI,
  premium: premiumAPI,
  subscription: subscriptionAPI,
  admin: adminAPI,
};
