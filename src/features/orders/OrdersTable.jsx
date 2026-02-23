import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Table from "../../ui/Table";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import Tag from "../../ui/Tag";
import Button from "../../ui/Button";
import Select from "../../ui/Select";
import OrdersRow from "./OrdersRow";
import { useOrders } from "./useOrders";
import { useUpdateOrderStatus } from "./useUpdateOrderStatus";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";
import { formatCurrency, getAccommodationName } from "../../utils/helpers";
import { format } from "date-fns";

/* ── Layout shells ── */
const DesktopTable = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;

const MobileList = styled.div`
  display: none;
  flex-direction: column;
  gap: 1.2rem;

  @media (max-width: 640px) {
    display: flex;
  }
`;

/* ── Mobile Order Card ── */
const OrderCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const CardTop = styled.div`
  padding: 1.4rem 1.6rem 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.2rem;
`;

const GuestBlock = styled.div`
  & .guest-name {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--color-grey-700);
  }
  & .room {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    margin-top: 0.2rem;
  }
  & .order-time {
    font-size: 1.2rem;
    color: var(--color-grey-400);
    margin-top: 0.2rem;
  }
`;

const ItemsList = styled.ul`
  padding: 0.8rem 1.6rem;
  border-top: 1px solid var(--color-grey-100);
  border-bottom: 1px solid var(--color-grey-100);
  background: var(--color-grey-50);
  list-style: none;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.2rem;
`;

const OrderItem = styled.li`
  font-size: 1.3rem;
  color: var(--color-grey-600);

  & span {
    font-weight: 700;
    color: var(--color-brand-600);
    margin-right: 0.3rem;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.6rem;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

const PriceTag = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  font-family: "Sono";
  color: var(--color-brand-600);
`;

const statusToTagName = {
  ordered: "blue",
  accepted: "indigo",
  preparing: "yellow",
  delivered: "green",
  completed: "silver",
  cancelled: "red",
};

const statusOptions = [
  { value: "ordered", label: "Ordered" },
  { value: "accepted", label: "Accepted" },
  { value: "preparing", label: "Preparing" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const CONFIRM_STATUSES = ["completed", "cancelled"];

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
  min-width: 28rem;
  max-width: 92vw;
`;

const BannerActions = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-left: auto;
`;

function MobileOrderCard({ order }) {
  const { id, orderTime, status, totalPrice, guests, order_items, bookings } =
    order;
  const { updateOrderStatus, isUpdating } = useUpdateOrderStatus();
  const [pendingStatus, setPendingStatus] = useState(null);
  const isTerminal = status === "completed" || status === "cancelled";

  function handleChange(e) {
    const newStatus = e.target.value;
    if (newStatus === status) return;
    if (CONFIRM_STATUSES.includes(newStatus)) {
      setPendingStatus(newStatus);
    } else {
      updateOrderStatus({ id, status: newStatus });
    }
  }

  function handleConfirm() {
    updateOrderStatus(
      { id, status: pendingStatus },
      { onSettled: () => setPendingStatus(null) },
    );
  }

  return (
    <>
      <OrderCard>
        <CardTop>
          <GuestBlock>
            <div className="guest-name">{guests?.fullName || "—"}</div>
            <div className="room">{getAccommodationName(bookings)}</div>
            {orderTime && (
              <div className="order-time">
                {format(new Date(orderTime), "MMM dd, HH:mm")}
              </div>
            )}
          </GuestBlock>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </CardTop>

        {order_items?.length > 0 && (
          <ItemsList>
            {order_items.map((item) => (
              <OrderItem key={item.id}>
                <span>{item.quantity}×</span>
                {item.menu_items?.name}
              </OrderItem>
            ))}
          </ItemsList>
        )}

        <CardFooter>
          <PriceTag>{formatCurrency(totalPrice)}</PriceTag>
          <Select
            options={statusOptions}
            value={status}
            onChange={handleChange}
            disabled={isUpdating || isTerminal}
            type="white"
          />
        </CardFooter>
      </OrderCard>

      {pendingStatus && (
        <ConfirmBanner>
          <span>
            {pendingStatus === "cancelled"
              ? `Cancel Order #${id}?`
              : `Complete Order #${id}?`}
          </span>
          <BannerActions>
            <Button
              $size="small"
              $variation="secondary"
              onClick={() => setPendingStatus(null)}
              disabled={isUpdating}
            >
              No
            </Button>
            <Button
              $size="small"
              $variation={pendingStatus === "cancelled" ? "danger" : "primary"}
              onClick={handleConfirm}
              disabled={isUpdating}
            >
              {isUpdating
                ? "Saving…"
                : pendingStatus === "cancelled"
                  ? "Cancel Order"
                  : "Complete"}
            </Button>
          </BannerActions>
        </ConfirmBanner>
      )}
    </>
  );
}

function OrdersTable() {
  const { orders, isLoading } = useOrders();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!orders || orders.length === 0) return <Empty resourceName="orders" />;

  // 1) Filter
  const filterValue = searchParams.get("status") || "active";
  let filteredOrders;
  if (filterValue === "active")
    filteredOrders = orders.filter(
      (o) => o.status !== "completed" && o.status !== "cancelled",
    );
  else if (filterValue === "past")
    filteredOrders = orders.filter((o) => o.status === "completed");
  else if (filterValue === "cancelled")
    filteredOrders = orders.filter((o) => o.status === "cancelled");
  else filteredOrders = orders;

  // 2) Sort: active first, then by time desc
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    return new Date(b.orderTime) - new Date(a.orderTime);
  });

  return (
    <>
      <TableOperations style={{ marginBottom: "1.6rem" }}>
        <Filter
          filterField="status"
          options={[
            { value: "active", label: "Active" },
            { value: "past", label: "Past" },
            { value: "cancelled", label: "Cancelled" },
            { value: "all", label: "All" },
          ]}
        />
      </TableOperations>

      {/* Desktop table */}
      <DesktopTable>
        <Table columns="1.5fr 2fr 1fr 1fr 1fr 1.5fr">
          <Table.Header>
            <div>Guest</div>
            <div>Items</div>
            <div>Time</div>
            <div>Status</div>
            <div>Amount</div>
            <div>Action</div>
          </Table.Header>

          <Table.Body
            data={sortedOrders}
            render={(order) => <OrdersRow key={order.id} order={order} />}
          />
        </Table>
      </DesktopTable>

      {/* Mobile cards */}
      <MobileList>
        {sortedOrders.map((order) => (
          <MobileOrderCard key={order.id} order={order} />
        ))}
      </MobileList>
    </>
  );
}

export default OrdersTable;
