import { useState, useEffect } from 'react';

// Call Django API via relative path proxying.
export const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DJANGO_URL) ||
  '';

/**
 * Helper to ensure EVERY image in the application connects to the Django backend.
 * Relative paths (e.g. /images/... or /media/...) are prefixed with backend base URL.
 */
export function getBackendImageUrl(src: string): string {
  if (!src) return '';
  if (src.startsWith('data:')) {
    return src;
  }
  let clean = src.replace(/\\/g, '/');

  // Strip protocol and domain host if present (e.g. http://127.0.0.1:8000 or http://localhost:8000)
  clean = clean.replace(/^https?:\/\/[^\/]+/, '');

  // Extract relative media or images API endpoint if raw disk path was passed
  if (clean.includes('/media/')) {
    clean = clean.substring(clean.indexOf('/media/'));
  } else if (clean.includes('media/')) {
    clean = '/' + clean.substring(clean.indexOf('media/'));
  } else if (clean.includes('/images/')) {
    clean = clean.substring(clean.indexOf('/images/'));
  } else if (clean.includes('images/')) {
    clean = '/' + clean.substring(clean.indexOf('images/'));
  } else if (!clean.startsWith('/')) {
    clean = '/media/' + clean;
  }

  // Rewrite .png to .webp for 91% lighter image payloads & blazing fast speeds
  if (clean.endsWith('.png')) {
    clean = clean.slice(0, -4) + '.webp';
  } else if (clean.includes('.png?')) {
    clean = clean.replace('.png?', '.webp?');
  }

  if (BASE_URL) {
    return `${BASE_URL}${clean}`;
  }
  return clean;
}

/**
 * Global image error handler to hide broken/missing images when backend image is deleted or missing.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>
) {
  const target = e.currentTarget;
  target.style.display = 'none';
  if (target.parentElement) {
    target.parentElement.style.display = 'none';
  }
}

/**
 * React hook to dynamically fetch & sync page banner images from Django Backend API.
 * Falls back gracefully to defaultImage if no custom backend banner is uploaded.
 */
export function useBanner(pageKey: string, defaultImage?: string) {
  const initialImage = defaultImage ? getBackendImageUrl(defaultImage) : '';
  const [banner, setBanner] = useState<{ image: string; title?: string; subtitle?: string }>({
    image: initialImage,
  });

  useEffect(() => {
    let isMounted = true;
    apiClient.getBanner(pageKey)
      .then((data) => {
        if (isMounted) {
          if (data && data.image) {
            setBanner({
              image: getBackendImageUrl(data.image),
              title: data.title,
              subtitle: data.subtitle,
            });
          } else if (defaultImage) {
            setBanner({
              image: getBackendImageUrl(defaultImage),
              title: data?.title,
              subtitle: data?.subtitle,
            });
          }
        }
      })
      .catch(() => {
        if (isMounted && defaultImage) {
          setBanner({ image: getBackendImageUrl(defaultImage) });
        }
      });
    return () => { isMounted = false; };
  }, [pageKey, defaultImage]);

  return banner;
}

// ---------------------------------------------------------------------------
// Typed API Error — includes HTTP status so callers can handle 401 etc.
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) return response.json();
  let message = `HTTP ${response.status}`;
  try {
    const body = await response.json();
    message = body.error || body.detail || message;
  } catch {
    // non-JSON error body — keep generic message
  }
  throw new ApiError(response.status, message);
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Shared interfaces — mirror Django models exactly
// ---------------------------------------------------------------------------

export interface Resort {
  id: number;
  slug: string;
  name: string;
  location: string;
  description: string;
  tagline: string;
  rating: number;
  priceStart: number | string;
  region: string;
  image: string;
  inclusions: string[];
}

export interface Room {
  id: number;
  resort: number;
  resort_name?: string;
  resort_slug?: string;
  room_type: string;
  price: string;
  is_available: boolean;
  image?: string;
  interior_image?: string;
}

