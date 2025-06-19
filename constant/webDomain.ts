export function getWebDomain(): string {
    const url = window.location.href
    try {
        const hostname = new URL(url).hostname;
        if (hostname === 'localhost') return 'hrarabians.org';
        const parts = hostname.split('.');
        return parts.slice(-2).join('.');
    } catch {
        return 'hrarabians.org';
    }
}