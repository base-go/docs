import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "md",
  
  title: "Base Framework",
  description: "A powerful Go web framework with authentication, authorization, and modern tooling",
  
  head: [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Base Framework Documentation' }],
    ['meta', { property: 'og:description', content: 'Complete documentation for Base Framework - A powerful Go web framework' }],
    ['meta', { property: 'og:url', content: 'https://base.al' }],
    ['meta', { property: 'og:image', content: 'https://base.al/og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'canonical', href: 'https://base.al' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', rel: 'stylesheet' }]
  ],

  themeConfig: {
    logo: { src: '/base.svg' },
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/' },
      { text: 'Tutorial', link: '/docs/tutorial' },
      { 
        text: 'v1.0', 
        items: [
          { text: 'Changelog', link: 'https://github.com/base-go/base-core/releases' },
          { text: 'Contributing', link: 'https://github.com/base-go/base-core/blob/main/CONTRIBUTING.md' }
        ]
      }
    ],

    sidebar: {
      '/docs/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Installation', link: '/docs/installation' },
            { text: 'Quick Start', link: '/docs/quick-start' },
            { text: 'Blog Tutorial', link: '/docs/tutorial' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Architecture', link: '/docs/anatomy' },
            { text: 'Directory Structure', link: '/docs/structure' },
            { text: 'App Directory', link: '/docs/application' },
            { text: 'Configuration', link: '/docs/configuration' },
            { text: 'Middleware', link: '/docs/middleware' },
            { text: 'Base Helpers', link: '/docs/base-helpers' },
            { text: 'Auth & Auth', link: '/docs/auth' },
            { text: 'Storage', link: '/docs/storage' },
            { text: 'Emitter', link: '/docs/emitter' },
            { text: 'Email', link: '/docs/email' },
            { text: 'Validator', link: '/docs/validator' },
            { text: 'Logger', link: '/docs/logger' },
            { text: 'WebSocket', link: '/docs/websocket' },
            { text: 'Task Scheduler', link: '/docs/scheduler' },
            { text: 'Translation', link: '/docs/translation' },
            { text: 'Router', link: '/docs/router' }
          ]
        },
        {
          text: 'CLI',
          items: [
            { text: 'base new', link: '/docs/cli#base-new' },
            { text: 'base generate', link: '/docs/cli#base-generate' },
            { text: 'base docs', link: '/docs/cli#base-docs' },
            { text: 'base start', link: '/docs/cli#base-start' },
            { text: 'base update', link: '/docs/cli#base-update' },
            { text: 'base upgrade', link: '/docs/cli#base-upgrade' },
            { text: 'base destroy', link: '/docs/cli#base-destroy' }
          ]
        },
        {
          text: 'Resources',
          items: [
            { text: 'GitHub', link: 'https://github.com/base-go/base-core' },
            { text: 'Changelog', link: 'https://github.com/base-go/base-core/releases' },
            { text: 'Contributing', link: 'https://github.com/base-go/base-core/blob/main/CONTRIBUTING.md' },
            { text: 'License', link: 'https://github.com/base-go/base-core/blob/main/LICENSE' },
             
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/base-go/base-core' },
       { icon: 'discord', link: 'https://discord.gg/8wYFX3Wh' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Base Framework Team. Made with ❤️ at <a href="https://basecode.al">{basecode}</a> offices.'
    },

    search: {
      provider: 'local'
    }
  }
})
