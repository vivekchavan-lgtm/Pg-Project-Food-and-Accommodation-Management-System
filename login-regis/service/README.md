# Login Service - Implementation Guide

## Overview
This Spring Boot application implements a complete authentication system with login and register endpoints using JWT tokens.

## Project Structure

```
src/main/java/pg/login/service/
├── entity/
│   └── User.java                 # JPA Entity for user data
├── repository/
│   └── UserRepository.java       # JPA Repository for database operations
├── service/
│   └── AuthService.java          # Business logic for authentication
├── controller/
│   └── AuthController.java       # REST API endpoints
├── dto/
│   ├── LoginRequest.java         # Login request DTO
│   ├── LoginResponse.java        # Login response DTO
│   ├── RegisterRequest.java      # Register request DTO
│   └── RegisterResponse.java     # Register response DTO
├── exception/
│   ├── UserAlreadyExistsException.java
│   ├── InvalidCredentialsException.java
│   └── GlobalExceptionHandler.java  # Global exception handler
├── utils/
│   └── JwtUtil.java              # JWT token generation and validation
├── config/
│   └── SecurityConfig.java       # Spring Security configuration
└── LoginServiceApplication.java  # Main application class
```

## API Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "fullName": "John Doe",
  "mobile": "9876543210",
  "email": "john@example.com",
  "password": "securePassword123",
  "gender": "Male",
  "city": "Mumbai"
}
```

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "mobile": "9876543210",
  "gender": "Male",
  "city": "Mumbai"
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "Username 'john_doe' is already taken",
  "status": "CONFLICT"
}
```

### 2. Login User
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "mobile": "9876543210",
  "gender": "Male",
  "city": "Mumbai"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid username or password",
  "status": "UNAUTHORIZED"
}
```

## Features Implemented

✅ **User Registration**
- Input validation with comprehensive error messages
- Password hashing using BCrypt
- Duplicate username/email prevention
- Automatic timestamp tracking

✅ **User Login**
- Credential verification
- JWT token generation
- User details in response

✅ **Security**
- BCrypt password encoding
- JWT token-based authentication
- CORS support
- Global exception handling
- Input validation

✅ **Data Persistence**
- MySQL database integration
- JPA/Hibernate ORM
- Automatic schema creation

## Configuration (application.yaml)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/login_db
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: create

jwt:
  secret: mySecretKey1234567890123456789012
  expiration: 3600000  # 1 hour in milliseconds
```

## Database Schema

### users table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  mobile VARCHAR(10) UNIQUE NOT NULL,
  gender VARCHAR(20) NOT NULL,
  city VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "fullName": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "password": "securePassword123",
    "gender": "Male",
    "city": "Mumbai"
  }'
```

### Login User
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'
```

## Dependencies

- Spring Boot 4.0.2
- Spring Data JPA
- Spring Security
- JWT (JJWT 0.11.5)
- MySQL Connector
- Lombok
- Jakarta Validation

## Running the Application

1. Ensure MySQL is running and database `login_db` is created
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```
3. The application will start on `http://localhost:8080`
4. Database tables will be created automatically (ddl-auto: create)

## Future Enhancements

- Email verification
- Password reset functionality
- Refresh token implementation
- Role-based access control
- Two-factor authentication
- User profile management
- OAuth2 integration
