import { Box, Button, Card, CardActions, CardContent, Chip, Stack, Typography } from "@mui/material";

const categoryColors = {
  Placement: "primary",
  Result: "success",
  Event: "warning",
};

export function NotificationCard({ notification, onMarkViewed }) {
  const viewed = notification.viewed || notification.read || false;
  const category = notification.type || notification.category || "General";
  const createdAt = notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "Unknown";

  return (
    <Card
      sx={{
        borderColor: viewed ? "divider" : "primary.main",
        backgroundColor: viewed ? "background.paper" : "rgba(25, 118, 210, 0.06)",
      }}
      variant="outlined"
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} mb={1}>
          <Typography variant="subtitle1" fontWeight={700}>
            {notification.title || notification.subject || "Untitled notification"}
          </Typography>
          <Chip label={viewed ? "Viewed" : "Unread"} color={viewed ? "default" : "primary"} size="small" />
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
          <Chip label={category} color={categoryColors[category] || "default"} size="small" />
          {notification.priority && <Chip label={notification.priority} size="small" />}
        </Stack>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {notification.message || notification.description || "No details provided."}
        </Typography>

        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Typography variant="caption" color="text.secondary">
            {createdAt}
          </Typography>
          {notification.source && (
            <Typography variant="caption" color="text.secondary">
              Source: {notification.source}
            </Typography>
          )}
        </Box>
      </CardContent>

      {!viewed && onMarkViewed ? (
        <CardActions>
          <Button size="small" onClick={() => onMarkViewed(notification.id)}>
            Mark viewed
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
}
