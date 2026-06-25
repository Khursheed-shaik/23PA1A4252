import { LOGGING_API_BASE_URL } from "../config";

const validStacks = new Set(["frontend"]);
const validLevels = new Set(["debug", "info", "warn", "error", "fatal"]);
const validPackages = new Set([
  "api",
  "component",
  "hook",
  "page",
  "state",
  "auth",
  "config",
  "middleware",
  "utils",
]);

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateLogInput(stack, level, packageName, message) {
  if (!validStacks.has(stack)) {
    throw new TypeError(`Invalid log stack: ${stack}`);
  }
  if (!validLevels.has(level)) {
    throw new TypeError(`Invalid log level: ${level}`);
  }
  if (!validPackages.has(packageName)) {
    throw new TypeError(`Invalid log package: ${packageName}`);
  }
  if (!normalizeText(message)) {
    throw new TypeError("Log message must be a non-empty string");
  }
}

export async function Log(stack, level, packageName, message) {
  try {
    validateLogInput(stack, level, packageName, message);

    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${LOGGING_API_BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Logging API returned ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Logging failed", error);
    return null;
  }
}
