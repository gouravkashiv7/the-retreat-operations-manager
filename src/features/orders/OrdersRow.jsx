import { useRef } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import { formatCurrency, getAccommodationName } from "../../utils/helpers";
import Select from "../../ui/Select";
import { useUpdateOrderStatus } from "./useUpdateOrderStatus";
import Modal from "../../ui/Modal";
import ConfirmAction from "../../ui/ConfirmAction";

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

function OrderStatusSelect({ order }) {
  const { updateOrderStatus, isUpdating } = useUpdateOrderStatus();
  const confirmBtnRef = useRef();

  const statusOptions = [
    { value: "ordered", label: "Ordered" },
    { value: "accepted", label: "Accepted" },
    { value: "preparing", label: "Preparing" },
    { value: "delivered", label: "Delivered" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  function handleChange(e) {
    const newStatus = e.target.value;

    if (newStatus === "completed") {
      confirmBtnRef.current.click();
      return;
    }

    updateOrderStatus({ id: order.id, status: newStatus });
  }

  const isCompleted = order.status === "completed";

  return (
    <Modal>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Select
          options={statusOptions}
          value={order.status}
          onChange={handleChange}
          disabled={isUpdating || isCompleted}
          type="white"
        />

        <Modal.Open opens="confirm-complete">
          <button ref={confirmBtnRef} style={{ display: "none" }} />
        </Modal.Open>
      </div>

      <Modal.Window name="confirm-complete">
        <ConfirmAction
          resourceName="order"
          actionName="complete"
          onConfirm={() =>
            updateOrderStatus({ id: order.id, status: "completed" })
          }
          disabled={isUpdating}
        />
      </Modal.Window>
    </Modal>
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