export interface Service {
  id: number;
  resort?: number;
  name: string;
  category?: 'wellness' | 'dining' | 'experiences' | 'general';
  description: string;
  image?: string;
}

export interface Booking {
  id?: number;
  room: number;
  room_details?: Room;
  start_date: string;
  end_date: string;
  guests?: number;
  special_requests?: string;
  status?: 'confirmed' | 'cancelled' | 'completed';
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: 'card' | 'upi' | 'netbanking' | 'razorpay' | 'express_concierge';
  payment_id?: string;
  paid_at?: string;
  total_price?: string;
  created_at?: string;
}

export interface PaymentSessionRequest {
  room: number;
  start_date: string;
  end_date: string;
  payment_method: 'card' | 'upi' | 'netbanking' | 'razorpay' | 'express_concierge';
}

export interface PaymentSessionResponse {
  payment_id: string;
  client_secret: string;
  amount: number;
  currency: string;
  payment_method: string;
  upi_intent_url?: string;
  resort_name: string;
  room_type: string;
  nights: number;
  status: string;
}

export interface ConfirmPaymentRequest {
  room: number;
  start_date: string;
  end_date: string;
  guests: number;
  special_requests?: string;
  payment_method: string;
  payment_id: string;
}

export interface PaymentReceipt {
  invoice_number: string;
  booking_id: number;
  guest_name: string;
  guest_email: string;
  resort_name: string;
  resort_location: string;
  room_type: string;
  start_date: string;
  end_date: string;
  nights: number;
  guests: number;
  payment_status: string;
  payment_method: string;
  payment_id: string;
  paid_at: string;
  nightly_rate: number;
  subtotal: number;
  gst_tax_included: number;
  grand_total: number;
  inclusions: string[];
}

export interface UserProfile {
  username: string;
  email: string;
  date_joined?: string;
  tier?: string;
  total_bookings?: number;
  active_bookings?: number;
  total_spent?: string;
}

export interface Inquiry {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  resort?: string;
  subject?: string;
  message: string;
  created_at?: string;
}

export interface Banner {
  id: number;
  page: string;
  title: string;
  subtitle: string;
  image: string;
}

// ---------------------------------------------------------------------------
// API Client
// Auth column: ❌ = AllowAny (no token needed)  ✅ = IsAuthenticated (token required)
// ---------------------------------------------------------------------------

