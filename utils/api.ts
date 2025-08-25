import { API_URL } from '@/config/api.config';
import { authStorage } from '@/lib/auth';
import { Field, UserProfile, UserType } from '@/types';

// Types for API responses
interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

// Types for booking data
interface BookingData {
    date_requested: string;
    time: string;
    duration: number;
    field: string;
    teamName?: string;
    client: string;
    total_price: number;
    statu?: string;
}

const getAuthHeaders = (): Record<string, string> => {
    if (typeof window !== 'undefined') {
        try {
            // Use the auth storage to get the properly decrypted token
            const token = authStorage.getToken();
            console.log('API Token Check:', { 
                hasToken: !!token, 
                tokenLength: token?.length,
                tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
            });
            return {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            };
        } catch (error) {
            console.error('Error getting auth token:', error);
            // Fallback to check for plain token
            const fallbackToken = localStorage.getItem('token');
            if (fallbackToken) {
                console.log('Using fallback token');
                return {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${fallbackToken}`,
                };
            }
        }
    }
    return {
        'Content-Type': 'application/json',
    };
};

export const apiCall = async <T = any>(
    endpoint: string, 
    options: RequestInit = {}
): Promise<T> => {
    const url = `${API_URL}${endpoint}`;
    const headers = getAuthHeaders();
    const config: RequestInit = {
        headers,
        ...options,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (response.status === 401) {
            // Token expired or invalid
            if (typeof window !== 'undefined') {
                // Use the auth storage to properly clear all auth data
                authStorage.clearAll();
                window.location.href = '/auth/login';
            }
            throw new Error('Authentication failed');
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${data.message || 'Request failed'}`);
        }

        return data;
    } catch (error) {
        console.error('API call failed:', {
            endpoint,
            error: error instanceof Error ? error.message : 'Unknown error',
            url
        });
        throw error;
    }
};

// Booking API functions
export const bookingAPI = {
    create: (bookingData: BookingData) => apiCall('/bookings/add', {
        method: 'POST',
        body: JSON.stringify(bookingData),
    }),
    
    
    // Admin functions
    getAll: () => apiCall('/bookings'), // Admin only
    
    getUserBookings: (userId: string) => apiCall(`/bookings/user/${userId}`),
    
    getById: (id: string) => apiCall(`/bookings/${id}`),
    
    update: (id: string, data: Partial<BookingData>) => {
        return apiCall(`/bookings/edit/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    
    complete: (id: string) => apiCall(`/bookings/completeBooking/${id}`, {
        method: 'PUT',
    }),
    
};

// Field API functions
export const fieldAPI = {
    getAll: () => apiCall('/fields'),
    
    getById: (id: string) => apiCall(`/fields/${id}`),
    
    create: (fieldData: FormData) => {
        const headers = getAuthHeaders();
        delete headers['Content-Type'];
        
        return apiCall('/fields/add', {
            method: 'POST',
            body: fieldData,
            headers,
        });
    },
    
    update: (id: string, data: FormData | Partial<FieldData>) => {
        if (data instanceof FormData) {
            const headers = getAuthHeaders();
            delete headers['Content-Type'];
            
            return apiCall(`/fields/${id}`, {
                method: 'PUT',
                body: data,
                headers,
            });
        } else {
            return apiCall(`/fields/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        }
    },
    
    delete: (id: string) => apiCall(`/fields/${id}`, {
        method: 'DELETE',
    }),
    
    // Field-specific methods
    getAvailable: (date?: string, startTime?: string, endTime?: string) => {
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        if (startTime) params.append('startTime', startTime);
        if (endTime) params.append('endTime', endTime);
        
        return apiCall(`/fields/available?${params.toString()}`);
    },
    
    getByType: (fieldType: string) => apiCall(`/fields/type/${fieldType}`),
    
    getPopular: () => apiCall('/fields/popular'),
    
    updateStatistics: (id: string, bookingAmount: number) => apiCall(`/fields/${id}/statistics`, {
        method: 'PUT',
        body: JSON.stringify({ bookingAmount }),
    }),
    
    addMaintenanceRecord: (id: string, maintenanceData: {
        description: string;
        cost?: number;
        performedBy?: string;
    }) => apiCall(`/fields/${id}/maintenance`, {
        method: 'POST',
        body: JSON.stringify(maintenanceData),
    }),
};

// Service API functions
export const serviceAPI = {
    getAll: () => apiCall('/services'),
    
    getById: (id: string) => apiCall(`/services/${id}`),
    
    create: (serviceData: FormData) => {
        // For FormData, we need to remove Content-Type header to let browser set it
        const headers = getAuthHeaders();
        delete headers['Content-Type'];
        
        return apiCall('/services/add', {
            method: 'POST',
            body: serviceData,
            headers,
        });
    },
    
    update: (id: string, data: FormData) => {
        const headers = getAuthHeaders();
        delete headers['Content-Type'];
        
        return apiCall(`/services/${id}`, {
            method: 'PUT',
            body: data,
            headers,
        });
    },
    
    delete: (id: string) => apiCall(`/services/${id}`, {
        method: 'DELETE',
    }),
};

// Additional interfaces for the other API entities
interface PaymentData {
    amount: number;
    method: string;
    bookingId?: string;
    userId: string;
    description?: string;
}

interface BlogData {
    title: string;
    content: string;
    excerpt?: string;
    published?: boolean;
}

interface UserData {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
}

interface FieldData {
    name: string;
    description: string;
    fieldType: string;
    price_per_hour: number;
    peak_hour_price?: number;
    weekend_price?: number;
    dimensions: {
        length: number;
        width: number;
        unit?: string;
    };
    surface: string;
    lighting?: {
        hasLighting: boolean;
        lightingType?: string;
    };
    status?: string;
    isAvailable?: boolean;
    operatingHours?: any;
    amenities?: string[];
    maxCapacity: {
        players: number;
        spectators?: number;
    };
    bookingRules?: any;
    images?: Array<{
        url: string;
        caption?: string;
        isPrimary?: boolean;
    }>;
    location?: {
        address?: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
}

// Payment API functions
export const paymentAPI = {
    // Admin functions
    getAll: () => apiCall('/payments'), // Admin only
    
    create: (paymentData: PaymentData) => apiCall('/payments/add', {
        method: 'POST',
        body: JSON.stringify(paymentData),
    }),
    
    getUserPayments: (userId: string) => apiCall(`/payments/user/${userId}`),
    
    getById: (id: string) => apiCall(`/payments/${id}`),
    
    edit: (id: string, data: Partial<PaymentData>) => apiCall(`/payments/edit/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
};

// Blog API functions
export const blogAPI = {
    getAll: () => apiCall('/blogs'),
    
    getById: (id: string) => apiCall(`/blogs/${id}`),
    
    create: (blogData: FormData) => {
        const headers = getAuthHeaders();
        delete headers['Content-Type'];
        
        return apiCall('/blogs/add', {
            method: 'POST',
            body: blogData,
            headers,
        });
    },
    
    update: (id: string, data: FormData) => {
        const headers = getAuthHeaders();
        delete headers['Content-Type'];
        
        return apiCall(`/blogs/${id}`, {
            method: 'PUT',
            body: data,
            headers,
        });
    },
    
    delete: (id: string) => apiCall(`/blogs/${id}`, {
        method: 'DELETE',
    }),
};

// User API functions
export const userAPI = {
    getAll: () => apiCall('/users'),
    
    getById: (id: string) => apiCall(`/users/${id}`),
    
    update: (id: string, data: Partial<UserType>) => apiCall(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    
    delete: (id: string) => apiCall(`/users/${id}`, {
        method: 'DELETE',
    }),
};

// General API object with common HTTP methods
export const api = {
    get: (endpoint: string) => apiCall(endpoint, { method: 'GET' }),
    
    post: (endpoint: string, data: any) => apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    put: (endpoint: string, data: any) => apiCall(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    
    delete: (endpoint: string) => apiCall(endpoint, { method: 'DELETE' }),
};
