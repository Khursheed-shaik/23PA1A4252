import { AUTH_API_BASE_URL } from "../config";
import { Log } from "../utils/logging";

const ACCESS_TOKEN_KEY = "accessToken";
const ACCESS_TOKEN_EXPIRY_KEY = "accessTokenExpiresAt";

function parseExpiry(value) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function getAccessToken() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const expiresAt = parseExpiry(localStorage.getItem(ACCESS_TOKEN_EXPIRY_KEY));

  if (!token || !expiresAt || Date.now() >= expiresAt) {
    clearAccessToken();
    return null;
  }

  return token;
}

export function setAccessToken(token, expiresInSeconds = 3600) {
  const expiresAt = Date.now() + Math.max(60, expiresInSeconds) * 1000;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(ACCESS_TOKEN_EXPIRY_KEY, String(expiresAt));
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRY_KEY);
}

export async function authenticate(clientId, clientSecret) {
  if (!clientId || !clientSecret) {
    throw new TypeError("Client ID and Client Secret are required");
  }

  await Log("frontend", "info", "auth", "Authentication request started");

  const response = await fetch(`${AUTH_API_BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clientId, clientSecret }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    await Log("frontend", "error", "auth", `Authentication failed: ${response.status} ${errorText}`);
    throw new Error(`Authentication failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data?.accessToken) {
    await Log("frontend", "error", "auth", "Authentication response missing accessToken");
    throw new Error("Authentication did not return an access token");
  }

  setAccessToken(data.accessToken, data.expiresIn ?? 3600);
  await Log("frontend", "info", "auth", "Authentication succeeded");
  return data.accessToken;
}

export function attachAuthHeaders(init = {}) {
  const token = getAccessToken();
  if (!token) {
    return init;
  }

  return {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
}
