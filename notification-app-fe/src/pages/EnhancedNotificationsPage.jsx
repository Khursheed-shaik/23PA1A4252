import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  Chip,
  Paper,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { CategoryCard } from "../components/CategoryCard";
import { EnhancedNotificationCard } from "../components/EnhancedNotificationCard";
import { Loading } from "../components/Loading";
import { useNotifications } from "../hooks/useNotifications";
import { sortNotifications } from "../utils/priority";

const categoryInfo = {
  Placement: {
    color: "#1e88e5",
    bgGradient: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
    description: "Job Opportunities & Campus Recruitment",
  },
  Result: {
    color: "#43a047",
    bgGradient: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
    description: "Academic Results & Performance",
  },
  Event: {
    color: "#fb8c00",
    bgGradient: "linear-gradient(135deg, #fb8c00 0%, #e65100 100%)",
    description: "Campus Events & Activities",
  },
};

export function EnhancedNotificationsPage() {
  const { notifications, loading, error, markViewed } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categorizedNotifications = useMemo(() => {
    const grouped = {
      Placement: [],
      Result: [],
      Event: [],
    };

    notifications.forEach((notification) => {
      const category = notification.type || notification.category || "Event";
      if (grouped[category]) {
        grouped[category].push(notification);
      }
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key] = sortNotifications(grouped[key]);
    });

    return grouped;
  }, [notifications]);

  const categoryStats = useMemo(
    () => ({
      Placement: {
        total: categorizedNotifications.Placement.length,
        unread: categorizedNotifications.Placement.filter(
          (n) => !n.viewed && !n.read
        ).length,
      },
      Result: {
        total: categorizedNotifications.Result.length,
        unread: categorizedNotifications.Result.filter(
          (n) => !n.viewed && !n.read
        ).length,
      },
      Event: {
        total: categorizedNotifications.Event.length,
        unread: categorizedNotifications.Event.filter(
          (n) => !n.viewed && !n.read
        ).length,
      },
    }),
    [categorizedNotifications]
  );

  const totalUnread = useMemo(
    () => Object.values(categoryStats).reduce((sum, cat) => sum + cat.unread, 0),
    [categoryStats]
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Loading />
      </Box>
    );
  }

  return (
    <Box sx={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 3,
            p: 4,
            mb: 4,
            color: "white",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <NotificationsIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h3" fontWeight={900}>
                Campus Notifications
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Stay updated with the latest announcements
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", my: 2 }} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <TrendingUpIcon sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Total Unread
                </Typography>
                <Typography variant="h4" fontWeight={900}>
                  {totalUnread}
                </Typography>
              </Box>
            </Stack>

            {Object.entries(categoryStats).map(([category, stats]) => (
              <Chip
                key={category}
                label={`${category}: ${stats.unread}/${stats.total}`}
                sx={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  px: 1,
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Category Cards */}
        {!selectedCategory && (
          <Box>
            <Typography variant="h5" fontWeight={800} mb={3}>
              Categories Overview
            </Typography>
            <Grid container spacing={3} mb={4}>
              {Object.entries(categoryInfo).map(([category, info]) => (
                <Grid item xs={12} sm={6} md={4} key={category}>
                  <CategoryCard
                    category={category}
                    count={categoryStats[category].total}
                    unreadCount={categoryStats[category].unread}
                    onClick={() => setSelectedCategory(category)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Category Detail View */}
        {selectedCategory && (
          <Box>
            <Button
              onClick={() => setSelectedCategory(null)}
              sx={{ mb: 2, color: "text.secondary", textTransform: "none", fontWeight: 600 }}
            >
              ← Back to Categories
            </Button>

            <Paper
              sx={{
                background: categoryInfo[selectedCategory].bgGradient,
                color: "white",
                p: 3,
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography variant="h4" fontWeight={900} mb={1}>
                {selectedCategory}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {categoryInfo[selectedCategory].description}
              </Typography>
            </Paper>

            <Stack spacing={2}>
              {categorizedNotifications[selectedCategory].length === 0 ? (
                <Alert severity="info">No {selectedCategory.toLowerCase()} notifications</Alert>
              ) : (
                categorizedNotifications[selectedCategory].map((notification) => (
                  <EnhancedNotificationCard
                    key={notification.id || notification._id}
                    notification={notification}
                    onMarkViewed={markViewed}
                  />
                ))
              )}
            </Stack>
          </Box>
        )}

        {/* All Notifications View */}
        {!selectedCategory && (
          <Box>
            <Typography variant="h5" fontWeight={800} mb={3}>
              All Notifications
            </Typography>

            {error && <Alert severity="error">Failed to load notifications: {error}</Alert>}

            {notifications.length === 0 ? (
              <Alert severity="info">No notifications available</Alert>
            ) : (
              <Stack spacing={2}>
                {notifications.map((notification) => (
                  <EnhancedNotificationCard
                    key={notification.id || notification._id}
                    notification={notification}
                    onMarkViewed={markViewed}
                  />
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}
