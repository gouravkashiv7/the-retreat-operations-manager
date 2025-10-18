import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ItemTable from "../features/common/ItemTable";

import { getRooms } from "../services/apiRooms";
import AddItem from "../features/common/AddItem";
import ItemTableOperations from "../features/common/ItemTableOperations";

function Rooms() {
  return (
    <>
      <Row type="horizontal" $stackOnMobile>
        <Heading as="h1">All Cabins!! </Heading>
        <ItemTableOperations />
      </Row>
      <Row>
        <ItemTable queryKey="rooms" queryFn={getRooms} itemName="room" />
        <AddItem itemName="room" />
      </Row>
    </>
  );
}

export default Rooms;
