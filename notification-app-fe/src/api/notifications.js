import { fetchJson } from "./client";
import { MOCK_NOTIFICATIONS } from "./mockData";

export async function fetchNotifications() {
  try {
    return await fetchJson("/notifications");
  } catch (error) {
    console.warn("Failed to fetch from backend, using mock data:", error.message);
    return MOCK_NOTIFICATIONS;
  }
}

export async function markNotificationViewed(notificationId) {
  try {
    return await fetchJson(`/notifications/${notificationId}/view`, { method: "POST" });
  } catch (error) {
    console.warn("Failed to mark notification viewed on backend, using local state:", error.message);
    return { success: true, id: notificationId };
  }
}
