# Overview

This is a full-stack web application built to track and display LeetCode performance statistics for students from NEDUET university. The system scrapes student data from the university website, fetches their LeetCode statistics via the LeetCode API, and presents the information in an interactive leaderboard format. The application focuses on providing a clean, accessible interface for viewing competitive programming progress across different student cohorts.

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

The component architecture follows a modular approach with reusable UI components, custom hooks, and separated business logic. The application uses a single-page design focused on the leaderboard view with filtering and sorting capabilities.

## Backend Architecture

The backend is built with Express.js and TypeScript, following a clean separation of concerns:

- **API Layer**: RESTful endpoints for students (`/api/students`) and statistics (`/api/statistics`)
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

No authentication system is currently implemented. The application operates as a read-only public leaderboard accessible to all users. This design choice simplifies deployment and usage for educational purposes while focusing on data visualization rather than user management.

# External Dependencies

## Third-party Services
- **NEDUET University Website**: Source for student enrollment data and personal information
- **LeetCode GraphQL API**: Fetches competitive programming statistics including problem counts, difficulty breakdowns, and global rankings
- **Neon Database**: PostgreSQL hosting service (configured but not actively used in current in-memory implementation)

## Key Libraries
- **Frontend**: React, TypeScript, Vite, TanStack Query, Wouter, Radix UI, Tailwind CSS
- **Backend**: Express.js, Cheerio for web scraping, Drizzle ORM for database operations
- **Validation**: Zod for runtime type checking across frontend and backend
- **Development**: ESBuild for production builds, various Replit plugins for development environment

## API Integrations
- **LeetCode GraphQL Endpoint**: `https://leetcode.com/graphql` for fetching user statistics
- **University Data Source**: Web scraping from NEDUET website for student enrollment information