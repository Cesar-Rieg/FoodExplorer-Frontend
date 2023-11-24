/* eslint-disable react/prop-types */
import { FiMenu, FiLogOut } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from 'react-router-dom';

import { DEVICE_BREAKPOINTS } from '../../styles/deviceBreakpoints.js';
import { UseAuthentication } from '../../hooks/Authentication';
import { Container, LogoMarca, Logout, Menu } from "./Header.js";
import { BuscaPadrao } from "../BuscaPadrao/BuscaPadrao.jsx";
import { Button } from "../Button/Button.jsx";

import logoMarca from "../../assets/LogoMarca/LogoMarca.svg";
import logoMarca_AdminDesktop from "../../assets/LogoMarca/LogoMarca-Admin.svg";
import logoMarca_AdminMobile from "../../assets/LogoMarca/LogoMarca-Admin-Mobile.svg";

export function Header({ isAdmin, isDisabled, isMenuOpen, setIsMenuOpen, setBusca }) {
  const isDesktop = useMediaQuery({ minWidth: DEVICE_BREAKPOINTS.LG });
  const logo = isAdmin ? (isDesktop ? logoMarca_AdminDesktop : logoMarca_AdminMobile) : logoMarca;
  
  let { signOut } = UseAuthentication();
  const navigate = useNavigate();

  function navegarParaPaginaDeFavoritos() {
    navigate("/favoritos");
  }

  function navegarParaPaginaDeAdicionarNovoProduto() {
    navigate("/novo");
  }

  function handleSignOut() {
    navigate("/");
    signOut();
  }

  return (
    <Container>
      {!isDesktop && (
        <Menu>
          {!isMenuOpen ?
            <FiMenu className="fi-menu-icon" onClick={() => setIsMenuOpen(true)} /> :
            <>
              <MdClose size={"2.5rem"} onClick={() => setIsMenuOpen(false)} />
              <span>Menu</span>
            </>
          }
        </Menu>
      )}

      {(isDesktop || !isMenuOpen) && (
        <>
          <LogoMarca>
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </LogoMarca>

          {isDesktop && <BuscaPadrao isDisabled={isDisabled} setBusca={setBusca} />}

          {isDesktop &&
            <button className="favoritos" onClick={navegarParaPaginaDeFavoritos}>Meus favoritos</button>
          }

          {isAdmin 
            ? (isDesktop && <Button className="novo" title="Novo prato" onClick={navegarParaPaginaDeAdicionarNovoProduto} />) 
            : <Button className="pedidos" title={isDesktop ? "Pedidos" : undefined} isCliente={!isAdmin} quantidadeDeItensNoPedido={0} />
          }

          {isDesktop &&
            <Logout onClick={handleSignOut}>
              <FiLogOut size={"3.2rem"} />
            </Logout>
          }
        </>
      )}
    </Container>
  );
}
