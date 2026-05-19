import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  const host = getRequestHeader(event, 'host') || ''
  
  // If the domain is eduhub
  if (host.includes('eduhubco.com')) {
    const url = getRequestURL(event)
    
    // If accessing the root path, serve the eduhub index.html directly
    // This avoids redirecting the user and keeps the URL clean (/)
    if (url.pathname === '/') {
      // Read the static file directly from the filesystem
      // Use process.cwd() which points to the project root in dev and prod
      const filePath = resolve(process.cwd(), 'public/eduhub/index.html')
      try {
        const html = readFileSync(filePath, 'utf-8')
        setResponseHeader(event, 'Content-Type', 'text/html')
        return html
      } catch (err) {
        console.error('Failed to read eduhub index.html:', err)
      }
    }
  }
})
