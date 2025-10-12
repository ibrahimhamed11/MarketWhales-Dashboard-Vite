import { createTheme } from "@mui/material/styles";

// Create MUI theme with consistent typography
const muiTheme = createTheme({
  typography: {
    fontFamily: "DroidArabic, sans-serif",
  },
  // You can add more theme customization here as needed
  palette: {
    primary: {
      main: "#422AFB",
    },
    secondary: {
      main: "#707EAE",
    },
  },
});

export default muiTheme;
