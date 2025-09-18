# Overview

This is a full-stack web application built to track and display LeetCode performance statistics for students. The system scrapes student data from a NEDUET university website, fetches their LeetCode statistics via API calls, and presents this information through an interactive leaderboard interface. The application serves as a competitive programming tracking platform for educational institutions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend uses React with TypeScript, built on Vite for fast development and bundling. Key architectural decisions include:

- **UI Framework**: Radix UI components with Shadcn/UI for consistent, accessible design system
- **Styling**: Tailwind CSS with CSS variables for theming, supporting dark mode
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

The component architecture follows a modular approach with reusable UI components, custom hooks, and separated business logic. The application uses a single-page design focused on the leaderboard view.

## Backend Architecture

The backend is built with Express.js and TypeScript, following a clean separation of concerns:

- **API Layer**: RESTful endpoints for students and statistics
- **Service Layer**: Separate services for web scraping and LeetCode API integration
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **Data Validation**: Zod schemas for runtime type checking

The server includes middleware for request logging, error handling, and development-specific features like Vite integration.

## Data Storage Solutions

Currently implements an in-memory storage system with a well-defined interface that can be easily swapped for persistent storage:

- **Database Schema**: Drizzle ORM with PostgreSQL schema definitions
- **Tables**: Students table with personal info and LeetCode URLs, separate stats table for performance metrics
- **Data Types**: Structured types for students, LeetCode statistics, and combined views

The storage abstraction allows for easy migration to PostgreSQL or other databases without changing business logic.

## Authentication and Authorization

No authentication system is currently implemented. The application operates as a read-only public leaderboard accessible to all users.

# External Dependencies

## Third-party Services

- **LeetCode GraphQL API**: Fetches user statistics including problems solved and global rankings
- **NEDUET Website**: Source for student information including names, roll numbers, and LeetCode profile URLs

## Key Libraries and Tools

- **Frontend**: React, Vite, TanStack Query, Radix UI, Tailwind CSS, Wouter, React Hook Form
- **Backend**: Express.js, Cheerio for web scraping, Drizzle ORM
- **Database**: PostgreSQL with Neon serverless driver (configured but not actively used)
- **Development**: TypeScript, ESBuild for production builds, Replit-specific development plugins

## API Integrations

- **LeetCode GraphQL Endpoint**: `https://leetcode.com/graphql` for fetching user statistics
- **NEDUET Scraper**: `https://cct.neduet.edu.pk/leetcodeRanking` for student information

The application is designed to handle API failures gracefully, with error handling for both scraping and LeetCode API calls.