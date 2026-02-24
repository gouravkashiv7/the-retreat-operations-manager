import styled from "styled-components";

// Helper to get initials
function getInitials(name) {
  if (!name || name.trim() === "") return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

const StyledImg = styled.img`
  display: block;
  width: ${(props) => props.$size || "4rem"};
  height: ${(props) => props.$size || "4rem"};
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

const InitialsFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$size || "4rem"};
  height: ${(props) => props.$size || "4rem"};
  border-radius: 50%;
  background-color: var(--color-brand-100);
  color: var(--color-brand-700);
  font-weight: 600;
  font-size: ${(props) => props.$fontSize || "1.4rem"};
  outline: 2px solid var(--color-grey-100);
  aspect-ratio: 1;
`;

function Avatar({ src, fullName, alt, size = "4rem", fontSize = "1.4rem" }) {
  // If we have an avatar URL and it's not the generic default, display the image
  if (src && src !== "default-user.jpg") {
    // Extract numeric value from size string (e.g., "3.6rem" -> 36 assuming 10px base)
    const numericSize = size.includes("rem")
      ? parseFloat(size) * 10
      : parseInt(size) || 40;

    return (
      <StyledImg
        src={src}
        alt={alt || `Avatar of ${fullName}`}
        $size={size}
        width={numericSize}
        height={numericSize}
        loading="lazy"
      />
    );
  }

  // Otherwise calculate initials and show the fallback
  return (
    <InitialsFallback
      $size={size}
      $fontSize={fontSize}
      title={alt || `Avatar of ${fullName}`}
    >
      {getInitials(fullName)}
    </InitialsFallback>
  );
}

export default Avatar;
