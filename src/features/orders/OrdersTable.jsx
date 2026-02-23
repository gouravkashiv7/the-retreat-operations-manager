import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import Table from "../../ui/Table";
import Spinner from "../../ui/Spinner";
import OrdersRow from "./OrdersRow";
import { useOrders } from "./useOrders";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";

const StyledOrdersTable = styled(Table)`
  & header,
  & [role="row"] {
    grid-template-columns: 1.5fr 2fr 1fr 1fr 1fr 1.5fr;

    @media (max-width: 768px) {
      grid-template-columns: 1.5fr 1.2fr 1fr 1fr 1.5fr;
    }

    @media (max-width: 600px) {
      grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
    }
  }
`;

function OrdersTable() {
  const { orders, isLoading } = useOrders();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (!orders || orders.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>No orders found.</p>
    );
  }

  // 1) FILTER
  const filterValue = searchParams.get("status") || "active";

  let filteredOrders;
  if (filterValue === "active")
    filteredOrders = orders.filter(
      (order) => order.status !== "completed" && order.status !== "cancelled",
    );
  if (filterValue === "past")
    filteredOrders = orders.filter((order) => order.status === "completed");
  if (filterValue === "cancelled")
    filteredOrders = orders.filter((order) => order.status === "cancelled");
  if (filterValue === "all") filteredOrders = orders;

  // 2) SORT
  // Active orders goes first (not completed)
  const sortedOrders = filteredOrders.sort((a, b) => {
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
            { value: "active", label: "Active Orders" },
            { value: "past", label: "Past Orders" },
            { value: "cancelled", label: "Cancelled" },
            { value: "all", label: "All Orders" },
          ]}
        />
      </TableOperations>

      <StyledOrdersTable columns="1.5fr 2fr 1fr 1fr 1fr 1.5fr">
        <Table.Header>
          <div>Guest</div>
          <div className="hide-on-mobile">Items</div>
          <div className="hide-on-mobile">Time</div>
          <div>Status</div>
          <div>Amount</div>
          <div>Action</div>
        </Table.Header>

        <Table.Body
          data={sortedOrders}
          render={(order) => <OrdersRow key={order.id} order={order} />}
        />
      </StyledOrdersTable>
    </>
  );
}

export default OrdersTable;
