import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useBookings } from "../features/bookings/useBookings";
import Spinner from "../ui/Spinner";
import Table from "../ui/Table";
import Row from "../ui/Row";
import Heading from "../ui/Heading";
import SearchBar from "../ui/SearchBar";
import { useState } from "react";
import Filter from "../ui/Filter";
import TableOperations from "../ui/TableOperations";
import { formatCurrency, getAccommodationName } from "../utils/helpers";
import { HiDocumentText } from "react-icons/hi2";
import Button from "../ui/Button";
import { subDays, isAfter, format } from "date-fns";

const StyledReceipts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const GuestInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 600;
    color: var(--color-grey-700);
  }

  & span:last-child {
    font-size: 1.2rem;
    color: var(--color-grey-500);
  }
`;

const DesktopTableContainer = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;

const MobileCardList = styled.div`
  display: none;
  flex-direction: column;
  gap: 1.6rem;

  @media (max-width: 600px) {
    display: flex;
  }
`;

const MobileCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1.6rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-grey-50);
  padding-bottom: 1rem;

  & span:first-child {
    font-family: "Sono";
    font-weight: 600;
    color: var(--color-brand-600);
    font-size: 1.6rem;
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  & div {
    display: flex;
    justify-content: space-between;
    font-size: 1.4rem;
  }

  & .label {
    color: var(--color-grey-500);
    font-weight: 500;
  }

  & .value {
    color: var(--color-grey-700);
    font-weight: 600;
    text-align: right;
  }
`;

const StyledReceiptsTable = styled(Table)`
  & header,
  & [role="row"] {
    grid-template-columns: 0.8fr 1.5fr 1fr 1fr 1fr 0.5fr;

    @media (max-width: 900px) {
      grid-template-columns: 0.6fr 1.2fr 1fr 0.8fr 0.8fr 0.4fr;
    }

    @media (max-width: 768px) {
      grid-template-columns: 0.8fr 1.5fr 1fr 1fr 0.5fr;
    }

    @media (max-width: 600px) {
      grid-template-columns: 0.4fr 1.6fr 0.4fr;
    }
  }
`;

function Receipts() {
  const { bookings, isLoading } = useBookings();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  const filterDays = searchParams.get("last") || "7";

  // Only show bookings that are checked-in or checked-out, as they are likely to have orders
  // Also exclude admin blocks
  let filteredBookings = bookings.filter(
    (b) =>
      ["checked-in", "checked-out", "confirmed"].includes(b.status) &&
      b.observations !== "ADMIN_BLOCK" &&
      b.guestId !== 1,
  );

  // Date Filter
  if (filterDays !== "all") {
    const days = Number(filterDays);
    const dateLimit = subDays(new Date(), days);
    filteredBookings = filteredBookings.filter((b) =>
      isAfter(new Date(b.startDate), dateLimit),
    );
  }

  // Search Filter
  filteredBookings = filteredBookings.filter((b) => {
    const fullName = b.guests.fullName.toLowerCase();
    const bookingId = String(b.id);
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || bookingId.includes(query);
  });

  return (
    <StyledReceipts>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <span
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--color-brand-600)",
            textTransform: "uppercase",
            letterSpacing: "1.2px",
          }}
        >
          Finance Management
        </span>
        <Row type="horizontal" $stackOnMobile>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <HiDocumentText
              style={{
                width: "3.2rem",
                height: "3.2rem",
                color: "var(--color-brand-600)",
              }}
            />
            <Heading as="h1">Order Receipts</Heading>
          </div>
          <TableOperations>
            <Filter
              filterField="last"
              options={[
                { value: "7", label: "Last 7 days" },
                { value: "30", label: "Last month" },
                { value: "all", label: "All time" },
              ]}
            />
            <SearchBar
              placeholder="Search guest or id..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </TableOperations>
        </Row>
      </div>

      <DesktopTableContainer>
        <StyledReceiptsTable columns="0.8fr 1.5fr 1fr 1fr 1fr 0.5fr">
          <Table.Header>
            <div>ID</div>
            <div>Guest</div>
            <div className="hide-on-tablet">Accommodation</div>
            <div className="hide-on-mobile">Status</div>
            <div className="hide-on-mobile">Amount</div>
            <div></div>
          </Table.Header>

          <Table.Body
            data={filteredBookings}
            render={(booking) => (
              <Table.Row key={booking.id}>
                <div style={{ fontFamily: "Sono", fontWeight: 500 }}>
                  #{booking.id}
                </div>
                <GuestInfo>
                  <span>{booking.guests.fullName}</span>
                  <span className="hide-on-mobile">{booking.guests.email}</span>
                </GuestInfo>
                <div className="hide-on-tablet">
                  <div style={{ fontWeight: 600 }}>
                    {booking.accommodation.name}
                  </div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--color-grey-500)",
                    }}
                  >
                    {format(new Date(booking.startDate), "MMM dd")} &mdash;{" "}
                    {format(new Date(booking.endDate), "MMM dd, yyyy")}
                  </div>
                </div>
                <div className="hide-on-mobile">{booking.status}</div>
                <div className="hide-on-mobile" style={{ fontWeight: 500 }}>
                  {formatCurrency(booking.totalPrice)}
                </div>
                <Button
                  size="small"
                  icon={<HiDocumentText />}
                  onClick={() => navigate(`/receipts/${booking.id}`)}
                />
              </Table.Row>
            )}
          />
        </StyledReceiptsTable>
      </DesktopTableContainer>

      <MobileCardList>
        {filteredBookings.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No receipts found.
          </p>
        ) : (
          filteredBookings.map((booking) => (
            <MobileCard key={booking.id}>
              <CardHeader>
                <span>#{booking.id}</span>
                <Button
                  size="small"
                  icon={<HiDocumentText />}
                  onClick={() => navigate(`/receipts/${booking.id}`)}
                >
                  View Receipt
                </Button>
              </CardHeader>
              <CardBody>
                <div>
                  <span className="label">Guest</span>
                  <span className="value">{booking.guests.fullName}</span>
                </div>
                <div>
                  <span className="label">Accommodation</span>
                  <span className="value">{booking.accommodation.name}</span>
                </div>
                <div>
                  <span className="label">Stay Date</span>
                  <span className="value">
                    {format(new Date(booking.startDate), "MMM dd")} -{" "}
                    {format(new Date(booking.endDate), "MMM dd")}
                  </span>
                </div>
                <div>
                  <span className="label">Status</span>
                  <span
                    className="value"
                    style={{ textTransform: "capitalize" }}
                  >
                    {booking.status.replace("-", " ")}
                  </span>
                </div>
                <div>
                  <span className="label">Amount</span>
                  <span
                    className="value"
                    style={{ color: "var(--color-brand-600)" }}
                  >
                    {formatCurrency(booking.totalPrice)}
                  </span>
                </div>
              </CardBody>
            </MobileCard>
          ))
        )}
      </MobileCardList>
    </StyledReceipts>
  );
}

export default Receipts;
