import styled from "styled-components";

/* ── Desktop table ── */
export const DesktopTable = styled.div`
  background: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  width: 100%;
  border: 1px solid var(--color-grey-100);

  @media (max-width: 640px) {
    display: none;
  }
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1.4fr 2fr 1.4fr 1fr 60px;
  gap: 1.2rem;
  padding: 1.4rem 2rem;
  background-color: var(--color-grey-50);
  border-bottom: 2px solid var(--color-grey-200);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 60px 1.2fr 1.8fr 1.2fr 1fr 50px;
    padding: 1.2rem 1.6rem;
  }
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1.4fr 2fr 1.4fr 1fr 60px;
  gap: 1.2rem;
  padding: 1.4rem 2rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  background: var(--color-grey-0);
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--color-grey-50);
  }

  @media (max-width: 900px) {
    grid-template-columns: 60px 1.2fr 1.8fr 1.2fr 1fr 50px;
    padding: 1.2rem 1.6rem;
  }
`;

/* ── Mobile card list ── */
export const MobileCardList = styled.div`
  display: none;
  flex-direction: column;
  gap: 1.2rem;

  @media (max-width: 640px) {
    display: flex;
  }
`;

export const GuestCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

export const GuestCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.4rem 1.6rem 1rem;
  gap: 1.2rem;
`;

export const GuestCardName = styled.div`
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-grey-700);
  line-height: 1.3;
`;

export const GuestCardEmail = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  margin-top: 0.2rem;
  word-break: break-all;
`;

export const GuestCardIdBadge = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-grey-500);
  background: var(--color-grey-100);
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const GuestCardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.6rem;
  padding: 0.8rem 1.6rem 1.2rem;
  border-top: 1px solid var(--color-grey-100);
  background: var(--color-grey-50);
`;

export const GuestCardField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & .label {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-grey-400);
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  & .value {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--color-grey-700);
    word-break: break-word;
  }
`;

export const GuestCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.6rem;
  border-top: 1px solid var(--color-grey-100);
  gap: 0.8rem;
  flex-wrap: wrap;
`;

export const BookingBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

/* ── Desktop cell types ── */
export const Name = styled.div`
  font-weight: 600;
  color: var(--color-grey-800);
  font-size: 1.4rem;
`;

export const Email = styled.div`
  color: var(--color-grey-600);
  font-size: 1.3rem;
  word-break: break-word;
`;

export const Detail = styled.div`
  color: var(--color-grey-600);
  font-size: 1.3rem;
`;

export const GuestId = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-600);
  background: var(--color-grey-100);
  padding: 0.3rem 0.6rem;
  border-radius: 100px;
  text-align: center;
`;

export const BookingId = styled.div`
  color: var(--color-brand-600);
  font-weight: 600;
  font-size: 1.3rem;
  background: var(--color-brand-50, #eef2ff);
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

export const BookingContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* ── ID Preview Gallery ── */
export const IdGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  max-width: 600px;
  width: 100%;
`;

export const IdImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
  
  & img {
    max-width: 100%;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-grey-200);
  }
  
  & span {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

// Keep old exports for backward compat
export const Cell = styled.div``;
export const MobileLabel = styled.span`
  display: none;
`;
export const MobileCard = styled.div``;
export const InfoRow = styled.div``;
export const Table = DesktopTable;
