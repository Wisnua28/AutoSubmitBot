const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');

const HEADLESS = true;

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

      // Tambah jeda agar semua elemen dimuat
      await page.waitForTimeout(5000);

      // Ganti dengan selector yang pasti: name="wallet_address"
      await page.waitForSelector('input[name="wallet_address"]', { timeout: 10000 });
      await page.type('input[name="wallet_address"]', address);

      // Submit dengan tekan Enter
      await page.keyboard.press('Enter');

      await page.waitForTimeout(3000);
    } catch (err) {
      console.error(`❌ Gagal submit ${address}:`, err.message);
    }
  }

  await browser.close();
  console.log('✅ Selesai!');
})();
