import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/nirma/.gemini/antigravity/brain/f861a983-b812-40e4-b4b5-31930e179fc4';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function runVerification() {
  console.log(`Starting Vite server...`);
  const server = await createServer({
    configFile: path.resolve(process.cwd(), 'vite.config.ts'),
    server: { port: 5179 },
  });
  await server.listen();
  const address = server.httpServer?.address();
  const port = typeof address === 'object' && address ? address.port : 5179;
  const url = `http://localhost:${port}`;
  console.log(`Vite running at ${url}`);

  console.log(`Launching browser: ${CHROME_PATH}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    pipe: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check'
    ],
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  try {
    // 1. Mobile 390px (Initial view with cookies banner)
    console.log(`Testing Mobile Viewport (390x844)...`);
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    // Dismiss cookie banner and hide dev toolbar for pristine visual validation
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find((b) => b.textContent?.includes('Accept all') || b.textContent?.includes('Alle akzeptieren'));
      if (target) target.click();

      const devTb = document.getElementById('dev-toolbar');
      if (devTb) devTb.style.display = 'none';
    });
    await new Promise((r) => setTimeout(r, 600));

    const mobileScreenshotPath = path.join(ARTIFACT_DIR, 'phase1-homepage-mobile-390px.png');
    await page.screenshot({ path: mobileScreenshotPath, fullPage: true });
    console.log(`Saved clean mobile screenshot: ${mobileScreenshotPath}`);

    // Test Keyboard navigation & Tab focus
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    console.log(`Active element after Tab navigation: <${focusedTag}>`);

    // 2. Desktop 1440px
    console.log(`Testing Desktop Viewport (1440x900)...`);
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await new Promise((r) => setTimeout(r, 500));

    const desktopScreenshotPath = path.join(ARTIFACT_DIR, 'phase1-homepage-desktop-1440px.png');
    await page.screenshot({ path: desktopScreenshotPath, fullPage: false });
    console.log(`Saved desktop screenshot: ${desktopScreenshotPath}`);

    // Check DOM elements
    const pageMetrics = await page.evaluate(() => {
      return {
        title: document.title,
        hasWordmark: !!document.querySelector('header a'),
        citiesCount: document.querySelectorAll('button[aria-label^="Events in"]').length,
        eventsCount: document.querySelectorAll('article[aria-label]').length,
        hasSearchCard: !!document.querySelector('form[role="search"]'),
      };
    });

    console.log('Page DOM Metrics:', pageMetrics);
    console.log('Console Errors:', consoleErrors.length === 0 ? 'None (Clean)' : consoleErrors);

  } catch (error) {
    console.error('Verification failed with error:', error);
  } finally {
    try {
      await browser.close();
      await server.close();
    } catch (e) {
      // ignore
    }
    console.log('Verification finished cleanly.');
  }
}

runVerification().catch(console.error);
