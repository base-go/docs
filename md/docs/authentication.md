---
title: Authentication
description: Authentication documentation for Base Framework.
---

# Authentication

Understanding Base Framework's comprehensive authentication system with JWT tokens, OAuth integration, and secure user management.

## Core Authentication Module

Located at `core/app/authentication/`

- JWT token generation
- User login/logout
- Password hashing
- Token validation
- Session management

## Authentication Flow

### JWT Authentication Process

1. **User Registration/Login**  
   POST to `/api/auth/login` or `/api/auth/register`

2. **Credential Validation**  
   Password verification using bcrypt hashing

3. **JWT Token Generation**  
   Signed JWT with user ID, extended data, and expiration

4. **Token Storage**  
   Client stores token in localStorage or httpOnly cookie

### API Authentication Example

#### Login Request

**cURL Example**

```bash
curl -X POST http://localhost:8100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

#### Response with Role Information

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "role_id": 1,
  "role_name": "Owner",
  "avatar_url": "",
  "last_login": "2025-09-02T15:44:05+02:00",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "exp": 1756908308,
  "extend": {
    "role": {
      "id": 1,
      "name": "Owner"
    },
    "user_id": 1
  }
}
```

#### Authenticated API Call

Using JWT Token

```bash
curl -X GET http://localhost:8100/api/posts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## OAuth Integration

### Supported OAuth Providers

#### Google OAuth

GET /api/oauth/google

#### GitHub OAuth

GET /api/oauth/github

#### Facebook OAuth

GET /api/oauth/facebook

#### Custom Provider

Easily add new providers

### OAuth Configuration

Configure OAuth providers in your .env file:

#### .env Configuration

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URL=http://localhost:8100/api/oauth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URL=http://localhost:8100/api/oauth/github/callback
```

## API Key Authentication

Base Framework supports multiple authentication methods. **Bearer tokens (JWT) are the default for all generated modules**, while API keys provide additional flexibility for service-to-service communication:

### Authentication Methods in Base Framework

**Bearer Token (JWT) - Default**
- Header: `Authorization: Bearer token`
- **Default auth for generated modules**
- User sessions, temporary access
- Expires automatically
- Contains user context

**API Key - Environment Variable**
- Header: `X-API-Key: key`
- **Set via environment variable**
- Required for auth management operations
- Service-to-service communication
- Application-level access control

### Configure API Key

#### .env Configuration

```bash
# JWT secret key
JWT_SECRET=my_super_secret_key_123

# Send this key in the header of the request for endpoints that require it
API_KEY=api
```

### Use API Key in Requests

#### X-API-Key Header

```bash
curl -X GET http://localhost:8100/api/posts \
  -H "X-API-Key: api"
```

## Extended Authentication

Base Framework supports extending JWT tokens with custom data through the app.Extend() function. This allows you to include additional context like company IDs, roles, or any other data in both the authentication response and JWT token payload.

### app.Extend() Function

Located at app/init.go, this function is called during authentication to extend the user context with additional data. **You must customize this function in your app to add extended data.**

#### app/init.go

```go
func Extend(user_id uint) any {
    // Get database instance
    if database.DB == nil {
        return map[string]any{
            "user_id": user_id,
        }
    }

    // Example: Add company_id to the context
    return map[string]any{
        "user_id":    user_id,
        "company_id": 1,
    }
}
```

**Important:** You must modify the app.Extend() function in base/app/init.go to add your custom extended data. The default implementation only returns the user_id.

### Enhanced Login Response

When app.Extend() returns data, it's included in both the login response and embedded in the JWT token payload.

#### Login Request

POST /api/auth/login

```bash
curl -X 'POST' \
  'http://localhost:8100/api/auth/login' \
  -H 'accept: application/json' \
  -H 'X-Api-Key: api' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Enhanced Response

Response with Extended Data

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "avatar_url": "",
  "last_login": "2025-09-02T15:42:51+02:00",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "exp": 1756907010,
  "extend": {
    "company_id": 1,
    "user_id": 1
  }
}
```

### JWT Token Structure

The JWT token payload includes the extended data, making it available for authorization checks and middleware without additional database queries.

#### JWT Payload Structure

Decoded JWT Payload

```json
{
  "exp": 1756907010,
  "extend": {
    "company_id": 1,
    "user_id": 1
  },
  "user_id": 1
}
```

#### Common Use Cases

##### Multi-tenant Applications

Include company_id or tenant_id for data isolation

##### Role-based Access

Embed user roles and permissions in the token

##### Context Data

Include any additional context your app needs

#### Benefits

- **Reduced Database Queries:** Context data is embedded in the JWT token
- **Consistent Data:** Same extended data available in both response and token
- **Flexible Implementation:** Customize the Extend function for your specific needs
- **Middleware Ready:** Extended data is available in authorization middleware

## Security Features

### Password Security

- bcrypt hashing with salt rounds
- Password strength validation
- Password reset flows
- Account lockout protection

### Token Management

- JWT with configurable expiration
- Refresh token rotation
- Token blacklisting
- Session management

### Rate Limiting

- IP-based rate limiting
- User-based rate limiting
- Endpoint-specific limits
- Sliding window algorithm

### Audit & Monitoring

- Login attempt logging
- Permission change tracking
- Failed authentication alerts
- Security event notifications

## Context Helpers & Retrieving the Authenticated User

### Using the Request Context

#### Go Example

```go
func (c *Controller) GetProfile(ctx *router.Context) error {
    userID, exists := ctx.Get("user_id")
    if !exists {
        return ctx.JSON(401, map[string]any{"error": "Unauthorized"})
    }
    
    // userID is now available for use
    user, err := c.service.GetUserByID(userID.(uint))
    if err != nil {
        return ctx.JSON(404, map[string]any{"error": "User not found"})
    }
    
    return ctx.JSON(200, user)
}
```

## Attaching Custom Values to Context

### Adding Your Own Context Keys

#### Go Example

```go
package middleware

import (
    "base/core/router"
)

// Custom middleware to add company context
func AddCompanyContext() router.Middleware {
    return func(ctx *router.Context) error {
        // Get user_id from existing context (set by auth middleware)
        userID, exists := ctx.Get("user_id")
        if !exists {
            return ctx.Next()
        }
        
        // Fetch company_id from database or JWT extended data
        companyID := getCompanyIDFromUser(userID.(uint))
        
        // Add company_id to context
        ctx.Set("company_id", companyID)
        
        return ctx.Next()
    }
}

// Usage in your routes
func (c *Controller) Routes(router *router.RouterGroup) {
    // Apply both auth and company context middleware
    router.Use(authMiddleware)
    router.Use(AddCompanyContext())
    
    router.GET("/company-data", c.GetCompanyData)
}
```