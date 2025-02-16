# Technical Context

## Technologies Used
1. Frontend
   - React with TypeScript
   - Material-UI (MUI) component library
   - Zustand for state management
   - React Context API
   - Axios for API communication

2. Build Tools
   - TypeScript compiler
   - npm package manager

3. Development Tools
   - VSCode IDE
   - Git version control

## Development Setup
1. Project Structure
   ```
   edutech-adminpanel/
   ├── src/
   │   ├── api/        # API clients and types
   │   ├── components/ # Reusable components
   │   ├── contexts/   # React contexts
   │   ├── hooks/      # Custom hooks
   │   ├── pages/      # Page components
   │   ├── store/      # Global state
   │   └── theme/      # MUI theme
   ```

2. API Integration
   - Base URL configuration
   - JWT authentication
   - Admin-specific endpoints
   - Error handling

## Technical Constraints
1. Authentication
   - JWT-based authentication
   - Role-based access control
   - Token refresh mechanism

2. API Requirements
   - Pagination for list endpoints
   - Status management for users
   - Role management capabilities

3. Performance
   - Efficient data fetching
   - Proper error handling
   - Type safety enforcement

4. Accessibility
   - WCAG compliance
   - Keyboard navigation
   - Screen reader support
