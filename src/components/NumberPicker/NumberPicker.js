import styled from "styled-components";
import { DEVICE_BREAKPOINTS_PIXELS } from "../../styles/deviceBreakpoints";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;

  color: ${({ theme }) => theme.COLORS.GRAY_200};

  button {
    border: none;
    background: none;

    color: ${({ theme }) => theme.COLORS.GRAY_200};
    transition: filter 0.2s;

    &:hover {
      filter: brightness(0.9);
    }
  }

  @media (min-width: ${DEVICE_BREAKPOINTS_PIXELS.LG}) {
    svg,
    span {
      font-weight: 700;
      font-size: 2rem;
      line-height: 160%;
    }
  }
`;