export const apiClient = {

  // ── Resorts ──────────────────────────────────────── ❌ public

  getResorts: async (): Promise<Resort[]> => {
    const res = await fetchWithTimeout(`${BASE_URL}/api/resorts/`);
    const data = await handleResponse<Resort[]>(res);
    return data.map((r) => ({
      ...r,
      image: getBackendImageUrl(r.image),
    }));
  },

  getResort: async (slug: string): Promise<Resort> => {
    const res = await fetchWithTimeout(`${BASE_URL}/api/resorts/${slug}/`);
    const data = await handleResponse<Resort>(res);
    return {
      ...data,
      image: getBackendImageUrl(data.image),
    };
  },

  // ── Rooms ─────────────────────────────────────────── ❌ public

  getRooms: async (): Promise<Room[]> => {
    const res = await fetchWithTimeout(`${BASE_URL}/api/rooms/`);
    const data = await handleResponse<Room[]>(res);
    return data.map((rm) => ({
      ...rm,
      image: rm.image ? getBackendImageUrl(rm.image) : '',
      interior_image: rm.interior_image ? getBackendImageUrl(rm.interior_image) : '',
    }));
  },

  // ── Services ──────────────────────────────────────── ❌ public

  getServices: async (category?: string): Promise<Service[]> => {
    const url = category
      ? `${BASE_URL}/api/services/?category=${encodeURIComponent(category)}`
      : `${BASE_URL}/api/services/`;
    const res = await fetchWithTimeout(url);
    const data = await handleResponse<Service[]>(res);
    return data.map((svc) => ({
      ...svc,
      image: svc.image ? getBackendImageUrl(svc.image) : '',
    }));
  },

  // ── Banners ───────────────────────────────────────── ❌ public

  getBanners: async (): Promise<Banner[]> => {
    const res = await fetchWithTimeout(`${BASE_URL}/api/banners/`);
    const data = await handleResponse<Banner[]>(res);
    return data.map((b) => ({
      ...b,
      image: getBackendImageUrl(b.image),
    }));
  },

  getBanner: async (page: string): Promise<Banner> => {
    const res = await fetchWithTimeout(`${BASE_URL}/api/banners/${page}/`);
    const data = await handleResponse<Banner>(res);
    return {
      ...data,
      image: getBackendImageUrl(data.image),
    };
  },

  // ── Inquiries & Newsletter ────────────────────────── ❌ public

  submitInquiry: async (inquiry: Inquiry): Promise<Inquiry> => {
    const res = await fetch(`${BASE_URL}/api/inquiries/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    });
    return handleResponse<Inquiry>(res);
  },

  subscribeNewsletter: async (email: string): Promise<{ message: string }> => {
    const res = await fetch(`${BASE_URL}/api/subscribe/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // ── Concierge API ──────────────────────────────────── ❌ public

  sendConciergeMessage: async (message: string): Promise<{ response: string }> => {
    const res = await fetch(`${BASE_URL}/api/concierge/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return handleResponse<{ response: string }>(res);
  },

  // ── Authentication ────────────────────────────────── ❌ public

  login: async (credentials: { username: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/api/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse<{ token: string }>(res);
  },

  register: async (userData: { username: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/api/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse<{ token: string }>(res);
  },

  googleLogin: async (idToken: string): Promise<{ token: string }> => {
    const res = await fetch(`${BASE_URL}/api/google-login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken }),
    });
    return handleResponse<{ token: string }>(res);
  },

  // ── Protected — require Authorization: Token <token> ── ✅ auth required

  getProfile: async (token: string): Promise<UserProfile> => {
    const res = await fetch(`${BASE_URL}/api/profile/`, {
      headers: { 'Authorization': `Token ${token}` },
    });
    return handleResponse<UserProfile>(res);
  },

  createBooking: async (
    bookingData: Partial<Booking>,
    token: string,
  ): Promise<Booking> => {
    const res = await fetch(`${BASE_URL}/api/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    return handleResponse<Booking>(res);
  },

  cancelBooking: async (bookingId: number, token: string): Promise<Booking> => {
    const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({ status: 'cancelled' }),
    });
    return handleResponse<Booking>(res);
  },

  getBookings: async (token: string): Promise<Booking[]> => {
    const res = await fetch(`${BASE_URL}/api/bookings/`, {
      headers: { 'Authorization': `Token ${token}` },
    });
    return handleResponse<Booking[]>(res);
  },

  createPaymentSession: async (
    sessionData: PaymentSessionRequest,
    token: string
  ): Promise<PaymentSessionResponse> => {
    const res = await fetch(`${BASE_URL}/api/payments/create-session/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(sessionData),
    });
    return handleResponse<PaymentSessionResponse>(res);
  },

  confirmPayment: async (
    confirmData: ConfirmPaymentRequest,
    token: string
  ): Promise<Booking> => {
    const res = await fetch(`${BASE_URL}/api/payments/confirm/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(confirmData),
    });
    return handleResponse<Booking>(res);
  },

  getPaymentReceipt: async (
    bookingId: number,
    token: string
  ): Promise<PaymentReceipt> => {
    const res = await fetch(`${BASE_URL}/api/payments/receipt/${bookingId}/`, {
      headers: { 'Authorization': `Token ${token}` },
    });
    return handleResponse<PaymentReceipt>(res);
  },
};

