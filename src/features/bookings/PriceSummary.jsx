import styled from "styled-components";

const SummaryContainer = styled.div`
  background: var(--color-grey-100);
  padding: 1rem;
  border-radius: var(--border-radius-sm);
  margin-top: 1rem;
  font-size: 1.3rem;

  h4 {
    font-size: 1.3rem;
    margin-bottom: 0.6rem;
    color: var(--color-grey-700);
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 1.2rem;

    h4 {
      font-size: 1.2rem;
    }
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;

  &.total {
    font-weight: 600;
    border-top: 1px solid var(--color-grey-300);
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
`;

function PriceSummary({
  accommodationPrice,
  extrasPrice,
  totalPrice,
  numNights,
  numGuests,
}) {
  return (
    <SummaryContainer>
      <h4>Price Summary</h4>
      <PriceRow>
        <span>Accommodation ({numNights || 0} nights):</span>
        <span>₹{accommodationPrice || 0}</span>
      </PriceRow>
      <PriceRow>
        <span>Breakfast ({numGuests || 0} guests):</span>
        <span>₹{extrasPrice || 0}</span>
      </PriceRow>
      <PriceRow className="total">
        <span>Total:</span>
        <span>₹{totalPrice || 0}</span>
      </PriceRow>
    </SummaryContainer>
  );
}

export default PriceSummary;
