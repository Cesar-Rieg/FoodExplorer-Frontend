import { useState } from 'react';
import { Link } from "react-router-dom";

import { UseAuthentication } from '../../hooks/Authentication.jsx';
import { Container, LogoMarca, Form } from "./SignIn.js";
import { Button } from "../../components/Button/Button.jsx";
import { Input } from '../../components/Input/Input.jsx';
import { Section } from '../../components/Section/Section.jsx';
import { Notification, NotifyError, NotifyWarning } from '../../components/Notification/Notification.jsx';

import logoMarca from "../../assets/LogoMarca/LogoMarca.svg";

export function SignIn() {
  const { signIn } = UseAuthentication();

  let [ email, setEmail ] = useState("");
  let [ senha, setSenha ] = useState("");
  let [ loading, setLoading ] = useState(false);

  function handleKeyPress(ev){
    if (ev.key === "Enter" || ev.code === "Enter") handleSignIn();
  }

  function handleSignIn() {
    if (!email) return NotifyWarning({mensagem: `Ops! Você esqueceu de informar o seu email.`});
    if (!senha) return NotifyWarning({mensagem: `Ops! Você esqueceu de informar a sua senha.`});
    
    setLoading(true);

    signIn({ email, senha })
      .catch((error) => NotifyError({mensagem: error.Message}))
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
          <h2>Faça seu login</h2>

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

          <Button title="Entrar" onClick={handleSignIn} loading={loading} />
          
          <Link to="/register">Criar uma conta</Link>
        </Form>
      </Container>
    </>
  );
}