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
    h3: {
      textAlign: "center",
      fontWeight: 700,
      marginBottom: "8px",
    },
    h4: {
      textTransform: "uppercase",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "uppercase",
          width: "100%",
          padding: "0px 25px",
          marginTop: "10px",
          marginBottom: "10px",
          fontWeight: "bold",
          "&:hover": {
            transform: "scale(0.95)",
            transition: "transform 0.2s ease",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          flex: "0 0 14%",
          boxShadow: "none",
          backgroundColor: "#EEEEEE",
          paddingBottom: 0,
          marginBottom: 0,
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
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          display: "flex",
          "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
            transform: "translate(10px, -70px)",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "white",
            height: "fit-content",
            "& fieldset": {
              borderColor: "#2F3746",
            },
            "&:hover fieldset": {
              borderColor: "#0B815A",
            },
          },
          "& .MuiFormHelperText-root": {
            fontSize: "1.5vw",
          },
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
