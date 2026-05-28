import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { HiArrowDownTray } from "react-icons/hi2";
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
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: auto;
  width: 100%;
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
  background-color: var(--color-brand-accent-gold, #C69963);
  border-color: var(--color-brand-accent-gold, #C69963);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(198, 153, 99, 0.15);
  transition: all 0.3s ease;

  &:hover {
    background-color: #b5854f;
    border-color: #b5854f;
    box-shadow: 0 6px 20px rgba(198, 153, 99, 0.25);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ============================================
// DEDICATED PRINT STYLES FOR PDF & PREVIEW
// ============================================
const PrintContainer = styled.div`
  width: 900px;
  margin: 0 auto 4rem auto;
  background-color: #f7f3e9;
  padding: 40px 55px;
  font-family: "Poppins", sans-serif;
  color: #3e2723;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  border: 1px solid #e5dfd3;
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
  const printMenuRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const { isLoading, items: menuItems } = useItems("menu", getMenuItems);
  const [searchParams] = useSearchParams();

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

      {/* 2. DEDICATED PRINT OPTIMIZED PREVIEW FOR PDF */}
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

        {/* Categories inside the Print PDF */}
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
