import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { HiArrowDownTray, HiMagnifyingGlass, HiXMark, HiOutlinePhoto } from "react-icons/hi2";
import { FaFacebook, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useItems } from "../common/useItems";
import { getMenuItems } from "../../services/apiMenu";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";

// Elegant warm linen background for screen
const StyledMenuWrapper = styled.div`
  background-color: #faf9f5;
  min-height: 100vh;
  padding: 4rem 1.6rem;
  color: #2b2b2b;
  font-family: "Poppins", sans-serif;
`;

const MenuContainer = styled.div`
  max-width: 100rem;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 5rem 6rem;
  box-shadow: 0 10px 40px rgba(45, 74, 54, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02);
  border-radius: 2.4rem;
  border: 1px solid rgba(45, 74, 54, 0.06);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
  border-bottom: 1px solid rgba(45, 74, 54, 0.12);
  padding-bottom: 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 9.6rem;
  width: auto;
  margin-bottom: 1.8rem;
  filter: drop-shadow(0 4px 10px rgba(45, 74, 54, 0.08));
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Logo = styled.h1`
  font-size: 3.8rem;
  font-weight: 700;
  color: #1e3f20; /* Deep Emerald */
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const SubLogo = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: #a0522d; /* Terracotta copper */
  margin-top: 0.8rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 1rem;

  &::before,
  &::after {
    content: "";
    display: inline-block;
    width: 1.5rem;
    height: 1px;
    background-color: rgba(160, 82, 45, 0.4);
  }
`;

const TitleTag = styled.div`
  margin-top: 1.6rem;
  font-size: 3rem;
  font-weight: 900;
  color: #1e3f20;
  letter-spacing: 4px;
  position: relative;
  display: inline-block;
  padding: 0.2rem 1.6rem;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 20%;
    right: 20%;
    height: 3px;
    background-color: #1e3f20;
    border-radius: 2px;
  }
`;

// Search Bar Styles
const SearchContainer = styled.div`
  max-width: 50rem;
  margin: 0 auto 3.5rem auto;
  position: relative;
  display: flex;
  align-items: center;
  background: #f7f6f2;
  border: 1px solid rgba(45, 74, 54, 0.1);
  border-radius: 100px;
  padding: 0.4rem 0.6rem 0.4rem 1.8rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.01);

  &:focus-within {
    background: #ffffff;
    border-color: #1e3f20;
    box-shadow: 0 4px 20px rgba(30, 63, 32, 0.08);
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  width: 100%;
  padding: 0.8rem 0;
  font-size: 1.5rem;
  font-family: inherit;
  color: #2b2b2b;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #8d9c8b;
  }
`;

const SearchIcon = styled(HiMagnifyingGlass)`
  color: #2d4a3b;
  font-size: 2.2rem;
  margin-right: 1.2rem;
  flex-shrink: 0;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #8d9c8b;
  font-size: 1.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  margin-right: 0.4rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #2b2b2b;
  }
`;

// Sticky Category Nav Bar
const CategoryNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  padding: 1.2rem 0;
  margin-bottom: 4rem;
  border-bottom: 1px solid rgba(45, 74, 54, 0.08);
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari/Chrome */
  }

  /* Add subtle shadow on scroll */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.01);

  @media (max-width: 768px) {
    margin-left: -2rem;
    margin-right: -2rem;
    padding: 1.2rem 2rem;
  }
`;

const CategoryNavLink = styled.a`
  display: inline-block;
  padding: 0.8rem 1.8rem;
  border-radius: 100px;
  font-size: 1.35rem;
  font-weight: 600;
  color: #2d4a3b;
  background-color: #f4f6f3;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;

  &:hover {
    background-color: #e5eae3;
    color: #1e3f20;
  }

  &.active {
    background-color: #1e3f20;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(30, 63, 32, 0.15);
  }
`;

// Sections and Grid List
const CategorySection = styled.section`
  margin-bottom: 5.5rem;
  scroll-margin-top: 8rem; /* Smooth offset for sticky nav */

  &:last-of-type {
    margin-bottom: 3.5rem;
  }
`;

const CategoryTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e3f20;
  margin-bottom: 2.4rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid rgba(30, 63, 32, 0.08);
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;

  &::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 2.4rem;
    background-color: #1e3f20;
    border-radius: 4px;
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40rem, 1fr));
  column-gap: 3.5rem;
  row-gap: 2.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// Elegant Modern Item Card
