import DashboardFilter from "../features/dashboard/DashboardFilter";
import DashboardLayout from "../features/dashboard/DashboardLayout";
import ItemHeader from "../ui/ItemHeader";
import Row from "../ui/Row";

function Dashboard() {
  return (
    <>
      <Row type="horizontal" $stackOnMobile>
        <ItemHeader title="DashBoard" />
        <DashboardFilter />
      </Row>
      <DashboardLayout />
    </>
  );
}

export default Dashboard;
