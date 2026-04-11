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
  subDays,
  addDays,
} from "date-fns";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useCreateBlock, useUnblock } from "./useCalendarBookings";
import { formatCurrencyNoDecimals } from "../../utils/helpers";
import Spinner from "../../ui/Spinner";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

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

  @media (max-width: 768px) {
    padding: 2.4rem;
  }

  @media (max-width: 600px) {
    padding: 1.2rem;
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

  @media (max-width: 600px) {
    top: 0.4rem;
    right: 0.4rem;
    font-size: 0.8rem;
    padding: 0.2rem 0.4rem;
  }
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  margin-left: 0.8rem;
  color: inherit;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const BoxHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  padding-bottom: 1.6rem;
  padding-right: 10rem; /* Space for SyncStatus */

  @media (max-width: 600px) {
    padding-right: 0;
    padding-top: 2rem; /* Make room for absolute sync status */
  }
`;

const AccommodationName = styled.h3`
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-grey-800);

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const CalendarMonth = styled.span`
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--color-grey-400);
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 1.4rem;
  }
`;

const AccommodationDescription = styled.p`
  font-size: 1.6rem;
  color: var(--color-grey-500);
  font-style: italic;

  @media (max-width: 600px) {
    font-size: 1.4rem;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.8rem;

  @media (max-width: 600px) {
    gap: 0.4rem;
  }
`;

const DayName = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-grey-500);
  text-align: center;
  padding-bottom: 0.8rem;

  @media (max-width: 600px) {
    font-size: 1rem;
    padding-bottom: 0.4rem;
  }
`;

const StyledLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem;
  margin-top: 2.4rem;
  padding-top: 1.6rem;
  border-top: 1px solid var(--color-grey-100);

  @media (max-width: 600px) {
    gap: 1.2rem;
    margin-top: 1.6rem;
    padding-top: 1.2rem;
    justify-content: center;
  }
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
  min-width: 0; /* Prevents flex/grid blowout */

  @media (max-width: 600px) {
    padding: 0.2rem;
  }

  background: ${(props) => {
    if (props.$isExternal) {
      const color =
        props.$platform === "goibibo" ? "#f36f21" : "var(--color-grey-500)";

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
    if (props.$status === "checked-in") return "var(--color-green-500)";
    if (props.$status === "checked-out") return "var(--color-grey-300)";
    if (props.$status === "blocked") return "var(--color-grey-400)";
    if (props.$isToday) return "var(--color-grey-100)";
    return "transparent";
  }};

  color: ${(props) => {
    if (props.$isExternal) return "#fff";
    if (props.$status === "confirmed" || props.$status === "blocked")
      return "var(--color-brand-50)";
    if (props.$status === "checked-in") return "var(--color-brand-50)";
    if (props.$status === "checked-out") return "var(--color-grey-700)";
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

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

const DayPrice = styled.span`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.4rem;

  @media (max-width: 600px) {
    font-size: 0.8rem;
    margin-top: 0.2rem;
  }

  ${(props) => props.$isExternal && "display: none;"}
  ${(props) =>
    (props.$status === "confirmed" || props.$status === "checked-in") &&
    "color: var(--color-brand-100);"}
  ${(props) =>
    (props.$status === "unconfirmed" || props.$status === "checked-out") &&
    "color: var(--color-brand-700);"}
    /* For checked-out we might want a different grey but brand-700 is usually dark enough */
  ${(props) =>
    props.$status === "checked-out" && "color: var(--color-grey-600);"}
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

  @media (max-width: 600px) {
    width: 120px;
    padding: 6px;
    font-size: 1rem;
    bottom: 110%; /* Closer to the element to avoid getting cut off by top edge */

    /* Ensure tooltips at the extreme edges don't overflow the screen */
    ${Day}:nth-child(7n+1) & {
      left: 0;
      transform: translateX(0);
      &::after {
        left: 20%;
      }
    }

    ${Day}:nth-child(7n) & {
      left: auto;
      right: 0;
      transform: translateX(0);
      &::after {
        left: 80%;
      }
    }
  }
`;

const BookingsListContainer = styled.div`
  margin-top: 3.2rem;
  padding-top: 2.4rem;
  border-top: 1px solid var(--color-grey-100);
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const BookingsListTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-700);
  margin-bottom: 0.8rem;
