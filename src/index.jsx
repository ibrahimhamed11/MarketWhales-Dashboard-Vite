import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import "styles/video-components.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import AuthLayout from "layouts/auth.jsx";
import AdminLayout from "layouts/admin.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import PrivacyPolicy from "./views/PrivacyPolicy";

// Import your authentication functions (login, userFn, isAdmin, logout)
import { login, userFn, isAdmin, logout } from "./apis/auth/auth";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = localStorage.getItem("token");

  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? <Component {...props} /> : <Redirect to="/auth" />
      }
    />
  );
};

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <ThemeEditorProvider>
        <Router>
          <Switch>
            {/* Public route accessible without authentication */}
            <Route path="/privacy-policy" component={PrivacyPolicy} />

            {/* Protected routes */}
            <Route
              path="/auth"
              render={(props) => <AuthLayout {...props} login={login} />}
            />
            <PrivateRoute path="/admin" component={AdminLayout} />

            {/* Default redirect */}
            <Redirect from="/" to="/admin" />
          </Switch>
        </Router>
      </ThemeEditorProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);
