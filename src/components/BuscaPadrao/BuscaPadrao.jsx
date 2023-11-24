/* eslint-disable react/prop-types */
import { FiSearch } from "react-icons/fi";
import { Container } from "./BuscaPadrao.js";
import { Input } from "../Input/Input.jsx";

export function BuscaPadrao({ setBusca, isDisabled }) {
  return (
    <Container>
      <Input
        placeholder="Busque por pratos ou ingredientes"
        icon={FiSearch}
        disabled={isDisabled}
        onChange={(e) => setBusca(e.target.value)}
      />
    </Container>
  );
}