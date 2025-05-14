const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');

const HEADLESS = false; // Set ke false untuk debug

(async () => {
  console.log(`
██╗██╗    ███╗   ██╗████████╗ ██████╗ ██████╗ ██╗
██║██║    ████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗██║
██║██║    ██╔██╗ ██║   ██║   ██████╔╝██║  ██║██║
██║██║    ██║╚██╗██║   ██║   ██╔══██╗██║  ██║██║
██║██████╗██║ ╚████║   ██║   ██████╔╝██████╔╝███████╗
╚═╝╚═════╝╚═╝  ╚══╝   ╚═╝   ╚═════╝ ╚═════╝ ╚══════╝

👤 Bot dijalankan oleh: KWONTOL
`);

  const addresses = fs.readFileSync('addresses.txt', 'utf-8').split('\n').filter(Boolean);

  const browser = await puppeteer.launch({
    headless: HEADLESS,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (let address of addresses) {
    console.log(`🚀 Submit address: ${address}`);
    try {
      await page.goto('https://exchange-airdrop.msu.io/', { waitUntil: 'networkidle2' });

      // Tunggu modal terms & klik "I agree"
      try {
        await page.waitForSelector('button:has-text("I Agree")', { timeout: 5000 });
        await page.click('button:has-text("I Agree")');
        console.log('✅ Klik tombol I Agree');
      } catch (e) {
        console.log('⚠️ Tombol I Agree tidak ditemukan (mungkin sudah disetujui sebelumnya)');
      }

      // Tunggu input muncul
      await page.waitForSelector('input#f', { timeout: 10000 });
      await page.type('input#f', address);

      // Tekan Enter (submit)
      await page.keyboard.press('Enter');

      await page.waitForTimeout(3000);
    } catch (err) {
      console.error(`❌ Gagal submit ${address}:`, err.message);
    }
  }

  await browser.close();
  console.log('✅ Selesai!');
})();
