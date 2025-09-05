---
title: Authorization
description: Authorization and permissions documentation for Base Framework.
---

# Authorization

Understanding Base Framework's comprehensive authorization system with role-based access control, permissions, and route protection.

## Core Authorization Module

Located at `core/app/authorization/`

- Role-based access control
- Permission management
- Route protection
- API key authentication
- Middleware integration

## First User Owner System

Base Framework automatically assigns the **Owner** role to the first user who registers, ensuring secure system initialization without manual intervention:

### Automatic Role Assignment

**First User**
- Automatically receives **Owner** role
- Full system access and control
- Can manage all users and permissions
- No manual role assignment needed

**Subsequent Users**
- Automatically receive **Member** role
- Standard limited access
- Can be promoted by Owner/Administrator
- Secure default permissions

## Role Hierarchy

Base Framework uses a hierarchical role system with four default roles, each with specific permissions and access levels:

### Owner (Role ID: 1)

Full system access - Manage all users - System configuration  
**First User**

### Administrator (Role ID: 2)

Administrative access - User management - Most operations

### Member (Role ID: 3)

Standard access - Limited permissions - Default for new users  
**Default**

### Viewer (Role ID: 4)

Read-only access - View permissions only

## Role-Based Access Control (RBAC)

Base Framework includes a flexible RBAC system that allows you to define roles and permissions for your application:

### Users

Assigned one or more roles

### Roles

Collections of permissions

### Permissions

Specific access rights

## Authorization Models

The authorization system consists of four main data models that work together:

### Roles

System and custom roles with hierarchical permissions
- **Owner** - Full system access
- **Administrator** - Admin privileges
- **Member** - Standard user access
- **External** - Limited external access

### Permissions

Specific action rights on resource types
- **Actions:** create, read, update, delete, list
- **Resources:** posts, users, projects, etc.

### Role Permissions

Links roles to their allowed permissions
Many-to-many relationship mapping roles to specific permissions

### Resource Permissions

Fine-grained access to specific resources
- **Scopes:** own, team, all
- Resource-specific overrides

## Route Protection

Protect your API endpoints using middleware decorators:

### Go Code Example

```go
// Require authentication (basic auth middleware)
router.GET("/api/protected", controller.ProtectedEndpoint, authMiddleware)

// Require specific role
router.POST("/api/admin", controller.AdminEndpoint, authorization.HasRole("Administrator"))

// Require specific permission
router.DELETE("/api/posts/:id", controller.DeletePost, authorization.CanAccess("delete", "Post", "id"))

// Multiple middleware combined
router.PUT("/api/posts/:id", controller.UpdatePost,
    authMiddleware,
    authorization.CanAccess("update", "Post", "id"))
```

## Authorization Middleware in Controllers

Base Framework provides intuitive authorization middleware functions with clean, readable syntax:

### New Intuitive Syntax

Use the new Can() functions for clear, readable authorization checks:

#### Clean Authorization Syntax

```go
import "authorization"

func (c *PostController) Routes(router *router.RouterGroup) {
    // Clean, readable authorization
    router.POST("/posts", c.Create, authorization.Can("create", "Post"))
    router.GET("/posts", c.List, authorization.Can("list", "Post"))
    router.PUT("/posts/:id", c.Update, authorization.CanAccess("update", "Post", "id"))
    router.DELETE("/posts/:id", c.Delete, authorization.CanAccess("delete", "Post", "id"))

    // Role-based protection
    adminGroup := router.Group("/admin", authorization.HasRole("Administrator"))
    ownerGroup := router.Group("/owner", authorization.HasRole("Owner"))
}
```

### 1. Can() - General Resource Protection

The intuitive way to check if a user has permission to perform an action on a resource type.

#### New Syntax (Recommended)

Can() Function

```go
// Clean, readable syntax
router.POST("/posts", c.Create, authorization.Can("create", "Post"))
router.GET("/posts", c.List, authorization.Can("list", "Post"))
router.PUT("/posts", c.Update, authorization.Can("update", "Post"))

// Multiple permissions
router.POST("/posts", c.Create,
    authorization.Can("create", "Post"),
    authorization.HasRole("Member"))
```

#### Legacy Syntax

AuthMiddleware

```go
// Legacy syntax (still supported)
router.POST("/posts", c.Create,
    authorization.AuthMiddleware("post", "create"))
router.GET("/posts", c.List,
    authorization.AuthMiddleware("post", "list"))
```

