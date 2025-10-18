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

  /* Mobile - Smaller padding and gaps */
  @media (max-width: 768px) {
    padding: 1.8rem;
    gap: 1.2rem;
    border-radius: var(--border-radius-sm);
  }

  /* Small Mobile - Even more compact */
  @media (max-width: 480px) {
    padding: 1.4rem;
    gap: 1rem;
    margin: 0 -0.8rem;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }

  /* Very Small Mobile - Minimal padding */
  @media (max-width: 360px) {
    padding: 1rem;
    gap: 0.8rem;
    margin: 0 -0.5rem;
  }
`;

const TodayList = styled.ul`
  overflow: scroll;
  overflow-x: hidden;

  /* Removing scrollbars for webkit, firefox, and ms, respectively */
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;

  /* Mobile - Smaller max height */
  @media (max-width: 768px) {
    max-height: 25rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    max-height: 20rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    max-height: 18rem;
  }
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-top: 0.4rem;
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
  /* Mobile - Smaller heading */
  @media (max-width: 768px) {
    font-size: 1.6rem;
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

function TodayActivity() {
  const { isLoading, activeBookings } = useTodayActivity();

  return (
    <StyledToday>
      <Row type="horizontal">
        <CompactHeading as="h2">Today</CompactHeading>
      </Row>
      {!isLoading ? (
        activeBookings?.length ? (
          <TodayList>
            {activeBookings.map((activity) => (
              <TodayItem activity={activity} key={activity.id} />
            ))}
          </TodayList>
        ) : (
          <NoActivity>No activity today...</NoActivity>
        )
      ) : (
        <Spinner />
      )}
    </StyledToday>
  );
}

export default TodayActivity;
