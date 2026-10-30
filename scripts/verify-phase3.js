import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/nirma/.gemini/antigravity/brain/f861a983-b812-40e4-b4b5-31930e179fc4';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function runVerification() {
  console.log(`Starting Vite server for Phase 3...`);
  const server = await createServer({
    configFile: path.resolve(process.cwd(), 'vite.config.ts'),
    server: { port: 5181 },
  });
  await server.listen();
  const address = server.httpServer?.address();
  const port = typeof address === 'object' && address ? address.port : 5181;
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
    // TEST 1: Checkout Page (/checkout/evt-lea-berlin)
    // ----------------------------------------------------
    console.log(`Navigating to /checkout/evt-lea-berlin...`);
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(`${baseUrl}/checkout/evt-lea-berlin`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    // Dismiss banner & hide toolbar
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find((b) => b.textContent?.includes('Accept all') || b.textContent?.includes('Alle'));
      if (target) target.click();
      const devTb = document.getElementById('dev-toolbar');
      if (devTb) devTb.style.display = 'none';
    });

    const checkoutMobilePath = path.join(ARTIFACT_DIR, 'phase3-checkout-mobile-390px.png');
    await page.screenshot({ path: checkoutMobilePath, fullPage: true });
    console.log(`Saved Checkout mobile screenshot: ${checkoutMobilePath}`);

    // Desktop Checkout (1440px)
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await new Promise((r) => setTimeout(r, 400));
    const checkoutDesktopPath = path.join(ARTIFACT_DIR, 'phase3-checkout-desktop-1440px.png');
    await page.screenshot({ path: checkoutDesktopPath, fullPage: false });
    console.log(`Saved Checkout desktop screenshot: ${checkoutDesktopPath}`);

    // Test Promo Code ENTREO10
    console.log(`Testing Promo Code ENTREO10...`);
    await page.type('input[placeholder*="Rabattcode"]', 'ENTREO10');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const applyBtn = btns.find((b) => b.textContent?.includes('Anwenden') || b.textContent?.includes('Apply'));
      if (applyBtn) applyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Fill attendee details
    console.log(`Filling Attendee Details...`);
    await page.type('input[placeholder="Sophie"]', 'Clara');
    await page.type('input[placeholder="Müller"]', 'Schumann');
    await page.type('input[placeholder*="beispiel.de"]', 'clara.schumann@kultur-berlin.de');

    // Submit order
    console.log(`Submitting order...`);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const submitBtn = btns.find((b) => b.textContent?.includes('buchen') || b.textContent?.includes('Complete Booking'));
      if (submitBtn) submitBtn.click();
    });

    // Wait for payment processing & redirect
    await new Promise((r) => setTimeout(r, 2000));
    console.log(`Redirected to: ${page.url()}`);

    // ----------------------------------------------------
    // TEST 2: Confirmation Page
    // ----------------------------------------------------
    const confirmationDesktopPath = path.join(ARTIFACT_DIR, 'phase3-confirmation-desktop-1440px.png');
    await page.screenshot({ path: confirmationDesktopPath, fullPage: false });
    console.log(`Saved Confirmation desktop screenshot: ${confirmationDesktopPath}`);

    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await new Promise((r) => setTimeout(r, 400));
    const confirmationMobilePath = path.join(ARTIFACT_DIR, 'phase3-confirmation-mobile-390px.png');
    await page.screenshot({ path: confirmationMobilePath, fullPage: true });
    console.log(`Saved Confirmation mobile screenshot: ${confirmationMobilePath}`);

    // ----------------------------------------------------
    // TEST 3: My Tickets / Wallet (/my-tickets)
    // ----------------------------------------------------
    console.log(`Navigating to /my-tickets...`);
    await page.goto(`${baseUrl}/my-tickets`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 500));

    const walletMobilePath = path.join(ARTIFACT_DIR, 'phase3-wallet-mobile-390px.png');
    await page.screenshot({ path: walletMobilePath, fullPage: true });
    console.log(`Saved Wallet mobile screenshot: ${walletMobilePath}`);

    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await new Promise((r) => setTimeout(r, 400));
    const walletDesktopPath = path.join(ARTIFACT_DIR, 'phase3-wallet-desktop-1440px.png');
    await page.screenshot({ path: walletDesktopPath, fullPage: false });
    console.log(`Saved Wallet desktop screenshot: ${walletDesktopPath}`);

    console.log('Console Errors:', consoleErrors.length === 0 ? 'None (Clean)' : consoleErrors);

  } catch (error) {
    console.error('Phase 3 verification failed:', error);
  } finally {
    try {
      await browser.close();
      await server.close();
    } catch (e) {
      // ignore
    }
    console.log('Phase 3 verification finished.');
  }
}

runVerification().catch(console.error);

