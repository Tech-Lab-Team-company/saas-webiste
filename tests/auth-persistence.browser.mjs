// Run against a running app with: node --test tests/auth-persistence.browser.mjs
// Playwright must be available; PLAYWRIGHT_MODULE may point to its index.mjs.
// API responses are mocked: no real credentials or backend writes are used.
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import test from 'node:test';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.AUTH_TEST_ORIGIN || 'http://127.0.0.1:3100';
const redirectedLogin = /\/loginhome\?redirect=(?:%2F|\/)student-dashboard$/;
const token = 'test-only-student-token';
const user = {
  id: 123, name: 'Persistence Student', email: 'student@example.test',
  phone: '01000000000', token, image: '', is_verified: true, category_id: 2,
};

test('student authentication survives refresh, tab reopening and browser restart', { timeout: 240_000 }, async () => {
  const profile = await mkdtemp(join(tmpdir(), 'student-auth-'));
  let context;
  let rejectSession = false;
  let loginCount = 0;
  let authenticatedRequests = 0;
  const launch = async () => {
    context = await chromium.launchPersistentContext(profile, {
      headless: true,
      ...(process.env.AUTH_TEST_BROWSER ? { executablePath: process.env.AUTH_TEST_BROWSER } : {}),
    });
    await context.route('**/api/website/**', async route => {
      const request = route.request();
      const endpoint = new URL(request.url()).pathname.split('/').at(-1);
      let data = [];
      if (endpoint === 'desktop_login') {
        loginCount++;
        const body = request.postDataJSON();
        assert.equal(body.credentials, user.phone);
        assert.equal(body.password, 'test-only-password');
        data = user;
      } else if (endpoint === 'fetch_my_courses') {
        assert.equal(request.headers().authorization, `Bearer ${token}`);
        authenticatedRequests++;
        if (rejectSession) {
          await route.fulfill({ status: 401, json: { status: false, message: 'Unauthenticated.' } });
          return;
        }
      } else if (endpoint === 'fetch_web_status') {
        data = null;
      } else if (endpoint === 'logout' || endpoint === 'change_online_status') {
        data = user;
      }
      await route.fulfill({ json: { status: true, message: 'OK', data } });
    });
    return context.pages()[0] || await context.newPage();
  };
  const storedUser = async () => {
    const cookie = (await context.cookies(origin)).find(cookie => cookie.name === 'user');
    return cookie ? JSON.parse(decodeURIComponent(cookie.value)).user : null;
  };
  const dashboard = async page => {
    await page.waitForURL(`${origin}/student-dashboard`);
    try {
      await page.waitForFunction(() => document.body.innerText.includes('Persistence Student'));
    } catch (error) {
      console.log('Restoration diagnostics:', {
        url: page.url(),
        cookiePresent: Boolean(await storedUser()),
        body: (await page.locator('body').innerText()).slice(0, 400),
      });
      throw error;
    }
    assert.equal((await storedUser())?.apiToken, token);
  };
  const login = async page => {
    await page.goto(`${origin}/loginhome`);
    await page.locator('#login-phone').fill(user.phone);
    await page.locator('#login-password').fill('test-only-password');
    await page.locator('.login-home-submit').click();
    await dashboard(page);
  };
  const assertNoStoredSecrets = async page => {
    const storage = await page.evaluate(() => [localStorage, sessionStorage].flatMap(storage =>
      Object.keys(storage).map(key => storage.getItem(key))));
    assert.ok(storage.every(value => !value?.includes(token) && !value?.includes('test-only-password')));
  };

  try {
    let page = await launch();
    await login(page);
    await assertNoStoredSecrets(page);
    await page.reload();
    await dashboard(page);
    console.log('PASS: login and refresh');

    // Keep a blank tab open to distinguish closing a tab from ending the browser.
    const blankTab = await context.newPage();
    await page.close();
    page = await context.newPage();
    await blankTab.close();
    await page.goto(`${origin}/student-dashboard`);
    await dashboard(page);
    console.log('PASS: close tab and reopen');

    const cookie = (await context.cookies(origin)).find(cookie => cookie.name === 'user');
    console.log(`User cookie is ${cookie.expires === -1 ? 'session-only' : 'persistent'}`);
    await context.close();
    page = await launch();
    await page.goto(`${origin}/student-dashboard`);
    await dashboard(page);
    assert.equal(loginCount, 1, 'restoration must not require another login');
    assert.ok(cookie.expires > Date.now() / 1000 + 28 * 24 * 60 * 60);
    assert.equal(cookie.path, '/');
    assert.equal(cookie.sameSite, 'Lax');
    await assertNoStoredSecrets(page);
    console.log('PASS: browser restart with the same cookie profile');

    // The dashboard sidebar uses the existing store logout action.
    await page.locator('.profile-logout').click();
    await page.waitForURL(`${origin}/loginhome`);
    await page.reload();
    assert.equal(await storedUser(), null);
    await page.goto(`${origin}/student-dashboard`);
    await page.waitForURL(redirectedLogin);
    console.log('PASS: logout stays logged out after refresh and protected navigation');

    await login(page);
    rejectSession = true;
    await page.reload();
    await page.waitForURL(redirectedLogin);
    await page.reload();
    assert.equal(await storedUser(), null);
    console.log('PASS: expired/revoked bearer token returns 401, clears state and redirects');

    rejectSession = false;
    await login(page);
    const expiringCookie = (await context.cookies(origin)).find(cookie => cookie.name === 'user');
    await context.addCookies([{ ...expiringCookie, expires: Math.floor(Date.now() / 1000) - 1 }]);
    await page.reload();
    await page.waitForURL(redirectedLogin);
    assert.equal(await storedUser(), null);
    assert.ok(authenticatedRequests >= 4);
    console.log('PASS: expired persistence cookie redirects safely');
  } finally {
    await context?.close();
    assert.equal(dirname(resolve(profile)), resolve(tmpdir()));
    assert.ok(basename(profile).startsWith('student-auth-'));
    await rm(profile, { recursive: true, force: true });
  }
});
