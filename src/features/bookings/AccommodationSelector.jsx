// components/bookings/AccommodationSelector.jsx
import { useState, useEffect, useMemo } from "react";
import { useDarkMode } from "../../context/DarkModeContext";
import {
  SelectorContainer,
  RetreatCountSection,
  RetreatSelectionSection,
  RetreatCard,
  RetreatHeader,
  RetreatTitle,
  RetreatDetails,
  DetailItem,
  DetailLabel,
  DetailValue,
  PriceDisplay,
  ErrorMessage,
  StyledSelect,
  StyledInput,
  RemoveButton,
  TotalPriceSection,
  TotalPriceLabel,
  TotalPriceValue,
  PriceInputContainer,
  PriceSuffix,
  PriceInput,
  NumberButton,
  NumberInput,
  NumberInputContainer,
} from "./AccommodationSelector.styles";

function AccommodationSelector({ allAccommodations, onAccommodationsChange }) {
  const { isDarkMode } = useDarkMode();
  const theme = { darkMode: isDarkMode };

  // Use local state only, don't sync with external props to avoid loops
  const [numRetreats, setNumRetreats] = useState(1);
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  const [guestCounts, setGuestCounts] = useState({});
  const [customPrices, setCustomPrices] = useState({});

  // Calculate totals with useMemo
  const { totalGuests, totalPrice } = useMemo(() => {
    const totalGuests = selectedAccommodations.reduce((total, acc) => {
      return total + (guestCounts[acc.id] || 2); // Default to 2 guests
    }, 0);

    const totalPrice = selectedAccommodations.reduce((total, acc) => {
      // Calculate discount amount based on percentage
      const discountAmount = Math.round(
        (acc.regularPrice * (acc.discount || 0)) / 100
      );
      const finalPrice = acc.regularPrice - discountAmount;

      // Use custom price if set, otherwise use calculated price
      return total + (customPrices[acc.id] || finalPrice);
    }, 0);

    return { totalGuests, totalPrice };
  }, [selectedAccommodations, guestCounts, customPrices]);

  // Then include them in dependencies
  useEffect(() => {
    onAccommodationsChange({
      numRetreats,
      selectedAccommodations,
      guestCounts,
      totalGuests,
      totalPrice,
      customPrices,
    });
  }, [
    numRetreats,
    selectedAccommodations,
    guestCounts,
    totalGuests,
    totalPrice,
    customPrices,
    onAccommodationsChange,
  ]);

  // Handle number of retreats change
  const handleNumRetreatsChange = (count) => {
    const maxPossibleRetreats = Math.max(1, allAccommodations.length);
    const newCount = Math.max(1, Math.min(maxPossibleRetreats, count));
    setNumRetreats(newCount);

    if (newCount < selectedAccommodations.length) {
      const newSelected = selectedAccommodations.slice(0, newCount);
      setSelectedAccommodations(newSelected);

      // Clean up guest counts and custom prices for removed accommodations
      const remainingIds = new Set(newSelected.map((acc) => acc.id));
      const newGuestCounts = { ...guestCounts };
      const newCustomPrices = { ...customPrices };

      Object.keys(newGuestCounts).forEach((id) => {
        if (!remainingIds.has(parseInt(id))) {
          delete newGuestCounts[id];
        }
      });

      Object.keys(newCustomPrices).forEach((id) => {
        if (!remainingIds.has(parseInt(id))) {
          delete newCustomPrices[id];
        }
      });

      setGuestCounts(newGuestCounts);
      setCustomPrices(newCustomPrices);
    }
  };

  // Handle accommodation selection for a specific slot
  const handleAccommodationSelect = (slotIndex, accommodationId) => {
    if (!accommodationId) {
      // Remove accommodation if empty selection
      const accommodationToRemove = selectedAccommodations[slotIndex];
      const newSelected = selectedAccommodations.filter(
        (_, index) => index !== slotIndex
      );
      setSelectedAccommodations(newSelected);

      // Clean up guest counts and custom prices
      if (accommodationToRemove) {
        setGuestCounts((prev) => {
          const newCounts = { ...prev };
          delete newCounts[accommodationToRemove.id];
          return newCounts;
        });
        setCustomPrices((prev) => {
          const newPrices = { ...prev };
          delete newPrices[accommodationToRemove.id];
          return newPrices;
        });
      }
      return;
    }

    const accommodation = allAccommodations.find(
      (acc) => acc.id === parseInt(accommodationId)
    );

    if (accommodation) {
      const newSelected = [...selectedAccommodations];
      newSelected[slotIndex] = accommodation;
      setSelectedAccommodations(newSelected);

      // Set default guest count to 2 for new selection
      setGuestCounts((prev) => ({
        ...prev,
        [accommodation.id]: 2,
      }));

      // Calculate initial price with discount
      const discountAmount = Math.round(
        (accommodation.regularPrice * (accommodation.discount || 0)) / 100
      );
      const finalPrice = accommodation.regularPrice - discountAmount;

      // Set initial custom price (same as calculated price)
      setCustomPrices((prev) => ({
        ...prev,
        [accommodation.id]: finalPrice,
      }));
    }
  };

  // Handle guest count change for a specific accommodation
  const handleGuestCountChange = (accommodationId, count) => {
    const accommodation = selectedAccommodations.find(
      (acc) => acc.id === accommodationId
    );
    if (accommodation) {
      const newCount = Math.max(1, Math.min(accommodation.maxCapacity, count));
      setGuestCounts((prev) => ({
        ...prev,
        [accommodationId]: newCount,
      }));
    }
  };

  // Handle custom price change
  const handleCustomPriceChange = (accommodationId, price) => {
    const newPrice = Math.max(0, price || 0); // Only prevent negative prices
    setCustomPrices((prev) => ({
      ...prev,
      [accommodationId]: newPrice,
    }));
  };

  // Remove accommodation from a slot
  const removeAccommodation = (slotIndex) => {
    const accommodationId = selectedAccommodations[slotIndex]?.id;
    const newSelected = selectedAccommodations.filter(
      (_, index) => index !== slotIndex
    );
    setSelectedAccommodations(newSelected);

    if (accommodationId) {
      setGuestCounts((prev) => {
        const newCounts = { ...prev };
        delete newCounts[accommodationId];
        return newCounts;
      });
      setCustomPrices((prev) => {
        const newPrices = { ...prev };
        delete newPrices[accommodationId];
        return newPrices;
      });
    }
  };

  // Get available accommodations (not already selected in other slots)
  const getAvailableAccommodations = (currentSlotIndex) => {
    return allAccommodations.filter(
      (acc) =>
        !selectedAccommodations.some(
          (selectedAcc, index) =>
            index !== currentSlotIndex && selectedAcc.id === acc.id
        )
    );
  };

  // Calculate discount amount for an accommodation
  const calculateDiscountAmount = (accommodation) => {
    return Math.round(
      (accommodation.regularPrice * (accommodation.discount || 0)) / 100
    );
  };

  // Calculate final price for an accommodation
  const calculateFinalPrice = (accommodation) => {
    const discountAmount = calculateDiscountAmount(accommodation);
    return accommodation.regularPrice - discountAmount;
  };

  return (
    <SelectorContainer theme={theme}>
      {/* Number of Retreats Selection */}
      <RetreatCountSection theme={theme}>
        <DetailItem>
          <DetailLabel theme={theme}>Number of Retreats</DetailLabel>
          <StyledSelect
            value={numRetreats}
            onChange={(e) => handleNumRetreatsChange(parseInt(e.target.value))}
            theme={theme}
          >
            {Array.from({ length: allAccommodations.length }, (_, index) => {
              const num = index + 1;
              return (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Retreat" : "Retreats"}
                </option>
              );
            })}
          </StyledSelect>
        </DetailItem>

        <DetailItem>
          <DetailLabel theme={theme}>Total Guests: {totalGuests}</DetailLabel>
        </DetailItem>
      </RetreatCountSection>

      {/* Individual Retreat Selection */}
      <RetreatSelectionSection>
        {Array.from({ length: numRetreats }, (_, slotIndex) => {
          const selectedAccommodation = selectedAccommodations[slotIndex];

          return (
            <RetreatCard
              key={slotIndex}
              theme={theme}
              className={selectedAccommodation ? "selected" : ""}
            >
              <RetreatHeader theme={theme}>
                <RetreatTitle theme={theme}>
                  Retreat #{slotIndex + 1}
                </RetreatTitle>
                {selectedAccommodation && (
                  <RemoveButton
                    onClick={() => removeAccommodation(slotIndex)}
                    theme={theme}
                  >
                    Remove
                  </RemoveButton>
                )}
              </RetreatHeader>

              <RetreatDetails>
                <DetailItem>
                  <DetailLabel theme={theme}>Select Accommodation</DetailLabel>
                  <StyledSelect
                    value={selectedAccommodation?.id || ""}
                    onChange={(e) =>
                      handleAccommodationSelect(slotIndex, e.target.value)
                    }
                    theme={theme}
                  >
                    <option value="">Choose an accommodation...</option>
                    {getAvailableAccommodations(slotIndex).map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.type}) - Capacity : {acc.maxCapacity}{" "}
                        guests
                      </option>
                    ))}
                  </StyledSelect>
                </DetailItem>

                {selectedAccommodation && (
                  <>
                    <DetailItem>
                      <DetailLabel theme={theme}>Number of Guests</DetailLabel>
                      <NumberInputContainer>
                        <NumberButton
                          theme={theme}
                          onClick={() => {
                            const current =
                              guestCounts[selectedAccommodation.id] || 2;
                            if (current > 1) {
                              handleGuestCountChange(
                                selectedAccommodation.id,
                                current - 1
                              );
                            }
                          }}
                          disabled={
                            (guestCounts[selectedAccommodation.id] || 2) <= 1
                          }
                        >
                          -
                        </NumberButton>
                        <NumberInput
                          type="number"
                          min="1"
                          max={selectedAccommodation.maxCapacity}
                          step="1"
                          value={guestCounts[selectedAccommodation.id] || 2}
                          onChange={(e) =>
                            handleGuestCountChange(
                              selectedAccommodation.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          theme={theme}
                        />
                        <NumberButton
                          theme={theme}
                          onClick={() => {
                            const current =
                              guestCounts[selectedAccommodation.id] || 2;
                            if (current < selectedAccommodation.maxCapacity) {
                              handleGuestCountChange(
                                selectedAccommodation.id,
                                current + 1
                              );
                            }
                          }}
                          disabled={
                            (guestCounts[selectedAccommodation.id] || 2) >=
                            selectedAccommodation.maxCapacity
                          }
                        >
                          +
                        </NumberButton>
                      </NumberInputContainer>
                      <DetailLabel theme={theme}>
                        Max: {selectedAccommodation.maxCapacity} guests
                      </DetailLabel>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel theme={theme}>Price Details</DetailLabel>
                      <DetailValue theme={theme}>
                        Base: ₹{selectedAccommodation.regularPrice}
                      </DetailValue>
                      {selectedAccommodation.discount > 0 && (
                        <>
                          <DetailValue theme={theme}>
                            Discount: {selectedAccommodation.discount}% (- ₹
                            {calculateDiscountAmount(selectedAccommodation)})
                          </DetailValue>
                          <DetailValue theme={theme}>
                            Calculated: ₹
                            {calculateFinalPrice(selectedAccommodation)}
                          </DetailValue>
                        </>
                      )}
                      <DetailItem>
                        <DetailLabel theme={theme}>
                          Final Price (Editable)
                        </DetailLabel>
                        <PriceInputContainer>
                          <PriceInput
                            type="number"
                            min="0"
                            value={
                              customPrices[selectedAccommodation.id] ||
                              calculateFinalPrice(selectedAccommodation)
                            }
                            onChange={(e) =>
                              handleCustomPriceChange(
                                selectedAccommodation.id,
                                parseInt(e.target.value) ||
                                  calculateFinalPrice(selectedAccommodation)
                              )
                            }
                            theme={theme}
                          />
                          <PriceSuffix theme={theme}>/night</PriceSuffix>
                        </PriceInputContainer>
                      </DetailItem>
                    </DetailItem>
                  </>
                )}
              </RetreatDetails>
            </RetreatCard>
          );
        })}
      </RetreatSelectionSection>

      {/* Total Price Display */}
      <TotalPriceSection theme={theme}>
        <TotalPriceLabel theme={theme}>Total Price per Night</TotalPriceLabel>
        <TotalPriceValue theme={theme}>₹{totalPrice}</TotalPriceValue>
      </TotalPriceSection>

      {/* Validation Messages */}
      {selectedAccommodations.length < numRetreats && (
        <ErrorMessage theme={theme}>
          Please select accommodations for all {numRetreats} retreat(s)
        </ErrorMessage>
      )}
    </SelectorContainer>
  );
}

export default AccommodationSelector;
