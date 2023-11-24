/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useMediaQuery } from "react-responsive";
import { useNavigate } from 'react-router-dom';
import { RxCaretLeft } from "react-icons/rx";

import { API } from '../../services/ApiService.js';
import { DEVICE_BREAKPOINTS } from '../../styles/deviceBreakpoints.js';
import { Container, Content } from "./Favoritos.js";
import { Menu } from "../../components/Menu/Menu.jsx";
import { Header } from '../../components/Header/Header.jsx';
import { ButtonText } from "../../components/ButtonText/ButtonText.jsx";
import { Favorito } from '../../components/Favorito/Favorito.jsx';
import { Footer } from '../../components/Footer/Footer.jsx';
import { Notification, NotifyError, NotifySuccess } from '../../components/Notification/Notification.jsx';

export function Favoritos({ isAdmin }) {
  const isDesktop = useMediaQuery({ minWidth: DEVICE_BREAKPOINTS.LG });
  const navigate = useNavigate();

  let [ isMenuOpen, setIsMenuOpen ] = useState(false);
  let [ favoritos, setFavoritos ] = useState([]);

  useEffect(() => {
    async function fecthFavoritos() {
      try {
        let response = await API.get("/favoritos");
        setFavoritos(response.data);
      } 
      catch (exception) {
        let mensagemDeErro = exception?.response?.data?.Message || "Ocorreu um erro ao buscar os favoritos."; 
        NotifyError({mensagem: mensagemDeErro});
      }
    }
  
    fecthFavoritos();
  }, []);  

  async function removerFavorito(produtoId) {
    try {
      let produtoRemovido = favoritos.find((favorito) => favorito.ProdutoId === produtoId);
      
      await API.delete(`/favoritos/${produtoId}`);
      setFavoritos((favoritosAtuais) => favoritosAtuais.filter((favorito) => favorito.ProdutoId !== produtoId));
      NotifySuccess({mensagem: `O produto "${produtoRemovido.NomeDoProduto}" foi removido dos favoritos.`});
    } 
    catch (exception) {
      let mensagemDeErro = exception?.response?.data?.Message || "Ocorreu um erro ao remover o favorito."; 
      NotifyError({mensagem: mensagemDeErro});
    }
  }

  function navegarParaPaginaAnterior() {
    navigate(-1);
  }

  return (
    <>
      <Notification/>

      <Container>
        {!isDesktop && 
          <Menu 
            isAdmin={isAdmin} 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
          />
        }

        <Header 
          isAdmin={isAdmin} 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
        />

        {
          favoritos && 
          <main>
            <div>
              <header>
                <ButtonText onClick={navegarParaPaginaAnterior}><RxCaretLeft />voltar</ButtonText>
                <h1>Meus favoritos</h1>
              </header>

              <Content>
                {
                  favoritos.map(favorito => (
                    <Favorito 
                      key={String(favorito.Id)}
                      data={favorito}
                      removerFavorito={removerFavorito} 
                    />
                  ))
                }
              </Content>
            </div>
          </main>
        }

        <Footer />
      </Container>
    </>
  );
}
