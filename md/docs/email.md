---
title: Email
description: Email documentation for Base Framework.
---

# Email

Multi-provider email system with unified interface and comprehensive template support

## Overview

**Flexible Email System**

Base Framework's email system provides a unified interface for sending emails with support for multiple providers including SMTP, SendGrid, and Postmark. It includes dependency injection, structured logging, and error handling.

**SMTP**

Standard email protocol with support for any SMTP server including Gmail, Outlook, and custom servers.

**SendGrid**

Cloud email service by Twilio with high deliverability, analytics, and template support.

**Postmark**

Specialized transactional email service with fast delivery and detailed bounce handling.

## Configuration

### Environment Variables

**.env Configuration**

```bash
# Email Provider (smtp, sendgrid, postmark, default)
EMAIL_PROVIDER=smtp
EMAIL_FROM_ADDRESS=noreply@example.com

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-username@gmail.com
SMTP_PASSWORD=your-app-password

# SendGrid Configuration
SENDGRID_API_KEY=your-sendgrid-api-key

# Postmark Configuration
POSTMARK_SERVER_TOKEN=your-postmark-server-token
POSTMARK_ACCOUNT_TOKEN=your-postmark-account-token
```

## Provider Setup

### SMTP Setup

SMTP is the most common email protocol. Here are configurations for popular providers:

**Gmail**
- Host: smtp.gmail.com | Port: 587
- Requires app password (not your regular password)

**Outlook/Hotmail**
- Host: smtp-mail.outlook.com | Port: 587
- Uses your regular Microsoft account credentials

### SendGrid Setup

SendGrid requires only an API key from your SendGrid account:

1. Sign up for a SendGrid account
2. Create an API key with Mail Send permissions
3. Verify your sender email address
4. Configure EMAIL_PROVIDER=sendgrid in your .env file

### Postmark Setup

Postmark requires both server and account tokens:

1. Sign up for a Postmark account
2. Create a server for your application
3. Get your server token from the server settings
4. Get your account token from account settings
5. Configure EMAIL_PROVIDER=postmark in your .env file
## Basic Usage

### Initialize Email System

**main.go**

```go
package main

import (
    "base/core/config"
    "base/core/email"
    "log"
)

func main() {
    // Load configuration
    cfg := config.Load()
    
    // Initialize email system
    if err := email.Initialize(cfg); err != nil {
        log.Fatal("Failed to initialize email system:", err)
    }
    
    // Email system is now ready to use
}
```

### Send Simple Text Email

**Simple Email Example**

```go
package main

import "base/core/email"

func sendWelcomeEmail(userEmail string) error {
    msg := email.Message{
        To:      []string{userEmail},
        Subject: "Welcome to Base Framework",
        Body:    "Thank you for joining us! We're excited to have you on board.",
        IsHTML:  false,
    }
    
    return email.Send(msg)
}
```
## HTML Email Templates

### HTML Email with Styling

**HTML Email Template**

```go
func sendWelcomeEmailHTML(userName, userEmail string) error {
    htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Base Framework</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { display: inline-block; background: #3b82f6; color: white;
                  padding: 12px 24px; text-decoration: none; border-radius: 4px; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center;
                  font-size: 14px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Base Framework!</h1>
        </div>
        <div class="content">
            <h2>Hello %s,</h2>
            <p>Thank you for joining Base Framework. We're excited to have you on board!</p>
            <p>Here's what you can do next:</p>
            <ul>
                <li>Complete your profile setup</li>
                <li>Explore our documentation</li>
                <li>Join our community</li>
            </ul>
            <p>
                <a href="https://example.com/get-started" class="button">
                    Get Started
                </a>
            </p>
        </div>
        <div class="footer">
            <p>This email was sent to %s</p>
            <p>© 2024 Base Framework. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `, userName, userEmail)
    
    msg := email.Message{
        To:      []string{userEmail},
        Subject: "Welcome to Base Framework",
        Body:    htmlBody,
        IsHTML:  true,
    }
    
    return email.Send(msg)
}
```
## Service Integration

### Email Service with Dependency Injection

**services/user_service.go**

```go
package user

import (
    "fmt"
    "base/core/email"
    "base/core/logger"
    "base/app/models"
    "gorm.io/gorm"
)

type UserService struct {
    DB          *gorm.DB
    EmailSender email.Sender
    Logger      logger.Logger
}

func NewUserService(db *gorm.DB, emailSender email.Sender, logger logger.Logger) *UserService {
    return &UserService{
        DB:          db,
        EmailSender: emailSender,
        Logger:      logger,
    }
}

