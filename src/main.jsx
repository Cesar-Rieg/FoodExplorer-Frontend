import React from "react";
import ReactDOM from "react-dom/client";

import { AuthenticationProvider } from './hooks/Authentication.jsx';
import { Routes } from "./routes";
import { ThemeProvider } from "styled-components";

import GlobalStyles from "./styles/global";
import theme from "./styles/theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthenticationProvider>
        <Routes />
      </AuthenticationProvider>
    </ThemeProvider>
  </React.StrictMode>
);