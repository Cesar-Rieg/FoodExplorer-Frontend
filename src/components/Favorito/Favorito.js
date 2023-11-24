import styled from "styled-components";
import { DEVICE_BREAKPOINTS_PIXELS } from "../../styles/deviceBreakpoints";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1.3rem;

  padding: 1.6rem 0;

  > img {
    width: 7.2rem;
    height: fit-content;
    border-radius: 50%;
  }

  > div {
    h2 {
      font-family: "Poppins", sans-serif;
      font-weight: 500;
      font-size: 2rem;
      line-height: 160%;
  
      color: ${({ theme }) => theme.COLORS.GRAY_200};
    }
  
    button {
      border: 0;
      background: none;
  
      font-size: 1.2rem;
      line-height: 160%;
  
      color: ${({ theme }) => theme.COLORS.LIGHT_RED};
    }
  }

  @media (min-width: ${DEVICE_BREAKPOINTS_PIXELS.LG}) {
    width: 23.1rem;
  }
`;