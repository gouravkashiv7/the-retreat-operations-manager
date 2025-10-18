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
  height: fit-content;

  /* Tablet */
  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    padding: 2.4rem;
    gap: 1.8rem;
  }

  /* Mobile - Better space utilization */
  @media (max-width: 768px) {
    padding: 1.6rem;
    gap: 1.2rem;
    border-radius: var(--border-radius-sm);
    height: auto;
    min-height: 30rem;
    display: flex;
    flex-direction: column;
  }

  /* Small Mobile - Optimized for small screens */
  @media (max-width: 480px) {
    padding: 1.2rem;
    gap: 1rem;
    margin: 0;
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-sm);
    min-height: 28rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    padding: 1rem;
    gap: 0.8rem;
    min-height: 26rem;
  }
`;

const TodayList = styled.ul`
  overflow: auto;
  overflow-x: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  /* Removing scrollbars for webkit, firefox, and ms, respectively */
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;

  /* Mobile - Use available height */
  @media (max-width: 768px) {
    max-height: none;
    min-height: 20rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    min-height: 18rem;
    gap: 0.6rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    min-height: 16rem;
    gap: 0.5rem;
  }
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20rem;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-top: 0;
    min-height: 18rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.3rem;
    min-height: 16rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.2rem;
    min-height: 14rem;
  }
`;

const CompactHeading = styled(Heading)`
  margin-bottom: 0;

  /* Mobile - Smaller heading */
  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    font-size: 1.3rem;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  /* Mobile - Ensure content fills available space */
  @media (max-width: 768px) {
    min-height: 24rem;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    min-height: 22rem;
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    min-height: 20rem;
  }
`;

function TodayActivity() {
  const { isLoading, activeBookings } = useTodayActivity();

  return (
    <StyledToday>
      <Row type="horizontal">
        <CompactHeading as="h2">Today's Activity</CompactHeading>
      </Row>

      <ContentWrapper>
        {!isLoading ? (
          activeBookings?.length ? (
            <TodayList>
              {activeBookings.map((activity) => (
                <TodayItem activity={activity} key={activity.id} />
              ))}
            </TodayList>
          ) : (
            <NoActivity>No check-ins or check-outs today</NoActivity>
          )
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "20rem",
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
