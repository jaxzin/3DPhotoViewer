import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    executablePath: process.env.PUPPETEER_EXEC_PATH,
    headless: false,
  });
  try {
    const page = await browser.newPage();
    const url = 'file://' + process.cwd() + '/lkg-viewer/index.html';
    await page.goto(url);
    await page.waitForSelector('canvas');
    const viewerExists = await page.evaluate(() => typeof window.viewer !== 'undefined');
    if (!viewerExists) {
      throw new Error('viewer global not found');
    }
    console.log('Integration tests passed');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
