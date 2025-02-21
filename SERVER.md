# Custom Onboarding Flow - Architecture Walkthrough
****THIS WAS WRITTEN AT THE END OF DEVELOPMENT NOT WITHIN THE TIMEFRAME OF 5HRS SPECIFIED****

## Overview
For this challenge, I focused on creating a robust and maintainable architecture that goes beyond just meeting the basic requirements.

I chose NestJS for its robust architecture and Object-Oriented Programming principles.

## Core Architecture Decisions

### 1. Response Standardization
I implemented a global response interceptor that standardizes all API responses:
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string;
}
```
This ensures the client always receives consistent responses, making frontend development more predictable and reliable. Whether it's a success or error, the frontend team knows exactly what structure to expect.

### 2. Comprehensive Logging System
I built a centralized logging service that tracks operations across all services:
```typescript
this.logger.log('Starting user creation process');
this.logger.error('Failed to update profile', error.message);
```
This makes debugging and monitoring much easier. By having detailed logs with timestamps and contexts, we can quickly trace issues and understand system behavior. The logging system is also designed to be extensible - we can easily switch from console logging to file logging or external services like DataDog without changing any service code.

### 3. Error Handling Strategy
Instead of handling errors differently across services, I implemented a global error handling approach:
```typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Standardized error handling
  }
}
```
This ensures consistent error responses and proper error logging throughout the application. It's also easier to maintain since error handling logic is centralized.

### 4. Database Structure
For the database, I chose a structure that balances flexibility with data integrity:
```sql
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE onboarding_config (
  id SERIAL PRIMARY KEY,
  page2 JSONB NOT NULL,
  page3 JSONB NOT NULL
);
```
This schema allows for flexible onboarding configurations while maintaining data consistency.

### 5. Service Organization
The application is divided into focused services:
- **ConfigService**: Handles onboarding flow configuration
- **UsersService**: Manages user operations
- **OnboardingService**: Controls the onboarding process

Each service has clear responsibilities, making the code more maintainable and easier to test.

## Key Features and Their Implementation

### Configurable Onboarding Flow
The admin configuration system is built to be flexible yet safe:
```typescript
private validateConfig(components: any[]) {
  // Validation ensures each page has 1-2 components
  // and only allows valid component types
}
```
This allows admins to customize the flow while preventing invalid configurations.

### Logging Implementation
The logging system is designed to be both informative and scalable:
```typescript
private formatMessage(message: any, meta?: any, context?: string): string {
  const timestamp = new Date().toISOString();
  const ctx = context || this.context || 'Application';
  const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${ctx}] ${message}${metaString}`;
}
```
This provides detailed context for each operation while being extensible for future needs.

## Future Enhancements
Given more time, 5 things I would add:
1. Request tracing for better debugging
2. Caching layer for frequently accessed configurations
3. Metrics collection for monitoring
4. API documentation using Swagger
5. Containerization to make deployments easier and more scalable

## Development Setup
To run this project:
```bash
cd server
yarn install
yarn run start:dev
```

Environment variables needed:
```env
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
NODE_ENV=development
```


## Conclusion
This architecture prioritizes maintainability and reliability while eliminating common development bottlenecks & reundencies. Through standardized responses, comprehensive logging, and NestJS's structured approach, we've built a foundation that lets developers focus on what matters... creating impactful healthcare features.

The system is designed to grow seamlessly with the company, supporting new features and increased user load without major architectural changes. By handling technical challenges upfront, the team can concentrate on delivering value to patients rather than wrestling with technical debt.