const MenuItemCard = styled.div`
  display: flex;
  gap: 2rem;
  background: #ffffff;
  border: 1px solid rgba(45, 74, 54, 0.07);
  padding: 1.8rem;
  border-radius: 1.8rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(45, 74, 54, 0.02);
  align-items: center;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(30, 63, 32, 0.18);
    box-shadow: 0 12px 24px rgba(45, 74, 54, 0.08);
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.4rem;
  }
`;

const ImageContainer = styled.div`
  width: 10.5rem;
  height: 10.5rem;
  border-radius: 1.4rem;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  background-color: #f4f6f3;
  border: 1px solid rgba(0, 0, 0, 0.02);

  @media (max-width: 480px) {
    width: 100%;
    height: 16rem;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${MenuItemCard}:hover & {
    transform: scale(1.08);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8d9c8b;
  background: linear-gradient(135deg, #f4f6f3 0%, #e2ebd9 100%);
  font-size: 2.8rem;
`;

const CardInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.6rem;
`;

const CardHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.2rem;
`;

const ItemName = styled.h3`
  font-size: 1.65rem;
  font-weight: 600;
  color: #2b2b2b;
  margin: 0;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const VegIndicator = styled.span`
  display: inline-block;
  width: 1.4rem;
  height: 1.4rem;
  border: 1px solid #388e3c;
  padding: 1px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: "";
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background-color: #388e3c;
  }
`;

const ItemPrice = styled.span`
  font-family: "Sono", monospace;
  font-weight: 700;
  font-size: 1.55rem;
  color: #bc6c25; /* Muted Terracotta */
  background-color: rgba(188, 108, 37, 0.08);
  padding: 0.2rem 1rem;
  border-radius: 100px;
  white-space: nowrap;
`;

const ItemDescription = styled.p`
  font-size: 1.3rem;
  color: #616e60;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  background: #f7f9f6;
  border-radius: 1.8rem;
  border: 1px dashed rgba(45, 74, 54, 0.15);
  margin-bottom: 4rem;

  p {
    font-size: 1.6rem;
    color: #616e60;
    margin-bottom: 2rem;
  }
`;

// Footer & Social Links
const Footer = styled.footer`
  margin-top: 2rem;
  border-top: 1px solid rgba(45, 74, 54, 0.12);
  padding-top: 4.5rem;
  padding-bottom: 1.5rem;
  text-align: center;
`;

const OrderingHours = styled.div`
  background-color: rgba(211, 47, 47, 0.04);
  border: 1px dashed rgba(211, 47, 47, 0.25);
  padding: 1.4rem 2.8rem;
  border-radius: 1.4rem;
  display: inline-block;
  margin-bottom: 2.5rem;

  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0 0 0.4rem 0;
    color: #616e60;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  p {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    color: #d32f2f;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.4rem;
  margin-bottom: 2rem;
`;

const SocialIcon = styled.a`
  font-size: 2.4rem;
  color: #2d4a3b;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.15);
    color: #1e3f20;
  }
`;

const SocialDomain = styled.div`
  color: #1e3f20;
  font-weight: 600;
  font-size: 1.35rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const DownloadBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3.5rem;
`;

const FloatingDownloadBtn = styled(Button)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #1e3f20;
  border-color: #1e3f20;
  box-shadow: 0 4px 15px rgba(30, 63, 32, 0.12);
  transition: all 0.3s ease;

  &:hover {
    background-color: #2d4a3b;
    border-color: #2d4a3b;
    box-shadow: 0 6px 20px rgba(30, 63, 32, 0.2);
  }
`;

// ============================================
// DEDICATED OFF-SCREEN PRINT STYLES FOR PDF
// ============================================
const PrintContainer = styled.div`
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 900px;
  background-color: #f7f3e9;
  padding: 40px 55px;
  font-family: "Poppins", sans-serif;
  color: #3e2723;
`;

const PrintHeader = styled.header`
  text-align: center;
  margin-bottom: 2.2rem;
  padding-bottom: 1.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  /* Double-line decorative border at the bottom */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 3px;
    border-top: 1px solid #5d4037;
    border-bottom: 1px solid #5d4037;
  }
`;

const PrintLogoImage = styled.img`
  height: 6.5rem;
  margin-bottom: 0.4rem;
`;

