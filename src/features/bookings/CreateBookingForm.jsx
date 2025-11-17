// components/bookings/CreateBookingForm.jsx
import { useCallback, useState } from "react";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import { useGuestById } from "../guests/useGuests";
import { useItems } from "../common/useItems";
import {
  FormContainer,
  Form,
  FormSection,
  SectionTitle,
  FormRow,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  GuestInfoCard,
  GuestInfoRow,
  GuestInfoLabel,
  GuestInfoValue,
  ErrorMessage,
  ButtonGroup,
  StepIndicator,
  Step,
  StepNumber,
  CheckboxLabel,
} from "./CreateBookingForm.styles";
import { getRooms } from "../../services/apiRooms";
import { getCabins } from "../../services/apiCabins";
import AccommodationSelector from "./AccommodationSelector";

function CreateBookingForm({ onCloseModal }) {
  const [step, setStep] = useState(1);
  const [guestId, setGuestId] = useState("");
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    numNights: 0,
    numGuests: 1,
    hasBreakfast: false,
    isPaid: false,
    observations: "",
    status: "unconfirmed",
    // Remove accommodation-related state from here
  });

  // Fetch guest data when guestId is provided
  const {
    data: guest,
    isLoading: isLoadingGuest,
    error: guestError,
  } = useGuestById(guestId);

  const { items: cabins, isLoading: isCabinsLoading } = useItems(
    "cabins",
    getCabins
  );
  const { items: rooms, isLoading: isRoomsLoading } = useItems(
    "rooms",
    getRooms
  );

  const isLoading = isCabinsLoading || isRoomsLoading;

  // Only create accommodations array when not loading
  const allAccommodations = isLoading
    ? []
    : [
        ...(cabins?.map((cabin) => ({
          id: cabin.id,
          name: cabin.name,
          maxCapacity: cabin.maxCapacity,
          regularPrice: cabin.regularPrice,
          discount: cabin.discount,
          description: cabin.description,
          type: "cabin",
        })) || []),
        ...(rooms?.map((room) => ({
          id: room.id,
          name: room.name,
          maxCapacity: room.maxCapacity,
          regularPrice: room.regularPrice,
          discount: room.discount,
          description: room.description,
          type: "room",
        })) || []),
      ];

  const handleAccommodationsChange = useCallback((newAccommodationData) => {
    setAccommodationData(newAccommodationData);

    // Update the main booking data with guest count
    setBookingData((prev) => ({
      ...prev,
      numGuests: newAccommodationData.totalGuests,
    }));
  }, []);

  const handleGuestIdSubmit = (e) => {
    e.preventDefault();
    if (guestId.trim()) {
      setStep(2);
    }
  };

  const handleBookingDataChange = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleAccommodationTypeChange = (type) => {
  //   setBookingData((prev) => ({
  //     ...prev,
  //     accommodationType: type,
  //     selectedAccommodation: "", // Reset selection when type changes
  //   }));
  // };

  const calculateNumNights = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleDateChange = (field, value) => {
    const newData = { ...bookingData, [field]: value };

    if (field === "startDate" && bookingData.endDate) {
      newData.numNights = calculateNumNights(value, bookingData.endDate);
    } else if (field === "endDate" && bookingData.startDate) {
      newData.numNights = calculateNumNights(bookingData.startDate, value);
    }

    setBookingData(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalBookingData = {
      ...bookingData,
      ...accommodationData,
    };

    console.log("Creating booking:", finalBookingData);

    if (onCloseModal) onCloseModal();
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  // // Empty function stubs for API calls
  // const createBooking = async (bookingData) => {
  //   // TODO: Implement booking creation API call
  //   console.log("Creating booking:", bookingData);
  // };

  // const calculateBookingPrice = async (bookingData) => {
  //   // TODO: Implement price calculation
  //   return 0;
  // };

  const [accommodationData, setAccommodationData] = useState({
    numRetreats: 1,
    selectedAccommodations: [],
    guestCounts: {},
    totalPrice: 0,
  });

  return (
    <FormContainer>
      <StepIndicator>
        <Step $active={step === 1}>
          <StepNumber $active={step === 1}>1</StepNumber>
          Guest Information
        </Step>
        <Step $active={step === 2}>
          <StepNumber $active={step === 2}>2</StepNumber>
          Booking Details
        </Step>
      </StepIndicator>

      <Form onSubmit={step === 1 ? handleGuestIdSubmit : handleSubmit}>
        {step === 1 && (
          <FormSection>
            <SectionTitle>Find Guest</SectionTitle>
            <FormGroup>
              <Label htmlFor="guestId">Guest ID *</Label>
              <Input
                id="guestId"
                type="text"
                placeholder="Enter guest ID"
                value={guestId}
                onChange={(e) => setGuestId(e.target.value)}
                required
              />
            </FormGroup>

            {guestId && (
              <div>
                {isLoadingGuest && <Spinner />}
                {guestError && (
                  <ErrorMessage>
                    Guest not found. Please check the Guest ID and try again.
                  </ErrorMessage>
                )}
                {guest && (
                  <GuestInfoCard>
                    <h4>Guest Information</h4>
                    <GuestInfoRow>
                      <GuestInfoLabel>Name:</GuestInfoLabel>
                      <GuestInfoValue>{guest.fullName}</GuestInfoValue>
                    </GuestInfoRow>
                    <GuestInfoRow>
                      <GuestInfoLabel>Email:</GuestInfoLabel>
                      <GuestInfoValue>{guest.email}</GuestInfoValue>
                    </GuestInfoRow>
                    <GuestInfoRow>
                      <GuestInfoLabel>Phone:</GuestInfoLabel>
                      <GuestInfoValue>{guest.phone}</GuestInfoValue>
                    </GuestInfoRow>
                    <GuestInfoRow>
                      <GuestInfoLabel>National ID:</GuestInfoLabel>
                      <GuestInfoValue>{guest.nationalId}</GuestInfoValue>
                    </GuestInfoRow>
                  </GuestInfoCard>
                )}
              </div>
            )}

            <ButtonGroup>
              <Button
                type="button"
                $variation="secondary"
                onClick={onCloseModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                $variation="primary"
                disabled={!guestId || isLoadingGuest || !guest}
              >
                {isLoadingGuest ? "Loading..." : "Continue to Booking Details"}
              </Button>
            </ButtonGroup>
          </FormSection>
        )}

        {step === 2 && guest && (
          <FormSection>
            <SectionTitle>Booking Details</SectionTitle>

            {/* Guest Summary */}
            <GuestInfoCard>
              <h4>Booking for: {guest.fullName}</h4>
              <GuestInfoRow>
                <GuestInfoLabel>Guest ID:</GuestInfoLabel>
                <GuestInfoValue>{guestId}</GuestInfoValue>
              </GuestInfoRow>
            </GuestInfoCard>

            {/* Dates and Guests */}
            <FormRow>
              <FormGroup>
                <Label htmlFor="startDate">Check-in Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="endDate">Check-out Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={bookingData.endDate}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="numNights">Number of Nights</Label>
                <Input
                  id="numNights"
                  type="number"
                  value={bookingData.numNights}
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="numGuests">Number of Guests *</Label>
                <Input
                  id="numGuests"
                  type="number"
                  min="1"
                  max="20"
                  disabled="true"
                  value={bookingData.numGuests}
                  onChange={(e) =>
                    handleBookingDataChange(
                      "numGuests",
                      parseInt(e.target.value)
                    )
                  }
                  required
                />
              </FormGroup>
            </FormRow>

            {/* Accommodation Selection */}
            <FormGroup>
              <Label>Accommodation Selection</Label>
              <AccommodationSelector
                allAccommodations={allAccommodations}
                onAccommodationsChange={handleAccommodationsChange}
              />
            </FormGroup>

            {/* Additional Options */}
            <FormRow>
              <FormGroup>
                <CheckboxLabel htmlFor="hasBreakfast">
                  <input
                    id="hasBreakfast"
                    type="checkbox"
                    checked={bookingData.hasBreakfast}
                    onChange={(e) =>
                      handleBookingDataChange("hasBreakfast", e.target.checked)
                    }
                  />
                  Include Breakfast (250 / guest)
                </CheckboxLabel>
              </FormGroup>
              <FormGroup>
                <CheckboxLabel htmlFor="isPaid">
                  <input
                    id="isPaid"
                    type="checkbox"
                    checked={bookingData.isPaid}
                    onChange={(e) =>
                      handleBookingDataChange("isPaid", e.target.checked)
                    }
                  />
                  Mark as Paid
                </CheckboxLabel>
              </FormGroup>
            </FormRow>

            {/* Status */}
            <FormGroup>
              <Label htmlFor="status">Booking Status *</Label>
              <Select
                id="status"
                value={bookingData.status}
                onChange={(e) =>
                  handleBookingDataChange("status", e.target.value)
                }
                required
              >
                <option value="unconfirmed">Unconfirmed</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked In</option>
              </Select>
            </FormGroup>

            {/* Observations */}
            <FormGroup>
              <Label htmlFor="observations">Observations</Label>
              <TextArea
                id="observations"
                placeholder="Any special requests or observations..."
                value={bookingData.observations}
                onChange={(e) =>
                  handleBookingDataChange("observations", e.target.value)
                }
                rows="3"
              />
            </FormGroup>

            <ButtonGroup>
              <Button type="button" $variation="secondary" onClick={goBack}>
                Back
              </Button>
              <Button
                type="button"
                $variation="secondary"
                onClick={onCloseModal}
              >
                Cancel
              </Button>
              <Button type="submit" $variation="primary">
                Create Booking
              </Button>
            </ButtonGroup>
          </FormSection>
        )}
      </Form>
    </FormContainer>
  );
}

export default CreateBookingForm;
