import { NOTIFICATION_API_BASE_URL } from "../config";
import { attachAuthHeaders } from "./auth";
import { Log } from "../utils/logging";

const defaultHeaders = { "Content-Type": "application/json" };

function resolveUrl(path) {
  return path.startsWith("http") ? path : `${NOTIFICATION_API_BASE_URL}${path}`;
}

export async function fetchJson(path, options = {}) {
  const url = resolveUrl(path);
  const init = attachAuthHeaders({
    method: options.method ?? "GET",
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    body: options.body != null && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body,
  });

  await Log("frontend", "debug", "api", `API request started: ${init.method} ${url}`);

  try {
    const response = await fetch(url, init);
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const error = new Error(`Request failed ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.response = data;
      await Log("frontend", "error", "api", `API request failed: ${init.method} ${url} ${response.status}`);
      throw error;
    }

    await Log("frontend", "debug", "api", `API request succeeded: ${init.method} ${url}`);
    return data;
  } catch (error) {
    await Log("frontend", "fatal", "api", `API request error: ${error.message}`);
    throw error;
  }
}
