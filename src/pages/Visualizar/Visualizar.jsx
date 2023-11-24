/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { RxCaretLeft } from "react-icons/rx";
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { API } from '../../services/ApiService.js';
import { DEVICE_BREAKPOINTS } from "../../styles/deviceBreakpoints.js";
import { Container, Content } from "./Visualizar.js";
import { Header } from '../../components/Header/Header.jsx';
import { Menu } from "../../components/Menu/Menu.jsx";
import { ButtonText } from "../../components/ButtonText/ButtonText.jsx";
import { IngredienteDoProduto } from '../../components/IngredienteDoProduto/IngredienteDoProduto.jsx';
import { NumberPicker } from "../../components/NumberPicker/NumberPicker.jsx";
import { Button } from "../../components/Button/Button.jsx";
import { Footer } from '../../components/Footer/Footer.jsx';

import { Notification, NotifyError, NotifySuccess } from "../../components/Notification/Notification.jsx";

export function Visualizar({ isAdmin, usuarioId }) {
  const isDesktop = useMediaQuery({ minWidth: DEVICE_BREAKPOINTS.LG });
  const params = useParams();
  const navigate = useNavigate();

  let [ isMenuOpen, setIsMenuOpen ] = useState(false);
  let [ state, setState ] = useState(null);
  let [ quantidadeDeItens, setQuantidadeDeItens ] = useState(1);
  let [ carrinhoDeComprasId, setCarrinhoDeComprasId ] = useState(null);
  let [ loading, setLoading ] = useState(false);

  useEffect(() => {
    async function fetchProduto() {
      try {
        let produtoId = params.id;
        let response = await API.get(`/produtos/${produtoId}`);
        setState(response.data);
      }
      catch (exception) {
        let mensagemDeErro = exception?.response?.data?.Message || "Ocorreu um erro ao obter os dados do produto.";
        NotifyError({mensagem: mensagemDeErro});
      }
    }

    fetchProduto();    
  }, [params.id]);

  async function handleAdicionarItemNoCarrinhoDeCompras() {
    setLoading(true);

    try {
      let itemDoCarrinho = {
        produtoId: state.Id,
        nome: state.Nome,
        quantidade: quantidadeDeItens,
      };

      let response = await API.get('/carrinho', { params: { criadoPor: usuarioId } });
      let carrinho = response.data[0];

      if (carrinho) {
        let carrinhoId = carrinho.Id;
        await API.patch(`/carrinho/${carrinhoId}`, { itensDoCarrinho: [itemDoCarrinho] });
      } 
      else {
        let response = await API.post('/carrinho', { itensDoCarrinho: [itemDoCarrinho], criadoPor: usuarioId });
        let novoCarrinho = response.data;
        setCarrinhoDeComprasId(novoCarrinho.Id);
      }

      NotifySuccess({mensagem: `Item adicionado ao carrinho!`});
    } 
    catch (exception) {
      let mensagemDeErro = exception?.response?.data?.Message || "Ocorreu um erro ao adicionar o item no carrinho.";
      NotifyError({mensagem: mensagemDeErro});
    } 
    finally {
      setLoading(false);
    }
  }

  function navegarParaPaginaAnterior() {
    navigate(-1);
  }

  function navegarParaPaginaDeEdicao() {
    let produtoId = params.id;
    navigate(`/editar/${produtoId}`);
  }

  return (
    <>
      <Notification/>
    
      <Container>

        {!isDesktop && 
          <Menu 
            isAdmin={isAdmin} 
            isDisabled={true} 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
          />
        }

        <Header 
          isAdmin={isAdmin} 
          isDisabled={true} 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
        />

        {
          state && 
          <main>
            <div>
              <header>
                <ButtonText onClick={navegarParaPaginaAnterior}><RxCaretLeft />voltar</ButtonText>
              </header>

              <Content>
                <img src={`${API.defaults.baseURL}/files/${state.NomeDoArquivoDaImagem}`} alt={state.Nome} />

                <div>
                  <h1>{state.Nome}</h1>
                  <p>{state.Descricao}</p>
                
                  {
                    state.Ingredientes && 
                    <section>
                      {
                        state.Ingredientes.map(ingrediente => (
                          <IngredienteDoProduto 
                            key={String(ingrediente.Id)} 
                            title={ingrediente.Nome} 
                          />
                        ))
                      }
                    </section>
                  }

                  <div className="buttons">
                    {isAdmin 
                      ? <Button 
                          title="Editar prato" 
                          className="editar" 
                          onClick={navegarParaPaginaDeEdicao}
                          loading={loading}
                        /> 
                      : <>
                          <NumberPicker quantidade={quantidadeDeItens} setQuantidade={setQuantidadeDeItens} />
                          <Button 
                            title={
                              isDesktop ? 
                              `Incluir ∙ R$ ${(state.Preco * quantidadeDeItens).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
                              `Pedir ∙ R$ ${(state.Preco * quantidadeDeItens).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                            } 
                            className="incluirNoCarrinho" 
                            onClick={handleAdicionarItemNoCarrinhoDeCompras}
                            loading={loading}
                          />
                        </>
                    }
                  </div>
                </div>
              </Content>
            </div>
          </main>
        }

        <Footer />
      </Container>
    </>
  );
}