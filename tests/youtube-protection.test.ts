import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import { babelParse, parse } from '@vue/compiler-sfc';
import { vimeProtectedFullscreenPlugin } from '../utils/vimeProtectedFullscreen.ts';

const bundleUrl = new URL('../node_modules/@vime/core/dist/custom-elements/index.js', import.meta.url);
const bundle = await readFile(bundleUrl, 'utf8');
const plugin = vimeProtectedFullscreenPlugin();
const patched = plugin.transform(bundle, bundleUrl.pathname)!.code;
const ast = babelParse(patched, { sourceType: 'module' });

// Execute the installed package's renderers, rather than duplicating Vime's
// platform decision in the test. DOM rendering itself is checked in browsers.
function method(className: string, methodName: string, document: object, ios: boolean, globals = {}) {
  const variable = ast.program.body.flatMap(node =>
    node.type === 'VariableDeclaration' ? node.declarations : [],
  ).find(node => node.id.type === 'Identifier' && node.id.name === className);
  const declaration = variable?.init;
  assert.ok(declaration?.type === 'ClassExpression');
  const member = declaration.body.body.find(node =>
    node.type === 'ClassMethod' && node.key.type === 'Identifier' && node.key.name === methodName,
  );
  assert.ok(member?.type === 'ClassMethod');
  const helper = ast.program.body.find(node =>
    node.type === 'FunctionDeclaration' && node.id?.name === 'isProtectedYouTubeContainerFullscreen',
  )!;
  return runInNewContext(
    `${patched.slice(helper.start!, helper.end!)}\n(function() ${patched.slice(member.body.start!, member.body.end!)})`,
    { document, IS_IOS: ios, Host: 'host', Universe: { Provider: 'provider' }, ...globals,
      isUndefined: (value: unknown) => value === undefined,
      h: (tag: string, props: object, ...children: unknown[]) => ({ tag, props, children }) },
  );
}

function state(playsinline = true, fullscreen = false) {
  return {
    playsinline, isFullscreenActive: fullscreen, isVideoView: true,
    controls: false, paused: false, ready: true, playbackReady: true,
    hasCustomControls: () => true, genId: () => 'test-player',
    calcAspectRatio: () => 56.25, getPlayerState: () => ({}),
  };
}

function render(player: ReturnType<typeof state>, document = {}, ios = true) {
  const tree = method('Player', 'render', document, ios).call(player);
  const ui = method('UI', 'render', document, ios).call(player);
  return {
    blocker: JSON.stringify(tree).includes('"blocker"'),
    uiVisible: !ui.props.class.hidden && ui.children[0]?.tag === 'slot',
  };
}

test('course YouTube opts into inline playback and scoped fullscreen protection', async () => {
  const source = await readFile(new URL('../components/CourseDetails/Youtube.vue', import.meta.url), 'utf8');
  const template = parse(source).descriptor.template!.content;
  assert.match(template, /<Player\b[^>]*\bplaysinline\b[^>]*\bdata-protected-youtube\b/u);
});

test('installed Vime reproduces the missing-inline iOS native-control fallback', () => {
  const player = state(false);
  assert.deepEqual(render(player), { blocker: false, uiVisible: false });
  assert.equal(player.controls, true);
});

test('course play/pause preserves boolean state for Vue and native Vime events', async () => {
  const source = await readFile(new URL('../components/CourseDetails/Youtube.vue', import.meta.url), 'utf8');
  const script = parse(source).descriptor.scriptSetup!.content;
  const scriptAst = babelParse(script, { sourceType: 'module', plugins: ['typescript'] });
  const handler = scriptAst.program.body.flatMap(node =>
    node.type === 'VariableDeclaration' ? node.declarations : [],
  ).find(node => node.id.type === 'Identifier' && node.id.name === 'onPausedChange')!.init!;
  const isPlayerPaused = { value: false };
  const showStartOverlay = { value: false };
  const emitted: unknown[][] = [];
  const history: unknown[] = [];
  const onPausedChange = runInNewContext(
    stripTypeScriptTypes(`(${script.slice(handler.start!, handler.end!)})`),
    { isPlayerPaused, showStartOverlay,
      emit: (...args: unknown[]) => emitted.push(args),
      watchHistory: { handlePausedChange: (event: unknown) => history.push(event) } },
  );
  for (const event of [true, false, { detail: true }, { detail: false }]) {
    const paused = typeof event === 'boolean' ? event : event.detail;
    onPausedChange(event);
    assert.equal(isPlayerPaused.value, paused);
    assert.deepEqual(emitted.at(-1), ['playbackStateChange', !paused]);
    assert.equal(history.at(-1), event);
    assert.equal(showStartOverlay.value, false);
  }
});

for (const ios of [false, true]) {
  test(`inline YouTube retains the blocker and custom controls (iOS=${ios})`, () => {
    const player = state();
    assert.deepEqual(render(player, {}, ios), { blocker: true, uiVisible: true });
    assert.equal(player.controls, false);
    const params = method('YouTube', 'buildParams', {}, ios).call(player);
    assert.equal(params.playsinline, 1);
    assert.equal(params.controls, 0);
    assert.equal(params.disablekb, 1);
  });
}

