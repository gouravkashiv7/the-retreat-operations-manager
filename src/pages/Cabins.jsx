import Row from "../ui/Row";
import ItemTable from "../features/common/ItemTable";
import AddItem from "../features/common/AddItem";
import ItemTableOperations from "../features/common/ItemTableOperations";
import ItemHeader from "../ui/ItemHeader";

import { getCabins } from "../services/apiCabins";

function Cabins() {
  return (
    <>
      <Row type="horizontal" $stackOnMobile>
        <ItemHeader title="All Cabins!!" />
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
