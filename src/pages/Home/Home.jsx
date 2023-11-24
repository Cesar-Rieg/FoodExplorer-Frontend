/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";

import { API } from '../../services/ApiService.js';
import { DEVICE_BREAKPOINTS } from '../../styles/deviceBreakpoints.js';
import { Container, Content } from "./Home.js";
import { Header } from '../../components/Header/Header.jsx';
import { Menu } from "../../components/Menu/Menu.jsx";
import { Section } from '../../components/Section/Section.jsx';
import { Produto } from "../../components/Produto/Produto.jsx";
import { Footer } from '../../components/Footer/Footer.jsx';
import { Notification, NotifyError, NotifySuccess } from '../../components/Notification/Notification.jsx';

import bannerMobile from "../../assets/Banner/Mobile.png";
import bannerDesktop from "../../assets/Banner/Desktop.png";

import { register } from 'swiper/element/bundle';
register();

export function Home({ isAdmin, usuarioId }) {
  const swiperElementoRefeicoes = useRef(null);
  const swiperElementoSobremesas = useRef(null);
  const swiperElementoBebidas = useRef(null);
  const isDesktop = useMediaQuery({ minWidth: DEVICE_BREAKPOINTS.LG });
  const navigate = useNavigate();
  
  let [ isMenuOpen, setIsMenuOpen ] = useState(false);
  let [ produtos, setProdutos ] = useState({ refeicoes: [], sobremesas: [], bebidas: [] });
  let [ favoritos, setFavoritos ] = useState([]);
  let [ busca, setBusca ] = useState("");
  let [ carrinhoDeComprasId, setCarrinhoDeComprasId ] = useState(null);

  // UseEffect para os elementos swiper dos produtos agrupados por categoria
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // the value in percentage indicates at what visibility the callback should be called
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.swiper && entry.target.swiper.autoplay.start();
        } 
        else {
          entry.target.swiper && entry.target.swiper.autoplay.stop();
        }        
      });
    }, options);

    observer.observe(swiperElementoRefeicoes.current);
    observer.observe(swiperElementoSobremesas.current);
    observer.observe(swiperElementoBebidas.current);

    return () => {
      observer.disconnect();
    }
  }, []);

  // UseEffect do campo busca
  useEffect(() => {
    async function fetchProdutos() {
      let response = await API.get(`/produtos?busca=${busca}`);

      let refeicoes = response.data.filter(p => p.NomeDaCategoria === "Refeicao");
      let sobremesas = response.data.filter(p => p.NomeDaCategoria === "Sobremesa");
      let bebidas = response.data.filter(p => p.NomeDaCategoria === "Bebida");

      setProdutos({ refeicoes, sobremesas, bebidas });
    }

    fetchProdutos();
  }, [busca]);

  // UseEffect dos favoritos
  useEffect(() => {
    async function fetchFavoritos() {
      try {
        let response = await API.get("/favoritos");
        let favoritos = response.data.map((favorito) => favorito.ProdutoId);
        setFavoritos(favoritos);
      } 
      catch (exception) {
        let mensagemDeErro = exception?.response?.data?.Message || "Ocorreu um erro ao buscar os favoritos.";
        NotifyError({mensagem: mensagemDeErro});
      }
    }

    fetchFavoritos();
  }, []);

  async function adicionarItemNoCarrinho(produtoId, quantidadeDeItensParaAdicionar) {
    let produto = getProdutoById(produtoId);

    try {
      let itemDoCarrinho = {
        produtoId: produto.Id,
        nome: produto.Nome,
        quantidadeDeItens: quantidadeDeItensParaAdicionar,
      };

      let response = await API.get('/carrinho', { params: { criadoPor: usuarioId } });
      let carrinho = response.data[0];

      if (carrinho) {
        await API.patch(`/carrinho/${carrinho.Id}`, { itensDoCarrinho: [itemDoCarrinho] });
      } 
      else {
        let createResponse = await API.post('/carrinho', { itensDoCarrinho: [itemDoCarrinho], criadoPor: usuarioId });
        let novoCarrinho = createResponse.data;
        setCarrinhoDeComprasId(novoCarrinho.Id);
      }

      NotifySuccess({mensagem: `Produto adicionado ao carrinho de compras!`});
    } 
    catch (exception) {
      let mensagemDeErro = exception?.response?.data?.Message || "Ocorreu um erro ao adicionar o item no carrinho.";
      NotifyError({mensagem: mensagemDeErro});
    } 
  }

  async function atualizarFavoritos(isFavorito, produtoId) {
    try {
      let produtoAdicinadoOuRemovido = getProdutoById(produtoId);

      if (isFavorito) {
        await API.delete(`/favoritos/${produtoId}`);
        setFavoritos((favoritosAtuais) => favoritosAtuais.filter((favorito) => favorito !== produtoId));
        NotifySuccess({mensagem: `O produto "${produtoAdicinadoOuRemovido.Nome}" foi removido dos favoritos.`});
      } 
      else {
        await API.post('/favoritos', { produtoId: produtoId });
        setFavoritos((favoritosAtuais) => [...favoritosAtuais, produtoId]);
        NotifySuccess({mensagem: `O produto "${produtoAdicinadoOuRemovido.Nome}" foi adicionado aos favoritos.`});
      }
    } 
    catch (exception) {
      let mensagemDeErro = exception?.response?.data?.Message || "Ocorreu um erro ao adicionar ou remover o item dos favoritos.";
      NotifyError({mensagem: mensagemDeErro});
    }
  }

  function getProdutoById(produtoId) {
    return produtos.bebidas.find((produto) => produto.Id === produtoId)
        || produtos.refeicoes.find((produto) => produto.Id === produtoId)
        || produtos.sobremesas.find((produto) => produto.Id === produtoId);
  }

  function navegarParaPaginaDeVisualizacao(produtoId) {
    navigate(`/visualizar/${produtoId}`);
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
            setBusca={setBusca}
          />
        }

        <Header 
          isAdmin={isAdmin} 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          setBusca={setBusca}
        />

        <main>
          <div>
            <header>
              <img 
                src={isDesktop ? bannerDesktop : bannerMobile} 
                alt="Macarons coloridos em tons pastel despencando juntamente com folhas verdes e frutas frescas." 
              />
            
              <div>
                <h1>Sabores inigualáveis</h1>
                <p>Sinta o cuidado do preparo com ingredientes selecionados</p>
              </div>
            </header>

            <Content>
              <Section title="Refeições">
                <swiper-container
                  key={isDesktop}
                  ref={swiperElementoRefeicoes}
                  space-between={isDesktop ? "27" : "16"}
                  slides-per-view="auto"
                  navigation={isDesktop ? "true" : "false"}
                  loop="true"
                  grab-cursor="true"
                >
                  {
                    produtos.refeicoes.map(produto => (
                      <swiper-slide key={String(produto.Id)}>
                        <Produto 
                          isAdmin={isAdmin}
                          produto={produto}
                          isFavorito={favoritos.includes(produto.Id)}
                          atualizarFavoritos={atualizarFavoritos} 
                          adicionarNoCarrinho={adicionarItemNoCarrinho}
                          navegarParaPaginaDeVisualizacao={navegarParaPaginaDeVisualizacao}
                        />
                      </swiper-slide>
                    ))
                  }
                </swiper-container>
              </Section>

              <Section title="Sobremesas">
                <swiper-container
                  key={isDesktop}
                  ref={swiperElementoSobremesas}
                  space-between={isDesktop ? "27" : "16"}
                  slides-per-view="auto"
                  navigation={isDesktop ? "true" : "false"}
                  loop="true"
                  grab-cursor="true"
                >
                  {
                    produtos.sobremesas.map(produto => (
                      <swiper-slide key={String(produto.Id)}>
                        <Produto 
                          isAdmin={isAdmin}
                          produto={produto}
                          isFavorito={favoritos.includes(produto.Id)}
                          atualizarFavoritos={atualizarFavoritos} 
                          adicionarNoCarrinho={adicionarItemNoCarrinho}
                          navegarParaPaginaDeVisualizacao={navegarParaPaginaDeVisualizacao}
                        />
                      </swiper-slide>
                    ))
                  }
                </swiper-container>
              </Section>

              <Section title="Bebidas">
                <swiper-container
                  key={isDesktop}
                  ref={swiperElementoBebidas}
                  space-between={isDesktop ? "27" : "16"}
                  slides-per-view="auto"
                  navigation={isDesktop ? "true" : "false"}
                  loop="true"
                  grab-cursor="true"
                >
                  {
                    produtos.bebidas.map(produto => (
                      <swiper-slide key={String(produto.Id)}>
                        <Produto 
                          isAdmin={isAdmin}
                          produto={produto} 
                          isFavorito={favoritos.includes(produto.Id)}
                          atualizarFavoritos={atualizarFavoritos}
                          adicionarNoCarrinho={adicionarItemNoCarrinho}
                          navegarParaPaginaDeVisualizacao={navegarParaPaginaDeVisualizacao}
                        />
                      </swiper-slide>
                    ))
                  }
                </swiper-container>
              </Section>
            </Content>
          </div>
        </main>

        <Footer />
      </Container>
    </>
  );
}