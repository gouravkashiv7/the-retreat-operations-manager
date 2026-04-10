import { Link } from "react-router-dom";
import { HiPencil, HiOutlineIdentification } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import Button from "../../ui/Button";
import GuestForm from "./GuestForm";

import {
  DesktopTable,
  TableHeader,
  TableRow,
  MobileCardList,
  GuestCard,
  GuestCardHeader,
  GuestCardName,
  GuestCardEmail,
  GuestCardIdBadge,
  GuestCardGrid,
  GuestCardField,
  GuestCardFooter,
  BookingBadges,
  Name,
  Email,
  Detail,
  GuestId,
  BookingId,
  BookingContainer,
  ActionsContainer,
} from "./GuestTable.styles";

function GuestTable({ guests, allBookings: bookingsData }) {
  const getGuestBookings = (guestId) =>
    bookingsData?.filter((b) => b.guestId === guestId) || [];

  return (
    <>
      {/* ── Desktop Table ── */}
      <Menus>
        <DesktopTable>
          <TableHeader>
            <div>ID</div>
            <div>Guest Name</div>
            <div>Contact</div>
            <div>National ID</div>
            <div>Bookings</div>
            <div></div>
          </TableHeader>

          {guests.map((guest) => {
            const guestBookings = getGuestBookings(guest.id);
            return (
              <TableRow key={guest.id}>
                <GuestId>#{guest.id}</GuestId>

                <div>
                  <Name>{guest.fullName}</Name>
                </div>

                <div>
                  <Email>{guest.email}</Email>
                  {guest.phone && (
                    <Detail style={{ fontSize: "1.2rem", marginTop: "0.2rem" }}>
                      +{guest.phone}
                    </Detail>
                  )}
                </div>

                <div>
                  <Detail>{guest.idType || "—"}</Detail>
                  <Detail>{guest.nationalId || "N/A"}</Detail>
                  {guest.guestIDCard && (
                    <a
                      href={guest.guestIDCard}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        color: "var(--color-brand-600)",
                        fontSize: "1rem",
                        marginTop: "0.4rem",
                        fontWeight: "600",
                        textDecoration: "underline"
                      }}
                    >
                      <HiOutlineIdentification /> View ID Document
                    </a>
                  )}
                </div>

                <BookingContainer>
                  {guestBookings.length > 0 ? (
                    guestBookings.map((booking) => (
                      <Link key={booking.id} to={`/bookings/${booking.id}`}>
                        <BookingId>BK{booking.id}</BookingId>
                      </Link>
                    ))
                  ) : (
                    <Detail
                      style={{
                        color: "var(--color-grey-400)",
                        fontStyle: "italic",
                      }}
                    >
                      None
                    </Detail>
                  )}
                </BookingContainer>

                <ActionsContainer>
                  <Modal>
                    <Menus.Menu>
                      <Menus.Toggle id={guest.id} />
                      <Menus.List id={guest.id}>
                        <Modal.Open opens={`edit-guest-${guest.id}`}>
                          <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                        </Modal.Open>
                      </Menus.List>
                      <Modal.Window name={`edit-guest-${guest.id}`}>
                        <GuestForm guest={guest} />
                      </Modal.Window>
                    </Menus.Menu>
                  </Modal>
                </ActionsContainer>
              </TableRow>
            );
          })}
        </DesktopTable>
      </Menus>

      {/* ── Mobile Cards ── */}
      <MobileCardList>
        {guests.map((guest) => {
          const guestBookings = getGuestBookings(guest.id);
          return (
            <GuestCard key={guest.id}>
              <GuestCardHeader>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <GuestCardName>{guest.fullName}</GuestCardName>
                  {guest.email && (
                    <GuestCardEmail>{guest.email}</GuestCardEmail>
                  )}
                </div>
                <GuestCardIdBadge>#{guest.id}</GuestCardIdBadge>
              </GuestCardHeader>

              <GuestCardGrid>
                {guest.phone && (
                  <GuestCardField>
                    <span className="label">Phone</span>
                    <span className="value">+{guest.phone}</span>
                  </GuestCardField>
                )}
                <GuestCardField>
                  <span className="label">National ID</span>
                  <span className="value">
                    {guest.idType ? `${guest.idType}: ` : ""}
                    {guest.nationalId || "N/A"}
                    {guest.guestIDCard && (
                      <a
                        href={guest.guestIDCard}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          color: "var(--color-brand-600)",
                          fontSize: "1.1rem",
                          marginTop: "0.4rem",
                          textDecoration: "underline"
                        }}
                      >
                        <HiOutlineIdentification /> View ID
                      </a>
                    )}
                  </span>
                </GuestCardField>
                <GuestCardField style={{ gridColumn: "1 / -1" }}>
                  <span className="label">Bookings</span>
                  <BookingBadges>
                    {guestBookings.length > 0 ? (
                      guestBookings.map((booking) => (
                        <Link key={booking.id} to={`/bookings/${booking.id}`}>
                          <BookingId>BK{booking.id}</BookingId>
                        </Link>
                      ))
                    ) : (
                      <span
                        style={{
                          fontSize: "1.3rem",
                          color: "var(--color-grey-400)",
                          fontStyle: "italic",
                        }}
                      >
                        No bookings yet
                      </span>
                    )}
                  </BookingBadges>
                </GuestCardField>
              </GuestCardGrid>

              <GuestCardFooter>
                <span />
                <Modal>
                  <Modal.Open opens={`edit-guest-mobile-${guest.id}`}>
                    <Button $size="small" $variation="secondary">
                      <HiPencil style={{ marginRight: "0.4rem" }} />
                      Edit
                    </Button>
                  </Modal.Open>
                  <Modal.Window name={`edit-guest-mobile-${guest.id}`}>
                    <GuestForm guest={guest} />
                  </Modal.Window>
                </Modal>
              </GuestCardFooter>
            </GuestCard>
          );
        })}
      </MobileCardList>
    </>
  );
}

export default GuestTable;
