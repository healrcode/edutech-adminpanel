# API Routes Documentation

## Route Structure Overview

The backend API is organized into feature-specific routes, each following a consistent pattern:

### Auth Feature (Special Case)
The auth feature has a unique structure due to its central role in the application:

```typescript
// routes.ts combines all auth routes
app.use('/api/auth', authRoutes(...));           // Public + Protected routes
app.use('/api/admin', authenticate, adminRoutes); // Admin routes
```

#### Public Routes (/api/auth/*)
- POST /login - User login
- POST /register - User registration

#### Protected Routes (/api/auth/*)
- GET /me - Get current user
- GET /sessions - List user sessions
- POST /refresh - Refresh access token
- DELETE /logout - User logout

#### Admin Routes (/api/admin/*)
- GET /sessions - List all sessions
- DELETE /sessions/:id - Terminate specific session
- POST /revoke-all - Revoke all sessions

### User Feature
```typescript
app.use('/api/admin/users', authenticate, adminRoutes);
app.use('/api/users', authenticate, publicRoutes);
```

#### Admin Routes (/api/admin/users/*)
- GET / - List all users
- POST / - Create user
- DELETE /:id - Delete user
- PUT /:id/role - Update user role
- PUT /:id/status - Update user status

#### Public Routes (/api/users/*)
- GET /profile - Get user profile
- PUT /profile - Update profile
- PATCH /password - Change password

### Course Feature
```typescript
app.use('/api/courses/admin', authenticate, adminRoutes);
app.use('/api/courses', authenticate, publicRoutes);
```

#### Admin Routes (/api/courses/admin/*)
- GET / - List all courses
- POST / - Create course
- PUT /:id - Update course
- DELETE /:id - Delete course
- POST /:id/publish - Publish course
- POST /:id/unpublish - Unpublish course

#### Public Routes (/api/courses/*)
- GET / - List available courses
- GET /:id - Get course details
- GET /:id/modules - Get course modules
- GET /:id/chapters - Get course chapters

### Enrollment Feature
```typescript
app.use('/api/enrollments/admin', authenticate, adminRoutes);
app.use('/api/enrollments', authenticate, publicRoutes);
```

#### Admin Routes (/api/enrollments/admin/*)
- GET / - List all enrollments
- POST / - Create enrollment
- DELETE /:id - Delete enrollment
- PUT /:id/status - Update enrollment status

#### Public Routes (/api/enrollments/*)
- GET / - List user enrollments
- GET /:id - Get enrollment details
- POST /:id/progress - Update progress
- GET /:id/progress - Get progress

## Route Organization

Each feature follows a consistent organization pattern:

1. Routes are split into admin and public routes
2. Each route type is defined in its own file:
   - `routes/admin.ts`
   - `routes/public.ts`
3. Routes are mounted directly in main routes.ts
4. All routes (except some auth routes) require authentication

## Authentication

The authentication middleware (`authenticate`) is applied at the route mounting level:

```typescript
const authenticate = createAuthMiddleware(authRepository, userRepository);
app.use('/api/path', authenticate, routes);
```

This ensures that:
1. All requests have a valid JWT token
2. The user exists and is active
3. The session is valid and not expired

For admin routes, additional middleware (`requireAdminAccess`) ensures the user has admin privileges.
