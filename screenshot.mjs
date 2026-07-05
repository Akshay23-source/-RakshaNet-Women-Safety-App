import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 20000 });
await page.screenshot({ path: '/tmp/rakshanet-home.png' });
console.log('Screenshot saved');
await browser.close();
