import styled from "styled-components";

const CalculatorContainer = styled.div`
  margin-top: 10px;
  padding: 8px;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  font-size: 14px;
  border: 1px solid var(--color-grey-200);
  transition: all 0.3s ease;
`;

const CalculatorTitle = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
  color: var(--color-grey-800);
`;

const CalculatorRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--color-grey-700);
`;

const CalculatorDivider = styled.hr`
  margin: 6px 0;
  border: none;
  border-top: 1px solid var(--color-grey-300);
`;

const FinalPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  color: var(--color-green-700);
`;

function DiscountCalculator({ regularPrice, discount }) {
  // Calculate prices
  const rawDiscountAmount = regularPrice * (discount / 100);
  const discountAmount = Math.round(rawDiscountAmount);
  const rawFinalPrice = regularPrice - discountAmount;
  const finalPrice = Math.round(rawFinalPrice);

  return (
    <CalculatorContainer>
      <CalculatorTitle>Price Calculation:</CalculatorTitle>

      <CalculatorRow>
        <span>Regular Price:</span>
        <span>₹{Math.round(regularPrice)}</span>
      </CalculatorRow>

      <CalculatorRow>
        <span>Discount ({discount}%):</span>
        <span style={{ color: "var(--color-red-700)" }}>
          -₹{discountAmount}
        </span>
      </CalculatorRow>

      <CalculatorDivider />

      <FinalPriceRow>
        <span>Final Price:</span>
        <span>₹{finalPrice}</span>
      </FinalPriceRow>
    </CalculatorContainer>
  );
}

export default DiscountCalculator;
