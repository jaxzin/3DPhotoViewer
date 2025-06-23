import puppeteer from 'puppeteer';
import { jest } from '@jest/globals';

jest.setTimeout(20000);

let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--allow-file-access-from-files', '--disable-dev-shm-usage'],
    executablePath: process.env.PUPPETEER_EXEC_PATH,
    headless: true,
  });
});

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

test('viewer initializes', async () => {
  const page = await browser.newPage();
  const url = 'file://' + process.cwd() + '/lkg-viewer/index.html';
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForSelector('canvas');
  const viewerExists = await page.evaluate(() => typeof window.viewer !== 'undefined');
  expect(viewerExists).toBe(true);
});
