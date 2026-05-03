/**
 * Centralized API service for LayerLab backend communication.
 * Base URL: http://localhost:8081/api
 */

const BASE_URL = "http://localhost:8081/api";

/**
 * Generic fetch wrapper with JSON handling and error normalization.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Parse JSON body regardless of status (backend may return error details)
  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    // Throw an error with the backend message if available
    const message =
      data?.message ||
      data?.error ||
      `Erreur ${response.status}: ${response.statusText}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ─── Auth endpoints ────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{requiresTwoFactor: boolean, userId: number|null, token: string|null}>}
 */
export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * POST /api/auth/register
 * @param {object} payload - { firstName, lastName, email, password, phone, city }
 * @returns {Promise<{requiresTwoFactor: boolean, userId: number|null, token: string|null}>}
 */
export async function register(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * POST /api/auth/2fa/verify
 * @param {number} userId
 * @param {string} code - OTP code received by email
 * @returns {Promise<{requiresTwoFactor: boolean, token: string}>}
 */
export async function verifyTwoFactor(userId, code) {
  return request("/auth/2fa/verify", {
    method: "POST",
    body: JSON.stringify({ userId, otpCode: code }),
  });
}

/**
 * GET /api/auth/verify-email?token=...
 * @param {string} token - UUID token from the verification email link
 */
export async function verifyEmail(token) {
  return request(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: "GET",
  });
}
