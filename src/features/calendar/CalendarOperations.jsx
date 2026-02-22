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
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-size: 1.4rem;
  color: var(--color-grey-700);
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
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
            {accommodations
              .filter((acc) => acc.type === "cabin")
              .map((acc) => (
                <option key={acc.id} value={`${acc.type}-${acc.id}`}>
                  {acc.name} - {acc.description}
                </option>
              ))}
          </optgroup>
          <optgroup label="Rooms">
            {accommodations
              .filter((acc) => acc.type === "room")
              .map((acc) => (
                <option key={acc.id} value={`${acc.type}-${acc.id}`}>
                  {acc.name} - {acc.description}
                </option>
              ))}
          </optgroup>
        </StyledSelect>
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
      </SelectContainer>
    </StyledCalendarOperations>
  );
}

export default CalendarOperations;
