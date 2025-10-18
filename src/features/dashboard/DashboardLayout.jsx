import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import Stats from "./Stats";
import { useRecentStays } from "./useRecentStays";
import { useRecentBookings } from "./useRecentBookings";
import { useAccommodationStats } from "../../hooks/useAccomodationStats";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;

  /* Large Tablet */
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto 30rem auto;
    gap: 2.2rem;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto 30rem auto;
    gap: 2rem;
  }

  /* Mobile Layout (768px and below) */
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr; /* 2 columns for stats */
    grid-template-rows: auto auto auto auto auto; /* 5 rows total */
    gap: 1.6rem;

    /* Stats will be distributed across first 2 rows in 2x2 grid */
    & > *:nth-child(1) {
      grid-column: 1;
      grid-row: 1;
    } /* Booking */
    & > *:nth-child(2) {
      grid-column: 2;
      grid-row: 1;
    } /* Sales */
    & > *:nth-child(3) {
      grid-column: 1;
      grid-row: 2;
    } /* Check-ins */
    & > *:nth-child(4) {
      grid-column: 2;
      grid-row: 2;
    } /* Occupancy */

    /* TodayActivity - third row */
    & > *:nth-child(5) {
      grid-column: 1 / -1;
      grid-row: 3;
    }

    /* DurationChart - fourth row */
    & > *:nth-child(6) {
      grid-column: 1 / -1;
      grid-row: 4;
    }

    /* SalesChart - fifth row */
    & > *:nth-child(7) {
      grid-column: 1 / -1;
      grid-row: 5;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    gap: 1.2rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    gap: 1rem;
  }
`;

function DashboardLayout() {
  const { isLoadingStays: isLoading2, confirmedStays } = useRecentStays();
  const { isLoading: isLoading1, bookings, numDays } = useRecentBookings();
  const { totalAccommodation, isLoading: isLoading3 } = useAccommodationStats();

  if (isLoading1 || isLoading2 || isLoading3) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numDays={numDays}
        totalAccommodation={totalAccommodation}
      />
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart bookings={bookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