### 2. CanAccess() - Specific Resource Protection

Checks if a user has permission to perform an action on a specific resource instance.

#### New Syntax (Recommended)

CanAccess() Function

```go
// Check access to specific resources
router.PUT("/posts/:id", c.Update,
    authorization.CanAccess("update", "Post", "id"))
router.DELETE("/posts/:id", c.Delete,
    authorization.CanAccess("delete", "Post", "id"))

// Different parameter names
router.PUT("/users/:userId/posts/:postId", c.UpdateUserPost,
    authorization.CanAccess("update", "Post", "postId"))
```

#### Legacy Syntax

ResourceAuthMiddleware

```go
// Legacy syntax (still supported)
router.PUT("/posts/:id", c.Update,
    authorization.ResourceAuthMiddleware("post", "update", "id"))
router.DELETE("/posts/:id", c.Delete,
    authorization.ResourceAuthMiddleware("post", "delete", "id"))
```

### 3. HasRole() - Role-Based Protection

Ensures the user has a specific role (Owner, Administrator, Member, External).

#### New Syntax (Recommended)

HasRole() Function

```go
// Clean role checking
adminGroup := router.Group("/admin",
    authorization.HasRole("Administrator"))
ownerGroup := router.Group("/owner",
    authorization.HasRole("Owner"))

// Individual routes
router.GET("/admin/settings", c.GetSettings,
    authorization.HasRole("Administrator"))

// Multiple role checks
router.POST("/posts", c.Create,
    authorization.HasRole("Member"),
    authorization.Can("create", "Post"))
```

#### Legacy Syntax

RequireRole

```go
// Legacy syntax (still supported)
adminGroup := router.Group("/admin",
    authorization.RequireRole("Administrator"))
ownerGroup := router.Group("/owner",
    authorization.RequireRole("Owner"))
```

### 4. Advanced Permission Checks

Additional flexible authorization functions for complex scenarios.

#### CanAny() - Any Permission

OR Logic

```go
// User needs ANY of these permissions
router.GET("/posts/moderate", c.ModeratePosts,
    authorization.CanAny([]string{
        "moderate:Post",
        "delete:Post",
        "update:Post",
    }))

// Editor or admin access
router.POST("/content", c.CreateContent,
    authorization.CanAny([]string{
        "create:Content",
        "edit:Content",
    }))
```

#### CanAll() - All Permissions

AND Logic

```go
// User needs ALL of these permissions
router.POST("/posts/publish", c.PublishPost,
    authorization.CanAll([]string{
        "create:Post",
        "publish:Post",
        "read:Post",
    }))

// Requires multiple related permissions
router.DELETE("/users/:id", c.DeleteUser,
    authorization.CanAll([]string{
        "delete:User",
        "manage:User",
    }))
```

## Authorization API Endpoints

The authorization module exposes REST API endpoints for managing roles, permissions, and checking access:

### Role Management

- GET /authorization/roles - List
- GET /authorization/roles/:id - Get
- POST /authorization/roles - Create
- PUT /authorization/roles/:id - Update
- DELETE /authorization/roles/:id - Delete

### Permission Management

- GET /authorization/roles/:id/permissions - List
- POST /authorization/roles/:id/permissions - Assign
- DELETE /authorization/roles/:id/permissions/:permId - Revoke
- POST /authorization/check - Check

## Frontend Permission Checking

Check user permissions from your frontend using the authorization API endpoints:

### Vue.js Composable Example

useAuth.js Composable

