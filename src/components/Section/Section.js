import styled from "styled-components";

export const Container = styled.section`
  > h2 {
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    font-size: 1.6rem;
    font-weight: 400;
    margin-bottom: 1.6rem;
  }
`;