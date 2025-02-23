## UI/UX Development Guidelines

### Page Development Structure
- Working Directory: `packages/frontend/src/app`
- Component Library: `packages/frontend/src/components`
- Styling: Tailwind CSS with consistent patterns

### Pages to Implement
1. Authentication
   - Login (`/auth/login`)
   - Signup (`/auth/signup`)
2. Dashboard
   - Home (`/`)
   - Calendar View (`/app/calendar`)
   - Analytics Dashboard (`/app/analytics`)
3. Management
   - Team Management (`/app/team`)
   - Profile Settings (`/app/settings`)
   - Platform Integrations (`/app/integrations`)

### Development Guidelines
1. Branch Management
   - Create feature branches from `main`
   - Use prefix `feature/ui-*` for all UI work
   - Example: `feature/ui-calendar-view`

2. Component Development
   - Create reusable components in `src/components`
   - Document props and usage
   - Include responsive designs
   - Follow existing styling patterns

3. State Management
   - Use React hooks for local state
   - Implement proper loading states
   - Handle error scenarios
   - Add proper TypeScript types

4. Testing & Preview
   - Test on multiple viewports
   - Verify accessibility
   - Check performance metrics
   - Use mock data initially

5. Integration Points
   - Use environment variables for API URLs
   - Follow authentication patterns
   - Implement proper error handling
   - Add loading states

### Coordination Rules
1. File Separation
   - Keep page components in `src/app/pages`
   - Shared components in `src/components`
   - Utilities in `src/utils`

2. Avoid Modifying
   - Core authentication logic
   - API integration code
   - Environment configurations
   - Deployment settings

3. Development Flow
   - Create new feature branch
   - Implement UI components
   - Add necessary types
   - Test functionality
   - Submit PR for review

4. Documentation
   - Update component docs
   - Add usage examples
   - Document props
   - Note any dependencies
