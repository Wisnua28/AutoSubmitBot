const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');

const HEADLESS = true; // ubah ke false kalau ingin lihat browser

(async () => {
  // Menampilkan logo dan nama
  console.log(`
██╗██╗    ███╗   ██╗████████╗ ██████╗ ██████╗ ██╗
██║██║    ████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗██║
██║██║    ██╔██╗ ██║   ██║   ██████╔╝██║  ██║██║
██║██║    ██║╚██╗██║   ██║   ██╔══██╗██║  ██║██║
██║██████╗██║ ╚████║   ██║   ██████╔╝██████╔╝███████╗
╚═╝╚═════╝╚═╝  ╚══╝   ╚═╝   ╚═════╝ ╚═════╝ ╚══════╝

👤 Bot dijalankan oleh: KWONTOL
`);

  // Load address dari file
  const addresses = fs.readFileSync('addresses.txt', 'utf-8').split('\n').filter(Boolean);

  // Launch Chrome
  const browser = await puppeteer.launch({
    headless: HEADLESS,
    executablePath: '/usr/bin/google-chrome', // pastikan chrome sistem terinstal
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (let address of addresses) {
    console.log(`🚀 Submit address: ${address}`);
    try {
      await page.goto('https://exchange-airdrop.msu.io/', { waitUntil: 'networkidle2' });

      // Tunggu sampai input dengan id 'f' tersedia
      await page.waitForSelector('#f', { timeout: 10000 });

      // Isi alamat wallet
      await page.type('#f', address);

      // Tekan Enter untuk submit
      await page.keyboard.press('Enter');

      // Tunggu sebentar sebelum lanjut
      await page.waitForTimeout(3000);
    } catch (err) {
      console.error(`❌ Gagal submit ${address}:`, err.message);
    }
  }

  await browser.close();
  console.log('✅ Selesai!');
})();

