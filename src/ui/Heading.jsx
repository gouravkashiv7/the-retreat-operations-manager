import styled, { css } from "styled-components";

const Heading = styled.h1`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}

  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}
    
  ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 500;
    `}

  ${(props) =>
    props.as === "h4" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      text-align: center;
    `}
    
  line-height: 1.4;

  /* Minimal mobile responsiveness */
  @media (max-width: 768px) {
    font-size: ${(props) =>
      props.as === "h1"
        ? "2.4rem"
        : props.as === "h2"
        ? "1.8rem"
        : props.as === "h3"
        ? "1.7rem"
        : props.as === "h4"
        ? "2.2rem"
        : "inherit"};
  }
`;

export default Heading;
