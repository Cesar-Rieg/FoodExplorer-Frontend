/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { UseAuthentication } from '../../hooks/Authentication';

import { Container } from "./Menu.js";
import { Header } from '../Header/Header.jsx';
import { BuscaPadrao } from "../BuscaPadrao/BuscaPadrao.jsx";
import { ButtonText } from "../ButtonText/ButtonText.jsx";

export function Menu({ isAdmin, isMenuOpen, setIsMenuOpen, setBusca, isDisabled }) {
  const { signOut } = UseAuthentication();
  const navigate = useNavigate();

  function navegarParaPaginaDeAdicionarNovoProduto() {
    navigate("/novo");
  }

  function navegarParaPaginaDeFavoritos() {
    navigate("/favoritos");
  }

  function handleSignOut() {
    navigate("/");
    signOut();
  }

  return (
    <Container isMenuOpen={isMenuOpen}>
      <Header isAdmin={isAdmin} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main>
        <BuscaPadrao isDisabled={isDisabled} setBusca={setBusca} />

        { isAdmin 
          ? ( <ButtonText onClick={navegarParaPaginaDeAdicionarNovoProduto}>Novo prato</ButtonText> ) 
          : null
        }

        <ButtonText onClick={navegarParaPaginaDeFavoritos}>Meus favoritos</ButtonText>

        <ButtonText onClick={handleSignOut}>Sair</ButtonText>
      </main>
    </Container>
  );
}