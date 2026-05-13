import styled from "styled-components";
import { useRef, useState } from "react";
import { useOrders } from "../orders/useOrders";
import { useParams } from "react-router-dom";
import { useMoveBack } from "../../hooks/useMoveBack";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import { formatCurrency, getAccommodationName } from "../../utils/helpers";
import { format } from "date-fns";
import Logo from "../../ui/Logo";
import Button from "../../ui/Button";
import { HiPrinter, HiArrowDownTray } from "react-icons/hi2";
import { useBooking } from "../bookings/useBooking";
import { toast } from "react-hot-toast";

const StyledReceiptTable = styled(Table)`
  & header,
  & [role="row"] {
    grid-template-columns: 1.2fr 2fr 1fr;

    @media (max-width: 600px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  & [role="row"] div:first-child {
    @media (max-width: 600px) {
      grid-column: 1 / -1;
      border-bottom: 1px dashed var(--color-grey-100);
      padding-bottom: 0.4rem;
      margin-bottom: 0.4rem;
    }
  }
`;

const StyledReceipt = styled.div`
  background-color: var(--color-grey-0);
  padding: 4.8rem;
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  overflow: hidden;

  /* Force light mode variables for PDF generation or print if needed */
  &.light-mode-forced {
    --color-grey-0: #fff;
    --color-grey-50: #f9fafb;
    --color-grey-100: #f3f4f6;
    --color-grey-200: #e5e7eb;
    --color-grey-300: #d1d5db;
    --color-grey-400: #9ca3af;
    --color-grey-500: #6b7280;
    --color-grey-600: #4b5563;
    --color-grey-700: #374151;
    --color-grey-800: #1f2937;
    --color-grey-900: #111827;

    background-color: #fff;
    color: #374151;
    border: 1px solid #f3f4f6;
  }

  @media (max-width: 768px) {
    padding: 3.2rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1.2rem;
    border-radius: var(--border-radius-sm);
    border: none;
  }

  @media print {
    padding: 2rem;
    border: none;
    max-width: 100%;
    /* Print is usually light mode by default but we can force it */
    --color-grey-0: #fff;
    --color-grey-50: #f9fafb;
    --color-grey-100: #f3f4f6;
    --color-grey-200: #e5e7eb;
    --color-grey-300: #d1d5db;
    --color-grey-400: #9ca3af;
    --color-grey-500: #6b7280;
    --color-grey-600: #4b5563;
    --color-grey-700: #374151;
    --color-grey-800: #1f2937;
    --color-grey-900: #111827;
    background-color: #fff;
  }
`;

const ReceiptHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid var(--color-brand-600);
  padding-bottom: 2.4rem;
  margin-bottom: 3.2rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2rem;
  }
`;

const CompanyInfo = styled.div`
  & h2 {
    font-size: 2.4rem;
    color: var(--color-brand-600);
    margin-bottom: 0.8rem;
  }
  & p {
    font-size: 1.4rem;
    color: var(--color-grey-500);
  }
`;

const ReceiptInfo = styled.div`
  text-align: right;
  & h3 {
    font-size: 2rem;
    margin-bottom: 0.8rem;
  }
  & p {
    font-size: 1.4rem;
    color: var(--color-grey-500);
  }

  @media (max-width: 600px) {
    text-align: center;
  }
`;

const CustomerInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.4rem;
  margin-bottom: 3.2rem;
  font-size: 1.4rem;

  & div h4 {
    text-transform: uppercase;
    font-size: 1.2rem;
    color: var(--color-grey-400);
    margin-bottom: 0.4rem;
    border-bottom: 1px solid var(--color-grey-100);
    padding-bottom: 0.4rem;
  }

  & p {
    font-weight: 500;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1.6rem;
  }
`;

const AddressLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
  transition: all 0.3s;

  &:hover p {
    color: var(--color-brand-600);
  }
`;

const TotalSection = styled.div`
  margin-top: 3.2rem;
  padding-top: 1.6rem;
  border-top: 2px solid var(--color-grey-200);
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3.2rem;
`;

const ReceiptFooter = styled.footer`
  margin-top: 4.8rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid var(--color-grey-100);
  padding-top: 2.4rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    gap: 3.2rem;
    text-align: center;
  }
`;

const SignatureBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;

  & img {
    height: 6rem;
    width: auto;
    object-fit: contain;
  }

  & span {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-grey-500);
    text-transform: uppercase;
    letter-spacing: 1px;
    border-top: 1px solid var(--color-grey-300);
    padding-top: 0.8rem;
    min-width: 15rem;
    text-align: center;
  }
`;

