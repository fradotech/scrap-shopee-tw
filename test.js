const { chromium } = require("playwright");

const proxies = [
  {
    server: "http://brd.superproxy.io:33335",
    username: "brd-customer-hl_155f2a69-zone-web_unlocker1",
    password: "z7efosqp13v1",
  },
  {
    server: "http://brd.superproxy.io:33335",
    username: "brd-customer-hl_155f2a69-zone-web_unlocker2",
    password: "hztios8y76y4",
  },
  {
    server: "http://brd.superproxy.io:33335",
    username: "brd-customer-hl_155f2a69-zone-web_unlocker3",
    password: "7fdj6mupjzx6",
  },
  {
    server: "http://brd.superproxy.io:33335",
    username: "brd-customer-hl_155f2a69-zone-web_unlocker4",
    password: "zdf3m01zk137",
  },
];

function getRandomProxy() {
  return proxies[Math.floor(Math.random() * proxies.length)];
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

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
];

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

const test = async () => {
  let browser = null;
  let page = null;

  try {
    const randomSearchTerm =
      searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const randomUserAgent =
      userAgents[Math.floor(Math.random() * userAgents.length)];
    const selectedProxy = getRandomProxy();

    console.log(`Using search term: ${randomSearchTerm}`);
    console.log(`Using proxy: ${selectedProxy.username}`);

    // Launch browser with corrected options
    browser = await chromium.launch({
      headless: false,
      proxy: {
        server: selectedProxy.server,
        username: selectedProxy.username,
        password: selectedProxy.password,
      },
      timeout: 600000,
      args: [
        "--disable-blink-features=AutomationControlled",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });

    // Create a context with more realistic browser fingerprint
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      userAgent: randomUserAgent,
      locale: "zh-TW",
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      hasTouch: false,
      geolocation: { longitude: 121.5, latitude: 25.0 },
      permissions: ["geolocation"],
      colorScheme: "light",
      timezoneId: "Asia/Taipei",
      javaScriptEnabled: true,
      extraHTTPHeaders: {
        "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Cache-Control": "max-age=0",
        Connection: "keep-alive",
      },
    });

    // Create and configure page
    page = await context.newPage();
    page.setDefaultNavigationTimeout(600000);

    // Add event listeners for potential errors
    page.on("response", async (response) => {
      const status = response.status();
      if (status >= 400) {
        console.log(`Response error: ${status} for ${response.url()}`);
      }
    });

    console.log("Navigating to Shopee homepage first...");
    // Start with the homepage to get cookies set up
    await page.goto("https://shopee.tw/", {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    await delay(3000 + Math.random() * 2000);

    // Handle any popups or consent banners that might appear
    try {
      const closeButtons = await page.$$(
        'button:has-text("Close"), button:has-text("關閉"), button:has-text("x"), [aria-label="Close"]'
      );
      if (closeButtons.length > 0) {
        await closeButtons[0].click();
        console.log("Closed popup/banner");
        await delay(1000);
      }
    } catch (error) {
      console.log("No popups found or error handling popup:", error.message);
    }

    // Perform a more human-like interaction
    console.log("Simulating human-like browsing behavior...");
    await page.mouse.move(Math.random() * 500, Math.random() * 500, {
      steps: 20,
    });
    await delay(1000 + Math.random() * 1000);

    // Realistic scrolling pattern
    for (let i = 0; i < 2; i++) {
      await page.mouse.wheel(0, Math.floor(100 + Math.random() * 200));
      await delay(1000 + Math.random() * 1500);
    }

    // Now perform the search
    console.log(`Searching for: ${randomSearchTerm}`);
    await page.goto(
      `https://shopee.tw/search?keyword=${encodeURIComponent(
        randomSearchTerm
      )}`,
      {
        waitUntil: "networkidle",
        timeout: 60000,
      }
    );

    await delay(5000 + Math.random() * 3000);

    // Check if we're being detected as a bot (look for CAPTCHA or verification)
    const pageContent = await page.content();
    if (
      pageContent.includes("captcha") ||
      pageContent.includes("verification") ||
      pageContent.includes("robot") ||
      pageContent.includes("驗證")
    ) {
      console.log("Bot detection encountered! Pausing for inspection...");
      await browser.pause(); // Allow manual intervention
      return;
    }

    // More realistic browsing behavior
    console.log("Browsing product listings...");
    await page.mouse.move(Math.random() * 500, Math.random() * 500, {
      steps: 20,
    });
    await delay(1000 + Math.random() * 1000);

    // Realistic scrolling pattern
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, Math.floor(200 + Math.random() * 300));
      await delay(2000 + Math.random() * 1500);
    }

    // Check if products are loaded
    console.log("Waiting for product listings to load...");
    try {
      await page.waitForSelector(".shopee-search-item-result__item", {
        timeout: 30000,
      });
    } catch (error) {
      console.log("Could not find product listings:", error.message);
      console.log("Page content:", await page.content());
      await browser.pause();
      return;
    }

    // Hover over some products before clicking
    const items = await page.$$(".shopee-search-item-result__item");
    console.log(`Found ${items.length} product items`);

    if (items.length > 0) {
      const randomIndexes = [
        Math.floor(Math.random() * items.length),
        Math.floor(Math.random() * items.length),
      ];

      for (const idx of randomIndexes) {
        console.log(`Hovering over product ${idx}`);
        await items[idx].hover();
        await delay(1000 + Math.random() * 2000);
      }
    } else {
      console.log("No product items found!");
      await browser.pause();
      return;
    }

    // Get product links
    console.log("Extracting product links...");
    const productLinks = await page.$$eval(
      ".shopee-search-item-result__item a",
      (links) => links.map((link) => link.href)
    );

    if (productLinks.length === 0) {
      console.log("Failed to find product links!");
      await browser.pause();
      return;
    }

    console.log(`Found ${productLinks.length} product links`);
    const selectedProductLink =
      productLinks[Math.floor(Math.random() * productLinks.length)];
    console.log(`Navigating to product: ${selectedProductLink}`);

    // Go to product detail page
    await page.goto(selectedProductLink, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    await delay(3000 + Math.random() * 2000);

    // Interact with the product page
    console.log("Interacting with product page...");
    for (let i = 0; i < 4; i++) {
      await page.mouse.wheel(0, Math.floor(200 + Math.random() * 300));
      await delay(1500 + Math.random() * 2000);
    }

    // Get product details
    console.log("Extracting product details...");
    const productTitle = await page
      .textContent("div.YPqix5", { timeout: 5000 })
      .catch(() => "Title not found");
    console.log(`Product title: ${productTitle}`);

    const htmlContent = await page.content();
    console.log("Successfully retrieved product page content!");

    // Save a screenshot for debugging
    await page.screenshot({ path: "shopee-product.png" });
    console.log("Screenshot saved as shopee-product.png");

    await browser.pause();
  } catch (error) {
    console.error("An error occurred:", error);
    console.error("Stack trace:", error.stack);

    // Try to gather debugging information
    if (error.message.includes("ERR_HTTP_RESPONSE_CODE_FAILURE")) {
      console.log("Server returned an error status code. This could indicate:");
      console.log("1. IP/proxy is being blocked");
      console.log("2. Bot detection triggered");
      console.log("3. Geolocation restrictions");
    }

    try {
      if (typeof page !== "undefined" && page !== null) {
        await page.screenshot({ path: "error-screenshot.png" });
        console.log("Error screenshot saved as error-screenshot.png");
      }
    } catch (screenshotError) {
      console.log("Could not take error screenshot:", screenshotError.message);
    }

    try {
      if (typeof browser !== "undefined" && browser !== null) {
        await browser.pause();
      }
    } catch (pauseError) {
      console.log("Could not pause browser:", pauseError.message);
    }
  }
};

test();
