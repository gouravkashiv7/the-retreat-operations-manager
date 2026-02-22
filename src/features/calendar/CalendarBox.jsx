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
import { subDays } from "date-fns";
import { useCreateBlock, useUnblock } from "./useCalendarBookings";
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

  .spin {
    animation: rotate 2s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

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
  z-index: 5;
`;

const BoxHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  padding-bottom: 1.6rem;
  padding-right: 10rem; /* Space for SyncStatus */
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

const StyledLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem;
  margin-top: 2.4rem;
  padding-top: 1.6rem;
  border-top: 1px solid var(--color-grey-100);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-grey-600);
`;

const LegendColor = styled.span`
  width: 1.6rem;
  height: 1.6rem;
  border-radius: var(--border-radius-tiny);
  background: ${(props) => props.$background || props.$color};
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

  background: ${(props) => {
    if (props.$isExternal) {
      let color = "var(--color-grey-400)";
      if (props.$platform === "goibibo") color = "#f36f21";
      if (props.$platform === "airbnb") color = "#FF5A5F";
      if (props.$platform === "booking") color = "#003580";

      return `repeating-linear-gradient(
        45deg,
        ${color},
        ${color} 10px,
        ${color}dd 10px,
        ${color}dd 12px
      )`;
    }
    if (props.$status === "confirmed") return "var(--color-brand-600)";
    if (props.$status === "unconfirmed") return "var(--color-brand-200)";
    if (props.$status === "blocked") return "var(--color-grey-400)";
    if (props.$isToday) return "var(--color-grey-100)";
    return "transparent";
  }};

  color: ${(props) => {
    if (props.$isExternal) return "#fff";
    if (props.$status === "confirmed" || props.$status === "blocked")
      return "var(--color-brand-50)";
    if (props.$status === "unconfirmed") return "var(--color-brand-800)";
    if (props.$isToday) return "var(--color-brand-600)";
    if (props.$isDimmed) return "var(--color-grey-300)";
    return "inherit";
  }};

  font-weight: ${(props) =>
    props.$status || props.$isToday || props.$isExternal ? "700" : "500"};

  border: ${(props) =>
    props.$isToday ? "2px solid var(--color-brand-600)" : "none"};

  &:hover {
    background: ${(props) =>
      !props.$status && !props.$isExternal && "var(--color-grey-50)"};
    transform: ${(props) =>
      (props.$status || props.$isExternal) && "scale(1.05)"};
    z-index: 2;
  }
`;

const DayNumber = styled.span`
  font-size: 1.6rem;
`;

const DayPrice = styled.span`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.4rem;

  ${(props) => props.$isExternal && "display: none;"}
  ${(props) =>
    props.$status === "confirmed" && "color: var(--color-brand-100);"}
  ${(props) =>
    props.$status === "unconfirmed" && "color: var(--color-brand-700);"}
`;

const Tooltip = styled.div`
  visibility: hidden;
  width: 160px;
  background-color: #111827;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 10px;
  position: absolute;
  z-index: 100;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 1.1rem;
  pointer-events: none;
  box-shadow: var(--shadow-lg);
  line-height: 1.4;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #111827 transparent transparent transparent;
  }

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
  externalError = null,
}) {
  const { blockRoom, isBlocking } = useCreateBlock();
  const { unblockRoom, isUnblocking } = useUnblock();

  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });

  const hasExternalSync = externalBookings.length > 0 || externalError;

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

  function handleDayClick(day, booking) {
    if (isBlocking || isUnblocking) return;

    // 1. If it's an external booking, do nothing
    if (booking?.isExternal) return;

    // 2. If it's a confirmed/unconfirmed booking, don't allow blocking (must delete booking first)
    if (booking && booking.status !== "blocked") {
      toast.error(
        "Day has an active booking. Please manage the booking instead.",
      );
      return;
    }

    // 3. If it's already blocked, unblock it
    if (booking?.status === "blocked") {
      if (window.confirm("Do you want to open this room for this date?")) {
        unblockRoom(booking.id);
      }
      return;
    }

    // 4. Otherwise, block it
    if (
      window.confirm(
        `Do you want to block ${item.name} for ${format(day, "MMM dd, yyyy")}?`,
      )
    ) {
      blockRoom({
        startDate: format(day, "yyyy-MM-dd"),
        endDate: format(addDays(day, 1), "yyyy-MM-dd"), // 1-day block
        accommodationId: item.id,
        type: type,
      });
    }
  }

  return (
    <StyledCalendarBox>
      {hasExternalSync || isExternalLoading ? (
        <SyncStatus
          style={
            externalError
              ? {
                  color: "var(--color-red-700)",
                  background: "var(--color-red-50)",
                }
              : {}
          }
        >
          <HiOutlineRefresh className={isExternalLoading ? "spin" : ""} />
          {isExternalLoading
            ? "Syncing Goibibo..."
            : externalError
              ? "Sync failed"
              : "Synced with Goibibo"}
        </SyncStatus>
      ) : null}

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
          const platform = booking?.platform;

          return (
            <Day
              key={day.toString()}
              $isToday={isToday(day)}
              $status={status}
              $isExternal={isExternal}
              $platform={platform}
              onClick={() => handleDayClick(day, booking)}
              style={{ cursor: isExternal ? "default" : "pointer" }}
            >
              <DayNumber>{format(day, "d")}</DayNumber>
              <DayPrice $status={status} $isExternal={isExternal}>
                {formatCurrencyNoDecimals(dailyRate)}
              </DayPrice>

              {booking && (
                <Tooltip>
                  {isExternal ? (
                    <>
                      <strong style={{ textTransform: "capitalize" }}>
                        {platform} Blocked
                      </strong>
                      <br />
                      External sync
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

      <StyledLegend>
        <LegendItem>
          <LegendColor $color="var(--color-brand-600)" />
          <span>Confirmed</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="var(--color-brand-200)" />
          <span>Unconfirmed</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="var(--color-grey-400)" />
          <span>Blocked (Admin)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $background="repeating-linear-gradient(45deg, #f36f21, #f36f21 4px, #f36f21dd 4px, #f36f21dd 6px)" />
          <span>Goibibo</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $background="repeating-linear-gradient(45deg, #FF5A5F, #FF5A5F 4px, #FF5A5Fdd 4px, #FF5A5Fdd 6px)" />
          <span>Airbnb</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $background="repeating-linear-gradient(45deg, #003580, #003580 4px, #003580dd 4px, #003580dd 6px)" />
          <span>Booking.com</span>
        </LegendItem>
        <LegendItem>
          <LegendColor
            $color="var(--color-brand-600)"
            style={{
              border: "2px solid var(--color-brand-600)",
              background: "transparent",
            }}
          />
          <span>Today</span>
        </LegendItem>
      </StyledLegend>
    </StyledCalendarBox>
  );
}

export default CalendarBox;