`;

const BookingsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const BookingListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.6rem;
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
    padding: 1.2rem;
  }
`;

const BookingListDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const BookingDateRange = styled.span`
  font-weight: 600;
  color: var(--color-grey-800);
`;

const BookingGuestName = styled.span`
  color: var(--color-grey-500);
  font-size: 1.2rem;
`;

const BookingLink = styled(Link)`
  color: var(--color-brand-600);
  font-size: 1.2rem;
  font-weight: 500;
  text-decoration: underline;
  margin-left: 0.8rem;

  &:hover {
    color: var(--color-brand-700);
  }
`;

const StatusBadge = styled.span`
  width: fit-content;
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.4rem 1.2rem;
  border-radius: 100px;

  /* Dynamically style based on status */
  ${(props) => {
    if (props.$isExternal) {
      if (props.$platform === "goibibo") {
        return `
          color: #fff;
          background-color: #f36f21;
        `;
      }
      return `
        color: #fff;
        background-color: var(--color-grey-600);
      `;
    }

    if (props.$status === "confirmed") {
      return `
        color: var(--color-brand-700);
        background-color: var(--color-brand-100);
      `;
    }
    if (props.$status === "unconfirmed") {
      return `
        color: var(--color-blue-700);
        background-color: var(--color-blue-100);
      `;
    }
    if (props.$status === "checked-in") {
      return `
        color: var(--color-green-700);
        background-color: var(--color-green-100);
      `;
    }
    if (props.$status === "checked-out") {
      return `
        color: var(--color-grey-700);
        background-color: var(--color-grey-200);
      `;
    }
    if (props.$status === "blocked") {
      return `
        color: var(--color-grey-700);
        background-color: var(--color-grey-200);
      `;
    }
  }}
`;

