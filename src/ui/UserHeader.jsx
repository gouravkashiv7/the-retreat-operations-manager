import styled from "styled-components";
import Heading from "./Heading";

const SimpleHeader = styled.header`
  background-color: var(--color-grey-0);
  border-left: 4px solid var(--color-brand-500);
  padding: 2.4rem 3.2rem;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  margin-bottom: 2.4rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const HeaderDescription = styled.p`
  font-size: 1.6rem;
  color: var(--color-grey-600);
  margin-top: 0.8rem;
  line-height: 1.5;
`;

function UserHeader({ title = "User Management", subtitle }) {
  return (
    <SimpleHeader>
      <Heading as="h1">{title}</Heading>
      {subtitle && <HeaderDescription>{subtitle}</HeaderDescription>}
    </SimpleHeader>
  );
}

export default UserHeader;
