import styled from "styled-components";
import { format, isToday, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";

import Row from "../../ui/Row";
import Tag from "../../ui/Tag";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Modal from "../../ui/Modal";
import Empty from "../../ui/Empty";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "./useDeleteBooking";
import { useAuthorization } from "../../features/authentication/useAuthorization";
import { useConfirmBooking } from "./useConfirmBooking";
import { useOrdersByBooking } from "../orders/useOrdersByBooking";
import ConfirmDelete from "../../ui/ConfirmDelete";
import ConfirmAction from "../../ui/ConfirmAction";
import ItemHeader from "../../ui/ItemHeader";
import { formatCurrency, formatDistanceFromNow } from "../../utils/helpers";
import { Flag } from "../../ui/Flag";
import {
  HiOutlineCalendar,
  HiOutlineCurrencyRupee,
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineClipboardDocumentList,
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiTrash,
  HiCheckCircle,
  HiOutlineDocumentText,
} from "react-icons/hi2";

/* ─── Page Layout ─── */
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.6rem;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 480px) {
    width: 100%;
    & button {
      flex: 1;
      white-space: nowrap;
    }
  }
`;

/* ─── Card ─── */
const Card = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const CardHeader = styled.div`
  background: linear-gradient(
    135deg,
    var(--color-brand-600) 0%,
    var(--color-brand-800, #1e3a5f) 100%
  );
  padding: 2rem 2.4rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 1.2rem;

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    opacity: 0.85;
    flex-shrink: 0;
  }

  & h2 {
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
`;

const CardBody = styled.div`
  padding: 2rem 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

/* ─── Info Grid ─── */
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1.6rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  & .label {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-grey-400);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  & .value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-grey-700);
  }
`;

/* ─── Guest info strip ─── */
const GuestStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;

  & .name {
    font-size: 1.7rem;
    font-weight: 700;
    color: var(--color-grey-700);
  }
  & .email {
    font-size: 1.3rem;
    color: var(--color-grey-500);
  }
  & .meta {
    font-size: 1.3rem;
    color: var(--color-grey-500);
    padding: 0.3rem 1rem;
    background: var(--color-grey-100);
    border-radius: 100px;
  }
`;

/* ─── Payment banner ─── */
const PayBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.4rem 2rem;
  border-radius: var(--border-radius-sm);
  background-color: ${(p) =>
    p.$isPaid ? "var(--color-green-100)" : "var(--color-yellow-100)"};
  color: ${(p) =>
    p.$isPaid ? "var(--color-green-700)" : "var(--color-yellow-700)"};

  & .amount {
    font-size: 2.2rem;
    font-weight: 800;
    font-family: "Sono";
  }
  & .status {
    font-size: 1.3rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

/* ─── Orders ─── */
const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const OrderItem = styled.div`
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
`;

const OrderItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.6rem;
  background: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  flex-wrap: wrap;
  gap: 0.8rem;

  & .order-id {
    font-family: "Sono";
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--color-grey-500);
  }
  & .order-time {
    font-size: 1.2rem;
    color: var(--color-grey-400);
  }
  & .order-total {
    font-size: 1.5rem;
    font-weight: 700;
    font-family: "Sono";
    color: var(--color-brand-600);
    margin-left: auto;
  }
`;

const OrderItems = styled.div`
  padding: 0.8rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const OrderLineItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;

  & .item-name {
    color: var(--color-grey-600);
  }
  & .item-qty {
    font-weight: 600;
    color: var(--color-grey-500);
    margin-right: 0.8rem;
  }
  & .item-price {
    font-weight: 600;
    font-family: "Sono";
    color: var(--color-grey-700);
  }
`;

const EmptyMsg = styled.p`
  text-align: center;
  color: var(--color-grey-400);
  font-size: 1.4rem;
  padding: 2rem 0;
