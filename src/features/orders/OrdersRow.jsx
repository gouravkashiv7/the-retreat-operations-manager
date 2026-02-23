import { useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Button from "../../ui/Button";
import { formatCurrency, getAccommodationName } from "../../utils/helpers";
import Select from "../../ui/Select";
import { useUpdateOrderStatus } from "./useUpdateOrderStatus";

const GuestName = styled.div`
  font-weight: 500;
  color: var(--color-grey-700);
`;

const ItemsList = styled.ul`
  font-size: 1.2rem;
  color: var(--color-grey-500);
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.2rem;
  }
`;

const OrderTime = styled.div`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

/* ── Inline confirmation banner ── */
const ConfirmBanner = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 1.4rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.6rem;
  box-shadow: var(--shadow-lg);
  z-index: 9999;
  font-size: 1.4rem;
  font-weight: 500;
  min-width: 32rem;
  max-width: 90vw;
`;

const BannerText = styled.span`
  flex: 1;
`;

const BannerActions = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const statusOptions = [
  { value: "ordered", label: "Ordered" },
  { value: "accepted", label: "Accepted" },
  { value: "preparing", label: "Preparing" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const CONFIRM_STATUSES = ["completed", "cancelled"];

function OrderStatusSelect({ order }) {
  const { updateOrderStatus, isUpdating } = useUpdateOrderStatus();
  const [pendingStatus, setPendingStatus] = useState(null);

  const isTerminal =
    order.status === "completed" || order.status === "cancelled";

  function handleChange(e) {
    const newStatus = e.target.value;
    if (newStatus === order.status) return;

    if (CONFIRM_STATUSES.includes(newStatus)) {
      setPendingStatus(newStatus);
    } else {
      updateOrderStatus({ id: order.id, status: newStatus });
    }
  }

  function handleConfirm() {
    updateOrderStatus(
      { id: order.id, status: pendingStatus },
      { onSettled: () => setPendingStatus(null) },
    );
  }

  function handleDismiss() {
    setPendingStatus(null);
  }

  const confirmLabel =
    pendingStatus === "cancelled" ? "Cancel Order" : "Mark Completed";
  const confirmMsg =
    pendingStatus === "cancelled"
      ? `Cancel Order #${order.id}?`
      : `Complete Order #${order.id}?`;

  return (
    <>
      <Select
        options={statusOptions}
        value={order.status}
        onChange={handleChange}
        disabled={isUpdating || isTerminal}
        type="white"
      />

      {/* Inline confirmation bottom bar */}
      {pendingStatus && (
        <ConfirmBanner>
          <BannerText>{confirmMsg}</BannerText>
          <BannerActions>
            <Button
              $size="small"
              $variation="secondary"
              onClick={handleDismiss}
              disabled={isUpdating}
            >
              No, keep
            </Button>
            <Button
              $size="small"
              $variation={pendingStatus === "cancelled" ? "danger" : "primary"}
              onClick={handleConfirm}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving…" : confirmLabel}
            </Button>
          </BannerActions>
        </ConfirmBanner>
      )}
    </>
  );
}

function OrdersRow({ order }) {
  const { id, orderTime, status, totalPrice, guests, order_items, bookings } =
    order;

  const statusToTagName = {
    ordered: "blue",
    accepted: "indigo",
    preparing: "yellow",
    delivered: "green",
    completed: "silver",
    cancelled: "red",
  };

  return (
    <Table.Row>
      <GuestName>
        {guests?.fullName}
        <br />
        <span style={{ fontSize: "1.2rem", fontWeight: "400" }}>
          {getAccommodationName(bookings)}
        </span>
      </GuestName>

      <div className="hide-on-mobile">
        <ItemsList>
          {order_items?.map((item) => (
            <li key={item.id}>
              {item.quantity}x {item.menu_items?.name}
            </li>
          ))}
        </ItemsList>
      </div>

      <div className="hide-on-mobile">
        <OrderTime>
          {orderTime ? format(new Date(orderTime), "MMM dd, HH:mm") : "—"}
        </OrderTime>
      </div>

      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <div style={{ fontWeight: 500 }}>{formatCurrency(totalPrice)}</div>

      <OrderStatusSelect order={order} />
    </Table.Row>
  );
}

export default OrdersRow;
