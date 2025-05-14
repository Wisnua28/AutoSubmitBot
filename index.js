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
    headless: HEADLESS ? "new" : false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (let address of addresses) {
    console.log(`🚀 Submit address: ${address}`);
    try {
      await page.goto('https://exchange-airdrop.msu.io/', { waitUntil: 'networkidle2' });

      // Klik tombol "I Agree" kalau ada
      const agreeButton = await page.$x("//button[contains(., 'I Agree')]");
      if (agreeButton.length > 0) {
        await agreeButton[0].click();
        console.log('✅ Klik tombol "I Agree"');
        await page.waitForTimeout(2000);
      } else {
        console.log('⚠️ Tombol "I Agree" tidak ditemukan (mungkin sudah disetujui sebelumnya)');
      }

      // Tunggu dan isi input wallet menggunakan XPath
      await page.waitForXPath("//input[@placeholder='Enter Address']", { timeout: 20000 });
      const inputField = await page.$x("//input[@placeholder='Enter Address']");
      if (inputField.length > 0) {
        await inputField[0].type(address);
        console.log('✍️ Address diisi');
      } else {
        console.log('❌ Input field tidak ditemukan!');
      }

      // Klik tombol submit
      await page.waitForSelector('button[type="submit"]', { timeout: 20000 });
      await page.click('button[type="submit"]');
      console.log('📨 Klik tombol Submit');

      // Tunggu sebentar
      await page.waitForTimeout(3000);
    } catch (err) {
      console.error(`❌ Gagal submit ${address}:`, err.message);
      await page.screenshot({ path: `error-${address}.png` });
      console.log(`📸 Screenshot disimpan: error-${address}.png`);
    }
  }

  await browser.close();
  console.log('✅ Selesai!');
})();
