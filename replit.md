# MGNREGA District Dashboard - Maharashtra

## Overview

This is a bilingual (English/Marathi) data visualization dashboard for displaying MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) performance metrics across Maharashtra districts. The application provides an accessible, government-focused interface showing key metrics like people benefited, person-days generated, and wages paid, with both district-level summaries and monthly trend data.

The dashboard features automatic geolocation-based district selection, responsive design for mobile and desktop, and follows Material Design principles optimized for data-heavy government applications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: 
- Shadcn UI component library (New York style variant)
- Radix UI primitives for accessible interactive components
- Tailwind CSS for styling with custom design tokens
- Recharts for data visualization (bar charts, trend analysis)

**State Management**:
- TanStack React Query (v5) for server state and data fetching
- Local React state for UI interactions (district selection, auto-detection flags)
- Wouter for client-side routing

**Design System**:
- Material Design principles adapted for government data dashboards
- Bilingual typography system using Noto Sans (Latin) and Noto Sans Devanagari (Marathi script)
- Roboto Mono for tabular numerical data
- Mobile-first responsive design with touch-friendly targets
- Custom spacing scale based on Tailwind units (2, 4, 6, 8, 12, 16, 20)

**Key Features**:
- Automatic geolocation-based district detection using browser Geolocation API
- District-specific data views with metric cards and monthly trend charts
- Bilingual labels throughout (English primary, Marathi secondary)
- Accessible error and loading states with retry mechanisms

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Structure**:
- RESTful API design
- Two primary endpoints:
  - `GET /api/districts` - Returns list of all districts with coordinates
  - `GET /api/data/:district` - Returns detailed MGNREGA data for specific district
- Request/response validation using Zod schemas
- Centralized error handling with appropriate HTTP status codes

**Data Layer**:
- In-memory caching system (MemStorage class)
- JSON file-based data source (`data/mgnrega_sample.json`)
- Cache with 1-hour TTL for district data
- Schema validation for type safety across shared types

**Development Setup**:
- Vite middleware integration for HMR in development
- Request logging with timing metrics for API routes
- Custom error overlay via Replit plugins

### Data Storage

**Current Implementation**: File-based JSON storage with in-memory caching
- Sample data structure includes 34 Maharashtra districts
- Each district has aggregated metrics and monthly breakdown
- Geographic coordinates for location-based features

**Schema Design** (defined in `shared/schema.ts`):
- `District`: id, name, nameMarathi, optional lat/lng coordinates
- `MGNEREGAData`: district metadata, total metrics, lastUpdated timestamp, monthly breakdown
- `MonthlyData`: month labels (English/Marathi), peopleBenefited, personDays, wagesPaid

**Note**: The application uses Drizzle ORM configuration pointing to PostgreSQL (`drizzle.config.ts`), suggesting planned migration from JSON to database storage. Current implementation does not use the database.

### External Dependencies

**Data Visualization**:
- Recharts: Chart library for bar charts and data visualization components

**UI Framework**:
- Radix UI: Unstyled accessible component primitives (accordion, dialog, dropdown, select, tabs, toast, tooltip, etc.)
- Tailwind CSS: Utility-first CSS framework
- Class Variance Authority: Variant-based component styling
- Lucide React: Icon library

**Type Safety & Validation**:
- Zod: Runtime schema validation for API responses and shared types
- TypeScript: Static type checking across frontend and backend

**State & Data Fetching**:
- TanStack React Query: Server state management, caching, and synchronization
- React Hook Form with Zod resolvers: Form handling (configured but not actively used)

**Database (Configured, Not Active)**:
- Drizzle ORM: Type-safe database queries
- Neon Serverless Database: PostgreSQL driver
- connect-pg-simple: PostgreSQL session store (configured but unused)

**Development Tools**:
- Vite: Build tool and dev server
- esbuild: JavaScript bundler for production builds
- tsx: TypeScript execution for development server
- Replit plugins: Runtime error modal, cartographer, dev banner

**Fonts**:
- Google Fonts CDN: Noto Sans, Noto Sans Devanagari, Roboto Mono for comprehensive language and numerical display support

**Data Source**:
- data.gov.in: Referenced as the official source for MGNREGA statistics (external, not integrated via API)