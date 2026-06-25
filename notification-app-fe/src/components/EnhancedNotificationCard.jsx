import { Box, Button, Card, CardActions, CardContent, Chip, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlagIcon from "@mui/icons-material/Flag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const categoryStyles = {
  Placement: {
    borderColor: "#1e88e5",
    backgroundColor: "rgba(30, 136, 229, 0.04)",
    chipColor: "primary",
    icon: "💼",
  },
  Result: {
    borderColor: "#43a047",
    backgroundColor: "rgba(67, 160, 71, 0.04)",
    chipColor: "success",
    icon: "📊",
  },
  Event: {
    borderColor: "#fb8c00",
    backgroundColor: "rgba(251, 140, 0, 0.04)",
    chipColor: "warning",
    icon: "🎯",
  },
};

const priorityStyles = {
  high: { color: "#d32f2f", label: "High Priority" },
  medium: { color: "#f57c00", label: "Medium" },
  low: { color: "#388e3c", label: "Low" },
};

export function EnhancedNotificationCard({ notification, onMarkViewed }) {
  const viewed = notification.viewed || notification.read || false;
  const category = notification.type || notification.category || "General";
  const createdAt = notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "Unknown";
  const style = categoryStyles[category] || categoryStyles.Event;
  const priorityStyle = priorityStyles[notification.priority] || priorityStyles.medium;

  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const minutes = Math.floor((now - date) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card
      sx={{
        borderLeft: `4px solid ${style.borderColor}`,
        backgroundColor: viewed ? "background.paper" : style.backgroundColor,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      }}
      variant="outlined"
    >
      <CardContent sx={{ pb: 1 }}>
        <Stack spacing={2}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Typography variant="h6" fontWeight={800} sx={{ color: style.borderColor }}>
                  {style.icon} {category}
                </Typography>
              </Stack>
              <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: "1.1rem" }}>
                {notification.title || notification.subject || "Untitled notification"}
              </Typography>
            </Box>
            <Chip
              label={viewed ? "Viewed" : "New"}
              icon={viewed ? <CheckCircleIcon /> : undefined}
              size="small"
              sx={{
                backgroundColor: viewed ? "#e0e0e0" : style.borderColor,
                color: viewed ? "#666" : "white",
                fontWeight: 700,
              }}
            />
          </Stack>

          {/* Message */}
          <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.6 }}>
            {notification.message || notification.description || "No details provided."}
          </Typography>

          {/* Tags and Priority */}
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            {notification.priority && (
              <Chip
                icon={<FlagIcon />}
                label={priorityStyle.label}
                size="small"
                sx={{
                  backgroundColor: `${priorityStyle.color}20`,
                  color: priorityStyle.color,
                  fontWeight: 600,
                }}
              />
            )}
          </Stack>

          {/* Footer */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {timeAgo(notification.createdAt || notification.timestamp)}
              </Typography>
            </Stack>
            {notification.source && (
              <Typography variant="caption" sx={{ color: style.borderColor, fontWeight: 600 }}>
                {notification.source}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>

      {!viewed && onMarkViewed ? (
        <CardActions sx={{ pt: 0, px: 2, pb: 1.5 }}>
          <Button
            size="small"
            variant="contained"
            onClick={() => onMarkViewed(notification.id || notification._id)}
            sx={{
              background: style.borderColor,
              color: "white",
              fontWeight: 600,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            Mark Viewed
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
}
