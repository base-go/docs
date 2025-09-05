// OG Image Generator for Base Framework Documentation
// Generates GitHub-style social cards for each documentation page

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// GitHub-style template for OG images
const generateOGHTML = (title, description = 'Base Framework Documentation') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
      color: #f0f6fc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 80px;
      position: relative;
      overflow: hidden;
    }
    
    .background-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    
    .logo {
      position: absolute;
      top: 60px;
      left: 80px;
      font-size: 24px;
      font-weight: 600;
      color: #58a6ff;
    }
    
    .title {
      font-size: 64px;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 24px;
      max-width: 900px;
      background: linear-gradient(90deg, #f0f6fc 0%, #58a6ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .description {
      font-size: 28px;
      color: #8b949e;
      font-weight: 400;
      line-height: 1.4;
      max-width: 800px;
    }
    
    .corner-accent {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, #58a6ff22, transparent);
      border-radius: 200px 0 0 0;
    }
    
    .github-style-border {
      position: absolute;
      bottom: 60px;
      left: 80px;
      right: 80px;
      height: 1px;
      background: linear-gradient(90deg, transparent, #30363d, transparent);
    }
  </style>
</head>
<body>
  <div class="background-pattern"></div>
  <div class="logo">Base Framework</div>
  <h1 class="title">${title}</h1>
  <p class="description">${description}</p>
  <div class="corner-accent"></div>
  <div class="github-style-border"></div>
</body>
</html>
`

// Generate OG images for all documentation pages
export async function generateOGImages() {
  const docsDir = join(__dirname, '../md/docs')
  const ogDir = join(__dirname, '../dist/og')
  
  // Create og directory if it doesn't exist
  if (!existsSync(ogDir)) {
    mkdirSync(ogDir, { recursive: true })
  }
  
  // Page configurations for OG images
  const pages = [
    { title: 'Authentication', description: 'JWT tokens, OAuth integration, and secure user management for Base Framework' },
    { title: 'Authorization', description: 'Role-based access control, permissions, and route protection' },
    { title: 'CLI Reference', description: 'Complete command-line interface reference for Base Framework' },
    { title: 'Configuration', description: 'Environment variables, security practices, and deployment configuration' },
    { title: 'Email System', description: 'Multi-provider email system with templates and delivery management' },
    { title: 'Event Emitter', description: 'Async event system for decoupled module communication' },
    { title: 'File Storage', description: 'Active storage pattern with S3, R2, and local file management' },
    { title: 'HTTP Router', description: 'Zero-dependency router with middleware and radix tree routing' },
    { title: 'Logger', description: 'Structured logging with typed fields and multiple output formats' },
    { title: 'Middleware', description: 'Request/response processing with authentication and rate limiting' },
    { title: 'Task Scheduler', description: 'Cron jobs and background task management system' },
    { title: 'Translation', description: 'Internationalization and localization support' },
    { title: 'Validation', description: 'Input validation, sanitization, and request processing' },
    { title: 'WebSocket', description: 'Real-time communication with room-based messaging' },
    { title: 'Quick Start', description: 'Get started with Base Framework in minutes' },
    { title: 'Tutorial', description: 'Step-by-step guide to building applications with Base' },
    { title: 'Installation', description: 'Install and set up Base Framework for development' }
  ]
  
  // Generate HTML files for each page (these would be converted to images in production)
  pages.forEach(page => {
    const slug = page.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    const html = generateOGHTML(page.title, page.description)
    const filePath = join(ogDir, `${slug}.html`)
    writeFileSync(filePath, html)
    console.log(`Generated OG template: ${slug}.html`)
  })
  
  console.log(`✅ Generated ${pages.length} OG image templates`)
  console.log('📝 Convert HTML templates to PNG using a headless browser in production')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateOGImages()
}