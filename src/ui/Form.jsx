import styled, { css } from "styled-components";

const Form = styled.form.attrs((props) => ({
  type: props.type || "regular",
}))`
  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);

      @media (max-width: 768px) {
        padding: 2rem 3rem;
        border-radius: var(--border-radius-sm);
      }

      @media (max-width: 480px) {
        padding: 0.8rem 1.2rem;
        border: none;
        background-color: transparent;
      }
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 100%;
      max-width: 80rem;

      @media (max-width: 768px) {
        max-width: 60rem;
        margin: 0 auto;
      }

      @media (max-width: 480px) {
        max-width: none;
        margin: 0;
        border-radius: 0;
        padding: 0;
      }
    `}
    
  overflow: hidden;
  font-size: 1.4rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    line-height: 1.4;
  }
`;

export default Form;
