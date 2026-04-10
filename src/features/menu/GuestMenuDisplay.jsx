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

const MenuContainer = styled.div`
  max-width: 90rem;
  margin: 0 auto;
  background-color: #f7f3e9; /* Light parchment color */
  padding: 4rem;
  box-shadow: var(--shadow-lg);
  border-radius: var(--border-radius-lg);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 0 1.2rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  border-bottom: 2px solid #5d4037;
  padding-bottom: 2rem;
`;

const Logo = styled.div`
  font-family: "Sono", sans-serif;
  font-size: 3.6rem;
  font-weight: 700;
  color: #5d4037;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const SubLogo = styled.div`
  font-size: 1.4rem;
  color: #8d6e63;
  margin-top: 0.5rem;
`;

const CategorySection = styled.section`
  margin-bottom: 2rem;
  padding: 1rem 0;
`;

const CategoryTitle = styled.h2`
  font-size: 2.4rem;
  color: #fff;
  background-color: #333;
  padding: 0.8rem 2rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
`;

const MenuList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 4rem;
  row-gap: 2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MenuItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px dotted #ccc;
  padding-bottom: 0.5rem;
`;

const ItemName = styled.span`
  font-weight: 600;
  font-size: 1.6rem;
  color: #333;
`;

const ItemPrice = styled.span`
  font-family: "Sono";
  font-weight: 700;
  font-size: 1.6rem;
  color: #5d4037;
`;

const Footer = styled.footer`
  margin-top: 0;
  border-top: 2px solid #5d4037;
  padding-top: 4rem;
  padding-bottom: 3rem;
  text-align: center;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.4rem;
  margin-bottom: 2rem;
`;

const SocialIcon = styled.a`
  font-size: 2.4rem;
  color: #5d4037;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
    color: #8d6e63;
  }
`;

const LogoImage = styled.img`
  height: 8rem;
  margin-bottom: 1rem;
`;

const OrderingHours = styled.div`
  background-color: transparent;
  border: 2px solid #5d4037;
  padding: 1.5rem 2.5rem;
  display: inline-block;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: #5d4037;
  }

  p {
    font-size: 2.2rem;
    font-weight: 800;
    color: #d32f2f;
  }
`;

const DownloadBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

function GuestMenuDisplay() {
  const menuRef = useRef();
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
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12; // Base margin
      const contentWidth = pdfWidth - 2 * margin;

      // Helper function for full-page background
      const drawBackground = (doc) => {
        doc.setFillColor(247, 243, 233); // #f7f3e9
        doc.rect(0, 0, pdfWidth, pageHeight, "F");
      };

      const container = menuRef.current;
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
      const minPaddingPerItem = 10; // Reserve at least this much for gaps/margins per item

      capturedItems.forEach((item) => {
        const potentialCount = currentPage.length + 1;
        // Total height = sum of images + (N+1) gaps of at least 5mm
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

      // 3) Draw Pages with Equal Distribution (Top, Between, Bottom)
      pages.forEach((pageItems, index) => {
        if (index > 0) pdf.addPage();
        drawBackground(pdf);

        const totalImgsHeight = pageItems.reduce(
          (sum, item) => sum + item.imgHeight,
          0,
        );
        // Total gaps = N + 1 (Top, between-1, between-2... Bottom)
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
    <>
      <DownloadBtnContainer>
        <Button
          size="large"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
        >
          <HiArrowDownTray />{" "}
          {isGenerating ? "Generating PDF..." : "Download Full Menu PDF"}
        </Button>
      </DownloadBtnContainer>

      <MenuContainer ref={menuRef}>
        <Header>
          <LogoImage
            crossOrigin="anonymous"
            src="/logo-light.png"
            alt="The Retreat Cottage Logo"
          />
          <Logo>The Retreat Cottage</Logo>
          <SubLogo>EST. 2022 | VEGETARIAN</SubLogo>
          <div
            style={{
              marginTop: "1rem",
              fontSize: "3.2rem",
              fontWeight: "900",
              color: "#5d4037",
            }}
          >
            MENU
          </div>
        </Header>

        {categories.map((category) => (
          <CategorySection key={category}>
            <CategoryTitle>{category}</CategoryTitle>
            <MenuList>
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuItem key={item.id}>
                    <ItemName>{item.name}</ItemName>
                    <ItemPrice>{formatCurrency(item.price)}</ItemPrice>
                  </MenuItem>
                ))}
            </MenuList>
          </CategorySection>
        ))}

        <Footer>
          <OrderingHours>
            <h3>Ordering Hours:</h3>
            <p>8AM - 9PM</p>
          </OrderingHours>

          <div style={{ marginTop: "3rem" }}>
            <SocialLinks>
              <SocialIcon
                href="https://www.facebook.com/profile.php?id=100090663166042"
                target="_blank"
              >
                <FaFacebook />
              </SocialIcon>
              <SocialIcon
                href="https://www.youtube.com/@theretreatcottage"
                target="_blank"
              >
                <FaYoutube />
              </SocialIcon>
              <SocialIcon
                href="https://www.instagram.com/theretreatcottage_"
                target="_blank"
              >
                <FaInstagram />
              </SocialIcon>
              <SocialIcon href="https://retreatcottage.in" target="_blank">
                <FaGlobe />
              </SocialIcon>
            </SocialLinks>
            <div style={{ color: "#5d4037", fontWeight: "600" }}>
              www.retreatcottage.in
            </div>
          </div>
        </Footer>
      </MenuContainer>
    </>
  );
}

export default GuestMenuDisplay;
