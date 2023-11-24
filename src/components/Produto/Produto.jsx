/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from 'react-router-dom';

import { BiPencil } from "react-icons/bi";
import { FiHeart } from "react-icons/fi";
import { RxCaretRight } from "react-icons/rx";

import theme from "../../styles/theme";

//import { useParams, useNavigate } from 'react-router-dom';
import { DEVICE_BREAKPOINTS } from "../../styles/deviceBreakpoints.js";
import { API } from '../../services/ApiService';
import { Container, Title, Order } from "./Produto.js";
import { NumberPicker } from '../NumberPicker/NumberPicker.jsx';
import { Button } from "../Button/Button.jsx";
import { Notification, NotifyError, NotifySuccess } from '../Notification/Notification.jsx';

export function Produto({ isAdmin, produto, isFavorito, atualizarFavoritos, adicionarNoCarrinho, navegarParaPaginaDeVisualizacao, ...rest }) {
  const isDesktop = useMediaQuery({ minWidth: DEVICE_BREAKPOINTS.LG });
  const navigate = useNavigate();
  //const params = useParams();

  let [ quantidadeDeItens, setQuantidadeDeItens ] = useState(1);
  let [ loading, setLoading ] = useState(false);

  async function handleFavoritarItem() {
    try {
      if (isFavorito) {
        atualizarFavoritos(true, produto.Id);
      } 
      else {
        atualizarFavoritos(false, produto.Id);
      }
    } 
    catch (exception) {
      console.log('Ocorreu uma exceção ao atualizar favoritos:', exception);
    }
  }

  function navegarParaPaginaDeEdicao() {
    navigate(`/editar/${produto.Id}`);
  }

  async function handleAdicionarItemNoCarrinho() {
    setLoading(true);

    try {
      adicionarNoCarrinho(produto.Id, quantidadeDeItens);      
    } 
    catch (exception) {
      console.log(exception?.response?.data?.Message || "Ocorreu um erro ao adicionar o item no carrinho.")
    } 
    finally {
      setLoading(false);
    }
  }

  return (
    <Container {...rest} isAdmin={isAdmin}>
      { isAdmin 
      ? ( <BiPencil size={"2.4rem"} onClick={navegarParaPaginaDeEdicao} /> ) 
      : (
          <FiHeart
            size={"2.4rem"}
            fill={isFavorito ? theme.COLORS.GRAY_200 : undefined}
            onClick={handleFavoritarItem}
          />
        )
      }

      <img 
        src={`${API.defaults.baseURL}/files/${produto.NomeDoArquivoDaImagem}`} 
        alt="Imagem do produto." 
        onClick={() => navegarParaPaginaDeVisualizacao(produto.Id)} 
      />
      
      <Title>
        <h2>{produto.Nome}</h2>
        <RxCaretRight 
          size={isDesktop ? "2.4rem" : "1.4rem"} 
          onClick={() => navegarParaPaginaDeVisualizacao(produto.Id)} 
        />
      </Title>
      
      {isDesktop && <p>{produto.Descricao}</p>}
      <span>R$ {produto.Preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>

      {!isAdmin && 
        <Order>
          <NumberPicker quantidade={quantidadeDeItens} setQuantidade={setQuantidadeDeItens} />
          <Button title="Incluir" onClick={handleAdicionarItemNoCarrinho} loading={loading} />
        </Order>
      }
    </Container>
  );
}