const PrintLogo = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #3e2723;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0;
`;

const PrintSubLogo = styled.div`
  font-size: 1.1rem;
  color: #8d6e63;
  margin-top: 0.3rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 1rem;

  /* Small ornamental dashes flanking the text */
  &::before,
  &::after {
    content: "—";
    color: #bcaaa4;
    font-weight: 300;
  }
`;

const PrintTitleTag = styled.div`
  margin-top: 0.6rem;
  font-size: 2.2rem;
  font-weight: 800;
  color: #5d4037;
  letter-spacing: 6px;
  border: 2px solid #5d4037;
  padding: 0.15rem 2rem;
`;

const PrintCategorySection = styled.section`
  margin-bottom: 1.8rem;
  padding: 0.2rem 0;
`;

const PrintCategoryTitle = styled.h2`
  font-size: 1.5rem;
  color: #5d4037;
  padding: 0 0 0.4rem 0;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: block;
  font-weight: 700;
  border-bottom: 1.5px solid #5d4037;
  position: relative;

  /* Small square decorative accent at the left */
  &::before {
    content: "◆";
    font-size: 0.7rem;
    margin-right: 0.8rem;
    color: #8d6e63;
    vertical-align: middle;
  }
`;

const PrintMenuList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 4rem;
  row-gap: 1rem;
  padding: 0;
  margin: 0;
`;

const PrintMenuItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px dotted #bcaaa4;
  padding-bottom: 0.2rem;
`;

const PrintItemName = styled.span`
  font-weight: 500;
  font-size: 1.3rem;
  color: #3e2723;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const PrintVegIndicator = styled.span`
  display: inline-block;
  width: 1.1rem;
  height: 1.1rem;
  border: 1.5px solid #2e7d32;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: "";
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #2e7d32;
  }
`;

const PrintItemPrice = styled.span`
  font-family: "Sono", monospace;
  font-weight: 600;
  font-size: 1.3rem;
  color: #5d4037;
  white-space: nowrap;
`;

const PrintFooter = styled.footer`
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  padding-bottom: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  /* Matching double-line decorative border at the top */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 3px;
    border-top: 1px solid #5d4037;
    border-bottom: 1px solid #5d4037;
  }
`;

const PrintOrderingHours = styled.div`
  background-color: transparent;
  border: 2px solid #5d4037;
  padding: 0.8rem 1.6rem;
  display: inline-block;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.2rem;
    margin: 0 0 0.2rem 0;
    color: #5d4037;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  p {
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0;
    color: #d32f2f;
  }
`;

const PrintSocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 0.6rem;
`;

const PrintSocialIcon = styled.div`
  font-size: 2rem;
  color: #8d6e63;
  display: flex;
  align-items: center;
`;

const PrintSocialDomain = styled.div`
  color: #5d4037;
  font-weight: 600;
  font-size: 1.15rem;
  letter-spacing: 2px;
  text-transform: uppercase;
`;


