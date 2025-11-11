// components/guests/GuestTable.jsx
import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import GuestForm from "./GuestForm";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteGuest } from "./useGuests";
import {
  Table,
  TableHeader,
  TableRow,
  Cell,
  MobileLabel,
  Name,
  Email,
  Detail,
  GuestId,
  BookingId,
  BookingContainer,
  ActionsContainer,
} from "./GuestTable.styles";

function GuestTable({ guests, allBookings: bookingsData }) {
  const deleteGuestMutation = useDeleteGuest();
  console.log(bookingsData);
  const getGuestBookings = (guestId) => {
    return bookingsData?.filter((booking) => booking.guestId === guestId) || [];
  };

  return (
    <Table>
      <TableHeader>
        <div>ID</div>
        <div>Guest Name</div>
        <div>Contact</div>
        <div>National ID</div>
        <div>Bookings</div>
        <div>Actions</div>
      </TableHeader>

      {guests.map((guest) => {
        const guestBookings = getGuestBookings(guest.id);

        return (
          <TableRow key={guest.id}>
            {/* Guest ID - Takes less space */}
            <Cell className="id">
              <MobileLabel>ID:</MobileLabel>
              <GuestId>#{guest.id}</GuestId>
            </Cell>

            {/* Guest Name */}
            <Cell className="name">
              <MobileLabel>Name:</MobileLabel>
              <Name>{guest.fullName}</Name>
            </Cell>

            {/* Contact Info */}
            <Cell className="email">
              <MobileLabel>Contact:</MobileLabel>
              <Email>{guest.email}</Email>
              {guest.phone && (
                <Detail style={{ marginTop: "0.3rem", fontSize: "1.3rem" }}>
                  +{guest.phone}
                </Detail>
              )}
            </Cell>

            {/* National ID */}
            <Cell className="nationalId">
              <MobileLabel>National ID:</MobileLabel>
              <Detail>{guest.idType || ""}</Detail>
              <Detail>{guest.nationalId || "N/A"}</Detail>
            </Cell>

            {/* Bookings */}
            <Cell className="bookings">
              <MobileLabel>Bookings:</MobileLabel>
              <BookingContainer>
                {guestBookings.length > 0 ? (
                  guestBookings.map((booking) => (
                    <BookingId key={booking.id}>BK{booking.id}</BookingId>
                  ))
                ) : (
                  <Detail
                    style={{
                      color: "var(--color-grey-500)",
                      fontStyle: "italic",
                    }}
                  >
                    No bookings
                  </Detail>
                )}
              </BookingContainer>
            </Cell>

            {/* Actions */}
            <Cell className="actions">
              <ActionsContainer>
                <Menus>
                  <Modal>
                    <Menus.Menu>
                      <Menus.Toggle id={guest.id} />
                      <Menus.List id={guest.id}>
                        <Modal.Open opens={`edit-guest-${guest.id}`}>
                          <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                        </Modal.Open>
                        <Modal.Open opens={`delete-guest-${guest.id}`}>
                          <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                        </Modal.Open>
                      </Menus.List>

                      <Modal.Window name={`edit-guest-${guest.id}`}>
                        <GuestForm guest={guest} />
                      </Modal.Window>

                      <Modal.Window name={`delete-guest-${guest.id}`}>
                        <ConfirmDelete
                          resourceName={guest.fullName}
                          onConfirm={() => deleteGuestMutation.mutate(guest.id)}
                          disabled={deleteGuestMutation.isLoading}
                        />
                      </Modal.Window>
                    </Menus.Menu>
                  </Modal>
                </Menus>
              </ActionsContainer>
            </Cell>
          </TableRow>
        );
      })}
    </Table>
  );
}

export default GuestTable;
