import { Stack } from "@mui/material";
import { EmptyState } from "./EmptyState";
import { NotificationCard } from "./NotificationCard";

export function NotificationList({ notifications, onMarkViewed }) {
  if (!notifications || notifications.length === 0) {
    return <EmptyState title="No notifications found" description="Try changing filters or check back later." />;
  }

  return (
    <Stack spacing={2}>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id || notification._id || notification.createdAt} notification={notification} onMarkViewed={onMarkViewed} />
      ))}
    </Stack>
  );
}
