/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const MobileContext = createContext();

function MobileProvider({ children }) {
  const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(false);

  const toggleSidebar = () => {
    setShowSidebarOnMobile(!showSidebarOnMobile);
  };

  const closeSidebar = () => {
    setShowSidebarOnMobile(false);
  };

  const value = {
    showSidebarOnMobile,
    toggleSidebar,
    closeSidebar,
  };

  return (
    <MobileContext.Provider value={value}>{children}</MobileContext.Provider>
  );
}

function useMobile() {
  const context = useContext(MobileContext);
  if (context === undefined)
    throw new Error("MobileContext was used outside of MobileProvider.");
  return context;
}

export { MobileProvider, useMobile };
