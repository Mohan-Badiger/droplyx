import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// IMPORTANT: Enable Stealth Plugin to avoid bots block mechanism
puppeteer.use(StealthPlugin());

async function getBrowser() {
  // 1. Connect to remote browser if endpoint is configured (e.g. Browserless / BrightData)
  const remoteEndpoint = process.env.BROWSER_WS_ENDPOINT || process.env.BROWSERLESS_URL;
  if (remoteEndpoint) {
    return await puppeteer.connect({
      browserWSEndpoint: remoteEndpoint,
    });
  }

  // 2. Production memory-optimized Chromium flags
  const args = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage", // Solves /dev/shm small shared memory crashes on Linux/Docker
    "--disable-accelerated-2d-canvas",
    "--disable-gpu",
    "--no-first-run",
    "--no-zygote",
    "--single-process", // Substantially reduces RAM usage in small containers
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-sync",
    "--mute-audio",
  ];

  const launchOptions = {
    headless: true,
    args,
  };

  // Support custom Chromium binary path if provided in environment (e.g., on Linux VPS / Docker)
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  return await puppeteer.launch(launchOptions);
}

export async function scrapeProductUrl(url) {
  if (!url) return null;

  let platform = "Unknown";
  if (url.includes("amazon.in") || url.includes("amazon.com")) platform = "Amazon";
  else if (url.includes("flipkart.com")) platform = "Flipkart";
  else if (url.includes("meesho.com")) platform = "Meesho";
  else if (url.includes("ajio.com")) platform = "Ajio";
  else if (url.includes("reliancedigital.in")) platform = "Reliance Digital";

  let browser;
  try {
    browser = await getBrowser();
  } catch (launchErr) {
    console.error("Puppeteer Launch Error:", launchErr.message);
    throw new Error(`Failed to launch browser: ${launchErr.message}`);
  }

  try {
    const page = await browser.newPage();
    
    // Set moderate viewport to minimize canvas framebuffer memory
    await page.setViewport({ width: 1280, height: 800 });

    // Abort heavy assets (images, fonts, media) to slash memory consumption and eliminate timeouts.
    // HTML metadata and JSON-LD attributes still remain intact.
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      if (resourceType === "image" || resourceType === "media" || resourceType === "font") {
        req.abort();
      } else {
        req.continue();
      }
    });

    const isSensitive = platform === "Ajio" || platform === "Meesho";
    
    const desktopUAs = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    ];
    const mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";
    
    await page.setUserAgent(isSensitive ? mobileUA : desktopUAs[Math.floor(Math.random() * desktopUAs.length)]);
    
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://www.google.com/",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    });

    if (isSensitive) {
      await new Promise(r => setTimeout(r, 600));
    }
    
    // Adaptive timeout (default 25s instead of 60s) and domcontentloaded to prevent 504 timeouts
    const scrapeTimeout = parseInt(process.env.SCRAPE_TIMEOUT_MS, 10) || 25000;
    await page.goto(url, { 
      waitUntil: "domcontentloaded", 
      timeout: scrapeTimeout 
    });
    
    let titleText = "";
    let priceNumber = 0;
    let imageUrlText = "";

    if (platform === "Amazon") {
      titleText = await page.$eval("#productTitle", (el) => el.innerText.trim()).catch(() => "");
      const priceText = await page.$eval(".a-price-whole", (el) => el.innerText.trim()).catch(() => "");
      priceNumber = parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 0;
      imageUrlText = await page.$eval("#landingImage", (el) => el.src).catch(() => "");
      
      if (!titleText || !priceNumber) {
        throw new Error("Amazon Scrape Error: Title or Price not found.");
      }
    } 
    else if (platform === "Flipkart") {
      // 1. Close login popup if it appears (Flipkart often overlays this)
      try {
        await page.click("button._2KpZ6l._2doB4z");
        await new Promise(r => setTimeout(r, 1000));
      } catch (e) {}

      // 2. Instead of brittle CSS classes, use structured JSON-LD data!
      try {
        const jsonLdData = await page.evaluate(() => {
          const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
          for (let script of scripts) {
            try {
              const parsed = JSON.parse(script.innerText);
              const data = Array.isArray(parsed) ? parsed[0] : parsed;
              
              if (data && (data["@type"] === "Product" || data.name)) {
                return {
                  title: data.name,
                  price: data.offers ? data.offers.price : null,
                  image: data.image ? (Array.isArray(data.image) ? data.image[0] : data.image) : null
                };
              }
            } catch (err) {
              // Ignore malformed JSON
            }
          }
          return null;
        });

        if (jsonLdData && jsonLdData.title && jsonLdData.price) {
          titleText = jsonLdData.title;
          priceNumber = Number(jsonLdData.price);
          imageUrlText = jsonLdData.image || "";
        } else {
          throw new Error("JSON-LD not found or incomplete");
        }
      } catch (e) {
        // Fallback to basic selectors if JSON-LD parsing completely fails
        try {
          await page.waitForSelector("span.B_NuCI, span.VU-Tz5", { timeout: 5000 });
          titleText = await page.$eval("span.B_NuCI, span.VU-Tz5", el => el.innerText.trim());
        } catch {
          throw new Error("Title not found");
        }

        try {
          const priceText = await page.$eval("div._30jeq3._16Jk6d, div._30jeq3, div.Nx9bqj.CxhGGd", el => el.innerText);
          priceNumber = parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 0;
        } catch {
          throw new Error("Price not found");
        }

        imageUrlText = await page.$eval("img._396cs4, img.v20164, img.DByuf4", el => el.src).catch(() => "");
      }
    }
    else if (platform === "Meesho") {
      titleText = await page.title();
      imageUrlText = await page.$eval("meta[property='og:image']", el => el.content).catch(() => "");
      try {
        const priceText = await page.$eval("h4, [class*='PriceRow'], .Text__StyledText-sc-oo0kvp-0", el => el.innerText);
        priceNumber = parseInt((priceText || "").replace(/[^0-9]/g, ""), 10) || 0;
      } catch {
        // Leave as 0 if not found
      }
    }
    else if (platform === "Ajio") {
      try {
        await page.waitForSelector(".prod-name", { timeout: 4000 });
        titleText = await page.$eval(".prod-name", el => el.innerText.trim()).catch(() => page.title());
        const priceText = await page.$eval(".prod-sp", el => el.innerText.trim()).catch(() => "");
        priceNumber = parseInt((priceText || "").replace(/[^0-9]/g, ""), 10) || 0;
        imageUrlText = await page.$eval("img.rilrtl-lazy-img, meta[property='og:image']", el => el.src || el.content).catch(() => "");
      } catch {
        titleText = await page.title();
      }
    }
    else if (platform === "Reliance Digital" || platform === "Unknown") {
      // Try universal extraction for Reliance or any other site
      const universalData = await page.evaluate(() => {
        const results = { title: "", price: 0, imageUrl: "" };
        
        // 1. Try JSON-LD
        const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        for (let script of jsonLdScripts) {
          try {
            const data = JSON.parse(script.innerText);
            
            // Helper to recursively find Product or ProductGroup
            const findProduct = (obj) => {
              if (!obj || typeof obj !== 'object') return null;
              if (obj["@type"] === "Product" || obj["@type"] === "ProductGroup") return obj;
              if (Array.isArray(obj)) {
                for (let item of obj) {
                  const found = findProduct(item);
                  if (found) return found;
                }
              }
              for (let key in obj) {
                const found = findProduct(obj[key]);
                if (found) return found;
              }
              return null;
            };

            const product = findProduct(data);
            
            if (product) {
              results.title = product.name || results.title;
              const img = product.image || product.thumbnailUrl;
              results.imageUrl = (Array.isArray(img) ? img[0] : img) || results.imageUrl;
              
              const offerData = product.offers || (product.hasVariant ? product.hasVariant[0].offers : null);
              if (offerData) {
                const offers = Array.isArray(offerData) ? offerData[0] : offerData;
                results.price = parseFloat(offers.price || offers.lowPrice) || results.price;
              }
            }
          } catch (e) {}
        }

        // 2. Try Meta Tags (OG, Twitter)
        if (!results.title) results.title = document.querySelector('meta[property="og:title"]')?.content || document.querySelector('meta[name="twitter:title"]')?.content || document.title;
        if (!results.imageUrl) results.imageUrl = document.querySelector('meta[property="og:image"]')?.content || document.querySelector('meta[name="twitter:image"]')?.content;
        
        // 3. Try Price Meta Tags
        if (!results.price) {
          const priceMeta = document.querySelector('meta[property="product:price:amount"]') || document.querySelector('meta[property="og:price:amount"]');
          if (priceMeta) results.price = parseFloat(priceMeta.content);
        }

        return results;
      });

      titleText = universalData.title;
      priceNumber = universalData.price;
      imageUrlText = universalData.imageUrl;
      
      // Heuristic fallback for price if still missing
      if (!priceNumber) {
        const bodyText = await page.evaluate(() => document.body.innerText);
        const priceMatch = bodyText.match(/(?:₹|Rs\.?)\s?([\d,]+)/);
        if (priceMatch) priceNumber = parseInt(priceMatch[1].replace(/,/g, ""), 10);
      }
    }

    if (titleText.toLowerCase().includes("access denied") || titleText.toLowerCase().includes("security check") || titleText.toLowerCase().includes("captcha") || titleText.toLowerCase().includes("blocked")) {
      throw new Error(`Store blocked request (Access Denied / Captcha). Title received: ${titleText}`);
    }

    return {
      title: titleText,
      currentPrice: priceNumber,
      imageUrl: imageUrlText,
      platform,
    };
  } catch (error) {
    console.error(`Flipkart/Amazon Scrape Error:`, error.message);
    throw new Error(
      `Failed to scrape ${platform}. Possible bot detection or selector issue: ${error.message}`
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.warn("Error closing browser:", closeErr.message);
      }
    }
  }
}
