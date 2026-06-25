import { Box, Card, CardContent, Stack, Typography, Chip, Button, LinearProgress } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const categoryConfig = {
  Placement: {
    icon: WorkIcon,
    color: "#1e88e5",
    lightColor: "rgba(30, 136, 229, 0.08)",
    bgGradient: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
    description: "Job opportunities and recruitment drives",
  },
  Result: {
    icon: AssignmentIcon,
    color: "#43a047",
    lightColor: "rgba(67, 160, 71, 0.08)",
    bgGradient: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
    description: "Academic results and grades",
  },
  Event: {
    icon: EventIcon,
    color: "#fb8c00",
    lightColor: "rgba(251, 140, 0, 0.08)",
    bgGradient: "linear-gradient(135deg, #fb8c00 0%, #e65100 100%)",
    description: "Campus events and activities",
  },
};

export function CategoryCard({ category, count, unreadCount, onClick }) {
  const config = categoryConfig[category];
  const Icon = config.icon;
  const progress = count > 0 ? (unreadCount / count) * 100 : 0;

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        borderRadius: 2,
        overflow: "hidden",
        background: "white",
        border: "2px solid transparent",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
          borderColor: config.color,
        },
        height: "100%",
      }}
    >
      <Box
        sx={{
          background: config.bgGradient,
          color: "white",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700} mb={1}>
            {category}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {config.description}
          </Typography>
        </Box>
        <Icon sx={{ fontSize: 48, opacity: 0.7 }} />
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Total Notifications
              </Typography>
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: config.color }}>
                {count}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(0,0,0,0.05)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: config.color,
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Unread
              </Typography>
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: config.color }}>
                {unreadCount}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(0,0,0,0.05)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: config.color,
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          <Button
            variant="text"
            size="small"
            sx={{
              color: config.color,
              fontWeight: 600,
              mt: 1,
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: config.lightColor,
              },
            }}
          >
            View All →
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