for (const property of ['fullscreenElement', 'webkitFullscreenElement']) {
  test(`protected container keeps protection through ${property} entry and exit`, () => {
    const player = state(true, true);
    const element = { matches: (selector: string) => ['vm-player', 'vm-player[data-protected-youtube]'].includes(selector) };
    assert.deepEqual(render(player, { [property]: element }), { blocker: true, uiVisible: true });
    assert.equal(player.controls, false);
    player.isFullscreenActive = false;
    assert.deepEqual(render(player), { blocker: true, uiVisible: true });
    assert.equal(player.controls, false);
  });
}

test('fullscreen container inside the player shadow root also retains protection', () => {
  const host = { matches: () => true };
  const element = { matches: () => false, getRootNode: () => ({ host }) };
  assert.deepEqual(render(state(true, true), { fullscreenElement: element }), { blocker: true, uiVisible: true });
});

test('native video fullscreen and unmarked players keep the existing Vime behavior', () => {
  for (const document of [{}, { fullscreenElement: { matches: () => false, getRootNode: () => ({}) } }]) {
    const player = state(true, true);
    assert.deepEqual(render(player, document), { blocker: false, uiVisible: false });
    assert.equal(player.controls, true);
  }
});

test('compatibility patch ignores other modules and fails clearly if Vime changes', () => {
  assert.equal(plugin.transform(bundle, '/other/index.js'), null);
  assert.throws(() => plugin.transform('', bundleUrl.pathname), /needs review/u);
  assert.throws(() => plugin.transform(bundle.replace('.settings.mobile.active', '.changed'), bundleUrl.pathname), /needs review/u);
});

test('installed Vime hides fullscreen when container/provider capability is unavailable', () => {
  const renderControl = method('FullscreenControl', 'render', {}, true);
  for (const canSetFullscreen of [false, true]) {
    const control = renderControl.call({ canSetFullscreen, i18n: {}, onClick() {} });
    assert.equal(control.props.hidden, !canSetFullscreen);
    assert.equal(control.children[0].props.hidden, !canSetFullscreen);
  }
});

test('mobile settings containment is scoped to marked course players', () => {
  for (const protectedPlayer of [false, true]) {
    const settings = method('Settings', 'render', {}, true, {
      getPlayerFromRegistry: () => ({ matches: () => protectedPlayer }),
    }).call({ isMobile: true, active: true, menuHeight: 180, getPosition: () => ({}),
      onOpen() {}, onClose() {}, onHeightChange() {} });
    assert.equal(settings.props.class.mobile, true);
    assert.equal(settings.props.class.contained, protectedPlayer);
  }
});

test('viewport fullscreen resizes and exits without replacing the player or iframe', async () => {
  const source = await readFile(new URL('../components/CourseDetails/Youtube.vue', import.meta.url), 'utf8');
  const script = parse(source).descriptor.scriptSetup!.content;
  const scriptAst = babelParse(script, { sourceType: 'module', plugins: ['typescript'] });
  const names = ['resizeViewportPlayer', 'exitViewportFullscreen', 'toggleViewportFullscreen'];
  const declarations = scriptAst.program.body.filter(node =>
    node.type === 'FunctionDeclaration' && names.includes(node.id!.name),
  ).map(node => script.slice(node.start!, node.end!)).join('\n');
  const calls: string[] = [];
  const shell = { clientWidth: 390, clientHeight: 664,
    close: () => calls.push('close'), show: () => calls.push('inline'),
    showModal: () => calls.push('modal') };
  const viewportFullscreen = { value: false };
  const playerAspectRatio = { value: '16:9' };
  const document = { body: { style: { overflow: 'auto' } } };
  const handlers = runInNewContext(stripTypeScriptTypes(`
    let fullscreenResizeObserver, previousBodyOverflow;
    ${declarations}
    ({ toggleViewportFullscreen, resizeViewportPlayer, exitViewportFullscreen });
  `), { playerShell: { value: shell }, viewportFullscreen, playerAspectRatio, document,
    ResizeObserver: class {
      observe(target: object) { assert.equal(target, shell); calls.push('observe'); }
      disconnect() { calls.push('disconnect'); }
    } });
  handlers.toggleViewportFullscreen();
  handlers.resizeViewportPlayer();
  assert.equal(viewportFullscreen.value, true);
  assert.equal(document.body.style.overflow, 'hidden');
  assert.equal(playerAspectRatio.value, '390:664');
  shell.clientWidth = 844;
  shell.clientHeight = 390;
  handlers.resizeViewportPlayer();
  assert.equal(playerAspectRatio.value, '844:390');
  handlers.exitViewportFullscreen();
  assert.equal(viewportFullscreen.value, false);
  assert.equal(document.body.style.overflow, 'auto');
  assert.equal(playerAspectRatio.value, '16:9');
  assert.deepEqual(calls, ['close', 'modal', 'observe', 'disconnect', 'close', 'inline']);
  handlers.exitViewportFullscreen();
  assert.equal(calls.length, 6);
});
