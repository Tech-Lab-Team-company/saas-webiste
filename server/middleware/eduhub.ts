export default defineEventHandler(async (event) => {
  const host = getRequestHeader(event, 'host') || ''
  
  // If the domain is eduhub
  if (host.includes('eduhubco.com')) {
    const url = getRequestURL(event)
    
    // If accessing the root path, serve the eduhub index.html directly
    // This avoids redirecting the user and keeps the URL clean (/)
    if (url.pathname === '/') {
      // Fetch the static file internally and return it as HTML
      const html = await $fetch<string>('/eduhub/index.html')
      setResponseHeader(event, 'Content-Type', 'text/html')
      return html
    }
  }
})
