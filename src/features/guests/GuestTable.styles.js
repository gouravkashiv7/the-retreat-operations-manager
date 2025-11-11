// components/guests/GuestTable.styles.js
import styled from "styled-components";

export const Table = styled.div`
  background: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  width: 100%;
  min-width: 1000px;

  /* Desktop - allow horizontal scroll on smaller screens */
  @media (max-width: 1200px) {
    min-width: 1000px;
    overflow-x: auto;
  }

  /* Tablet - smaller min-width */
  @media (max-width: 1024px) {
    min-width: 900px;
  }

  /* Large Mobile - switch to vertical layout */
  @media (max-width: 768px) {
    padding: 0.5rem;
    min-width: unset;
    overflow-x: visible;
    border-radius: var(--border-radius-sm);
    box-shadow: var(--shadow-xs);
  }

  /* Mobile */
  @media (max-width: 480px) {
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--color-grey-200);
  }
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 120px 1.2fr 2.5fr 1.5fr 1fr 100px;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-200);
  font-weight: 600;
  color: var(--color-grey-700);
  align-items: center;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.2rem 1.5rem;
    gap: 0.8rem;
  }

  /* Mobile - hide header completely */
  @media (max-width: 768px) {
    display: none;
  }
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1.2fr 2.5fr 1.5fr 1fr 100px;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: start;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--color-grey-50);
  }

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.2rem 1.5rem;
    gap: 0.8rem;
  }

  /* Mobile - switch to card layout */
  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 0.8rem;
    gap: 1.2rem;
    padding: 1.8rem 1.5rem;
    border-bottom: 1px solid var(--color-grey-200);
    background: var(--color-grey-0);
    margin: 0.5rem;
    border-radius: var(--border-radius-sm);
    box-shadow: var(--shadow-xs);
    align-items: baseline;
    &:last-child {
      border-bottom: 1px solid var(--color-grey-200);
    }

    &:hover {
      background-color: var(--color-grey-0);
      box-shadow: var(--shadow-sm);
    }
    &::before {
      content: "";
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1.5rem 1.2rem;
    margin-bottom: 0.6rem;
    gap: 1rem;
    margin: 0.3rem;
    border-radius: var(--border-radius-xs);
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    padding: 1.2rem 1rem;
    gap: 0.8rem;
  }
`;

export const Cell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 40px;
  justify-content: center;
  border-right: 1px solid var(--color-grey-100);

  &:last-child {
    border-right: none;
  }

  & > * {
    width: 100%;
  }

  /* Mobile - card layout */
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: none;
    padding-bottom: 0;
    min-height: auto;
    width: 100%;

    /* Header section - ID and Name side by side */
    &.id,
    &.actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: auto;
      order: 1;
    }

    &.id {
      margin-right: auto; /* Push to left */
    }

    &.actions {
      margin-left: auto; /* Push to right */
    }

    /* Move name below */
    &.name {
      order: 2;
      width: 100%;
      margin-top: 0.5rem;
      display: flex;
      flex-direction: row;
    }
    /* Contact info - full width */
    &.email {
      order: 3;
      padding: 0.8rem 0;
      border-top: 1px solid var(--color-grey-100);
      border-bottom: 1px solid var(--color-grey-100);
      background: var(--color-grey-50);
      margin: 0 -1.5rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }

    /* National ID and Bookings side by side */
    &.nationalId,
    &.bookings {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 1rem;
      padding: 0.5rem 0;
      order: 5;
      width: 100%;
    }

    &.nationalId {
      order: 4;
    }

    &.bookings {
      order: 5;
    }

    /* Actions - full width at bottom */
    &.actions {
      grid-area: unset;
    }
  }

  /* Small Mobile adjustments */
  @media (max-width: 480px) {
    &.id,
    &.name {
      gap: 0.8rem;
    }

    &.email {
      margin: 0 -1.2rem;
      padding-left: 1.2rem;
      padding-right: 1.2rem;
    }

    &.nationalId,
    &.bookings {
      gap: 0.8rem;
      padding: 0.3rem 0;
    }

    &.actions {
      padding-top: 0.8rem;
    }
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    &.id,
    &.name {
      gap: 0.6rem;
    }

    &.email {
      margin: 0 -1rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    &.nationalId,
    &.bookings {
      gap: 0.6rem;
    }
  }
`;

export const MobileLabel = styled.span`
  display: none;
  font-weight: 600;
  color: var(--color-grey-700);
  font-size: 1.3rem;
  min-width: 85px;

  @media (max-width: 768px) {
    display: block;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.2rem;
    min-width: 75px;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.1rem;
    min-width: 70px;
  }
`;

export const Name = styled.div`
  font-weight: 600;
  color: var(--color-grey-800);
  font-size: 1.4rem;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

export const Email = styled.div`
  color: var(--color-grey-600);
  font-size: 1.4rem;
  line-height: 1.3;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const Detail = styled.div`
  color: var(--color-grey-700);
  font-size: 1.4rem;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const GuestId = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  text-align: center;
  background: var(--color-grey-50);
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-200);

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 0.3rem 0.6rem;
  }
`;

export const BookingId = styled.div`
  color: var(--color-brand-600);
  font-weight: 500;
  font-size: 1.3rem;
  line-height: 1.4;

  &:not(:last-child) {
    margin-bottom: 0.3rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const BookingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center; /* Ensure vertical center */

  @media (max-width: 768px) {
    justify-content: center;
    align-items: center; /* Center vertically */
    height: 100%; /* Take full height of parent */
  }
`;

// Additional mobile-specific components
export const MobileCard = styled.div`
  @media (max-width: 768px) {
    background: white;
    border-radius: var(--border-radius-sm);
    padding: 1rem;
    margin-bottom: 0.5rem;
    box-shadow: var(--shadow-xs);
  }
`;

export const InfoRow = styled.div`
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.5rem 0;

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-grey-100);
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.3rem;
    align-items: stretch;
  }
`;
