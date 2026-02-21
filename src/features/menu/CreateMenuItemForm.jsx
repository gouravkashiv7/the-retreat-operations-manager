import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import Select from "../../ui/Select";

import { useCreateItem } from "../common/useCreateItem";
import { useUpdateItem } from "../common/useUpdateItem";

function CreateMenuItemForm({ itemToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = itemToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const { isCreating, createItem } = useCreateItem("menu_item", "menu");
  const { isUpdating, updateItem } = useUpdateItem("menu_item", "menu");

  const isWorking = isCreating || isUpdating;

  function onSubmit(data) {
    const image =
      typeof data.image === "string" || !data.image
        ? data.image
        : data.image[0];

    if (isEditSession)
      updateItem(
        { newItemData: { ...data, image }, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    else
      createItem(
        { ...data, image: image },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Item name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Category" error={errors?.category?.message}>
        <Select
          id="category"
          disabled={isWorking}
          options={[
            { value: "Snacks", label: "Snacks" },
            { value: "Soups & Salads", label: "Soups & Salads" },
            { value: "Desserts", label: "Desserts" },
            { value: "Breakfast", label: "Breakfast" },
            { value: "Lunch / Dinner", label: "Lunch / Dinner" },
            { value: "Drinks & Beverages", label: "Drinks & Beverages" },
            { value: "Roti, Rice and Dahi", label: "Roti, Rice and Dahi" },
            { value: "Himachali Cuisine", label: "Himachali Cuisine" },
          ]}
          {...register("category", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Price" error={errors?.price?.message}>
        <Input
          type="number"
          id="price"
          disabled={isWorking}
          {...register("price", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Price should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register("description")}
        />
      </FormRow>

      <FormRow label="Item photo">
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        <Button disabled={isWorking} size="large">
          {isEditSession ? "Update item" : "Create new item"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateMenuItemForm;
