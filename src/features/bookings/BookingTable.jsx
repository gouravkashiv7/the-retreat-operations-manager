import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Pagination from "../../ui/Pagination";
import { useBookings } from "./useBookings";
import styled from "styled-components";

const MobileTableContainer = styled.div`
  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -1rem;
    padding: 0 1rem;

    /* Hide scrollbar */
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 480px) {
    margin: 0 -0.5rem;
    padding: 0 0.5rem;
  }
`;

const MobileHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    font-size: 1.4rem;
    color: var(--color-grey-600);
    margin-bottom: 1rem;
    text-align: center;
  }
`;

function BookingTable() {
  const { bookings, count } = useBookings();

  if (!bookings || bookings.length === 0)
    return <Empty resourceName="Bookings" />;
  return (
    <Menus>
      <MobileHeader>Scroll horizontally to view all columns</MobileHeader>
      <MobileTableContainer>
        <Table columns="1fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
          <Table.Header>
            <div>Accomodation</div>
            <div>Guest</div>
            <div>Dates</div>
            <div>Status</div>
            <div>Amount</div>
            <div></div>
          </Table.Header>

          <Table.Body
            data={bookings}
            render={(booking) => (
              <BookingRow key={booking.id} booking={booking} />
            )}
          />

          <Table.Footer>
            <Pagination count={count} />
          </Table.Footer>
        </Table>
      </MobileTableContainer>
    </Menus>
  );
}

export default BookingTable;
