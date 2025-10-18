import styled from "styled-components";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import TodayItem from "./TodayItem";
import { useTodayActivity } from "./useTodayActivity";
import Spinner from "../../ui/Spinner";

const StyledToday = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / span 2;
  padding-top: 2.4rem;

  /* Tablet */
  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    padding: 2.4rem;
    gap: 1.8rem;
  }

  /* Mobile - Fix overflow issues */
  @media (max-width: 768px) {
    padding: 1.6rem;
    gap: 1.2rem;
    border-radius: var(--border-radius-sm);
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden; /* Prevent content overflow */
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1.2rem;
    gap: 1rem;
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-sm);
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    padding: 1rem;
    gap: 0.8rem;
  }
`;

const TodayList = styled.ul`
  overflow: auto;
  overflow-x: hidden;
  width: 100%;

  /* Removing scrollbars for webkit, firefox, and ms, respectively */
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;

  /* Mobile - Ensure full width and proper item display */
  @media (max-width: 768px) {
    max-height: 25rem;

    /* Ensure TodayItem components take full width */
    & li {
      width: 100%;
      margin: 0;
      padding: 0;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    max-height: 22rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    max-height: 20rem;
  }
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
  width: 100%;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-top: 0.4rem;
    padding: 0 1rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-top: 0.2rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.2rem;
    margin-top: 0;
  }
`;

const CompactHeading = styled(Heading)`
  width: 100%;

  /* Mobile - Smaller heading */
  @media (max-width: 768px) {
    font-size: 1.6rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.3rem;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* Mobile - Center content and prevent overflow */
  @media (max-width: 768px) {
    & > * {
      width: 100%;
      max-width: 100%;
    }
  }
`;

// Mobile-optimized Row component
const MobileRow = styled(Row)`
  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;

    /* Remove any gaps that might cause spacing issues */
    gap: 0;
  }
`;

function TodayActivity() {
  const { isLoading, activeBookings } = useTodayActivity();

  return (
    <StyledToday>
      <MobileRow type="horizontal">
        <CompactHeading as="h2">Today</CompactHeading>
      </MobileRow>

      <ContentWrapper>
        {!isLoading ? (
          activeBookings?.length ? (
            <TodayList>
              {activeBookings.map((activity) => (
                <TodayItem
                  activity={activity}
                  key={activity.id}
                  // Ensure TodayItem knows it's in mobile context
                  $isMobile={true}
                />
              ))}
            </TodayList>
          ) : (
            <NoActivity>No activity today...</NoActivity>
          )
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem 0",
            }}
          >
            <Spinner />
          </div>
        )}
      </ContentWrapper>
    </StyledToday>
  );
}

export default TodayActivity;
