/* eslint-disable react/prop-types */
import { Container } from "./Textarea.js";

export function Textarea({ value, ...rest }) {
  return (
    <Container {...rest}>
      {value}
    </Container>
  );
}