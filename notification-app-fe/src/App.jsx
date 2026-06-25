import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { EnhancedNotificationsPage } from "./pages/EnhancedNotificationsPage";
import "./App.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e88e5",
      light: "#64b5f6",
      dark: "#1565c0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f57c00",
    },
    success: {
      main: "#43a047",
    },
    warning: {
      main: "#fb8c00",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a237e",
      secondary: "#546e7a",
    },
    divider: "rgba(33, 150, 243, 0.12)",
    action: {
      hover: "rgba(33, 150, 243, 0.08)",
      selected: "rgba(33, 150, 243, 0.12)",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 700,
      letterSpacing: 0,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 320,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EnhancedNotificationsPage />
    </ThemeProvider>
  );
}