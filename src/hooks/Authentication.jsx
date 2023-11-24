/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";

import { API } from "../services/ApiService.js";
import { jwtDecode } from "jwt-decode";
import { LOCALSTORAGE_FOODEXPLORER_USUARIO, LOCALSTORAGE_FOODEXPLORER_TOKEN } from "../constants/LocalStorageConstants";
import { DateTimeNow, ParseDateTime } from "../extensions/DateTimeExtensions.js";

import { FrontEndException } from "../exceptions/FrontEndException.js";

export const AuthContext = createContext({});

function AuthenticationProvider({ children }) {
  const [ state, setState ] = useState({});

  function signOut() {
    localStorage.removeItem(LOCALSTORAGE_FOODEXPLORER_USUARIO);
    localStorage.removeItem(LOCALSTORAGE_FOODEXPLORER_TOKEN);

    setState({});
  }

  function isUserAuthenticated() {
    let usuario = localStorage.getItem(LOCALSTORAGE_FOODEXPLORER_USUARIO);
    let token = localStorage.getItem(LOCALSTORAGE_FOODEXPLORER_TOKEN);
    if (!usuario || !token) return false;

    let dataDeExpiracaoDoToken = ParseDateTime(jwtDecode(token).exp);
    let dataAtual = DateTimeNow();
   
    if (dataDeExpiracaoDoToken >= dataAtual) return true;
    return false;
  }  

  async function signIn({ email, senha }) {
    try {
      let response = await API.post("/autenticacao", { email, senha });
      let { usuario, token } = response.data;
      
      localStorage.setItem(LOCALSTORAGE_FOODEXPLORER_USUARIO, JSON.stringify(usuario));
      localStorage.setItem(LOCALSTORAGE_FOODEXPLORER_TOKEN, token);
      
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setState({ usuario, token });
    } 
    catch (exception) {
      throw new FrontEndException(exception, "Ocorreu um erro desconhecido ao efetuar o login.");
    }
  }

  useEffect(() => {
    let usuario = localStorage.getItem(LOCALSTORAGE_FOODEXPLORER_USUARIO);
    let token = localStorage.getItem(LOCALSTORAGE_FOODEXPLORER_TOKEN);

    if (usuario && token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setState({
        usuario: JSON.parse(usuario),
        token
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isUserAuthenticated,
        usuario: state.usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function UseAuthentication() {
  const context = useContext(AuthContext);

  return context;
}

export { UseAuthentication, AuthenticationProvider };