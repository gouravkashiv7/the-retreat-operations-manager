# The Retreat Operations Manager

An internal web application designed to manage the day-to-day operations of "The Retreat" cottage. The application provides tools for staff to handle bookings, check guests in and out, manage accommodation availability (cabins and rooms), and view operational statistics through a central dashboard.

## Tech Stack

- **Frontend Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** Styled Components
- **Data Fetching & State Management:** React Query (TanStack Query) v5
- **Backend/Database As A Service:** Supabase (\`@supabase/supabase-js\`)
- **Form Management:** React Hook Form
- **Data Visualization (Charts):** Recharts
- **Notifications/Toast:** React Hot Toast
- **Date Manipulation:** date-fns

## Key Features

- **Dashboard:** A central overview of recent activities, occupancy rates, and revenue statistics.
- **Bookings Management:** Comprehensive tools to create, view, filter, and manage guest bookings.
- **Check-in / Check-out:** Streamlined workflows to process guest arrivals and departures, including payment status updates.
- **Accommodation Inventory:** Manage "Cabins" and "Rooms" availability and details.
- **Guests Database:** A repository of guest profiles and their histories.
- **System Settings:** Configure application-wide operational properties.
- **Authentication & Authorization:** Secure staff login using Supabase authentication, alongside protected routes.

## Available Scripts

In the project directory, you can run:

### \`pnpm dev\`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.
The page will reload when you make changes.

### \`pnpm build\`

Builds the app for production to the \`dist\` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### \`pnpm preview\`

Locally preview the production build after running \`pnpm build\`.

### \`pnpm lint\`

Runs ESLint to check for code quality and style issues.
