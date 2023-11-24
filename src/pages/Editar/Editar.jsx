/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useMediaQuery } from "react-responsive";
import { useParams, useNavigate } from 'react-router-dom';

import { RxCaretLeft } from "react-icons/rx";
import { FiUpload } from "react-icons/fi";
import { RiArrowDownSLine } from "react-icons/ri";

import { API } from '../../services/ApiService.js';
import { DEVICE_BREAKPOINTS } from '../../styles/deviceBreakpoints.js';
import { Categoria, Container, Form, Imagem } from "./Editar.js";
import { Menu } from "../../components/Menu/Menu.jsx";
import { Header } from '../../components/Header/Header.jsx';
import { ButtonText } from "../../components/ButtonText/ButtonText.jsx";
import { Section } from '../../components/Section/Section.jsx';
import { Input } from '../../components/Input/Input.jsx';
import { NovoIngrediente } from '../../components/NovoIngrediente/NovoIngrediente.jsx';
import { Textarea } from '../../components/Textarea/Textarea.jsx';
import { Button } from "../../components/Button/Button.jsx";
import { Footer } from '../../components/Footer/Footer.jsx';
import { Notification, NotifyError, NotifySuccess } from '../../components/Notification/Notification.jsx';

export function Editar({ isAdmin }) {
  const isDesktop = useMediaQuery({ minWidth: DEVICE_BREAKPOINTS.LG });
  const params = useParams();
  const navigate = useNavigate();
  
  let [ isMenuOpen, setIsMenuOpen ] = useState(false);
  let [ produto, setProduto ] = useState(null);
  let [ id, setId ] = useState("");
  let [ nome, setNome ] = useState("");
  let [ descricao, setDescricao ] = useState("");
  let [ categoria, setCategoria ] = useState("");
  let [ preco, setPreco ] = useState("");
  let [ imagem, setImagem ] = useState(null);
  let [ imagemAtualizada, setImagemAtualizada ] = useState(null);
  let [ nomeDoArquivo, setNomeDoArquivo ] = useState("");

  let [ ingredientes, setIngredientes ] = useState([]);
  let [ novoIngrediente, setNovoIngrediente ] = useState("");

  let [loading, setLoading] = useState(false);

  // UseEffect buscar produto
  useEffect(() => {
    async function fetchProduto() {
      try {
        let produtoId = params.id;
        let response = await API.get(`/produtos/${produtoId}`);
        setProduto(response.data);
      } 
      catch (exception) {
        console.error(exception);
      }
    }
    
    fetchProduto();
  }, [params.id]);

  useEffect(() => {
    if (produto) {
      setId(produto.Id);
      setNome(produto.Nome);
      setPreco(produto.Preco);
      setCategoria(produto.NomeDaCategoria);
      setImagem(produto.NomeDoArquivoDaImagem);
      setNomeDoArquivo(produto.NomeDoArquivoDaImagem);
      setDescricao(produto.Descricao);
 
      let ingredientesDoProduto = produto.Ingredientes.map((ingrediente) => ingrediente.Nome);
      setIngredientes(ingredientesDoProduto);
    }
  }, [produto]);  

  function handleAdicionarIngrediente() {
    if (!novoIngrediente || novoIngrediente === null || novoIngrediente === undefined) return;

    setIngredientes((ingredientesAtuais) => [...ingredientesAtuais, novoIngrediente]);
    setNovoIngrediente("");
  }

  async function handleEditarProduto() {
    if (!imagem) return NotifyError({mensagem: "A imagem do produto não foi informada."});
    if (!nome) return NotifyError({mensagem: "O nome do produto não foi informado."});
    if (!categoria) return NotifyError({mensagem: "A categoria do produto não foi informada."});
    if (!preco) return NotifyError({mensagem: "O preço do produto não foi informado."});
    if (!descricao) return NotifyError({mensagem: "A descrição do produto não foi informada."});
    if (ingredientes.length === 0) return NotifyError({mensagem: "Informe pelo menos um ingrediente do produto."});

    if (novoIngrediente) 
      return NotifyError({mensagem: "Existe um ingrediente em edição. Clique para adicionar ou deixe o campo vazio."});

    setLoading(true);

    try {
      let produtoId = params.id;

      let produtoAtualizado = {
        nome: nome,
        categoria: categoria,
        preco: preco,
        descricao: descricao,
        ingredientes: JSON.stringify(ingredientes),
        imagem: imagem,
        imagemAtual: nomeDoArquivo
      };
  
      const formData = new FormData();
      formData.append("nome", produtoAtualizado.nome);
      formData.append("categoria", produtoAtualizado.categoria);
      formData.append("preco", produtoAtualizado.preco);
      formData.append("descricao", produtoAtualizado.descricao);
      formData.append("ingredientes", produtoAtualizado.ingredientes);
      formData.append("imagem", produtoAtualizado.imagem);
      formData.append("imagemAtual", produtoAtualizado.imagemAtual);
  
      await API.put(`/produtos/${produtoId}`, formData);
  
      NotifySuccess({mensagem: "Produto atualizado com sucesso! 🚀"});

      navegarParaPaginaAnterior();
      // setTimeout(() => { navegarParaPaginaAnterior(); }, 5000);
    } 
    catch (exception) {
      let mensagemDeErro = exception?.response?.data?.Message || "Ocorreu um erro ao atualizar o produto.";
      NotifyError({mensagem: mensagemDeErro});
    } 
    finally {
      setLoading(false);
    }
	}

  async function handleExcluirProduto() {
    let produtoId = params.id;
    let confirm = window.confirm("Deseja realmente excluir o produto?");
  
    if (confirm) {
      setLoading(true);

      try {
        await API.delete(`/produtos/${produtoId}`);
        navigate("/");
      } 
      catch (exception) {
        let mensagemDeErro = exception?.response?.data?.Message || "Ocorreu um erro ao excluir o produto.";
        NotifyError({mensagem: mensagemDeErro});
      } 
      finally {
        setLoading(false);
      }
    }
  }

  function handleRemoverIngrediente(ingredienteParaRemover) {
    setIngredientes((ingredientesAtuais) => ingredientesAtuais.filter((ingrediente) => ingrediente !== ingredienteParaRemover));
  }

  function handleSelecionarImagem(e) {
    const tiposDeFormatoDeImagemSuportados = ["image/png", "image/jpg", "image/jpeg"];
    let file = e.target.files[0];

    if (!tiposDeFormatoDeImagemSuportados.find(type => type === file?.type) ?? true) 
      return NotifyError({mensagem: "O tipo de arquivo selecionado não é permitido."});

    setImagem(file);
    setImagemAtualizada(file);
    setNomeDoArquivo(file.name);
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

        <main>
          <Form>
            <header>
              <ButtonText onClick={navegarParaPaginaAnterior}><RxCaretLeft />voltar</ButtonText>
              <h1>Editar prato</h1>
            </header>

            <div>
              <Section title="Imagem do prato">
                <Imagem className="imagem">
                  <label htmlFor="imagem">
                    <FiUpload size={"2.4rem"} />
                    <span>{nomeDoArquivo || "Selecione a imagem"}</span>

                    <input 
                      id="imagem" 
                      type="file"
                      onChange={handleSelecionarImagem}
                    />
                  </label>
                </Imagem>
              </Section>

              <Section title="Nome">
                <Input className="nome"
                  placeholder="Ex.: Salada Ceasar"
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
              </Section>

              <Section title="Categoria">
                <Categoria className="categoria">
                  <label htmlFor="categoria">
                    <select 
                      id="categoria" 
                      value={categoria}
                      onChange={e => setCategoria(e.target.value)}
                    >
                      <option value="">Selecionar</option>
                      <option value="Refeicao">Refeição</option>
                      <option value="Sobremesa">Sobremesa</option>
                      <option value="Bebida">Bebida</option>
                    </select>

                    <RiArrowDownSLine size={"2.4rem"} />
                  </label>
                </Categoria>
              </Section>
            </div>

            <div>
              <Section title="Ingredientes">
                <div className="ingredientes">
                  {
                    ingredientes.map((ingrediente, index) => (
                      <NovoIngrediente
                        key={String(index)}
                        value={ingrediente}
                        onClick={() => handleRemoverIngrediente(ingrediente)}
                      />
                    ))
                  }

                  <NovoIngrediente
                    isNovoIngrediente={true}
                    placeholder="Adicionar"
                    onChange={(e) => setNovoIngrediente(e.target.value)}
                    value={novoIngrediente}
                    onClick={handleAdicionarIngrediente}
                  />
                </div>
              </Section>

              <Section title="Preço">
                <Input className="preco"
                  placeholder="R$ 00,00" 
                  type="number"
                  value={preco}
                  onChange={e => setPreco(e.target.value)}
                />
              </Section>
            </div>

            <Section title="Descrição">
              <Textarea 
                placeholder="Fale brevemente sobre o prato, seus ingredientes e composição"
                defaultValue={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </Section>

            <div className="buttons">
              <Button 
                className="excluir" 
                title="Excluir produto" 
                onClick={handleExcluirProduto} 
                loading={loading}
              />

              <Button
                className="salvar"
                title="Salvar alterações"
                onClick={handleEditarProduto}
                loading={loading}
              />
            </div>
          </Form>
        </main>
        
        <Footer />
      </Container>
    </>
  );
}