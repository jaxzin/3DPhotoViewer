import puppeteer from 'puppeteer';

let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox'],
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
  const url = 'file://' + process.cwd() + '/lkg-viewer/index.html';
  await page.goto(url);
  await page.waitForSelector('canvas');
  const viewerExists = await page.evaluate(() => typeof window.viewer !== 'undefined');
  expect(viewerExists).toBe(true);
});
