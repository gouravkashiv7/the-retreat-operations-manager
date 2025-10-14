import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useCreateItem } from "./useCreateItem";
import { useEditItem } from "./useEditItem";

function CreateItemForm({ itemToEdit = {}, onClose, queryKey, itemName }) {
  const { id: editId, ...editValues } = itemToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { isCreating, createItem } = useCreateItem(itemName, queryKey);
  const { isEditing, editItem } = useEditItem(itemName, queryKey);

  const isWorking = isEditing || isCreating;

  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];
    const itemData = {
      ...data,
      image,
      maxCapacity: Number(data.maxCapacity),
      regularPrice: Number(data.regularPrice),
      discount: Number(data.discount),
    };

    if (isEditSession) {
      editItem(
        { newItemData: itemData, id: editId },
        {
          onSuccess: () => {
            reset();
            onClose?.();
          },
        }
      );
    } else {
      createItem(itemData, {
        onSuccess: () => {
          reset();
          onClose?.();
        },
      });
    }
  }
  const { errors } = formState;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label={`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} Name`}
        error={errors?.name?.message}
        disabled={isWorking}
      >
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required!!",
          })}
        />
      </FormRow>

      <FormRow label="Maximum Capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This field is required!!",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This field is required!!",
            min: {
              value: 1,
              message: "Cabin Price should be greater than 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount Percentage" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isWorking}
          {...register("discount", {
            required: "This field is required!!",
            max: {
              value: 100,
              message: "Discount should be less than 100%",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
        disabled={isWorking}
      >
        <Textarea
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required!!",
          })}
        />
      </FormRow>

      <FormRow label={`${itemName} Photo`} error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This field is required!!",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          $variation="secondary"
          type={isEditSession ? "button" : "reset"}
          onClick={isEditSession ? onClose : undefined}
        >
          {isEditSession ? "Close" : "Reset"}
        </Button>

        <Button disabled={isWorking}>
          {isEditSession
            ? `Edit ${itemName.charAt(0).toUpperCase() + itemName.slice(1)} `
            : `Add ${itemName.charAt(0).toUpperCase() + itemName.slice(1)} `}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateItemForm;
