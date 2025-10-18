import Heading from "../ui/Heading";

import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import Row from "../ui/Row";
import UserHeader from "../ui/UserHeader";

function Settings() {
  return (
    <Row>
      <UserHeader
        title="Update Hotel Settings"
        subtitle="Modify hotel's information and preferences"
      />
      <UpdateSettingsForm />
    </Row>
  );
}

export default Settings;
