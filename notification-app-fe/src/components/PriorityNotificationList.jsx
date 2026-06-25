import { Stack, Typography } from "@mui/material";
import { EmptyState } from "./EmptyState";
import { NotificationCard } from "./NotificationCard";

export function PriorityNotificationList({ notifications, onMarkViewed, topCount }) {
  if (!notifications || notifications.length === 0) {
    return <EmptyState title="No priority notifications" description="Unread top notifications will appear here." />;
  }

  return (
    <Stack spacing={2}>
      {notifications.map((notification, index) => (
        <div key={notification.id || notification._id || `${notification.createdAt}-${index}`}>
          <Typography variant="caption" color="text.secondary" mb={1} display="block">
            {index + 1}. Priority notification
          </Typography>
          <NotificationCard notification={notification} onMarkViewed={onMarkViewed} />
        </div>
      ))}
    </Stack>
  );
}
