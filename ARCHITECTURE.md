# Architecture Documentation

## Overview

This application follows a **Layered Architecture** pattern, also known as **Clean Architecture** or **Onion Architecture**. This design promotes separation of concerns, maintainability, testability, and scalability.

## Architecture Layers

```
┌────────────────────────────────────────────────────────────┐
│                   Presentation Layer                        │
│              (React Components, Pages, UI)                  │
└──────────────────────┬─────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────┐
│                  Controller Layer                           │
│         (API Routes - HTTP Request Handlers)                │
│    Controllers validate input, call services, return        │
│    responses. They handle HTTP-specific concerns.           │
└──────────────────────┬─────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────┐
│                   Service Layer                             │
│              (Business Logic)                               │
│    Services contain business rules, orchestrate             │
│    repositories, and implement use cases.                   │
└──────────────────────┬─────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────┐
│                 Repository Layer                            │
│              (Data Access Layer)                            │
│    Repositories abstract database operations and            │
│    provide a clean interface for data access.               │
└──────────────────────┬─────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────┐
│                   Model Layer                               │
│           (Domain Entities & Types)                         │
│    Models define the core business entities and             │
│    their properties. Pure TypeScript interfaces.            │
└──────────────────────┬─────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────┐
│                  Database Layer                             │
│              (Supabase / PostgreSQL)                        │
└────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Models (`src/models/`)

**Purpose**: Define domain entities and their structure

**Responsibilities**:
- Define interfaces for domain entities
- Define types for entity properties
- Define input/update types for entities
- No business logic, just data structures

**Files**:
- `User.model.ts` - User entity definition
- `Scholarship.model.ts` - Scholarship entity definition
- `Application.model.ts` - Application entity definition
- `Notification.model.ts` - Notification entity definition

**Example**:
```typescript
export interface User {
  id: string;
  email: string;
  name?: string;
  // ... other properties
}

export interface CreateUserInput {
  id: string;
  email: string;
  name?: string;
}
```

### 2. DTOs (`src/dtos/`)

**Purpose**: Define API contracts for request/response

**Responsibilities**:
- Define request body structures
- Define response structures
- Separate external API contract from internal models
- Enable API versioning without changing models

**Files**:
- `application.dto.ts` - Application API contracts
- `scholarship.dto.ts` - Scholarship API contracts
- `notification.dto.ts` - Notification API contracts
- `readiness.dto.ts` - Readiness score API contracts

**Example**:
```typescript
export interface CreateApplicationDTO {
  scholarship_id: string;
}

export interface ApplicationResponseDTO {
  id: string;
  user_id: string;
  scholarship_id: string;
  status: ApplicationStatus;
  applied_at: string;
}
```

### 3. Repositories (`src/repositories/`)

**Purpose**: Abstract database operations

**Responsibilities**:
- Execute database queries
- Handle database errors
- Provide clean interface for data access
- No business logic
- Return domain models

**Files**:
- `base.repository.ts` - Base class with common functionality
- `user.repository.ts` - User data access
- `scholarship.repository.ts` - Scholarship data access
- `application.repository.ts` - Application data access
- `notification.repository.ts` - Notification data access

**Example**:
```typescript
export class ApplicationRepository extends BaseRepository {
  async findByUserId(userId: string): Promise<Application[]> {
    const { data, error } = await this.supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }
}
```

### 4. Services (`src/services/`)

**Purpose**: Implement business logic

**Responsibilities**:
- Implement use cases and business rules
- Orchestrate multiple repositories
- Transform data between layers
- Validate business rules
- Return DTOs

**Files**:
- `application.service.ts` - Application business logic
- `scholarship.service.ts` - Scholarship matching logic
- `notification.service.ts` - Notification management
- `readiness.service.ts` - Readiness calculation

**Example**:
```typescript
export class ApplicationService {
  async applyToScholarship(
    userId: string,
    scholarshipId: string
  ): Promise<ApplicationSuccessResponseDTO> {
    // 1. Validate scholarship exists
    const scholarship = await this.scholarshipRepo.findById(scholarshipId);
    if (!scholarship) throw new Error('Scholarship not found');
    
    // 2. Check if already applied
    const hasApplied = await this.applicationRepo
      .existsByUserAndScholarship(userId, scholarshipId);
    if (hasApplied) throw new Error('Already applied');
    
    // 3. Create application
    const application = await this.applicationRepo.create({
      user_id: userId,
      scholarship_id: scholarshipId,
    });
    
    // 4. Create notification
    await this.notificationRepo.create({
      user_id: userId,
      message: `Applied to ${scholarship.title}`,
    });
    
    return this.mapToDTO(application);
  }
}
```

### 5. Controllers (`src/app/api/`)

**Purpose**: Handle HTTP requests

**Responsibilities**:
- Validate request format
- Extract request data
- Call appropriate service methods
- Handle errors and return appropriate HTTP responses
- Convert between HTTP and application layer

**Files**:
- `apply/route.ts` - Application endpoints
- `match/route.ts` - Scholarship matching
- `notifications/route.ts` - Notification management
- `readiness/route.ts` - Readiness calculation

**Example**:
```typescript
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateApplicationDTO = await request.json();
    
    const service = new ApplicationService(supabase);
    const result = await service.applyToScholarship(user.id, body.scholarship_id);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    // Handle errors appropriately
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

