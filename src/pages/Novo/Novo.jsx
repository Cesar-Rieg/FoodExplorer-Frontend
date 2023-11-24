/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useMediaQuery } from "react-responsive";
import { useNavigate } from 'react-router-dom';

import { RxCaretLeft } from "react-icons/rx";
import { FiUpload } from "react-icons/fi";
import { RiArrowDownSLine } from "react-icons/ri";

import { API } from '../../services/ApiService.js';
import { DEVICE_BREAKPOINTS } from '../../styles/deviceBreakpoints.js';
import { Categoria, Container, Form, Imagem } from "./Novo.js";
import { Menu } from "../../components/Menu/Menu.jsx";
import { Header } from '../../components/Header/Header.jsx';
import { ButtonText } from "../../components/ButtonText/ButtonText.jsx";
import { Section } from '../../components/Section/Section.jsx';
import { Input } from '../../components/Input/Input.jsx';
import { NovoIngrediente } from '../../components/NovoIngrediente/NovoIngrediente.jsx';
import { Textarea } from '../../components/Textarea/Textarea.jsx';
import { Button } from "../../components/Button/Button.jsx";
import { Footer } from '../../components/Footer/Footer.jsx';
import { Notification, NotifyError, NotifySuccess, NotifyWarning } from '../../components/Notification/Notification.jsx';

export function Novo({ isAdmin }) {
  const isDesktop = useMediaQuery({ minWidth: DEVICE_BREAKPOINTS.LG });
  const navigate = useNavigate();

  let [ isMenuOpen, setIsMenuOpen ] = useState(false);
  let [ nome, setNome ] = useState("");
	let [ descricao, setDescricao ] = useState("");
  let [ categoria, setCategoria ] = useState("");
  let [ preco, setPreco ] = useState("");
  let [ imagem, setImagem ] = useState(null);
  let [ nomeDoArquivo, setNomeDoArquivo ] = useState("");
  let [ ingredientes, setIngredientes ] = useState([]);
  let [ novoIngrediente, setNovoIngrediente ] = useState("");
  let [ loading, setLoading ] = useState(false);

  function handleAdicionarIngrediente() {
    if (!novoIngrediente || novoIngrediente === null || novoIngrediente === undefined) return;

    setIngredientes((ingredientesAtuais) => [...ingredientesAtuais, novoIngrediente]);
    setNovoIngrediente("");
  }

  function handleImagemChange(e) {
    let file = e.target.files[0];
    setImagem(file);
    setNomeDoArquivo(file.name);
  }

  function handleRemoverIngrediente(ingredienteParaRemover) {
    setIngredientes((ingredientesAtuais) => ingredientesAtuais.filter((ingrediente) => ingrediente !== ingredienteParaRemover));
  }

  async function handleNovoProduto() {
    if (!imagem) return NotifyWarning({mensagem: "A imagem do produto não foi informada."});
    if (!nome) return NotifyWarning({mensagem: "O nome do produto não foi informado."});
    if (!categoria) return NotifyWarning({mensagem: "A categoria do produto não foi informada."});
    if (!preco) return NotifyWarning({mensagem: "O preço do produto não foi informado."});
    if (!descricao) return NotifyWarning({mensagem: "A descrição do produto não foi informada."});
    if (ingredientes.length === 0) return NotifyWarning({mensagem: "Informe pelo menos um ingrediente do produto."});

    if (novoIngrediente) 
      return NotifyWarning({mensagem: "Existe um ingrediente em edição. Clique para adicionar ou deixe o campo vazio."});

    setLoading(true);
    
		const formData = new FormData();
    formData.append("imagem", imagem);
    formData.append("nome", nome);
    formData.append("categoria", categoria);
    formData.append("preco", preco);
    formData.append("descricao", descricao);
    formData.append("ingredientes", JSON.stringify(ingredientes));

    try {
      await API.post("/produtos", formData);
      NotifySuccess({mensagem: "Produto cadastrado com sucesso! 🚀"});
      navegarParaPaginaAnterior();
      // setTimeout(() => { navegarParaPaginaAnterior(); }, 5000);
    } 
    catch (exception) {
      let mensagemDeErro = exception?.response?.data?.Message || "Ocorreu um erro ao cadastrar o produto.";
      NotifyError({mensagem: mensagemDeErro});
    } 
    finally {
      setLoading(false);
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
              <h1>Adicionar prato</h1>
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
                      onChange={handleImagemChange}
                    />
                  </label>
                </Imagem>
              </Section>

              <Section title="Nome">
                <Input 
                  className="nome"
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
                <Input 
                  className="preco"
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
                onChange={(e) => setDescricao(e.target.value)}
              />
            </Section>

            <div className="salvar">
              <Button
                title="Salvar alterações"
                onClick={handleNovoProduto}
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