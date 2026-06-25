import { useMemo, useState } from "react";
import { Alert, Badge, Box, Divider, Pagination, Stack, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NotificationFilter } from "../components/NotificationFilter";
import { NotificationList } from "../components/NotificationList";
import { Loading } from "../components/Loading";
import { useNotifications } from "../hooks/useNotifications";
import { getTopUnreadNotifications, sortNotifications } from "../utils/priority";
import { VALID_FILTERS } from "../config";

const filterMap = {
  All: () => true,
  Placement: (notification) => (notification.type || notification.category) === "Placement",
  Result: (notification) => (notification.type || notification.category) === "Result",
  Event: (notification) => (notification.type || notification.category) === "Event",
};

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [topCount, setTopCount] = useState(10);

  const { notifications, pagedNotifications, totalPages, loading, error, page, setPage, markViewed } = useNotifications();

  const visibleNotifications = useMemo(() => {
    const filterFn = filterMap[filter] || filterMap.All;
    return sortNotifications(notifications.filter(filterFn));
  }, [filter, notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.viewed && !notification.read).length,
    [notifications]
  );

  const topNotifications = useMemo(() => getTopUnreadNotifications(notifications, topCount), [notifications, topCount]);

  const handleFilterChange = (_, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
      setPage(1);
    }
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleSetTopCount = (value) => {
    setTopCount(value);
  };

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3} flexWrap="wrap">
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>
          Notifications
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 3 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Top unread:
          </Typography>
          { [10, 15, 20].map((count) => (
            <Typography
              key={count}
              sx={{ cursor: "pointer", fontWeight: topCount === count ? 700 : 400 }}
              onClick={() => handleSetTopCount(count)}
            >
              {count}
            </Typography>
          )) }
        </Stack>
      </Box>

      {loading ? (
        <Loading />
      ) : error ? (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      ) : visibleNotifications.length === 0 ? (
        <Alert severity="info">No notifications match this filter.</Alert>
      ) : (
        <NotificationList notifications={pagedNotifications} onMarkViewed={markViewed} />
      )}

      {!loading && !error && visibleNotifications.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.max(1, Math.ceil(visibleNotifications.length / 10))}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {!loading && !error && topNotifications.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Top {topCount} Unread Notifications
          </Typography>
          <NotificationList notifications={topNotifications} onMarkViewed={markViewed} />
        </Box>
      )}
    </Box>
  );
}
