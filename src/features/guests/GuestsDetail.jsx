import { useState } from "react";
import { useAllBookings, useGuests, useSearchGuests } from "./useGuests";
import GuestTable from "./GuestTable";
import SearchBar from "../../ui/SearchBar";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import Modal from "../../ui/Modal";
import GuestForm from "./GuestForm";
import {
  PageLayout,
  Header,
  Title,
  Controls,
  Stats,
  StatCard,
  StatNumber,
  StatLabel,
} from "./GuestsDetail.styles";

function GuestsDetail() {
  const { data: guests, isLoading, error } = useGuests();
  const { data: allBookings } = useAllBookings();
  const searchGuestsMutation = useSearchGuests();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchGuestsMutation.mutate(query);
    }
  };

  const displayGuests =
    searchQuery.trim() && searchGuestsMutation.data
      ? searchGuestsMutation.data
      : searchQuery.trim()
      ? guests?.filter(
          (guest) =>
            guest.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.nationalId
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            guest.id?.toString().includes(searchQuery)
        ) || []
      : guests;

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <PageLayout>
      <Header>
        <Title>Guests Management</Title>
        <Controls>
          <SearchBar
            placeholder="Search guests by name, email, or ID..."
            value={searchQuery}
            onChange={handleSearch}
            isLoading={searchGuestsMutation.isLoading}
          />

          <Modal>
            <Modal.Open opens="add-guest">
              <Button $size="small">Add New Guest</Button>
            </Modal.Open>

            <Modal.Window name="add-guest" title="Add New Guest">
              <GuestForm />
            </Modal.Window>
          </Modal>
        </Controls>
      </Header>

      <Stats>
        <StatCard>
          <StatNumber>{guests?.length || 0}</StatNumber>
          <StatLabel>Total Guests</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>
            {guests?.filter((guest) => guest.email).length || 0}
          </StatNumber>
          <StatLabel>With Email ID</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>
            {guests?.filter((guest) => guest.phone).length || 0}
          </StatNumber>
          <StatLabel>With Phone Number</StatLabel>
        </StatCard>
      </Stats>

      {displayGuests?.length === 0 ? (
        <Empty
          message={
            searchQuery
              ? `No guests found for "${searchQuery}"`
              : "No guests found. Add your first guest to get started."
          }
        />
      ) : (
        <GuestTable guests={displayGuests || []} allBookings={allBookings} />
      )}
    </PageLayout>
  );
}

export default GuestsDetail;