const WebsiteLink = styled.a`
  font-size: 1.4rem;
  color: var(--color-brand-600);
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const DesktopReceiptTable = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;

const ReceiptItemList = styled.div`
  display: none;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;

  @media (max-width: 600px) {
    display: flex;
  }

  @media print {
    display: none;
  }
`;

const ReceiptItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.2rem 0;
  border-bottom: 1px dashed var(--color-grey-100);

  &:last-child {
    border-bottom: none;
  }
`;

const ItemMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  & .name {
    font-weight: 600;
    font-size: 1.4rem;
    color: var(--color-grey-700);
    flex: 1;
    line-height: 1.4;
  }

  & .price {
    font-weight: 700;
    font-size: 1.4rem;
    color: var(--color-grey-800);
    margin-left: 1rem;
    white-space: nowrap;
  }
`;

const ItemSub = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const TotalBox = styled.div`
  background-color: var(--color-grey-50);
  padding: 1.6rem 2.4rem;
  border-radius: var(--border-radius-sm);
  display: flex;
  gap: 2.4rem;
  align-items: center;

  & span:first-child {
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-500);
  }

  & span:last-child {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-brand-600);
  }

  @media (max-width: 600px) {
    width: 100%;
    justify-content: space-between;
    padding: 1.2rem 1.6rem;

    & span:last-child {
      font-size: 2rem;
    }
  }
