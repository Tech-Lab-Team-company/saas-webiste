# Course Content Protection

This document explains the protection added to course pages such as
`/course/3250` and how the application now obtains its web domain.

## What was implemented

The protection applies to dynamic course pages under `/course/:id`.

### Course-page protection

- Disables Nuxt DevTools in the application build.
- Blocks the context menu on course pages.
- Blocks common browser shortcuts for Inspect, View Source, Save and Print.
- Prevents dragging protected lesson media.
- Displays a temporary protection notice when a blocked action is attempted.
- Covers active lesson content when the browser tab loses focus, becomes hidden,
  or receives a supported screen-capture keyboard event.
- Removes course media from printed pages.

These controls are implemented by:

- `composables/useCourseContentProtection.ts`
- `components/CourseDetails/CourseTabs.vue`
- `assets/style/course-details-redesign/course-tabs.scss`

### Student watermark

Videos and PDF files display a repeated watermark containing:

- Student name
- Student ID
- Course ID

The watermark is also placed inside the video player and protected PDF
fullscreen container so it remains visible in fullscreen mode.

Watermark implementation:

- `components/CourseDetails/MediaWatermark.vue`
- `components/CourseDetails/NormalVedio.vue`
- `components/CourseDetails/Youtube.vue`
- `components/CourseDetails/CourseVideo.vue`

### Video and PDF restrictions

For native videos, the application requests the following browser controls:

- Hide the download control
- Disable Picture-in-Picture
- Disable remote playback/casting
- Disable the media context menu

For PDF content:

- The browser PDF toolbar and navigation panel are hidden where supported.
- The request uses a no-referrer policy.
- The protected container, including the watermark, enters fullscreen instead
  of the iframe alone.

Browser support varies, so unsupported browsers may ignore individual media
attributes.

### Course-route HTTP headers

Nuxt applies these response headers to `/course/**` routes:

- `Cache-Control: private, no-store, max-age=0`
- `Content-Security-Policy: frame-ancestors 'none'`
- `Permissions-Policy: display-capture=(), picture-in-picture=()`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`

They prevent course pages from being cached or embedded in another website and
disable supported page-level capture and Picture-in-Picture APIs.

These headers are configured in `nuxt.config.ts`. When deploying as fully
static files, configure the same headers in the hosting platform because Nuxt
route rules require a compatible server or hosting adapter.

## `WEB_LINK` configuration

The tenant identifier is configured separately from the public frontend URL:

```dotenv
NUXT_PUBLIC_WEB_LINK=your-tenant.example.com
NUXT_PUBLIC_SITE_URL=https://web.your-tenant.example.com
```

`WEB_LINK` remains a backward-compatible deployment fallback for
`NUXT_PUBLIC_WEB_LINK`; `SITE_URL` does the same for `NUXT_PUBLIC_SITE_URL`.
The `webLink` value identifies the backend tenant and is never a public URL.
The `siteUrl` value is the public frontend origin.

`nuxt.config.ts` exposes the tenant value as `runtimeConfig.public.webLink`.
`constant/webDomain.ts` only normalizes this configured value into a hostname
for the `web-domain` API header. It no longer:

- Reads `window.location`
- Uses the current browser hostname
- Replaces localhost with a hardcoded production domain
- Contains a fallback production domain

Books, blogs, FAQs, legal documents, teacher content, general API headers and
the home-course request now all use the same configured `WEB_LINK` source.

After changing either runtime value, restart the development server or rebuild the
production application.

## Internal protection defaults

Protection behavior is intentionally kept out of `.env` to avoid a long list
of environment variables. The internal defaults live in:

`composables/useCourseProtectionConfig.ts`

This file controls watermark visibility, watermark density, shortcut blocking,
capture shielding, PDF behavior and video-control restrictions.

## Verification checklist

1. Set `WEB_LINK` in `.env` and restart Nuxt.
2. Open `/course/3250` and select an available video or PDF lesson.
3. Confirm the student and course watermark is visible.
4. Confirm right-click is blocked on the course page.
5. Test `F12`, `Ctrl/Cmd + Shift + I`, `Ctrl/Cmd + U` and `Ctrl/Cmd + P`.
6. Switch to another browser tab and confirm the active lesson is covered.
7. Open video or PDF fullscreen and confirm the watermark remains visible.
8. Confirm course responses include the security headers in production.
9. Run `npm run build` before deployment.

## Important security limitation

Frontend code cannot completely disable browser developer tools, operating
system screenshots or external screen-recording software. These changes are
deterrents and provide student accountability through watermarking.

Real course security must also be enforced by the backend:

- Verify authentication and course enrollment for every protected request.
- Never return paid lesson URLs to an unauthorized student.
- Use short-lived signed video and PDF URLs tied to the authorized user.
- Expire or rotate media URLs and prevent public bucket access.
- Log concurrent sessions and revoke suspicious access where appropriate.

No API tokens, signing keys or media secrets should be placed in a public Nuxt
runtime configuration or any variable prefixed with `NUXT_PUBLIC_`.
