import BookingTable from "../features/bookings/BookingTable";
import Row from "../ui/Row";
import ItemHeader from "../ui/ItemHeader";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import AddBooking from "../features/bookings/AddBooking";
import styled from "styled-components";

const HeaderActions = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 0.8rem;
  }
`;

function Bookings() {
  return (
    <>
      <Row type="horizontal" $stackOnMobile>
        <ItemHeader title="All Bookings" as="h1" />
        <HeaderActions>
          <BookingTableOperations />
        </HeaderActions>
      </Row>
      <BookingTable />
      <AddBooking />
    </>
  );
}

export default Bookings;
