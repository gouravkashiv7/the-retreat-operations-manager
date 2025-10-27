import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";

import { getSettings } from "../../services/apiSettings";
import { useItems } from "../common/useItems";
import { useUpdateSetting } from "./useUpdateSetting";

function UpdateSettingsForm() {
  const {
    isLoading,
    items: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
      extraGuestPrice,
    } = {},
  } = useItems("settings", getSettings);

  const { isUpdating, updateSetting } = useUpdateSetting();

  function handleSubmit(e, field) {
    const { value } = e.target;
    if (!value) return;
    updateSetting({ [field]: value });
  }

  if (isLoading) return <Spinner />;
  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          disabled={isUpdating}
          defaultValue={minBookingLength}
          onBlur={(e) => handleSubmit(e, "minBookingLength")}
        />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          disabled={isUpdating}
          defaultValue={maxBookingLength}
          onBlur={(e) => handleSubmit(e, "maxBookingLength")}
        />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          disabled={isUpdating}
          defaultValue={maxGuestsPerBooking}
          onBlur={(e) => handleSubmit(e, "maxGuestsPerBooking")}
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfastPrice"
          disabled={isUpdating}
          defaultValue={breakfastPrice}
          onBlur={(e) => handleSubmit(e, "breakfastPrice")}
        />
      </FormRow>
      <FormRow label="Extra Guest price">
        <Input
          type="number"
          id="extraGuestPrice"
          disabled={isUpdating}
          defaultValue={extraGuestPrice}
          onBlur={(e) => handleSubmit(e, "extraGuestPrice")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
