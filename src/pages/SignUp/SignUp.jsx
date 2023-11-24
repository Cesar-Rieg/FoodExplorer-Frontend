import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API } from "../../services/ApiService.js";
import { Container, LogoMarca, Form } from "./SignUp.js";
import { Button } from "../../components/Button/Button.jsx";
import { Input } from '../../components/Input/Input.jsx';
import { Section } from '../../components/Section/Section.jsx';
import { Notification, NotifyError, NotifySuccess, NotifyWarning } from "../../components/Notification/Notification.jsx";

import logoMarca from "../../assets/LogoMarca/LogoMarca.svg";

export function SignUp() {
  const navigate = useNavigate();

  let [ nome, setNome ] = useState("");
  let [ email, setEmail ] = useState("");
  let [ senha, setSenha ] = useState("");
  let [ loading, setLoading ] = useState(false);
  
  function handleKeyPress(ev){
    if (ev.key === "Enter" || ev.code === "Enter") handleSignUp();
  }
  
  function handleNavegarParaPaginaDeLogin() {
    navigate("/");
  }

  function handleSignUp() {
    if (!nome || !email || !senha) return NotifyWarning({mensagem: "Preencha todos os campos!"});

    setLoading(true);

    API
      .post("/usuarios", { nome, email, senha })
      .then((response) => {
        NotifySuccess({mensagem: response.data.Message});
        setTimeout(() => { handleNavegarParaPaginaDeLogin(); }, 5000);
      })
      .catch((exception) => {
        let mensagemDeErro = exception?.response?.data?.Message || "Ocorreu um erro desconhecido ao criar a conta.";
        NotifyError({mensagem: mensagemDeErro});
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Notification/>
      
      <Container>
        <LogoMarca>
          <img src={logoMarca} alt="Logo" />
        </LogoMarca>

        <Form>
          <h2>Crie sua conta</h2>

          <Section title="Seu nome">
            <Input 
              placeholder="Exemplo: Nome Sobrenome" 
              type="text"
              onChange={e => setNome(e.target.value)}
              onKeyPress={e => handleKeyPress(e)}
            />
          </Section>

          <Section title="Email">
            <Input 
              placeholder="Exemplo: exemplo@exemplo.com.br" 
              type="text"
              onChange={e => setEmail(e.target.value)}
              onKeyPress={e => handleKeyPress(e)}
            />
          </Section>

          <Section title="Senha">
            <Input 
              placeholder="No mínimo 6 caracteres" 
              type="password"
              onChange={e => setSenha(e.target.value)}
              onKeyPress={e => handleKeyPress(e)}
            />
          </Section>

          <Button title="Criar conta" onClick={handleSignUp} loading={loading} />

          <Link to="/">Já tenho uma conta</Link>
        </Form>
      </Container>
    </>
  );
}