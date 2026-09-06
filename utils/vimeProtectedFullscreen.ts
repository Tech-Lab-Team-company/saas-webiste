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
