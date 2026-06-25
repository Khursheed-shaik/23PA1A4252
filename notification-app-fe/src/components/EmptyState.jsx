import { Box, Typography } from "@mui/material";

export function EmptyState({ title, description }) {
  return (
    <Box textAlign="center" py={4} px={2}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Box>
  );
}
