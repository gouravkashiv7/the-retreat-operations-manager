import styled from "styled-components";
import Tag from "../../ui/Tag";
import Button from "../../ui/Button";
import CheckoutButton from "./CheckoutButton";
import { Flag } from "../../ui/Flag";
import { Link } from "react-router-dom";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;
  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 1.2rem;
    border: 1px solid var(--color-grey-200);
    border-radius: var(--border-radius-sm);
    margin-bottom: 0.8rem;
    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-sm);

    &:first-child {
      border-top: 1px solid var(--color-grey-200);
    }
  }
`;

const CardTop = styled.div`
  display: none;

  @media (max-width: 600px) {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.8rem;
  }
`;

const GuestName = styled.div`
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardBottom = styled.div`
  display: none;

  @media (max-width: 600px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
  }
`;

const Nights = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-500);
  background: var(--color-grey-100);
  padding: 0.2rem 0.8rem;
  border-radius: 100px;
`;

/* Desktop-only elements (hidden on mobile) */
const DesktopTag = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;
const DesktopFlag = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;
const DesktopGuest = styled.div`
  font-weight: 500;
  @media (max-width: 600px) {
    display: none;
  }
`;
const DesktopNights = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;
const DesktopAction = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;

function TodayItem({ activity }) {
  const { id, status, guests, numNights } = activity;

  return (
    <StyledTodayItem>
      {/* ── Desktop grid layout ── */}
      <DesktopTag>
        {(status === "unconfirmed" || status === "confirmed") && (
          <Tag type="green">Arriving</Tag>
        )}
        {status === "checked-in" && <Tag type="blue">Departing</Tag>}
      </DesktopTag>
      <DesktopFlag>
        <Flag src={guests.countryFlag} alt={`Flag of ${guests.country}`} />
      </DesktopFlag>
      <DesktopGuest>{guests.fullName}</DesktopGuest>
      <DesktopNights>
        {numNights === 1 ? "1 night" : `${numNights} nights`}
      </DesktopNights>
      <DesktopAction>
        {(status === "unconfirmed" || status === "confirmed") && (
          <Button
            $variation="primary"
            $size="small"
            as={Link}
            to={`/checkin/${id}`}
          >
            Checkin
          </Button>
        )}
        {status === "checked-in" && <CheckoutButton bookingId={id} />}
      </DesktopAction>

      {/* ── Mobile card layout ── */}
      <CardTop>
        <Flag src={guests.countryFlag} alt={`Flag of ${guests.country}`} />
        <GuestName>{guests.fullName}</GuestName>
        {(status === "unconfirmed" || status === "confirmed") && (
          <Tag type="green">Arriving</Tag>
        )}
        {status === "checked-in" && <Tag type="blue">Departing</Tag>}
      </CardTop>
      <CardBottom>
        <Nights>{numNights === 1 ? "1 night" : `${numNights} nights`}</Nights>
        {(status === "unconfirmed" || status === "confirmed") && (
          <Button
            $variation="primary"
            $size="small"
            as={Link}
            to={`/checkin/${id}`}
          >
            Checkin
          </Button>
        )}
        {status === "checked-in" && <CheckoutButton bookingId={id} />}
      </CardBottom>
    </StyledTodayItem>
  );
}

export default TodayItem;