`;

const statusToTagName = {
  unconfirmed: "blue",
  confirmed: "blue",
  "checked-in": "green",
  "checked-out": "silver",
};

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { isDeleting, deleteBooking } = useDeleteBooking();
  const { confirmBooking, isConfirming } = useConfirmBooking();
  const { isGuest } = useAuthorization();
  const moveBack = useMoveBack();

  const bookingId = booking?.id;
  const { orders, isLoading: ordersLoading } = useOrdersByBooking(bookingId);

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resourceName="Booking" />;

  const {
    status,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    accommodationPrice,
    extrasPrice,
    hasBreakfast,
    isPaid,
    observations,
    created_at,
    guests: { fullName: guestName, email, country, countryFlag, nationalId },
    accommodation: { name: accommodationName },
    booking_cabins,
    booking_rooms,
  } = booking;

  const ordersTotal = (orders || []).reduce(
    (sum, o) => sum + (o.totalPrice || 0),
    0,
  );

  return (
    <Page>
      {/* ── Header ── */}
      <HeaderRow>
        <TitleGroup>
          <ItemHeader title={`Booking #${bookingId}`} as="h1" />
          <Tag type={statusToTagName[status] || "silver"}>
            {status.replace("-", " ")}
          </Tag>
        </TitleGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </HeaderRow>

      {/* ── Stay Details ── */}
      <Card>
        <CardHeader>
          <HiOutlineHome />
          <h2>
            {numNights} Night Stay &mdash; {accommodationName}
          </h2>
        </CardHeader>
        <CardBody>
          {/* Guest Info */}
          <GuestStrip>
            {countryFlag && <Flag src={countryFlag} alt={country} />}
            <div>
              <div className="name">{guestName}</div>
              <div className="email">{email}</div>
            </div>
            {numGuests > 1 && (
              <span className="meta">+{numGuests - 1} guest(s)</span>
            )}
            {nationalId && <span className="meta">ID: {nationalId}</span>}
          </GuestStrip>

          {/* Key Dates */}
          <InfoGrid>
            <InfoItem>
              <span className="label">Check-In</span>
              <span className="value">
                {format(new Date(startDate), "MMM dd, yyyy")}
                {isToday(new Date(startDate)) && " (Today)"}
              </span>
            </InfoItem>
            <InfoItem>
              <span className="label">Check-Out</span>
              <span className="value">
                {format(new Date(endDate), "MMM dd, yyyy")}
              </span>
            </InfoItem>
            <InfoItem>
              <span className="label">Duration</span>
              <span className="value">
                {numNights} night{numNights > 1 ? "s" : ""}
              </span>
            </InfoItem>
            <InfoItem>
              <span className="label">Guests</span>
              <span className="value">{numGuests}</span>
            </InfoItem>
            <InfoItem>
              <span className="label">Breakfast</span>
              <span className="value">{hasBreakfast ? "✅ Yes" : "❌ No"}</span>
            </InfoItem>
            <InfoItem>
              <span className="label">Booked</span>
              <span className="value">
                {format(new Date(created_at), "MMM dd, yyyy")}
              </span>
            </InfoItem>
          </InfoGrid>

          {/* Observations */}
          {observations && (
            <div
              style={{
                background: "var(--color-grey-50)",
                borderRadius: "var(--border-radius-sm)",
                padding: "1.2rem 1.6rem",
                fontSize: "1.4rem",
                color: "var(--color-grey-600)",
                borderLeft: "3px solid var(--color-brand-400)",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: "var(--color-grey-500)",
                  fontSize: "1.1rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                Notes
              </span>
              {observations}
            </div>
          )}

          {/* Payment Banner */}
          <PayBanner $isPaid={isPaid}>
            <div>
              <div className="amount">{formatCurrency(totalPrice)}</div>
              {hasBreakfast && (
                <div style={{ fontSize: "1.2rem", marginTop: "0.2rem" }}>
                  {formatCurrency(accommodationPrice)} stay +{" "}
                  {formatCurrency(extrasPrice)} breakfast
                </div>
              )}
            </div>
            <div className="status">
              {isPaid ? "✓ Paid" : "Will pay at property"}
            </div>
          </PayBanner>
        </CardBody>
      </Card>

      {/* ── Food Orders ── */}
      <Card>
        <CardHeader>
          <HiOutlineShoppingBag />
          <h2>
            Food Orders{" "}
            {orders.length > 0 && (
              <span
                style={{ opacity: 0.7, fontSize: "1.4rem", fontWeight: 400 }}
              >
                ({orders.length} order{orders.length > 1 ? "s" : ""} &mdash;{" "}
                {formatCurrency(ordersTotal)})
              </span>
            )}
          </h2>
        </CardHeader>
        <CardBody>
          {ordersLoading ? (
            <EmptyMsg>Loading orders…</EmptyMsg>
          ) : orders.length === 0 ? (
            <EmptyMsg>No food orders for this booking.</EmptyMsg>
          ) : (
            <OrderList>
              {orders.map((order) => (
                <OrderItem key={order.id}>
                  <OrderItemHeader>
                    <span className="order-id">Order #{order.id}</span>
                    <span className="order-time">
                      {format(
                        new Date(order.created_at || order.orderTime),
                        "MMM dd, HH:mm",
                      )}
                    </span>
                    <span className="order-total">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </OrderItemHeader>
                  <OrderItems>
                    {(order.order_items || []).map((oi) => (
                      <OrderLineItem key={oi.id}>
                        <span>
                          <span className="item-qty">{oi.quantity}×</span>
                          <span className="item-name">
                            {oi.menu_items?.name || "Item"}
                          </span>
                        </span>
                        <span className="item-price">
                          {formatCurrency(oi.unitPrice * oi.quantity)}
                        </span>
                      </OrderLineItem>
                    ))}
                  </OrderItems>
                </OrderItem>
              ))}
            </OrderList>
          )}
        </CardBody>
      </Card>

      {/* ── Actions ── */}
      <Actions>
        {!isGuest && status === "unconfirmed" && (
          <Modal>
            <Modal.Open opens="confirm-booking">
              <Button icon={<HiCheckCircle />}>Confirm</Button>
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
          <Button
            icon={<HiArrowDownOnSquare />}
            onClick={() => navigate(`/checkin/${bookingId}`)}
          >
            Check In
          </Button>
        )}

        {!isGuest && status === "checked-in" && (
          <Modal>
            <Modal.Open opens="checkout-booking">
              <Button icon={<HiArrowUpOnSquare />} disabled={isCheckingOut}>
                Check Out
              </Button>
            </Modal.Open>
            <Modal.Window name="checkout-booking">
              <ConfirmAction
                resourceName={`Booking #${bookingId}`}
                actionName="checkout"
                actionDescription={`Are you sure you want to check out ${guestName}? This action cannot be undone.`}
                onConfirm={() => checkout(bookingId)}
                disabled={isCheckingOut}
              />
            </Modal.Window>
          </Modal>
        )}

        <Button
          variation="secondary"
          icon={<HiOutlineDocumentText />}
          onClick={() => navigate(`/receipts/${bookingId}`)}
        >
          Receipt
        </Button>

        {!isGuest && (
          <Modal>
            <Modal.Open opens="delete-booking">
              <Button
                variation="danger"
                icon={<HiTrash />}
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

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </Actions>
    </Page>
  );
}

export default BookingDetail;
