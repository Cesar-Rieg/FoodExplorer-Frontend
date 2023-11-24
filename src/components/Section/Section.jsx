/* eslint-disable react/prop-types */
import { Container } from "./Section.js";

export function Section({ title, children }) {
  return (
    <Container>
      <h2>{title}</h2>
      {children}
    </Container>
  );
}