func (s *UserService) CreateUser(userData CreateUserRequest) (*models.User, error) {
    user := &models.User{
        Name:  userData.Name,
        Email: userData.Email,
    }
    
    // Save user to database
    if err := s.DB.Create(user).Error; err != nil {
        return nil, err
    }
    
    // Send welcome email
    if err := s.sendWelcomeEmail(user); err != nil {
        s.Logger.Error("Failed to send welcome email",
            logger.String("user_id", fmt.Sprintf("%d", user.ID)),
            logger.String("error", err.Error()))
        // Don't fail user creation if email fails
    }
    
    return user, nil
}
```
### Password Reset Email

**Password Reset Implementation**

```go
func (s *UserService) SendPasswordResetEmail(user *models.User, token string) error {
    resetURL := fmt.Sprintf("%s/reset-password?token=%s", config.AppURL, token)
    
    htmlBody := fmt.Sprintf(`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
        <h1>Password Reset Request</h1>
    </div>
    <div style="padding: 20px;">
        <h2>Hello %s,</h2>
        <p>We received a request to reset your password. If you made this request,
           click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="%s"
               style="display: inline-block; background: #ef4444; color: white;
                      padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Reset My Password
            </a>
        </div>
        <p style="color: #6b7280;">
            <strong>Important:</strong> This link will expire in 1 hour for security reasons.
        </p>
        <p style="color: #6b7280;">
            If you didn't request this password reset, please ignore this email.
            Your password will remain unchanged.
        </p>
    </div>
</div>
    `, user.Name, resetURL, user.Email)
    
    msg := email.Message{
        To:      []string{user.Email},
        Subject: "Password Reset Request",
        Body:    htmlBody,
        IsHTML:  true,
    }
    
    err := s.EmailSender.Send(msg)
    if err != nil {
        s.Logger.Error("Failed to send password reset email",
            logger.String("user_email", user.Email),
            logger.String("error", err.Error()))
        return fmt.Errorf("failed to send password reset email: %w", err)
    }
    
    s.Logger.Info("Password reset email sent",
        logger.String("user_email", user.Email))
    
    return nil
}
```
## Error Handling & Debugging

### Robust Error Handling

**Error Handling Best Practices**

```go
func (s *UserService) SendEmailWithRetry(user *models.User, subject, body string, isHTML bool) error {
    msg := email.Message{
        To:      []string{user.Email},
        Subject: subject,
        Body:    body,
        IsHTML:  isHTML,
    }
    
    const maxRetries = 3
    const retryDelay = time.Second * 2
    
    for attempt := 1; attempt <= maxRetries; attempt++ {
        err := s.EmailSender.Send(msg)
        
        if err == nil {
            s.Logger.Info("Email sent successfully",
                logger.String("user_email", user.Email),
                logger.String("subject", subject),
                logger.Int("attempt", attempt))
            return nil
        }
        
        s.Logger.Warn("Email send attempt failed",
            logger.String("user_email", user.Email),
            logger.String("error", err.Error()),
            logger.Int("attempt", attempt),
            logger.Int("max_retries", maxRetries))
        
        // Don't retry on the last attempt
        if attempt < maxRetries {
            time.Sleep(retryDelay)
        }
    }
    
    // All retries failed
    s.Logger.Error("Failed to send email after all retries",
        logger.String("user_email", user.Email),
        logger.String("subject", subject),
        logger.Int("max_retries", maxRetries))
    
    return fmt.Errorf("failed to send email after %d attempts", maxRetries)
}
```
### Common Issues & Solutions

**SMTP Authentication Failed**
- Use app passwords for Gmail (not your regular password)
- Enable 2FA and generate an app-specific password
- Check SMTP host and port settings

**SendGrid API Errors**
- Verify API key has Mail Send permissions
- Check sender email is verified in SendGrid
- Ensure you're not exceeding rate limits

**Email Not Initialized**
- Call email.Initialize(cfg) in your main function
- Ensure configuration is loaded before initialization
- Check EMAIL_PROVIDER environment variable is set
## Best Practices

### Do's

- Always validate email addresses before sending
- Use HTML templates for better user experience
- Implement retry logic for failed email sends
- Log email operations for debugging and monitoring
- Use dependency injection for testable code
- Include unsubscribe links in marketing emails
- Test email templates across different email clients

### Don'ts

- Don't fail critical operations if email fails
- Don't send emails without proper error handling
- Don't hardcode email templates in your code
- Don't forget to handle multiple recipients properly
- Don't send emails without rate limiting for bulk operations
- Don't expose email provider credentials in logs
- Don't send emails from localhost in production

### Pro Tips

- Use the default provider for development and testing
- Switch to professional providers for production
- Monitor email delivery rates and bounce rates
- Consider using email queues for high-volume sending
- Keep email templates in separate files for maintainability
- Use email events to trigger additional business logic