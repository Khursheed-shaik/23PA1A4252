import { useState, useEffect, useCallback } from "react";
import { fetchNotifications, markNotificationViewed } from "../api/notifications";
import { Log } from "../utils/logging";
import { sortNotifications } from "../utils/priority";

const PAGE_SIZE = 10;

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Log("frontend", "info", "hook", "Fetching notifications");
      const data = await fetchNotifications();
      const list = Array.isArray(data) ? data : data.notifications ?? [];
      setNotifications(sortNotifications(list));
      await Log("frontend", "info", "hook", "Notifications loaded successfully");
    } catch (loadError) {
      setError(loadError.message || "Unable to load notifications");
      await Log("frontend", "error", "hook", `Notification fetch failed: ${loadError.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markViewed = useCallback(
    async (notificationId) => {
      try {
        await Log("frontend", "info", "hook", `Mark notification viewed: ${notificationId}`);
        await markNotificationViewed(notificationId);
        setNotifications((current) =>
          current.map((notification) =>
            notification.id === notificationId || notification._id === notificationId
              ? { ...notification, viewed: true }
              : notification
          )
        );
      } catch (markError) {
        await Log("frontend", "warn", "hook", `Unable to mark notification viewed: ${markError.message}`);
      }
    },
    []
  );

  const totalPages = Math.max(1, Math.ceil(notifications.length / PAGE_SIZE));

  const pagedNotifications = notifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    notifications,
    pagedNotifications,
    total: notifications.length,
    totalPages,
    loading,
    error,
    page,
    setPage,
    markViewed,
    loadNotifications,
  };
}
