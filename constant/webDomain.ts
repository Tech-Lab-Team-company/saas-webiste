export function getWebDomain(): string {
    const url = window.location.href
    try {
        console.log("webDomain", url);
        const hostname = new URL(url).hostname;
        console.log("webDomain hostname", hostname);
        if (hostname === 'localhost') return 'hrarabians.org';
        const parts = hostname.split('.');
        return parts.slice(-2).join('.');
    } catch {
        return 'hrarabians.org';
    }
}