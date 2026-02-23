import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import Empty from "../../ui/Empty";
import Pagination from "../../ui/Pagination";
import Tag from "../../ui/Tag";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useBookings } from "./useBookings";
import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "./useDeleteBooking";
import styled from "styled-components";
import { format, isToday } from "date-fns";
import { formatCurrency } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import {
  HiEye,
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiTrash,
  HiDocumentText,
} from "react-icons/hi2";

/* ── Layout shells ── */
const DesktopTable = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;

const MobileCardList = styled.div`
  display: none;
  flex-direction: column;
  gap: 1.6rem;

  @media (max-width: 640px) {
    display: flex;
  }
`;

/* ── Mobile card styled components ── */
const BookingCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  box-shadow: var(--shadow-sm);
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.2rem;
`;

const AccomName = styled.div`
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-grey-700);
  font-family: "Sono";
`;

const GuestInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & .name {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-700);
  }

  & .email {
    font-size: 1.2rem;
    color: var(--color-grey-500);
  }
`;

const CardMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem 1.6rem;
  font-size: 1.3rem;
  color: var(--color-grey-600);

  & span {
    opacity: 0.65;
    font-size: 1.1rem;
    display: block;
    margin-bottom: 0.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  & strong {
    font-weight: 600;
    color: var(--color-grey-700);
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-grey-100);
  padding-top: 1.2rem;
  gap: 0.8rem;
`;

const AmountBadge = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  font-family: "Sono";
  color: var(--color-brand-600);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  background: var(--color-grey-0);
  color: var(--color-grey-600);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-grey-50);
    color: var(--color-brand-600);
    border-color: var(--color-brand-300);
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const statusToTagName = {
  unconfirmed: "blue",
  confirmed: "blue",
  "checked-in": "green",
  "checked-out": "silver",
};

function BookingMobileCard({ booking }) {
  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { isDeleting, deleteBooking } = useDeleteBooking();

  const {
    id: bookingId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    status,
    guests: { fullName, email },
    accommodation: { name: accommodationName },
  } = booking;

  return (
    <Modal>
      <BookingCard>
        <CardTop>
          <div>
            <AccomName>{accommodationName}</AccomName>
            <GuestInfo>
              <span className="name">{fullName}</span>
              <span className="email">{email}</span>
            </GuestInfo>
          </div>
          <Tag type={statusToTagName[status] || "silver"}>
            {status.replace("-", " ")}
          </Tag>
        </CardTop>

        <CardMeta>
          <div>
            <span>Check-In</span>
            <strong>{format(new Date(startDate), "MMM dd, yyyy")}</strong>
          </div>
          <div>
            <span>Check-Out</span>
            <strong>{format(new Date(endDate), "MMM dd, yyyy")}</strong>
          </div>
          <div>
            <span>Duration</span>
            <strong>
              {numNights} night{numNights > 1 ? "s" : ""}
            </strong>
          </div>
        </CardMeta>

        <CardFooter>
          <AmountBadge>{formatCurrency(totalPrice)}</AmountBadge>
          <ActionButtons>
            <IconBtn
              title="See Details"
              onClick={() => navigate(`/bookings/${bookingId}`)}
            >
              <HiEye />
            </IconBtn>
            {status === "unconfirmed" && (
              <IconBtn
                title="Check In"
                onClick={() => navigate(`/checkin/${bookingId}`)}
              >
                <HiArrowDownOnSquare />
              </IconBtn>
            )}
            {status === "checked-in" && (
              <IconBtn
                title="Check Out"
                onClick={() => checkout(bookingId)}
                disabled={isCheckingOut}
              >
                <HiArrowUpOnSquare />
              </IconBtn>
            )}
            <IconBtn
              title="View Receipt"
              onClick={() => navigate(`/receipts/${bookingId}`)}
            >
              <HiDocumentText />
            </IconBtn>
            <Modal.Open opens={`delete-${bookingId}`}>
              <IconBtn title="Delete" disabled={isDeleting}>
                <HiTrash />
              </IconBtn>
            </Modal.Open>
          </ActionButtons>
        </CardFooter>
      </BookingCard>

      <Modal.Window name={`delete-${bookingId}`}>
        <ConfirmDelete
          resourceName={`Booking #${bookingId}`}
          onConfirm={() => deleteBooking(bookingId)}
          disabled={isDeleting}
        />
      </Modal.Window>
    </Modal>
  );
}

function BookingTable() {
  const { bookings, count } = useBookings();

  if (!bookings || bookings.length === 0)
    return <Empty resourceName="Bookings" />;

  return (
    <Menus>
      {/* Desktop table */}
      <DesktopTable>
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
      </DesktopTable>

      {/* Mobile cards */}
      <MobileCardList>
        {bookings.map((booking) => (
          <BookingMobileCard key={booking.id} booking={booking} />
        ))}
        <Pagination count={count} />
      </MobileCardList>
    </Menus>
  );
}

export default BookingTable;
