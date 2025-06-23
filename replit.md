# EuroFunds Platform

## Overview

This is a full-stack mutual fund investment platform built with modern web technologies. The application allows users to browse European mutual funds, make investments, and track their portfolio performance. It follows a clean architecture pattern with separate client and server components, shared type definitions, and a PostgreSQL database for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom finance-themed color palette
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for HTTP server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API with JSON responses
- **Development**: Hot reloading with Vite integration

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend server  
├── shared/          # Shared TypeScript types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Key Components

### Database Schema
The application uses three main database tables:
- **funds**: Stores mutual fund information (name, manager, NAV, performance metrics)
- **transactions**: Records all fund purchase transactions
- **portfolio_holdings**: Aggregated view of user's current holdings per fund

### API Endpoints
- `GET /api/funds` - Retrieve all available funds
- `GET /api/funds/:id` - Get specific fund details
- `POST /api/transactions` - Create new fund purchase transaction
- `GET /api/portfolio/summary` - Get portfolio summary statistics
- `GET /api/portfolio/holdings` - Get current portfolio holdings
- `GET /api/transactions` - Get transaction history

### Frontend Pages
- **Funds Page**: Browse and filter available mutual funds
- **Fund Detail**: Detailed view with investment form
- **Portfolio Page**: View holdings, performance, and transaction history

### UI Component System
Built on Radix UI primitives with custom theming:
- Consistent design system with CSS variables
- Responsive design patterns
- Accessible components by default
- Custom finance-specific styling

## Data Flow

1. **Fund Discovery**: Users browse funds fetched from `/api/funds`
2. **Fund Selection**: Detailed fund information loaded via `/api/funds/:id`
3. **Investment Process**: 
   - Form validation with Zod schemas
   - Currency conversion (USD to EUR)
   - Share calculation based on current NAV
   - Transaction creation via `POST /api/transactions`
4. **Portfolio Tracking**: Real-time portfolio updates through TanStack Query
5. **Data Persistence**: All transactions and holdings stored in PostgreSQL

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **UI Library**: Radix UI primitives
- **Validation**: Zod for runtime type checking
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **TypeScript**: Full type safety across the stack
- **Vite**: Fast development and build tooling
- **ESBuild**: Fast backend bundling for production
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing and optimization

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Port**: 5000 (configured in .replit)
- **Hot Reload**: Enabled for both frontend and backend
- **Database**: Requires `DATABASE_URL` environment variable

### Production Build
- **Frontend**: `vite build` outputs to `dist/public`
- **Backend**: `esbuild` bundles server to `dist/index.js`
- **Start Command**: `npm run start`
- **Deployment**: Configured for Replit autoscale deployment

### Database Management
- **Schema**: Defined in `shared/schema.ts`
- **Migrations**: Generated in `migrations/` directory
- **Push Command**: `npm run db:push` to sync schema changes

## Changelog

Changelog:
- June 23, 2025. Added AI Fund Analysis feature using OpenAI GPT-4o for intelligent fund filtering in Research tab
- June 23, 2025. Created Research tab with sortable fund table and region filters
- June 23, 2025. Updated Portfolio to display all values in USD currency
- June 23, 2025. Added Account tab as primary navigation with user profile and settings
- June 23, 2025. Enhanced fund data with AUM and proper currency formatting (USD for US funds, EUR/GBP for offshore)
- June 16, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.