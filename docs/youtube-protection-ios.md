# Course YouTube protection on iOS

## Follow-up: fullscreen and Settings controls

The latest starting commit was `f1ad752` (`youtube`). Its inline protection
exposed a separate limitation in Vime 5.4.1: `FullscreenControl` explicitly hides
both its host and inner button when `player.canSetFullscreen()` returns false.
That method checks the container Fullscreen API or a provider fullscreen adapter.
YouTube has no such adapter. On an iPhone without container fullscreen support,
the custom fullscreen button therefore disappears. It was not removed from the
template, covered by the blocker, or hidden by application iOS CSS.

The Settings diagnosis is more limited. Actual `touchstart`, `touchend`, pointer,
and click traces in Windows WebKit reach the custom gear with no prevented
default, then fire `vmOpen` and set `isSettingsActive=true`. The reported swallowed
tap has **not** been reproduced on physical Safari. Inspection did establish that
Vime's mobile Settings sheet uses `position:fixed; bottom:0` inside its shadow
tree, placing it outside the player. In the iPhone fixture the player occupied
y=190–396 while the open menu occupied y=489–664. This is incompatible with
keeping the settings inside the course viewer's clipped control layer; older
WebKit also has documented fixed-descendant clipping issues. This is evidence
for correcting placement, not proof that clipping caused the reported device's
unresponsive gear.

Follow-up changes:

- `Youtube.vue`: retain Vime's native fullscreen control when supported. When
  unavailable, use Vime's existing `Control`, `Icon`, and `Tooltip` to toggle a
  persistent dialog wrapper into the browser's top layer. The iframe is never
  reparented or recreated. All provider, blocker, watermark, and custom control
  elements remain together. A ResizeObserver updates Vime's aspect ratio to the
  viewport; exit restores 16:9 and the previous body scroll setting. Escape and
  component teardown also clean up the fallback.
- `vimeProtectedFullscreen.ts`: extend the existing checked build patch so
  mobile Settings in marked course players use an absolute sheet inside the
  player. It sits above the measured control-bar height, with scrollable height
  limited to the remaining player area. Other players and desktop menu rules
  retain their existing behavior. No pointer/touch cancellation is introduced.
- `youtube-protection.test.ts`: cover Vime's actual fullscreen visibility
  decision, scoped Settings rendering, fallback resize/exit/scroll restoration,
  and failure on unexpected upstream Settings changes.

The fullscreen fallback deliberately keeps `playsinline=true` and Vime's native
fullscreen flag false; it never calls `webkitEnterFullscreen()` on a video or
enables YouTube controls. The existing native container fullscreen compatibility
patch is retained. The stacking order remains iframe/media 0, blocker 1,
custom UI 2, controls 50, settings 70. Active controls and menu content receive
pointer events; the passive UI surface does not intercept them.

### Follow-up verification

Tests use the actual course component, real YouTube playback, and the installed
package in a local fixture with the course viewer's sticky/overflow behavior and
sticky navigation. The live course requires an enrolled login for its lesson.
No authenticated session or physical Apple/Android devices are available here.
Touch configurations now use `.tap()` for the controls, including opening the
Settings submenu, changing playback rate, Play/Pause, and fullscreen entry/exit.

| Environment | Settings and Play/Pause, inline and fullscreen | Fullscreen | Native iframe input |
| --- | --- | --- | --- |
| Windows Chrome | Pass | Existing native container mode passes | Blocked |
| Android Chrome emulation | Pass | Existing native container mode passes | Blocked |
| iPhone WebKit emulation | Pass | Viewport fallback entry/exit and landscape resize pass | Blocked |
| iPad WebKit emulation | Pass | Viewport fallback entry/exit and landscape resize pass | Blocked |
| iPad desktop user agent in WebKit | Pass | Viewport fallback entry/exit and landscape resize pass | Blocked |

Input probes in the real iframe record zero pointer/touch/click events at
protected locations, including fullscreen. Embed parameters remain `controls=0`,
`disablekb=1`, `playsinline=1`, and `fs=0`. The custom Settings sheet remains
inside the player and the gear can also close it. Fullscreen dimensions match
the viewport; returning restores the original inline dimensions. Resizing keeps
the same iframe element and its playback position. Screenshots were inspected;
portrait letterboxing preserves the video's source aspect ratio.

The production build and 17 focused checks pass. The full suite has 93 passes and the same unrelated
purchased-book grid assertion failure described below. Browser artifacts and
the fixture are in the ignored `.cache/player-investigation/` directory.

Remaining limits: physical iPhone/iPad testing is still required to confirm the
original Settings symptom and OS long-press behavior. Viewport fullscreen cannot
hide Safari's browser chrome or force device orientation; it requires the dialog
API (Safari 15.4+). URL secrecy/DRM is outside iframe interaction protection.

