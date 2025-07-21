# TravelPlanner Frontend

React frontend application for collaborative travel planning.

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# From project root
docker-compose up frontend backend
```

### Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run type-check      # TypeScript type checking

# Testing
npm run test            # Run unit tests
npm run test:coverage   # Run tests with coverage
npm run test:ui         # Open Vitest UI
npm run test:e2e        # Run E2E tests with Playwright
```

## 🏗️ Architecture

```
src/
├── app/                # App setup and providers
├── features/           # Feature-based organization
│   ├── auth/          # Authentication
│   ├── trips/         # Trip management
│   ├── cities/        # City discovery
│   └── voting/        # Voting system
├── shared/            # Shared utilities
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   ├── stores/        # Zustand stores
│   ├── types/         # TypeScript definitions
│   └── utils/         # Helper functions
├── assets/            # Static assets
└── styles/            # Global styles
```

### Key Technologies

- **React 18**: Component framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling framework
- **Zustand**: State management
- **React Query**: Server state management
- **React Hook Form**: Form handling
- **Zod**: Schema validation

## 🎨 UI Components

### Design System

```typescript
// Button variants
<Button variant="primary" size="md">Primary</Button>
<Button variant="secondary" size="sm">Secondary</Button>
<Button variant="outline" size="lg">Outline</Button>

// Form components
<Input placeholder="Enter text" />
<Textarea placeholder="Enter description" />
<Select options={options} />

// Layout components
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Styling Guidelines

- Use **Tailwind CSS** utility classes
- Follow **mobile-first** responsive design
- Use **semantic color names** (primary, secondary, etc.)
- Implement **dark mode** support
- Ensure **accessibility** compliance

## 🔧 State Management

### Zustand Stores

```typescript
// Trip store example
const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  currentTrip: null,
  loading: false,
  
  fetchTrips: async () => {
    set({ loading: true })
    try {
      const trips = await tripService.getAll()
      set({ trips, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  selectTrip: (tripId) => {
    const trip = get().trips.find(t => t.id === tripId)
    set({ currentTrip: trip })
  }
}))
```

### React Query

```typescript
// Data fetching hook
const useTrips = () => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: () => tripService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hook
const useCreateTrip = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: tripService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['trips'])
    }
  })
}
```

## 🧪 Testing

### Unit Testing

```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react'
import { TripCard } from './TripCard'

describe('TripCard', () => {
  test('renders trip information', () => {
    const trip = { id: '1', name: 'Test Trip' }
    render(<TripCard trip={trip} />)
    
    expect(screen.getByText('Test Trip')).toBeInTheDocument()
  })
})
```

### E2E Testing

```typescript
// Playwright test example
import { test, expect } from '@playwright/test'

test('create new trip', async ({ page }) => {
  await page.goto('/dashboard')
  await page.click('[data-testid="create-trip"]')
  await page.fill('[data-testid="trip-name"]', 'My Trip')
  await page.click('[data-testid="submit"]')
  
  await expect(page.locator('[data-testid="trip-title"]')).toContainText('My Trip')
})
```

## 🌐 API Integration

### Service Layer

```typescript
// API service example
class TripService {
  private api = new ApiClient('/api/v1/trips')
  
  async getAll(): Promise<Trip[]> {
    const response = await this.api.get<ApiResponse<Trip[]>>('/')
    return response.data
  }
  
  async create(data: CreateTripRequest): Promise<Trip> {
    const response = await this.api.post<ApiResponse<Trip>>('/', data)
    return response.data
  }
}
```

### Error Handling

```typescript
// Global error handling
const useErrorHandler = () => {
  return (error: ApiError) => {
    if (error.status === 401) {
      // Redirect to login
      authStore.logout()
    } else if (error.status >= 500) {
      // Show error toast
      toast.error('Something went wrong. Please try again.')
    }
  }
}
```

## 📱 Mobile Support

### Responsive Design

- **Mobile-first** approach with Tailwind CSS
- **Touch-friendly** interface elements
- **Progressive Web App** capabilities
- **Offline** support for basic functionality

### PWA Features

```json
// manifest.json
{
  "name": "TravelPlanner",
  "short_name": "TravelPlanner",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/"
}
```

## 🔐 Environment Variables

```bash
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# Google Maps (for future use)
VITE_GOOGLE_MAPS_API_KEY=your-maps-api-key

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

## 📦 Build & Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run build:analyze
```

### Docker Deployment

```dockerfile
# Multi-stage build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

## 📚 Additional Resources

- [Development Guide](../docs/DEVELOPMENT.md)
- [Component Library](../docs/COMPONENTS.md)
- [Style Guide](../docs/STYLE_GUIDE.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)