function CalendarBox({
  item,
  type,
  month,
  bookings = [],
  externalBookings = [],
  isExternalLoading = false,
  externalError = null,
  refetch,
}) {
  const { blockRoom, isBlocking } = useCreateBlock();
  const { unblockRoom, isUnblocking } = useUnblock();

  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });

  const hasExternalSync = !!item.icalUrl || !!externalError;

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

  function handleDayClick(day, booking, displayStatus) {
    if (isBlocking || isUnblocking) return;

    // 1. If it's an external booking, do nothing
    if (booking?.isExternal) return;

    // 2. If it's already blocked, unblock it
    if (displayStatus === "blocked") {
      if (window.confirm("Do you want to open this room for this date?")) {
        unblockRoom(booking.id);
      }
      return;
    }

    // 3. If it's a confirmed/unconfirmed booking, don't allow blocking (must delete booking first)
    if (booking && displayStatus !== "blocked") {
      toast.error(
        "Day has an active booking. Please manage the booking instead.",
      );
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <HiOutlineRefresh className={isExternalLoading ? "spin" : ""} />
            {isExternalLoading
              ? "Syncing Goibibo..."
              : externalError
                ? "Sync failed"
                : "Synced with Goibibo"}
          </div>
          {refetch && (
            <RefreshButton
              onClick={() => refetch()}
              disabled={isExternalLoading}
              title="Refresh sync data"
            >
              <HiOutlineRefresh className={isExternalLoading ? "spin" : ""} />
            </RefreshButton>
          )}
        </SyncStatus>
      ) : null}

      <BoxHeader>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <AccommodationName>{item.name}</AccommodationName>
          <CalendarMonth>{format(month, "MMMM yyyy")}</CalendarMonth>
        </div>
        {item.description && (
          <AccommodationDescription>
            {item.description}
          </AccommodationDescription>
        )}
      </BoxHeader>

      {isExternalLoading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "4rem" }}
        >
          <Spinner />
        </div>
      ) : (
        <CalendarGrid>
          {dayNames.map((name) => (
            <DayName key={name}>{name.charAt(0)}</DayName>
          ))}

          {paddingDays.map((i) => (
            <Day key={`pad-${i}`} $isDimmed />
          ))}

          {days.map((day) => {
            const booking = getBookingForDay(day);
            const isExternal = booking?.isExternal;
            const platform = booking?.platform;

            // Re-derive status logic to support ADMIN_BLOCK flag
            let displayStatus = booking?.status;
            if (booking?.observations === "ADMIN_BLOCK") {
              displayStatus = "blocked";
            }

            return (
              <Day
                key={day.toString()}
                $isToday={isToday(day)}
                $status={displayStatus}
                $isExternal={isExternal}
                $platform={platform}
                onClick={() => handleDayClick(day, booking, displayStatus)}
                style={{ cursor: isExternal ? "default" : "pointer" }}
              >
                <DayNumber>{format(day, "d")}</DayNumber>
                <DayPrice $status={displayStatus} $isExternal={isExternal}>
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
                        <strong>
                          {displayStatus === "blocked"
                            ? "Admin Block"
                            : booking.guests?.fullName || "Guest"}
                        </strong>
                        <br />
                        Status: {displayStatus}
                      </>
                    )}
                  </Tooltip>
                )}
              </Day>
            );
          })}
        </CalendarGrid>
      )}

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
          <LegendColor $color="var(--color-green-500)" />
          <span>Checked-in</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="var(--color-grey-300)" />
          <span>Checked-out</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="var(--color-grey-400)" />
          <span>Blocked (Admin)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $background="repeating-linear-gradient(45deg, #f36f21, #f36f21 4px, #f36f21dd 4px, #f36f21dd 6px)" />
          <span>MMT / Goibibo</span>
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

      {/* Booked and Blocked Dates List */}
      <BookingsListContainer>
        <BookingsListTitle>Bookings & Blocks this Month</BookingsListTitle>
        <BookingsList>
          {(() => {
            // Combine all local and external bookings relevant to the month
            const allMonthBookings = [
              ...itemBookings,
              ...externalBookings,
            ].filter((b) => {
              const checkIn = parseISO(b.startDate);
              const checkOut = parseISO(b.endDate);
              // Include if it starts or ends within this month, or spans entirely across it
              return (
                ((isSameDay(checkIn, start) || isAfter(checkIn, start)) &&
                  isBefore(checkIn, end)) ||
                ((isSameDay(checkOut, start) || isAfter(checkOut, start)) &&
                  isBefore(checkOut, end)) ||
                (isBefore(checkIn, start) && isAfter(checkOut, end))
              );
            });

            // Sort by start date chronologically
            const sortedBookings = allMonthBookings.sort(
              (a, b) =>
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime(),
            );

            if (sortedBookings.length === 0) {
              return (
                <p
                  style={{ color: "var(--color-grey-500)", fontSize: "1.4rem" }}
                >
                  No dates blocked or booked for this month.
                </p>
              );
            }

            return sortedBookings.map((booking, index) => {
              const startDateFormatted = format(
                parseISO(booking.startDate),
                "MMM dd, yyyy",
              );
              const endDateFormatted = format(
                parseISO(booking.endDate),
                "MMM dd, yyyy",
              );

              const isExternal = booking.isExternal;

              let displayStatus = booking.status;
              if (booking.observations === "ADMIN_BLOCK") {
                displayStatus = "blocked";
              }

              const statusString = isExternal
                ? booking.platform || "External Sync"
                : displayStatus;

              return (
                <BookingListItem key={booking.id || `ext-${index}`}>
                  <BookingListDetails>
                    <BookingDateRange>
                      {startDateFormatted} — {endDateFormatted}
                    </BookingDateRange>
                    {booking.guests?.fullName && (
                      <div>
                        <BookingGuestName>
                          Guest: {booking.guests.fullName}
                        </BookingGuestName>
                        {booking.status !== "blocked" && !isExternal && (
                          <BookingLink to={`/bookings/${booking.id}`}>
                            (Booking #{booking.id})
                          </BookingLink>
                        )}
                      </div>
                    )}
                  </BookingListDetails>
                  <StatusBadge
                    $status={displayStatus}
                    $isExternal={isExternal}
                    $platform={booking.platform}
                  >
                    {statusString}
                  </StatusBadge>
                </BookingListItem>
              );
            });
          })()}
        </BookingsList>
      </BookingsListContainer>
    </StyledCalendarBox>
  );
}

export default CalendarBox;
