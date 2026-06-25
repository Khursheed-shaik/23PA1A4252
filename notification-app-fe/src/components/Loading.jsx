import { Box, CircularProgress, Typography } from "@mui/material";

export function Loading({ message = "Loading notifications..." }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={6}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary" mt={2}>
        {message}
      </Typography>
    </Box>
  );
}
