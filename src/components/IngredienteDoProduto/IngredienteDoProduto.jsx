/* eslint-disable react/prop-types */
import { Container } from "./IngredienteDoProduto.js";

export function IngredienteDoProduto({ title, ...rest }) {
  return (
    <Container {...rest}>
      {title}
    </Container>
  );
}