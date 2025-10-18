import styled from "styled-components";
import { format, isToday } from "date-fns";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineHomeModern,
  HiOutlineBuildingOffice,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";

import DataItem from "../../ui/DataItem";
import { Flag } from "../../ui/Flag";

import { formatDistanceFromNow, formatCurrency } from "../../utils/helpers";

const StyledBookingDataBox = styled.section`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;

  /* Mobile */
  @media (max-width: 768px) {
    border-radius: var(--border-radius-sm);
    margin: 0 -1rem;
    border-left: none;
    border-right: none;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    margin: 0 -0.5rem;
  }
`;

const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2rem 4rem;
  color: #e0e7ff;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    font-family: "Sono";
    font-size: 2rem;
    margin-left: 4px;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.8rem 3.2rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.6rem 2.4rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;

    & div:first-child {
      font-size: 1.6rem;
      gap: 1.2rem;
    }

    svg {
      height: 2.8rem;
      width: 2.8rem;
    }

    & span {
      font-size: 1.8rem;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1.4rem 2rem;

    & div:first-child {
      font-size: 1.4rem;
      gap: 1rem;
    }

    svg {
      height: 2.4rem;
      width: 2.4rem;
    }

    & span {
      font-size: 1.6rem;
    }
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    padding: 1.2rem 1.6rem;

    & div:first-child {
      font-size: 1.3rem;
    }

    svg {
      height: 2.2rem;
      width: 2.2rem;
    }
  }
`;

const Section = styled.section`
  padding: 3.2rem 4rem 1.2rem;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 2.8rem 3.2rem 1rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 2.4rem 2.4rem 0.8rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 2rem 2rem 0.6rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    padding: 1.6rem 1.6rem 0.4rem;
  }
`;

const Guest = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-500);
  flex-wrap: wrap;

  & p:first-of-type {
    font-weight: 500;
    color: var(--color-grey-700);
  }

  /* Mobile */
  @media (max-width: 768px) {
    gap: 0.8rem;
    margin-bottom: 1.2rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    gap: 0.6rem;
    margin-bottom: 1rem;

    /* Stack guest info on very small screens */
    flex-direction: column;
    align-items: flex-start;

    & span {
      display: none; /* Hide bullets when stacked */
    }
  }
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 3.2rem;
  border-radius: var(--border-radius-sm);
  margin-top: 2.4rem;
  background-color: ${(props) =>
    props.$isPaid ? "var(--color-green-100)" : "var(--color-yellow-100)"};
  color: ${(props) =>
    props.$isPaid ? "var(--color-green-700)" : "var(--color-yellow-700)"};

  & p:last-child {
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 600;
  }

  svg {
    height: 2.4rem;
    width: 2.4rem;
    color: currentColor !important;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.4rem 2.8rem;
    margin-top: 2rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.2rem 2.4rem;
    margin-top: 1.6rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;

    & p:last-child {
      align-self: flex-end;
      font-size: 1.3rem;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1rem 2rem;
    margin-top: 1.4rem;
    gap: 0.6rem;

    & p:last-child {
      font-size: 1.2rem;
    }

    svg {
      height: 2rem;
      width: 2rem;
    }
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.4rem 3.2rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.2rem 2.4rem;
    font-size: 1.1rem;
    text-align: center;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

// A purely presentational component
function BookingDataBox({ booking }) {
  const {
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    accommodationPrice,
    extrasPrice,
    totalPrice,
    hasBreakfast,
    observations,
    isPaid,
    guests: { fullName: guestName, email, country, countryFlag, nationalID },
    accommodation: { name: accommodationName },
    booking_cabins,
    booking_rooms,
  } = booking;

  return (
    <StyledBookingDataBox>
      <Header>
        <div>
          {/* Dynamic icon */}
          {booking_cabins?.length > 0 && booking_rooms?.length > 0 ? (
            <HiOutlineBuildingStorefront />
          ) : booking_cabins?.length > 0 ? (
            <HiOutlineHomeModern />
          ) : (
            <HiOutlineBuildingOffice />
          )}

          <p>
            {numNights} nights in{" "}
            {booking_cabins?.length > 0 && booking_rooms?.length > 0
              ? "Rooms & Cabins"
              : booking_cabins?.length > 0
              ? booking_cabins?.length > 1
                ? "Cabins"
                : "Cabin"
              : booking_rooms?.length > 1
              ? "Rooms"
              : "Room"}{" "}
            <span>({accommodationName})</span>
          </p>
        </div>

        <p>
          {format(new Date(startDate), "EEE, MMM dd yyyy")} (
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}
          ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
        </p>
      </Header>

      <Section>
        <Guest>
          {countryFlag && <Flag src={countryFlag} alt={`Flag of ${country}`} />}
          <p>
            {guestName} {numGuests > 1 ? `+ ${numGuests - 1} guests` : ""}
          </p>
          <span>&bull;</span>
          <p>{email}</p>
          <span>&bull;</span>
          <p>National ID {nationalID}</p>
        </Guest>

        {observations && (
          <DataItem
            icon={<HiOutlineChatBubbleBottomCenterText />}
            label="Observations"
          >
            {observations}
          </DataItem>
        )}

        <DataItem icon={<HiOutlineCheckCircle />} label="Breakfast included?">
          {hasBreakfast ? "Yes" : "No"}
        </DataItem>

        <Price $isPaid={isPaid}>
          <DataItem icon={<HiOutlineCurrencyDollar />} label={`Total price`}>
            {formatCurrency(totalPrice)}

            {hasBreakfast &&
              ` (${formatCurrency(
                accommodationPrice * numNights
              )} accommodation + ${formatCurrency(extrasPrice)} breakfast)`}
          </DataItem>

          <p>{isPaid ? "Paid" : "Will pay at property"}</p>
        </Price>
      </Section>

      <Footer>
        <p>Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}</p>
      </Footer>
    </StyledBookingDataBox>
  );
}

export default BookingDataBox;