## Data Flow

### Request Flow (Top to Bottom)

1. **User Action** → User clicks "Apply" button
2. **HTTP Request** → POST /api/apply
3. **Controller** → Validates request, extracts data
4. **Service** → Implements business logic
5. **Repository** → Executes database query
6. **Database** → Returns data
7. **Repository** → Returns model
8. **Service** → Transforms to DTO
9. **Controller** → Returns HTTP response
10. **UI** → Updates with response

### Example Flow: Applying to Scholarship

```
User clicks "Apply"
       ↓
POST /api/apply { scholarship_id: "123" }
       ↓
Controller validates and authenticates
       ↓
ApplicationService.applyToScholarship(userId, scholarshipId)
       ↓
Service validates scholarship exists (via ScholarshipRepository)
       ↓
Service checks if already applied (via ApplicationRepository)
       ↓
Service creates application (via ApplicationRepository)
       ↓
Service creates notification (via NotificationRepository)
       ↓
Service returns DTO
       ↓
Controller returns 201 Created with application data
       ↓
UI shows success message
```

## Design Patterns

### 1. Repository Pattern

Abstracts data access logic from business logic.

**Benefits**:
- Easier to test (can mock repositories)
- Can switch databases without changing business logic
- Centralized data access code

### 2. Service Layer Pattern

Encapsulates business logic separate from controllers.

**Benefits**:
- Reusable business logic
- Easier to test business rules
- Controllers stay thin

### 3. Dependency Injection

Services receive their dependencies (repositories) through constructor.

**Benefits**:
- Loose coupling
- Easier to test with mocks
- More flexible and maintainable

### 4. DTO Pattern

Separate API contracts from domain models.

**Benefits**:
- API can evolve independently from domain
- Control what data is exposed
- Type-safe API contracts

## Best Practices

### 1. Separation of Concerns

- Each layer has a single responsibility
- Controllers don't contain business logic
- Services don't handle HTTP concerns
- Repositories don't implement business rules

### 2. Dependency Direction

Dependencies flow inward:
- Controllers depend on Services
- Services depend on Repositories
- Repositories depend on Models
- Models depend on nothing

### 3. Error Handling

- Repositories throw errors
- Services catch and transform errors
- Controllers handle HTTP error responses

### 4. Type Safety

- Use TypeScript strict mode
- Define explicit types for all data
- Use DTOs for API boundaries

### 5. Testability

Each layer can be tested independently:
```typescript
// Test service with mocked repository
const mockRepo = { findById: jest.fn() };
const service = new ApplicationService(mockRepo);
```

## Adding New Features

Follow this checklist:

1. ✅ Define model in `src/models/`
2. ✅ Create DTO in `src/dtos/`
3. ✅ Add repository methods in `src/repositories/`
4. ✅ Implement service logic in `src/services/`
5. ✅ Create API route in `src/app/api/`
6. ✅ Update UI components
7. ✅ Write tests for each layer

## Testing Strategy

### Unit Tests

- **Models**: Type checking (handled by TypeScript)
- **Repositories**: Test with mock Supabase client
- **Services**: Test with mocked repositories
- **Controllers**: Test with mocked services

### Integration Tests

- Test full flow from controller to database
- Use test database

### E2E Tests

- Test complete user flows
- Use staging environment

## Performance Considerations

1. **Database Queries**: Repositories use indexes
2. **Caching**: Can be added at service layer
3. **Pagination**: Implement in repositories
4. **Lazy Loading**: Use Next.js features

## Security

1. **Authentication**: Handled at controller level
2. **Authorization**: Checked in services
3. **Input Validation**: Controllers validate inputs
4. **SQL Injection**: Prevented by Supabase
5. **RLS**: Database-level security

## Future Enhancements

- Add caching layer
- Implement event-driven architecture
- Add message queue for async operations
- Implement CQRS for read/write separation
- Add API versioning

---

This architecture ensures the application is maintainable, testable, and scalable. Each layer has a clear responsibility and can evolve independently.
