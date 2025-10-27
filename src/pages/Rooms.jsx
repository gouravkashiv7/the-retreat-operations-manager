import Row from "../ui/Row";
import ItemTable from "../features/common/ItemTable";
import ItemHeader from "../ui/ItemHeader";

import { getRooms } from "../services/apiRooms";
import AddItem from "../features/common/AddItem";
import ItemTableOperations from "../features/common/ItemTableOperations";

function Rooms() {
  return (
    <>
      <Row type="horizontal" $stackOnMobile>
        <ItemHeader title="All Rooms!!" as="h1" />
        <ItemTableOperations />
      </Row>
      <Row>
        <ItemTable queryKey="rooms" queryFn={getRooms} itemName="room" />
        {/* <AddItem itemName="room" /> */}
      </Row>
    </>
  );
}

export default Rooms;
