import { useDarkMode } from "../context/DarkModeContext";
import styled from "styled-components";

const TooltipContainer = styled.div`
  background-color: ${(props) =>
    props.$isDarkMode ? "var(--color-grey-800)" : "var(--color-grey-0)"};
  border: 1px solid
    ${(props) =>
      props.$isDarkMode ? "var(--color-grey-600)" : "var(--color-grey-200)"};
  border-radius: var(--border-radius-md);
  padding: 1.2rem;
  box-shadow: var(--shadow-md);
  color: ${(props) =>
    props.$isDarkMode ? "var(--color-grey-100)" : "var(--color-grey-700)"};
  font-size: 1.4rem;
`;

const TooltipTitle = styled.p`
  font-weight: 600;
  margin: 0 0 0.8rem 0;
  color: ${(props) =>
    props.$isDarkMode ? "var(--color-grey-0)" : "var(--color-grey-900)"};
`;

const TooltipText = styled.p`
  margin: 0;
  color: ${(props) =>
    props.$isDarkMode ? "var(--color-grey-300)" : "var(--color-grey-600)"};
`;

function ChartTooltip({ active, payload, label, showPercentage = false }) {
  const { isDarkMode } = useDarkMode();

  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <TooltipContainer $isDarkMode={isDarkMode}>
        <TooltipTitle $isDarkMode={isDarkMode}>
          {payload[0].name || label}
        </TooltipTitle>

        <TooltipText $isDarkMode={isDarkMode}>
          Value:{" "}
          <span
            style={{
              color: data.color,
              fontWeight: "600",
            }}
          >
            {payload[0].value}
          </span>
        </TooltipText>

        {showPercentage && data.total && (
          <TooltipText $isDarkMode={isDarkMode}>
            Percentage:{" "}
            <span style={{ fontWeight: "600" }}>
              {((payload[0].value / data.total) * 100).toFixed(1)}%
            </span>
          </TooltipText>
        )}
      </TooltipContainer>
    );
  }
  return null;
}

export default ChartTooltip;
