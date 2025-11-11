// components/guests/GuestForm.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateGuest, useUpdateGuest } from "./useGuests";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import {
  Form,
  FormRow,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  ErrorMessage,
  ButtonGroup,
  FullWidth,
  FormHeader,
  RequiredIndicator,
} from "./GuestForm.styles";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "South Korea",
  "India",
  "Brazil",
  "Mexico",
  "Spain",
  "Italy",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "United Arab Emirates",
  "Singapore",
  "Malaysia",
  "Thailand",
  "China",
  "South Africa",
  "New Zealand",
].sort();

const ID_TYPES = ["Passport", "National ID", "Driver License", "Other"];

function GuestForm({ guest, onCloseModal }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const createGuestMutation = useCreateGuest();
  const updateGuestMutation = useUpdateGuest();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedIdType, setSelectedIdType] = useState("");

  useEffect(() => {
    if (guest) {
      reset({
        fullName: guest.fullName || "",
        email: guest.email || "",
        nationalId: guest.nationalId || "",
        country: guest.country || "",
        phone: guest.phone || "",
        idType: guest.idType || "",
        passport: guest.passport || "",
        address: guest.address || "",
      });
      setSelectedCountry(guest.country || "");
      setSelectedIdType(guest.idType || "");
    }
  }, [guest, reset]);

  const isLoading =
    createGuestMutation.isLoading || updateGuestMutation.isLoading;

  const onSubmit = (data) => {
    const guestData = {
      ...data,
      phone: data.phone ? parseInt(data.phone) : null,
    };

    if (guest) {
      updateGuestMutation.mutate(
        { id: guest.id, updates: guestData },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createGuestMutation.mutate(guestData, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader>{guest ? "Edit Guest" : "Add New Guest"}</FormHeader>

      <FormRow>
        <FormGroup>
          <Label htmlFor="fullName">
            Full Name <RequiredIndicator>*</RequiredIndicator>
          </Label>
          <Input
            id="fullName"
            type="text"
            className={errors.fullName ? "error" : ""}
            {...register("fullName", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Full name must be at least 2 characters",
              },
            })}
            placeholder="Enter full name"
          />
          {errors.fullName && (
            <ErrorMessage>{errors.fullName.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            className={errors.email ? "error" : ""}
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            placeholder="Enter email address"
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="1234567890"
            {...register("phone", {
              pattern: {
                value: /^[0-9]+$/,
                message: "Phone number must contain only digits",
              },
              minLength: {
                value: 10,
                message: "Phone number must be at least 10 digits",
              },
            })}
          />
          {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="country">Country</Label>
          <Select
            id="country"
            value={selectedCountry}
            {...register("country")}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select a country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Select>
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="idType">ID Type</Label>
          <Select
            id="idType"
            value={selectedIdType}
            {...register("idType")}
            onChange={(e) => setSelectedIdType(e.target.value)}
          >
            <option value="">Select ID type</option>
            {ID_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="nationalId">National ID / Passport Number</Label>
          <Input
            id="nationalId"
            type="text"
            {...register("nationalId")}
            placeholder="Enter ID or passport number"
          />
        </FormGroup>
      </FormRow>

      <FullWidth>
        <FormGroup>
          <Label htmlFor="address">Address</Label>
          <TextArea
            id="address"
            {...register("address")}
            placeholder="Full street address, city, state, and zip code"
          />
        </FormGroup>
      </FullWidth>

      <ButtonGroup>
        <Button
          type="button"
          $variation="secondary"
          onClick={onCloseModal}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner size="small" />
              {guest ? "Updating..." : "Creating..."}
            </>
          ) : guest ? (
            "Update Guest"
          ) : (
            "Create Guest"
          )}
        </Button>
      </ButtonGroup>
    </Form>
  );
}

export default GuestForm;
