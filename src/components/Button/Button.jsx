/* eslint-disable react/prop-types */
import { TbReceipt } from "react-icons/tb";
import { useMediaQuery } from 'react-responsive';
import ReactLoading from 'react-loading';

import { Container } from "./Button.js";
import { DEVICE_BREAKPOINTS } from "../../styles/deviceBreakpoints.js";
import COLORS from '../../styles/theme.js';

export function Button({ isCliente, title, loading = false, ...rest }) {
  const isDesktop = useMediaQuery({ minWidth: DEVICE_BREAKPOINTS.LG });
  
  return (
    <Container type="button" disabled={loading} {...rest}>
      {isCliente && <TbReceipt size={"3.2rem"} />}
      {title}
      {loading && <ReactLoading type="spinningBubbles" color={COLORS.WHITE} height={20} width={20} />}
      {isCliente && <span>{isDesktop ? `(${rest.quantidadeDeItensNoPedido})` : rest.quantidadeDeItensNoPedido}</span>}
    </Container>
  );
}