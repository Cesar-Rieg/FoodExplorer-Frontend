import styled from "styled-components";
import { DEVICE_BREAKPOINTS_PIXELS } from '../../styles/deviceBreakpoints.js';

export const Container = styled.footer`
  grid-area: footer;

  height: 7.7rem;
  width: 100%;
  padding: 2.9rem 2.8rem;

  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_300};

  @media (min-width: ${DEVICE_BREAKPOINTS_PIXELS.LG}) {
    padding: 2.4rem 12.3rem;
  }
`;

export const LogoMarca = styled.div`
  display: flex;
  align-items: center;

  > img {
    width: 14.2rem;
  }

  @media (min-width: ${DEVICE_BREAKPOINTS_PIXELS.LG}) {
    > img {
      width: 18.6rem;
    }
  }
`;

export const Copyright = styled.span`
  display: flex;
  align-items: center;

  font-size: 1.2rem;
  color: ${({ theme }) => theme.COLORS.LIGHT_WHITE};
  
  @media (min-width: ${DEVICE_BREAKPOINTS_PIXELS.LG}) {
    font-size: 1.4rem;
    line-height: 160%;
  }
`;