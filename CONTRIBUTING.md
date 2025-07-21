# Contributing to TravelPlanner

Thank you for your interest in contributing to TravelPlanner! This guide will help you get started with contributing to the project.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use issue templates** when creating new issues
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. **Check Linear project** for existing feature requests
2. **Create detailed proposals** with:
   - Use case description
   - User stories
   - Technical considerations
   - Mockups or wireframes (if UI-related)

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Submit a pull request**

## 🔧 Development Setup

See the [Development Guide](./docs/DEVELOPMENT.md) for detailed setup instructions.

### Quick Start

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/travelplanner.git
cd travelplanner

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development environment
docker-compose up
```

## 📋 Coding Standards

### Backend (Python)

**Code Style:**
- Use **Black** for code formatting
- Use **isort** for import sorting
- Follow **PEP 8** guidelines
- Use **type hints** for all functions

**Example:**
```python
from typing import List, Optional
from app.models.trip import Trip

async def get_user_trips(
    user_id: str, 
    status: Optional[str] = None
) -> List[Trip]:
    """Get trips for a user with optional status filter."""
    # Implementation here
    pass
```

**Architecture Patterns:**
- Use **repository pattern** for data access
- Implement **service layer** for business logic
- Use **dependency injection** for loose coupling
- Follow **clean architecture** principles

### Frontend (TypeScript/React)

**Code Style:**
- Use **Prettier** for code formatting
- Follow **ESLint** rules
- Use **TypeScript strict mode**
- Use **functional components** with hooks

**Example:**
```typescript
interface TripCardProps {
  trip: Trip
  onEdit: (tripId: string) => void
}

export function TripCard({ trip, onEdit }: TripCardProps) {
  const handleEdit = useCallback(() => {
    onEdit(trip.id)
  }, [trip.id, onEdit])

  return (
    <div className="trip-card">
      <h3>{trip.name}</h3>
      <button onClick={handleEdit}>Edit</button>
    </div>
  )
}
```

**Component Organization:**
- Use **feature-based** folder structure
- Separate **smart/dumb** components
- Implement **custom hooks** for reusable logic
- Use **TypeScript interfaces** for props

### Git Workflow

**Branch Naming:**
```
feature/TRAVEL-123-trip-creation
fix/TRAVEL-456-vote-count-bug
docs/update-api-documentation
refactor/user-service-cleanup
```

**Commit Messages:**
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(trips): add collaborative voting system

- Implement vote casting and aggregation
- Add real-time vote updates via WebSocket
- Include vote comments and user attribution

Closes TRAVEL-123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

## 🧪 Testing Guidelines

### Backend Testing

**Test Structure:**
```python
# tests/unit/services/test_trip_service.py
import pytest
from unittest.mock import Mock, AsyncMock
from app.services.trip_service import TripService

class TestTripService:
    @pytest.fixture
    def trip_service(self):
        return TripService(
            trip_repo=Mock(),
            user_repo=Mock(),
            event_service=Mock()
        )
    
    async def test_create_trip_success(self, trip_service):
        # Arrange
        trip_data = TripCreateRequest(name="Test Trip")
        owner = Mock(id="user_123")
        
        # Act
        result = await trip_service.create_trip(trip_data, owner)
        
        # Assert
        assert result.name == "Test Trip"
```

**Test Categories:**
- **Unit tests**: Test individual functions/methods
- **Integration tests**: Test API endpoints
- **E2E tests**: Test complete user workflows

### Frontend Testing

**Component Testing:**
```typescript
// TripCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { TripCard } from './TripCard'

