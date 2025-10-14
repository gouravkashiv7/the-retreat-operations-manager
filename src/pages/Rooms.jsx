import { useState } from "react";

import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ItemTable from "../features/common/ItemTable";
import Button from "../ui/Button";
import CreateItemForm from "../features/common/CreateItemForm";

import { getRooms } from "../services/apiRooms";
function Rooms() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All Cabins!! </Heading>
        <p>Sort/Filter</p>
      </Row>
      <Row>
        <ItemTable queryKey="rooms" queryFn={getRooms} itemName="room" />
        <Button onClick={() => setShowForm((show) => !show)}>
          {!showForm ? "Add New Room" : "Close Form"}
        </Button>
        {showForm && (
          <CreateItemForm onClose={() => setShowForm(false)} itemName="room" />
        )}
      </Row>
    </>
  );
}

export default Rooms;
