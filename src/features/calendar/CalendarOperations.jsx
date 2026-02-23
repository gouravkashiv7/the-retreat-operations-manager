import styled from "styled-components";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCog8Tooth,
} from "react-icons/hi2";
import { format } from "date-fns";
import ButtonIcon from "../../ui/ButtonIcon";
import Heading from "../../ui/Heading";

const StyledCalendarOperations = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  margin-bottom: 2.4rem;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-width: 50rem;
`;

const SelectLabel = styled.label`
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-grey-600);
`;

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 3.2rem 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
  width: 100%;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234b5563%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 1.2rem top 50%;
  background-size: 1.2rem auto;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }

  &:hover {
    border-color: var(--color-brand-300);
  }

  @media (max-width: 600px) {
    font-size: 1.2rem;
    padding: 0.6rem 2.8rem 0.6rem 0.8rem;
    background-size: 1rem auto;
  }
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const CurrentMonth = styled.span`
  font-size: 1.8rem;
  font-weight: 600;
  min-width: 15rem;
  text-align: center;
`;

const TodayButton = styled.button`
  padding: 0.4rem 1.2rem;
  background-color: var(--color-brand-600);
  color: var(--color-brand-50);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-brand-700);
  }
`;

import { useUser } from "../authentication/useUser";

function CalendarOperations({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  accommodations = [],
  selectedItemId,
  onItemChange,
  showSync,
  onToggleSync,
}) {
  const { user } = useUser();

  const sortedCabins = accommodations
    .filter((acc) => acc.type === "cabin")
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  const sortedRooms = accommodations
    .filter((acc) => acc.type === "room")
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  return (
    <StyledCalendarOperations>
      <TopRow>
        <Heading as="h2">Accommodation Calendar</Heading>

        <MonthNavigation>
          <ButtonIcon onClick={onPrevMonth}>
            <HiOutlineChevronLeft />
          </ButtonIcon>

          <CurrentMonth>{format(currentMonth, "MMMM yyyy")}</CurrentMonth>

          <ButtonIcon onClick={onNextMonth}>
            <HiOutlineChevronRight />
          </ButtonIcon>

          <TodayButton onClick={onToday}>Today</TodayButton>
        </MonthNavigation>
      </TopRow>

      <SelectContainer>
        <SelectLabel htmlFor="accommodation-select">
          Select Room or Cabin
        </SelectLabel>
        <StyledSelect
          id="accommodation-select"
          value={selectedItemId}
          onChange={(e) => onItemChange(e.target.value)}
        >
          <optgroup label="Cabins">
            {sortedCabins.map((acc) => (
              <option key={acc.id} value={`${acc.type}-${acc.id}`}>
                {acc.name} - {acc.description}
              </option>
            ))}
          </optgroup>
          <optgroup label="Rooms">
            {sortedRooms.map((acc) => (
              <option key={acc.id} value={`${acc.type}-${acc.id}`}>
                {acc.name} - {acc.description}
              </option>
            ))}
          </optgroup>
        </StyledSelect>
        {user?.email === "gouravkashiv@zohomail.in" && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onToggleSync}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "1.2rem",
                color: showSync
                  ? "var(--color-brand-700)"
                  : "var(--color-grey-500)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <HiOutlineCog8Tooth />
              {showSync ? "Hide Sync Settings" : "Sync Management"}
            </button>
          </div>
        )}
      </SelectContainer>
    </StyledCalendarOperations>
  );
}

export default CalendarOperations;
