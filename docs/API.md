# API Documentation

Complete API reference for the TravelPlanner backend services.

## 🔗 Base URLs

- **Development**: `http://localhost:8000`
- **Staging**: `https://travelplanner-staging.railway.app`
- **Production**: `https://api.travelplanner.com`

## 🔐 Authentication

TravelPlanner uses Google OAuth 2.0 for authentication. All protected endpoints require a valid JWT token.

### Authentication Flow

1. **Initiate OAuth**: Redirect to Google OAuth
2. **Callback**: Handle OAuth callback and receive JWT
3. **API Requests**: Include JWT in Authorization header

```http
Authorization: Bearer <jwt_token>
```

### Auth Endpoints

#### Google OAuth Callback
```http
POST /api/v1/auth/google
Content-Type: application/json

{
  "code": "google_oauth_code",
  "state": "optional_state"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 86400,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar_url": "https://avatar.url"
    }
  }
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

## 🧳 Trip Management

### List Trips

```http
GET /api/v1/trips?page=1&per_page=20&status=planning
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (max: 100, default: 20)
- `status` (string): Filter by status (`planning`, `decided`, `archived`)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Europe Summer Trip",
        "description": "2-week adventure across Europe",
        "owner_id": "uuid",
        "estimated_start_date": "2025-07-01",
        "estimated_end_date": "2025-07-14",
        "status": "planning",
        "member_count": 4,
        "city_count": 6,
        "created_at": "2025-01-20T10:00:00Z",
        "updated_at": "2025-01-20T10:00:00Z"
      }
    ],
    "total": 15,
    "page": 1,
    "per_page": 20,
    "pages": 1
  }
}
```

### Create Trip

```http
POST /api/v1/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Europe Summer Trip",
  "description": "2-week adventure across Europe",
  "estimated_start_date": "2025-07-01",
  "estimated_end_date": "2025-07-14"
}
```

**Validation Rules:**
- `name`: Required, 1-100 characters, unique per user
- `description`: Optional, max 500 characters
- `estimated_start_date`: Optional, must be future date
- `estimated_end_date`: Optional, must be after start date

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Europe Summer Trip",
    "description": "2-week adventure across Europe",
    "owner_id": "uuid",
    "estimated_start_date": "2025-07-01",
    "estimated_end_date": "2025-07-14",
    "status": "planning",
    "created_at": "2025-01-20T10:00:00Z",
    "updated_at": "2025-01-20T10:00:00Z"
  }
}
```

### Get Trip Details

```http
GET /api/v1/trips/{trip_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Europe Summer Trip",
    "description": "2-week adventure across Europe",
    "owner_id": "uuid",
    "estimated_start_date": "2025-07-01",
    "estimated_end_date": "2025-07-14",
    "status": "planning",
    "members": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "role": "owner",
        "joined_at": "2025-01-20T10:00:00Z",
        "user": {
          "id": "uuid",
          "name": "John Doe",
          "email": "john@example.com",
          "avatar_url": "https://avatar.url"
        }
      }
    ],
    "cities": [
      {
        "id": "uuid",
        "city": {
          "id": "uuid",
          "name": "Paris",
          "country": "France",
          "photo_url": "https://photo.url"
        },
        "status": "considering",
        "added_by": "uuid",
        "vote_summary": {
          "like": 2,
          "dont_mind": 1,
          "dislike": 0
        }
      }
    ],
    "created_at": "2025-01-20T10:00:00Z",
    "updated_at": "2025-01-20T10:00:00Z"
  }
}
```

### Update Trip

```http
PUT /api/v1/trips/{trip_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Trip Name",
  "description": "Updated description",
  "estimated_start_date": "2025-08-01",
  "estimated_end_date": "2025-08-15"
}
```

### Delete Trip

```http
DELETE /api/v1/trips/{trip_id}
Authorization: Bearer <token>
```

## 👥 Trip Membership

### Generate Invite Link

```http
POST /api/v1/trips/{trip_id}/invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "expires_in_hours": 168
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invite_link": "https://app.travelplanner.com/invite/abc123token",
    "token": "abc123token",
    "expires_at": "2025-01-27T10:00:00Z"
  }
}
```

### Join Trip via Invite

```http
POST /api/v1/invites/{token}/join
Authorization: Bearer <token>
```

### List Trip Members

```http
GET /api/v1/trips/{trip_id}/members
Authorization: Bearer <token>
```

### Remove Member

```http
DELETE /api/v1/trips/{trip_id}/members/{user_id}
Authorization: Bearer <token>
```

**Note:** Only trip owners can remove members.

## 🏙️ City Management

### Search Cities

