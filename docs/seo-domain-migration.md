# Root-domain SEO migration (deployment action)

This repository serves `https://web.mr-eslamsalama.com`. The separate nginx
virtual host serving `mr-eslamsalama.com` must be changed outside this
repository after the new application is deployed and its matching routes have
been verified.

## Required behavior

- Redirect both HTTP and HTTPS root-domain requests permanently.
- Preserve the request path and query string.
- Redirect only to the matching path on `web.mr-eslamsalama.com`, never to the
  homepage as a catch-all destination.
- Verify that each migrated destination is a real `200` page. Retired URLs with
  no replacement should return an intentional `404` or `410` instead of being
  redirected to `/`.
- Keep the root-domain TLS certificate valid while redirects remain active.

Example nginx vhosts (certificate paths belong to deployment configuration):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name mr-eslamsalama.com;

    return 308 https://web.mr-eslamsalama.com$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name mr-eslamsalama.com;

    ssl_certificate     /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    return 308 https://web.mr-eslamsalama.com$request_uri;
}
```

Before enabling the catch-all redirect, audit old paths against the new site.
Add explicit `410` locations for intentionally removed URLs, or retain a
purpose-built legacy response where required. Example mappings to verify:

```text
https://mr-eslamsalama.com/
  -> https://web.mr-eslamsalama.com/

https://mr-eslamsalama.com/course/3327
  -> https://web.mr-eslamsalama.com/course/3327

https://mr-eslamsalama.com/books/17
  -> https://web.mr-eslamsalama.com/books/17
```

Only after the redirects, canonical URLs, sitemap, and raw SSR HTML are live
should the Search Console migration/recrawl steps be performed.
