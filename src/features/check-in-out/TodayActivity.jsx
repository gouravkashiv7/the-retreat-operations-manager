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
    grid-column: 1 / -1; /* Take full width on tablet */
    padding: 2.8rem;
    gap: 2rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 2.4rem;
    gap: 1.6rem;
    border-radius: var(--border-radius-sm);
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 2rem;
    gap: 1.2rem;
    margin: 0 -1rem; /* Use full width on small screens */
    border-left: none;
    border-right: none;
    border-radius: 0;
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

  /* Mobile */
  @media (max-width: 768px) {
    max-height: 30rem; /* Limit height on mobile */
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    max-height: 25rem;
  }
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-top: 0.6rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-top: 0.4rem;
  }
`;

function TodayActivity() {
  const { isLoading, activeBookings } = useTodayActivity();

  return (
    <StyledToday>
      <Row type="horizontal">
        <Heading as="h2">Today</Heading>
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
