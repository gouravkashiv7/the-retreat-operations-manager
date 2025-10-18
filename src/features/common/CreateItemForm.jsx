import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useCreateItem } from "./useCreateItem";
import { useUpdateItem } from "./useUpdateItem";
import DiscountCalculator from "./DiscountCalculator";

function CreateItemForm({
  itemToUpdate = {},
  onCloseModal,
  queryKey,
  itemName,
}) {
  const { id: updateId, ...updateValues } = itemToUpdate;
  const isEditSession = Boolean(updateId);

  const { register, handleSubmit, reset, formState, watch } = useForm({
    defaultValues: isEditSession ? updateValues : {},
  });

  const { isCreating, createItem } = useCreateItem(itemName, queryKey);
  const { isUpdating, updateItem } = useUpdateItem(itemName, queryKey);

  const isWorking = isUpdating || isCreating;

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
      updateItem(
        { newItemData: itemData, id: updateId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createItem(itemData, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }
  const { errors } = formState;

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
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
            min: {
              value: 0,
              message: "Discount cannot be a negative value",
            },
          })}
        />
        {!errors?.discount && (
          <DiscountCalculator
            regularPrice={watch("regularPrice") || 0}
            discount={watch("discount") || 0}
          />
        )}
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

      <FormRow
        label={`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} Photo`}
        error={errors?.image?.message}
      >
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
          onClick={() => onCloseModal?.()}
        >
          Cancel
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