```http
GET /api/v1/cities/search?q=paris&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `q` (string): Search query (min 2 characters)
- `limit` (integer): Max results (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "google_place_id": "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
      "name": "Paris",
      "country": "France",
      "formatted_address": "Paris, France",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "photo_url": "https://photo.url",
      "description": "The City of Light"
    }
  ]
}
```

### Add City to Trip

```http
POST /api/v1/trips/{trip_id}/cities
Authorization: Bearer <token>
Content-Type: application/json

{
  "google_place_id": "ChIJD7fiBh9u5kcRYJSMaMOCCwQ"
}
```

### Remove City from Trip

```http
DELETE /api/v1/trips/{trip_id}/cities/{city_id}
Authorization: Bearer <token>
```

## 🗳️ Voting System

### Get Trip Votes

```http
GET /api/v1/trips/{trip_id}/votes
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "city_id": "uuid",
      "user_id": "uuid",
      "vote_type": "like",
      "comment": "Love this city!",
      "created_at": "2025-01-20T10:00:00Z",
      "city": {
        "id": "uuid",
        "name": "Paris",
        "country": "France"
      },
      "user": {
        "id": "uuid",
        "name": "John Doe"
      }
    }
  ]
}
```

### Cast Vote

```http
POST /api/v1/trips/{trip_id}/votes
Authorization: Bearer <token>
Content-Type: application/json

{
  "city_id": "uuid",
  "vote_type": "like",
  "comment": "Looks amazing!"
}
```

**Vote Types:**
- `like`: Positive vote
- `dont_mind`: Neutral vote
- `dislike`: Negative vote

### Get City Votes

```http
GET /api/v1/trips/{trip_id}/cities/{city_id}/votes
Authorization: Bearer <token>
```

## 🎯 User Preferences

### Get Trip Preferences

```http
GET /api/v1/trips/{trip_id}/preferences
Authorization: Bearer <token>
```

### Update User Preferences

```http
PUT /api/v1/trips/{trip_id}/preferences/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "budget_range": "medium",
  "climate_preference": ["temperate", "warm"],
  "activity_preferences": ["culture", "food", "nightlife"],
  "accommodation_type": ["hotel", "airbnb"]
}
```

## 📋 Itinerary Management

### Finalize City Selections

```http
PUT /api/v1/trips/{trip_id}/finalize
Authorization: Bearer <token>
Content-Type: application/json

{
  "selected_city_ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Note:** Only trip owners can finalize selections.

### Update Itinerary

```http
PUT /api/v1/trips/{trip_id}/itinerary
Authorization: Bearer <token>
Content-Type: application/json

{
  "cities": [
    {
      "city_id": "uuid1",
      "position": 1,
      "duration_days": 3
    },
    {
      "city_id": "uuid2", 
      "position": 2,
      "duration_days": 4
    }
  ]
}
```

## 📊 Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "type": "ValidationError",
    "details": {
      "field": "specific_field",
      "additional_context": "value"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `AUTH_ERROR`: Authentication failed
- `PERMISSION_DENIED`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict (e.g., duplicate name)
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `EXTERNAL_SERVICE_ERROR`: External API error
- `INTERNAL_ERROR`: Server error

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request / Validation Error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `429`: Too Many Requests
- `500`: Internal Server Error
- `503`: Service Unavailable

## 🚀 Rate Limiting

Default rate limits:
- **General endpoints**: 100 requests/minute
- **Search endpoints**: 60 requests/minute
- **Trip creation**: 10 requests/minute
- **Vote casting**: 30 requests/minute

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```

## 🔄 Real-time Updates

TravelPlanner supports WebSocket connections for real-time collaboration:

**Connection:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/trips/{trip_id}?token={jwt_token}')
```

**Event Types:**
- `trip_updated`: Trip information changed
- `member_joined`: New member joined
- `member_left`: Member left trip
- `city_added`: City added to consideration
- `city_removed`: City removed from consideration
- `vote_cast`: New vote submitted
- `city_decided`: Owner made final decision

**Event Format:**
```json
{
  "type": "vote_cast",
  "data": {
    "city_id": "uuid",
    "user_id": "uuid",
    "vote_type": "like",
    "vote_summary": {
      "like": 3,
      "dont_mind": 1,
      "dislike": 0
    }
  },
  "timestamp": "2025-01-20T10:00:00Z"
}
```

## 📝 Request/Response Examples

### Complete Trip Creation Flow

1. **Create Trip**
2. **Add Cities**
3. **Invite Members**
4. **Cast Votes**
5. **Finalize Selections**

See the [Development Guide](./DEVELOPMENT.md) for code examples and integration patterns.