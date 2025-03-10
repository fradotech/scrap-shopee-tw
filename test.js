const { chromium } = require("playwright-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

chromium.use(StealthPlugin());

const proxies = [
  {
    server: "http://brd.superproxy.io:33335",
    username: "brd-customer-hl_3f82f1a4-zone-web_unlocker1",
    password: "vn0pphksr0sh",
  },
  {
    server: "http://brd.superproxy.io:33335",
    username: "brd-customer-hl_3f82f1a4-zone-web_unlocker2",
    password: "0w4lhi3it6dg",
  },
];

function getRandomProxy() {
  return proxies[Math.floor(Math.random() * proxies.length)];
}

function delay(min, max) {
  const time = Math.floor(min + Math.random() * (max - min));
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const test = async () => {
  const proxy = getRandomProxy();
  console.log(`Using proxy: ${proxy.server} with username: ${proxy.username}`);

  const browser = await chromium.launch({
    headless: false,
    proxy: proxy,
    timeout: 6000000,
    args: [
      "--disable-features=site-per-process",
      "--disable-web-security",
      "--disable-features=IsolateOrigins",
      "--disable-site-isolation-trials",
    ],
  });

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 MicroMessenger/7.0.20",
    "Mozilla/5.0 (Linux; Android 12; SM-G9980) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36 Line/12.11.1",
  ];

  const selectedUserAgent =
    userAgents[Math.floor(Math.random() * userAgents.length)];
  console.log(`\nUsing user-agent: ${selectedUserAgent}`);

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    userAgent: selectedUserAgent,
    locale: "zh-TW",
    timezoneId: "Asia/Taipei",
    viewport: {
      width: 1366 + getRandomInt(-100, 100),
      height: 768 + getRandomInt(-50, 50),
    },
    deviceScaleFactor: 1,
    hasTouch: false,
    javaScriptEnabled: true,
    colorScheme: Math.random() > 0.5 ? "dark" : "light",
    acceptDownloads: true,
    extraHTTPHeaders: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      "Cache-Control": "max-age=0",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      DNT: "1",
    },
  });

  await context.addCookies([
    {
      name: "SPC_SI",
      value: getRandomInt(1000000000, 9999999999).toString(),
      domain: ".shopee.tw",
      path: "/",
    },
    {
      name: "SPC_F",
      value: getRandomInt(1000000000, 9999999999).toString(),
      domain: ".shopee.tw",
      path: "/",
    },
  ]);

  const page = await context.newPage();
  page.setDefaultNavigationTimeout(600000);

  const searchTerms = [
    "thermos bottle",
    "travel mug",
    "insulated cup",
    "stainless steel tumbler",
    "vacuum flask",
    "water bottle",
    "yeti cup",
    "coffee mug",
    "cold cup",
    "thermal bottle",
  ];

  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));

  page.on("response", async (response) => {
    const status = response.status();
    if (status >= 400) {
      console.log(`\nResponse error: ${status} for ${response.url()}`);
    }
  });

  try {
    console.log("\nVisiting Shopee homepage...");
    await page.goto("https://shopee.tw/", {
      waitUntil: "domcontentloaded",
      timeout: 600000,
    });

    await delay(3000, 6000);

    // Close popup if it appears
    try {
      const popupCloseButton = await page.$('[class*="shopee-popup-close"]');
      if (popupCloseButton) {
        await popupCloseButton.click();
        await delay(1000, 2000);
      }
    } catch (err) {
      console.log("No popup detected or failed to close popup");
    }

    await simulateNormalBrowsing(page);

    const randomSearchTerm =
      searchTerms[Math.floor(Math.random() * searchTerms.length)];
    console.log(`Searching for: ${randomSearchTerm}`);

    await page.goto(
      `https://shopee.tw/search?keyword=${encodeURIComponent(
        randomSearchTerm
      )}`,
      {
        waitUntil: "domcontentloaded",
        timeout: 600000,
      }
    );

    await delay(5000, 8000);

    const items = await page.$$(".shopee-search-item-result__item");
    if (items.length > 0) {
      const randomIndexes = [
        Math.floor(Math.random() * items.length),
        Math.floor(Math.random() * items.length),
      ];

      for (const idx of randomIndexes) {
        await items[idx].hover();
        await delay(1000 + Math.random() * 2000);
      }
    }

    /* =========== Go to detail page =========== */
    await page.waitForSelector(".shopee-search-item-result__item a");
    const productLinks = await page.$$eval(
      ".shopee-search-item-result__item a",
      (links) => links.map((link) => link.href)
    );

    if (productLinks.length < 0) console.log("Failed find product!");

    console.log(
      "\n\nGo to detail page: ",
      productLinks[Math.floor(Math.random() * productLinks.length)]
    );

    await page.goto(productLinks[0], { waitUntil: "networkidle" });
    await page.waitForLoadState("networkidle");

    const htmlContent = await page.content();

    /* =========== Result as string =========== */
    console.log("\n\nproduct-detail\n\n", htmlContent, "\n\n");
    console.log("Success get detail product");
  } catch (error) {
    console.error(`Error during scraping: ${error.message}`);
  } finally {
    if (process.env.DEBUG) {
      console.log("DEBUG mode: browser will stay open");
      await browser.pause();
    } else {
      await browser.close();
    }
  }
};

async function simulateNormalBrowsing(page) {
  console.log("Simulating normal browsing behavior...");

  for (let i = 0; i < getRandomInt(3, 6); i++) {
    await page.mouse.move(
      getRandomInt(0, page.viewportSize().width),
      getRandomInt(0, page.viewportSize().height),
      { steps: getRandomInt(10, 30) }
    );
    await delay(500, 1500);
  }

  for (let i = 0; i < getRandomInt(4, 8); i++) {
    const scrollAmount = getRandomInt(100, 500);
    await page.mouse.wheel(0, scrollAmount);
    await delay(1000, 3000);

    if (Math.random() > 0.7) {
      await page.mouse.wheel(0, -getRandomInt(50, 150));
      await delay(800, 1500);
    }
  }
}

async function simulateProductPageInteraction(page) {
  console.log("Simulating product page interaction...");

  await page.evaluate(() => window.scrollBy(0, 300));
  await delay(1000, 2000);

  try {
    const productImages = await page.$$('div[class*="product-image"] img');
    if (productImages.length > 0) {
      for (let i = 0; i < Math.min(3, productImages.length); i++) {
        await productImages[i].hover();
        await delay(1000, 2000);
      }
    }
  } catch (e) {
    console.log("Could not interact with product images");
  }

  await page.evaluate(() => window.scrollBy(0, 600));
  await delay(2000, 3500);

  await page.evaluate(() => window.scrollBy(0, -200));
  await delay(1000, 2000);
}

test();
