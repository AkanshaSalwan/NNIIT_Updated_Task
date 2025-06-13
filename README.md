# Tutor Booking Calendar Application

A modern, responsive web application for managing tutor bookings and scheduling. Built with Next.js, TypeScript, and Tailwind CSS, this application provides an intuitive interface for both tutors and students to manage their schedules.

![Tutor Booking Calendar](https://via.placeholder.com/800x400?text=Tutor+Booking+Calendar)

## Features

- 📅 Interactive calendar interface for booking management
- 👥 Separate views for tutors and students
- 🎯 Real-time availability tracking
- 📱 Fully responsive design for all devices
- 🔔 Toast notifications for booking confirmations
- 🎨 Modern UI with Tailwind CSS
- 🔒 Type-safe development with TypeScript
- 🔄 Real-time data updates
- 📊 Booking statistics and analytics

## Tech Stack

- **Framework:** Next.js 15.2.4
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Date Handling:** date-fns
- **Form Handling:** React Hook Form
- **Notifications:** React Toastify
- **Icons:** Lucide React
- **API:** Next.js API Routes
- **Data Storage:** JSON file (development) / MongoDB (production)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- Yarn package manager
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd tutor-booking-app
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
tutor-booking-app/
├── app/
│   ├── api/           # API routes
│   │   └── slots/     # Slot management endpoints
│   └── page.tsx       # Main application page
├── components/
│   ├── ui/           # Reusable UI components
│   └── calendar/     # Calendar-specific components
├── types/           # TypeScript type definitions
├── data/           # Initial data and mock data
│   └── db.json     # Data persistence file
└── public/         # Static assets
```

## API Documentation

### Slots Endpoints

#### GET /api/slots
- Returns all available slots
- Response: Array of slot objects

#### POST /api/slots
- Creates a new slot
- Request Body: Slot object
- Response: Created slot object

#### GET /api/slots/[id]
- Returns a specific slot
- Parameters: slot ID
- Response: Slot object

#### PUT /api/slots/[id]
- Updates a specific slot
- Parameters: slot ID
- Request Body: Updated slot data
- Response: Updated slot object

#### DELETE /api/slots/[id]
- Deletes a specific slot
- Parameters: slot ID
- Response: Success message

## Key Features Implementation

### Calendar View
- Week-based navigation
- Real-time slot availability
- Interactive booking interface
- Responsive grid layout

### Booking System
- Student booking form
- Tutor availability management
- Booking confirmation system
- Real-time updates

### Data Persistence
- Local JSON storage for development
- MongoDB integration for production
- Real-time data synchronization
- Automatic data backup

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

### Code Style

This project follows the standard Next.js and TypeScript best practices. We use:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production, set these variables in your Vercel project settings.

## Deployment

The application is configured for deployment on Vercel. The deployment process is automated through GitHub integration.

### Production Considerations

1. **Database Setup**
   - Set up MongoDB Atlas account
   - Configure connection string in Vercel environment variables
   - Update API routes to use MongoDB client

2. **Environment Variables**
   - Configure all required environment variables in Vercel
   - Set production API URL
   - Add any necessary API keys

3. **Performance Optimization**
   - Enable Vercel Edge Functions
   - Configure caching strategies
   - Optimize image loading

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [date-fns](https://date-fns.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel](https://vercel.com)
