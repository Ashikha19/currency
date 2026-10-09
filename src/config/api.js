/**
 * API Configuration
 * Centralized API endpoint management
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
const API_AUTH_PREFIX = "/api/auth";

export const API_ENDPOINTS = {
  // Auth
  SIGNUP: `${API_BASE_URL}${API_AUTH_PREFIX}/signup/`,
  LOGIN: `${API_BASE_URL}${API_AUTH_PREFIX}/login/`,

  // Expenses
  EXPENSES_LIST: `${API_BASE_URL}${API_AUTH_PREFIX}/expenses/`,
  EXPENSE_DETAIL: (id) => `${API_BASE_URL}${API_AUTH_PREFIX}/expenses/${id}/`,

  // Budget
  BUDGET: `${API_BASE_URL}${API_AUTH_PREFIX}/budget/`,
};

export default API_ENDPOINTS;
