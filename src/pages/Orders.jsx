import AppLayout from "../ui/AppLayout";
import OrdersTable from "../features/orders/OrdersTable";
import CreateOrderForm from "../features/orders/CreateOrderForm";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Orders() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Orders</Heading>
      </Row>

      <Row>
        <CreateOrderForm />
        <OrdersTable />
      </Row>
    </>
  );
}

export default Orders;
