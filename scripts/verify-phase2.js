import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/nirma/.gemini/antigravity/brain/f861a983-b812-40e4-b4b5-31930e179fc4';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function runVerification() {
  console.log(`Starting Vite server for Phase 2...`);
  const server = await createServer({
    configFile: path.resolve(process.cwd(), 'vite.config.ts'),
    server: { port: 5180 },
  });
  await server.listen();
  const address = server.httpServer?.address();
  const port = typeof address === 'object' && address ? address.port : 5180;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Vite running at ${baseUrl}`);

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
    // ----------------------------------------------------
    // TEST 1: Discovery Page (/events)
    // ----------------------------------------------------
    console.log(`Navigating to /events...`);
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(`${baseUrl}/events`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    // Dismiss banner & hide toolbar
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find((b) => b.textContent?.includes('Accept all') || b.textContent?.includes('Alle'));
      if (target) target.click();
      const devTb = document.getElementById('dev-toolbar');
      if (devTb) devTb.style.display = 'none';
    });

    const discoveryMobilePath = path.join(ARTIFACT_DIR, 'phase2-discovery-mobile-390px.png');
    await page.screenshot({ path: discoveryMobilePath, fullPage: true });
    console.log(`Saved Discovery mobile screenshot: ${discoveryMobilePath}`);

    // Desktop Discovery (1440px)
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await new Promise((r) => setTimeout(r, 400));
    const discoveryDesktopPath = path.join(ARTIFACT_DIR, 'phase2-discovery-desktop-1440px.png');
    await page.screenshot({ path: discoveryDesktopPath, fullPage: false });
    console.log(`Saved Discovery desktop screenshot: ${discoveryDesktopPath}`);

    // Test filter interaction: select category "Concerts"
    await page.evaluate(() => {
      const catBtns = Array.from(document.querySelectorAll('button'));
      const concertBtn = catBtns.find((b) => b.textContent?.includes('Concerts') || b.textContent?.includes('Konzerte'));
      if (concertBtn) concertBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    const eventsAfterFilter = await page.evaluate(() => document.querySelectorAll('article').length);
    console.log(`Events matching category filter: ${eventsAfterFilter}`);

    // ----------------------------------------------------
    // TEST 2: Event Detail Page (/events/evt-lea-berlin)
    // ----------------------------------------------------
    console.log(`Navigating to Event Detail (/events/evt-lea-berlin)...`);
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(`${baseUrl}/events/evt-lea-berlin`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    await page.evaluate(() => {
      const devTb = document.getElementById('dev-toolbar');
      if (devTb) devTb.style.display = 'none';
    });

    const detailMobilePath = path.join(ARTIFACT_DIR, 'phase2-detail-mobile-390px.png');
    await page.screenshot({ path: detailMobilePath, fullPage: true });
    console.log(`Saved Event Detail mobile screenshot: ${detailMobilePath}`);

    // Desktop Event Detail (1440px)
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await new Promise((r) => setTimeout(r, 400));
    const detailDesktopPath = path.join(ARTIFACT_DIR, 'phase2-detail-desktop-1440px.png');
    await page.screenshot({ path: detailDesktopPath, fullPage: false });
    console.log(`Saved Event Detail desktop screenshot: ${detailDesktopPath}`);

    // Test ticket stepper (+ button)
    await page.evaluate(() => {
      const plusBtns = Array.from(document.querySelectorAll('button'));
      const plus = plusBtns.find((b) => b.textContent?.trim() === '+');
      if (plus) plus.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Check DOM Metrics
    const detailMetrics = await page.evaluate(() => {
      return {
        title: document.querySelector('h1')?.textContent,
        hasVenueMap: !!document.querySelector('svg pattern#grid'),
        hasTicketSelector: !!document.getElementById('ticket-selection-section'),
        ticketTiersCount: document.querySelectorAll('#ticket-selection-section .border').length,
        hasStickyMobileCTA: !!document.querySelector('.lg\\:hidden.fixed.bottom-0'),
      };
    });

    console.log('Detail DOM Metrics:', detailMetrics);
    console.log('Console Errors:', consoleErrors.length === 0 ? 'None (Clean)' : consoleErrors);

  } catch (error) {
    console.error('Phase 2 verification failed:', error);
  } finally {
    try {
      await browser.close();
      await server.close();
    } catch (e) {
      // ignore
    }
    console.log('Phase 2 verification finished.');
  }
}

runVerification().catch(console.error);

