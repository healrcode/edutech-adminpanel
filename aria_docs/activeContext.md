# Active Context

## Current Task
Building the user management tab in the admin panel

## Available Backend Endpoints (from admin/client.ts)
1. User Management
   ```typescript
   listUsers(page = 1, pageSize = 10): Promise<PaginatedResponse<User>>
   updateUserStatus(userId: string, status: string): Promise<User>
   updateUserRole(userId: string, role: string): Promise<User>
   ```

## User Interface Requirements
1. List View
   - Paginated table of users
   - Display fields: email, name, role, status
   - Actions: update status, update role
   - Search/filter capabilities

2. Status Management
   - View current status
   - Update user status
   - Status history (if available)

3. Role Management
   - View current role
   - Update user role
   - Role permissions overview

## Data Structure (from store/types.ts)
```typescript
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  avatar?: string;
}
```

## Next Steps
1. Create new Users page component
2. Implement user listing with pagination
3. Add status management functionality
4. Add role management functionality
5. Integrate with Layout component
6. Add to navigation
7. Implement search/filter features
8. Add error handling and loading states
