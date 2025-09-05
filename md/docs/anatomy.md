---
title: Anatomy
description: Anatomy documentation for Base Framework.
---

# Anatomy & Architecture

Understanding Base Framework's architecture, design patterns, and the structure entities it generates.

## Framework Overview

### Modular Architecture

Base Framework follows a modular architecture pattern with Controller-Service layers, providing a clean separation of concerns with dependency injection and hierarchical design.

### What are Structures?

In Base Framework, a "structure" is a complete, self-contained unit that includes a model, service, controller, and all necessary files for a specific entity (like User, Post, Product). When you run `base g User name:string email:string`, you're generating a User structure that contains everything needed for CRUD operations, validation, and API endpoints.
### Core Layer (@base/core)

The foundation that powers your application with essential services.

- HTTP Router & Middleware
- Database Connection (GORM)
- Event System (Emitter)
- Storage (Local, S3, R2)
- Email Services
- Authentication & Authorization
- Logging & Error Handling

### Application Layer (app/)

Your business logic built on top of the core foundation.

- Generated Structures (entities)
- Custom Business Logic
- Database Models
- API Endpoints
- Custom Services
- Application Configuration

### Framework Flow

```
Core Services
    ↓
Your Structures
    ↓
API Endpoints
```
## Structure Anatomy

### What is a Structure?

A structure is a complete entity in your application - think User, Post, Product, Order. When you generate a structure, Base creates all the files needed for full CRUD operations, validation, and API endpoints for that entity.

### Structure Components

#### Model
GORM database model with relationships, validations, and hooks

#### Service
Business logic layer with CRUD operations and custom methods

#### Controller
HTTP handlers for API endpoints with request/response handling

#### Module
Dependency injection and route registration for the structure
### Structure Generation Example

```bash
# Generate a User structure
base g User name:string email:string:unique age:int role:string
```

#### Files Created:
- `app/models/user.go` - Database model
- `app/users/service.go` - Business logic
- `app/users/controller.go` - HTTP handlers
- `app/users/module.go` - DI & routes

#### API Endpoints:
- `GET /users` - List users
- `POST /users` - Create user
- `GET /users/:id` - Get user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
### Structure Lifecycle

#### Generation
Create complete structure with `base g EntityName`

#### Customization
Extend generated code with custom business logic

#### Removal
Clean removal with `base destroy EntityName`
## Request Lifecycle

1. **HTTP Request**  
   Incoming request hits the radix tree router

2. **Middleware Chain**  
   Authentication, logging, rate limiting, and custom middleware

3. **Controller Action**  
   Route handler processes the request

4. **Service Layer**  
   Business logic and data processing

5. **Model Operations**  
   Database models for GORM auto-migrations

6. **JSON Response**  
   Structured response with proper HTTP status codes
## Design Principles

### Convention over Configuration
Sensible defaults that reduce boilerplate while remaining flexible for customization.

### Modular Architecture
Self-contained structures that can be developed, tested, and maintained independently.

### Type Safety
Strong typing throughout the framework leveraging Go's type system for reliability.

### Performance First
Zero-dependency core with optimized routing and minimal memory allocation.
## Framework vs Structure

### Base Framework
The **infrastructure** that provides foundational services.

- **Purpose:** Provides core services
- **Location:** `@base/core/`
- **Examples:** Router, Database, Email
- **Lifecycle:** Framework-managed
- **Customization:** Configuration-based

### Structure (Entity)
The **business entities** that represent your application's domain.

- **Purpose:** Represents business entities
- **Location:** `app/`
- **Examples:** User, Post, Product, Order
- **Lifecycle:** Developer-managed
- **Customization:** Code-based

### Working Together

The Base Framework provides the infrastructure (database, routing, authentication), while structures represent your business entities (users, products, orders). Structures consume framework services through dependency injection to build complete, functional APIs.