import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ItemTable from "../features/common/ItemTable";
import AddItem from "../features/common/AddItem";
import ItemTableOperations from "../features/common/ItemTableOperations";

import { getCabins } from "../services/apiCabins";

function Cabins() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All Cabins!! </Heading>
        <ItemTableOperations />
      </Row>
      <Row>
        <ItemTable queryKey="cabins" queryFn={getCabins} itemName="cabin" />
        <AddItem itemName="cabin" />
      </Row>
    </>
  );
}

export default Cabins;
