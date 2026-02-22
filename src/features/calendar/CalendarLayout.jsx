import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  format,
  parse,
  isValid,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useSearchParams } from "react-router-dom";
import { useRooms } from "../rooms/useRooms";
import { useCabins } from "../cabins/useCabins";
import { useCalendarBookings } from "./useCalendarBookings";
import { useExternalAvailability } from "./useExternalAvailability";
import CalendarOperations from "./CalendarOperations";
import CalendarBox from "./CalendarBox";
import Spinner from "../../ui/Spinner";

const StyledCalendarLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const SingleCalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

function CalendarLayout() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get month from URL or default to today
  const monthParam = searchParams.get("date");
  const initialMonth = monthParam
    ? parse(monthParam, "yyyy-MM", new Date())
    : new Date();
  const [currentMonth, setCurrentMonth] = useState(
    isValid(initialMonth) ? initialMonth : new Date(),
  );

  const { isLoading: isLoadingRooms, rooms } = useRooms();
  const { isLoading: isLoadingCabins, cabins } = useCabins();

  const allAccommodations = [
    ...(cabins?.map((c) => ({ ...c, type: "cabin" })) || []),
    ...(rooms?.map((r) => ({ ...r, type: "room" })) || []),
  ];

  // Get selected ID from URL or default to first
  const selectedItemId = searchParams.get("id") || "";

  useEffect(() => {
    // Initial sync of params
    const updates = {};
    let shouldUpdate = false;

    if (allAccommodations.length > 0 && !selectedItemId) {
      const first = allAccommodations[0];
      updates.id = `${first.type}-${first.id}`;
      shouldUpdate = true;
    }

    if (!monthParam) {
      updates.date = format(currentMonth, "yyyy-MM");
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      Object.entries(updates).forEach(([key, value]) =>
        searchParams.set(key, value),
      );
      setSearchParams(searchParams, { replace: true });
    }
  }, [
    allAccommodations,
    selectedItemId,
    monthParam,
    currentMonth,
    searchParams,
    setSearchParams,
  ]);

  function handleItemChange(newId) {
    searchParams.set("id", newId);
    setSearchParams(searchParams);
  }

  function handleMonthChange(newDate) {
    setCurrentMonth(newDate);
    searchParams.set("date", format(newDate, "yyyy-MM"));
    setSearchParams(searchParams);
  }

  const startDate = startOfMonth(currentMonth).toISOString();
  const endDate = endOfMonth(currentMonth).toISOString();

  const { isLoading: isLoadingBookings, bookings } = useCalendarBookings(
    startDate,
    endDate,
  );

  const selectedItem = allAccommodations.find(
    (item) => `${item.type}-${item.id}` === selectedItemId,
  );

  // Check if target is room 104
  const isRoom104 =
    selectedItem?.type === "room" &&
    (selectedItem?.name?.includes("104") ||
      selectedItem?.name === "Deluxe Room Premium A");

  const {
    isLoading: isLoadingExternal,
    externalBookings,
    error: externalError,
  } = useExternalAvailability(isRoom104);

  function nextMonth() {
    handleMonthChange(addMonths(currentMonth, 1));
  }

  function prevMonth() {
    handleMonthChange(subMonths(currentMonth, 1));
  }

  function goToToday() {
    handleMonthChange(new Date());
  }

  if (isLoadingRooms || isLoadingCabins || isLoadingBookings)
    return <Spinner />;

  return (
    <StyledCalendarLayout>
      <CalendarOperations
        currentMonth={currentMonth}
        onNextMonth={nextMonth}
        onPrevMonth={prevMonth}
        onToday={goToToday}
        accommodations={allAccommodations}
        selectedItemId={selectedItemId}
        onItemChange={handleItemChange}
      />

      {selectedItem && (
        <SingleCalendarContainer>
          <CalendarBox
            item={selectedItem}
            type={selectedItem.type}
            month={currentMonth}
            bookings={bookings}
            externalBookings={isRoom104 ? externalBookings : []}
            isExternalLoading={isRoom104 && isLoadingExternal}
            externalError={isRoom104 ? externalError : null}
          />
        </SingleCalendarContainer>
      )}
    </StyledCalendarLayout>
  );
}

export default CalendarLayout;
