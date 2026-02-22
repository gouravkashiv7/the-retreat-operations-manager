import { Link } from "react-router-dom";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Button from "../ui/Button";
import MenuTable from "../features/menu/MenuTable";
import AddMenuItem from "../features/menu/AddMenuItem";
import MenuTableOperations from "../features/menu/MenuTableOperations";

import { useAuthorization } from "../features/authentication/useAuthorization";

function Menu() {
  const { isGuest } = useAuthorization();

  return (
    <>
      <Row type="horizontal" $stackOnMobile $wrapOnTablet>
        <Heading as="h1">Menu Management</Heading>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Link to="/guest-menu" style={{ flexShrink: 0 }}>
            <Button variation="secondary" icon={<HiArrowTopRightOnSquare />}>
              View Guest Menu
            </Button>
          </Link>
          {!isGuest && (
            <div style={{ flexShrink: 0 }}>
              <AddMenuItem />
            </div>
          )}
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
