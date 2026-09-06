// Vime 5.4.1 assumes every iOS fullscreen session uses native video UI. Its
// Player and Ui renderers consequently remove the blocker and custom controls.
// Our YouTube player fullscreens the HTML container, which retains both layers.
export function vimeProtectedFullscreenPlugin() {
  return {
    name: 'vime-protected-youtube-fullscreen',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (!/[\\/]@vime[\\/]core[\\/]dist[\\/]custom-elements[\\/]index\.js(?:\?|$)/u.test(id)) {
        return null;
      }

      const nativeFullscreenCheck = '(this.playsinline && !this.isFullscreenActive)';
      if (code.split(nativeFullscreenCheck).length !== 3) {
        throw new Error('Vime fullscreen compatibility patch needs review: expected Player and Ui checks.');
      }

      // Keep the mobile sheet inside this player's clipped UI and above its
      // controls. This runs inside the shadow tree, where Vime sets the measured
      // --vm-controls-height on the settings host.
      const mobileSettings = '.settings.mobile.active{transform:translateY(0)}';
      const mobileClass = 'active: this.active,\n        mobile: this.isMobile,';
      if (code.split(mobileSettings).length !== 2 || code.split(mobileClass).length !== 2) {
        throw new Error('Vime mobile settings compatibility patch needs review: expected one mobile menu rule and class.');
      }
      code = code.replace(mobileClass, `${mobileClass}
        contained: getPlayerFromRegistry(this)?.matches('vm-player[data-protected-youtube]') === true,`)
        .replace(mobileSettings, `${mobileSettings}.settings.mobile.contained{position:absolute;bottom:var(--vm-controls-height,0px) !important;max-height:calc(100% - var(--vm-controls-height,0px))}`);

      return {
        code: code.replaceAll(
          nativeFullscreenCheck,
          '(this.playsinline && (!this.isFullscreenActive || isProtectedYouTubeContainerFullscreen()))',
        ) + `
function isProtectedYouTubeContainerFullscreen() {
  const element = document.fullscreenElement || document.webkitFullscreenElement;
  const player = element?.matches('vm-player') ? element : element?.getRootNode()?.host;
  return player?.matches('vm-player[data-protected-youtube]') === true;
}
`,
        map: null,
      };
    },
  };
}
