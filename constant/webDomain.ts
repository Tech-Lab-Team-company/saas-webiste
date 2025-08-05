export function getWebDomain(): string {
    const url = window.location.href
    try {
        const hostname = new URL(url).hostname;
        if (hostname === 'localhost' || hostname === 'website.saas.techlabeg.com') return 'mrbackend.eduhubco.com';
        // const parts = hostname.split('.');
        // return parts.slice(-2).join('.');
        return hostname;
    } catch {
        return 'mrbackend.eduhubco.com';
    }
}


// kodrat.success.sa
// hrarabians.org
// islam-salama.techlabeg.com
// almaherinenglish.com
// hadybazeed.com
// mrbackend.eduhubco.com