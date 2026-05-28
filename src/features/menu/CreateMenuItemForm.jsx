import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import Select from "../../ui/Select";
import { getCroppedImg } from "../../utils/cropImage";

import { useCreateItem } from "../common/useCreateItem";
import { useUpdateItem } from "../common/useUpdateItem";

// Helper function to establish initial crop
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

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

  // Cropping State
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImageFile, setCroppedImageFile] = useState(null);
  const imgRef = useRef(null);
  const [isCropping, setIsCropping] = useState(false);

  // Handle file selection
  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCroppedImageFile(null); // Reset previous crop
      setIsCropping(true);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || ""),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  // Handle image load to set initial crop
  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const initialCropPercent = centerAspectCrop(width, height, 3 / 2);
    setCrop(initialCropPercent);

    // Convert percent crop to pixels relative to the displayed size
    const initialCropPixel = {
      unit: "px",
      x: (initialCropPercent.x / 100) * width,
      y: (initialCropPercent.y / 100) * height,
      width: (initialCropPercent.width / 100) * width,
      height: (initialCropPercent.height / 100) * height,
    };
    setCompletedCrop(initialCropPixel);
  }

  // Perform the crop when user clicks "Apply Crop"
  async function onCropComplete() {
    if (completedCrop && imgRef.current && imgSrc) {
      try {
        const croppedBlob = await getCroppedImg(
          imgSrc,
          completedCrop,
          imgRef.current.width,
          imgRef.current.height,
        );
        // Create a File from the Blob
        const croppedFile = new File([croppedBlob], "cropped-image.jpeg", {
          type: "image/jpeg",
        });
        setCroppedImageFile(croppedFile);
        setIsCropping(false); // Hide the cropper
      } catch (e) {
        console.error("Crop failed", e);
      }
    }
  }

  function onSubmit(data) {
    // Determine the image to use:
    // 1. If user just cropped a new image, use that.
    // 2. Otherwise, check if it's an existing string URL.
    // 3. Fallback to existing logic or itemToEdit.image.

    let finalImage = itemToEdit.image;

    if (croppedImageFile) {
      finalImage = croppedImageFile;
    } else if (
      typeof data.image === "string" ||
      !data.image ||
      data.image.length === 0
    ) {
      finalImage = itemToEdit.image;
    }

    if (isEditSession)
      updateItem(
        { newItemData: { ...data, image: finalImage }, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    else
      createItem(
        { ...data, image: finalImage },
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

      <FormRow label="Item photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: false,
            onChange: (e) => {
              onSelectFile(e);
            },
          })}
        />
      </FormRow>

      {/* CROPPING UI */}
      {isCropping && !!imgSrc && (
        <FormRow label="Crop Image (3:2 Ratio)">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={3 / 2}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                style={{ maxHeight: "300px", maxWidth: "100%", width: "auto" }}
              />
            </ReactCrop>
            <Button
              type="button"
              variation="secondary"
              size="small"
              onClick={onCropComplete}
            >
              Apply Crop
            </Button>
          </div>
        </FormRow>
      )}

      {/* PREVIEW AFTER CROP */}
      {croppedImageFile && !isCropping && (
        <FormRow label="Preview">
          <img
            src={URL.createObjectURL(croppedImageFile)}
            alt="Cropped preview"
            style={{ width: "150px", borderRadius: "8px" }}
          />
        </FormRow>
      )}

      <FormRow>
        <Button disabled={isWorking || isCropping} size="large">
          {isEditSession ? "Update item" : "Create new item"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateMenuItemForm;
