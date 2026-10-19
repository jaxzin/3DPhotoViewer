import puppeteer from 'puppeteer';
import { jest } from '@jest/globals';

jest.setTimeout(60000);

let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--allow-file-access-from-files'],
    executablePath: process.env.PUPPETEER_EXEC_PATH,
    headless: false,
  });
});

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

test('viewer initializes', async () => {
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));
  const url = 'http://localhost:8080/lkg-viewer/index.html';
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForSelector('canvas', { timeout: 60000 });
  const viewerExists = await page.evaluate(() => typeof window.viewer !== 'undefined');
  expect(viewerExists).toBe(true);
});
