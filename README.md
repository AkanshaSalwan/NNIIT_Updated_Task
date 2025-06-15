# Next.js Calendar Interface

## Overview

This project provides a responsive calendar interface built with Next.js, designed for managing and displaying time slots. It allows users to view available and booked slots, with functionality to simulate booking interactions.

## How to Use This Application

The calendar displays daily time slots. Each slot has a status:
*   **Available:** These are open slots that can be selected for booking.
*   **Booked:** These slots are currently occupied and display the student's name and the subject of their booking.
*   **Unavailable:** These slots are not available for booking and do not have any associated booking details.

Users can interact with the calendar as follows:
1.  **Navigate Weeks:** Use the navigation controls (e.g., "Previous Week," "Next Week," "Today") to browse time slots across different weeks.
2.  **Select an Available Slot:** Click on any slot marked as "Available."
3.  **Complete Booking Form:** A booking modal will appear. Fill in the required student name and subject details.
4.  **Confirm Booking:** Submit the form to simulate a booking. The selected slot will then be marked as "Booked" with the provided details.
5.  **View Booking Confirmation:** A toast notification will confirm the successful booking.

**Crucial Note on Data Persistence (Local vs. Deployment):**
For **local development**, all booking data is stored in the `db.json` file by `json-server`. This means any bookings or changes you make **will be saved locally** as long as the `json-server` process is running and the `db.json` file is present. You can restart the `json-server` and the frontend locally, and your saved data should persist.

However, when deployed to platforms like Vercel, this local `db.json` storage is **not persistent**. Vercel's serverless environment is ephemeral; data saved to `db.json` during a request will be lost on subsequent requests or deployments. Therefore, if you deploy this application as-is, **any booked data will disappear upon refresh or new sessions**. To ensure data persistence in a deployed environment, you **must** migrate your backend to a cloud-hosted database solution.

## Installation and Setup

Follow these steps to get the project up and running on your local machine:

### Prerequisites

*   **Node.js**: Version 18 or higher. You can download it from [nodejs.org](https://nodejs.org/). `npm` (Node Package Manager) is included with Node.js.
*   **Git**: For cloning the repository.

### 1. Clone the Repository

Open your terminal or command prompt and run the following command:

```bash
git clone https://github.com/AkanshaSalwan/NNIIT_Updated_Task
cd task-nniit # Navigate into the project directory
```

### 2. Install Dependencies

Once inside the `task-nniit` directory, install all necessary project dependencies:

```bash
npm install
```

### 3. Run the Backend (JSON Server)

In your terminal, navigate to the `task-nniit` directory (if you're not already there) and start the `json-server`. This will simulate a REST API for local data management.

```bash
npm run json-server --watch db.json --port 3001
```
This command will start the JSON server at `http://localhost:3001`. It will watch the `db.json` file for changes and automatically update the API.

### 4. Run the Frontend (Next.js Development Server)

In a **separate terminal window**, navigate back to the `task-nniit` directory and start the Next.js development server:

```bash
npm run dev
```
The Next.js application will then be accessible in your web browser at `http://localhost:3000`.

## API Endpoints (Local JSON Server)

For local development, the application interacts with `json-server` via the following endpoints based on the `slots` collection in `db.json`:

*   **GET /slots**
    *   **Description:** Fetches all available, booked, and unavailable time slots.
    *   **Usage:** Used by the calendar grid to display all current slots.

*   **PUT /slots/:id**
    *   **Description:** Updates the details of a specific time slot, primarily used for marking a slot as booked and adding booking information.
    *   **Usage:** Sent when a user confirms a booking for an available slot. The request body includes the updated slot object (e.g., `isAvailable: false`, `booking: { studentName: "...", subject: "...", bookingId: "..." }`).

## Technical Approach

This application is built as a Single Page Application (SPA) using **Next.js**, which is a powerful React framework for building full-stack web applications. It leverages Next.js's features for routing, API routes (for potential future backend integration), and server-side rendering/static site generation capabilities. The project utilizes a component-based architecture for a modular and maintainable codebase.

## Frontend Technologies and Styling

The frontend is developed using **Next.js** and **React**. For styling, the project likely employs a utility-first CSS framework (such as Tailwind CSS, commonly used with Next.js) for rapid UI development and consistent design, combined with custom CSS. Responsiveness is achieved through flexible layouts and media queries, ensuring the calendar interface adapts seamlessly across various screen sizes, from mobile devices to desktops. `@radix-ui/react-popover` is used for building accessible and unstyled UI components, providing a solid foundation for interactive elements.

## Backend and Data Persistence

For **local development**, this project uses `json-server` to simulate a backend API. Data is stored in a `db.json` file, which contains two main collections:
*   `slots`: Defines all available, booked, and unavailable time slots with their respective statuses and booking details (if any).
*   `bookings`: (Currently empty, but intended to store booking records).

**Important Note for Deployment:**
`json-server` is **not suitable for production deployments** on platforms like Vercel, as it relies on local file-based storage which is ephemeral in serverless environments. To deploy this application with persistent data, you will need to migrate your `db.json` data to a robust, cloud-hosted database solution (e.g., MongoDB, PostgreSQL) and update the application to interact with that database.

## Key Libraries Used

*   `@radix-ui/react-popover`: For building accessible popover components.
*   `cmdk`: A command palette component.
*   `json-server`: Used for quickly spinning up a REST API for local development and data storage in `db.json`.
*   `react-toastify`: For adding customizable toast notifications.
