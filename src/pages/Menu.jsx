import { Link } from "react-router-dom";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Button from "../ui/Button";
import MenuTable from "../features/menu/MenuTable";
import AddMenuItem from "../features/menu/AddMenuItem";
import MenuTableOperations from "../features/menu/MenuTableOperations";

function Menu() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Menu Management</Heading>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/guest-menu">
            <Button variation="secondary" icon={<HiArrowTopRightOnSquare />}>
              View Guest Menu
            </Button>
          </Link>
          <AddMenuItem />
        </div>
      </Row>

      <Row type="vertical">
        <MenuTableOperations />
        <MenuTable />
      </Row>
    </>
  );
}

export default Menu;
