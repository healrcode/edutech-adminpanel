# System Patterns

## Architecture
- React-based admin panel
- Material-UI (MUI) for component library
- TypeScript for type safety
- Context API for state management
- REST API communication

## Key Technical Decisions
1. Authentication
   - JWT-based auth with access/refresh tokens
   - Role-based access control
   - Protected routes implementation

2. API Communication
   - Base ApiClient class for HTTP requests
   - Specialized clients (AdminClient)
   - Type-safe request/response handling

3. Component Structure
   - Layout component for consistent UI
   - Reusable components in /components/common
   - Page-specific components in /pages
   - Material-UI for styling and components

4. State Management
   - Auth state managed via context
   - Zustand for global state
   - Type definitions in store/types.ts

## Backend Integration
- RESTful API endpoints
- Pagination support for lists
- Status management for users/content
- Role-based permissions

## Common Patterns
1. Data Display
   - Card-based UI components
   - Grid layouts for responsive design
   - Typography hierarchy
   - Icon integration from MUI

2. Data Management
   - Paginated lists
   - CRUD operations
   - Status updates
   - Role management

3. Error Handling
   - API error handling
   - User feedback via alerts
   - Type-safe error responses
