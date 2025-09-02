#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Source and destination paths
const SOURCE_DIR = '../base-web/src/pages/docs';
const DEST_DIR = './md/docs';

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

// Vue files to convert
const vueFiles = [
  'installation.vue',
  'quick-start.vue', 
  'tutorial.vue',
  'cli.vue',
  'structure.vue',
  'anatomy.vue',
  'application.vue',
  'auth.vue',
  'configuration.vue',
  'router.vue',
  'middleware.vue',
  'validator.vue',
  'storage.vue',
  'email.vue',
  'logger.vue',
  'scheduler.vue',
  'websocket.vue',
  'emitter.vue',
  'translation.vue',
  'base-helpers.vue',
  'api.vue'
];

function convertVueToMarkdown(vueContent, filename) {
  // Extract title from filename
  const title = filename.replace('.vue', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Basic conversion - extract text content and structure
  let markdown = `---\ntitle: ${title}\ndescription: ${title} documentation for Base Framework.\n---\n\n`;
  
  // Remove Vue template tags and extract content
  let content = vueContent
    .replace(/<template>/g, '')
    .replace(/<\/template>/g, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
  
  // Clean up HTML and convert to markdown
  content = content
    // Remove Vue components and directives first
    .replace(/<[A-Z][^>]*>/g, '')
    .replace(/<\/[A-Z][^>]*>/g, '')
    .replace(/v-[a-zA-Z-]+="[^"]*"/g, '')
    .replace(/:[\w-]+="[^"]*"/g, '')
    .replace(/@[\w-]+="[^"]*"/g, '')
    
    // Convert code blocks first (most important)
    .replace(/<pre[^>]*><code[^>]*class="language-([^"]*)"[^>]*>([\s\S]*?)<\/code><\/pre>/g, '```$1\n$2\n```')
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```')
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, '```\n$1\n```')
    .replace(/<code[^>]*class="language-([^"]*)"[^>]*>(.*?)<\/code>/g, '```$1\n$2\n```')
    
    // Convert headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gs, '\n# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gs, '\n## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gs, '\n### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gs, '\n#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gs, '\n##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gs, '\n###### $1\n\n')
    
    // Convert lists with proper spacing
    .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, listContent) => {
      const items = listContent.replace(/<li[^>]*>([\s\S]*?)<\/li>/gs, '- $1\n');
      return '\n' + items + '\n';
    })
    .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (match, listContent) => {
      let counter = 1;
      const items = listContent.replace(/<li[^>]*>([\s\S]*?)<\/li>/gs, () => `${counter++}. $1\n`);
      return '\n' + items + '\n';
    })
    
    // Convert paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gs, '$1\n\n')
    
    // Convert text formatting
    .replace(/<strong[^>]*>(.*?)<\/strong>/gs, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gs, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gs, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gs, '*$1*')
    .replace(/<code[^>]*>(.*?)<\/code>/gs, '`$1`')
    
    // Convert links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gs, '[$2]($1)')
    
    // Convert blockquotes
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g, (match, content) => {
      return '\n' + content.split('\n').map(line => `> ${line.trim()}`).filter(line => line.trim() !== '>').join('\n') + '\n\n';
    })
    
    // Convert divs with classes to appropriate markdown
    .replace(/<div[^>]*class="[^"]*code[^"]*"[^>]*>([\s\S]*?)<\/div>/gs, '```\n$1\n```')
    .replace(/<div[^>]*class="[^"]*highlight[^"]*"[^>]*>([\s\S]*?)<\/div>/gs, '```\n$1\n```')
    
    // Convert bullet point symbols to proper markdown
    .replace(/^•\s*/gm, '- ')
    .replace(/^\*\s+(?!\*)/gm, '- ')
    .replace(/^◦\s*/gm, '  - ')
    .replace(/^▪\s*/gm, '  - ')
    .replace(/^-\s*•\s*/gm, '- ')
    .replace(/^-\s*\*\s*/gm, '- ')
    .replace(/^-\s*-\s*/gm, '- ')
    
    // Clean up double dashes in lists
    .replace(/^-\s+-\s+/gm, '- ')
    .replace(/^-\s*-\s+/gm, '- ')
    
    // Remove remaining HTML tags but keep content
    .replace(/<[^>]+>/g, '')
    
    // Clean up whitespace and formatting
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/^\s+/gm, '')
    .replace(/\s+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  // Add the title as main heading if not present
  if (!content.startsWith('#')) {
    content = `# ${title}\n\n${content}`;
  }
  
  markdown += content;
  
  return markdown;
}

// Convert each Vue file
vueFiles.forEach(vueFile => {
  const sourcePath = path.join(SOURCE_DIR, vueFile);
  const mdFile = vueFile.replace('.vue', '.md');
  const destPath = path.join(DEST_DIR, mdFile);
  
  try {
    if (fs.existsSync(sourcePath)) {
      const vueContent = fs.readFileSync(sourcePath, 'utf8');
      const markdown = convertVueToMarkdown(vueContent, vueFile);
      
      fs.writeFileSync(destPath, markdown);
      console.log(`✅ Converted ${vueFile} → ${mdFile}`);
    } else {
      console.log(`⚠️  File not found: ${sourcePath}`);
    }
  } catch (error) {
    console.error(`❌ Error converting ${vueFile}:`, error.message);
  }
});

console.log('\n🎉 Documentation conversion complete!');
