import { useDarkMode } from "../../context/DarkModeContext";
import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.6rem;

    /* Adjust chart container for mobile */
    & .recharts-responsive-container {
      height: 250px !important;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1.2rem;
    margin: 0 -1rem;
    border-left: none;
    border-right: none;
    border-radius: 0;

    & .recharts-responsive-container {
      height: 220px !important;
    }

    /* Adjust text sizes for mobile */
    & .recharts-text {
      font-size: 0.8rem;
    }
  }

  /* Very Small Mobile */
  @media (max-width: 360px) {
    padding: 1rem;

    & .recharts-responsive-container {
      height: 200px !important;
    }
  }
`;

const ChartHeading = styled(Heading)`
  /* Desktop */
  font-size: 1.8rem;
  margin-bottom: 1.6rem;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 1.2rem;
    text-align: center;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
`;

function SalesChart({ bookings, numDays }) {
  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    const dayBookings = bookings.filter((booking) =>
      isSameDay(date, new Date(booking.created_at))
    );

    const totalSales = dayBookings.reduce(
      (acc, cur) => acc + (cur.totalPrice || 0),
      0
    );
    const extrasSales = dayBookings.reduce(
      (acc, cur) => acc + (cur.extrasPrice || 0),
      0
    );

    return {
      label: format(date, "MMM dd"),
      totalSales,
      extrasSales,
    };
  });

  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledSalesChart>
      <ChartHeading as="h2">
        Sales from {format(allDates.at(0), "MMM dd yyyy")} &mdash;{" "}
        {format(allDates.at(-1), "MMM dd yyyy")}
      </ChartHeading>
      <ResponsiveContainer height={220} width="80%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text, fontSize: 12 }}
            tickLine={{ stroke: colors.text }}
            interval="preserveStartEnd"
          />
          <YAxis
            unit="₹"
            tick={{ fill: colors.text, fontSize: 12 }}
            tickLine={{ stroke: colors.text }}
            width={60}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.background,
              fontSize: "12px",
              borderRadius: "var(--border-radius-sm)",
            }}
          />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total Sales"
            unit="₹"
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="Extras Sales"
            unit="₹"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
