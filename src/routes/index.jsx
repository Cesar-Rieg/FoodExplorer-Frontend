import { BrowserRouter } from "react-router-dom";
import { UseAuthentication } from '../hooks/Authentication.jsx';

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  let { usuario, isUserAuthenticated } = UseAuthentication();
  let isAdmin = usuario ? usuario.IsAdmin : false;

  let userAuthenticated = isUserAuthenticated();

  return (
    <BrowserRouter>
      {(usuario && userAuthenticated) 
        ? <AppRoutes isAdmin={isAdmin} /> 
        : <AuthRoutes />
      }
    </BrowserRouter>
  );
}