function GuestMenuDisplay() {
  const menuRef = useRef();
  const printMenuRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const { isLoading, items: menuItems } = useItems("menu", getMenuItems);
  const [searchParams] = useSearchParams();

  // Scroll spy to update active category tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = menuRef.current?.querySelectorAll("section");
      if (!sections) return;

      let currentActive = "";
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top <= 120) {
          currentActive = section.id;
        }
      });
      
      if (currentActive) {
        setActiveTab(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && menuItems?.length > 0 && searchParams.get("download") === "true") {
      handleDownloadPDF();
    }
  }, [isLoading, menuItems, searchParams]);

  if (isLoading) return <Spinner />;
  if (!menuItems?.length) return <Empty resourceName="menu" />;

  const categoryOrder = [
    "Breakfast",
    "Snacks",
    "Soups & Salads",
    "Himachali Cuisine",
    "Lunch / Dinner",
    "Roti, Rice and Dahi",
    "Drinks & Beverages",
    "Desserts",
  ];

  const categories = [...new Set(menuItems.map((item) => item.category))].sort(
    (a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);

      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    },
  );

  // Search filter matching
  const filteredMenuItems = menuItems.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query)
    );
  });

  // Filter categories that have matching items
  const activeCategories = categories.filter((cat) =>
    filteredMenuItems.some((item) => item.category === cat)
  );

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      // Wait a tick for rendering to settle
      await new Promise((r) => setTimeout(r, 100));

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12; // Base margin
      const contentWidth = pdfWidth - 2 * margin;

      // Helper function for full-page background
      const drawBackground = (doc) => {
        doc.setFillColor(247, 243, 233); // #f7f3e9 parchment
        doc.rect(0, 0, pdfWidth, pageHeight, "F");
      };

      // CAPTURING THE DEDICATED PRINT MENU CONTAINER INSTEAD OF THE WEB LAYOUT
      const container = printMenuRef.current;
      const elementsToCapture = [
        container.querySelector("header"),
        ...Array.from(container.querySelectorAll("section")),
        container.querySelector("footer"),
      ].filter(Boolean);

      // 1) Capture all elements
      const capturedItems = await Promise.all(
        elementsToCapture.map(async (el) => {
          const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#f7f3e9",
            logging: false,
            windowWidth: 900,
          });
          const imgData = canvas.toDataURL("image/jpeg", 0.9);
          const imgHeight = (canvas.height * contentWidth) / canvas.width;
          return { imgData, imgHeight };
        }),
      );

      // 2) Page Grouping Logic
      const pages = [];
      let currentPage = [];
      let currentHeight = 0;

      capturedItems.forEach((item) => {
        const potentialCount = currentPage.length + 1;
        if (
          currentHeight + item.imgHeight + (potentialCount + 1) * 5 >
            pageHeight &&
          currentPage.length > 0
        ) {
          pages.push(currentPage);
          currentPage = [];
          currentHeight = 0;
        }
        currentPage.push(item);
        currentHeight += item.imgHeight;
      });
      if (currentPage.length > 0) pages.push(currentPage);

      // 3) Draw Pages with Equal Distribution
      pages.forEach((pageItems, index) => {
        if (index > 0) pdf.addPage();
        drawBackground(pdf);

        const totalImgsHeight = pageItems.reduce(
          (sum, item) => sum + item.imgHeight,
          0,
        );
        const equalGap =
          (pageHeight - totalImgsHeight) / (pageItems.length + 1);

        let y = equalGap;
        pageItems.forEach((item) => {
          pdf.addImage(
            item.imgData,
            "JPEG",
            margin,
            y,
            contentWidth,
            item.imgHeight,
          );
          y += item.imgHeight + equalGap;
        });
      });

      pdf.save("The-Retreat-Cottage-Menu.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <StyledMenuWrapper>
      {/* 1. BUTTON TO EXPORT */}
      <DownloadBtnContainer>
        <FloatingDownloadBtn
          size="large"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
        >
          <HiArrowDownTray style={{ fontSize: "2rem" }} />
          {isGenerating ? "Generating PDF..." : "Download Full Menu PDF"}
        </FloatingDownloadBtn>
      </DownloadBtnContainer>

      {/* 2. GORGEOUS WEB-INTERACTIVE DIGITAL MENU (SHOWN ON SCREEN) */}
      <MenuContainer ref={menuRef}>
        <Header>
          <LogoImage
            crossOrigin="anonymous"
            src="/logo-light.png"
            alt="The Retreat Cottage Logo"
          />
          <Logo>The Retreat Cottage</Logo>
          <SubLogo>EST. 2022 | PURE VEGETARIAN</SubLogo>
          <TitleTag>MENU</TitleTag>
        </Header>

        {/* Live Search Input Bar */}
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search delicious dishes, desserts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <ClearButton onClick={() => setSearchQuery("")} title="Clear Search">
              <HiXMark />
            </ClearButton>
          )}
        </SearchContainer>

        {/* Floating/Sticky Category Navigation Tabs */}
        <CategoryNav>
          {categories.map((category) => {
            const categoryId = category.toLowerCase().replace(/[^a-z0-9]/g, "-");
            const hasMatchingItems = activeCategories.includes(category);
            
            if (!hasMatchingItems) return null;

            return (
              <CategoryNavLink
                key={category}
                href={`#${categoryId}`}
                className={activeTab === categoryId ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(categoryId)?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setActiveTab(categoryId);
                }}
              >
                {category}
              </CategoryNavLink>
            );
          })}
        </CategoryNav>

        {/* No Results found view */}
        {activeCategories.length === 0 && (
          <NoResults>
            <p>No dishes found matching your search "{searchQuery}"</p>
            <Button variation="secondary" onClick={() => setSearchQuery("")}>
              View Full Menu
            </Button>
          </NoResults>
        )}

        {/* Category Sections containing Cards Grid */}
        {categories.map((category) => {
          const categoryId = category.toLowerCase().replace(/[^a-z0-9]/g, "-");
          const itemsInSection = filteredMenuItems.filter(
            (item) => item.category === category
          );

          if (itemsInSection.length === 0) return null;

          return (
            <CategorySection key={category} id={categoryId}>
              <CategoryTitle>{category}</CategoryTitle>
              <MenuGrid>
                {itemsInSection.map((item) => (
                  <MenuItemCard key={item.id}>
                    <ImageContainer>
                      {item.image ? (
                        <CardImage
                          src={item.image}
                          alt={item.name}
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <ImagePlaceholder>
                          <HiOutlinePhoto />
                        </ImagePlaceholder>
                      )}
                    </ImageContainer>
                    <CardInfo>
                      <CardHeaderRow>
                        <ItemName>
                          <VegIndicator title="Pure Vegetarian" />
                          {item.name}
                        </ItemName>
                        <ItemPrice>{formatCurrency(item.price)}</ItemPrice>
                      </CardHeaderRow>
                      {item.description && (
                        <ItemDescription title={item.description}>
                          {item.description}
                        </ItemDescription>
                      )}
                    </CardInfo>
                  </MenuItemCard>
                ))}
              </MenuGrid>
            </CategorySection>
          );
        })}

        <Footer>
          <OrderingHours>
            <h3>Ordering Hours</h3>
            <p>8AM - 9PM</p>
          </OrderingHours>

          <div style={{ marginTop: "2rem" }}>
            <SocialLinks>
              <SocialIcon
                href="https://www.facebook.com/profile.php?id=100090663166042"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook />
              </SocialIcon>
              <SocialIcon
                href="https://www.youtube.com/@theretreatcottage"
                target="_blank"
                rel="noreferrer"
              >
                <FaYoutube />
              </SocialIcon>
              <SocialIcon
                href="https://www.instagram.com/theretreatcottage_"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
              </SocialIcon>
              <SocialIcon 
                href="https://retreatcottage.in" 
                target="_blank"
                rel="noreferrer"
              >
                <FaGlobe />
              </SocialIcon>
            </SocialLinks>
            <SocialDomain>www.retreatcottage.in</SocialDomain>
          </div>
        </Footer>
      </MenuContainer>

      {/* ======================================================== */}
      {/* 3. DEDICATED OFF-SCREEN PRINT OPTIMIZED TEMPLATE FOR PDF */}
      {/* ======================================================== */}
      <PrintContainer ref={printMenuRef}>
        <PrintHeader>
          <PrintLogoImage
            crossOrigin="anonymous"
            src="/logo-light.png"
            alt="The Retreat Cottage Logo"
          />
          <PrintLogo>The Retreat Cottage</PrintLogo>
          <PrintSubLogo>EST. 2022 | PURE VEGETARIAN</PrintSubLogo>
          <PrintTitleTag>MENU</PrintTitleTag>
          <div style={{ marginTop: "0.5rem", fontSize: "1.15rem", color: "#8d6e63", letterSpacing: "1.5px", fontWeight: "600" }}>
            ORDERING HOURS: 8AM - 9PM
          </div>
        </PrintHeader>

        {/* Categories inside the Print PDF (Always renders all categories and items) */}
        {categories.map((category) => {
          const itemsInSection = menuItems.filter(
            (item) => item.category === category
          );

          if (itemsInSection.length === 0) return null;

          return (
            <PrintCategorySection key={category}>
              <PrintCategoryTitle>{category}</PrintCategoryTitle>
              <PrintMenuList>
                {itemsInSection.map((item) => (
                  <PrintMenuItem key={item.id}>
                    <PrintItemName>
                      <PrintVegIndicator />
                      {item.name}
                    </PrintItemName>
                    <PrintItemPrice>{formatCurrency(item.price)}</PrintItemPrice>
                  </PrintMenuItem>
                ))}
              </PrintMenuList>
            </PrintCategorySection>
          );
        })}

        <PrintFooter>
          <div style={{ marginTop: "0.5rem" }}>
            <PrintSocialLinks>
              <PrintSocialIcon><FaFacebook /></PrintSocialIcon>
              <PrintSocialIcon><FaYoutube /></PrintSocialIcon>
              <PrintSocialIcon><FaInstagram /></PrintSocialIcon>
              <PrintSocialIcon><FaGlobe /></PrintSocialIcon>
            </PrintSocialLinks>
            <PrintSocialDomain>www.retreatcottage.in</PrintSocialDomain>
          </div>
        </PrintFooter>
      </PrintContainer>
    </StyledMenuWrapper>
  );
}

export default GuestMenuDisplay;
