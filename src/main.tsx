import ReactDOM from "react-dom/client";
import { App } from "./App";

import "./styles.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { createPalette } from "./utils/createPalette";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1440,
    },
  },
  palette: createPalette(),
  typography: {
    fontFamily: "poppins",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          color: "#594C51",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          flexDirection: "row",
          justifyContent: "space-between",
        },
      },
    },
  },
});

const fontStyle = new FontFace(
  "poppins",
  `url(./src/assets/fonts/Poppins-Regular.woff2)`
);

fontStyle.load().then(() => {
  document.fonts.add(fontStyle);
});

const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  e.preventDefault(); // Evita el comportamiento por defecto del evento de clic derecho
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <div onContextMenu={handleContextMenu}>
      <App />
    </div>
  </ThemeProvider>
);
