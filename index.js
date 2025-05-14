require("dotenv").config();
const fs = require("fs");
const puppeteer = require("puppeteer");

const USER_NAME = process.env.USER_NAME || "User";  // Default ke "User" jika tidak ada
const WALLET_FILE = process.env.WALLET_FILE || "addresses.txt";
const MAX_ADDRESS = parseInt(process.env.MAX_ADDRESS || "1000");
const DELAY_SECONDS = parseInt(process.env.DELAY_SECONDS || "5");
const HEADLESS = process.env.HEADLESS !== "false"; // default true
const TARGET_URL = "https://exchange-airdrop.msu.io/";

async function delay(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function submitAddress(page, address) {
  try {
    await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("input");

    await page.type("input", address);
    await page.keyboard.press("Enter");

    console.log(`✅ Submitted: ${address}`);
    await delay(DELAY_SECONDS);
  } catch (err) {
    console.log(`❌ Gagal submit ${address}: ${err.message}`);
  }
}

(async () => {
  if (!fs.existsSync(WALLET_FILE)) {
    console.error(`❌ File tidak ditemukan: ${WALLET_FILE}`);
    process.exit(1);
  }

  const addresses = fs
    .readFileSync(WALLET_FILE, "utf-8")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .slice(0, MAX_ADDRESS);

  if (addresses.length === 0) {
    console.error("❌ Tidak ada address untuk diproses.");
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: HEADLESS });
  const page = await browser.newPage();

  console.log(`🚀 Mulai submit ${addresses.length} address...\n`);
  console.log(`👤 Bot dijalankan oleh: ${USER_NAME}\n`);

  for (const address of addresses) {
    await submitAddress(page, address);
  }

  await browser.close();
  console.log("\n✅ Semua selesai!");
})();