References: [Vime fullscreen control](https://vimejs.com/components/controls/fullscreen-control),
[WebKit dialog/top-layer support](https://webkit.org/blog/12209/introducing-the-dialog-element/),
[WebKit fixed-content clipping issue](https://bugs.webkit.org/show_bug.cgi?id=160953).

## Implementation and root cause

`/course/3491` resolves through `pages/course/[id]/index.vue`,
`CourseTabs.vue`, `CourseVideo.vue`, and `components/CourseDetails/Youtube.vue`.
The installed player is `@vime/vue-next` / `@vime/core` **5.4.1**. There is no
separate `HawamPlayer` implementation or package in this checkout.

The course component omitted `playsinline`. The installed Vime `Player.render()`
and `UI.render()` use this condition:

```js
const canShowCustomUI = !IS_IOS || !this.isVideoView ||
  (this.playsinline && !this.isFullscreenActive);
```

When this is false, Vime sets `controls = true`, removes its `.blocker`, and
omits the UI slot containing the custom controls. The YouTube provider then
requests `controls=1`, `disablekb=0`, and `playsinline=0`. This was reproduced
using the installed package with iPhone and iPad user agents in WebKit.

Windows and Android do not enter this iOS branch. Their blocker remains above
the iframe. The existing stacking order is media `0`, blocker `1`, UI `2`;
there was no evidence requiring changes to that stacking order, compositing,
overflow, or video dimensions. The initial play overlay only covers the player
until playback starts. A context-menu listener on its parent cannot intercept
events inside the cross-origin YouTube document once the blocker is removed.

Vime's iOS test uses the user agent, so iPadOS desktop-mode user agents can take
the non-iOS branch. The fix requests inline playback on every platform and does
not introduce another device-detection heuristic.

## Changes

- `components/CourseDetails/Youtube.vue`: add `playsinline` and the
  `data-protected-youtube` marker to the existing `Player`. Normalize the Vue
  wrapper's boolean paused event as well as native `CustomEvent` payloads.
  Previously reading `.detail` from a boolean could write `undefined` back to
  the player's paused property and resume playback after a pause click.
- `utils/vimeProtectedFullscreen.ts`: a build-time compatibility patch for the
  two Vime conditions above. On a marked player's **HTML container fullscreen**,
  retain the custom UI and iframe blocker. The patch checks standard and
  WebKit-prefixed fullscreen elements, including shadow-root retargeting.
- `nuxt.config.ts`: register the patch and exclude the two Vime modules from
  development dependency prebundling so development and production agree.
- `tests/youtube-protection.test.ts`: execute the installed Vime renderers and
  YouTube parameter builder to cover inline playback, standard/prefixed
  fullscreen, exit, preservation of unmarked/native-video behavior, and the
  course component's actual paused-event handler.
- `tests/course-sticky-preview.test.ts`: retain the no-overlay-on-pause
  assertion while allowing the handler to accept Vime's boolean event payload.

Adding `playsinline` alone was tested and was insufficient: entering fullscreen
on the iOS code path again set `controls=true`, removed the blocker, and hid
the custom UI. The compatibility patch fixes that second trigger without
replacing the package, its controls, fullscreen controller, or layout. No
dependency versions or CSS sizing rules changed. Unexpected changes to Vime's
two conditions fail the build with an explicit patch-review error.

## Original protection verification (before the follow-up above)

The live URL returned HTTP 200 and was opened in Chrome. Selecting a lesson
displayed the login-required dialog. Without an enrolled test session, playback
verification used the actual course `Youtube.vue` and installed Vime package in
a local Vue/Vite harness with a public YouTube video. Store/watch-history calls,
the watermark, and loading artwork were test stand-ins. YouTube playback and
the iframe were real, not mocked.

Before the fix, both WebKit mobile configurations had `controls=true`, no
blocker, and hidden custom UI; Windows/Android configurations retained them.
After the fix, browser checks inspect the embed parameters, actual video time,
pointer/touch targeting across the player, native iframe event delivery,
custom play/pause/settings/seeking, and the 16:9 inline dimensions.

The browser runs use Windows Chrome, Chrome Android emulation, and Playwright
WebKit with iPhone/iPad configurations. They are not physical Android/iOS
device tests. Playwright's Windows WebKit build does not expose container
fullscreen; that transition is checked with the iOS user-agent branch in Chrome
and with the installed Vime renderers for both fullscreen API variants.

Final browser results (local harness, real YouTube video):

| Environment | Logo/link and other iframe mouse/touch input | Native settings/quality | Playback, play/pause, custom settings and seek | Fullscreen |
| --- | --- | --- | --- | --- |
| Windows Chrome | Blocked; zero iframe input events | Disabled and behind blocker | Pass | Entry/exit and viewport sizing pass |
| Android Chrome emulation | Blocked; zero iframe input events | Disabled and behind blocker | Pass | Entry/exit and viewport sizing pass |
| iPhone WebKit emulation | Blocked; zero iframe input events | Disabled and behind blocker | Pass | API unavailable in this build |
| iPad WebKit emulation, mobile and desktop user agents | Blocked; zero iframe input events | Disabled and behind blocker | Pass | API unavailable in this build |
| iPad user agent in Chrome, to exercise Vime's iOS fullscreen branch | Blocked in inline and fullscreen hit tests | Disabled and behind blocker | Pass | Entry/exit and viewport sizing pass |

Inline player dimensions remained 16:9. Browser screenshots were inspected for
rendering/layout regressions. Fullscreen checks use the actual fullscreen
container, not the shadow host's collapsed inline box. Touch tests reveal the
auto-hiding controls with a tap before using them. OS long-press copy menus are
not covered by these automated checks.

The production build succeeds. The 14 focused player checks pass. The full
suite has 90 passing tests and one existing unrelated failure:
`purchased books render as a standalone responsive three-book grid` in
`tests/purchases-library.test.ts`.

## Remaining verification and limits

- Physical iPhone/iPad Safari and Android Chrome testing with an enrolled
  session remains necessary, including long-press copy/link menus, rotation,
  and actual Safari fullscreen entry/exit where available.
- The follow-up above adds viewport fullscreen when Vime's native container
  capability check fails.
- This restores UI interaction blocking. It cannot make a YouTube URL secret
  from browser/network inspection or provide DRM.

Reference: [Vime UI behavior](https://vimejs.com/components/ui/ui),
[YouTube embed parameters](https://developers.google.com/youtube/player_parameters#playsinline),
and [WebKit inline video behavior](https://webkit.org/blog/6784/new-video-policies-for-ios/).
