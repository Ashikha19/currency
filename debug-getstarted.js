const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', (err) => console.log('PAGEERROR:' + err.message));
  page.on('console', (msg) => console.log('CONSOLE:' + msg.type() + ':' + msg.text()));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('URL1=' + page.url());

  try {
    await page.fill('input[placeholder="Email"]', 'test@example.com');
    await page.fill('input[placeholder="Password"]', '123456');
    await page.click('button:has-text("Login")');
  } catch (err) {
    console.log('LOGIN_ERROR=' + err.message);
  }

  await page.waitForTimeout(3000);
  console.log('URL2=' + page.url());
  console.log('BODY=' + await page.locator('body').innerText());

  await browser.close();
})();
