/* eslint-disable react/prop-types */
import { API } from '../../services/ApiService.js';
import { Container } from "./Favorito.js";

export function Favorito({ data, removerFavorito }) {

  return (
    <Container>
      <img src={`${API.defaults.baseURL}/files/${data.NomeDoArquivoDaImagem}`} alt="Imagem do produto." />
      
      <div>
        <h2>{data.NomeDoProduto}</h2>
        <button onClick={() => removerFavorito(data.ProdutoId)}>Remover dos Favoritos</button>
      </div>
    </Container>
  );
}
