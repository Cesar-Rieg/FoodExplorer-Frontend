import styled from "styled-components";
import { DEVICE_BREAKPOINTS_PIXELS } from "../../styles/deviceBreakpoints";

export const Container = styled.button`
  background: none;
  border: none;

  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 2.4rem;
  line-height: 140%;

  color: ${({ theme }) => theme.COLORS.GRAY_200};

  display: flex;
  align-items: center;

  > svg {
    font-size: 3.2rem;
    color: ${({ theme }) => theme.COLORS.WHITE};
  }
  
  @media (min-width: ${DEVICE_BREAKPOINTS_PIXELS.LG}) {
    font-weight: 700;
  }
`;
