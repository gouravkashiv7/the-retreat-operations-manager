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