describe('TripCard', () => {
  const mockTrip = {
    id: 'trip-123',
    name: 'Test Trip',
    status: 'planning'
  }

  test('renders trip name', () => {
    render(<TripCard trip={mockTrip} onEdit={vi.fn()} />)
    expect(screen.getByText('Test Trip')).toBeInTheDocument()
  })

  test('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn()
    render(<TripCard trip={mockTrip} onEdit={onEdit} />)
    
    fireEvent.click(screen.getByText('Edit'))
    expect(onEdit).toHaveBeenCalledWith('trip-123')
  })
})
```

**Test Requirements:**
- **80%+ code coverage** for new code
- **Test edge cases** and error conditions
- **Mock external dependencies**
- **Use descriptive test names**

## 📚 Documentation

### Code Documentation

**Backend:**
```python
class TripService:
    """Service for managing trip operations.
    
    Handles trip creation, updates, member management,
    and business logic validation.
    """
    
    async def create_trip(
        self, 
        trip_data: TripCreateRequest, 
        owner: User
    ) -> TripResponse:
        """Create a new trip with validation.
        
        Args:
            trip_data: Trip creation request data
            owner: User creating the trip
            
        Returns:
            TripResponse: Created trip data
            
        Raises:
            TripNameConflictError: If trip name already exists
            ValidationError: If trip data is invalid
        """
```

**Frontend:**
```typescript
/**
 * Custom hook for managing trip data with React Query
 * 
 * Provides optimistic updates, caching, and error handling
 * for trip-related operations.
 * 
 * @param tripId - The trip identifier
 * @returns Trip data and mutation functions
 */
export function useTrip(tripId: string) {
  // Implementation
}
```

### API Documentation

- Update **OpenAPI/Swagger** schemas
- Include **request/response examples**
- Document **error codes** and scenarios
- Provide **authentication** details

## 🔍 Code Review Process

### Pull Request Guidelines

**PR Description Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Linear Ticket
TRAVEL-123

## Screenshots (if applicable)
[Include screenshots for UI changes]
```

**Review Checklist:**
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Error handling implemented
- [ ] Breaking changes documented

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **At least one approval** required
3. **Linear ticket** referenced
4. **Conflicts resolved** before merge
5. **Squash and merge** to main

## 🚀 Release Process

### Version Management

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Create release branch**: `release/v1.2.0`
2. **Update version numbers** in relevant files
3. **Update CHANGELOG.md** with new features/fixes
4. **Run full test suite**
5. **Create pull request** to main
6. **Tag release** after merge
7. **Deploy to production**

## 📋 Issue Labels

### Type Labels
- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `question`: Further information is needed

### Priority Labels
- `priority:high`: Critical issues
- `priority:medium`: Important but not critical
- `priority:low`: Nice to have

### Component Labels
- `backend`: Backend/API related
- `frontend`: Frontend/UI related
- `database`: Database related
- `deployment`: Infrastructure/deployment

### Status Labels
- `needs-triage`: Needs initial review
- `in-progress`: Currently being worked on
- `blocked`: Waiting on external dependency
- `ready-for-review`: Ready for code review

## 🎯 Linear Integration

### Ticket Management

**Ticket States:**
- **Backlog**: Not yet started
- **Todo**: Ready to start
- **In Progress**: Currently being worked on
- **In Review**: Code review in progress
- **Done**: Completed and deployed

**Ticket Requirements:**
- **Clear acceptance criteria**
- **Estimation** (story points)
- **Labels** for type and component
- **Assignee** for ownership

### GitHub Integration

**Automatic Updates:**
- PRs automatically link to Linear tickets
- Commit messages update ticket status
- PR merges move tickets to "Done"

**Reference Format:**
```
TRAVEL-123: Add user authentication

Implements Google OAuth login flow
- Add OAuth callback endpoint
- Create JWT token generation
- Implement protected route middleware

Closes TRAVEL-123
```

## 🆘 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Linear Comments**: Ticket-specific discussions
- **Pull Request Reviews**: Code-specific feedback

### Resources

- [Development Guide](./docs/DEVELOPMENT.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture Documentation](./docs/ARCHITECTURE.md)

## 📄 License

By contributing to TravelPlanner, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to TravelPlanner! 🎉