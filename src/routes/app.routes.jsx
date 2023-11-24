/* eslint-disable react/prop-types */
import { Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home/Home.jsx";
import { Novo } from "../pages/Novo/Novo.jsx";
import { Editar } from "../pages/Editar/Editar.jsx";
import { Visualizar } from "../pages/Visualizar/Visualizar.jsx";
import { Favoritos } from "../pages/Favoritos/Favoritos.jsx";

export function AppRoutes({ isAdmin }) {
  return (
    <Routes>
      <Route path="/" element={<Home isAdmin={isAdmin} />} />
      <Route path="/novo" element={<Novo isAdmin={isAdmin} />} />
      <Route path="/editar/:id" element={<Editar isAdmin={isAdmin} />} />
      <Route path="/visualizar/:id" element={<Visualizar isAdmin={isAdmin} />} />
      <Route path="/favoritos" element={<Favoritos isAdmin={isAdmin} />} />
    </Routes>
  );
}