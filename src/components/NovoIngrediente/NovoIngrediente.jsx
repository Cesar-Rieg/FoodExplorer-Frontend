/* eslint-disable react/prop-types */
import { FiPlus, FiX } from "react-icons/fi";
import { Container } from "./NovoIngrediente.js";

export function NovoIngrediente({ isNovoIngrediente, value, onClick, ...rest }) {
  function getClassNameAdicionarIngrediente() {
    return isNovoIngrediente ? "button-add" : "button-delete";
  }

  return (
    <Container isNovoIngrediente={isNovoIngrediente}>
      <input type="text" value={value} readOnly={!isNovoIngrediente} {...rest} />

      <button type="button" onClick={onClick} className={getClassNameAdicionarIngrediente}>
        {isNovoIngrediente ? <FiPlus /> : <FiX />}
      </button>
    </Container>
  );
}