```javascript
// composables/useAuth.js
import { ref, computed } from 'vue'

const user = ref(null)
const token = ref(localStorage.getItem('auth_token'))

export function useAuth() {
    const isAuthenticated = computed(() => !!token.value && !!user.value)

    // Check if user has permission for a resource type and action
    const checkPermission = async (resourceType, action, resourceId = null) => {
        if (!isAuthenticated.value) return false

        try {
            const response = await fetch('/api/authorization/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`,
                    'Base-Orgid': getCurrentOrgId() // Your org ID
                },
                body: JSON.stringify({
                    user_id: user.value.id,
                    organization_id: getCurrentOrgId(),
                    resource_type: resourceType,
                    action: action,
                    resource_id: resourceId
                })
            })

            const data = await response.json()
            return data.has_permission || false
        } catch (error) {
            console.error('Permission check failed:', error)
            return false
        }
    }

    // Check if user has a specific role
    const hasRole = (roleName) => {
        return user.value?.roles?.some(role => role.name === roleName) || false
    }

    return {
        user,
        token,
        isAuthenticated,
        checkPermission,
        hasRole
    }
}
```

### Vue Component Usage

Component Example

```vue
<template>
  <div class="post-actions">
    <!-- Show edit button only if user can update posts -->
    <button
      v-if="canEditPost"
      @click="editPost"
      class="btn btn-primary">
      Edit Post
    </button>

    <!-- Show delete button only if user can delete this specific post -->
    <button
      v-if="canDeletePost"
      @click="deletePost"
      class="btn btn-danger">
      Delete Post
    </button>

    <!-- Show admin panel only for administrators -->
    <router-link
      v-if="isAdmin"
      to="/admin"
      class="btn btn-secondary">
      Admin Panel
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps(['post'])
const { checkPermission, hasRole } = useAuth()

const canEditPost = ref(false)
const canDeletePost = ref(false)
const isAdmin = ref(false)

onMounted(async () => {
    // Check general permission to update posts
    canEditPost.value = await checkPermission('post', 'update')

    // Check permission to delete this specific post
    canDeletePost.value = await checkPermission('post', 'delete', props.post.id)

    // Check if user has Administrator role
    isAdmin.value = hasRole('Administrator')
})
</script>
```

### JavaScript/React Example

React Hook

```javascript
// hooks/usePermissions.js
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

export function usePermissions() {
    const { user, token, isAuthenticated } = useAuth()

    const checkPermission = async (resourceType, action, resourceId = null) => {
        if (!isAuthenticated) return false

        try {
            const response = await fetch('/api/authorization/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Base-Orgid': getCurrentOrgId()
                },
                body: JSON.stringify({
                    user_id: user.id,
                    organization_id: getCurrentOrgId(),
                    resource_type: resourceType,
                    action: action,
                    resource_id: resourceId
                })
            })

            const data = await response.json()
            return data.has_permission || false
        } catch (error) {
            console.error('Permission check failed:', error)
            return false
        }
    }

    return { checkPermission }
}

// Component usage
function PostComponent({ post }) {
    const [canEdit, setCanEdit] = useState(false)
    const [canDelete, setCanDelete] = useState(false)
    const { checkPermission } = usePermissions()

    useEffect(() => {
        const checkPermissions = async () => {
            setCanEdit(await checkPermission('post', 'update'))
            setCanDelete(await checkPermission('post', 'delete', post.id))
        }
        checkPermissions()
    }, [post.id])

    return (
        <div className="post-actions">
            {canEdit && <button onClick={editPost}>Edit</button>}
            {canDelete && <button onClick={deletePost}>Delete</button>}
        </div>
    )
}
```

## Integration Examples

### Protecting Generated Modules

When you generate modules with Base Framework, you can easily add authentication to protect your endpoints:

#### Generated Controller with Auth

```go
func (c *PostController) Routes(router *router.RouterGroup) {
    // Public endpoints (no auth required)
    router.GET("/posts", c.List)                    // Public post listing
    router.GET("/posts/:id", c.Get)               // Public post view

    // Protected endpoints - using new intuitive syntax
    router.POST("/posts", c.Create, authorization.Can("create", "Post"))
    router.PUT("/posts/:id", c.Update, authorization.CanAccess("update", "Post", "id"))
    router.DELETE("/posts/:id", c.Delete, authorization.CanAccess("delete", "Post", "id"))

    // Admin endpoints (role-based protection)
    adminGroup := router.Group("/admin/posts", authorization.HasRole("Administrator"))
    {
        adminGroup.DELETE("/:id", c.ForceDelete)      // Admin force delete
        adminGroup.PUT("/:id/publish", c.Publish)     // Admin publish
        adminGroup.PUT("/:id/feature", c.Feature)     // Admin feature
    }

    // Owner endpoints (highest level access)
    ownerGroup := router.Group("/owner/posts", authorization.HasRole("Owner"))
    {
        ownerGroup.GET("/analytics", c.Analytics)      // Owner analytics
        ownerGroup.PUT("/settings", c.UpdateSettings) // Owner settings
    }
}
```