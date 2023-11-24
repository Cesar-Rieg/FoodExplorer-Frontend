import { Container, LogoMarca, Copyright } from "./Footer.js";
import logoMarca from "../../assets/LogoMarca/LogoMarca-Footer.svg";

export function Footer() {
  return (
    <Container>
      <LogoMarca>
        <img src={logoMarca} alt="Logo" />
      </LogoMarca>

      <Copyright>
        © 2023 - Todos os direitos reservados.
      </Copyright>
    </Container>
  );
}