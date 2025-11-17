import styled from "styled-components";
import { createPortal } from "react-dom";
import { cloneElement, createContext, useContext, useState } from "react";

import { HiXMark } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2.5rem 3rem;
  transition: all 0.3s ease;
  max-width: 90rem;
  width: auto;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Desktop */
  @media (max-width: 1200px) {
    max-width: 85rem;
    padding: 2.2rem 2.8rem;
  }

  /* Small Desktop / Large Tablet */
  @media (max-width: 1024px) {
    max-width: 80rem;
    padding: 2rem 2.5rem;
    border-radius: var(--border-radius-md);
  }

  /* Tablet */
  @media (max-width: 900px) {
    max-width: 85vw;
    width: 85vw;
    padding: 1.8rem 2.2rem;
    max-height: 88vh;
  }

  /* Large Mobile */
  @media (max-width: 768px) {
    max-width: 90vw;
    width: 90vw;
    padding: 1.6rem 2rem;
    max-height: 90vh;
    border-radius: var(--border-radius-sm);
  }

  /* Mobile */
  @media (max-width: 600px) {
    max-width: 95vw;
    width: 95vw;

    max-height: 92vh;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    max-width: 98vw;
    width: 98vw;

    max-height: 95vh;
    border-radius: var(--border-radius-sm);
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    max-width: 100vw;
    width: 100vw;
    max-height: 100vh;
    padding: 1rem 1.2rem;
    border-radius: 0;
  }

  /* Landscape Orientation */
  @media (max-height: 600px) and (orientation: landscape) {
    max-height: 95vh;
    padding: 1rem 1.5rem;
  }

  /* Very Short Screens */
  @media (max-height: 400px) {
    max-height: 98vh;
    padding: 0.8rem 1rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;

  /* Mobile */
  @media (max-width: 480px) {
    backdrop-filter: blur(2px);
  }

  /* Very Small Mobile - Full screen modal */
  @media (max-width: 360px) {
    background-color: var(--color-grey-0);
    backdrop-filter: none;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;
  z-index: 1001;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
  }

  /* Tablet */
  @media (max-width: 768px) {
    top: 1rem;
    right: 1.4rem;
    padding: 0.4rem;

    & svg {
      width: 2rem;
      height: 2rem;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    top: 0.8rem;
    right: 1rem;
    padding: 0.3rem;
    transform: translateX(0);
    background-color: var(--color-grey-100);

    & svg {
      width: 1.8rem;
      height: 1.8rem;
    }
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    top: 0.6rem;
    right: 0.8rem;
    padding: 0.4rem;
    background-color: var(--color-grey-200);

    & svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;

const ModalContent = styled.div`
  width: 100%;
  height: 100%;

  /* Mobile - ensure content fits */
  @media (max-width: 768px) {
    & > * {
      max-width: 100%;
    }

    /* Scale down any large content */
    & table,
    & .large-content {
      transform: scale(0.95);
      transform-origin: top left;
    }
  }

  /* Very Small Mobile - more aggressive scaling */
  @media (max-width: 480px) {
    & table,
    & .large-content {
      transform: scale(0.9);
    }

    /* Ensure form elements are mobile-friendly */
    & input,
    & select,
    & textarea {
      font-size: 16px; /* Prevent zoom on iOS */
      min-height: 4.4rem;
    }
  }
`;

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: openWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(openWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);
  if (name !== openName) return null;
  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <ModalContent>
          {cloneElement(children, { onCloseModal: close })}
        </ModalContent>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
