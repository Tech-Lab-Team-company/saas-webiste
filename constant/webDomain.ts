export function getWebDomain(): string {
    const url = window.location.href
    try {
        const hostname = new URL(url).hostname;
        if (hostname === 'localhost' || hostname === 'website.saas.techlabeg.com') return 'kodrat.success.sa';
        // const parts = hostname.split('.');
        // return parts.slice(-2).join('.');
        return hostname;
    } catch {
        return 'kodrat.success.sa';
    }
}