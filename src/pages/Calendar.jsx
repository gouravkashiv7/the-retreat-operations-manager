import CalendarLayout from "../features/calendar/CalendarLayout";
import Row from "../ui/Row";

function Calendar() {
  return (
    <>
      <Row type="horizontal">
        {/* The title is already in CalendarOperations, so we could put something else here if needed */}
      </Row>

      <CalendarLayout />
    </>
  );
}

export default Calendar;
