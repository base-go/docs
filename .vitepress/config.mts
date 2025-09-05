import { defineConfig } from 'vitepress'

// Generate custom OG image path for each page
function generateOGImage(title: string) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return `https://base.al/og/${slug}.png`
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "md",
  ignoreDeadLinks: true,
  cleanUrls: true, // Enable clean URLs
  
  title: "Base Framework",
  description: "A powerful Go web framework with authentication, authorization, and modern tooling",
  
  // SEO and URL configuration
  sitemap: {
    hostname: 'https://base.al',
    transformItems(items) {
      // Add custom metadata to sitemap items
      return items.map((item) => {
        // Set higher priority for important pages
        if (item.url === '/' || item.url === '/index') {
          item.priority = 1.0
          item.changefreq = 'weekly'
        } else if (item.url === '/docs/' || item.url === '/docs/index' || item.url === '/docs/installation') {
          item.priority = 0.9
          item.changefreq = 'weekly'
        } else if (item.url.includes('/docs/')) {
          item.priority = 0.8
          item.changefreq = 'monthly'
        } else {
          item.priority = 0.6
          item.changefreq = 'monthly'
        }
        
        return item
      })
    }
  },


  head: [
    // Global head tags
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Base Framework' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['link', { rel: 'icon', href: '/base.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Jura:wght@300;400;500;600;700&display=swap', rel: 'stylesheet' }],
    // Schema.org structured data
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Base Framework',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Cross-platform',
      'description': 'A powerful Go web framework with authentication, authorization, and modern tooling',
      'url': 'https://base.al',
      'author': {
        '@type': 'Organization',
        'name': 'Base Framework Team',
        'url': 'https://github.com/base-go'
      }
    })]
  ],

  themeConfig: {
    logo: { src: '/base.svg' },
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/' },
      { text: 'Tutorial', link: '/docs/tutorial' },
      { 
        text: 'v2.1.x', 
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
            { text: 'Authentication', link: '/docs/authentication' },
            { text: 'Authorization', link: '/docs/authorization' },
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
