#!/usr/bin/env node

// Simple script to generate OG image templates
// In production, use Puppeteer or Playwright to convert HTML to PNG

import { exec } from 'child_process'
import { promisify } from 'util'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const execAsync = promisify(exec)
const __dirname = dirname(fileURLToPath(import.meta.url))

async function generateOGImages() {
  console.log('🎨 Starting OG image generation...')
  
  const ogDir = join(__dirname, 'dist/og')
  
  // Create og directory if it doesn't exist
  if (!existsSync(ogDir)) {
    mkdirSync(ogDir, { recursive: true })
  }

  try {
    // Import and run the OG generator
    const { generateOGImages } = await import('./.vitepress/og-generator.mjs')
    await generateOGImages()
    
    console.log('✅ OG image templates generated successfully!')
    console.log('📝 To convert to actual PNG images, install Puppeteer:')
    console.log('   npm install puppeteer')
    console.log('   Then use Puppeteer to screenshot the HTML files')
    
  } catch (error) {
    console.error('❌ Failed to generate OG images:', error.message)
    process.exit(1)
  }
}

// Run the generator
generateOGImages()