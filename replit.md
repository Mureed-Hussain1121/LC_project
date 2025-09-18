# Overview

This is a LeetCode leaderboard application built with React and Express. The system tracks and displays LeetCode performance statistics for students by scraping student data from a university website and fetching LeetCode statistics via API calls. It presents this information through an interactive leaderboard interface.

# Recent Changes

- 2025-09-18: Successfully imported GitHub project and set up Replit environment
- Installed Node.js 20 and npm dependencies
- Configured PostgreSQL database integration (DATABASE_URL secret exists)
- Set up development workflow serving on port 5000
- Configured Vite dev server with Replit proxy compatibility
- Set up deployment configuration for production builds

# User Preferences

Preferred communication style: Simple, everyday language.

# Project Architecture

## Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite with development server on port 5000
- **UI**: Radix UI components with Shadcn/UI and Tailwind CSS
- **State**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

## Backend  
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configurable)
- **APIs**: LeetCode GraphQL API and NEDUET website scraping
- **Storage**: Currently uses in-memory storage, supports PostgreSQL

## Current Status
- ✅ Development server running on port 5000
- ✅ Frontend displaying leaderboard interface 
- ✅ Backend API endpoints responding correctly
- ✅ Database connection configured
- ✅ Deployment settings configured for production
- ⚠️ Empty leaderboard (no data scraped yet - this is expected)

The application is fully functional and ready for use in the Replit environment.