`;

function BookingReceipt() {
  const { bookingId } = useParams();
  const { orders, isLoading: isLoadingOrders } = useOrders();
  const { booking, isLoading: isLoadingBooking } = useBooking();
  const moveBack = useMoveBack();
  const receiptRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);
  const [receiptType, setReceiptType] = useState("stay"); // 'stay' or 'orders'

  if (isLoadingOrders || isLoadingBooking) return <Spinner />;

  const bookingOrders = orders.filter(
    (order) =>
      String(order.bookingId) === String(bookingId) &&
      order.status !== "cancelled",
  );

  const grandTotal = bookingOrders.reduce(
    (acc, order) => acc + order.totalPrice,
    0,
  );

  if (receiptType === "orders" && !bookingOrders.length) {
    return (
      <>
        <Row type="horizontal">
          <Heading as="h1">Receipt #B-{bookingId}</Heading>
          <div style={{ display: "flex", gap: "1.2rem" }}>
            <Button
              variation={receiptType === "stay" ? "primary" : "secondary"}
              size="small"
              onClick={() => setReceiptType("stay")}
            >
              Stay Receipt
            </Button>
            <Button
              variation={receiptType === "orders" ? "primary" : "secondary"}
              size="small"
              onClick={() => setReceiptType("orders")}
            >
              Orders Receipt
            </Button>
            <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
          </div>
        </Row>
        <p style={{ marginTop: "2rem" }}>No orders found for this booking.</p>
      </>
    );
  }

  // Stay receipt data
  const {
    accommodationPrice,
    extrasPrice,
    totalPrice: bookingTotalPrice,
    observations,
    numNights,
    numGuests,
    hasBreakfast,
    paymentType,
    amountPaid,
    isPaid,
  } = booking;

  const remainingAmount = bookingTotalPrice - (amountPaid || 0);

  const nightlyRate = (accommodationPrice || 0) / numNights;

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPDF() {
    try {
      setIsDownloading(true);
      const element = receiptRef.current;

      // Force light mode for the capture
      element.classList.add("light-mode-forced");

      // Dynamic imports for heavy libraries
      const [html2canvas, { jsPDF }] = await Promise.all([
        import("html2canvas").then((m) => m.default),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector(".light-mode-forced");
          if (el) {
            el.style.width = "800px";
            el.style.maxWidth = "800px";
            el.style.padding = "4.8rem";
          }
        },
      });

      // Remove light mode force after capture
      element.classList.remove("light-mode-forced");

      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        "FAST",
      );
      pdf.save(`receipt-${bookingId}-${booking?.guests?.fullName}.pdf`);
      toast.success("Receipt downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <>
      <Row type="horizontal" $stackOnMobile className="no-print">
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
        >
          <Heading as="h1">
            {receiptType === "stay" ? "Stay Receipt" : "Orders Receipt"}
          </Heading>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <Button
              variation={receiptType === "stay" ? "primary" : "secondary"}
              size="small"
              onClick={() => setReceiptType("stay")}
            >
              Stay
            </Button>
            <Button
              variation={receiptType === "orders" ? "primary" : "secondary"}
              size="small"
              onClick={() => setReceiptType("orders")}
            >
              Orders
            </Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1.2rem",
            alignItems: "center",
            width: "auto",
            justifyContent: "flex-end",
          }}
          className="header-actions"
        >
          <Button
            onClick={handleDownloadPDF}
            variation="secondary"
            disabled={isDownloading}
            icon={<HiArrowDownTray />}
          >
            {isDownloading ? "Downloading..." : "Download"}
          </Button>

          <Button
            onClick={handlePrint}
            variation="primary"
            icon={<HiPrinter />}
          >
            Print
          </Button>
          <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
        </div>
      </Row>

      <style>
        {`
        @media (max-width: 480px) {
          .header-actions {
            justify-content: space-between !important;
          }
          .header-actions button {
            flex: 1;
            padding: 1rem 0.6rem;
            font-size: 1.2rem;
          }
        }
      `}
      </style>

      <StyledReceipt ref={receiptRef}>
        <ReceiptHeader>
          <CompanyInfo>
            <Logo />
            <h2>The Retreat Cottage</h2>
            <AddressLink
              href="https://maps.app.goo.gl/dQe4Q4bjyrPEDd7e7"
              target="_blank"
              rel="noreferrer"
            >
              <p>Dharampur, Distt Solan</p>
              <p>Himachal Pradesh, 173209</p>
            </AddressLink>
            <WebsiteLink
              href="https://www.retreatcottage.in/"
              target="_blank"
              rel="noreferrer"
            >
              www.retreatcottage.in
            </WebsiteLink>
          </CompanyInfo>
          <ReceiptInfo>
            <h3>{receiptType === "stay" ? "STAY SUMMARY" : "ORDER SUMMARY"}</h3>
            <p>Booking ID: #{bookingId}</p>
            <p>Date: {format(new Date(), "MMM dd, yyyy")}</p>
          </ReceiptInfo>
        </ReceiptHeader>

        <CustomerInfo>
          <div>
            <h4>Guest Details</h4>
            <p>{booking.guests.fullName}</p>
            <p>{booking.guests.email}</p>
          </div>
          <div>
            <h4>Accommodation</h4>
            <p>{booking.accommodation.name}</p>
            <p>
              Stay: {format(new Date(booking.startDate), "MMM dd")} -{" "}
              {format(new Date(booking.endDate), "MMM dd, yyyy")}
            </p>
          </div>
        </CustomerInfo>

        {receiptType === "orders" ? (
          <>
            <DesktopReceiptTable>
              <StyledReceiptTable columns="1.2fr 2fr 1fr">
                <Table.Header>
                  <div>Date</div>
                  <div>Items</div>
                  <div style={{ textAlign: "right" }}>Amount</div>
                </Table.Header>

                <Table.Body
                  data={bookingOrders}
                  render={(order) => (
                    <Table.Row key={order.id}>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          color: "var(--color-grey-500)",
                        }}
                      >
                        {format(new Date(order.orderTime), "MMM dd, HH:mm")}
                      </div>
                      <div style={{ fontSize: "1.3rem" }}>
                        {order.order_items
                          .map(
                            (item) =>
                              `${item.quantity}x ${item.menu_items.name}`,
                          )
                          .join(", ")}
                      </div>
                      <div style={{ textAlign: "right", fontWeight: 500 }}>
                        {formatCurrency(order.totalPrice)}
                      </div>
                    </Table.Row>
                  )}
                />
              </StyledReceiptTable>
            </DesktopReceiptTable>

            <ReceiptItemList>
              {bookingOrders.map((order) => (
                <ReceiptItem key={order.id}>
                  <ItemMain>
                    <span className="name">
                      {order.order_items
                        .map(
                          (item) => `${item.quantity}x ${item.menu_items.name}`,
                        )
                        .join(", ")}
                    </span>
                    <span className="price">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </ItemMain>
                  <ItemSub>
                    <span>
                      {format(new Date(order.orderTime), "MMM dd, HH:mm")}
                    </span>
                  </ItemSub>
                </ReceiptItem>
              ))}
            </ReceiptItemList>
          </>
        ) : (
          <>
            <DesktopReceiptTable>
              <StyledReceiptTable columns="2fr 1fr 1fr">
                <Table.Header>
                  <div>Description</div>
                  <div>Nights</div>
                  <div style={{ textAlign: "right" }}>Amount</div>
                </Table.Header>

                <Table.Body
                  data={[
                    {
                      id: "accommodation",
                      label: "Accommodation",
                      description: `${booking.accommodation.name} (${numNights} nights)`,
                      quantity: numNights,
                      amount: accommodationPrice,
                    },
                    ...(hasBreakfast
                      ? [
                          {
                            id: "breakfast",
                            label: "Breakfast",
                            description: `Breakfast for ${numGuests} guests over ${numNights} nights`,
                            quantity: numNights,
                            amount: extrasPrice,
                          },
                        ]
                      : []),
                  ]}
                  render={(row) => (
                    <Table.Row key={row.id}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{row.label}</div>
                        <div
                          style={{
                            fontSize: "1.2rem",
                            color: "var(--color-grey-500)",
                          }}
                        >
                          {row.description}
                        </div>
                      </div>
                      <div>{row.quantity}</div>
                      <div style={{ textAlign: "right", fontWeight: 500 }}>
                        {formatCurrency(row.amount)}
                      </div>
                    </Table.Row>
                  )}
                />
              </StyledReceiptTable>
            </DesktopReceiptTable>

            <ReceiptItemList>
              <ReceiptItem>
                <ItemMain>
                  <span className="name">Accommodation</span>
                  <span className="price">
                    {formatCurrency(accommodationPrice)}
                  </span>
                </ItemMain>
                <ItemSub>
                  <span>{booking.accommodation.name}</span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <span>{numNights} nights</span>
                    <span style={{ fontSize: "1rem", opacity: 0.8 }}>
                      {format(new Date(booking.startDate), "MMM dd")} -{" "}
                      {format(new Date(booking.endDate), "MMM dd")}
                    </span>
                  </div>
                </ItemSub>
              </ReceiptItem>

              {hasBreakfast && (
                <ReceiptItem>
                  <ItemMain>
                    <span className="name">Breakfast</span>
                    <span className="price">{formatCurrency(extrasPrice)}</span>
                  </ItemMain>
                  <ItemSub>
                    <span>
                      {numGuests} guests across {numNights} nights
                    </span>
                  </ItemSub>
                </ReceiptItem>
              )}
            </ReceiptItemList>
          </>
        )}

        <TotalSection>
          <TotalBox>
            <span>
              {receiptType === "stay"
                ? "Total Stay Amount"
                : "Total Orders Amount"}
            </span>
            <span>
              {formatCurrency(
                receiptType === "stay" ? bookingTotalPrice : grandTotal,
              )}
            </span>
          </TotalBox>
        </TotalSection>

        {receiptType === "stay" && isPaid && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: "flex-end", padding: "0 2.4rem" }}>
            <div style={{ fontSize: "1.4rem", color: "var(--color-grey-500)", display: "flex", gap: "2rem" }}>
              <span>Payment Type:</span>
              <span style={{ fontWeight: 600, color: "var(--color-grey-700)" }}>
                {paymentType === "advance" ? "Advance Payment" : "Full Payment"}
              </span>
            </div>
            <div style={{ fontSize: "1.4rem", color: "var(--color-grey-500)", display: "flex", gap: "2rem" }}>
              <span>Amount Paid:</span>
              <span style={{ fontWeight: 700, color: "var(--color-green-700)" }}>
                {formatCurrency(amountPaid || 0)}
              </span>
            </div>
            {paymentType === "advance" && (
              <div style={{ fontSize: "1.4rem", color: "var(--color-grey-500)", display: "flex", gap: "2rem" }}>
                <span>Balance Due:</span>
                <span style={{ fontWeight: 700, color: "var(--color-red-700)" }}>
                  {formatCurrency(remainingAmount || 0)}
                </span>
              </div>
            )}
          </div>
        )}

        <ReceiptFooter>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            <p style={{ fontSize: "1.2rem", color: "var(--color-grey-400)" }}>
              Thank you for choosing The Retreat Cottage!
            </p>
            <WebsiteLink
              href="https://www.retreatcottage.in/"
              target="_blank"
              rel="noreferrer"
            >
              www.retreatcottage.in
            </WebsiteLink>
          </div>

          <SignatureBox>
            <img
              src="/validation.png"
              alt="Authorized Signature"
              width="122"
              height="60"
              loading="lazy"
            />
            <span>Authorized Signatory</span>
          </SignatureBox>
        </ReceiptFooter>
      </StyledReceipt>
    </>
  );
}

export default BookingReceipt;
