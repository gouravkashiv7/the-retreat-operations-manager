import styled from "styled-components";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isToday,
  startOfMonth,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineRefresh,
} from "react-icons/hi";
import { formatCurrencyNoDecimals } from "../../utils/helpers";

const StyledCalendarBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  width: 100%;
  max-width: 80rem;
  box-shadow: var(--shadow-sm);
  position: relative;

  @media (max-width: 600px) {
    padding: 1.6rem;
    gap: 1.6rem;
  }
`;

const SyncStatus = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1rem;
  color: var(--color-grey-400);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--color-grey-50);
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius-sm);
`;

const BoxHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  padding-bottom: 1.6rem;
`;

const AccommodationName = styled.h3`
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-grey-800);
`;

const AccommodationDescription = styled.p`
  font-size: 1.6rem;
  color: var(--color-grey-500);
  font-style: italic;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.8rem;
`;

const DayName = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-grey-500);
  text-align: center;
  padding-bottom: 0.8rem;
`;

const Day = styled.div`
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  border-radius: var(--border-radius-sm);
  position: relative;
  cursor: default;
  transition: all 0.2s;
  padding: 0.8rem;

  background-color: ${(props) => {
    if (props.$isExternal) return "var(--color-orange-700)"; // Distinct color for external
    if (props.$status === "confirmed") return "var(--color-brand-600)";
    if (props.$status === "unconfirmed") return "var(--color-brand-200)";
    if (props.$isToday) return "var(--color-grey-100)";
    return "transparent";
  }};

  color: ${(props) => {
    if (props.$isExternal) return "#fff";
    if (props.$status === "confirmed") return "var(--color-brand-50)";
    if (props.$status === "unconfirmed") return "var(--color-brand-800)";
    if (props.$isToday) return "var(--color-brand-600)";
    if (props.$isDimmed) return "var(--color-grey-300)";
    return "inherit";
  }};

  font-weight: ${(props) =>
    props.$status || props.$isToday || props.$isExternal ? "700" : "500"};

  &:hover {
    background-color: ${(props) =>
      !props.$status && !props.$isExternal && "var(--color-grey-50)"};
  }
`;

const DayNumber = styled.span`
  font-size: 1.6rem;
`;

const DayPrice = styled.span`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.4rem;

  ${(props) => props.$isExternal && "visibility: hidden;"}
  ${(props) =>
    props.$status === "confirmed" && "color: var(--color-brand-100);"}
  ${(props) =>
    props.$status === "unconfirmed" && "color: var(--color-brand-700);"}
`;

const Tooltip = styled.div`
  visibility: hidden;
  width: 140px;
  background-color: var(--color-grey-800);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px;
  position: absolute;
  z-index: 10;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 1rem;
  pointer-events: none;
  box-shadow: var(--shadow-md);

  ${Day}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

function CalendarBox({
  item,
  type,
  month,
  bookings = [],
  externalBookings = [],
  isExternalLoading = false,
}) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });

  const hasExternalSync = externalBookings.length > 0;

  // Get days to pad at the start of the grid
  const startDay = getDay(start); // 0 (Sun) to 6 (Sat)
  const paddingDays = Array.from({ length: startDay }, (_, i) => i);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const itemBookings = bookings.filter((booking) => {
    if (type === "room") {
      return booking.booking_rooms?.some((br) => br.roomId === item.id);
    } else {
      return booking.booking_cabins?.some((bc) => bc.cabinId === item.id);
    }
  });

  function getBookingForDay(day) {
    // Check local bookings first
    const localMatch = itemBookings.find((booking) => {
      const checkIn = parseISO(booking.startDate);
      const checkOut = parseISO(booking.endDate);
      return (
        (isSameDay(day, checkIn) || isAfter(day, checkIn)) &&
        isBefore(day, checkOut)
      );
    });

    if (localMatch) return localMatch;

    // Check external bookings
    return externalBookings.find((booking) => {
      const checkIn = parseISO(booking.startDate);
      const checkOut = parseISO(booking.endDate);
      return (
        (isSameDay(day, checkIn) || isAfter(day, checkIn)) &&
        isBefore(day, checkOut)
      );
    });
  }

  // Calculate daily rate for the selected item
  const dailyRate = item.regularPrice - (item.discount || 0);

  return (
    <StyledCalendarBox>
      {(hasExternalSync || isExternalLoading) && (
        <SyncStatus>
          <HiOutlineRefresh />
          {isExternalLoading ? "Syncing Goibibo..." : "Synced with Goibibo"}
        </SyncStatus>
      )}

      <BoxHeader>
        <AccommodationName>{item.name}</AccommodationName>
        {item.description && (
          <AccommodationDescription>
            {item.description}
          </AccommodationDescription>
        )}
      </BoxHeader>

      <CalendarGrid>
        {dayNames.map((name) => (
          <DayName key={name}>{name.charAt(0)}</DayName>
        ))}

        {paddingDays.map((i) => (
          <Day key={`pad-${i}`} $isDimmed />
        ))}

        {days.map((day) => {
          const booking = getBookingForDay(day);
          const status = booking?.status;
          const isExternal = booking?.isExternal;

          return (
            <Day
              key={day.toString()}
              $isToday={isToday(day)}
              $status={status}
              $isExternal={isExternal}
            >
              <DayNumber>{format(day, "d")}</DayNumber>
              <DayPrice $status={status} $isExternal={isExternal}>
                {formatCurrencyNoDecimals(dailyRate)}
              </DayPrice>

              {booking && (
                <Tooltip>
                  {isExternal ? (
                    <>
                      <strong>Goibibo / MMT</strong>
                      <br />
                      Blocked External
                    </>
                  ) : (
                    <>
                      <strong>{booking.guests?.fullName || "Guest"}</strong>
                      <br />
                      Status: {status}
                    </>
                  )}
                </Tooltip>
              )}
            </Day>
          );
        })}
      </CalendarGrid>
    </StyledCalendarBox>
  );
}

export default CalendarBox;
