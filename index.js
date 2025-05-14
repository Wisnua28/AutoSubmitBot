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

  // Launch Chrome dari sistem
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

      // Ganti selector ini sesuai elemen input/form di website
      await page.type('input[name="address"]', address); // contoh saja
      await page.click('button[type="submit"]'); // contoh tombol submit

      // Tunggu sedikit sebelum ke address selanjutnya
      await page.waitForTimeout(3000);
    } catch (err) {
      console.error(`❌ Gagal submit ${address}:`, err.message);
    }
  }

  await browser.close();
  console.log('✅ Selesai!');
})();
