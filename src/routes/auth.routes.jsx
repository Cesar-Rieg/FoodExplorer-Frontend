import { Routes, Route } from "react-router-dom";

import { SignIn } from "../pages/SignIn/SignIn.jsx";
import { SignUp } from "../pages/SignUp/SignUp.jsx";

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
    </Routes>
  );
}