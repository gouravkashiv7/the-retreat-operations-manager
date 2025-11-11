import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineHome,
  HiOutlineCalendarDateRange,
  HiOutlineUsers,
  HiOutlineCog8Tooth,
  HiOutlineHomeModern,
  HiOutlineClipboardDocumentList,
  HiOutlineUserGroup,
  HiOutlineIdentification,
} from "react-icons/hi2";
import { MdOutlineCottage } from "react-icons/md";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  /* This works because react-router places the active class on the active NavLink */
  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }

  @media (max-width: 480px) {
    &:link,
    &:visited {
      font-size: 1.5rem;
      padding: 1rem 1.6rem;
      gap: 1rem;
    }

    & svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;

function MainNav({ onItemClick }) {
  const location = useLocation();

  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink
            to="/dashboard"
            onClick={onItemClick}
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            <HiOutlineHome />
            <span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="/guests"
            onClick={onItemClick}
            className={location.pathname === "/guests" ? "active" : ""}
          >
            <HiOutlineUserGroup />
            <span>Guests</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="/bookings"
            onClick={onItemClick}
            className={location.pathname === "/bookings" ? "active" : ""}
          >
            <HiOutlineCalendarDateRange />
            <span>Bookings</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="/rooms"
            onClick={onItemClick}
            className={location.pathname.startsWith("/rooms") ? "active" : ""}
          >
            <HiOutlineHomeModern />
            <span>Rooms</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="/cabins"
            onClick={onItemClick}
            className={location.pathname.startsWith("/cabins") ? "active" : ""}
          >
            <MdOutlineCottage />
            <span>Cabins</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="/menu"
            onClick={onItemClick}
            className={location.pathname.startsWith("/menu") ? "active" : ""}
          >
            <HiOutlineClipboardDocumentList />
            <span>Menu</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="/users"
            onClick={onItemClick}
            className={location.pathname.startsWith("/users") ? "active" : ""}
          >
            <HiOutlineIdentification />
            <span>Users</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="/settings"
            onClick={onItemClick}
            className={
              location.pathname.startsWith("/settings") ? "active" : ""
            }
          >
            <HiOutlineCog8Tooth />
            <span>Settings</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
