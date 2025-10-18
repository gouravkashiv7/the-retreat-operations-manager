function DiscountCalculator({ regularPrice, discount }) {
  // 1. Calculate discount amount and round it to the nearest integer
  const rawDiscountAmount = regularPrice * (discount / 100);
  const discountAmount = Math.round(rawDiscountAmount); // Rounds to the nearest integer

  // 2. Calculate the final price based on the rounded discount amount and round it to the nearest integer
  const rawFinalPrice = regularPrice - discountAmount;
  const finalPrice = Math.round(rawFinalPrice); // Rounds to the nearest integer

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "8px",
        backgroundColor: "#f8f9fa",
        borderRadius: "4px",
        fontSize: "14px",
        border: "1px solid #e9ecef",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
        Price Calculation:
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Regular Price:</span>
        <span>₹{Math.round(regularPrice)}</span>{" "}
        {/* Also round the input price */}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Discount ({discount}%):</span>
        <span>-₹{discountAmount}</span> {/* Displaying as integer */}
      </div>
      <hr
        style={{
          margin: "6px 0",
          border: "none",
          borderTop: "1px solid #dee2e6",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          color: "#2d8a39",
        }}
      >
        <span>Final Price:</span>
        <span>₹{finalPrice}</span> {/* Displaying as integer */}
      </div>
    </div>
  );
}

export default DiscountCalculator;
