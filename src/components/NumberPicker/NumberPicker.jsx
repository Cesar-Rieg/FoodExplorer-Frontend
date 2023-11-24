/* eslint-disable react/prop-types */
import { FiMinus, FiPlus } from "react-icons/fi";
import { Container } from "./NumberPicker.js";

export function NumberPicker({ quantidade, setQuantidade }) {
  
  function decrementarQuantidade() {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  }

  function incrementarQuantidade() {
    setQuantidade(quantidade + 1);
  }

  return (
    <Container>
      <button onClick={decrementarQuantidade}><FiMinus /></button>
      <span>{ quantidade < 10 ? `0${quantidade}` : quantidade }</span>
      <button onClick={incrementarQuantidade}><FiPlus /></button>
    </Container>
  );
}
