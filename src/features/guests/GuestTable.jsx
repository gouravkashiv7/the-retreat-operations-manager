import { Link } from "react-router-dom";
import { HiPencil, HiOutlineIdentification, HiEye } from "react-icons/hi2";
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
  IdGallery,
  IdImageContainer
} from "./GuestTable.styles";

function GuestIdPreview({ guest }) {
  const hasFront = guest.guestIDCard && guest.guestIDCard.trim() !== "";
  const hasBack = guest.guestIDCardBack && guest.guestIDCardBack.trim() !== "";

  if (!hasFront && !hasBack) return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <HiOutlineIdentification size={48} style={{ color: "var(--color-grey-300)", marginBottom: "1rem" }} />
      <Detail>No ID documents have been uploaded for this guest yet.</Detail>
    </div>
  );

  return (
    <IdGallery>
      {hasFront && (
        <IdImageContainer>
          <span>Front Side</span>
          <img src={guest.guestIDCard} alt={`${guest.fullName} - Front ID`} />
        </IdImageContainer>
      )}
      {hasBack && (
        <IdImageContainer>
          <span>Back Side</span>
          <img src={guest.guestIDCardBack} alt={`${guest.fullName} - Back ID`} />
        </IdImageContainer>
      )}
    </IdGallery>
  );
}

function GuestTable({ guests, allBookings: bookingsData }) {
  const getGuestBookings = (guestId) =>
    bookingsData?.filter((b) => b.guestId === guestId) || [];

  return (
    <>
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
            const hasId = Boolean(guest.guestIDCard?.trim() || guest.guestIDCardBack?.trim());

            return (
              <TableRow key={guest.id}>
                <GuestId>#{guest.id}</GuestId>

                <div>
                  <Name>{guest.fullName}</Name>
                </div>

                <div>
                  <Email>{guest.email || "No email"}</Email>
                  {guest.phone && (
                    <Detail style={{ fontSize: "1.2rem", marginTop: "0.2rem" }}>
                      +{guest.phone}
                    </Detail>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div>
                    <Detail style={{ fontWeight: "600" }}>{guest.idType || "—"}</Detail>
                    <Detail>{guest.nationalId || "N/A"}</Detail>
                  </div>
                  
                  {hasId && (
                    <Modal>
                      <Modal.Open opens={`view-id-${guest.id}`}>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            color: "var(--color-brand-600)",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            background: "none",
                            border: "none",
                            padding: "4px 0",
                            cursor: "pointer",
                            textDecoration: "underline"
                          }}
                        >
                          <HiOutlineIdentification size={16} /> View ID Docs
                        </button>
                      </Modal.Open>
                      <Modal.Window name={`view-id-${guest.id}`}>
                        <GuestIdPreview guest={guest} />
                      </Modal.Window>
                    </Modal>
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
                    <Detail style={{ color: "var(--color-grey-400)", fontStyle: "italic" }}>None</Detail>
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
                        
                        <Modal.Open opens={`view-id-menu-${guest.id}`}>
                          <Menus.Button icon={<HiEye />}>View ID</Menus.Button>
                        </Modal.Open>
                      </Menus.List>

                      <Modal.Window name={`edit-guest-${guest.id}`}>
                        <GuestForm guest={guest} />
                      </Modal.Window>
                      
                      <Modal.Window name={`view-id-menu-${guest.id}`}>
                        <GuestIdPreview guest={guest} />
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
          const hasId = Boolean(guest.guestIDCard?.trim() || guest.guestIDCardBack?.trim());

          return (
            <GuestCard key={guest.id}>
              <GuestCardHeader>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <GuestCardName>{guest.fullName}</GuestCardName>
                  {guest.email && <GuestCardEmail>{guest.email}</GuestCardEmail>}
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
                  <div className="value">
                    <Detail style={{ fontWeight: "600", fontSize: "1.4rem" }}>{guest.idType || "N/A"}</Detail>
                    <Detail>{guest.nationalId || "—"}</Detail>
                    
                    {hasId && (
                      <Modal>
                        <Modal.Open opens={`view-id-mob-${guest.id}`}>
                          <button
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.6rem",
                              color: "var(--color-brand-600)",
                              fontSize: "1.3rem",
                              fontWeight: "600",
                              background: "none",
                              border: "none",
                              padding: "6px 0",
                              cursor: "pointer",
                              textDecoration: "underline"
                            }}
                          >
                            <HiOutlineIdentification size={18} /> View Docs
                          </button>
                        </Modal.Open>
                        <Modal.Window name={`view-id-mob-${guest.id}`}>
                          <GuestIdPreview guest={guest} />
                        </Modal.Window>
                      </Modal>
                    )}
                  </div>
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
                      <span style={{ fontSize: "1.3rem", color: "var(--color-grey-400)", fontStyle: "italic" }}>No bookings yet</span>
                    )}
                  </BookingBadges>
                </GuestCardField>
              </GuestCardGrid>

              <GuestCardFooter>
                <span />
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Modal>
                    <Modal.Open opens={`view-id-card-mob-${guest.id}`}>
                      <Button $size="small" $variation="secondary">
                        <HiEye style={{ marginRight: "0.4rem" }} /> ID Docs
                      </Button>
                    </Modal.Open>
                    <Modal.Window name={`view-id-card-mob-${guest.id}`}>
                      <GuestIdPreview guest={guest} />
                    </Modal.Window>
                  </Modal>
                  
                  <Modal>
                    <Modal.Open opens={`edit-guest-mobile-${guest.id}`}>
                      <Button $size="small" $variation="secondary">
                        <HiPencil style={{ marginRight: "0.4rem" }} /> Edit
                      </Button>
                    </Modal.Open>
                    <Modal.Window name={`edit-guest-mobile-${guest.id}`}>
                      <GuestForm guest={guest} />
                    </Modal.Window>
                  </Modal>
                </div>
              </GuestCardFooter>
            </GuestCard>
          );
        })}
      </MobileCardList>
    </>
  );
}

export default GuestTable;
