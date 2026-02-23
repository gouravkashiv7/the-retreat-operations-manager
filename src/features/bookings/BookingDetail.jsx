import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Modal from "../../ui/Modal";
import Empty from "../../ui/Empty";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "./useDeleteBooking";
import ConfirmDelete from "../../ui/ConfirmDelete";
import ItemHeader from "../../ui/ItemHeader";
import { useAuthorization } from "../../features/authentication/useAuthorization";
import { useConfirmBooking } from "./useConfirmBooking";
import ConfirmAction from "../../ui/ConfirmAction";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { isDeleting, deleteBooking } = useDeleteBooking();
  const { confirmBooking, isConfirming } = useConfirmBooking();
  const { isGuest } = useAuthorization();

  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resourceName="Booking" />;

  const { status, id: bookingId } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <ItemHeader title={`Booking #${bookingId}`} as="h1" />
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {!isGuest && status === "unconfirmed" && (
          <Modal>
            <Modal.Open opens="confirm-booking">
              <Button>Confirm</Button>
            </Modal.Open>
            <Modal.Window name="confirm-booking">
              <ConfirmAction
                resourceName={`Booking #${bookingId}`}
                actionName="confirm"
                actionDescription="This will lock the room on the calendar. Have you received the advanced payment for this booking?"
                onConfirm={() => confirmBooking(bookingId)}
                disabled={isConfirming}
              />
            </Modal.Window>
          </Modal>
        )}
        {!isGuest && (status === "unconfirmed" || status === "confirmed") && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
            Check-In
          </Button>
        )}
        {!isGuest && status === "checked-in" && (
          <Button onClick={() => checkout(bookingId)} disabled={isCheckingOut}>
            Check-Out
          </Button>
        )}
        {!isGuest && (
          <Modal>
            <Modal.Open opens="delete-booking">
              <Button
                $variation="danger"
                disabled={isCheckingOut || isConfirming}
              >
                Delete
              </Button>
            </Modal.Open>
            <Modal.Window name="delete-booking">
              <ConfirmDelete
                resourceName={`Booking #${bookingId}`}
                onConfirm={() =>
                  deleteBooking(bookingId, {
                    onSettled: () => navigate(-1),
                  })
                }
                disabled={isDeleting}
              />
            </Modal.Window>
          </Modal>
        )}
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
