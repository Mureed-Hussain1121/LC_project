# Overview

This is a full-stack web application built to track and display LeetCode performance statistics for students. The system scrapes student data from a NEDUET university website, fetches their LeetCode statistics via the LeetCode GraphQL API, and presents the information in an interactive leaderboard format. The application provides filtering capabilities by batch and program, sorting functionality, and real-time statistics display.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend uses React with TypeScript, built on Vite for fast development and bundling. Key architectural decisions include:

- **UI Framework**: Radix UI components with Shadcn/UI for consistent, accessible design system
- **Styling**: Tailwind CSS with CSS variables for theming, supporting dark mode by default
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

The component architecture follows a modular approach with reusable UI components, custom hooks, and separated business logic. The application uses a single-page design focused on the leaderboard view with comprehensive filtering and sorting capabilities.

## Backend Architecture

The backend is built with Express.js and TypeScript, following a clean separation of concerns:

- **API Layer**: RESTful endpoints for students and statistics (`/api/students`, `/api/statistics`)
- **Service Layer**: Separate services for web scraping (NEDUETScraper) and LeetCode API integration (LeetCodeAPI)
- **Storage Layer**: Abstracted storage interface with in-memory implementation that can be easily swapped for persistent storage
- **Data Validation**: Zod schemas for runtime type checking and data integrity

The server includes middleware for request logging, error handling, and development-specific features like Vite integration for hot module replacement.

## Data Storage Solutions

Currently implements an in-memory storage system with a well-defined interface that can be easily migrated to persistent storage:

- **Database Schema**: Drizzle ORM with PostgreSQL schema definitions ready for deployment
- **Tables**: Students table with personal info and LeetCode URLs, separate leetcode_stats table for performance metrics
- **Data Types**: Structured TypeScript types for students, LeetCode statistics, and combined views
- **Storage Interface**: IStorage interface abstracts data operations, allowing seamless transition from in-memory to database storage

The storage abstraction allows for easy migration to PostgreSQL or other databases without changing business logic.

## Authentication and Authorization

No authentication system is currently implemented. The application operates as a read-only public leaderboard accessible to all users. This design choice simplifies deployment and usage for educational environments where public visibility of coding progress is desired.

# External Dependencies

## Third-party Services

- **LeetCode GraphQL API**: Fetches user statistics including total problems solved, difficulty breakdown, and global ranking
- **NEDUET University Website**: Source for student data including names, roll numbers, batch information, and LeetCode profile URLs
- **Neon Database**: PostgreSQL hosting service configured via Drizzle ORM for production data persistence

## Key Libraries and Frameworks

- **Drizzle ORM**: Type-safe database operations with PostgreSQL support
- **Cheerio**: HTML parsing for web scraping functionality
- **Radix UI**: Comprehensive component library for accessible UI elements
- **TanStack Query**: Server state management with caching and background updates
- **Zod**: Runtime type validation and schema definition
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Vite**: Fast build tool with hot module replacement for development

## Development and Deployment

- **TypeScript**: Full-stack type safety with shared schemas
- **ESBuild**: Fast bundling for production server builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Replit Integration**: Development environment plugins for enhanced debugging and cartography

The architecture emphasizes type safety, modularity, and easy scalability from development to production environments.